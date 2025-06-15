document.addEventListener("DOMContentLoaded", function () {
  // 遅延読み込み画像
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = () => img.removeAttribute('data-src');
  });

  // ヘッダー読み込み
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;

      requestAnimationFrame(() => {
        initializeMenu();
        new multi_language(); // 言語初期化
        initializeTyping();
      });
    });
});

// =======================
// 多言語対応クラス
// =======================
let currentLang = localStorage.getItem("lang") || "ja";
const getLang = () => currentLang;

function multi_language() {
  this.set_current_lang();
}

multi_language.prototype.get_lang_lists = function () {
  return document.querySelectorAll("input[type='radio'][name='lang']");
};

multi_language.prototype.set_current_lang = function () {
  const storedLang = localStorage.getItem('selectedLang') || 'ja';
  document.querySelector('html').setAttribute('lang', storedLang);
  this.checked_lang_list(storedLang);
  this.update_active_class(storedLang);
};

multi_language.prototype.checked_lang_list = function (current_lang) {
  const elms = this.get_lang_lists();
  for (const elm of elms) {
    elm.checked = elm.value === current_lang;
    elm.addEventListener('click', this.click_lang.bind(this));
  }
};

multi_language.prototype.click_lang = function (e) {
  const lang = e.target.value;
  document.querySelector('html').setAttribute('lang', lang);
  localStorage.setItem('selectedLang', lang);
  this.update_active_class(lang);
};

multi_language.prototype.update_active_class = function (lang) {
  // ボタンのactive切り替え
  const jaDiv = document.querySelector('#langChenge .ja');
  const enDiv = document.querySelector('#langChenge .en');
  if (jaDiv && enDiv) {
    jaDiv.classList.toggle('active', lang === 'ja');
    enDiv.classList.toggle('active', lang === 'en');
  }

  // <p lang="xx">の切り替え
  document.querySelectorAll('h2[lang],h3[lang],h4[lang],p[lang],div[lang],hr[lang]').forEach(p => {
    p.style.display = (p.getAttribute('lang') === lang) ? 'block' : 'none';
  });
};

// =======================
// メニュー初期化
// =======================
function initializeMenu() {
  const nav = document.getElementById('navArea');
  const btn = document.querySelector('.toggle_btn');
  const mask = document.getElementById('mask');
  const open = 'open';

  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle(open);
    });
  }

  if (mask && nav) {
    mask.addEventListener('click', () => {
      nav.classList.remove(open);
    });
  }
}


//右クリック阻止
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
});
