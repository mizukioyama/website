// 初期設定
let currentPage = 1;
let selectedCategory = "all";
const itemsPerPage = 4;

const artworks = [
  {
    title: "心樹 / 2023",
    caption: "アナログ作品「挑戦」から芽吹いた、デジタルの樹...",
    category: "digital",
    year: "2023",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/230053-2.jpg",
    type: "digital / Exhibition"
  },
  {
    title: "No title / 2023",
    caption: "この作品は、...",
    category: "digital",
    year: "2023",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/21ai.jpg",
    type: "digital"
  },
  {
    title: "No title / 2023",
    caption: "この作品は、...",
    category: "analog",
    year: "2023",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/230011-2.jpg",
    type: "analog"
  },
  {
    title: "未公開作品 / 2022",
    caption: "これは未発表の作品です。",
    category: "unreleased",
    year: "2022",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/placeholder.jpg",
    type: "unreleased"
  },
  {
    title: "未公開作品 / 2022",
    caption: "これは未発表の作品です。",
    category: "unreleased",
    year: "2022",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/placeholder.jpg",
    type: "unreleased"
  }
];

// カテゴリーでフィルター
function filterArtworks() {
  return artworks.filter(item =>
    selectedCategory === "all" || item.category === selectedCategory
  );
}

// ギャラリー描画
function renderGallery() {
  const container = document.getElementById("gallery-container");
  const filtered = filterArtworks();
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filtered.slice(start, end);

  container.innerHTML = pageItems.map(item => `
    <div class="work">
      <img src="${item.img}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.caption}</p>
    </div>
  `).join("");

  renderPagination(filtered.length);
}

// ページネーション表示
function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let html = '';

  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="page-link${p === currentPage ? ' active' : ''}" data-page="${p}">${p}</button>`;
  }
  pagination.innerHTML = html;

  // ページクリックイベント
  pagination.querySelectorAll(".page-link").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.dataset.page);
      renderGallery();
    });
  });
}

// カテゴリー切り替え
document.querySelectorAll("#category-menu li").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedCategory = btn.getAttribute("data-category");
    currentPage = 1;

    // activeクラス切替
    document.querySelectorAll("#category-menu li").forEach(li => li.classList.remove("active"));
    btn.classList.add("active");

    renderGallery();
  });
});

// 初期表示
document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
});
