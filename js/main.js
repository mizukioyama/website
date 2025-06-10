// main.js
document.addEventListener('DOMContentLoaded', () => {
  const contentEl = document.querySelector('.content');
  const categoryDisplay = document.querySelector('.content > span');
  const pagination = document.querySelector('.page');
  const itemsPerPage = 2;

  let currentPage = 1;
  let currentCategory = 'all';

  function renderWorks(data) {
    contentEl.querySelectorAll('.work').forEach(el => el.remove());
    data.forEach(work => {
      const workEl = document.createElement('div');
      workEl.className = 'work';
      workEl.innerHTML = `
        <p>${work.caption}</p>
        <div class="work-img">
          <span style="position: absolute; top: 25%; left: -8.5vmin; letter-spacing: 0.5rem; transform: rotate(-90deg);">
            ${work.tag}
          </span>
          <img src="${work.img}" alt="Main Image">
          <span class="dli-external-link">©Oyama</span>
          <a class="works" href="${work.link}">
            <h3>${work.subTitle}</h3>
            <p>Title：${work.title}</p>
          </a>
        </div>
      `;
      contentEl.appendChild(workEl);
    });
  }

  function getFilteredData() {
    return currentCategory === 'all'
      ? worksData
      : worksData.filter(item => item.category === currentCategory);
  }

  function getPaginatedData() {
    const filtered = getFilteredData();
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }

  function updatePaginationLinks() {
    const filtered = getFilteredData();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    pagination.querySelectorAll('.page-link').forEach(link => {
      const page = parseInt(link.dataset.page, 10);
      link.style.display = page <= totalPages ? 'inline-block' : 'none';
    });
  }

  function updatePage() {
    const visibleWorks = getPaginatedData();
    renderWorks(visibleWorks);
    categoryDisplay.innerHTML = `Category / ${currentCategory.toUpperCase()}`;
    updatePaginationLinks();
  }

  // ページリンククリック処理
  pagination.addEventListener('click', (e) => {
    if (e.target.classList.contains('page-link')) {
      e.preventDefault();
      currentPage = parseInt(e.target.dataset.page, 10);
      updatePage();
    } else if (e.target.classList.contains('left-arrow')) {
      if (currentPage > 1) {
        currentPage--;
        updatePage();
      }
    } else if (e.target.classList.contains('right-arrow')) {
      const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        updatePage();
      }
    }
  });

  // カテゴリー切替用：必要であればボタンを別途追加してください
  // 例： currentCategory = 'digital'; updatePage();

  updatePage();
});
