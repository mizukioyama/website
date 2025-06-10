// main.js

const ITEMS_PER_PAGE = 3;

const state = {
  category: "all",
  page: 1
};

const contentEl = document.querySelector(".content");
const paginationEl = document.querySelector(".page");
const categoryText = contentEl.querySelector("span");

function renderWorks() {
  contentEl.querySelectorAll(".work").forEach(el => el.remove());

  const filtered = state.category === "all"
    ? worksData
    : worksData.filter(w => w.category === state.category);

  const start = (state.page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  pageItems.forEach(work => {
    const workEl = document.createElement("div");
    workEl.className = "work";
    workEl.innerHTML = `
      <p>${work.caption}</p>
      <div class="work-img">
        <span style="position: absolute; top: 25%; left: -8.5vmin; letter-spacing: 0.5rem; transform: rotate(-90deg);">${work.tag}</span>
        <img src="${work.img}" alt="Main Image">
        <span class="dli-external-link">©Oyama</span>
        <a class="works" href="${work.link}">
          <h3>${work.heading}</h3>
          <p>Title：${work.title}</p>
        </a>
      </div>
    `;
    contentEl.appendChild(workEl);
  });

  updateCategoryLabel();
  renderPagination(filtered.length);
}

function updateCategoryLabel() {
  categoryText.textContent = `Category / ${state.category.toUpperCase()}`;
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  paginationEl.innerHTML = `
    <li><button class="arrow-button left-arrow" aria-label="Previous">&#x21BC;</button></li>
    ${Array.from({ length: totalPages }, (_, i) =>
      `<li><a href="#" class="page-link ${state.page === i + 1 ? "active" : ""}" data-page="${i + 1}">${i + 1}</a></li>`
    ).join("")}
    <li><button class="arrow-button right-arrow" aria-label="Next">&#x21C0;</button></li>
  `;

  // Event bindings
  paginationEl.querySelectorAll(".page-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      state.page = parseInt(e.target.dataset.page);
      renderWorks();
    });
  });

  paginationEl.querySelector(".left-arrow").addEventListener("click", () => {
    if (state.page > 1) {
      state.page--;
      renderWorks();
    }
  });

  paginationEl.querySelector(".right-arrow").addEventListener("click", () => {
    if (state.page < totalPages) {
      state.page++;
      renderWorks();
    }
  });
}

// Optional: Category UI (example only)
document.addEventListener("DOMContentLoaded", () => {
  renderWorks();
});
