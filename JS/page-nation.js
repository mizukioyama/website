document.addEventListener('DOMContentLoaded', function() {
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
                link.setAttribute('href', link.dataset.href);
            }
        });

        leftArrow.disabled = currentPage === 1;
        rightArrow.disabled = currentPage === totalPages;
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        const targetLink = document.querySelector(`.page-link[data-page="${page}"]`);
        window.location.href = targetLink.dataset.href;
    }

    pageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = parseInt(event.target.getAttribute('data-page'), 10);
            if (page !== currentPage) {
                goToPage(page);
            }
        });
    });

    leftArrow.addEventListener('click', function() {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });

    rightArrow.addEventListener('click', function() {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });

    // Initialize pagination
    updatePagination();

    // カテゴリーリンクの設定
    const categoryLinks = document.querySelectorAll('.category-link');
    let currentCategory = document.body.getAttribute('data-current-category');

    function updateCategoryLinks() {
        categoryLinks.forEach(link => {
            const category = link.getAttribute('data-page');
            if (category === currentCategory) {
                link.classList.add('disabled');
                link.removeAttribute('href');
            } else {
                link.classList.remove('disabled');
                link.setAttribute('href', link.dataset.href);
            }
        });
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = event.target.getAttribute('data-page');
            if (category !== currentCategory) {
                window.location.href = event.target.dataset.href;
            }
        });
    });

    // Initialize category links
    updateCategoryLinks();
});
