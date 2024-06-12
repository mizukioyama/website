document.addEventListener("DOMContentLoaded", function() {
    // ローディング背景を非表示にする
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementById('loading-bg').style.display = 'none';
        }, 2000);

        // テキストのアニメーション効果を実装する
        var elements = document.querySelectorAll('.js_typing');
        elements.forEach(function(element) {
            element.classList.add('endAnime');
        });
    });
});
