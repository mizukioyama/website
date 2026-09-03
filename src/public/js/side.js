$(document).ready(function () {
fetch("sidebar.html")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Sidebar request failed: ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    $('#sidebar-container').html(data);
    setupCategoryToggle();  // ← サイドバー用
    if (typeof setupCategoryFilter === 'function') {
      setupCategoryFilter();  // ← ギャラリー表示もここで呼ぶ！！
    }
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

    categoryHeader.addEventListener("click", () => {
      categoryMenu.classList.toggle("collapsed");
      isManuallyToggled = true;
      setTimeout(() => {
        isManuallyToggled = false;
      }, 3000);
    });

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
