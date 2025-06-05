document.addEventListener("DOMContentLoaded", function () {
  // 遅延画像読み込み
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = () => img.removeAttribute('data-src');
  });

  // ヘッダー読み込み
  fetch("includes-header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;

      // 読み込み後に必要な処理を実行
      requestAnimationFrame(() => {
        initializeMenu();
        initializeLang(); // ← 言語切り替え初期化
        initializeTyping();
      });
    });
});


// ✅ 言語切り替え初期化関数（完全対応）
function initializeLang() {
  const langJaRadio = document.getElementById("lang-ja");
  const langEnRadio = document.getElementById("lang-en");
  const jaLabel = document.querySelector("label.ja");
  const enLabel = document.querySelector("label.en");

  if (!langJaRadio || !langEnRadio || !jaLabel || !enLabel) {
    console.warn("言語切り替え要素が見つかりません。");
    return;
  }

  // 現在の言語を取得（localStorage または HTML）
  const savedLang = localStorage.getItem("preferredLang") || document.documentElement.getAttribute("lang") || "ja";
  applyLang(savedLang);

  // イベント設定（切り替え時）
  langJaRadio.addEventListener("change", () => applyLang("ja"));
  langEnRadio.addEventListener("change", () => applyLang("en"));

  // 言語適用処理
  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("preferredLang", lang);

    // ラジオボタン状態反映
    langJaRadio.checked = lang === "ja";
    langEnRadio.checked = lang === "en";

    // アクティブクラス付け替え
    jaLabel.classList.toggle("active", lang === "ja");
    enLabel.classList.toggle("active", lang === "en");

    // テキスト切り替えなどしたい場合はここで実行
    // switchLanguageText(lang); ← 別関数化も可能
  }
}


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
