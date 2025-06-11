function setupCategoryFilter() {
  const artworks = [
    { title: "心樹 / 2023", caption: "デジタル作品", category: "digital", img: "img1.jpg" },
    { title: "No title / 2023", caption: "デジタル作品2", category: "digital", img: "img2.jpg" },
    { title: "アナログ作品 / 2023", caption: "アナログな表現", category: "analog", img: "img3.jpg" },
    { title: "未公開作品 / 2022", caption: "未発表作品", category: "unreleased", img: "img4.jpg" }
  ];

  const itemsPerPage = 4;
  let selectedCategory = "all";
  let currentPage = 1;

  function filterArtworks() {
    return selectedCategory === "all"
      ? artworks
      : artworks.filter(item => item.category === selectedCategory);
  }

  function renderGallery() {
    const container = document.getElementById("gallery-container");
    const filtered = filterArtworks();
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(start, start + itemsPerPage);

    container.innerHTML = "";
    pageItems.forEach(item => {
      const div = document.createElement("div");
      div.className = "work";
      div.innerHTML = `
        <img src="${item.img}" alt="${item.title}" style="max-width:200px;"><br>
        <h3>${item.title}</h3>
        <p>${item.caption}</p>`;
      container.appendChild(div);
    });

    renderPagination(filtered.length);
  }

  function renderPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "page-btn" + (i === currentPage ? " active" : "");
      btn.addEventListener("click", () => {
        currentPage = i;
        renderGallery();
      });
      pagination.appendChild(btn);
    }
  }

  // ここでクリックイベントをバインド
  document.querySelectorAll("#category-menu li").forEach(li => {
    li.addEventListener("click", () => {
      selectedCategory = li.getAttribute("data-category");
      currentPage = 1;

      document.querySelectorAll("#category-menu li").forEach(el =>
        el.classList.remove("active")
      );
      li.classList.add("active");

      renderGallery();
    });
  });

  renderGallery(); // 初期描画
}
