jQuery(function ($) {
  $(window).on('load', function () {
    $('html').css('display', 'block');
    
    // タイピング完了後にフェードアウト (6s + 少し余裕をもたせて 6.5秒)
    setTimeout(function () {
      $('#loading-bg').fadeOut(800);
    }, 6500);
  });
});
