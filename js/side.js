$(document).ready(function () {
  // サイドバー読み込み
  fetch("sidebar.html")
    .then(response => response.text())
    .then(data => {
      $('#sidebar-container').html(data);
      setupCategoryToggle(); // ← 読み込み後にJSを実行
    })
    .catch(error => {
      console.error('Error loading sidebar:', error);
    });

  function setupCategoryToggle() {
    const categoryMenu = document.getElementById("category-menu");
    const categoryHeader = document.getElementById("category-header");
    let isManuallyToggled = false;

    if (!categoryMenu || !categoryHeader) {
      console.warn("Category menu or header not found.");
      return;
    }

    // 手動トグル
    categoryHeader.addEventListener("click", () => {
      categoryMenu.classList.toggle("collapsed");
      isManuallyToggled = true;

      // 3秒後に自動スクロール反応を再有効
      setTimeout(() => {
        isManuallyToggled = false;
      }, 3000);
    });

    // スクロールによる自動折りたたみ
    window.addEventListener("scroll", () => {
      if (isManuallyToggled) return;

      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 200) {
        categoryMenu.classList.add("collapsed");
      } else {
        categoryMenu.classList.remove("collapsed");
      }
    });
  }
});
