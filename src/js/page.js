document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const pageLinks = Array.from(document.querySelectorAll(".page-link"));
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  const totalPages = pageLinks.length;
  const works = Array.from(document.querySelectorAll(".content .work[data-category]"));
  const categoryValues = new Set(["all", "digital", "analog", "exhibition", "unreleased", "photo"]);

  let currentPage = Number(body?.getAttribute("data-current-page")) || 1;
  let currentCategory = body?.getAttribute("data-current-category") || "all";
  let currentYear = "";

  function readHashState() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const category = params.get("category");
    const year = params.get("year");
    const page = Number(params.get("page"));

    if (categoryValues.has(category)) {
      currentCategory = category;
    }

    currentYear = /^\d{4}$/.test(year || "") ? year : "";

    if (Number.isInteger(page) && page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function writeHashState() {
    const params = new URLSearchParams();

    if (currentCategory && currentCategory !== "all") {
      params.set("category", currentCategory);
    }

    if (currentYear) {
      params.set("year", currentYear);
    }

    if (currentPage > 1) {
      params.set("page", String(currentPage));
    }

    const nextHash = params.toString();
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash ? `#${nextHash}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function getFilter(link) {
    const value = (link.getAttribute("data-page") || "").toLowerCase();

    if (categoryValues.has(value)) {
      return { category: value, year: "" };
    }

    if (/^\d{4}$/.test(value)) {
      return { category: "all", year: value };
    }

    return null;
  }

  function applyGalleryFilter() {
    if (works.length === 0) {
      return;
    }

    works.forEach(work => {
      const categories = (work.getAttribute("data-category") || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const year = work.getAttribute("data-year") || "";
      const categoryMatches = currentCategory === "all" || categories.includes(currentCategory);
      const yearMatches = !currentYear || year === currentYear;
      work.hidden = !(categoryMatches && yearMatches);
    });

    const label = document.querySelector(".content > span");
    if (label) {
      const categoryLabel = currentCategory.toUpperCase();
      label.textContent = currentYear ? `Category / ${currentYear}` : `Category / ${categoryLabel}`;
    }
  }

  function updatePagination() {
    pageLinks.forEach(link => {
      const page = Number(link.getAttribute("data-page"));
      const href = link.getAttribute("data-href");

      if (page === currentPage) {
        link.classList.add("disabled");
        link.removeAttribute("href");
      } else {
        link.classList.remove("disabled");
        if (href) {
          link.setAttribute("href", href);
        }
      }
    });

    if (leftArrow) {
      leftArrow.disabled = currentPage === 1;
    }

    if (rightArrow) {
      rightArrow.disabled = currentPage === totalPages;
    }
  }

  function updateCategoryLinks() {
    document.querySelectorAll(".category-link").forEach(link => {
      const filter = getFilter(link);
      const isCurrent = filter
        && filter.category === currentCategory
        && filter.year === currentYear;
      const href = link.getAttribute("data-href");

      link.classList.toggle("disabled", Boolean(isCurrent));

      if (isCurrent) {
        link.removeAttribute("href");
      } else if (href) {
        link.setAttribute("href", href);
      }
    });
  }

  function applyFilter(filter) {
    currentCategory = filter.category;
    currentYear = filter.year;
    currentPage = 1;
    writeHashState();
    applyGalleryFilter();
    updateCategoryLinks();
    updatePagination();
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) {
      return;
    }

    // The restored backup contains one gallery document. Keep pagination
    // within that document instead of navigating to missing gallery_*.html
    // files, so old links cannot produce a GitHub Pages 404.
    if (works.length > 0) {
      currentPage = page;
      writeHashState();
      updatePagination();
      return;
    }

    const targetLink = pageLinks.find(link => Number(link.getAttribute("data-page")) === page);
    const href = targetLink?.getAttribute("data-href");
    if (href) {
      window.location.href = href;
    }
  }

  pageLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      goToPage(Number(event.currentTarget.getAttribute("data-page")));
    });
  });

  if (leftArrow) {
    leftArrow.addEventListener("click", function () {
      goToPage(currentPage - 1);
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", function () {
      goToPage(currentPage + 1);
    });
  }

  // The sidebar is fetched after DOMContentLoaded. Event delegation keeps
  // category links functional regardless of when that fragment arrives.
  document.addEventListener("click", function (event) {
    const target = event.target;
    const link = target && typeof target.closest === "function"
      ? target.closest("a.category-link")
      : null;

    if (!link) {
      return;
    }

    const filter = getFilter(link);
    if (!filter || works.length === 0) {
      return;
    }

    event.preventDefault();
    applyFilter(filter);
  });

  window.addEventListener("hashchange", function () {
    readHashState();
    applyGalleryFilter();
    updateCategoryLinks();
    updatePagination();
  });

  readHashState();
  applyGalleryFilter();
  updateCategoryLinks();
  updatePagination();

  if (typeof MutationObserver === "function") {
    const fragmentObserver = new MutationObserver(() => {
      updateCategoryLinks();
    });
    fragmentObserver.observe(body, { childList: true, subtree: true });
  }
});
