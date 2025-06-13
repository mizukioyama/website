function setupCategoryFilter() {
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
    let currentPage = 1;

    function filterArtworks() {
        return selectedCategory === "all"
            ? artworks
            : artworks.filter(item => item.category.includes(selectedCategory));
    }

    function renderGallery() {
        const container = document.getElementById("gallery-container");
        container.classList.remove("show");

        const filtered = filterArtworks();
        const start = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        container.innerHTML = "";
        pageItems.forEach(item => {
            const displayCategory = selectedCategory === "all"
                ? item.category.join(" / ")
                : selectedCategory;

            const div = document.createElement("div");
            div.className = "work";
            div.innerHTML = `
                <p class="noise" style="font-size: 1.2rem; position: absolute; top: 1%; left: 1%; width: fit-content;">
                    Category | ${displayCategory}
                </p>

                <p lang="ja">${item.caption.ja}</p>
                <p lang="en">${item.caption.en}</p>

                <div class="work-img">
                    <span style="position: absolute; top: 0; left: -17vmin; width: 100%; letter-spacing: 0.5rem; transform: rotate(-90deg);">
                        ${item.category.join(" / ")}
                    </span>
                    <img src="${item.img}" alt="${item.title.ja}">
                    <span class="dli-external-link">©Oyama</span>
                    <a class="works" href="">
                        <h3 lang="ja">${item.title.ja}</h3>
                        <h3 lang="en">${item.caption.en}</h3>
                        <p style="width: fit-content;">${item.category.join(" / ")}</p>
                    </a>
                </div>
            `;
            container.appendChild(div);
        });

        renderPagination(filtered.length);

        setTimeout(() => {
            container.classList.add("show");
        }, 3);

        smoothScrollToTop(400);
        setLang(currentLang);
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

let currentLang = "ja"; // 初期値

document.getElementById("langChenge").addEventListener("click", () => {
    currentLang = currentLang === "ja" ? "en" : "ja";
    setLang(currentLang);
});


}

function setLang(lang) {
    document.querySelectorAll('[lang]').forEach(el => {
        el.style.display = el.getAttribute('lang') === lang ? '' : 'none';
    });
}
