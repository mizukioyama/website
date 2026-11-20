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
      <path fill-rule="evenodd" fill="#222527" d="M0 0H1440V900H0Z M24.0 862.0L24.5 865.6L25.9 869.0L28.1 871.9L31.0 874.1L34.4 875.5L38.0 876.0L1402.0 876.0L1405.6 875.5L1409.0 874.1L1411.9 871.9L1414.1 869.0L1415.5 865.6L1416.0 862.0L1416.0 810.0L1415.5 806.4L1414.1 803.0L1411.9 800.1L1409.0 797.9L1405.6 796.5L1402.0 796.0L1375.0 796.0L1368.5 795.1L1362.5 792.7L1357.3 788.7L1353.3 783.5L1350.9 777.5L1350.0 771.0L1350.0 69.0L1350.9 62.5L1353.3 56.5L1357.3 51.3L1362.5 47.3L1368.5 44.9L1375.0 44.0L1412.0 44.0L1413.0 43.9L1414.0 43.5L1414.8 42.8L1415.5 42.0L1415.9 41.0L1416.0 40.0L1416.0 28.0L1415.9 27.0L1415.5 26.0L1414.8 25.2L1414.0 24.5L1413.0 24.1L1412.0 24.0L356.0 24.0L352.4 24.5L349.0 25.9L346.1 28.1L343.9 31.0L342.5 34.4L342.0 38.0L342.0 100.0L341.0 107.2L338.2 114.0L333.8 119.8L328.0 124.2L321.2 127.0L314.0 128.0L38.0 128.0L34.4 128.5L31.0 129.9L28.1 132.1L25.9 135.0L24.5 138.4L24.0 142.0L24.0 646.0L24.1 647.0L24.5 648.0L25.2 648.8L26.0 649.5L27.0 649.9L28.0 650.0L65.0 650.0L71.5 650.9L77.5 653.3L82.7 657.3L86.7 662.5L89.1 668.5L90.0 675.0L90.0 765.0L89.1 771.5L86.7 777.5L82.7 782.7L77.5 786.7L71.5 789.1L65.0 790.0L28.0 790.0L27.0 790.1L26.0 790.5L25.2 791.2L24.5 792.0L24.1 793.0L24.0 794.0Z"/>
    </g>
    <g class="frame-light">
      <path fill-rule="evenodd" fill="#e1e1dc" d="M0 0H1440V900H0Z M24.0 862.0L24.5 865.6L25.9 869.0L28.1 871.9L31.0 874.1L34.4 875.5L38.0 876.0L1402.0 876.0L1405.6 875.5L1409.0 874.1L1411.9 871.9L1414.1 869.0L1415.5 865.6L1416.0 862.0L1416.0 810.0L1415.5 806.4L1414.1 803.0L1411.9 800.1L1409.0 797.9L1405.6 796.5L1402.0 796.0L1375.0 796.0L1368.5 795.1L1362.5 792.7L1357.3 788.7L1353.3 783.5L1350.9 777.5L1350.0 771.0L1350.0 69.0L1350.9 62.5L1353.3 56.5L1357.3 51.3L1362.5 47.3L1368.5 44.9L1375.0 44.0L1412.0 44.0L1413.0 43.9L1414.0 43.5L1414.8 42.8L1415.5 42.0L1415.9 41.0L1416.0 40.0L1416.0 28.0L1415.9 27.0L1415.5 26.0L1414.8 25.2L1414.0 24.5L1413.0 24.1L1412.0 24.0L356.0 24.0L352.4 24.5L349.0 25.9L346.1 28.1L343.9 31.0L342.5 34.4L342.0 38.0L342.0 100.0L341.0 107.2L338.2 114.0L333.8 119.8L328.0 124.2L321.2 127.0L314.0 128.0L38.0 128.0L34.4 128.5L31.0 129.9L28.1 132.1L25.9 135.0L24.5 138.4L24.0 142.0L24.0 646.0L24.1 647.0L24.5 648.0L25.2 648.8L26.0 649.5L27.0 649.9L28.0 650.0L65.0 650.0L71.5 650.9L77.5 653.3L82.7 657.3L86.7 662.5L89.1 668.5L90.0 675.0L90.0 765.0L89.1 771.5L86.7 777.5L82.7 782.7L77.5 786.7L71.5 789.1L65.0 790.0L28.0 790.0L27.0 790.1L26.0 790.5L25.2 791.2L24.5 792.0L24.1 793.0L24.0 794.0Z"/>
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
      <path fill-rule="evenodd" fill="#222527" d="M0 0H390V844H0Z M6.5 807.5L7.0 811.1L8.4 814.5L10.6 817.4L13.5 819.6L16.9 821.0L20.5 821.5L369.5 821.5L373.1 821.0L376.5 819.6L379.4 817.4L381.6 814.5L383.0 811.1L383.5 807.5L383.5 750.5L383.4 749.5L383.0 748.5L382.3 747.7L381.5 747.0L380.5 746.6L379.5 746.5L374.6 746.5L372.3 746.2L370.1 745.3L368.2 743.9L366.8 742.0L365.9 739.8L365.6 737.5L365.6 50.3L365.9 48.0L366.8 45.8L368.2 43.9L370.1 42.5L372.3 41.6L374.6 41.3L379.5 41.3L380.5 41.2L381.5 40.8L382.3 40.1L383.0 39.3L383.4 38.3L383.5 37.3L383.5 26.5L383.4 25.5L383.0 24.5L382.3 23.7L381.5 23.0L380.5 22.6L379.5 22.5L106.6 22.5L103.0 23.0L99.6 24.4L96.7 26.6L94.5 29.5L93.1 32.9L92.6 36.5L92.6 92.0L91.6 99.2L88.8 106.0L84.4 111.8L78.6 116.2L71.8 119.0L64.6 120.0L20.5 120.0L16.9 120.5L13.5 121.9L10.6 124.1L8.4 127.0L7.0 130.4L6.5 134.0L6.5 605.6L6.6 606.6L7.0 607.6L7.7 608.4L8.5 609.1L9.5 609.5L10.5 609.6L15.4 609.6L17.7 609.9L19.9 610.8L21.8 612.2L23.2 614.1L24.1 616.3L24.4 618.6L24.4 731.8L24.1 734.1L23.2 736.3L21.8 738.2L19.9 739.6L17.7 740.5L15.4 740.8L10.5 740.8L9.5 740.9L8.5 741.3L7.7 742.0L7.0 742.8L6.6 743.8L6.5 744.8Z"/>
    </g>
    <g class="frame-light">
      <path fill-rule="evenodd" fill="#e1e1dc" d="M0 0H390V844H0Z M6.5 807.5L7.0 811.1L8.4 814.5L10.6 817.4L13.5 819.6L16.9 821.0L20.5 821.5L369.5 821.5L373.1 821.0L376.5 819.6L379.4 817.4L381.6 814.5L383.0 811.1L383.5 807.5L383.5 750.5L383.4 749.5L383.0 748.5L382.3 747.7L381.5 747.0L380.5 746.6L379.5 746.5L374.6 746.5L372.3 746.2L370.1 745.3L368.2 743.9L366.8 742.0L365.9 739.8L365.6 737.5L365.6 50.3L365.9 48.0L366.8 45.8L368.2 43.9L370.1 42.5L372.3 41.6L374.6 41.3L379.5 41.3L380.5 41.2L381.5 40.8L382.3 40.1L383.0 39.3L383.4 38.3L383.5 37.3L383.5 26.5L383.4 25.5L383.0 24.5L382.3 23.7L381.5 23.0L380.5 22.6L379.5 22.5L106.6 22.5L103.0 23.0L99.6 24.4L96.7 26.6L94.5 29.5L93.1 32.9L92.6 36.5L92.6 92.0L91.6 99.2L88.8 106.0L84.4 111.8L78.6 116.2L71.8 119.0L64.6 120.0L20.5 120.0L16.9 120.5L13.5 121.9L10.6 124.1L8.4 127.0L7.0 130.4L6.5 134.0L6.5 605.6L6.6 606.6L7.0 607.6L7.7 608.4L8.5 609.1L9.5 609.5L10.5 609.6L15.4 609.6L17.7 609.9L19.9 610.8L21.8 612.2L23.2 614.1L24.1 616.3L24.4 618.6L24.4 731.8L24.1 734.1L23.2 736.3L21.8 738.2L19.9 739.6L17.7 740.5L15.4 740.8L10.5 740.8L9.5 740.9L8.5 741.3L7.7 742.0L7.0 742.8L6.6 743.8L6.5 744.8Z"/>
    </g>
  </svg>
  <div class="header-inner">
  <div class="head">
    <a class="noise" href="${siteHref("index.html")}">
      <!--<span>O.</span>MIZUKI-->
      Mizuki Oyama.
    </a>
  </div>

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

function initializeHeader() {
  try {
    if (!buildHeader()) return;

    const frameYear = document.getElementById("frameYear");
    if (frameYear) frameYear.textContent = String(new Date().getFullYear());
    setupFramePrev();

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
