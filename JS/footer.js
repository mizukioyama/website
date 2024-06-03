document.addEventListener('DOMContentLoaded', function() {
    var scrollElements = document.querySelectorAll('.js-scroll');
    var pagetopElement = document.querySelector('.js-pagetop');

    function PageTopCheck() {
        var winScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var secondTop = document.getElementById("area-2").getBoundingClientRect().top + winScrollTop - 150;

        scrollElements.forEach(function(element) {
            if (winScrollTop >= secondTop) {
                element.classList.remove('scroll-view');
            } else {
                element.classList.add('scroll-view');
            }
        });

        if (winScrollTop >= secondTop) {
            pagetopElement.classList.add('scroll-view');
        } else {
            pagetopElement.classList.remove('scroll-view');
        }
    }

    var pagetopLink = document.querySelector('.scroll-top a');
    if (pagetopLink) {
        pagetopLink.addEventListener('click', function(event) {
            event.preventDefault();

            var elmHash = this.getAttribute('href');
            var targetElement = document.querySelector(elmHash);
            var targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;

            scrollToSmoothly(targetTop);
        });
    }

    function scrollToSmoothly(to) {
        var start = window.pageYOffset;
        var change = to - start;
        var currentTime = 0;
        var increment = 20; // スクロールの速さ（大きいほど遅くなる）

        function animateScroll() {
            currentTime += increment;
            var val = Math.easeInOutQuad(currentTime, start, change, 1000);
            window.scrollTo(0, val);
            if (currentTime < 1000) {
                requestAnimationFrame(animateScroll);
            }
        }

        animateScroll();
    }

    Math.easeInOutQuad = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    window.addEventListener('scroll', function() {
        requestAnimationFrame(PageTopCheck);
    });

    window.addEventListener('load', function() {
        requestAnimationFrame(PageTopCheck);
    });
});
