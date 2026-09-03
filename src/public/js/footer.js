$(document).ready(function () {
  // フッター読み込み
  fetch("footer.html")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Footer request failed: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      $('#footer-container').html(data);
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });
});
