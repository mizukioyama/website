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

    // ページごとのコンテンツを挿入
    const content = [
        {
            img: "https://raw.githubusercontent.com/mizukioyama/portfolio.github.io/main/img/230053-2.jpg",
            category: "digital / Exhibition",
            title: "心樹"
        },
        {
            img: "https://raw.githubusercontent.com/mizukioyama/portfolio.github.io/main/img/21ai.jpg",
            category: "digital",
            title: "No title"
        },
        {
            img: "https://raw.githubusercontent.com/mizukioyama/portfolio.github.io/main/img/22ai.jpg",
            category: "digital",
            title: "No title"
        },
        {
            img: "https://raw.githubusercontent.com/mizukioyama/portfolio.github.io/main/img/230052-2.jpg",
            category: "digital",
            title: "No title"
        },
        {
            img: "https://raw.githubusercontent.com/mizukioyama/portfolio.github.io/main/img/230011-2.jpg",
            category: "photo",
            title: "No title"
        },
        {
            img: "https://raw.githubusercontent.com/mizukioyama/portfolio.github.io/main/img/230033-2.jpg",
            category: "digital",
            title: "No title"
        },
        {
            img: "https://raw.githubusercontent.com/mizukioyama/portfolio.github.io/main/img/230029-2.jpg",
            category: "digital",
            title: "No title"
        },
        {
            img: "https://raw.githubusercontent.com/mizukioyama/portfolio.github.io/main/img/20230629.jpg",
            category: "digital",
            title: "No title"
        }
    ];

    let contentHtml = '<div class="content">';
    content.forEach((item, index) => {
        if (index === content.length / 2) {
            contentHtml += '</div><div class="content">';
        }
        contentHtml += `
            <div class="work">
                <a class="works" href="">
                    <img src="${item.img}" alt="Main Image">
                    <span class="dli-external-link"><span></span></span>
                </a>
                <h3>${item.category}</h3>
                <p>Title：${item.title}</p>
            </div>
        `;
    });
    contentHtml += '</div>';

    $('#content-container').html(contentHtml);

    // ページごとのタイトルとh1を設定
    const pageSettings = {
        title: "Art Index",
        heading: "Art Index"
    };

    document.title = pageSettings.title;
    $("#page-heading").text(pageSettings.heading);
});
