document.querySelectorAll("#category-menu li").forEach(btn => {
  btn.addEventListener("click", () => {
    // 選択中のカテゴリーを取得
    selectedCategory = btn.getAttribute("data-category");

    // ページを最初に戻す
    currentPage = 1;

    // active クラスの切り替え
    document.querySelectorAll("#category-menu li").forEach(li => li.classList.remove("active"));
    btn.classList.add("active");

    // ギャラリー描画
    renderGallery();
  });
});

function filterArtworks() {
  return artworks.filter(item =>
    selectedCategory === "all" || item.category === selectedCategory
  );
}
