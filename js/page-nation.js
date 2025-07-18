function setupCategoryFilter() {
    //let currentLang = localStorage.getItem("lang") || "ja";
    //const getLang = () => currentLang;

    const artworks = [
        {
            title: { ja: "蒼想 | 永続する見えない設計", en: "Order：Blue Thought" },
            caption: { ja: "青が喚起する未来や希望の印象に、あえて冷たさや距離感を織り交ぜることで、安易な感情の誘導を避けた。観る人の意識が作品に触れた瞬間、見えない波動が静かに作用し、思考や視点に変化をもたらすよう設計している。この作品は、時間を超えて作用する「感覚の設計図」として存在している。", en: "By intentionally weaving in coolness and a sense of distance into the impression of the future and hope that blue evokes, I avoided easy emotional manipulation. The moment the viewer's consciousness touches the work, an unseen wave quietly acts, designed to bring about changes in thought and perspective. This work exists as a 'blueprint of sensation' that functions beyond the constraints of time." },
            text: { ja: "思いや意図は、言葉にすることで確かに伝わる。一方で、波動やエネルギーは可視化できず、感じ取れる人にしか届かない。しかし、言葉がなくとも“何か”が伝わる感覚が存在する。果たして永く残るのは、明確な言語か、それとも目に見えない感覚なのか。本作はその問いを視覚的に構成し、見る人の内に働きかける設計とした。", en: "Thoughts and intentions are certainly conveyed through words. On the other hand, vibrations and energy cannot be visualized and only reach those who can perceive them. However, there exists a sensation that something is communicated even without words. What ultimately remains longer: clear language or the invisible sensations? This work is visually structured around that question, designed to engage the inner workings of the viewer." },
            category: ["2024", "Natureinspire", "Paint", "Order"],
            img: "img/蒼想-web.jpg",
            link: "pages/2024work.html"
        },//Unreleased
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital", "Unreleased"],
            img: "img/202344-1-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital", "Unreleased"],
            img: "img/202342-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital", "Unreleased"],
            img: "img/202341-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital", "Unreleased"],
            img: "img/202340-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"

        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital", "Unreleased"],
            img: "img/202338-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "心樹 | エネルギー伝達の設計", en: "NoTitle" },
            caption: { ja: "展示：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "目に見えないエネルギーや波動が、人の心や感覚にどのように伝わり作用するかを主題に据えたシリーズ。物質的な形態を超え、視覚表現を通じて感覚や思考を変容させる設計を意図。作品に込めたエネルギーは、言葉や説明を介さずとも、受け手の無意識に作用し、感情や解釈を揺さぶる装置として機能する。伝達されるものは曖昧で、固定された意味を持たない一方で、観る人の意識を媒介として伝わる。見えない設計図のように構築された作品群は、鑑賞のたびに異なる波動を放ち、時間や距離を超えて感覚の奥深くに残り続けることを目指しています。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital", "Exhibition"],
            img: "img/心樹-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital", "Unreleased"],
            img: "img/202337-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital", "Unreleased"],
            img: "img/202334-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },//2022
        {
            title: { ja: "映し神 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/映し神-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "202203 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202203-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "202202 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202202-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "202201 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202201-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "挑戦 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/挑戦-web.jpg",
            link: "pages/2024work.html"
        },//========2021
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202109-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202108-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202107-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202106-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202105-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202104-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202103-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202102-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "NoTitle | 無質量のエネルギー設計", en: "NoTitle" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2022", "Natureinspire", "Paint", "Exhibition"],
            img: "img/202101-web.jpg",
            link: "https://opensea.io/ja/collection/unreleased-art-works/overview"
        },
        {
            title: { ja: "戦争 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2021", "Natureinspire", "Paint", "Exhibition"],
            img: "img/戦争-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "幸緑 |永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2021", "Natureinspire", "Paint", "Exhibition"],
            img: "img/幸緑-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "金雲 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2021", "Natureinspire", "Paint", "Exhibition"],
            img: "img/金雲-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "輝き | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2021", "Natureinspire", "Paint", "Certification"],
            img: "img/輝き-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "202100 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "未発表：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2021", "Natureinspire", "Paint", "Certification"],
            img: "img/202100-web.jpg",
            link: "pages/2024work.html"
        },//========2010~17
        {
            title: { ja: "海底 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2010-2017", "Natureinspire", "Paint", "Certification"],
            img: "img/海底-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2010-2017", "Natureinspire", "Paint", "Certification"],
            img: "img/2017無題-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "201702 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2010-2017", "Natureinspire", "Paint", "Certification"],
            img: "img/201702-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "201701 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2010-2017", "Natureinspire", "Paint", "Certification"],
            img: "img/201701-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "201601 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2010-2017", "Natureinspire", "Paint", "Certification"],
            img: "img/201601-web.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "201501 | 永続する見えない設計", en: "NoTitle" },
            caption: { ja: "展示：ペイント", en: "Unpublished: AI generated" },
            text: { ja: "この作品についてのお問合せは当ウェブサイトのContactフォームからお問い合わせください。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2010-2017", "Natureinspire", "Paint", "Certification"],
            img: "img/201501-web.jpg",
            link: "pages/2024work.html"
        }
    ];

    const itemsPerPage = 8;
    let selectedCategory = "all";
    let currentPage = 1;
    let filtered = []; // モーダル表示に必要

    function filterArtworks() {
        return selectedCategory === "all"
            ? artworks
            : artworks.filter(item => item.category.includes(selectedCategory));
    }

    function truncateText(text, maxLength = 120) {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }

    function renderGallery() {
        const lang = getLang();
        const container = document.getElementById("gallery-container");
        container.classList.remove("show");

        filtered = filterArtworks();
        const start = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        const selectedLi = document.querySelector(`#category-menu li[data-category="${selectedCategory}"]`);
        const selectedCategoryLabel = selectedLi ? selectedLi.textContent : "All";

        container.innerHTML = "";
        pageItems.forEach(item => {
            const firstLine = item.category[0] || "";
            const secondLine = item.category.slice(1).join(" ") || "";

            const div = document.createElement("div");
            div.className = "work";
            div.innerHTML = `
            <p class="noise cg-text" style="font-size: 1.4rem; font-weight: 500; position: absolute; top: -5rem; left: 1%; width: 100%; letter-spacing: 0; justify-content: flex-start; padding: 0; margin: 0 !important; border-bottom: 1px solid; line-height: 2;">
                Category | ${selectedCategoryLabel}
            </p>

            <div class="work-img">
                <img src="${item.img}" alt="${item.title[lang]}">
                <a href="#" class="button view-policy-button" data-index="${filtered.indexOf(item)}">
                <h2>${item.title[lang]}</h2>
                <p>${firstLine}<br>${secondLine}</p>
                </a>
            </div>
        `;
            container.appendChild(div);
        });

        renderPagination(filtered.length);
        setTimeout(() => container.classList.add("show"), 3);
        smoothScrollToTop(400);

        document.querySelectorAll(".view-policy-button").forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                const index = parseInt(button.getAttribute("data-index"));
                showModal(filtered[index]);
            });
        });
    }


    function showModal(item) {
        const lang = getLang();
        const selectedLi = document.querySelector(`#category-menu li[data-category="${selectedCategory}"]`);
        const selectedCategoryLabel = selectedLi ? selectedLi.textContent : "All";

        const firstLine = item.category[0] || "";
        const secondLine = item.category.slice(1).join(" ") || "";

        const modalBox = document.getElementById("modalBox");

        modalBox.innerHTML = `
        <div class="work-img">
            <p class="noise cg-text" style="font-size: 1.4rem; font-weight: 500; position: relative; top: 0; left: 0; width: fit-content; border-bottom: 1px solid;">
                Category | ${selectedCategoryLabel}
            </p>
            <img src="${item.img}" alt="${item.title[lang]}">
            <a class="works" href="${item.link || '#'}" rel="noopener">
                <h2>${item.title[lang]}</h2>
                <p>${firstLine}<br>${secondLine}</p>
            </a>
            <p>${truncateText(item.caption[lang])}</p>
            <p>${truncateText(item.text[lang])}</p>
            <p>
            作品「${item.title[lang]}」についてのお問合せは当WebサイトのContactフォームからお問い合わせください。
            <br>
            For inquiries about this work, please contact us through the Contact form on our website.
            </p>
            <a href="${item.link || '#'}" class="noise" style="font-size: 1.4rem; margin-top: 1rem; border-bottom: 3px solid;" rel="noopener" target="_blank">View More</a>
            <a href="contact.html" class="noise" style="font-size: 1.4rem; margin-top: 1rem; border-bottom: 3px solid;">Contact</a>
            <button id="modalCloseBtn">Close</button>
        </div>
    `;

        const directions = ["bottom"];
        const randomDir = directions[Math.floor(Math.random() * directions.length)];

        modalBox.className = `modal-box animate-${randomDir}`;
        document.getElementById("modalOverlay").style.display = "block";
        modalBox.style.display = "block";

        document.getElementById("modalCloseBtn").onclick = closeModal;
        document.getElementById("modalOverlay").onclick = closeModal;

        function closeModal() {
            modalBox.style.display = "none";
            document.getElementById("modalOverlay").style.display = "none";
            modalBox.className = "modal-box"; // アニメーション解除
        }
    }



    function renderPagination(totalItems) {
        const pagination = document.getElementById("pagination");
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        pagination.innerHTML = "";

        const maxVisible = 5;

        // 「前へ」ボタン
        if (currentPage > 1) {
            const prevBtn = document.createElement("button");
            prevBtn.textContent = "Back";
            prevBtn.className = "prev-btn";
            prevBtn.addEventListener("click", () => {
                currentPage--;
                renderGallery();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
            pagination.appendChild(prevBtn);
        }

        // 最初のページ
        addPageButton(1);

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // 範囲調整（最大表示数を超えないように）
        while (endPage - startPage + 1 > maxVisible - 2) {
            if (startPage > 2) {
                startPage--;
            } else if (endPage < totalPages - 1) {
                endPage++;
            } else {
                break;
            }
        }

        // 省略記号（先頭と中間の間）
        if (startPage > 2) {
            const dots = document.createElement("span");
            dots.textContent = "...";
            dots.className = "dots";
            pagination.appendChild(dots);
        }

        // 中間ページ
        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i);
        }

        // 省略記号（中間と末尾の間）
        if (endPage < totalPages - 1) {
            const dots = document.createElement("span");
            dots.textContent = "...";
            dots.className = "dots";
            pagination.appendChild(dots);
        }

        // 最後のページ（最終ページが2以上であれば）
        if (totalPages > 1) {
            addPageButton(totalPages);
        }

        // 「次へ」ボタン
        if (currentPage < totalPages) {
            const nextBtn = document.createElement("button");
            nextBtn.textContent = "Next";
            nextBtn.className = "next-btn";
            nextBtn.addEventListener("click", () => {
                currentPage++;
                renderGallery();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
            pagination.appendChild(nextBtn);
        }

        // 共通：ページ番号ボタン作成関数
        function addPageButton(pageNumber) {
            const btn = document.createElement("button");
            btn.textContent = pageNumber;
            btn.className = "page-btn" + (pageNumber === currentPage ? " active" : "");
            btn.addEventListener("click", () => {
                currentPage = pageNumber;
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
            if (progress < 1) requestAnimationFrame(scrollStep);
        }
        requestAnimationFrame(scrollStep);
    }

    // ✅ 言語ラジオボタンによる切り替え処理
    const langJaRadio = document.getElementById("langJa");
    const langEnRadio = document.getElementById("langEn");

    langJaRadio.addEventListener("change", () => {
        if (langJaRadio.checked) {
            currentLang = "ja";
            localStorage.setItem("lang", currentLang);
            renderGallery();
        }
    });

    langEnRadio.addEventListener("change", () => {
        if (langEnRadio.checked) {
            currentLang = "en";
            localStorage.setItem("lang", currentLang);
            renderGallery();
        }
    });

    // ✅ 初期言語状態の反映
    if (currentLang === "ja") {
        langJaRadio.checked = true;
    } else {
        langEnRadio.checked = true;
    }

    renderGallery(); // 初期描画

}