jQuery(function ($) {
  function TypingAnimation() {
    $(".js_typing").each(function () {
      const $this = $(this);
      if (!$this.hasClass("endAnime")) {
        $this.addClass("endAnime");

        const text = $this.text().trim(); // ← 本当に中身があるかチェック
        console.log("Typing text:", text);

        if (text.length === 0) return; // 中身がないなら処理中止

        const shuffle = new ShuffleText(this); // ← this はネイティブ DOM で OK
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
