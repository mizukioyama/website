class ShuffleText {
    constructor(element) {
        this.element = element;
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.originalText = element.textContent;
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
        let count = 0;
        const maxCount = 20;
        const interval = 100;
        const shuffleInterval = setInterval(() => {
            this.shuffle();
            count++;
            if (count >= maxCount) {
                clearInterval(shuffleInterval);
                this.element.textContent = this.originalText;
            }
        }, interval);
    }
}

jQuery(document).ready(function($) {

    function TypingAnimation() {
        $(".js_typing").each(function () {
            const $el = $(this);
            if (!$el.hasClass("endAnime")) {
                const text = $el.text();
                $el.text('');
                $el.addClass("endAnime"); // opacity: 1 にする
                $el.css("opacity", 1);     // 念のため明示的に設定

                const shuffleText = new ShuffleText(this);
                shuffleText.setText(text);
                shuffleText.start();
            }
        });
    }

    $(window).on('load', function () {
        setTimeout(function () {
            $('#loading-bg').fadeOut(300, function () {
                TypingAnimation();
            });
        }, 1500);
    });

    $(window).scroll(function () {
        TypingAnimation();
    });
});
