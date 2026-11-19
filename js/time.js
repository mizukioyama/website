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

                setTimeout(() => $('.exit').removeClass('exit'), 1500);
                setTimeout(() => inProgress = false, 3000);
            }
        };

        $('.card [data-home-slide]').on('click', function () {
            goToSlide(slideElements, Number(this.dataset.homeSlide));
        });

        const autoTimers = [
            setTimeout(() => goToSlide(slideElements, 2), 2000),
            setTimeout(() => goToSlide(slideElements, 1), 6000)
        ];

        $('[data-card-nav]').on('click', function () {
            autoTimers.forEach(timer => clearTimeout(timer));
            const count = $('.back__slide').length;
            const current = $('.back__slide.active').index() + 1;
            const step = this.dataset.cardNav === 'next' ? 1 : -1;
            goToSlide(slideElements, ((current - 1 + step + count) % count) + 1);
        });

        // 時刻表示
        function updateParisTime() {
            var now = new Date();
            var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            var parisTime = new Date(utc + (3600000 * 2));

            var hours = parisTime.getHours().toString().padStart(2, '0');
            var minutes = parisTime.getMinutes().toString().padStart(2, '0');

            $('#paris-time').text(`${hours}:${minutes}`);
        }

        function updateTokyoTime() {
            var now = new Date();
            var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            var tokyoTime = new Date(utc + (3600000 * 9));

            var hours = tokyoTime.getHours().toString().padStart(2, '0');
            var minutes = tokyoTime.getMinutes().toString().padStart(2, '0');

            $('#tokyo-time').text(`${hours}:${minutes}`);
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
