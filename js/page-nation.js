document.addEventListener("DOMContentLoaded", function () {
    const artworks = [
        {
            title: { ja: "蒼想 / 2024", en: "Blue Thought / 2024" },
            caption: { ja: "Order：アナログ（ペイント）<br>", en: "Order: Analog (Paint)<br>" },
            category: ["analog"],
            img: "img/2024works.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：AI生成", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/20230629.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：幸緑 AI", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/21ai.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：挑戦 AI生成", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/22ai.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：加工 AI生成", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/230011-2.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：加工 AI生成", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/230029-2.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：写真", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/230033-2.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：挑戦 加工 / AI生成", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/230051-2.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/230052-2.jpg"
        },
        {
            title: { ja: "心樹 / 2023", en: "心樹 / 2023" },
            caption: { ja: "心樹 / 2023<br>アナログ作品「挑戦」から芽吹いた、デジタルの樹。<br><br>幾重にも重ねた編集の葉が、やがてひとつの球体を結び、<br>それは心の奥底──静かにたゆたう源（みなもと）を象っています。<br>大地に根を張るように、青は深い静けさを、<br>緑は命の循環を、黄色は内に宿る希望の光を。<br>自然の色をまといながら、目には見えない「心の樹形図」を描きました。", en: "Unpublished: AI generated" },
            category: ["digital", "analog"],
            img: "img/230053-2.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：AI生成", en: "Unpublished: AI generated" },
            category: ["digital", "analog"],
            img: "img/230055-2.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：写真 / AI生成", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/230035-2.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：", en: "Unpublished: AI generated" },
            category: ["digital"],
            img: "img/R0021433.jpg"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["digital"],
            img: "img/white.jpg"
        },
        {
            title: { ja: "No Title / 2022", en: "No Title / 2022" },
            caption: { ja: "未発表作品：デジタル / Photo", en: "Unpublished: AI generated" },
            category: ["digital", "ai"],
            img: "img/wallart.jpg"
        },
        {
            title: { ja: "映し神 / 2022", en: "No Title / 2022" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/映し神.jpg"
        },
        {
            title: { ja: "挑戦 / 2022", en: "No Title / 2022" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/挑戦.jpg"
        },
        {
            title: { ja: "戦争 / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/戦争.jpg"
        },
        {
            title: { ja: "幸緑 / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/幸緑.jpg"
        },
        {
            title: { ja: "金雲 / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/金雲.jpg"
        },
        {
            title: { ja: "幸華 / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/幸華.jpg"
        },
        {
            title: { ja: "輝き / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/輝き.jpg"
        },
        {
            title: { ja: "無題 / 2017", en: "No Title / 2017" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/10-1702.jpg"
        },
        {
            title: { ja: "海底 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["analog"],
            img: "img/海底.jpg"
        }
    ];

  const itemsPerPage = 4;
  let selectedCategory = "all";
  let currentLang = document.getElementById("langJa").checked ? "ja" : "en";
  let currentPage = 1;

  const container = document.getElementById("gallery-container");
  const pagination = document.getElementById("pagination");

  // === フィルター処理 ===
  function filterArtworks() {
    return selectedCategory === "all"
      ? artworks
      : artworks.filter(item => item.category.includes(selectedCategory));
  }

  // === ギャラリー描画 ===
  function renderGallery() {
    const filtered = filterArtworks();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filtered.slice(start, end);

    container.innerHTML = "";
    paginatedItems.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "gallery-item fade-in";
      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.title[currentLang]}">
        <h3>${item.title[currentLang]}</h3>
        <p>${item.caption[currentLang]}</p>
      `;
      container.appendChild(itemDiv);
    });

    container.classList.add("show");
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderPagination(filtered.length);
  }

  // === ページネーション描画 ===
  function renderPagination(totalItems) {
    pagination.innerHTML = "";
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentPage = i;
        renderGallery();
      });
      pagination.appendChild(btn);
    }
  }

  // === カテゴリー切り替え ===
  document.querySelectorAll("#category-menu li").forEach(li => {
    li.addEventListener("click", () => {
      document.querySelector("#category-menu .active")?.classList.remove("active");
      li.classList.add("active");
      selectedCategory = li.dataset.category;
      currentPage = 1;
      renderGallery();
    });
  });

  // === 言語切り替え ===
  document.querySelectorAll("#langChenge input[name='lang']").forEach(radio => {
    radio.addEventListener("change", () => {
      currentLang = radio.value;
      renderGallery();
    });
  });

  // 初期表示
  renderGallery();
});
