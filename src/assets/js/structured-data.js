// Keep this reference data aligned with the JSON-LD embedded in the public
// home and biography pages. Do not add social URLs until they are confirmed.
const structuredData = {
   "@context": "https://schema.org",
   "@type": "Person",
   "@id": "https://mizukioyama.github.io/website/#person",
   "name": "小山瑞樹",
   "alternateName": "Mizuki Oyama",
   "url": "https://mizukioyama.github.io/website/",
   "image": "https://mizukioyama.github.io/website/img/shinju.jpg",
   "jobTitle": "Artist"
};

if (typeof module !== "undefined") {
   module.exports = structuredData;
}
