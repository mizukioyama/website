document.addEventListener("DOMContentLoaded", function () {
  // 遅延読み込み画像
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = () => img.removeAttribute('data-src');
  });

  // ヘッダー読み込み + メニューと多言語の初期化
  fetch("includes-header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;

      // 少し遅らせて初期化（DOMの構築を完全に待つ）
      setTimeout(() => {
        initializeMenu();
        new multi_language();  // 多言語切り替えを正しく初期化
        initializeTyping();
      }, 0); // もしくは setTimeout(..., 10) でもOK
    });
});


// 多言語処理クラス
function multi_language() {
  this.set_current_lang();
}

multi_language.prototype.get_lang_lists = function () {
  return document.querySelectorAll("input[type='radio'][name='lang']");
};

multi_language.prototype.set_current_lang = function () {
  // localStorage に保存された言語を優先して取得
  let current_lang = localStorage.getItem('preferredLang') || document.querySelector('html').getAttribute('lang');

  // 初期状態では ja をデフォルトとする
  if (!current_lang) {
    current_lang = 'ja';
  }

  // html の lang 属性を更新
  document.querySelector('html').setAttribute('lang', current_lang);

  this.checked_lang_list(current_lang);
  this.update_active_class(current_lang);
};

multi_language.prototype.checked_lang_list = function (current_lang) {
  const elms = this.get_lang_lists();
  for (const elm of elms) {
    elm.checked = elm.value === current_lang;

    // 一度だけイベントを追加（複数回初期化しないように）
    if (!elm.dataset.listenerAdded) {
      elm.addEventListener('click', this.click_lang.bind(this));
      elm.dataset.listenerAdded = 'true'; // フラグを追加して2重登録防止
    }
  }
};

multi_language.prototype.click_lang = function (e) {
  const lang = e.target.value;

  // lang を html に設定
  document.querySelector('html').setAttribute('lang', lang);

  // localStorage に保存
  localStorage.setItem('preferredLang', lang);

  this.update_active_class(lang);
};

multi_language.prototype.update_active_class = function (lang) {
  const jaDiv = document.querySelector('#langChenge .ja');
  const enDiv = document.querySelector('#langChenge .en');

  if (jaDiv && enDiv) {
    jaDiv.classList.toggle('active', lang === 'ja');
    enDiv.classList.toggle('active', lang === 'en');
  }
};


// メニュー初期化関数
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

// タイピングアニメーション初期化関数
function initializeTyping() {
  const lines = document.querySelectorAll('.typing-line');
  const typingSpeed = 50;

  function typeLine(lineEl, text, callback) {
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        lineEl.textContent += text[i++];
        setTimeout(typeChar, typingSpeed);
      } else {
        callback();
      }
    }
    typeChar();
  }

  function typeAllLines(index = 0) {
    if (index >= lines.length) {
      setTimeout(() => {
        const loadingBg = document.getElementById('loading-bg');
        if (loadingBg) {
          loadingBg.style.transition = 'opacity 0.8s';
          loadingBg.style.opacity = 0;
          setTimeout(() => {
            loadingBg.style.display = 'none';
          }, 1000);
        }
      }, 800);
      return;
    }

    const line = lines[index];
    const text = line.dataset.text;
    typeLine(line, text, () => typeAllLines(index + 1));
  }

  if (lines.length > 0) {
    typeAllLines();
  }
}
