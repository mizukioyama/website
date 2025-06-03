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

      // innerHTMLの内容が反映された後に初期化
      initializeMenu();
      new multi_language(); // 多言語切り替えもここで確実に初期化
      initializeTyping();   // タイピングアニメーションもここで初期化
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
  let current_lang = document.querySelector('html').getAttribute('lang');

  // 初期状態では ja をデフォルトとする
  if (!current_lang) {
    current_lang = 'ja';
    document.querySelector('html').setAttribute('lang', current_lang);
  }

  this.checked_lang_list(current_lang);
  this.update_active_class(current_lang);
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

// DOM読み込み後に初期化
document.addEventListener('DOMContentLoaded', () => {
  new multi_language();
});


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
          }, 800);
        }
      }, 600);
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
