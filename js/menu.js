document.addEventListener("DOMContentLoaded", function () {
  // 遅延読み込み画像
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = () => img.removeAttribute('data-src');
  });

  // ヘッダー読み込み
  fetch("includes-header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;

      // DOM描画後に初期化
requestAnimationFrame(() => {
  initializeMenu();
  const langModule = new multi_language(); // ← インスタンス生成
  langModule.applyActiveClass(); // ← DOM挿入後に active を反映
  initializeTyping();
});

    });
});


function multi_language() {
  this.currentLang = this.set_current_lang();
  this.applyActiveClass(); // ← ここで初期反映
}

multi_language.prototype.get_lang_lists = function () {
  return document.querySelectorAll("input[type='radio'][name='lang']");
};

multi_language.prototype.set_current_lang = function () {
  const current_lang = localStorage.getItem('preferredLang') || document.documentElement.getAttribute('lang') || 'ja';

  document.documentElement.setAttribute('lang', current_lang);
  this.checked_lang_list(current_lang);

  return current_lang;
};

multi_language.prototype.checked_lang_list = function (current_lang) {
  const elms = this.get_lang_lists();
  for (const elm of elms) {
    elm.checked = elm.value === current_lang;

    if (!elm.dataset.listenerAdded) {
      elm.addEventListener('click', this.click_lang.bind(this));
      elm.dataset.listenerAdded = 'true';
    }
  }
};

multi_language.prototype.click_lang = function (e) {
  const lang = e.target.value;
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('preferredLang', lang);
  this.update_active_class(lang);
};

multi_language.prototype.applyActiveClass = function () {
  this.update_active_class(this.currentLang);
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
