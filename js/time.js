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

// jQueryがロードされた後にすべて実行
waitForJQuery(function ($) {
    const initializeHomeSlides = () => {
        // スライド処理
        const slideElements = ['.back__slide', '.card__slide', '.content__slide'];
        const syncContentControls = () => {
            $('.content__ping').attr('data-home-slide', $('.content__slide').first().hasClass('active') ? '2' : '1');
            $('.content__slide').each((_, element) => {
                const active = element.classList.contains('active');
                element.inert = !active;
                element.setAttribute('aria-hidden', String(!active));
            });
        };
        syncContentControls();
        let inProgress = false;

        const goToSlide = (slideElements, index) => {
            if (!inProgress) {
                inProgress = true;

                $('.active').addClass('exit');
                $('.active').not('#langChange .active').removeClass('active');
                slideElements.forEach(elem => {
                    $(`${elem}:nth-child(${index})`).addClass('active');
                });

                syncContentControls();
                const evenSlide = index % 2 === 0;
                if (evenSlide)
                    $('.content__ping').addClass('content__ping--right');
                else
                    $('.content__ping').removeClass('content__ping--right');
                $('.content__ping--noanimation').removeClass('content__ping--noanimation');

                setTimeout(() => $('.exit').removeClass('exit'), 1500);
                setTimeout(() => inProgress = false, 3000);
            }
        };

        $('.card [data-home-slide]').on('click', function () {
            goToSlide(slideElements, Number(this.dataset.homeSlide));
        });

        setTimeout(() => goToSlide(slideElements, 2), 2000);
        setTimeout(() => goToSlide(slideElements, 1), 6000);

        // 時刻表示
        function updateParisTime() {
            var now = new Date();
            var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            var parisTime = new Date(utc + (3600000 * 2));

            var hours = parisTime.getHours().toString().padStart(2, '0');
            var minutes = parisTime.getMinutes().toString().padStart(2, '0');
            var seconds = parisTime.getSeconds().toString().padStart(2, '0');

            $('#paris-time').text(`${hours}:${minutes}:${seconds}`);
        }

        function updateTokyoTime() {
            var now = new Date();
            var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            var tokyoTime = new Date(utc + (3600000 * 9));

            var hours = tokyoTime.getHours().toString().padStart(2, '0');
            var minutes = tokyoTime.getMinutes().toString().padStart(2, '0');
            var seconds = tokyoTime.getSeconds().toString().padStart(2, '0');

            $('#tokyo-time').text(`${hours}:${minutes}:${seconds}`);
        }

        // Update both clocks together once per minute.
        const CLOCK_UPDATE_INTERVAL = 60 * 1000;
        const updateClocks = () => {
            updateParisTime();
            updateTokyoTime();
        };

        // Keep the initial render immediate while reducing background work.
        updateClocks();
        setInterval(updateClocks, CLOCK_UPDATE_INTERVAL);
    };
    document.addEventListener("portfolio:homeready", initializeHomeSlides, { once: true });
});
