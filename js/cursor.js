document.addEventListener("DOMContentLoaded", function () {
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  document.body.appendChild(cursor);

  const stalker = document.createElement("div");
  stalker.id = "stalker";
  document.body.appendChild(stalker);

  // 追従処理
  document.addEventListener("mousemove", e => {
    const { clientX: x, clientY: y } = e;

    cursor.style.opacity = "1";
    stalker.style.opacity = "1";

    cursor.style.top = `${y}px`;
    cursor.style.left = `${x}px`;

    setTimeout(() => {
      stalker.style.top = `${y}px`;
      stalker.style.left = `${x}px`;
    }, 100);
  });

  // ✅ 動的要素対応のための「イベントデリゲーション」
  document.body.addEventListener("mouseover", e => {
    const target = e.target.closest("a, button, .button, label, header a, footer a, #category-header, #category-menu li, #sidebar-container li, #gallery-container a, #pagination button");

    if (target) {
      cursor.classList.add("cursor--hover");
      stalker.classList.add("stalker--hover");
    }
  });

  document.body.addEventListener("mouseout", e => {
    const target = e.target.closest("a, button, .button, label, header a, footer a, #category-header, #category-menu li, #sidebar-container li, #gallery-container a, #pagination button");

    if (target) {
      cursor.classList.remove("cursor--hover");
      stalker.classList.remove("stalker--hover");
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  document.body.appendChild(cursor);

  const stalker = document.createElement("div");
  stalker.id = "stalker";
  document.body.appendChild(stalker);

  // 追従処理
  document.addEventListener("mousemove", e => {
    const { clientX: x, clientY: y } = e;

    cursor.style.opacity = "1";
    stalker.style.opacity = "1";

    cursor.style.top = `${y}px`;
    cursor.style.left = `${x}px`;

    setTimeout(() => {
      stalker.style.top = `${y}px`;
      stalker.style.left = `${x}px`;
    }, 100);
  });

  // ✅ 動的要素対応のための「イベントデリゲーション」
  document.body.addEventListener("mouseover", e => {
    const target = e.target.closest("a, button, .button, label, header a, footer a, #category-header, #category-menu li, #sidebar-container li, #gallery-container a, #pagination button");

    if (target) {
      cursor.classList.add("cursor--hover");
      stalker.classList.add("stalker--hover");
    }
  });

  document.body.addEventListener("mouseout", e => {
    const target = e.target.closest("a, button, .button, label, header a, footer a, #category-header, #category-menu li, #sidebar-container li, #gallery-container a, #pagination button");

    if (target) {
      cursor.classList.remove("cursor--hover");
      stalker.classList.remove("stalker--hover");
    }
  });
});