// Keep this reference data aligned with the JSON-LD embedded in the public
// home and biography pages. Only confirmed identity URLs belong in sameAs.
const structuredData = {
   "@context": "https://schema.org",
   "@type": "Person",
   "@id": "https://mizukioyama.github.io/website/#person",
   "name": "小山瑞樹",
   "alternateName": "Mizuki Oyama",
   "url": "https://mizukioyama.github.io/website/",
   "image": "https://mizukioyama.github.io/website/img/shinju.jpg",
   "jobTitle": "Abstract Artist",
   "description": "宮城県仙台市出身の抽象アーティスト。自然や生命、感覚から着想を得た作品を制作するMizuki Oyama。",
   "disambiguatingDescription": "宮城県仙台市出身の抽象アーティストとして活動する小山瑞樹（Mizuki Oyama）。",
   "sameAs": [
      "https://camp-fire.jp/profile/OyamaMizuki",
      "https://note.com/merry_ruff8755",
      "https://www.instagram.com/1998_m.oyama/"
   ]
};

if (typeof module !== "undefined") {
   module.exports = structuredData;
}
