class ShuffleText {
    constructor(element) {
        this.element = element;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.originalText = element.innerHTML;
    }

    setText(text) {
        this.originalText = text;
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    shuffle() {
        let shuffledText = '';
        for (let i = 0; i < this.originalText.length; i++) {
            shuffledText += this.randomChar();
        }
        this.element.innerHTML = shuffledText;
    }

    start() {
        const shuffleInterval = setInterval(() => {
            this.shuffle();
        }, 100);

        setTimeout(() => {
            clearInterval(shuffleInterval);
            this.element.innerHTML = this.originalText;
        }, 2000);
    }
}

jQuery(document).ready(function($) {
    // ページの読み込み後にローディング背景を非表示にする
    $(window).on('load', function() {
        setTimeout(function() {
            $('#loading-bg').fadeOut();
        }, 1500);
    });

    // テキストのアニメーション効果を実装する関数
    function TypingAnimation() {
        $(".js_typing").each(function(i) {
            var elemPos = $(this).offset().top - 50; // 要素より、50px上の位置
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if (scroll >= elemPos - windowHeight) {
                if (!$(this).hasClass("endAnime")) {
                    $(this).addClass("endAnime"); // アニメーションが終了したことを示すクラスを追加
                    var text = $(this).text(); // テキストを取得
                    $(this).text(''); // テキストを空にする
                    var shuffleText = new ShuffleText(this); // ShuffleTextのインスタンスを生成
                    $(this).append(shuffleText); // ShuffleTextを要素に追加
                    shuffleText.setText(text); // テキストを設定
                    shuffleText.start(); // アニメーションを開始
                }
            }
        });
    }

    // 画面をスクロールしたときのイベント
    $(window).scroll(function() {
        TypingAnimation(); // テキストのアニメーション効果を実行
    });

    // ページが読み込まれたときのイベント
    $(window).on("load", function() {
        TypingAnimation(); // テキストのアニメーション効果を実行
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const pageLinks = document.querySelectorAll('.page-link');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentPage = 1;
    const totalPages = pageLinks.length;

    function updatePagination() {
        pageLinks.forEach(link => {
            const page = parseInt(link.getAttribute('data-page'));
            if (page === currentPage) {
                link.classList.add('disabled');
            } else {
                link.classList.remove('disabled');
            }
        });
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        const targetLink = document.querySelector(`.page-link[data-page="${page}"]`);
        window.location.href = targetLink.href;
    }

    pageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = parseInt(event.target.getAttribute('data-page'));
            currentPage = page;
            updatePagination();
            goToPage(page);
        });
    });

    leftArrow.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            goToPage(currentPage);
        }
    });

    rightArrow.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            goToPage(currentPage);
        }
    });

    updatePagination();
});
