  const ITEMS_PER_PAGE = 2;
  let currentCategory = "all";
  let currentPage = 1;

  const contentEl = document.querySelector(".content");
  const pageEl = document.querySelector(".page");

  function renderWorks() {
    if (!contentEl) return;

    const filtered = currentCategory === "all"
      ? worksData
      : worksData.filter((item) => item.category === currentCategory);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const currentItems = filtered.slice(start, end);

    contentEl.innerHTML = `<span>Category / ${currentCategory.toUpperCase()}</span>`;
    currentItems.forEach((item) => {
      const html = `
        <div class="work">
          <p>キャプション<br>${item.caption}</p>
          <div class="work-img">
            <span style="position: absolute; top: 25%; left: -8.5vmin; letter-spacing: 0.5rem; transform: rotate(-90deg);">
              ${item.tag}
            </span>
            <img src="${item.img}" alt="Main Image">
            <span class="dli-external-link">©Oyama</span>
            <a class="works" href="${item.link}">
              <h3>${item.category}</h3>
              <p>Title：${item.title}</p>
            </a>
          </div>
        </div>
      `;
      contentEl.innerHTML += html;
    });

    renderPagination(filtered.length);
  }

  function renderPagination(totalItems) {
    if (!pageEl) return;

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    let html = '<li><button class="arrow-button left-arrow" aria-label="Previous">&#x21BC;</button></li>';

    for (let i = 1; i <= totalPages; i++) {
      html += `<li><a href="#" class="page-link" data-page="${i}">${i}</a></li>`;
    }

    html += '<li><button class="arrow-button right-arrow" aria-label="Next">&#x21C0;</button></li>';
    pageEl.innerHTML = html;

    document.querySelectorAll(".page-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = Number(link.dataset.page);
        renderWorks();
      });
    });

    document.querySelector(".left-arrow")?.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderWorks();
      }
    });

    document.querySelector(".right-arrow")?.addEventListener("click", () => {
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderWorks();
      }
    });
  }

  // 外部ボタンでカテゴリーを変更したい場合用
  window.setCategory = function (cat) {
    currentCategory = cat;
    currentPage = 1;
    renderWorks();
  };

  renderWorks();