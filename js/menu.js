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



document.addEventListener('DOMContentLoaded', () => {
  const langInputs = document.querySelectorAll('input[name="lang"]');
  const jaLabel = document.querySelector('#langChenge .ja');
  const enLabel = document.querySelector('#langChenge .en');

  // 言語を切り替える関数
  function switchLanguage(lang) {
    // 表示の切り替え
    document.querySelectorAll('[lang]').forEach(el => {
      el.style.display = (el.lang === lang) ? '' : 'none';
    });

    // アクティブクラスの付け替え
    jaLabel.classList.remove('active');
    enLabel.classList.remove('active');
    if (lang === 'ja') {
      jaLabel.classList.add('active');
    } else if (lang === 'en') {
      enLabel.classList.add('active');
    }

    // 言語情報を保存
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }

  // ラジオボタンにイベントを設定
  langInputs.forEach(input => {
    input.addEventListener('change', () => {
      switchLanguage(input.value);
    });
  });

  // 初期化：保存された言語を読み込み
  const savedLang = localStorage.getItem('lang') || 'ja';
  const defaultInput = document.querySelector(`input[name="lang"][value="${savedLang}"]`);
  if (defaultInput) {
    defaultInput.checked = true;
    switchLanguage(savedLang);
  }
});
