import $ from "jquery";

$(document).ready(function () {
    // サイドバーの読み込み
    fetch("sidebar.html")
        .then(response => response.text())
        .then(data => {
            $('#sidebar-container').html(data);
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
        });


    // フッターの読み込み
    fetch("./footer.html")
        .then(response => {
            if (!response.ok) throw new Error('HTTP error: ' + response.status);
            return response.text();
        })
        .then(data => {
            $('#footer-container').html(data);
            console.log("footer loaded!");
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});
