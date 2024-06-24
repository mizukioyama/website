document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // ページネーションの設定
    const pageLinks = document.querySelectorAll('.page-link');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentPage = parseInt(document.body.getAttribute('data-current-page'), 10);
    const totalPages = pageLinks.length;

    console.log('Current page:', currentPage);
    console.log('Total pages:', totalPages);

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

        leftArrow.disabled = currentPage === 1;
        rightArrow.disabled = currentPage === totalPages;
        console.log('Pagination updated');
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        const targetLink = document.querySelector(`.page-link[data-page="${page}"]`);
        window.location.href = targetLink.getAttribute('data-href');
    }

    pageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = parseInt(event.target.getAttribute('data-page'), 10);
            console.log('Page link clicked:', page);
            if (page !== currentPage) {
                goToPage(page);
            }
        });
    });

    leftArrow.addEventListener('click', function() {
        if (currentPage > 1) {
            console.log('Left arrow clicked');
            goToPage(currentPage - 1);
        }
    });

    rightArrow.addEventListener('click', function() {
        if (currentPage < totalPages) {
            console.log('Right arrow clicked');
            goToPage(currentPage + 1);
        }
    });

    // Initialize pagination
    updatePagination();

    // カテゴリーリンクの設定
    const categoryLinks = document.querySelectorAll('.category-link');
    let currentCategory = document.body.getAttribute('data-current-category');

    console.log('Current category:', currentCategory);

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
        console.log('Category links updated');
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = event.target.getAttribute('data-page');
            console.log('Category link clicked:', category);
            if (category !== currentCategory) {
                console.log('Navigating to:', event.target.getAttribute('data-href'));
                window.location.href = event.target.getAttribute('data-href');
            }
        });
    });

    // Initialize category links
    updateCategoryLinks();
});