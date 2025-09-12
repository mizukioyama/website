function applyTheme() {
  const body = document.body;
  if (!body) return; // 念のためガード

  const hour = getJapanHour();
  let theme = "light";

  if (themeSettings.am.start <= hour && hour <= themeSettings.am.end) {
    theme = "light";
  } else {
    theme = "dark";
  }

  if (theme === "dark") {
    body.classList.add("dark-theme");
  } else {
    body.classList.remove("dark-theme");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  setInterval(applyTheme, 60 * 60 * 1000);
});
