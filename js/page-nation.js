function setupCategoryFilter() {
    const artworks = [
        { title: "蒼想 / 2024", caption: "Order：", category: "analog", img: "img/2024works.jpg" },
        { title: "心樹 / 2023", caption: "展示：", category: "digital", img: "img/230053-2.jpg" },
        { title: "No title / 2023", caption: "未発表作品", category: "digital", img: "img/23_0035-2.jpg" },
        { title: "アナログ作品 / 2023", caption: "未発表作品", category: "analog", img: "img/couryoku.jpg" },
        { title: "未公開作品 / 2023", caption: "未発表作品", category: "unreleased", img: "img/230029-2.jpg" },
        { title: "幸緑 / 2021", caption: "展示：", category: "unreleased", img: "img/couryoku.jpg" },
        { title: "未公開作品 / 2023", caption: "未発表作品", category: "unreleased", img: "img/230011-2.jpg" },
        { title: "未公開作品 / 2023", caption: "未発表作品", category: "unreleased", img: "img/21ai.jpg" },
        { title: "未公開作品 / 2023", caption: "未発表作品", category: "unreleased", img: "img/2024ai.jpg" }
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
            const displayCategory = selectedCategory === "all" ? "all" : item.category;

            const div = document.createElement("div");
            div.className = "work";
            div.innerHTML = `
                <p class="noise" style="font-size: 1.2rem; position: absolute; top: 1%; left: 1%; width: fit-content;">${displayCategory}</p>
                <p>${item.caption}</p>
                <div class="work-img">
                    <span style="position: absolute; top: 0; left: -17vmin; width: 100%; letter-spacing: 0.5rem; transform: rotate(-90deg);">${displayCategory}</span>
                    <img src="${item.img}" alt="${item.title}">
                    <span class="dli-external-link">©Oyama</span>
                    <a class="works" href="">
                        <h3>${item.title}</h3>
                        <p>${displayCategory}</p>
                    </a>
                </div>`;
            container.appendChild(div);
        });

        renderPagination(filtered.length);

        window.scrollTo({ top: 0, behavior: "smooth" });
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
                window.scrollTo({ top: 0, behavior: "smooth" });
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
