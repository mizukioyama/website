$(document).ready(function() {
    // ヘッダーの読み込み
    fetch("art-template.html")
        .then(response => response.text())
        .then(data => {
            $('#header-container').html(data);
        });

    // サイドバーの読み込み
    fetch("includes-sidebar.html")
        .then(response => response.text())
        .then(data => {
            $('#sidebar-container').html(data);
        });

    // フッターの読み込み
    fetch("includes-footer.html")
        .then(response => response.text())
        .then(data => {
            $('#footer-container').html(data);
        });


    // ページごとのタイトルとh1を設定
    const pageSettings = {
        title: "Art Index",
        heading: "Art Index"
    };

    document.title = pageSettings.title;
    $("#page-heading").text(pageSettings.heading);

    // コンテンツを挿入
    insertContent();
});