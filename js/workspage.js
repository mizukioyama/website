$(document).ready(function() {
    // サイドバーの読み込み
    fetch("includes-sidebar.html")
        .then(response => response.text())
        .then(data => {
            $('#sidebar-container').html(data);
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
        });

    // フッターの読み込み
    fetch("includes-footer.html")
        .then(response => response.text())
        .then(data => {
            $('#footer-container').html(data);
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});
