document.addEventListener('DOMContentLoaded', function() {
    const pageLinks = document.querySelectorAll('.page-link');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const categoryLinks = document.querySelectorAll('.category-link');
    let currentPage = parseInt(document.body.getAttribute('data-current-page'), 10) || 1;
    const totalPages = pageLinks.length;

    function updatePagination() {
        pageLinks.forEach(link => {
            const page = parseInt(link.getAttribute('data-page'));
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
            const page = parseInt(event.target.getAttribute('data-page'));
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

    // Handle category links
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = parseInt(link.getAttribute('data-page'));
            if (page !== currentPage) {
                goToPage(page);
            }
        });
    });
});