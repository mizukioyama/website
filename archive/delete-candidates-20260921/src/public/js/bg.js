// bg.js (完全な動作例)

// 設定（好きに変えてください）
const themeSettings = {
  am: { start: 6, end: 17 },   // 6:00〜17:59 を AM (白系)
  pm: { start: 18, end: 5 }    // 18:00〜翌5:59 を PM (黒系)
};

// 日本時間の「時」を返す（関数宣言にしておくと安全）
function getJapanHour() {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const jst = new Date(utcMs + (9 * 60 * 60000)); // UTC+9
  return jst.getHours();
}

// 時間が start〜end の範囲にあるかを判定（start が end より大きい＝跨ぎの判定対応）
function isInRange(hour, start, end) {
  if (start <= end) {
    return hour >= start && hour <= end;
  } else {
    // 例: start=18, end=5 のように日をまたぐ
    return hour >= start || hour <= end;
  }
}

function applyTheme() {
  const elements = document.querySelectorAll("body, .modal-box"); // ← body と .modal-box 両方
  if (!elements.length) return;

  const hour = getJapanHour();
  let theme = "light";

  if (isInRange(hour, themeSettings.am.start, themeSettings.am.end)) {
    theme = "light";
  } else {
    theme = "dark";
  }

  elements.forEach(el => {
    el.classList.remove("light-theme", "dark-theme");
    el.classList.add(theme + "-theme");
  });
}

// DOM が読み込まれてから実行（head に置く場合でも defer を併用するか、このイベントリスナを使えば安全）
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  // 1時間ごとにチェック（必要なら頻度を変えてください）
  setInterval(applyTheme, 60 * 60 * 1000);
});
