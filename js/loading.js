jQuery(function ($) {
  $(window).on('load', function () {
    setTimeout(function () {
      $('#loading-bg').fadeOut(500);
    }, 2500); // タイピングアニメーション完了後にfadeOut
  });
});
