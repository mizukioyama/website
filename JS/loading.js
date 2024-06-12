jQuery(document).ready(function($) {
    // ページの読み込み後にローディング背景を非表示にする
    $(window).on('load', function() {
        setTimeout(function() {
            $('#loading-bg').fadeOut();
        }, 2000);

        // テキストのアニメーション効果を実行
        TypingAnimation();
    });

    // テキストのアニメーション効果を実装する関数
    function TypingAnimation() {
        $(".js_typing").each(function(i) {
            var text = $(this).text(); // テキストを取得
            $(this).text(''); // テキストを空にする
            var shuffleText = new ShuffleText(this); // ShuffleTextのインスタンスを生成
            shuffleText.setText(text); // テキストを設定
            shuffleText.start(); // アニメーションを開始
        });
    }
});
