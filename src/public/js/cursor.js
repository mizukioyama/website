document.addEventListener("DOMContentLoaded", function () {
  // カーソルとストーカーを作成
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  document.body.appendChild(cursor);

  const stalker = document.createElement("div");
  stalker.id = "stalker";
  document.body.appendChild(stalker);

  // 初期非表示（オプション）
  cursor.style.opacity = "0";
  stalker.style.opacity = "0";

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

  // ホバー処理（必要なセレクタを追加）
  const hoverTargets = [
    "a",
    "body a",
    "button",
    ".button",
    "header .toggle_btn",
    "header label",
    "nav ul li a",
    "footer a",
    "#category-header",
    "#category-menu li",
    ".work-img a",
    "#pagination",
    "#modalCloseBtn"
  ];

  document.querySelectorAll(hoverTargets.join(", ")).forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor--hover");
      stalker.classList.add("stalker--hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor--hover");
      stalker.classList.remove("stalker--hover");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // カーソルとストーカーを作成
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  document.body.appendChild(cursor);

  const stalker = document.createElement("div");
  stalker.id = "stalker";
  document.body.appendChild(stalker);

  // 初期非表示（オプション）
  cursor.style.opacity = "0";
  stalker.style.opacity = "0";

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

  // ホバー処理（必要なセレクタを追加）
  const hoverTargets = [
    "a",
    "body a",
    "button",
    ".button",
    "header .toggle_btn",
    "header label",
    "nav ul li a",
    "footer a",
    "#category-header",
    "#category-menu li",
    ".work-img a",
    "#pagination",
    "#modalCloseBtn"
  ];

  document.querySelectorAll(hoverTargets.join(", ")).forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor--hover");
      stalker.classList.add("stalker--hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor--hover");
      stalker.classList.remove("stalker--hover");
    });
  });
});
