document.addEventListener("DOMContentLoaded", function () {
    // This file is bundled once, but a duplicate copy used to create two
    // cursor/stalker pairs and two mousemove handlers on every page.
    if (document.getElementById("cursor") || document.getElementById("stalker")) {
        return;
    }

    const cursor = document.createElement("div");
    cursor.id = "cursor";
    document.body.appendChild(cursor);

    const stalker = document.createElement("div");
    stalker.id = "stalker";
    document.body.appendChild(stalker);

    cursor.style.opacity = "0";
    stalker.style.opacity = "0";

    document.addEventListener("mousemove", event => {
        const { clientX: x, clientY: y } = event;

        cursor.style.opacity = "1";
        stalker.style.opacity = "1";
        cursor.style.top = `${y}px`;
        cursor.style.left = `${x}px`;

        setTimeout(() => {
            stalker.style.top = `${y}px`;
            stalker.style.left = `${x}px`;
        }, 100);
    });

    // Delegation keeps hover behavior working for header/footer fragments
    // that are loaded after this bundle and avoids one listener per element.
    const hoverSelector = [
        "a",
        "button",
        ".button",
        ".toggle_btn",
        "label",
        "#category-header",
        "#category-menu li",
        ".work-img a",
        "#pagination",
        "#modalCloseBtn"
    ].join(", ");

    const findHoverTarget = node => {
        if (!node || node.nodeType !== 1 || typeof node.closest !== "function") {
            return null;
        }
        return node.closest(hoverSelector);
    };

    const setHoverState = active => {
        cursor.classList.toggle("cursor--hover", Boolean(active));
        stalker.classList.toggle("stalker--hover", Boolean(active));
    };

    document.addEventListener("mouseover", event => {
        const target = findHoverTarget(event.target);
        const related = findHoverTarget(event.relatedTarget);
        if (target !== related) {
            setHoverState(target);
        }
    });

    document.addEventListener("mouseout", event => {
        const target = findHoverTarget(event.target);
        const related = findHoverTarget(event.relatedTarget);
        if (target && target !== related) {
            setHoverState(null);
        }
    });
});
