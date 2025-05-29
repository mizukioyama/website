// menu.jsの内容
console.log('Menu script loaded');

document.addEventListener("DOMContentLoaded", function() {
    var cursor = document.createElement("div");
    cursor.id = "cursor";
    document.body.appendChild(cursor);

    var stalker = document.createElement("div");
    stalker.id = "stalker";
    document.body.appendChild(stalker);

    document.querySelectorAll("a").forEach(function(link) {
        link.addEventListener("mouseenter", function() {
            cursor.classList.add("cursor--hover");
            stalker.classList.add("stalker--hover");
        });
        link.addEventListener("mouseleave", function() {
            cursor.classList.remove("cursor--hover");
            stalker.classList.remove("stalker--hover");
        });
    });

    document.addEventListener("mousemove", function(e) {
        var x = e.clientX;
        var y = e.clientY;
        cursor.style.opacity = "1";
        cursor.style.top = y + "px";
        cursor.style.left = x + "px";

        setTimeout(function() {
            stalker.style.opacity = "1";
            stalker.style.top = y + "px";
            stalker.style.left = x + "px";
        }, 150);
    });

    // メニューの初期化
    initializeMenu();

    // 画像の遅延読み込み
    var lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(function(img) {
        img.setAttribute('src', img.getAttribute('data-src'));
        img.onload = function() {
            img.removeAttribute('data-src');
        };
    });

    // タイピングアニメーション
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

// メニューの初期化関数
function initializeMenu() {
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
}

// ヘッダーの読み込みと初期化
document.addEventListener("DOMContentLoaded", function() {
    fetch("includes-header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            // メニューの初期化を再度呼び出し
            initializeMenu();
        });
});



//言語
  function switchLanguage(lang) {
    document.querySelectorAll('[lang]').forEach(el => {
      el.style.display = (el.lang === lang) ? '' : 'none';
    });
    localStorage.setItem('lang', lang);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'ja';
    document.getElementById(savedLang === 'en' ? 'langEn' : 'langJa').checked = true;
    switchLanguage(savedLang);

    document.querySelectorAll('#langChenge input[name="lang"]').forEach(radio => {
      radio.addEventListener('change', () => {
        switchLanguage(radio.id === 'langEn' ? 'en' : 'ja');
      });
    });
  });
