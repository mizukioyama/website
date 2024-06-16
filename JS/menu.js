// menu.jsの内容
console.log('Menu script loaded');
//Cursor
$(function() {
    // カーソル要素の取得
    var cursor = $("#cursor");
    var stalker = $("#stalker");

    // aタグのホバーイベント
    $("a").hover(
        function() {
            cursor.addClass('cursor--hover');
            stalker.addClass('stalker--hover');
        },
        function() {
            cursor.removeClass('cursor--hover');
            stalker.removeClass('stalker--hover');
        }
    );

    // マウスムーブイベント
    $(document).on("mousemove", function(e) {
        var x = e.clientX;
        var y = e.clientY;
        cursor.css({
            "opacity": "1",
            "top": y + "px",
            "left": x + "px"
        });

        setTimeout(function() {
            stalker.css({
                "opacity": "1",
                "top": y + "px",
                "left": x + "px"
            });
        }, 150);
    });
});


// メニュー
jQuery(document).ready(function($) {
    var $nav = $('#navArea');
    var $btn = $('.toggle_btn');
    var $mask = $('#mask');
    var open = 'open';

    $btn.on('click', function() {
        if (!$nav.hasClass(open)) {
            $nav.addClass(open);
        } else {
            $nav.removeClass(open);
        }
    });

    $mask.on('click', function() {
        $nav.removeClass(open);
    });
});

// img
(function() {
    document.addEventListener("DOMContentLoaded", function() {
        var lazyImages = document.querySelectorAll('img[data-src]');

        lazyImages.forEach(function(img) {
            img.setAttribute('src', img.getAttribute('data-src'));
            img.onload = function() {
                img.removeAttribute('data-src');
            };
        });
    });
})();

// タイピング
$(window).on('load', function() {
    $(".typing").each(function() {
        var text = $(this).text();
        var textbox = "";
        var words = text.split(' ');

        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            for (var j = 0; j < word.length; j++) {
                textbox += '<span>' + word[j] + '</span>';
            }
            if (i < words.length - 1) {
                textbox += '<span>&nbsp;</span>';
            }
        }
        $(this).html(textbox);

        $(".typing span").each(function(i) {
            var time = 100;
            $(this).delay(time * i).fadeIn(time);
        });

        if (!$(this).hasClass('menu-animation-target')) {
            var positionX = Math.random() * ($(this).parent().width() - $(this).width());
            var positionY = Math.random() * ($(this).parent().height() - $(this).height());
            $(this).css({ 'left': positionX, 'top': positionY });
        }

        if ($(this).hasClass('animation1')) {
            $(this).addClass('animation1-style');
        } else if ($(this).hasClass('animation2')) {
            $(this).addClass('animation2-style');
        }
    });
});

// header
document.addEventListener("DOMContentLoaded", function() {
    fetch("includes-header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            // ヘッダーに必要なJavaScriptをここで初期化
            const toggleBtn = document.querySelector('.toggle_btn');
            const navArea = document.getElementById('navArea');
            const mask = document.getElementById('mask');

            toggleBtn.addEventListener('click', function() {
                navArea.classList.toggle('open');
            });

            mask.addEventListener('click', function() {
                navArea.classList.remove('open');
            });
        });
});

// sidebar
document.addEventListener("DOMContentLoaded", function() {
    fetch("includes-sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;
        });
});
