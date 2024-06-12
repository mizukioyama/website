document.addEventListener("DOMContentLoaded", function() {
    // ローディング背景を非表示にする
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementById('loading-bg').style.display = 'none';
            TypingAnimation();  // テキストのアニメーション効果を実行
        }, 2000);
    });

    // テキストのアニメーション効果を実装する関数
    function TypingAnimation() {
        var elements = document.querySelectorAll('.js_typing');
        elements.forEach(function(element) {
            element.classList.add('endAnime');
        });
    }
});
