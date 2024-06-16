// jQueryがロードされるまで待機する
function waitForJQuery(callback) {
    if (window.jQuery) {
        callback(jQuery);
    } else {
        setTimeout(function () {
            waitForJQuery(callback);
        }, 50);
    }
}

// jQueryがロードされた後に実行する関数
waitForJQuery(function ($) {
    $(document).ready(function () {
        const slideElements = ['.back__slide', '.card__slide', '.content__slide'];
        let inProgress = false;

        const goToSlide = (slideElements, index) => {
            if (!inProgress) {
                inProgress = true;

                $('.active').addClass('exit');
                $('.active').removeClass('active');
                slideElements.forEach(elem => {
                    $(`${elem}:nth-child(${index})`).addClass('active');
                })

                const evenSlide = index % 2 === 0;
                if (evenSlide)
                    $('.content__ping').addClass('content__ping--right');
                else
                    $('.content__ping').removeClass('content__ping--right');
                $('.content__ping--noanimation').removeClass('content__ping--noanimation');

                setTimeout(() => $('.exit').removeClass('exit'), 1500);
                setTimeout(() => inProgress = false, 3000);
            }
        }

        $('.content__slide:nth-child(1) .button').on('click', () => goToSlide(slideElements, 2));
        $('.content__slide:nth-child(2) .button').on('click', () => goToSlide(slideElements, 1));

        setTimeout(() => goToSlide(slideElements, 2), 2000);
        setTimeout(() => goToSlide(slideElements, 1), 6000);
    });
});

$(document).ready(function() {
    function updateParisTime() {
        // パリのタイムゾーンを考慮した現在時刻を取得
        var now = new Date();
        var utc = now.getTime() + (now.getTimezoneOffset() * 6000);
        var parisTime = new Date(utc + (3600000 * 2)); // UTC+2（夏時間）またはUTC+1（冬時間）を調整

        // 時間、分、秒をフォーマット
        var hours = parisTime.getHours().toString().padStart(2, '0');
        var minutes = parisTime.getMinutes().toString().padStart(2, '0');
        var seconds = parisTime.getSeconds().toString().padStart(2, '0');

        // フォーマットされた時間を表示
        $('#paris-time').text(`${hours}:${minutes}:${seconds}`);
    }

    // 1秒ごとに更新
    setInterval(updateParisTime, 1000);

    // 初回の表示更新
    updateParisTime();
});