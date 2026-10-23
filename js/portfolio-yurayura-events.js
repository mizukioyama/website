(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PortfolioYurayuraEvents = api;
  if (typeof document !== "undefined") api.start(document, root);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const REMOTE_DATA_URL = "https://mizukioyama.github.io/yurayura/assets/data/exhibitions.json";
  const YURAYURA_HOME_URL = "https://mizukioyama.github.io/yurayura/";
  const OFFICIAL_PATH = "/yurayura/";
  const PORTFOLIO_PATH = "/website/exhibitions/yurayura/";
  const ALLOWED_FIELDS = new Set([
    "id", "edition", "published", "city", "venue", "startsAt", "endsAt", "officialUrl",
    "portfolioDetailUrl", "galleryUrl", "artists", "artworkCount", "copy", "recruitment"
  ]);

  function instant(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return NaN;
    const [year, month, day, hour, minute, second] = value.slice(0, 19).split(/\D/).map(Number);
    const days = [31, year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month < 1 || month > 12 || day < 1 || day > days[month - 1] || hour > 23 || minute > 59 || second > 59) return NaN;
    return Date.parse(value);
  }

  function eventState(event, now) {
    if (!event || event.published !== true) return "unpublished";
    if (event.startsAt === null && event.endsAt === null) return "undated";
    const start = instant(event.startsAt), end = instant(event.endsAt);
    if (!Number.isFinite(now) || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return "unknown";
    return now < start ? "upcoming" : now < end ? "current" : "past";
  }

  function isSiteUrl(value, pathPrefix) {
    if (typeof value !== "string") return false;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "mizukioyama.github.io" && !url.port
        && !url.username && !url.password && url.pathname.startsWith(pathPrefix);
    } catch (_) { return false; }
  }

  function validateCopy(copy) {
    const keys = value => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value).sort().join(",") : "";
    if (keys(copy) !== "portfolio,yurayura") throw new Error("Unexpected exhibition copy fields");
    for (const site of ["yurayura", "portfolio"]) {
      if (keys(copy[site]) !== "en,ja") throw new Error(`Unexpected ${site} copy fields`);
      for (const language of ["ja", "en"]) {
        if (typeof copy?.[site]?.[language] !== "string" || !copy[site][language].trim() || copy[site][language].length > 4000) {
          throw new Error(`Missing or invalid ${site}.${language} copy`);
        }
      }
    }
    return {
      yurayura: { ja: copy.yurayura.ja, en: copy.yurayura.en },
      portfolio: { ja: copy.portfolio.ja, en: copy.portfolio.en }
    };
  }

  function normalizeEvents(payload) {
    if (!Array.isArray(payload)) throw new Error("Invalid exhibition feed");
    const visible = payload.filter(event => event?.published === true);
    const ids = new Set(), editions = new Set();
    return visible.map(event => {
      if (!event || Object.keys(event).some(key => !ALLOWED_FIELDS.has(key))) throw new Error("Unexpected exhibition fields");
      const nullableText = value => value === null || (typeof value === "string" && !!value.trim());
      if (!/^[a-z0-9-]+$/.test(event.id) || ids.has(event.id)
        || !Number.isInteger(event.edition) || event.edition < 1 || editions.has(event.edition)
        || !Object.prototype.hasOwnProperty.call(event, "city") || !nullableText(event.city)
        || !Object.prototype.hasOwnProperty.call(event, "venue") || !nullableText(event.venue)
        || !isSiteUrl(event.officialUrl, OFFICIAL_PATH)
        || eventState(event, Date.now()) === "unknown") throw new Error("Invalid published exhibition");
      ids.add(event.id); editions.add(event.edition);
      const copy = validateCopy(event.copy);
      const row = {
        id: event.id, edition: event.edition, published: true, city: event.city, venue: event.venue,
        startsAt: event.startsAt, endsAt: event.endsAt, officialUrl: event.officialUrl, copy
      };
      if (event.portfolioDetailUrl !== undefined) {
        if (!isSiteUrl(event.portfolioDetailUrl, PORTFOLIO_PATH)) throw new Error("Invalid Portfolio detail URL");
        row.portfolioDetailUrl = event.portfolioDetailUrl;
      }
      if (event.galleryUrl !== undefined) {
        if (typeof event.galleryUrl !== "string" || !/^\.\/[a-z0-9-]+\.html$/.test(event.galleryUrl)) throw new Error("Invalid gallery URL");
        row.galleryUrl = event.galleryUrl;
      }
      if (event.artists !== undefined) {
        if (!Array.isArray(event.artists) || event.artists.some(name => typeof name !== "string" || !name.trim())) throw new Error("Invalid artists");
        row.artists = event.artists.slice();
      }
      if (event.artworkCount !== undefined) {
        if (!Number.isInteger(event.artworkCount) || event.artworkCount < 0) throw new Error("Invalid artwork count");
        row.artworkCount = event.artworkCount;
      }
      return row;
    });
  }

  function groupEvents(events, now) {
    const groups = { current: [], upcoming: [], past: [] };
    for (const event of normalizeEvents(events)) {
      const state = eventState(event, now);
      if (state === "current") groups.current.push(event);
      else if (state === "upcoming" || state === "undated") groups.upcoming.push(event);
      else if (state === "past") groups.past.push(event);
    }
    const start = event => Number.isFinite(instant(event.startsAt)) ? instant(event.startsAt) : Infinity;
    groups.current.sort((a, b) => start(a) - start(b) || a.edition - b.edition);
    groups.upcoming.sort((a, b) => start(a) - start(b) || a.edition - b.edition);
    groups.past.sort((a, b) => start(b) - start(a) || b.edition - a.edition);
    return groups;
  }

  function buildFeedUrl(locationLike, now) {
    if (locationLike && ["localhost", "127.0.0.1"].includes(locationLike.hostname)) {
      return new URL("/website/__preview/yurayura-events.json", locationLike.origin).toString();
    }
    const url = new URL(REMOTE_DATA_URL);
    url.searchParams.set("v", String(Math.floor(now / 60000)));
    return url.toString();
  }

  async function loadEvents(fetchImpl, locationLike, now) {
    const response = await fetchImpl(buildFeedUrl(locationLike, now), {
      mode: "cors", credentials: "omit", cache: "no-store"
    });
    if (!response || !response.ok) throw new Error("Exhibition feed request failed");
    return normalizeEvents(await response.json());
  }

  function textElement(documentRef, tag, value) {
    const element = documentRef.createElement(tag);
    element.textContent = value;
    return element;
  }

  function localizedElement(documentRef, tag, ja, en) {
    const element = documentRef.createElement(tag);
    const japanese = textElement(documentRef, "span", ja);
    japanese.lang = "ja";
    const english = textElement(documentRef, "span", en);
    english.lang = "en";
    element.append(japanese, english);
    return element;
  }

  function eventDate(value, language) {
    if (value === null) return language === "ja" ? "開催日未定" : "Dates to be announced";
    return new Intl.DateTimeFormat(language === "en" ? "en" : "ja-JP", {
      timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric"
    }).format(new Date(value));
  }

  function dateRange(event, language) {
    if (event.startsAt === null) return eventDate(null, language);
    return `${eventDate(event.startsAt, language)} – ${eventDate(event.endsAt, language)} (${language === "ja" ? "日本時間" : "JST"})`;
  }

  function placeText(event, language) {
    const city = event.city || (language === "ja" ? "開催地未定" : "Location to be announced");
    const venue = event.venue || (language === "ja" ? "会場未定" : "Venue to be announced");
    return language === "ja" ? `${city} / ${venue}` : `${city} / ${venue}`;
  }

  function stateCopy(state) {
    return {
      current: { ja: "開催中", en: "Current" },
      upcoming: { ja: "開催予定", en: "Upcoming" },
      undated: { ja: "日程未定", en: "Not scheduled" },
      past: { ja: "開催終了", en: "Concluded" }
    }[state];
  }

  function statusLine(documentRef, event, state) {
    const status = stateCopy(state);
    const paragraph = documentRef.createElement("p");
    paragraph.className = "status";
    paragraph.dataset.eventState = state;
    paragraph.append(localizedElement(documentRef, "span", status.ja, status.en));
    return paragraph;
  }

  function appendLinks(documentRef, cell, event) {
    const details = documentRef.createElement("p");
    const detail = textElement(documentRef, "a", "展示詳細を見る");
    detail.className = "noise info-link";
    detail.href = event.officialUrl;
    detail.target = "_blank";
    detail.rel = "noopener noreferrer";
    detail.lang = "ja";
    const detailEn = textElement(documentRef, "a", "View exhibition details");
    detailEn.className = "noise info-link";
    detailEn.href = event.officialUrl;
    detailEn.target = "_blank";
    detailEn.rel = "noopener noreferrer";
    detailEn.lang = "en";
    details.append(detail, detailEn);
    cell.append(details);

    const official = documentRef.createElement("p");
    const home = textElement(documentRef, "a", "ゆらゆら公式サイト");
    home.className = "noise info-link";
    home.href = YURAYURA_HOME_URL;
    home.target = "_blank";
    home.rel = "noopener noreferrer";
    home.lang = "ja";
    const homeEn = textElement(documentRef, "a", "Yurayura official website");
    homeEn.className = "noise info-link";
    homeEn.href = YURAYURA_HOME_URL;
    homeEn.target = "_blank";
    homeEn.rel = "noopener noreferrer";
    homeEn.lang = "en";
    official.append(home, homeEn);
    cell.append(official);

    if (event.portfolioDetailUrl) {
      const archive = documentRef.createElement("p");
      const portfolioJa = textElement(documentRef, "a", "Portfolioの展示記録");
      portfolioJa.className = "noise info-link";
      portfolioJa.href = event.portfolioDetailUrl;
      portfolioJa.lang = "ja";
      const portfolioEn = textElement(documentRef, "a", "Portfolio exhibition record");
      portfolioEn.className = "noise info-link";
      portfolioEn.href = event.portfolioDetailUrl;
      portfolioEn.lang = "en";
      archive.append(portfolioJa, portfolioEn);
      cell.append(archive);
    }
  }

  function eventRow(documentRef, event, state, language) {
    const row = documentRef.createElement("tr");
    const year = documentRef.createElement("td");
    year.className = "year";
    if (event.startsAt === null) {
      year.append(localizedElement(documentRef, "span", "日程未定", "Dates TBA"));
    } else {
      year.textContent = new Intl.DateTimeFormat("ja-JP", {
        timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit"
      }).format(new Date(event.startsAt)).replace("/", ".").replace("/", ".");
    }
    const content = documentRef.createElement("td");
    content.className = "tb-content";
    content.append(statusLine(documentRef, event, state));
    const editionJa = `第${event.edition}回 グループ展「ゆらゆら」`;
    const editionEn = `Edition ${event.edition} · Group Exhibition “Yurayura”`;
    content.append(localizedElement(documentRef, "span", editionJa, editionEn));
    content.append(localizedElement(documentRef, "span", event.copy.portfolio.ja, event.copy.portfolio.en));
    content.append(localizedElement(documentRef, "span", dateRange(event, "ja"), dateRange(event, "en")));
    content.append(localizedElement(documentRef, "span", placeText(event, "ja"), placeText(event, "en")));
    if (event.artists && event.artists.length) {
      const names = event.artists.join("、");
      content.append(localizedElement(documentRef, "span", `参加作家：${names}`, `Artists: ${event.artists.join(", ")}`));
    }
    if (Number.isInteger(event.artworkCount)) {
      content.append(localizedElement(documentRef, "span", `${event.artworkCount}作品`, `${event.artworkCount} works`));
    }
    appendLinks(documentRef, content, event);
    row.append(year, content);
    return row;
  }

  function applyLanguage(documentRef, language) {
    const selected = language === "en" ? "en" : "ja";
    documentRef.querySelectorAll('[data-yurayura-feed] [lang="ja"],[data-yurayura-feed] [lang="en"],[data-yurayura-past-events] [lang="ja"],[data-yurayura-past-events] [lang="en"]').forEach(element => {
      element.style.display = element.lang === selected ? (element.tagName === "SPAN" ? "" : "block") : "none";
    });
  }

  function start(documentRef, windowRef) {
    const feed = documentRef.querySelector("[data-yurayura-feed]");
    if (!feed || feed.dataset.started === "true") return;
    feed.dataset.started = "true";
    const statusNodes = Array.from(feed.querySelectorAll("[data-yurayura-feed-status]"));
    const results = feed.querySelector("[data-yurayura-feed-results]");
    const currentSection = feed.querySelector("[data-yurayura-current-section]");
    const upcomingSection = feed.querySelector("[data-yurayura-upcoming-section]");
    const currentBody = feed.querySelector("[data-yurayura-current-events]");
    const upcomingBody = feed.querySelector("[data-yurayura-upcoming-events]");
    const pastBody = documentRef.querySelector("[data-yurayura-past-events]");
    const statusText = {
      empty: { ja: "現在、開催が確定している展示の告知はありません。", en: "There are currently no confirmed upcoming exhibitions to announce." },
      error: { ja: "最新の開催情報を取得できませんでした。開催予定の有無は確認できません。時間をおいて再読み込みしてください。", en: "The latest exhibition information could not be loaded. Please reload later to check the current schedule." }
    };
    const showMessage = (message, error) => {
      if (results) results.hidden = true;
      if (currentSection) currentSection.hidden = true;
      if (upcomingSection) upcomingSection.hidden = true;
      statusNodes.forEach(node => {
        node.textContent = message[node.lang] || message.ja;
        node.hidden = false;
      });
      feed.dataset.state = error ? "error" : "ready";
    };

    (async () => {
      try {
        const events = await loadEvents(windowRef.fetch.bind(windowRef), windowRef.location, Date.now());
        const now = Date.now();
        const groups = groupEvents(events, now);
        const futureOrCurrent = groups.current.length + groups.upcoming.length > 0;
        currentBody.replaceChildren(...groups.current.map(event => eventRow(documentRef, event, "current", windowRef.getPortfolioLanguage?.() || "ja")));
        upcomingBody.replaceChildren(...groups.upcoming.map(event => eventRow(documentRef, event, eventState(event, now), windowRef.getPortfolioLanguage?.() || "ja")));
        const retainedPast = groups.past.filter(event => event.id !== "yurayura-01" && event.edition !== 1);
        if (pastBody) pastBody.replaceChildren(...retainedPast.map(event => eventRow(documentRef, event, "past", windowRef.getPortfolioLanguage?.() || "ja")));
        currentSection.hidden = groups.current.length === 0;
        upcomingSection.hidden = groups.upcoming.length === 0;
        results.hidden = !futureOrCurrent;
        if (futureOrCurrent) {
          statusNodes.forEach(node => { node.hidden = true; });
          feed.dataset.state = "ready";
        } else {
          showMessage(statusText.empty, false);
        }
        applyLanguage(documentRef, windowRef.getPortfolioLanguage?.() || documentRef.documentElement.lang);
      } catch (_) {
        showMessage(statusText.error, true);

      }
    })();

    documentRef.addEventListener("portfolio:languagechange", event => applyLanguage(documentRef, event.detail?.language));
  }

  return { instant, eventState, isSiteUrl, normalizeEvents, groupEvents, buildFeedUrl, loadEvents, start };
});
