$(document).ready(function () {
  // フッター読み込み
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      $('#footer-container').html(data);
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });
});
