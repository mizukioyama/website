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
  document.querySelectorAll("body a, .toggle_btn span, #navArea .inner li a").forEach(link => {
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




switch (document.readyState) {
  case 'complete':
    new multi_language();
    break;
  default:
    window.addEventListener('load', () => {
      new multi_language();
    });
}

function multi_language() {
  this.set_current_lang();
}

multi_language.prototype.get_lang_lists = function () {
  return document.querySelectorAll("input[type='radio'][name='lang']");
};

multi_language.prototype.set_current_lang = function () {
  const current_lang = document.querySelector('html').getAttribute('lang');
  this.checked_lang_list(current_lang);
  this.update_active_class(current_lang); // ← 初期表示で .active を反映
};

multi_language.prototype.checked_lang_list = function (current_lang) {
  const elms = this.get_lang_lists();
  for (const elm of elms) {
    if (elm.value === current_lang) {
      elm.checked = true;
    }
    elm.addEventListener('click', this.click_lang.bind(this));
  }
};

multi_language.prototype.click_lang = function (e) {
  const lang = e.target.value;
  document.querySelector('html').setAttribute('lang', lang);
  this.update_active_class(lang); // ← 切り替え時に .active を更新
};

multi_language.prototype.update_active_class = function (lang) {
  const jaDiv = document.querySelector('#langChenge .ja');
  const enDiv = document.querySelector('#langChenge .en');

  if (jaDiv && enDiv) {
    jaDiv.classList.toggle('active', lang === 'ja');
    enDiv.classList.toggle('active', lang === 'en');
  }
};
