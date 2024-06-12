document.addEventListener("DOMContentLoaded", function() {
    // ローディング背景を非表示にする
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementById('loading-bg').style.display = 'none';
        }, 2000);

        // ページ読み込み時にテキストアニメーションを実行
        TypingAnimation();
    });

    // テキストのアニメーション効果を実装する関数
    function TypingAnimation() {
        var elements = document.querySelectorAll('.js_typing');
        elements.forEach(function(element) {
            if (!element.classList.contains('endAnime')) {
                element.classList.add('endAnime');
            }
        });
    }
});
