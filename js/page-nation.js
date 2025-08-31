const { link } = require("fs");

function setupCategoryFilter() {
    //let currentLang = localStorage.getItem("lang") || "ja";
    //const getLang = () => currentLang;

    const artworks = [
        {
            //title
            title: { ja: "蒼想", en: "Sōsō / Soso" },
            //展示、未展示
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            //制作について、キャプション
            text: { ja: "青が喚起する未来や希望のイメージに、あえて冷たさや距離感を織り交ぜることで、感情の安易な誘導を避けている。観る人の意識が作品に触れた瞬間、見えない波動が静かに作用し、思考や視点にゆるやかな変化をもたらすよう設計している。本作は、時間を超えて働きかける「感覚の設計図」として存在している。思いや意図は、言葉にすることで確かに伝わる。一方で、波動やエネルギーは可視化できず、感じ取れる人にしか届かない。それでも、言葉がなくとも“何か”が伝わる感覚は、確かに存在する。果たして、永く残るのは明確な言語なのか、それとも目に見えない感覚なのか。本作は、その問いを視覚的に構成し、見る人の内側に静かに働きかける。", en: "By deliberately intertwining a sense of coldness and distance with the imagery of future and hope that blue evokes, I am avoiding the easy manipulation of emotions. The moment the viewer's consciousness touches the artwork, an invisible wave quietly acts, bringing about a gentle change in thought and perspective. This work exists as a 'blueprint of sensation' that influences beyond the constraints of time. Thoughts and intentions can surely be conveyed through words. However, waves and energies cannot be visualized and only reach those who can perceive them. Even so, the sense that 'something' is conveyed without words certainly exists. Ultimately, what remains longer: clear language or an invisible sensation? This work visually constructs that question and quietly influences the viewer's inner self." },
            //制作 年、ジャンル
            category: ["2024", "Paint"],
            //作法
            textContent: { ja: "油絵具, 水彩, アクリル, キャンバス, オーダー", en: "Oil paint, watercolor, acrylic, canvas, order" },
            //gallery img
            img: "img/蒼想-web.jpg",
            //modal img
            ImageData: "img/蒼想-web02.jpg"
        },//Unreleased
        {
            title: { ja: "#2344", en: "#2344" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            text: { ja: "目に見えないエネルギーや波動が、人の心や感覚にどのように伝わり作用するかを主題に据えたシリーズ。物質的な形態を超え、視覚表現を通じて感覚や思考を変容させる設計を意図。作品に込めたエネルギーは、言葉や説明を介さずとも、受け手の無意識に作用し、感情や解釈を揺さぶる装置として機能する。伝達されるものは曖昧で、固定された意味を持たない一方で、観る人の意識を媒介として伝わる。見えない設計図のように構築された作品群は、鑑賞のたびに異なる波動を放ち、時間や距離を超えて感覚の奥深くに残り続けることを目指しています。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital"],
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            img: "img/202344-1-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "#2342", en: "#2342" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            text: { ja: "目に見えないエネルギーや波動が、人の心や感覚にどのように伝わり作用するかを主題に据えたシリーズ。物質的な形態を超え、視覚表現を通じて感覚や思考を変容させる設計を意図。作品に込めたエネルギーは、言葉や説明を介さずとも、受け手の無意識に作用し、感情や解釈を揺さぶる装置として機能する。伝達されるものは曖昧で、固定された意味を持たない一方で、観る人の意識を媒介として伝わる。見えない設計図のように構築された作品群は、鑑賞のたびに異なる波動を放ち、時間や距離を超えて感覚の奥深くに残り続けることを目指しています。", en: "For inquiries about this work, please contact us through the Contact form on our website." },
            category: ["2023", "Digital"],
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            img: "img/202342-web.jpg",
            ImageData: "img/202343-2.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "#2341", en: "#2341" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202341-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "#2340", en: "#2340" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202340-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"

        },
        {
            title: { ja: "#2339", en: "#2339" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202339-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "#2338", en: "#2338" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202338-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "心樹", en: "Shinju" },
            caption: { ja: "展示作品：デジタル", en: "Exhibited works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            text: { ja: "幾重にも重ねた変化の葉が、やがてひとつの球体を結び、 それは心の奥底──静かにたゆたう源を象っています。 大地に根を張るように、静かに光る 目には見えない「エネルギー（心）の源」を表現しました。", en: "The layers of changing leaves, stacked upon each other, eventually form a single sphere, which symbolizes the depths of the heart – a quietly swaying source. Just as roots are anchored in the earth, it expresses the unseen 'source of energy (heart)' that shines quietly." },
            category: ["2023", "Digital"],
            img: "img/心樹-web.jpg",
            ImageData: "img/202343-2.jpg"
        },
        {
            title: { ja: "#2337", en: "#2337" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202337-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "#2336", en: "#2336" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202336-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "#2334", en: "#2334" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202334-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "#2326", en: "#2326" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202326-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },
        {
            title: { ja: "#2319", en: "#2319" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2023", "Digital"],
            img: "img/202319-web.jpg",
            link: "https://opensea.io/0x99c7a15cd91d9acb4d9fb047e453639f0efa2335/galleries"
        },//2022
        {
            title: { ja: "映し神", en: "Utsushigami" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            category: ["2022", "Paint"],
            img: "img/映し神-web.jpg"
        },
        {
            title: { ja: "#2203", en: "#2203" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            category: ["2022", "Paint"],
            img: "img/202203-web.jpg"
        },
        {
            title: { ja: "#2202", en: "#2202" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            category: ["2022", "Paint"],
            img: "img/202202-web.jpg"
        },
        {
            title: { ja: "#2201", en: "#2201" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "生成AI, 加工", en: "Generative AI, processing" },
            category: ["2022", "Digital"],
            img: "img/202201-web.jpg",
            link: ""
        },
        {
            title: { ja: "挑戦", en: "Chōsen / Chousen" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            category: ["2022", "Paint"],
            img: "img/挑戦-web.jpg"
        },//========2021
        {
            title: { ja: "#2110", en: "#2110" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "映像, 加工", en: "Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202110-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "広縁", en: "Kōen" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "映像, 加工", en: "Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/広縁-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "心境", en: "Shinkyō" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "映像, 加工", en: "Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/心境-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2109", en: "#2109" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202109-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2108", en: "#2108" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202108-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2107", en: "#2107" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202107-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2106", en: "#2106" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202106-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2105", en: "#2105" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202105-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2104", en: "#2104" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202104-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2103", en: "#2103" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202103-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2102", en: "#2102" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202102-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "#2101", en: "#2101" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Photo, 生成AI, 加工", en: "Photo, Generative AI, processing" },
            category: ["2021", "Digital"],
            img: "img/202101-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },
        {
            title: { ja: "戦争", en: "Sensō / Senso" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            category: ["2021", "Paint"],
            img: "img/戦争-web.jpg"
        },
        {
            title: { ja: "幸緑", en: "Konryoku" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            category: ["2021", "Paint"],
            img: "img/幸緑-web.jpg"
        },
        {
            title: { ja: "金雲", en: "Kin’un / Kinuun" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            text: { ja: "幸福を呼ぶ、輝きたなびく雲をイメージ。金色の中に、静けさと力強さが同居する。人は、たった一つの色から何を感じ、何を思い出すのか。この作品は、見る人の記憶や感情にそっと問いかける。", en: "The image is of sparkling, fluttering clouds that bring happiness. Calmness and strength coexist in the gold color. What do people feel and remember from just one color? This work gently questions the memories and emotions of the viewer." },
            category: ["2021", "Paint"],
            img: "img/金雲-web.jpg"
        },
        {
            title: { ja: "輝き", en: "Kagayaki" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            text: { ja: "光と闇が混ざり合う狭間。その中から生まれる「輝き」は、ただ明るいだけの光ではなく、闇を知ることで初めて放たれる深みを持った光。この作品は、人生や内面に潜む暗がりを抱えながらも、そこから立ち上がる力や、心の奥で静かに灯る希望を象徴しています。見る人の中にある「影」にそっと寄り添いながらも、無意識の領域へ静かに光を届け、感情の奥深くを揺らすことを意図しています。「輝き」は固定された意味を持たず、観るたびに異なる解釈や波動をもたらします。それはまるで、あなたの心が必要とするメッセージを、そっと差し出すかのように。<br>本作は、TAJO（トスカーナ芸術鑑定機構）より公式認定を受けています。", en: "A gap where light and darkness mix.The 'glow' that emerges from there is not just bright light, but a deep light that can only be emitted by knowing the darkness.This work symbolizes the strength to rise from the darkness that lurks in one's life and within oneself, and the hope that quietly lights up deep in the heart.The work is intended to gently embrace the 'shadow' within the viewer, while quietly delivering light to the unconscious and stirring the depths of one's emotions.'Glow' has no fixed meaning, and brings about different interpretations and vibrations each time you view it.It is as if it is gently offering you a message that your heart needs." },
            category: ["2021", "Paint", "Certified"],
            img: "img/輝き-web.jpg"
        },
        {
            title: { ja: "#2100", en: "#2100" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            category: ["2021", "Paint"],
            img: "img/202100-web.jpg",
            link: "https://opensea.io/ja/collection/massless-energy-art"
        },//========2010~17
        {
            title: { ja: "#1702", en: "#1702" },
            caption: { ja: "未発表作品｜Category：Collage", en: "Unpublished Works｜Category：Collage" },
            text: { ja: "専門学校デザイン科に入学後、課題制作として取り組んだ作品。一枚の紙を破り、構成し直すことで「見え方が変わる」という視覚的変化に着目。破る、貼るというシンプルな行為を通して、素材の新たな表情や関係性を探った。紙という日常的な素材に手を加えることで、固定されたイメージからの解放を試みた作品。", en: "This is a piece that I worked on as an assignment after entering a vocational school's design department. I focused on the visual change of 'how it looks' by tearing a piece of paper and recomposing it. Through the simple act of tearing and pasting, I explored new expressions and relationships of the material. By tinkering with the everyday material of paper, this piece attempted to free itself from fixed images." },
            category: ["2010-2017", "Collage"],
            img: "img/201702-web.jpg"
        },
        {
            title: { ja: "#1701", en: "#1701" },
            caption: { ja: "未発表作品｜Category：Collage", en: "Unpublished Works｜Category：Collage" },
            textContent: { ja: "コラージュ, 画用紙", en: "Collage, Drawing paper" },
            text: { ja: "専門学校デザイン科に入学後、課題制作として取り組んだ作品。一枚の紙を破り、構成し直すことで「見え方が変わる」という視覚的変化に着目。破る、貼るというシンプルな行為を通して、素材の新たな表情や関係性を探った。紙という日常的な素材に手を加えることで、固定されたイメージからの解放を試みた作品。", en: "This is a piece that I worked on as an assignment after entering a vocational school's design department. I focused on the visual change of 'how it looks' by tearing a piece of paper and recomposing it. Through the simple act of tearing and pasting, I explored new expressions and relationships of the material. By tinkering with the everyday material of paper, this piece attempted to free itself from fixed images." },
            category: ["2010-2017", "Collage"],
            img: "img/201701-web.jpg"
        },
        {
            title: { ja: "海底", en: "Kaitei" },
            caption: { ja: "未発表作品 Certified", en: "Unpublished Works" },
            textContent: { ja: "Paint, 抽象画, 画用紙", en: "Paint, abstract painting, Drawing paper" },
            text: { ja: "高校3年次制作。<br>当初は「冬」をテーマに描き始めたが、完成した作品を改めて見つめたとき、深海を連想させるような印象を受けたため「海底」と改題。深海に差し込むような白い光や、感情が色彩として混ざり合うような表現を通して、内面の静けさや揺らぎを描いた一枚。見る者によって異なる景色が立ち現れる、抽象的な感覚表現を目指した。<br>本作は、日本・モンゴル外交関係樹立50周年記念事業認定より公式認定を受けています。", en: "Created in the third year of high school. <br>Initially, he started painting with the theme of 'winter', but when he looked at the finished work again, he was reminded of the deep sea, so he renamed it 'Undersea'. This piece depicts inner tranquility and fluctuation through the expression of white light shining into the deep sea and emotions mixed together as colors. He aimed for an abstract sensory expression that will reveal different scenes depending on the viewer. <br>This work has been officially certified as part of the 50th anniversary of the establishment of diplomatic relations between Japan and Mongolia." },
            category: ["2010-2017", "Paint"],
            img: "img/海底-web.jpg"
        },
        {
            title: { ja: "無題", en: "Mudai" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 抽象画, 画用紙", en: "Paint, abstract painting, Drawing paper" },
            text: { ja: "高校3年次制作。<br>溜め込んだ感情は、時間とともに濃度を増す。創作を離れた1年間の静けさは、やがて嵐のように筆先へと現れた。日々の放課後、美術室の片隅で生まれた「無題」のこの作品は、自分の奥に沈んでいたものたちを、初めて他者に見せるための入り口だった。<br>2016年｜第67回宮城県高等学校美術展（優秀賞）賞", en: "Created in the third year of high school. <br>Packed-up emotions become more intense with time. The calm of a year away from creating eventually emerged like a storm on the tip of the brush. This 'Untitled' work, born in a corner of the art room every day after school, was the gateway for the artist to show others for the first time the things that had been buried deep inside him. <br>2016 | Awarded the Excellence Award at the 67th Miyagi Prefectural High School Art Exhibition" },
            category: ["2010-2017", "Paint"],
            img: "img/2016無題-web.jpg"
        },//#2015
        {
            title: { ja: "#1504", en: "#1504" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Paint, 抽象画, 画用紙", en: "Paint, abstract painting, Drawing paper" },
            text: { ja: "高校2年次制作。", en: "" },
            category: ["2010-2017", "Paint"],
            img: "img/201504-web.jpg"
        },
        {
            title: { ja: "#1503", en: "#1503" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Paint, 抽象画, 画用紙", en: "Paint, abstract painting, Drawing paper" },
            text: { ja: "高校2年次制作。", en: "" },
            category: ["2010-2017", "Paint"],
            img: "img/201503-web.jpg"
        },
        {
            title: { ja: "#1502", en: "#1502" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Paint, イラスト, 画用紙", en: "Paint, Illustration, Drawing paper" },
            text: { ja: "高校2年次制作。<br>溜め込んだ感情は、時間とともに濃度を増す。創作を離れた1年間の静けさは、やがて嵐のように筆先へと現れた。日々の放課後、美術室の片隅で生まれた「無題」のこの作品は、自分の奥に沈んでいたものたちを、初めて他者に見せるための入り口だった。<br>2016年｜第67回宮城県高等学校美術展（優秀賞）賞", en: "Created in the third year of high school. <br>Packed-up emotions become more intense with time. The calm of a year away from creating eventually emerged like a storm on the tip of the brush. This 'Untitled' work, born in a corner of the art room every day after school, was the gateway for the artist to show others for the first time the things that had been buried deep inside him. <br>2016 | Awarded the Excellence Award at the 67th Miyagi Prefectural High School Art Exhibition" },
            category: ["2010-2017", "Paint"],
            img: "img/201502-web.jpg"
        },
        {
            title: { ja: "#1501", en: "#1501" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Paint, イラスト, 画用紙", en: "Paint, Illustration, Drawing paper" },
            text: { ja: "高校2年次制作。<br>溜め込んだ感情は、時間とともに濃度を増す。創作を離れた1年間の静けさは、やがて嵐のように筆先へと現れた。日々の放課後、美術室の片隅で生まれた「無題」のこの作品は、自分の奥に沈んでいたものたちを、初めて他者に見せるための入り口だった。<br>2016年｜第67回宮城県高等学校美術展（優秀賞）賞", en: "Created in the third year of high school. <br>Packed-up emotions become more intense with time. The calm of a year away from creating eventually emerged like a storm on the tip of the brush. This 'Untitled' work, born in a corner of the art room every day after school, was the gateway for the artist to show others for the first time the things that had been buried deep inside him. <br>2016 | Awarded the Excellence Award at the 67th Miyagi Prefectural High School Art Exhibition" },
            category: ["2010-2017", "Paint"],
            img: "img/201501-web.jpg"
        },//#2014
        {
            title: { ja: "#1402", en: "#1402" },
            caption: { ja: "未発表作品", en: "Unpublished Works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次2作目の作品。<br>頭の中にあるイメージや感覚を、そのまま画面に落とし込むことを意識して制作した。具象的なモチーフを持たず、線や色彩、構成の流れを通じて思考の断片を可視化している。完成された形を目指すのではなく、描く行為そのものを探求する過程でもあった。", en: "This is my second work from my first year of high school. I created this piece with the intention of putting the images and feelings in my head directly onto the canvas. There is no concrete motif, and I visualize fragments of my thoughts through lines, colors, and the flow of the composition. It was also a process of exploring the act of drawing itself, rather than aiming for a completed form." },
            category: ["2010-2017", "Paint"],
            img: "img/201402-web.jpg"
        },
        {
            title: { ja: "#1401", en: "#1401" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次に制作した初めての大判作品。<br>スケッチブックとは異なるスケールの中で、構図のバランスや余白の扱いを模索しながら、空間に対する意識を広げていった。初期衝動や試行錯誤の痕跡がそのまま画面に残っている。", en: "This was the first large-format work I created in my first year of high school. <br>In a scale different from that of a sketchbook, I expanded my awareness of space while exploring the balance of the composition and how to use the white space. Traces of my initial impulses and trial and error remain on the canvas." },
            category: ["2010-2017", "Paint"],
            img: "img/201401-web.jpg"
        },//#2013
        {
            title: { ja: "#1307", en: "#1307" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次に制作した初めての大判作品。<br>スケッチブックとは異なるスケールの中で、構図のバランスや余白の扱いを模索しながら、空間に対する意識を広げていった。初期衝動や試行錯誤の痕跡がそのまま画面に残っている。", en: "This was the first large-format work I created in my first year of high school. <br>In a scale different from that of a sketchbook, I expanded my awareness of space while exploring the balance of the composition and how to use the white space. Traces of my initial impulses and trial and error remain on the canvas." },
            category: ["2010-2017", "Paint"],
            img: "img/201307-web.jpg"
        },
        {
            title: { ja: "#1306", en: "#1306" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次に制作した初めての大判作品。<br>スケッチブックとは異なるスケールの中で、構図のバランスや余白の扱いを模索しながら、空間に対する意識を広げていった。初期衝動や試行錯誤の痕跡がそのまま画面に残っている。", en: "This was the first large-format work I created in my first year of high school. <br>In a scale different from that of a sketchbook, I expanded my awareness of space while exploring the balance of the composition and how to use the white space. Traces of my initial impulses and trial and error remain on the canvas." },
            category: ["2010-2017", "Paint"],
            img: "img/201306-web.jpg"
        },
        {
            title: { ja: "#1305", en: "#1305" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次に制作した初めての大判作品。<br>スケッチブックとは異なるスケールの中で、構図のバランスや余白の扱いを模索しながら、空間に対する意識を広げていった。初期衝動や試行錯誤の痕跡がそのまま画面に残っている。", en: "This was the first large-format work I created in my first year of high school. <br>In a scale different from that of a sketchbook, I expanded my awareness of space while exploring the balance of the composition and how to use the white space. Traces of my initial impulses and trial and error remain on the canvas." },
            category: ["2010-2017", "Paint"],
            img: "img/201305-web.jpg"
        },
        {
            title: { ja: "#1304", en: "#1304" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次に制作した初めての大判作品。<br>スケッチブックとは異なるスケールの中で、構図のバランスや余白の扱いを模索しながら、空間に対する意識を広げていった。初期衝動や試行錯誤の痕跡がそのまま画面に残っている。", en: "This was the first large-format work I created in my first year of high school. <br>In a scale different from that of a sketchbook, I expanded my awareness of space while exploring the balance of the composition and how to use the white space. Traces of my initial impulses and trial and error remain on the canvas." },
            category: ["2010-2017", "Paint"],
            img: "img/201304-web.jpg"
        },
        {
            title: { ja: "#1303", en: "#1303" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次に制作した初めての大判作品。<br>スケッチブックとは異なるスケールの中で、構図のバランスや余白の扱いを模索しながら、空間に対する意識を広げていった。初期衝動や試行錯誤の痕跡がそのまま画面に残っている。", en: "This was the first large-format work I created in my first year of high school. <br>In a scale different from that of a sketchbook, I expanded my awareness of space while exploring the balance of the composition and how to use the white space. Traces of my initial impulses and trial and error remain on the canvas." },
            category: ["2010-2017", "Paint"],
            img: "img/201303-web.jpg"
        },
        {
            title: { ja: "#1302", en: "#1302" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次に制作した初めての大判作品。<br>スケッチブックとは異なるスケールの中で、構図のバランスや余白の扱いを模索しながら、空間に対する意識を広げていった。初期衝動や試行錯誤の痕跡がそのまま画面に残っている。", en: "This was the first large-format work I created in my first year of high school. <br>In a scale different from that of a sketchbook, I expanded my awareness of space while exploring the balance of the composition and how to use the white space. Traces of my initial impulses and trial and error remain on the canvas." },
            category: ["2010-2017", "Paint"],
            img: "img/201302-web.jpg"
        },
        {
            title: { ja: "#1301", en: "#1301" },
            caption: { ja: "展示作品", en: "Exhibited works" },
            textContent: { ja: "Paint, 画用紙", en: "Paint, Drawing paper" },
            text: { ja: "高校1年次に制作した初めての大判作品。<br>スケッチブックとは異なるスケールの中で、構図のバランスや余白の扱いを模索しながら、空間に対する意識を広げていった。初期衝動や試行錯誤の痕跡がそのまま画面に残っている。", en: "This was the first large-format work I created in my first year of high school. <br>In a scale different from that of a sketchbook, I expanded my awareness of space while exploring the balance of the composition and how to use the white space. Traces of my initial impulses and trial and error remain on the canvas." },
            category: ["2010-2017", "Paint"],
            img: "img/201301-web.jpg"
        }
    ];

    const itemsPerPage = 8;
    let selectedCategory = "all";
    let currentPage = 1;
    let filtered = [];

    function getLang() {
        return document.documentElement.lang === "ja" ? "ja" : "en";
    }

    function filterArtworks() {
        return selectedCategory === "all"
            ? artworks
            : artworks.filter(item => item.category.includes(selectedCategory));
    }

    function truncateText(text, maxLength = 500) {
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
            <p class="noise cg-text" style="font-size: 1.4rem; font-weight: 500; position: absolute; top: -5rem; left: 1%; width: max-content; letter-spacing: 0; justify-content: flex-start; padding: 0; margin: 0 !important; border-bottom: 1px solid; line-height: 2;">
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
        const firstLine = item.category[0] || "";
        const secondLine = item.category.slice(1).join(" ") || "";
        const hasLink = !!item.link;
        const buttonLabel = hasLink && item.link.includes("buy") ? "Buy" : "View";

        const modalBox = document.getElementById("modalBox");

        modalBox.innerHTML = `
        <div class="work-img">
            <div class="works">
                <h2>${item.title[lang]}</h2>
                <p>
                    ${firstLine}
                    <br>
                    Media：${secondLine} <span class="text-content">(${truncateText(item.textContent[lang])})</span>
                    <br>
                    ${truncateText(item.caption[lang])}
                </p>
            </div>
            <img src="${item.ImageData || item.img}" alt="${item.title[lang]}" style="margin: 10vmin auto; opacity: 1;">
            <p class="noise cg-text" style="font-weight: 500; position: relative; top: 0rem; left: 0; width: fit-content; border-bottom: 1px solid;">
                Category | ${secondLine}
            </p>
            <div class="modal-text">
                <p>${truncateText(item.text[lang])}</p>
                ${hasLink ? `
                <a href="${item.link}" class="noise" style="font-size: 1.2rem; margin-top: 1vmin; border-bottom: 3px solid;" rel="noopener" target="_blank">${buttonLabel} More</a>
                ` : ""}
                <p lang="ja">
                    作品「${item.title[lang]}」についてのお問い合せは当WebサイトのContactページのフォームよりご連絡ください。
                </p>
                <p lang="en">
                    For inquiries about the work「${item.title[lang]}」, please contact us using the form on the Contact page of this website.
                </p>
                <a href="contact.html" class="noise" style="font-size: 1.2rem; margin-top: 1vmin; border-bottom: 3px solid;">Contact</a>
                <button id="modalCloseBtn">Close</button>
            </div>
        </div>
    `;

        modalBox.className = `modal-box animate-bottom`;
        document.getElementById("modalOverlay").style.display = "block";
        modalBox.style.display = "block";

        document.getElementById("modalCloseBtn").onclick = closeModal;
        document.getElementById("modalOverlay").onclick = closeModal;

        function closeModal() {
            modalBox.style.display = "none";
            document.getElementById("modalOverlay").style.display = "none";
            modalBox.className = "modal-box";
        }
    }

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pagination = document.getElementById("pagination");
        if (!pagination) return;
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = i === currentPage ? "active" : "";
            btn.addEventListener("click", () => {
                currentPage = i;
                renderGallery();
            });
            pagination.appendChild(btn);
        }
    }

    function smoothScrollToTop(duration) {
        const start = window.scrollY || document.documentElement.scrollTop;
        const startTime = performance.now();

        function scroll(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            window.scrollTo(0, start * (1 - progress));
            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        }

        requestAnimationFrame(scroll);
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