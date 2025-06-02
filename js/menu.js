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
  document.querySelectorAll("a, .toggle_btn span, .inner a, .head a, #langChenge label").forEach(link => {
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
  const defaultRadio = document.querySelector(`#langChenge input[value="${savedLang}"]`);
  if (defaultRadio) defaultRadio.checked = true;

  switchLanguage(savedLang);

document.querySelectorAll('#langChenge label').forEach(label => {
  label.addEventListener('click', e => {
    e.preventDefault(); // デフォルト動作（#追加）を防止
    const input = document.getElementById(label.getAttribute('for'));
    if (input && !input.checked) {
      input.checked = true;
      switchLanguage(input.value);
    }
  });
});
}

function switchLanguage(lang) {
  document.querySelectorAll('[lang]').forEach(el => {
    el.style.display = (el.lang === lang) ? '' : 'none';
  });
  localStorage.setItem('lang', lang);
}
