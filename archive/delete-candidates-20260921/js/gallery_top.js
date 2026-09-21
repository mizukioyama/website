document.addEventListener('DOMContentLoaded', function() {
    const slideElements = ['.back__slide', '.card__slide', '.content__slide'];
    let inProgress = false;

    const goToSlide = (slideElements, index) => {
        if (!inProgress) {
            inProgress = true;

            slideElements.forEach(elem => {
                const slide = document.querySelector(`${elem}:nth-child(${index})`);
                if (slide) {
                    slide.classList.add('active');
                    const siblings = Array.from(slide.parentNode.children);
                    siblings.forEach(sibling => {
                        if (sibling !== slide) {
                            sibling.classList.remove('active', 'exit');
                        }
                    });
                }
            });

            const evenSlide = index % 2 === 0;
            if (evenSlide)
                document.querySelector('.content__ping').classList.add('content__ping--right');
            else
                document.querySelector('.content__ping').classList.remove('content__ping--right');
            document.querySelector('.content__ping--noanimation').classList.remove('content__ping--noanimation');

            setTimeout(() => {
                slideElements.forEach(elem => {
                    const slide = document.querySelector(`${elem}.exit`);
                    if (slide) {
                        slide.classList.remove('exit');
                    }
                });
                inProgress = false;
            }, 1000);
        }
    };

    const button1 = document.querySelector('.content__slide:nth-child(1) .button');
    if (button1) {
        button1.addEventListener('click', () => goToSlide(slideElements, 2));
    }

    const button2 = document.querySelector('.content__slide:nth-child(2) .button');
    if (button2) {
        button2.addEventListener('click', () => goToSlide(slideElements, 1));
    }

    setTimeout(() => goToSlide(slideElements, 2), 2000);
    setTimeout(() => goToSlide(slideElements, 1), 6000);
});
