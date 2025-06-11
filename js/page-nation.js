    document.addEventListener("DOMContentLoaded", function () {
      const artworks = [
        {
          title: "心樹 / 2023",
          caption: "デジタル作品",
          category: "digital",
          img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/230053-2.jpg"
        },
        {
          title: "No title / 2023",
          caption: "デジタル作品2",
          category: "digital",
          img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/21ai.jpg"
        },
        {
          title: "アナログ作品 / 2023",
          caption: "アナログな表現",
          category: "analog",
          img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/230011-2.jpg"
        },
        {
          title: "未公開作品 / 2022",
          caption: "これは未発表の作品です。",
          category: "unreleased",
          img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/placeholder.jpg"
        },
        {
          title: "未公開作品 / 2022",
          caption: "これは未発表の作品です。",
          category: "unreleased",
          img: "https://raw.githubusercontent.com/mizukioyama/website/main/img/placeholder.jpg"
        }
      ];

      const itemsPerPage = 2;
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
            <img src="${item.img}" alt="${item.title}" style="max-width:200px;"><br>
            <h3>${item.title}</h3>
            <p>${item.caption}</p>
          `;
          container.appendChild(div);
        });

        renderPagination(filtered.length);
      }

      function renderPagination(totalItems) {
        const pagination = document.getElementById("pagination");
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        pagination.innerHTML = "";

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.textContent = i;
          btn.classList.add("page-btn");
          if (i === currentPage) btn.classList.add("active");
          btn.addEventListener("click", () => {
            currentPage = i;
            renderGallery();
          });
          pagination.appendChild(btn);
        }
      }

      // カテゴリーメニュークリックイベント
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
    });