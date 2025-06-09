document.addEventListener('DOMContentLoaded', function () {
    // ページネーションの設定
    const pageLinks = document.querySelectorAll('.page-link');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentPage = parseInt(document.body.getAttribute('data-current-page'), 10);
    const totalPages = pageLinks.length;

    function updatePagination() {
        pageLinks.forEach(link => {
            const page = parseInt(link.getAttribute('data-page'), 10);
            if (page === currentPage) {
                link.classList.add('disabled');
                link.removeAttribute('href');
            } else {
                link.classList.remove('disabled');
                link.setAttribute('href', link.getAttribute('data-href'));
            }
        });

        if (leftArrow) leftArrow.disabled = currentPage === 1;
        if (rightArrow) rightArrow.disabled = currentPage === totalPages;
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        const targetLink = document.querySelector(`.page-link[data-page="${page}"]`);
        if (targetLink) {
            window.location.href = targetLink.getAttribute('data-href');
        }
    }

    pageLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const page = parseInt(event.currentTarget.getAttribute('data-page'), 10);
            if (page !== currentPage) {
                goToPage(page);
            }
        });
    });

    if (leftArrow) {
        leftArrow.addEventListener('click', function () {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', function () {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }

    updatePagination();

    // カテゴリーリンクの設定
    const categoryLinks = document.querySelectorAll('.category-link');
    const currentCategory = document.body.getAttribute('data-current-category');

    function updateCategoryLinks() {
        categoryLinks.forEach(link => {
            const category = link.getAttribute('data-page');
            if (category === currentCategory) {
                link.classList.add('disabled');
                link.removeAttribute('href');
            } else {
                link.classList.remove('disabled');
                link.setAttribute('href', link.getAttribute('data-href'));
            }
        });
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const category = event.currentTarget.getAttribute('data-page');
            if (category !== currentCategory) {
                window.location.href = event.currentTarget.getAttribute('data-href');
            }
        });
    });

    updateCategoryLinks();
});
