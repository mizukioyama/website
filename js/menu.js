const HEADER_MARKUP = `
<header>
  <div class="head">
    <a class="noise" href="index.html">
      <!--<span>O.</span>MIZUKI-->
      Mizuki Oyama
    </a>
  </div>

  <!-- Nav -->
  <div id="navArea">
    <nav>
      <div class="inner">
        <ul>
          <li><a href="gallery.html" class="noise">Art Index</a></li>
          <li><a href="artist-statement.html" class="noise">Artist Statement</a></li>
          <li><a href="biography.html" class="noise">Biography</a></li>
          <li><a href="contact.html" class="noise">Contact Us</a></li>
          <li><a href="policy.html" class="noise">Site Policy</a>
          </li>
        </ul>
      </div>
      <div id="mask">
      <div lang="ja" style="width: 95%;">
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
          <hr>
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
      <div lang="en" style="width: 95%;">
        <p class="noise">Exhibition Information</p>
        <ul>
          <li>
            Exhibition
            <br>
            2025.03 | Japan-France Friendship Contribution and Goodwill Award
          </li>
          <li>2023.06 | 2nd Japan-France Friendship Original Stamp Exhibition (Venue / France)</li>
          <li>2022.11 | Art Tiger Exhibition (Venue / Nikko Toshogu Museum)</li>
          <li>2022.04 | Japan-ASEAN Friendship Cultural Exchange Exhibition (Venue / Tokyo ASEAN Centre)</li>
          <li>2021.11 | Salon d'Art Japonais (Venue / France)</li>
          <li>2021.08 | OASISU2021 (Venue / Osaka Abeno Harukas)</li>
          <hr>
          <li>
            Certifications / Awards
            <br>
            2025 | Tokugawa Ieyasu Writers Award
          </li>
          <li>2022 | Tokugawa Ieyasu Writers Award</li>
          <li>2022 | Certified as part of the 50th anniversary of the establishment of diplomatic relations between
            Japan and Mongolia</li>
          <li>2021 | Certified as Artista del post luminescenza e sole bianco. [Artist of afterglow and daylight]</li>
          <li>2016 | Award for Excellence at the 67th Miyagi Prefectural High School Art Exhibition</li>
        </ul>
      </div>

      <div class="noise"
        style="content: ''; width: 100%; height: 100%; position: absolute; background: rgba(0, 100, 100, 0.2); top: 0; left: 0; box-shadow: inset 0px 0px 4px 1px #000; z-index: -1;">
      </div>
    </nav>
    <div class="toggle_btn">
      <span class="noise"></span>
      <span class="noise"></span>
      <span class="noise"></span>
    </div>
  </div>

  <!-- 言語切り替えUI -->
  <div id="langChenge">
    <!-- ラジオボタン（非表示） -->
    <input type="radio" id="langJa" name="lang" value="ja" hidden>
    <input type="radio" id="langEn" name="lang" value="en" hidden>

    <div class="inner_label">
      <!-- ラベルと表示テキスト（JP/EN） -->
      <label for="langJa">
        <div class="lang-button ja noise">Ja</div>
      </label>
      <label for="langEn">
        <div class="lang-button en noise">En</div>
      </label>
    </div>
  </div>

</header>
`;

const FOOTER_MARKUP = `
<footer>
   <a class="noise" href="gallery.html">Art Index</a>
   <a class="noise" href="artist-statement.html">Artist Statement</a>
   <a class="noise" href="biography.html">Biography</a>
   <a class="noise" href="contact.html">Contact Us</a>
   <a class="noise" href="policy.html">Site Policy</a>

   <div class="foot">&copy; <span id="year"></span>
      Mizuki Oyama
   </div>
</footer>
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

  const year = container.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  return container.querySelector("footer");
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
  document.documentElement?.setAttribute('lang', storedLang);
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
  const lang = normalizeLanguage(e?.target?.value);
  currentLang = lang;
  storeLanguage(lang);
  document.documentElement?.setAttribute('lang', lang);
  this.checked_lang_list(lang);
  this.update_active_class(lang);
};

multi_language.prototype.update_active_class = function (lang) {
  // ボタンのactive切り替え
  const jaDiv = document.querySelector('#langChenge .ja');
  const enDiv = document.querySelector('#langChenge .en');
  jaDiv?.classList.toggle('active', lang === 'ja');
  enDiv?.classList.toggle('active', lang === 'en');

  // <p lang="xx">の切り替え
  document.querySelectorAll('h2[lang],h3[lang],h4[lang],p[lang],div[lang],hr[lang]').forEach(element => {
    element.style.display = (element.getAttribute('lang') === lang) ? 'block' : 'none';
  });
};

// =======================
// メニュー初期化
// =======================
function initializeMenu() {
  const nav = document.getElementById('navArea');
  const btn = nav?.querySelector('.toggle_btn');
  const mask = document.getElementById('mask');

  if (!btn || !nav || btn.dataset.menuBound === 'true') return;

  const setOpen = isOpen => {
    nav.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  };

  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('aria-controls', 'navArea');
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    setOpen(!nav.classList.contains('open'));
  });
  btn.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setOpen(!nav.classList.contains('open'));
  });
  mask?.addEventListener('click', () => setOpen(false));
  btn.dataset.menuBound = 'true';
}

function initializeHeader() {
  try {
    if (!buildHeader()) return;

    requestAnimationFrame(() => {
      initializeMenu();
      new multi_language();
      if (typeof initializeTyping === 'function') initializeTyping();
    });
  } catch (error) {
    console.error('Error building header:', error);
  }
}

function toggleAccordion(element) {
  element?.classList.toggle("active");
}

function initializeFooter() {
  try {
    const container = document.getElementById("footer-container");
    if (!container || container.dataset.footerInitialized === "true") return;
    if (buildFooter()) container.dataset.footerInitialized = "true";
  } catch (error) {
    console.error("Error building footer:", error);
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
  initializeFooter();
  document.addEventListener("contextmenu", event => event.preventDefault());

  const container = document.querySelector(".h1-text");
  if (!container) return;

  const h1 = container.querySelector("h1.text");
  if (!h1) return;

  const title = container.dataset.title || "Art Index";
  const subtitle = container.dataset.subtitle || "Nature Inspire";

  new TextScramble(h1).setText(title);

  const subtitleElement = container.querySelector("p.subtext");
  if (subtitleElement) {
    const parts = subtitle.split(/<br\s*\/?>/gi);
    subtitleElement.replaceChildren();
    parts.forEach((part, index) => {
      if (index > 0) subtitleElement.append(document.createElement("br"));
      subtitleElement.append(document.createTextNode(part));
    });
  }
});
