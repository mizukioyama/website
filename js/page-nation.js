function setupCategoryFilter() {
    const artworks = [
        { title: "蒼想 / 2024", caption: "Order：アナログ（ペイント）<br>", category: "analog", img: "img/2024works.jpg" },
        { title: "No Title / 2023", caption: "未発表作品：AI生成", category: "digital", img: "img/20230629.jpg" },
        { title: "No Title / 2023", caption: "未発表作品：幸緑 加工", category: "digital", img: "img/21ai.jpg" },
        { title: "No Title / 2023", caption: "未発表作品：挑戦 加工", category: "digital", img: "img/22ai.jpg" },
        { title: "No Title / 2023", caption: "未発表作品", category: "digital", img: "img/230011-2.jpg" },
        { title: "No Title / 2023", caption: "未発表作品", category: "digital", img: "img/230029-2.jpg" },
        { title: "No Title / 2023", caption: "未発表作品：写真", category: "digital", img: "img/230033-2.jpg" },
        { title: "No Title / 2023", caption: "未発表作品：挑戦 加工 / AI生成", category: "digital", img: "img/230051-2.jpg" },
        { title: "No Title / 2023", caption: "未発表作品：デジタル", category: "digital", img: "img/230052-2.jpg" },
        { title: "心樹 / 2023",
            caption: "展示：挑戦 加工 / デジタル<br>アナログ作品「挑戦」から芽吹いた、デジタルの樹。<br><br>幾重にも重ねた編集の葉が、やがてひとつの球体を結び、<br>それは心の奥底──静かにたゆたう源（みなもと）を象っています。<br>大地に根を張るように、青は深い静けさを、<br>緑は命の循環を、黄色は内に宿る希望の光を。<br>自然の色をまといながら、目には見えない「心の樹形図」を描きました。",
            category: "digital", img: "img/230053-2.jpg" },
        { title: "No Title / 2023", caption: "未発表作品：AI生成", category: "digital", img: "img/230055-2.jpg" },
        { title: "No Title / 2023", caption: "未発表作品：Photo / AI生成", category: "digital", img: "img/230035-2.jpg" },
        { title: "No title / 2023", caption: "未発表作品", category: "digital", img: "img/R0021433.jpg" },
        { title: "未公開作品 / 2023", caption: "未発表作品：デジタル", category: "digital", img: "img/white.jpg" },
        { title: "未公開作品 / 2022", caption: "未発表作品：デジタル / Photo", category: "digital", img: "img/wallart.jpg" },
        { title: "映し神 / 2022",
            caption: "展示：アナログ（ペイント）", category: "analog", img: "img/wallart.jpg" },
        { title: "挑戦 / 2022",
            caption: "展示：アナログ（ペイント）", category: "analog", img: "img/wallart.jpg" },
        { title: "戦争 / 2021",
            caption: "展示：アナログ（ペイント）", category: "analog", img: "img/wallart.jpg" },
        { title: "幸緑 / 2021", caption: "展示：アナログ（ペイント）", category: "analog", img: "img/couryoku.jpg" },
        { title: "金運 / 2021", caption: "展示：アナログ（ペイント）", category: "analog", img: "img/couryoku.jpg" },
        { title: "幸華 / 2021", caption: "未発表作品：アナログ（ペイント）", category: "analog", img: "img/couryoku.jpg" },
        { title: "輝き / 2021",
            caption: "展示：アナログ（ペイント）", category: "analog", img: "img/wallart.jpg" },
        { title: "海底 / 2017",
            caption: "展示：アナログ（ペイント）", category: "analog", img: "img/wallart.jpg" },
        { title: "No Title / 2010",
            caption: "展示：アナログ（ペイント）", category: "analog", img: "img/wallart.jpg" }
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
        container.classList.remove("show");

        const filtered = filterArtworks();
        const start = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        container.innerHTML = "";
        pageItems.forEach(item => {
            const displayCategory = selectedCategory === "all" ? "all" : item.category;

            const div = document.createElement("div");
            div.className = "work";
            div.innerHTML = `
                <p class="noise" style="font-size: 1.2rem; position: absolute; top: 1%; left: 1%; width: fit-content;">Category | ${displayCategory}</p>
                <p>${item.caption}</p>
                <div class="work-img">
                    <span style="position: absolute; top: 0; left: -17vmin; width: 100%; letter-spacing: 0.5rem; transform: rotate(-90deg);">${item.category}</span>
                    <img src="${item.img}" alt="${item.title}">
                    <span class="dli-external-link">©Oyama</span>
                    <a class="works" href="">
                        <h3>${item.title}</h3>
                        <p>${item.category}</p>
                    </a>
                </div>`;
            container.appendChild(div);
        });

        renderPagination(filtered.length);

        // 少し待ってから表示（アニメーション）
    setTimeout(() => {
        container.classList.add("show");
    }, 3);

    smoothScrollToTop(400); // or window.scrollTo({ top: 0, behavior: "smooth" });
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

function smoothScrollToTop(duration = 400) {
    const start = window.pageYOffset;
    const startTime = performance.now();

    function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start * (1 - progress));
        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}


    renderGallery(); // 初期描画
}
