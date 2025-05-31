jQuery(function ($) {
  function TypingAnimation() {
    $(".js_typing").each(function () {
      const $this = $(this);
      if (!$this.hasClass("endAnime")) {
        $this.addClass("endAnime");

        const text = $this.text().trim();
        console.log("Typing text:", text);
        if (text.length === 0) return;

        const shuffle = new ShuffleText(this);
        shuffle.start();
      }
    });
  }

  $(window).on('load', function () {
    setTimeout(function () {
      $('#loading-bg').fadeOut(500, function () {
        // delay for safety
        setTimeout(function () {
          TypingAnimation();
        }, 100);
      });
    }, 1000);
  });

  $(window).on('scroll', function () {
    TypingAnimation();
  });
});
