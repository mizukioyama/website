document.addEventListener("DOMContentLoaded", function () {
  // 遅延読み込み画像
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = () => img.removeAttribute('data-src');
  });

  // ヘッダー読み込み + 多言語・メニュー・タイピング初期化
  fetch("includes-header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;

      // DOMがレンダリングされてから初期化（確実に待つ）
      requestAnimationFrame(() => {
        initializeMenu();
        const langModule = new multi_language(); // ← インスタンスを保持
        langModule.applyActiveClass(); // ← 明示的に active を反映
        initializeTyping();
      });
    });
});


// ✅ 言語切り替え初期化関数（完全対応）
    function multi_language() {
      this.set_current_lang();
    }

    multi_language.prototype.get_lang_lists = function () {
      return document.querySelectorAll("input[type='radio'][name='lang']");
    };

    multi_language.prototype.set_current_lang = function () {
      // 初期言語をローカルストレージから取得、なければ "ja"
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
      localStorage.setItem('selectedLang', lang); // 選択を永続保存
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
    window.addEventListener('DOMContentLoaded', () => {
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
