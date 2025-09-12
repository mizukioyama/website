// ===== 設定部分 =====
const themeSettings = {
  am: { start: 6, end: 17, theme: "light" }, // 6:00〜17:59 → 白系
  pm: { start: 18, end: 5, theme: "dark" }  // 18:00〜翌5:59 → 黒系
};

// ===== 日本時間を取得 =====
function getJapanHour() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const japanTime = new Date(utc + (9 * 60 * 60000)); // UTC+9
  return japanTime.getHours();
}

// ===== テーマ切り替え =====
function applyTheme() {
  const hour = getJapanHour();
  let theme = "light";

  if (themeSettings.am.start <= hour && hour <= themeSettings.am.end) {
    theme = "light";
  } else {
    theme = "dark";
  }

  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}

// ===== 実行 =====
applyTheme();
// 必要なら1時間ごとにチェック
setInterval(applyTheme, 60 * 60 * 1000);
