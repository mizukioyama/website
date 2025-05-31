class ShuffleText {
    constructor(element) {
        this.element = element;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.originalText = element.textContent; // innerHTML から textContent に変更
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
        this.element.textContent = shuffledText;
    }

    start() {
        const shuffleInterval = setInterval(() => {
            this.shuffle();
        }, 100);

        setTimeout(() => {
            clearInterval(shuffleInterval);
            this.element.textContent = this.originalText;
        }, 2000);
    }
}

jQuery(document).ready(function($) {
    // ページ読み込み完了後にローディング背景を非表示にし、アニメーション実行
    $(window).on('load', function() {
        setTimeout(function() {
            $('#loading-bg').fadeOut(300, function () {
                TypingAnimation(); // ローディング後に強制実行
            });
        }, 1500);
    });

    // タイピングアニメーション処理
    function TypingAnimation() {
        $(".js_typing").each(function() {
            if (!$(this).hasClass("endAnime")) {
                $(this).addClass("endAnime");
                var text = $(this).text();
                $(this).text('');
                var shuffleText = new ShuffleText(this);
                shuffleText.setText(text);
                shuffleText.start();
            }
        });
    }

    // スクロール時も発火（ページ途中からアクセスする可能性あり）
    $(window).scroll(function() {
        TypingAnimation();
    });
});
