console.log('Menu script loaded');

document.addEventListener("DOMContentLoaded", function () {
  // カーソル生成
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  document.body.appendChild(cursor);

  const stalker = document.createElement("div");
  stalker.id = "stalker";
  document.body.appendChild(stalker);

  // ホバー対象にカーソルクラス追加
  document.querySelectorAll("a, .open .toggle_btn span, #navArea .inner li a, header .head a, #langChenge label").forEach(link => {
    link.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor--hover");
      stalker.classList.add("stalker--hover");
    });
    link.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor--hover");
      stalker.classList.remove("stalker--hover");
    });
  });

  // カーソル位置追従
  document.addEventListener("mousemove", e => {
    const { clientX: x, clientY: y } = e;
    cursor.style.opacity = "1";
    cursor.style.top = y + "px";
    cursor.style.left = x + "px";

    setTimeout(() => {
      stalker.style.opacity = "1";
      stalker.style.top = y + "px";
      stalker.style.left = x + "px";
    }, 150);
  });

  // 遅延読み込み画像
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = () => img.removeAttribute('data-src');
  });

  // 言語切り替えの初期化
  initializeLanguageSwitcher();

  // タイピングアニメーション
  setupTypingAnimation();

  // ヘッダー読み込み + メニュー初期化
  fetch("includes-header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;
      initializeMenu(); // header内にメニューが含まれるため、再初期化
    });
});

// メニューの初期化関数
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

// 言語切り替え
function initializeLanguageSwitcher() {
  const savedLang = localStorage.getItem('lang') || 'ja';
  const defaultRadio = document.getElementById(savedLang === 'en' ? 'langEn' : 'langJa');
  if (defaultRadio) defaultRadio.checked = true;

  switchLanguage(savedLang);

  document.querySelectorAll('#langChenge input[name="lang"]').forEach(radio => {
    radio.addEventListener('change', () => {
      switchLanguage(radio.id === 'langEn' ? 'en' : 'ja');
    });
  });
}

function switchLanguage(lang) {
  document.querySelectorAll('[lang]').forEach(el => {
    el.style.display = (el.lang === lang) ? '' : 'none';
  });
  localStorage.setItem('lang', lang);
}

// タイピングアニメーション
function setupTypingAnimation() {
  document.querySelectorAll(".typing").forEach(el => {
    const text = el.textContent.trim();
    let html = '';

    const words = text.split(' ');
    words.forEach((word, wi) => {
      [...word].forEach(char => {
        html += `<span>${char}</span>`;
      });
      if (wi < words.length - 1) html += '<span>&nbsp;</span>';
    });

    el.innerHTML = html;

    el.querySelectorAll("span").forEach((span, i) => {
      const time = 100;
      setTimeout(() => {
        span.style.display = 'inline';
        span.style.opacity = 1;
      }, time * i);
    });

    if (!el.classList.contains('menu-animation-target')) {
      const parent = el.parentElement;
      const positionX = Math.random() * (parent.offsetWidth - el.offsetWidth);
      const positionY = Math.random() * (parent.offsetHeight - el.offsetHeight);
      el.style.position = 'absolute';
      el.style.left = `${positionX}px`;
      el.style.top = `${positionY}px`;
    }

    if (el.classList.contains('animation1')) {
      el.classList.add('animation1-style');
    } else if (el.classList.contains('animation2')) {
      el.classList.add('animation2-style');
    }
  });
}
