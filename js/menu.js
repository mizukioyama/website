const SITE_ROOT_URL = (() => {
  const scriptUrl = document.currentScript?.src;
  return scriptUrl ? new URL("../", scriptUrl) : new URL("./", document.baseURI);
})();

const siteHref = path => new URL(path, SITE_ROOT_URL).href;

// BEGIN GENERATED HEADER_MARKUP — source: src/components/header.html
const HEADER_MARKUP = `
<header>
  <!-- Curved bar background (inline SVG; CSS only positions it).
       The inset shadow is clipped to the bar shape inside the
       filter, so no shadow spills onto the page. -->
  <svg class="header-bar" viewBox="0 0 1440 118" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id="hdrClip"><path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z"/></clipPath>
      <mask id="hdrBandD1">
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#ffffff"/>
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#000000" transform="translate(0 -10)"/>
      </mask>
      <mask id="hdrBandD2">
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#ffffff"/>
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#000000" transform="translate(0 -24)"/>
      </mask>
      <mask id="hdrBandL1">
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#ffffff"/>
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#000000" transform="translate(0 -8)"/>
      </mask>
      <mask id="hdrBandL2">
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#ffffff"/>
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#000000" transform="translate(0 -18)"/>
      </mask>
    </defs>
    <!-- The base fill stays unfiltered and crisp; the inset
         shadow is a separate masked band along the curve,
         blurred on its own and clipped inside the bar. -->
    <g class="header-bar-dark">
      <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#222527"/>
      <g clip-path="url(#hdrClip)">
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#000000" opacity="0.22" mask="url(#hdrBandD2)" style="filter: blur(8px)"/>
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#000000" opacity="0.60" mask="url(#hdrBandD1)" style="filter: blur(4px)"/>
      </g>
    </g>
    <g class="header-bar-light">
      <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#e1e1dc"/>
      <g clip-path="url(#hdrClip)">
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#000000" opacity="0.12" mask="url(#hdrBandL2)" style="filter: blur(7px)"/>
        <path d="M0 0H1440V72H612C505 72 472 118 336 118H0Z" fill="#000000" opacity="0.30" mask="url(#hdrBandL1)" style="filter: blur(3px)"/>
      </g>
    </g>
  </svg>
  <!-- Site frame (PC only; CSS in menu.css shows it at
       >=1024px and hides the top bar there). A thin frame
       around the whole viewport; the top-left rectangle wraps
       the brand and language switch, and a rectangle on the
       right wraps the global menu. The frame is a flat fill;
       its shadow is a CSS drop-shadow on the SVG element
       (menu.css), which follows the inner contour with a
       uniform screen-space blur. (The previous in-SVG
       blurred strokes stretched unevenly with the viewport
       and looked blotchy.) -->
  <svg class="site-frame" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <g class="frame-dark">
      <path fill-rule="evenodd" fill="#222527" d="M0 0H1440V900H0Z M1408.0 876.0L1410.1 875.7L1412.0 874.9L1413.7 873.7L1414.9 872.0L1415.7 870.1L1416.0 868.0L1416.0 826.0L1415.0 818.2L1412.0 811.0L1407.2 804.8L1401.0 800.0L1393.8 797.0L1386.0 796.0L1390.0 796.0L1379.6 794.6L1370.0 790.6L1361.7 784.3L1355.4 776.0L1351.4 766.4L1350.0 756.0L1350.0 64.0L1348.6 53.6L1344.6 44.0L1338.3 35.7L1330.0 29.4L1320.4 25.4L1310.0 24.0L38.0 24.0L34.4 24.5L31.0 25.9L28.1 28.1L25.9 31.0L24.5 34.4L24.0 38.0L24.0 706.0L25.0 713.8L28.0 721.0L32.8 727.2L39.0 732.0L46.2 735.0L54.0 736.0L50.0 736.0L60.4 737.4L70.0 741.4L78.3 747.7L84.6 756.0L88.6 765.6L90.0 776.0L90.0 836.0L91.4 846.4L95.4 856.0L101.7 864.3L110.0 870.6L119.6 874.6L130.0 876.0Z"/>
    </g>
    <g class="frame-light">
      <path fill-rule="evenodd" fill="#e1e1dc" d="M0 0H1440V900H0Z M1408.0 876.0L1410.1 875.7L1412.0 874.9L1413.7 873.7L1414.9 872.0L1415.7 870.1L1416.0 868.0L1416.0 826.0L1415.0 818.2L1412.0 811.0L1407.2 804.8L1401.0 800.0L1393.8 797.0L1386.0 796.0L1390.0 796.0L1379.6 794.6L1370.0 790.6L1361.7 784.3L1355.4 776.0L1351.4 766.4L1350.0 756.0L1350.0 64.0L1348.6 53.6L1344.6 44.0L1338.3 35.7L1330.0 29.4L1320.4 25.4L1310.0 24.0L38.0 24.0L34.4 24.5L31.0 25.9L28.1 28.1L25.9 31.0L24.5 34.4L24.0 38.0L24.0 706.0L25.0 713.8L28.0 721.0L32.8 727.2L39.0 732.0L46.2 735.0L54.0 736.0L50.0 736.0L60.4 737.4L70.0 741.4L78.3 747.7L84.6 756.0L88.6 765.6L90.0 776.0L90.0 836.0L91.4 846.4L95.4 856.0L101.7 864.3L110.0 870.6L119.6 874.6L130.0 876.0Z"/>
    </g>
  </svg>
  <!-- Site frame for small screens (under 768px; shown by
       css/menu.css in place of .site-frame). The same ratios
       as the PC frame (edge, top-left rectangle and right
       band all scale from the 1440x900 geometry), drawn in a
       390x844 space so the corner arcs stay circular instead
       of stretching into ellipses; the band step corners use
       smaller radii because the step edge is only ~14px. -->
  <svg class="site-frame-sp" viewBox="0 0 390 844" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <g class="frame-dark">
      <path fill-rule="evenodd" fill="#222527" d="M0 0H390V844H0Z M375.5 821.5L377.6 821.2L379.5 820.4L381.2 819.2L382.4 817.5L383.2 815.6L383.5 813.5L383.5 754.5L383.2 752.4L382.4 750.5L381.2 748.8L379.5 747.6L377.6 746.8L375.5 746.5L376.6 746.5L373.8 746.1L371.1 745.0L368.8 743.3L367.1 741.0L366.0 738.3L365.6 735.5L365.6 33.5L365.2 30.7L364.1 28.0L362.4 25.7L360.1 24.0L357.4 22.9L354.6 22.5L20.5 22.5L16.9 23.0L13.5 24.4L10.6 26.6L8.4 29.5L7.0 32.9L6.5 36.5L6.5 682.2L6.8 684.3L7.6 686.2L8.8 687.9L10.5 689.1L12.4 689.9L14.5 690.2L13.4 690.2L16.2 690.6L18.9 691.7L21.2 693.4L22.9 695.7L24.0 698.4L24.4 701.2L24.4 810.5L24.8 813.3L25.9 816.0L27.6 818.3L29.9 820.0L32.6 821.1L35.4 821.5Z"/>
    </g>
    <g class="frame-light">
      <path fill-rule="evenodd" fill="#e1e1dc" d="M0 0H390V844H0Z M375.5 821.5L377.6 821.2L379.5 820.4L381.2 819.2L382.4 817.5L383.2 815.6L383.5 813.5L383.5 754.5L383.2 752.4L382.4 750.5L381.2 748.8L379.5 747.6L377.6 746.8L375.5 746.5L376.6 746.5L373.8 746.1L371.1 745.0L368.8 743.3L367.1 741.0L366.0 738.3L365.6 735.5L365.6 33.5L365.2 30.7L364.1 28.0L362.4 25.7L360.1 24.0L357.4 22.9L354.6 22.5L20.5 22.5L16.9 23.0L13.5 24.4L10.6 26.6L8.4 29.5L7.0 32.9L6.5 36.5L6.5 682.2L6.8 684.3L7.6 686.2L8.8 687.9L10.5 689.1L12.4 689.9L14.5 690.2L13.4 690.2L16.2 690.6L18.9 691.7L21.2 693.4L22.9 695.7L24.0 698.4L24.4 701.2L24.4 810.5L24.8 813.3L25.9 816.0L27.6 818.3L29.9 820.0L32.6 821.1L35.4 821.5Z"/>
    </g>
  </svg>
  <div class="header-inner">

  <!-- Nav -->
  <div id="navArea">
    <nav id="primary-navigation" aria-label="Primary navigation">
      <div class="inner">
        <ul>
          <li><a href="${siteHref("")}" class="noise"><span class="nav-initial" aria-hidden="true">T</span><span class="nav-label">Top</span></a></li>
          <li><a href="${siteHref("gallery.html")}" class="noise"><span class="nav-initial" aria-hidden="true">A</span><span class="nav-label">Art Index</span></a></li>
          <li><a href="${siteHref("biography.html")}" class="noise"><span class="nav-initial" aria-hidden="true">B</span><span class="nav-label">Biography</span></a></li>
          <li><a href="${siteHref("artist-statement.html")}" class="noise"><span class="nav-initial" aria-hidden="true">S</span><span class="nav-label">Artist Statement</span></a></li>
          <li><a href="${siteHref("order.html")}" class="noise"><span class="nav-initial" aria-hidden="true">O</span><span class="nav-label">Order</span></a></li>
          <li><a href="${siteHref("contact.html")}" class="noise"><span class="nav-initial" aria-hidden="true">C</span><span class="nav-label">Contact</span></a></li>
        </ul>
      </div>
      <div id="mask">
        <div class="menu_ja-txt">
          <p class="noise">展示会情報</p>
          <ul>
            <li>
              出展
              <br>
              2025.03 | 日台の絆展（会場 / 台湾）
            </li>
            <li>2023.06 | 第2回日仏友好オリジナル切手展（会場 / フランス）</li>
            <li>2022.11 | 芸術の虎展（会場 / 日光東照宮美術館）</li>
            <li>2022.04 | 日アセアン友好文化交流展（会場 / 東京アセアンセンター）</li>
            <li>2021.11 | サロン・ド・アール・ジャポネ（会場 / フランス）</li>
            <li>2021.08 | OASISU2021（会場 / 大阪あべのハルカス）</li>
            <li>2021.04 | チャリティアート展（会場 / 東京）</li>
            <hr class="menu_ber">
            <li>
              認定 / 賞
              <br>
              2025 | 日仏友好貢献親善大賞
            </li>
            <li>2022 | 徳川家康作家之賞</li>
            <li>2022 | 日本・モンゴル外交関係樹立50周年記念事業認定</li>
            <li>2021 | Artista del post luminescenza e sole bianco.【残照と白日の芸術家】認定</li>
            <li>2016 | 第67回宮城県高等学校美術展（優秀賞）賞</li>
          </ul>
        </div>

        <div class="menu_en-txt">
          <p class="noise">Exhibition Information</p>
          <ul>
            <li>
              Exhibition
              <br>
              2025.03 | Japan-Taiwan Bond Exhibition (Venue / Taiwan)
            </li>
            <li>2023.06 | 2nd Japan-France Friendship Original Stamp Exhibition (Venue / France)</li>
            <li>2022.11 | Tigers of Art Exhibition (Venue / Nikko Toshogu Museum)</li>
            <li>2022.04 | Japan-ASEAN Friendship and Cultural Exchange Exhibition (Venue / Tokyo ASEAN Centre)</li>
            <li>2021.11 | Salon d'Art Japonais (Venue / France)</li>
            <li>2021.08 | OASISU 2021 (Venue / Abeno Harukas, Osaka)</li>
            <li>2021.04 | Charity Art Exhibition (Venue / Tokyo)</li>
            <hr>
            <li>
              Certifications / Awards
              <br>
              2025 | Japan-France Friendship Contribution Goodwill Award
            </li>
            <li>2022 | Tokugawa Ieyasu Writers' Award</li>
            <li>2022 | Certified as part of the 50th anniversary of the establishment of diplomatic relations between
              Japan and Mongolia</li>
            <li>2021 | Certified as Artista del post luminescenza e sole bianco. [Artist of afterglow and daylight]</li>
            <li>2016 | Award for Excellence at the 67th Miyagi Prefectural High School Art Exhibition</li>
          </ul>
        </div>
      </div>

      <div class="noise"
        style="content: ''; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -1;">
      </div>
    </nav>
    <button class="toggle_btn" type="button" aria-controls="primary-navigation" aria-expanded="false" aria-label="Open navigation menu">
      <span class="noise"></span>
      <span class="noise"></span>
      <span class="noise"></span>
    </button>
  </div>

  <!-- 言語切り替えUI -->
  <div id="langChange">
    <!-- ラジオボタン（非表示） -->
    <input type="radio" id="langJa" name="lang" value="ja" hidden>
    <input type="radio" id="langEn" name="lang" value="en" hidden>

    <div class="inner_label">
      <!-- ラベルと表示テキスト（JP/EN） -->
      <label for="langJa" role="button" tabindex="0" aria-label="日本語">
        <div class="lang-button ja noise">Ja</div>
      </label>
      <label for="langEn" role="button" tabindex="0" aria-label="English">
        <div class="lang-button en noise">En</div>
      </label>
    </div>
  </div>

  </div>

  <!-- Frame initials: Information and Site Policy are not in the
       right menu, so the frame carries them at its bottom left,
       mirroring the menu band (initial + expanding label tab). -->
  <div class="frame-initials">
    <a href="${siteHref("information.html")}"><span class="frame-initial" aria-hidden="true">I</span><span class="frame-label">Information</span></a>
    <a href="${siteHref("policy.html")}"><span class="frame-initial" aria-hidden="true">P</span><span class="frame-label">Site Policy</span></a>
  </div>
  <a class="frame-prev" id="framePrev" href="#" hidden>
    <span class="frame-prev-tag" aria-hidden="true">PREV</span>
    <span class="frame-prev-name"></span>
    <small>前のページへ</small>
  </a>
  <div class="frame-copy">&copy; <span id="frameYear"></span> Mizuki Oyama</div>
</header>
`;
// END GENERATED HEADER_MARKUP

// BEGIN GENERATED FOOTER_MARKUP — source: src/components/footer.html
const FOOTER_MARKUP = `
<footer>
   <span class="foot-sub-links"><a href="${siteHref("information.html")}">Information</a><a href="${siteHref("policy.html")}">Site Policy</a></span>
</footer>
`;
// END GENERATED FOOTER_MARKUP

const SIDEBAR_MARKUP = `
<p id="category-header" class="noise">・</p>
<ul id="category-menu" aria-label="Gallery filters">
  <li class="filter-group-title" role="presentation">Genre</li>
  <li data-category="all" class="active noise">All</li>
  <li data-category="Digital" class="noise">Digital</li>
  <li data-category="Paint" class="noise">Paint</li>
  <li data-category="Exhibition" class="noise">Exhibition</li>
  <li data-category="Certified" class="noise">Certified</li>
  <li data-category="Photo" class="noise">Photo</li>
  <li data-category="Unreleased" class="noise">Unreleased</li>
  <li class="filter-group-title" role="presentation">Year</li>
  <li data-category="2026" class="noise">2026</li>
  <li data-category="2025" class="noise">2025</li>
  <li data-category="2024" class="noise">2024</li>
  <li data-category="2023" class="noise">2023</li>
  <li data-category="2022" class="noise">2022</li>
  <li data-category="2021" class="noise">2021</li>
  <li data-category="2010-2017" class="noise">2010~2017</li>
</ul>
`;

/**
 * Render the existing header markup without requesting an HTML partial.
 * @returns {HTMLElement|null}
 */
function buildHeader() {
  const container = document.getElementById("header-container");
  if (!container) return null;

  const template = document.createElement("template");
  template.innerHTML = HEADER_MARKUP;
  container.replaceChildren(template.content.cloneNode(true));
  return container.querySelector("header");
}

/**
 * Render the existing footer markup without requesting an HTML partial.
 * @returns {HTMLElement|null}
 */
function buildFooter() {
  const container = document.getElementById("footer-container");
  if (!container) return null;

  const template = document.createElement("template");
  template.innerHTML = FOOTER_MARKUP;
  container.replaceChildren(template.content.cloneNode(true));

  return container.querySelector("footer");
}

/**
 * Render the gallery sidebar without requesting an HTML partial.
 * @returns {HTMLElement|null}
 */
function buildSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container || container.dataset.sidebarInitialized === "true") return null;

  const template = document.createElement("template");
  template.innerHTML = SIDEBAR_MARKUP;
  container.replaceChildren(template.content.cloneNode(true));
  container.dataset.sidebarInitialized = "true";
  return container.querySelector("#category-menu");
}

function loadDeferredImages() {
  document.querySelectorAll("img[data-src]").forEach(image => {
    const source = image.getAttribute("data-src");
    if (!source) return;
    image.setAttribute("src", source);
    image.addEventListener("load", () => image.removeAttribute("data-src"), {
      once: true
    });
  });
}

/**
 * Type the optional loading-screen copy and then dismiss its backdrop.
 * @returns {void}
 */
function initializeTyping() {
  const loading = document.getElementById('loading-bg');
  if (!loading || loading.dataset.typingStarted) return;
  loading.dataset.typingStarted = 'true';
  const entry = document.getElementById('home-entry');
  const backgrounds = new Map();
  let fallbackTimer;
  let completed = false;
  const release = () => {
    if (completed) return;
    completed = true;
    clearTimeout(fallbackTimer);
    loading.hidden = true;
    if (entry) entry.hidden = true;
    for (const [element, wasInert] of backgrounds) element.inert = wasInert;
    backgrounds.clear();
    try { sessionStorage.setItem('portfolioHomeStarted', 'true'); } catch (_) {}
    document.dispatchEvent(new Event('portfolio:homeready'));
    if (entry) document.querySelector('.content__slide.active .button')?.focus({ preventScroll: true });
  };
  const lock = () => {
    for (const element of document.body.children) {
      if (element === entry || element === loading || element.matches('script,style,link,noscript')) continue;
      backgrounds.set(element, element.inert);
      element.inert = true;
    }
  };
  const run = () => {
    if (loading.dataset.running) return;
    loading.dataset.running = 'true';
    entry?.setAttribute('hidden', '');
    loading.hidden = false;
    const language = getLang();
    const lines = [...loading.querySelectorAll('.typing-line')];
    lines.forEach(line => { line.hidden = line.lang !== language; line.style.display = line.hidden ? 'none' : ''; line.textContent = ''; });
    const selected = lines.filter(line => line.lang === language);
    loading.setAttribute('aria-label', selected.map(line => line.dataset.text).join(' '));
    lines.forEach(line => line.setAttribute('aria-hidden', 'true'));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const textLength = selected.reduce((sum, line) => sum + line.dataset.text.length, 0);
    fallbackTimer = setTimeout(release, textLength * 55 + 4000);
    if (reduced) { selected.forEach(line => line.textContent = line.dataset.text); setTimeout(release, 350); return; }
    let index = 0;
    const next = () => {
      if (completed) return;
      const line = selected[index++];
      if (!line) { setTimeout(release, 500); return; }
      let position = 0;
      const type = () => {
        if (completed) return;
        line.textContent = line.dataset.text.slice(0, ++position);
        if (position < line.dataset.text.length) setTimeout(type, 55);
        else next();
      };
      type();
    };
    next();
  };
  let visited = false;
  try { visited = sessionStorage.getItem('portfolioHomeStarted') === 'true'; } catch (_) {}
  if (!entry || visited) { release(); return; }
  lock();
  entry.hidden = false;
  loading.hidden = true;
  const languageButtons = [...entry.querySelectorAll('[data-entry-language]')];
  const sync = () => languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.entryLanguage === getLang())));
  languageButtons.forEach(button => button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.entryLanguage === 'en' ? 'langEn' : 'langJa');
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    sync();
  }));
  document.addEventListener('portfolio:languagechange', sync);
  entry.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...entry.querySelectorAll('button')];
    if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
  });
  document.getElementById('home-start').addEventListener('click', run, { once: true });
  // If a runtime error occurs, unblock the existing site rather than trapping visitors.
  window.addEventListener('error', release, { once: true });
  window.addEventListener('pageshow', event => { if (event.persisted && completed) { loading.hidden = true; entry.hidden = true; } });
  sync();
  languageButtons.find(button => button.getAttribute('aria-pressed') === 'true')?.focus();
}

function normalizeLanguage(value) {
  return value === "en" ? "en" : "ja";
}

function getStoredLanguage() {
  try {
    return normalizeLanguage(
      localStorage.getItem("selectedLang") || localStorage.getItem("lang")
    );
  } catch (error) {
    console.warn("Language preference could not be read.", error);
    return "ja";
  }
}

function isBilingualPage() {
  return document.body?.dataset.languageMode === "bilingual";
}

function storeLanguage(language) {
  try {
    localStorage.setItem("selectedLang", language);
    localStorage.setItem("lang", language);
  } catch (error) {
    console.warn("Language preference could not be saved.", error);
  }
}

// =======================
// 多言語対応クラス
// =======================
let currentLang = getStoredLanguage();
const getLang = () => currentLang;

function multi_language() {
  this.set_current_lang();
}

multi_language.prototype.get_lang_lists = function () {
  return document.querySelectorAll("input[type='radio'][name='lang']");
};

multi_language.prototype.set_current_lang = function () {
  const storedLang = getStoredLanguage();
  currentLang = storedLang;
  if (!isBilingualPage()) {
    document.documentElement?.setAttribute('lang', storedLang);
  }
  this.checked_lang_list(storedLang);
  this.update_active_class(storedLang);
};

multi_language.prototype.checked_lang_list = function (language) {
  const elms = this.get_lang_lists();
  for (const elm of elms) {
    elm.checked = elm.value === language;
    if (elm.dataset.languageBound === 'true') continue;
    elm.addEventListener('change', this.click_lang.bind(this));
    elm.dataset.languageBound = 'true';
  }
};

multi_language.prototype.click_lang = function (e) {
  if (isBilingualPage()) return;
  const lang = normalizeLanguage(e?.target?.value);
  currentLang = lang;
  storeLanguage(lang);
  document.documentElement?.setAttribute('lang', lang);
  this.checked_lang_list(lang);
  this.update_active_class(lang);
};

function syncLanguageControlVisibility() {
  const languageControl = document.querySelector('#langChange');
  if (!languageControl) return;

  const menuOpen = document.querySelector('#navArea')?.classList.contains('open') === true;
  const shouldHide = isBilingualPage() || (menuOpen && !window.matchMedia('(min-width: 1024px)').matches);
  if (shouldHide) {
    languageControl.setAttribute('hidden', '');
    languageControl.setAttribute('aria-hidden', 'true');
    languageControl.setAttribute('inert', '');
    return;
  }

  languageControl.removeAttribute('hidden');
  languageControl.removeAttribute('aria-hidden');
  languageControl.removeAttribute('inert');
}

function syncMenuExhibitionInformation(language) {
  const selectedLanguage = normalizeLanguage(language);
  const panels = [
    ['ja', document.querySelector('.menu_ja-txt')],
    ['en', document.querySelector('.menu_en-txt')]
  ];

  for (const [panelLanguage, panel] of panels) {
    if (!panel) continue;
    const isSelected = panelLanguage === selectedLanguage;
    if (isSelected) {
      panel.removeAttribute('hidden');
      panel.removeAttribute('aria-hidden');
    } else {
      panel.setAttribute('hidden', '');
      panel.setAttribute('aria-hidden', 'true');
    }
  }
}

function applyLocalizedContent(language) {
  const selectedLanguage = normalizeLanguage(language);
  const localizedElements = document.querySelectorAll('[lang="ja"],[lang="en"]');
  syncLanguageControlVisibility();
  document.querySelectorAll('#langChange label').forEach(label => {
    label.setAttribute('aria-pressed', String(label.htmlFor === (selectedLanguage === 'ja' ? 'langJa' : 'langEn')));
  });
  syncMenuExhibitionInformation(selectedLanguage);
  const showPersistentSubtitle = element => {
    const subtitle = element.closest(".h1-text .subtext");
    if (!subtitle) return false;
    subtitle.style.display = "block";
    element.style.display = "block";
    return true;
  };

  if (isBilingualPage()) {
    localizedElements.forEach(element => {
      if (element.closest('#thanksModal') || (element.closest('.modal-box') && document.getElementById('policy-modal-content'))) {
        element.style.display = element.lang === selectedLanguage ? '' : 'none';
      } else if (!showPersistentSubtitle(element)) element.style.display = 'block';
    });
  } else {
    document.querySelector('#langChange .ja')?.classList.toggle('active', selectedLanguage === 'ja');
    document.querySelector('#langChange .en')?.classList.toggle('active', selectedLanguage === 'en');
    localizedElements.forEach(element => {
      if (element === document.documentElement) return;
      if (showPersistentSubtitle(element)) return;
      const shouldDisplay = element.getAttribute('lang') === selectedLanguage;
      if (!shouldDisplay) {
        element.style.display = 'none';
        return;
      }
      const blockLevelTags = ['H2', 'H3', 'H4', 'P', 'DIV', 'HR'];
      element.style.display = blockLevelTags.includes(element.tagName) ? 'block' : '';
    });
  }

  document.dispatchEvent(new CustomEvent('portfolio:languagechange', {
    detail: { language: selectedLanguage }
  }));
}

window.getPortfolioLanguage = () => currentLang;
window.refreshPortfolioLanguageContent = () => applyLocalizedContent(currentLang);

multi_language.prototype.update_active_class = function (lang) {
  applyLocalizedContent(lang);
};

// =======================
// メニュー初期化
// =======================
function initializeMenu() {
  const nav = document.getElementById('navArea');
  const btn = nav?.querySelector('.toggle_btn');
  const mask = document.getElementById('mask');

  if (!btn || !nav || btn.dataset.menuBound === 'true') return;

  /* The frame menu is permanent at every width since
     2026-11-19 (the drawer was retired), so the "desktop"
     branch — permanent nav, no toggle — always applies. */
  const desktop = window.matchMedia('(min-width: 0px)');
  const panel = nav.querySelector('nav');
  const normalizePath = value => new URL(value, location.href).pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  const currentPath = normalizePath(location.href);
  document.querySelectorAll('#navArea .inner a').forEach(link => {
    const target = normalizePath(link.href);
    const isCurrent = target === currentPath;
    if (isCurrent) link.setAttribute('aria-current', 'page');
  });

  const setOpen = isOpen => {
    isOpen = (!desktop.matches || scrollY >= innerHeight * 0.55) && isOpen;
    const visible = (desktop.matches && scrollY < innerHeight * 0.55) || isOpen;
    panel?.toggleAttribute('inert', !visible);
    panel?.setAttribute('aria-hidden', String(!visible));
    panel?.classList.toggle('is-scroll-hidden', !visible);
    nav.classList.toggle('open', isOpen);
    syncLanguageControlVisibility();
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    if (isOpen) {
      const first = panel.querySelector('.inner a');
      const focusWhenVisible = () => {
        if (!nav.classList.contains('open') || panel.inert || document.activeElement !== btn) return;
        // Visibility can still be hidden in the first transition frame, including
        // Reduced Motion. Wait for the actual computed state, not a fixed delay.
        if (getComputedStyle(first).visibility !== 'visible') {
          requestAnimationFrame(focusWhenVisible);
          return;
        }
        first.focus({ preventScroll: true });
      };
      focusWhenVisible();
    }
    else if (panel.contains(document.activeElement) && !visible) btn.focus({ preventScroll: true });
  };

  btn.setAttribute('aria-controls', 'primary-navigation');
  setOpen(false);
  btn.addEventListener('click', () => {
    setOpen(!nav.classList.contains('open'));
  });
  mask?.addEventListener('click', () => setOpen(false));
  nav.querySelectorAll('.inner a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('pointerdown', event => {
    if (nav.classList.contains('open') && !nav.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    const languageButton = event.target.closest?.('#langChange label');
    if (languageButton && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault(); languageButton.click(); return;
    }
    if (!nav.classList.contains('open')) return;
    if (event.key === 'Tab') {
      const first = panel.querySelector('.inner a');
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); btn.focus(); }
      else if (!event.shiftKey && document.activeElement === btn) { event.preventDefault(); first?.focus(); }
      return;
    }
    if (event.key !== 'Escape') return;
    setOpen(false);
    btn.focus();
  });
  desktop.addEventListener('change', () => setOpen(false));
  btn.dataset.menuBound = 'true';
  initializeDesktopNavigation(desktop, panel, setOpen);
}


// One desktop scroll controller owns primary-menu and in-page navigation state.
function initializeDesktopNavigation(desktop, panel, setOpen) {
  const nav = panel.closest("#navArea");
  const button = nav.querySelector(".toggle_btn");
  const footer = document.getElementById("footer-container");
  const main = document.querySelector('main');
  let reading = main?.querySelector('.reading-nav');
  const existing = Boolean(reading);
  const destinations = [...(main?.querySelectorAll('[data-page-nav]') || [])];
  const origin = existing ? document.createComment('Reading Nav position') : null;
  if (reading) reading.before(origin);
  if (!reading && destinations.length > 1) {
    reading = document.createElement('nav');
    reading.className = 'reading-nav';
    reading.setAttribute('aria-label', 'ページ内ナビゲーション / On this page');
  }
  reading?.classList.add('page-navigation');
  const decorateLinks = () => {
    for (const link of reading?.querySelectorAll("a") || []) {
      if (link.querySelector(":scope > .nav-label")) continue;
      const label = document.createElement("span");
      label.className = "nav-label";
      label.append(...link.childNodes);
      link.append(label);
    }
  };
  decorateLinks();
  const updateLinks = () => {
    if (!reading || existing) return;
    const language = window.getPortfolioLanguage?.() || 'ja';
    const links = destinations.filter(target => target.getClientRects().length).map(target => {
      const link = document.createElement('a');
      link.href = '#' + target.id;
      link.textContent = target.dataset.pageNav || target.querySelector('[lang="' + language + '"]')?.textContent || target.textContent;
      return link;
    });
    reading.replaceChildren(...links);
    decorateLinks();
  };
  const readingLabels = new Map([...(reading?.querySelectorAll('[data-sidebar-label]') || [])].map(link => [link, link.textContent]));
  const setVisible = (element, visible) => {
    if (!element) return;
    if (!visible && element.contains(document.activeElement)) {
      const fallback = nav.classList.contains('is-compact') ? button : document.querySelector('.head a');
      fallback?.focus({ preventScroll: true });
    }
    element.classList.toggle('is-scroll-hidden', !visible);
    element.toggleAttribute('inert', !visible);
    element.setAttribute('aria-hidden', String(!visible));
  };
  let frame = 0;
  const update = () => {
    frame = 0;
    for (const [link, label] of readingLabels) {
      const text = desktop.matches ? link.dataset.sidebarLabel : label;
      if (link.textContent !== text) link.querySelector(".nav-label").textContent = text;
      if (desktop.matches) link.setAttribute('aria-label', label);
      else link.removeAttribute('aria-label');
    }
    if (desktop.matches) {
      if (reading && reading.parentElement !== document.body) document.body.append(reading);
      /* The PC frame design keeps the global menu permanently
         visible in the frame's right rectangle, so the primary
         nav no longer collapses into the toggle button on
         scroll (2026-11-18). */
      const compact = false;
      nav.classList.toggle('is-compact', compact);
      button.toggleAttribute('inert', !compact);
      button.setAttribute('aria-hidden', String(!compact));
      if (!compact && nav.classList.contains('open')) setOpen(false);
      if (!compact && document.activeElement === button) document.querySelector('.head a')?.focus({ preventScroll: true });
      setVisible(panel, !compact || nav.classList.contains('open'));
      const footerNear = footer && footer.getBoundingClientRect().top <= innerHeight + 56;
      setVisible(reading, scrollY >= innerHeight && !footerNear);
    } else {
      nav.classList.remove('is-compact');
      button.removeAttribute('inert');
      button.removeAttribute('aria-hidden');
      panel.classList.remove('is-scroll-hidden');
      if (existing && reading.parentElement === document.body) origin.after(reading);
      if (reading) {
        reading.classList.remove('is-scroll-hidden');
        reading.toggleAttribute('inert', !existing);
        reading.setAttribute('aria-hidden', String(!existing));
      }
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  document.addEventListener('portfolio:languagechange', () => { updateLinks(); schedule(); });
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  desktop.addEventListener('change', schedule);
  if (footer) new IntersectionObserver(schedule, { rootMargin: '0px 0px 56px 0px' }).observe(footer);
  updateLinks();
  update();
}

function initializeFrameLiquid() {
  /* Liquid droplet frame: the frame's inner contour swells
     toward the pointer (the whole bump is pulled in one
     direction, toward the pointer, so concave corners keep
     their shape). Motion tuned with the label mock: swell 8,
     spread 58, follow 6, label growth via the CSS width
     transition (0.18s). While a menu label is open, the
     contour itself grows the label's protrusion, so the
     label's background is the frame itself (CSS hides the
     label's own background and the junction fillets under
     html.frame-liquid-on). The static SVG path remains the
     no-JS / reduced-motion shape. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.documentElement.classList.add('frame-liquid-on');

  const PC_VERTICES = [[1416, 876], [1416, 796], [1350, 796], [1350, 24], [24, 24], [24, 736], [90, 736], [90, 876]];
  const PC_RADII = [8, 30, 40, 40, 14, 30, 40, 40];
  const SP_RADII = [8, 8, 11, 11, 14, 8, 11, 11];
  const SP_VERTICES = PC_VERTICES.map(([x, y]) => [Math.round(x * 390 / 1440 * 10) / 10, Math.round(y * 844 / 900 * 10) / 10]);
  const AMP = 12;

  function sampleContour(vertices, radii) {
    const pts = [];
    const n = vertices.length;
    let prevB = null;
    let firstA = null;
    for (let i = 0; i < n; i++) {
      const p = vertices[i];
      const prev = vertices[(i - 1 + n) % n];
      const next = vertices[(i + 1) % n];
      const r = radii[i];
      let ux = p[0] - prev[0], uy = p[1] - prev[1];
      const ul = Math.hypot(ux, uy); ux /= ul; uy /= ul;
      let vx = next[0] - p[0], vy = next[1] - p[1];
      const vl = Math.hypot(vx, vy); vx /= vl; vy /= vl;
      const a = [p[0] - r * ux, p[1] - r * uy];
      const b = [p[0] + r * vx, p[1] + r * vy];
      const c = [a[0] + r * vx, a[1] + r * vy];
      if (!firstA) firstA = a;
      if (prevB) {
        const dx = a[0] - prevB[0], dy = a[1] - prevB[1];
        const steps = Math.max(1, Math.round(Math.hypot(dx, dy) / 10));
        for (let j = 1; j < steps; j++) pts.push([prevB[0] + dx * j / steps, prevB[1] + dy * j / steps]);
      }
      let a0 = Math.atan2(a[1] - c[1], a[0] - c[0]);
      let a1 = Math.atan2(b[1] - c[1], b[0] - c[0]);
      while (a1 - a0 > Math.PI) a1 -= Math.PI * 2;
      while (a1 - a0 < -Math.PI) a1 += Math.PI * 2;
      const steps = Math.max(1, Math.round(Math.abs(a1 - a0) / (Math.PI / 12)));
      for (let j = 0; j <= steps; j++) {
        const t = a0 + (a1 - a0) * j / steps;
        pts.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]);
      }
      prevB = b;
    }
    if (prevB && firstA) {
      const dx = firstA[0] - prevB[0], dy = firstA[1] - prevB[1];
      const steps = Math.max(1, Math.round(Math.hypot(dx, dy) / 10));
      for (let j = 1; j < steps; j++) pts.push([prevB[0] + dx * j / steps, prevB[1] + dy * j / steps]);
    }
    return pts;
  }

  function makeVariant(selector, vertices, radii, vbW, vbH, scale) {
    const svg = document.querySelector(selector);
    if (!svg) return null;
    const paths = [...svg.querySelectorAll('path')];
    if (!paths.length) return null;
    const pts = sampleContour(vertices, radii);
    const arc = [0];
    for (let i = 1; i <= pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i % pts.length];
      arc.push(arc[i - 1] + Math.hypot(p1[0] - p0[0], p1[1] - p0[1]));
    }
    const nearestIdx = (x, y) => {
      let bi = 0, bd = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const d = (pts[i][0] - x) * (pts[i][0] - x) + (pts[i][1] - y) * (pts[i][1] - y);
        if (d < bd) { bd = d; bi = i; }
      }
      return bi;
    };
    return {
      paths,
      original: paths.map((el) => el.getAttribute('d')),
      prefix: `M0 0H${vbW}V${vbH}H0Z `,
      pts, arc, total: arc[pts.length],
      vbW, vbH, scale,
      tabI0: nearestIdx(vertices[5][0], vertices[5][1]),
      tabI1: nearestIdx(vertices[7][0], vertices[7][1]),
      amp: AMP * scale, sigma: 180 * scale, range: 190 * scale,
      ampNow: 0, centreS: 0, centreInit: false, dirX: 0, dirY: 1, dirty: false,
    };
  }

  const variants = {
    pc: makeVariant('.site-frame', PC_VERTICES, PC_RADII, 1440, 900, 1),
    sp: makeVariant('.site-frame-sp', SP_VERTICES, SP_RADII, 390, 844, 390 / 1440),
  };
  if (!variants.pc && !variants.sp) return;
  const spMq = window.matchMedia('(max-width: 767px)');
  const active = () => (spMq.matches ? variants.sp : variants.pc) || variants.pc || variants.sp;

  let pointer = null;
  let raf = 0;

  /* The open label: { edge: 'band' | 'tab', el, closing }.
     The label's width is set per label (text width + padding,
     at least the frame edge + 55 units) so the protrusion fits
     the text; the contour reads the label's animated rect
     each frame, so the protrusion grows and shrinks with
     the CSS width transition. */
  let labelState = null;
  function bindLabel(link, labelSelector, edge) {
    if (!link) return;
    const label = link.querySelector(labelSelector);
    if (!label) return;
    const open = () => {
      const range = document.createRange();
      range.selectNodeContents(label);
      const tw = range.getBoundingClientRect().width;
      const padPx = 40;
      const minDepthPx = 55 * window.innerWidth / 1440;
      const base = edge === 'tab'
        ? window.innerWidth * 0.09375 - 12 + minDepthPx
        : window.innerWidth * 0.0625 + minDepthPx;
      label.style.width = Math.max(tw + 2 * padPx, base) + 'px';
      labelState = { edge, el: label, closing: false };
      wake();
    };
    const close = () => {
      if (link.matches(':hover') || document.activeElement === link) return;
      if (labelState && labelState.el === label) {
        labelState.closing = true;
        label.style.width = '';
      }
      wake();
    };
    link.addEventListener('pointerenter', open);
    link.addEventListener('pointerleave', close);
    link.addEventListener('focus', open);
    link.addEventListener('blur', close);
  }

  /* Build the render point list: the static contour with the
     open label's stretch displaced outward. The displacement
     is full across the label's span and eases to zero over
     BLEND arc units beyond it, so the junction reads as the
     edge itself deforming rather than a joint. Points keep
     their static arc values, so the swell's centre tracking
     is unaffected. Returns null when no protrusion. */
  const BLEND = 220;
  const smooth01 = (t) => t * t * (3 - 2 * t);
  function buildRender(v) {
    if (!labelState) return null;
    const rect = labelState.el.getBoundingClientRect();
    const sx = v.vbW / 1440, sy = v.vbH / 900;
    const y0 = rect.top * 900 / window.innerHeight;
    const y1 = rect.bottom * 900 / window.innerHeight;
    let depth;
    if (labelState.edge === 'band') {
      depth = (window.innerWidth * 1350 / 1440 - rect.left) * 1440 / window.innerWidth;
    } else {
      depth = (rect.right - window.innerWidth * 90 / 1440) * 1440 / window.innerWidth;
    }
    if (depth < 0.5) return null;
    let sLo = null, sHi = null;
    const i0 = labelState.edge === 'band' ? 0 : v.tabI0;
    const i1 = labelState.edge === 'band' ? v.pts.length - 1 : v.tabI1;
    for (let i = i0; i <= i1; i++) {
      if (labelState.edge === 'band' && Math.abs(v.pts[i][0] - 1350 * sx) > 0.6) continue;
      const yy = v.pts[i][1] / sy;
      if (Math.abs(yy - y0) < 8) sLo = v.arc[i];
      if (Math.abs(yy - y1) < 8) sHi = v.arc[i];
    }
    if (sLo === null || sHi === null) {
      let bd0 = Infinity, bd1 = Infinity;
      sLo = null; sHi = null;
      for (let i = i0; i <= i1; i++) {
        if (labelState.edge === 'band' && Math.abs(v.pts[i][0] - 1350 * sx) > 0.6) continue;
        const yy = v.pts[i][1] / sy;
        const d0 = Math.abs(yy - y0), d1 = Math.abs(yy - y1);
        if (d0 < bd0) { bd0 = d0; sLo = v.arc[i]; }
        if (d1 < bd1) { bd1 = d1; sHi = v.arc[i]; }
      }
    }
    if (sLo === null || sHi === null) return null;
    const lo = Math.min(sLo, sHi), hi = Math.max(sLo, sHi);
    const B = BLEND * sy;
    const dir = labelState.edge === 'band' ? -1 : 1;
    const rPts = new Array(v.pts.length);
    for (let i = 0; i < v.pts.length; i++) {
      const sv = v.arc[i];
      let d = 0;
      if (sv < lo) d = lo - sv; else if (sv > hi) d = sv - hi;
      if (d >= B) { rPts[i] = v.pts[i]; continue; }
      rPts[i] = [v.pts[i][0] + dir * depth * sx * smooth01(1 - d / B), v.pts[i][1]];
    }
    return { pts: rPts, arc: v.arc, key: Math.round(rect.width * 4) + ':' + Math.round(rect.height * 4) };
  }

  function restore(v) {
    if (!v || !v.dirty) return;
    v.paths.forEach((el, i) => el.setAttribute('d', v.original[i]));
    v.dirty = false;
    v.ampNow = 0;
    v.centreInit = false;
    v.lastD = null;
  }

  function step() {
    raf = 0;
    const v = active();
    if (!v) return;
    const render = buildRender(v);
    const rPts = render ? render.pts : v.pts;
    const rArc = render ? render.arc : v.arc;
    let target = 0;
    if (pointer) {
      const px = pointer.x * v.vbW / window.innerWidth;
      const py = pointer.y * v.vbH / window.innerHeight;
      let best = Infinity, bi = 0;
      for (let i = 0; i < rPts.length; i++) {
        const dx = rPts[i][0] - px, dy = rPts[i][1] - py;
        const d = dx * dx + dy * dy;
        if (d < best) { best = d; bi = i; }
      }
      const prox = Math.max(0, 1 - Math.sqrt(best) / v.range);
      target = v.amp * prox * prox;
      const targetS = rArc[bi];
      if (!v.centreInit) { v.centreS = targetS; v.centreInit = true; }
      let diff = targetS - v.centreS;
      if (diff > v.total / 2) diff -= v.total;
      if (diff < -v.total / 2) diff += v.total;
      v.centreS += diff * 0.06;
      if (v.centreS < 0) v.centreS += v.total;
      if (v.centreS >= v.total) v.centreS -= v.total;
      let vx = px - rPts[bi][0], vy = py - rPts[bi][1];
      const vl = Math.hypot(vx, vy);
      if (vl > 1) {
        vx /= vl; vy /= vl;
        v.dirX += (vx - v.dirX) * 0.08;
        v.dirY += (vy - v.dirY) * 0.08;
        const dl = Math.hypot(v.dirX, v.dirY) || 1;
        v.dirX /= dl; v.dirY /= dl;
      }
    }
    v.ampNow += (target - v.ampNow) * 0.06;
    if (labelState && labelState.closing && !render) labelState = null;
    if (v.ampNow < 0.15 && target === 0 && !labelState) { restore(v); return; }
    const inv = 1 / (2 * v.sigma * v.sigma);
    let d = v.prefix + 'M';
    for (let i = 0; i < rPts.length; i++) {
      let ds = rArc[i] - v.centreS;
      if (ds > v.total / 2) ds -= v.total;
      if (ds < -v.total / 2) ds += v.total;
      const w = Math.exp(-ds * ds * inv) * v.ampNow;
      d += (rPts[i][0] + v.dirX * w).toFixed(1) + ' ' + (rPts[i][1] + v.dirY * w).toFixed(1) + 'L';
    }
    d = d.slice(0, -1) + 'Z';
    const rectKey = render ? render.key : '';
    if (d === v.lastD && rectKey === v.lastRectKey) {
      if (target === 0 && !labelState) restore(v);
      return;
    }
    v.lastD = d;
    v.lastRectKey = rectKey;
    v.paths.forEach((el) => el.setAttribute('d', d));
    v.dirty = true;
    raf = requestAnimationFrame(step);
  }

  function wake() { if (!raf) raf = requestAnimationFrame(step); }
  document.querySelectorAll('#navArea .inner li a').forEach((a) => bindLabel(a, '.nav-label', 'band'));
  document.querySelectorAll('.frame-initials a').forEach((a) => bindLabel(a, '.frame-label', 'tab'));
  window.addEventListener('pointermove', (e) => { pointer = { x: e.clientX, y: e.clientY }; wake(); }, { passive: true });
  window.addEventListener('pointerdown', (e) => { pointer = { x: e.clientX, y: e.clientY }; wake(); }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer = null; wake(); });
  window.addEventListener('blur', () => { pointer = null; wake(); });
  window.addEventListener('resize', wake);
  spMq.addEventListener('change', () => { restore(variants.pc); restore(variants.sp); wake(); });
}

function initializeHeader() {
  try {
    if (!buildHeader()) return;

    const frameYear = document.getElementById("frameYear");
    if (frameYear) frameYear.textContent = String(new Date().getFullYear());
    setupFramePrev();
    initializeFrameLiquid();

    new multi_language();

    initializeMenu();
    initializePolicyControls();
    requestAnimationFrame(() => {
      if (typeof initializeTyping === 'function') initializeTyping();
    });
  } catch (error) {
    console.error('Error building header:', error);
  }
}

function initializePolicyControls() {
  const toggle = document.getElementById('modal-toggle');
  const opener = document.querySelector('button.modal-open-label');
  const panel = toggle?.nextElementSibling?.nextElementSibling;
  const close = panel?.querySelector('button.modal-close-label');
  if (!toggle || !opener || !close || toggle.dataset.policyControlsBound === 'true') return;
  toggle.dataset.policyControlsBound = 'true';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  if (!panel.hasAttribute('aria-labelledby')) panel.setAttribute('aria-label', 'Site Policy');
  panel.tabIndex = -1;
  const overlay = toggle.nextElementSibling;
  const background = new Map();
  const content = panel.querySelector('#policy-modal-content');
  if (content) opener.setAttribute('aria-controls', content.id);
  const update = (focus = true) => {
    opener.setAttribute('aria-expanded', String(toggle.checked));
    if (toggle.checked && !background.size) {
      for (const child of document.body.children) {
        if (child === panel || child === overlay || child === toggle || child.contains(panel) || child.matches('script,style,link')) continue;
        background.set(child, child.inert);
        child.inert = true;
      }
    } else if (!toggle.checked) {
      for (const [child, inert] of background) child.inert = inert;
      background.clear();
    }
    if (!focus) return;
    const target = toggle.checked ? panel : opener;
    target?.focus({ preventScroll: true });
  };
  const setOpen = open => {
    toggle.checked = open;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));
  };
  opener.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  overlay?.addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.checked) {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Tab' && toggle.checked) {
      const controls = [...panel.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])')]
        .filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden' && !element.closest('[inert]'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (document.activeElement === panel || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    }
  });
  toggle.addEventListener('change', () => update());
  update(false);
}

function toggleAccordion(element) {
  element?.classList.toggle("active");
}

/* Footer "previous page" link: the shared footer carries an
   empty #footPrev anchor; fill it with the page that precedes
   this one in the site order (the same order as the
   page-transition tabs) and unhide it. The first page and
   unknown pages keep it hidden. */
const FOOTER_PAGE_ORDER = [
  "index.html",
  "gallery.html",
  "artist-statement.html",
  "biography.html",
  "information.html",
  "exhibitions/yurayura/index.html",
  "order.html",
  "contact.html",
  "policy.html"
];
const FOOTER_PREV_LABELS = [
  "Top",
  "Art Index",
  "Artist Statement",
  "Biography",
  "Information",
  "Yurayura",
  "Order",
  "Contact Us",
  "Site Policy"
];
const FOOTER_PAGE_INDEX = {
  "index.html": 0,
  "gallery.html": 1,
  "artist-statement.html": 2,
  "biography.html": 3,
  "information.html": 4,
  "order.html": 6,
  "contact.html": 7,
  "policy.html": 8
};
function footerPageIndex(pathname) {
  if (pathname.indexOf("/exhibitions/yurayura/") !== -1) return 5;
  const name = pathname.split("/").pop() || "";
  if (name === "") return 0;
  return Object.prototype.hasOwnProperty.call(FOOTER_PAGE_INDEX, name)
    ? FOOTER_PAGE_INDEX[name]
    : -1;
}
function setupFramePrev() {
  const el = document.getElementById("framePrev");
  if (!el) return;
  const idx = footerPageIndex(window.location.pathname);
  if (idx <= 0) return;
  const nameEl = el.querySelector(".frame-prev-name");
  if (nameEl) nameEl.textContent = FOOTER_PREV_LABELS[idx - 1];
  el.setAttribute("href", siteHref(FOOTER_PAGE_ORDER[idx - 1]));
  el.hidden = false;
}

function initializeFooter() {
  try {
    const container = document.getElementById("footer-container");
    if (!container || container.dataset.footerInitialized === "true") return;
    if (buildFooter()) {
      container.dataset.footerInitialized = "true";
    }
  } catch (error) {
    console.error("Error building footer:", error);
  }
}

function initializeSidebar() {
  try {
    buildSidebar();

    const sidebar = document.getElementById("sidebar-container");
    const categoryHeader = document.getElementById("category-header");
    const categoryMenu = document.getElementById("category-menu");

    if (!sidebar || !categoryHeader || !categoryMenu) return;

    const mobileQuery = window.matchMedia("(max-width: 599px)");

    if (categoryHeader.textContent !== "・Category") {
      categoryHeader.textContent = "・Category";
    }

    categoryHeader.setAttribute("aria-label", "Category");
    categoryHeader.setAttribute("role", "button");
    categoryHeader.setAttribute("tabindex", "0");
    categoryHeader.setAttribute("aria-controls", "category-menu");

    Object.assign(categoryHeader.style, {
      justifyContent: "flex-start",
      borderBottom: "1px solid currentColor"
    });

    function syncCategoryOverlay() {
      const gallery = document.querySelector("main.gallery");
      const isMobile = mobileQuery.matches;
      let overlay = document.getElementById("category-glass-overlay");

      if (!isMobile) {
        if (overlay) {
          overlay.style.opacity = "0";
          overlay.style.visibility = "hidden";
          overlay.style.pointerEvents = "none";
          overlay.setAttribute("aria-hidden", "true");
        }
        return;
      }

      if (!gallery) return;

      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "category-glass-overlay";
        overlay.setAttribute("aria-hidden", "true");
        gallery.insertBefore(overlay, gallery.firstChild);
      }

      Object.assign(overlay.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        zIndex: "100",
        opacity: "0",
        visibility: "hidden",
        pointerEvents: "none",
        background: "linear-gradient(135deg, rgba(190,220,220,0.16), rgba(18,38,40,0.30) 42%, rgba(4,12,14,0.42))",
        backdropFilter: "blur(18px) saturate(135%) contrast(104%)",
        WebkitBackdropFilter: "blur(18px) saturate(135%) contrast(104%)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        transition: "opacity 0.28s ease, visibility 0.28s ease"
      });

      if (overlay.dataset.categoryOverlayBound !== "true") {
        overlay.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          setCategoryOpen(false);
        });
        overlay.dataset.categoryOverlayBound = "true";
      }

      const isOpen = categoryMenu.classList.contains("mobile-open");
      overlay.style.opacity = isOpen ? "1" : "0";
      overlay.style.visibility = isOpen ? "visible" : "hidden";
      overlay.style.pointerEvents = isOpen ? "auto" : "none";
      overlay.setAttribute("aria-hidden", String(!isOpen));
    }

    function setCategoryOpen(isOpen) {
      categoryMenu.classList.toggle("mobile-open", isOpen);
      categoryHeader.setAttribute("aria-expanded", String(isOpen));
      syncCategoryOverlay();
    }

    function toggleCategory(event) {
      if (event.type === "keydown") {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
      }

      setCategoryOpen(!categoryMenu.classList.contains("mobile-open"));
    }

    if (categoryHeader.dataset.categoryToggleBound !== "true") {
      categoryHeader.addEventListener("click", toggleCategory);
      categoryHeader.addEventListener("keydown", toggleCategory);
      categoryMenu.addEventListener("keydown", event => {
        if (event.key !== "Escape" || !categoryMenu.classList.contains("mobile-open")) return;
        event.preventDefault();
        setCategoryOpen(false);
        categoryHeader.focus({ preventScroll: true });
      });
      categoryMenu.querySelectorAll("li[data-category]").forEach(item => {
        item.addEventListener("click", () => {
          const restoreFocus = categoryMenu.contains(document.activeElement);
          setCategoryOpen(false);
          if (restoreFocus) categoryHeader.focus({ preventScroll: true });
        });
      });

      categoryHeader.dataset.categoryToggleBound = "true";
      setCategoryOpen(false);
    } else {
      syncCategoryOverlay();
    }

    if (sidebar.dataset.categoryViewportBound !== "true") {
      const syncViewport = () => syncCategoryOverlay();
      if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", syncViewport);
      } else if (typeof mobileQuery.addListener === "function") {
        mobileQuery.addListener(syncViewport);
      }
      sidebar.dataset.categoryViewportBound = "true";
    }

    document.dispatchEvent(new CustomEvent("site:sidebar-ready"));
  } catch (error) {
    console.error("Error building sidebar:", error);
  }
}

// h1/p text
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________'; // ランダム文字
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// 実行部分
document.addEventListener("DOMContentLoaded", () => {
  loadDeferredImages();
  initializeHeader();
  initializeSidebar();
  initializeFooter();
  document.addEventListener("contextmenu", event => event.preventDefault());

  const container = document.querySelector(".h1-text");
  if (!container) return;

  const h1 = container.querySelector("h1.text");
  if (!h1) return;

  // Keep the SEO-readable HTML text as the animation target. If JavaScript is
  // unavailable, the same text remains visible in the static h1.
  const title = h1.textContent.trim() || container.dataset.title || "Art Index";
  const subtitle = container.dataset.subtitle || "Nature Inspire";

  h1.setAttribute("aria-label", title);
  new TextScramble(h1).setText(title);

  const subtitleElement = container.querySelector("p.subtext");
  if (subtitleElement && !subtitleElement.querySelector('[lang="ja"],[lang="en"]')) {
    const parts = subtitle.split(/<br\s*\/?>/gi);
    subtitleElement.replaceChildren();
    parts.forEach((part, index) => {
      if (index > 0) subtitleElement.append(document.createElement("br"));
      subtitleElement.append(document.createTextNode(part));
    });
  }
});
