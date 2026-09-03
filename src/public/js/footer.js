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
      const footerContainer = document.getElementById('footer-container');
      if (!footerContainer) return;

      footerContainer.innerHTML = data;
      const year = footerContainer.querySelector('#year');
      if (year) {
        year.textContent = String(new Date().getFullYear());
      }
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });
});
