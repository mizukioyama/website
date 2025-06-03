jQuery(function ($) {
  $(window).on('load', function () {
    $('html').css('display', 'block');

    // 最後のアニメーション後に少し待ってフェードアウト
    setTimeout(function () {
      $('#loading-bg').fadeOut(800);
    }, 4500); // 3行目のアニメーション完了（3.1s）＋余裕
  });
});
