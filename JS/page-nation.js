document.addEventListener('DOMContentLoaded', function() {
    const pageLinks = document.querySelectorAll('.page-link');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentPage = 1;
    const totalPages = pageLinks.length;

    function updatePagination() {
        pageLinks.forEach(link => {
            const page = parseInt(link.getAttribute('data-page'));
            if (page === currentPage) {
                link.classList.add('disabled');
            } else {
                link.classList.remove('disabled');
            }
        });

        if (currentPage === 1) {
            leftArrow.disabled = true;
        } else {
            leftArrow.disabled = false;
        }

        if (currentPage === totalPages) {
            rightArrow.disabled = true;
        } else {
            rightArrow.disabled = false;
        }
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        const targetLink = document.querySelector(`.page-link[data-page="${page}"]`);
        window.location.href = targetLink.href;
    }

    pageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = parseInt(event.target.getAttribute('data-page'));
            currentPage = page;
            updatePagination();
            goToPage(page);
        });
    });

    leftArrow.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            goToPage(currentPage);
        }
    });

    rightArrow.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            goToPage(currentPage);
        }
    });

    // Initialize pagination
    updatePagination();
});
