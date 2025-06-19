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

  // ホバー処理（対象を自由に追加可能）
  document.querySelectorAll("body a, button, .button, label, header li a, footer a, #category-header, #category-menu li, #sidebar-container li, #gallery-container a, #pagination").forEach(el => {
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

  // 初期非表示（オプション）
  cursor.style.opacity = "0";
  stalker.style.opacity = "0";
});
