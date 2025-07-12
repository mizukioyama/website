// 画面ロード時とリサイズ時にビューポート高さをセット
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);
window.addEventListener('DOMContentLoaded', setViewportHeight);
