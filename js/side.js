$(document).ready(function () {
  // サイドバー読み込み
  fetch("sidebar.html")
    .then(response => response.text())
    .then(data => {
      $('#sidebar-container').html(data);
      setupCategoryFilter(); // ← サイドバーが読み込まれた後にイベント設定
    })
    .catch(error => {
      console.error('Error loading sidebar:', error);
    });
});
