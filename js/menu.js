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
      this.init();
    }

    multi_language.prototype.init = function () {
      const savedLang = localStorage.getItem('preferredLang') || 'ja';
      document.documentElement.setAttribute('lang', savedLang);
      this.setRadioButton(savedLang);
      this.setActiveClass(savedLang);
      this.addEventListeners();
    };

    multi_language.prototype.setRadioButton = function (lang) {
      const radios = document.querySelectorAll("input[type='radio'][name='lang']");
      radios.forEach(radio => {
        radio.checked = (radio.value === lang);
      });
    };

    multi_language.prototype.setActiveClass = function (lang) {
      const jaDiv = document.querySelector('#langChenge .ja');
      const enDiv = document.querySelector('#langChenge .en');
      if (jaDiv && enDiv) {
        jaDiv.classList.toggle('active', lang === 'ja');
        enDiv.classList.toggle('active', lang === 'en');
      }
    };

    multi_language.prototype.addEventListeners = function () {
      const radios = document.querySelectorAll("input[type='radio'][name='lang']");
      radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          const lang = e.target.value;
          document.documentElement.setAttribute('lang', lang);
          localStorage.setItem('preferredLang', lang);
          this.setActiveClass(lang);
        });
      });
    };

    // 初期化
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
