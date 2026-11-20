// Lens cursor (tuned by the user, 2026-11-19; shared by
// every page since 2026-11-20): a glass lens follows the
// pointer with no lag and refracts the page beneath it —
// a small lens at rest (40px via the CSS scale), growing
// over links and buttons to the tuned 100px hover state.
// Refraction 200%, rim light 20%, chromatic aberration
// 200% (the SVG filter runs the same map at three scales
// for the R/G/B channels). The radial displacement map is
// generated here: sample points pull toward the center,
// strongest at t=0.58, and reach zero at the rim so the
// page stays continuous. Fine pointers only; reduced
// motion keeps the native cursor. The elements are built
// here so every page only needs this one script tag; the
// styles live in css/all.css. The lens layers sit above
// the entry gate and the page-transition overlay so the
// cursor also works on the TOP language selection.
(function () {
    function init() {
        if (document.getElementById("lensCursor")) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const holder = document.createElement("div");
        holder.innerHTML =
            '<div class="lens-cursor" id="lensCursor" aria-hidden="true"><div class="lens-cursor__disc"><div class="lens-cursor__glass"></div></div></div>' +
            '<div class="lens-cursor-blend" id="lensBlend" aria-hidden="true"><div class="lens-cursor-blend__disc"></div></div>' +
            '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
            '<filter id="lens-filter" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">' +
            '<feImage id="lensMap" x="0" y="0" width="64" height="64" preserveAspectRatio="none" result="map" />' +
            '<feDisplacementMap in="SourceGraphic" in2="map" scale="60" xChannelSelector="R" yChannelSelector="G" result="dispR" />' +
            '<feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="chanR" />' +
            '<feDisplacementMap in="SourceGraphic" in2="map" scale="40" xChannelSelector="R" yChannelSelector="G" result="dispG" />' +
            '<feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="chanG" />' +
            '<feDisplacementMap in="SourceGraphic" in2="map" scale="20" xChannelSelector="R" yChannelSelector="G" result="dispB" />' +
            '<feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="chanB" />' +
            '<feComposite in="chanR" in2="chanG" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg" />' +
            '<feComposite in="rg" in2="chanB" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />' +
            '</filter></defs></svg>';
        while (holder.firstChild) document.body.appendChild(holder.firstChild);

        const lens = document.getElementById("lensCursor");
        const blend = document.getElementById("lensBlend");
        if (!lens) return;
        try {
            const S = 128;
            const cv = document.createElement("canvas");
            cv.width = S;
            cv.height = S;
            const ctx = cv.getContext("2d");
            const img = ctx.createImageData(S, S);
            const SCALE = 20;
            const MAXD = 11;
            for (let y = 0; y < S; y++) {
                for (let x = 0; x < S; x++) {
                    const nx = ((x + 0.5) / S) * 2 - 1;
                    const ny = ((y + 0.5) / S) * 2 - 1;
                    const r = Math.hypot(nx, ny);
                    const t = Math.min(r, 1);
                    let dx = 0;
                    let dy = 0;
                    if (r > 0.001) {
                        const mag = -MAXD * ((t * (1 - t * t)) / 0.3849);
                        dx = (nx / r) * mag;
                        dy = (ny / r) * mag;
                    }
                    const i = (y * S + x) * 4;
                    img.data[i] = Math.max(0, Math.min(255, Math.round(127.5 + dx * (255 / (2 * SCALE)))));
                    img.data[i + 1] = Math.max(0, Math.min(255, Math.round(127.5 + dy * (255 / (2 * SCALE)))));
                    img.data[i + 2] = 128;
                    img.data[i + 3] = 255;
                }
            }
            ctx.putImageData(img, 0, 0);
            const fe = document.getElementById("lensMap");
            if (fe) {
                const url = cv.toDataURL("image/png");
                fe.setAttribute("href", url);
                fe.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);
            }
        } catch (e) {
            // The lens still works as a plain glass disc.
        }
        let tx = -100;
        let ty = -100;
        let shown = false;
        window.addEventListener("pointermove", (e) => {
            tx = e.clientX;
            ty = e.clientY;
            if (!shown) {
                shown = true;
                document.body.classList.add("lens-cursor-on");
                lens.style.opacity = "1";
                if (blend) blend.style.opacity = "1";
            }
            // Lag is 0ms (user setting): follow immediately.
            lens.style.transform = `translate(${tx - 32}px, ${ty - 32}px)`;
            if (blend) blend.style.transform = `translate(${tx - 32}px, ${ty - 32}px)`;
        }, { passive: true });
        // Hover state: over links and buttons the small
        // lens grows to the tuned hover state (CSS scale).
        const interactive = "a, button, [role=\"button\"], input, select, textarea, label";
        document.addEventListener("pointerover", (e) => {
            const hit = e.target && e.target.closest ? e.target.closest(interactive) : null;
            document.body.classList.toggle("lens-cursor-hover", !!hit);
        }, { passive: true });
        document.documentElement.addEventListener("pointerleave", () => {
            shown = false;
            document.body.classList.remove("lens-cursor-on");
            lens.style.opacity = "0";
            if (blend) blend.style.opacity = "0";
        });
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
