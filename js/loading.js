jQuery(function ($) {
  $(window).on('load', function () {
    $('html').css('display', 'block'); // ← 保険的に追加
    setTimeout(function () {
      $('#loading-bg').fadeOut(800);
    }, 2500);
  });
});
