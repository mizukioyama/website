function setupCategoryFilter() {
    //let currentLang = localStorage.getItem("lang") || "ja";
    //const getLang = () => currentLang;

    const artworks = [
        {
            title: { ja: "Order：蒼想", en: "Order：Blue Thought / 2024" },
            caption: { ja: "青に想いを重ねて結晶した「蒼想」は、そっと触れることで、視点や感覚に変化の芽が宿るよう願いを込めました。未来への静かな祈りのかたちです。", en: "The 'Aoso', crystallized with thoughts of blue, has been imbued with a wish that merely touching it will plant the seeds of change in perspective and sensation. It is a form of quiet prayer for the future." },
            category: ["Analog","Order","2024"],
            img: "img/蒼想01.jpg",
            link: "pages/2024work.html"
        },//========69~60
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202362-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202361-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202360-2.jpg",
            link: "pages/2024work.html"
        },//========59~50
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202359-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202358-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202357-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202356-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202355-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202354-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202353-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202352-1.jpg",
            link: "pages/2024work.html"

        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202351-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202350-1.jpg",
            link: "pages/2024work.html"
        },//========49~40
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202349-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202348-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202347-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202346-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202345-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202344-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "心樹 / 2023", en: "心樹 / 2023" },
            caption: { ja: "重ねた編集が一粒の球体を結び、静かにたゆたう心の源をかたちにしました。大地に根を張るように、見えない想いや気配が静かに広がる作品です。", en: "The layered edits formed a single sphere, shaping the quiet source of the heart that gently sways. Like roots spreading into the earth, this work quietly expands with invisible thoughts and presence." },
            category: ["Digital","exhibition"],
            img: "img/202343-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202342-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202341-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202340-2.jpg",
            link: "pages/2024work.html"

        },//========39~30
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202339-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202338-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202337-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202336-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202335-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202334-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202333-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202332-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202331-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202330-2.jpg",
            link: "pages/2024work.html"
        },//========29~20
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202329-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202328-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202327-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202326-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202325-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202324-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202323-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202322-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202321-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202320-2.jpg",
            link: "pages/2024work.html"
        },//========19~10
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202319-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202318-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202317-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202316-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202315-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202314-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202313-1.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202312-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202311-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202310-2.png",
            link: "pages/2024work.html"
        },//========9~1
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202309-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202308-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202307-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202306-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202305-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202304-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202303-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202302-2.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "No Title / 2023", en: "No Title / 2023" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202301-2.jpg",
            link: "pages/2024work.html"
        },//========2022
        {
            title: { ja: "No Title / 2022", en: "No Title / 2022" },
            caption: { ja: "未発表作品：デジタル", en: "Unpublished: AI generated" },
            category: ["Digital","2023"],
            img: "img/202200.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "映し神 / 2022", en: "No Title / 2022" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog","Exhibition"],
            img: "img/映し神01.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "挑戦 / 2022", en: "No Title / 2022" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog","Exhibition"],
            img: "img/挑戦01.jpg",
            link: "pages/2024work.html"
        },//========2021
        {
            title: { ja: "戦争 / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog","Exhibition"],
            img: "img/戦争01.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "幸緑 / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog","Exhibition"],
            img: "img/幸緑01.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "金雲 / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog","Exhibition"],
            img: "img/金雲01.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "幸華 / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/幸華01.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "輝き / 2021", en: "No Title / 2021" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/輝き01.jpg",
            link: "pages/2024work.html"
        },//========2010~17
        {
            title: { ja: "海底 / 2017", en: "No Title / 2017" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/海底01.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2017", en: "No Title / 2017" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog","Exhibition"],
            img: "img/2010-1701.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2016", en: "No Title / 2016" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog","Exhibition"],
            img: "img/2010-1702.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2016", en: "No Title / 2016" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1703.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1704.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1705.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1706.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1707.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1708.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1709.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1710.jpg",
            link: "pages/2024work.html"
        },
        {
            title: { ja: "無題 / 2010", en: "No Title / 2010" },
            caption: { ja: "展示：アナログ（ペイント）", en: "Unpublished: AI generated" },
            category: ["Analog"],
            img: "img/2010-1711.jpg",
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
            const div = document.createElement("div");
            div.className = "work";
            div.innerHTML = `
            <p class="noise cg-text" style="font-size: 1.4rem; font-weight: 500; position: absolute; top: -15%; left: 1%; width: fit-content; padding: 0; margin: 0;">
                Category | ${selectedCategoryLabel}
            </p>

            <div class="work-img">
                <img src="${item.img}" alt="${item.title[lang]}">
                <span class="dli-external-link">©Oyama</span>
                <h2 class="noise">${item.category.join(" / ")}<br>${item.title[lang]}</h2>
                <a href="#" class="button view-policy-button" data-index="${filtered.indexOf(item)}">
                  View More
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

        const modalBox = document.getElementById("modalBox");

        modalBox.innerHTML = `
      <p class="noise cg-text" style="font-size: 1.4rem; font-weight: 500; position: relative; top: 0; left: 20%; width: fit-content;">
        Category | ${selectedCategoryLabel}
      </p>

      <div class="work-img">
        <img src="${item.img}" alt="${item.title[lang]}">
        <a class="works" href="${item.link || '#'}" rel="noopener">
          <h2 class="noise">${item.category.join(" / ")}<br>${item.title[lang]}</h2>
          View More
        </a>
        <span class="dli-external-link">©Oyama</span>
        <p>${truncateText(item.caption[lang])}</p>
      </div>
      <button id="modalCloseBtn" style="margin-top: 1rem;">Close</button>
    `;

        // アニメーション方向をランダム選択（top, bottom, left, right）
        //const directions = ["top", "bottom", "left", "right"];
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