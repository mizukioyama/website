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



function updateLangVisualState() {
  const currentLang = document.querySelector('input[name="lang"]:checked').value;

  // 全ての .ja / .en から active を削除
  document.querySelectorAll('#langChenge .ja, #langChenge .en').forEach(el => {
    el.classList.remove('active');
  });

  // 現在選択されている言語に active を追加
  if (currentLang === 'ja') {
    document.querySelector('#langChenge .ja').classList.add('active');
  } else if (currentLang === 'en') {
    document.querySelector('#langChenge .en').classList.add('active');
  }
}

// ラジオボタンの変更時に実行
document.querySelectorAll('input[name="lang"]').forEach(input => {
  input.addEventListener('change', updateLangVisualState);
});

// 初期実行
updateLangVisualState();
