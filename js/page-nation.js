let currentPage = 1;
let selectedCategory = "all";
const itemsPerPage = 4;

const artworks = [
  {
    title: "心樹 / 2023",
    caption: "アナログ作品「挑戦」から芽吹いた、デジタルの樹...",
    category: "digital",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/230053-2.jpg",
    type: "digital / Exhibition"
  },
  {
    title: "No title / 2023",
    caption: "この作品は、...",
    category: "digital",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/21ai.jpg",
    type: "digital"
  },
  {
    title: "No title / 2023",
    caption: "この作品は、...",
    category: "analog",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/230011-2.jpg",
    type: "analog"
  },
  {
    title: "未公開作品 / 2022",
    caption: "これは未発表の作品です。",
    category: "unreleased",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/placeholder.jpg",
    type: "unreleased"
  },
  {
    title: "未公開作品 / 2022",
    caption: "これは未発表の作品です。",
    category: "unreleased",
    img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/placeholder.jpg",
    type: "unreleased"
  }
];

// 作品をフィルタリングして返す
function filterArtworks() {
  if (selectedCategory === "all") {
    return artworks;
  }
  return artworks.filter(item => item.category === selectedCategory);
}

// ギャラリーを描画
function renderGallery() {
  const container = document.getElementById("gallery-container");
  const filtered = filterArtworks();
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filtered.slice(start, end);

  container.innerHTML = "";

  if (pageItems.length === 0) {
    container.innerHTML = "<p>作品が見つかりません。</p>";
    return;
  }

  pageItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("work");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.caption}</p>
    `;
    container.appendChild(div);
  });

  renderPagination(filtered.length);
}

// ページネーションを描画
function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page-btn");
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      renderGallery();
    });
    pagination.appendChild(btn);
  }
}

// カテゴリーメニューのクリック処理
document.querySelectorAll("#category-menu li").forEach(li => {
  li.addEventListener("click", () => {
    selectedCategory = li.getAttribute("data-category");
    currentPage = 1;

    // activeクラス切替
    document.querySelectorAll("#category-menu li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");

    renderGallery();
  });
});

// 初期描画
document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
});
