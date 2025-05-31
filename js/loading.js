class ShuffleText {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.frame = 0;
    this.requestId = null;
    this.update = this.update.bind(this);
  }

  start() {
    this.frame = 0;
    this.requestId = requestAnimationFrame(this.update);
  }

  update() {
    const progress = this.frame / 60; // 約1秒で完了
    const output = this.originalText.split('').map((char, i) => {
      if (i < progress * this.originalText.length) {
        return char;
      } else {
        return this.randomChar();
      }
    }).join('');
    this.element.textContent = output;

    if (progress >= 1) {
      this.element.textContent = this.originalText;
      cancelAnimationFrame(this.requestId);
    } else {
      this.frame++;
      this.requestId = requestAnimationFrame(this.update);
    }
  }

  randomChar() {
    return this.chars.charAt(Math.floor(Math.random() * this.chars.length));
  }
}

jQuery(function ($) {
  function TypingAnimation() {
    $(".js_typing").each(function () {
      if (!$(this).hasClass("endAnime")) {
        $(this).addClass("endAnime");
        const shuffle = new ShuffleText(this);
        shuffle.start();
      }
    });
  }

  // ローディング後に発動
  $(window).on('load', function () {
    setTimeout(function () {
      $('#loading-bg').fadeOut(500, function () {
        TypingAnimation();
      });
    }, 1000); // ローディング表示の長さ
  });

  // スクロールしても一度だけ発動
  $(window).on('scroll', function () {
    TypingAnimation();
  });
});
