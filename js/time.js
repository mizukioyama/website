// jQueryがロードされるまで待機する
function waitForJQuery(callback) {
    if (window.jQuery) {
        callback(jQuery);
    } else {
        setTimeout(function () {
            waitForJQuery(callback);
        }, 50);
    }
}

// jQueryがロードされた後にすべて実行
waitForJQuery(function ($) {
    const initializeHomeSlides = () => {
        // スライド処理
        const slideElements = ['.back__slide', '.card__slide', '.content__slide'];
        const syncContentControls = () => {
            $('.content__slide').each((_, element) => {
                const active = element.classList.contains('active');
                element.inert = !active;
                element.setAttribute('aria-hidden', String(!active));
            });
        };
        syncContentControls();
        let inProgress = false;

        const restartPing = () => {
            const ping = document.querySelector('.content__ping');
            if (!ping) return;
            ping.classList.remove('play');
            void ping.offsetWidth;
            ping.classList.add('play');
        };
        restartPing();

        const goToSlide = (slideElements, index) => {
            if (!inProgress) {
                inProgress = true;
                // Phones only: hide the fog glow while the
                // switch runs (Mizuki 2026-11-20). Restored
                // when the incoming background lands (3300ms).
                if (window.matchMedia("(max-width: 599px)").matches) {
                    document.body.classList.add("is-switching");
                    clearTimeout(goToSlide._fogTimer);
                    goToSlide._fogTimer = setTimeout(() => document.body.classList.remove("is-switching"), 3300);
                }
                // Belt and braces (Mizuki reported the glow
                // still visible after PR #154): fade the
                // ink-field canvas element itself. The class
                // rule only lives in the <=599px stylesheet
                // block, so set the element style directly
                // and cover phone and portrait-tablet widths.
                const inkCanvas = document.getElementById("selected-ink-field-canvas");
                if (inkCanvas && window.matchMedia("(max-width: 1023px)").matches) {
                    inkCanvas.style.transition = "opacity 300ms ease";
                    inkCanvas.style.opacity = "0";
                    clearTimeout(goToSlide._inkTimer);
                    goToSlide._inkTimer = setTimeout(() => { inkCanvas.style.opacity = ""; }, 3300);
                }
                document.body.classList.add('back--anim');
                restartPing();

                $('.active').addClass('exit');
                $('.active').not('#langChange .active').removeClass('active');
                slideElements.forEach(elem => {
                    $(`${elem}:nth-child(${index})`).addClass('active');
                });

                syncContentControls();

                setTimeout(() => $('.exit').removeClass('exit'), 1500);
                setTimeout(() => inProgress = false, 3000);
            }
        };

        $('.card [data-home-slide]').on('click', function () {
            goToSlide(slideElements, Number(this.dataset.homeSlide));
        });

        const autoTimers = [
            setTimeout(() => goToSlide(slideElements, 2), 2000)
        ];

        $('[data-card-nav]').on('click', function () {
            autoTimers.forEach(timer => clearTimeout(timer));
            const count = $('.back__slide').length;
            const current = $('.back__slide.active').index() + 1;
            const step = this.dataset.cardNav === 'next' ? 1 : -1;
            goToSlide(slideElements, ((current - 1 + step + count) % count) + 1);
        });

        // 時刻表示
        function updateParisTime() {
            var now = new Date();
            var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            var parisTime = new Date(utc + (3600000 * 2));

            var hours = parisTime.getHours().toString().padStart(2, '0');
            var minutes = parisTime.getMinutes().toString().padStart(2, '0');

            $('#paris-time').text(`${hours}:${minutes}`);
        }

        function updateTokyoTime() {
            var now = new Date();
            var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            var tokyoTime = new Date(utc + (3600000 * 9));

            var hours = tokyoTime.getHours().toString().padStart(2, '0');
            var minutes = tokyoTime.getMinutes().toString().padStart(2, '0');

            $('#tokyo-time').text(`${hours}:${minutes}`);
        }

        // Update both clocks together once per minute.
        const CLOCK_UPDATE_INTERVAL = 60 * 1000;
        const updateClocks = () => {
            updateParisTime();
            updateTokyoTime();
        };

        // Keep the initial render immediate while reducing background work.
        updateClocks();
        setInterval(updateClocks, CLOCK_UPDATE_INTERVAL);
    };
    // The card itself is rendered as a liquid-metal droplet
    // by a small WebGL shader (user settings, 2026-11-19):
    // the flowing chrome (metal strength 150%: streak
    // x1.37) at the very back, the real artwork images
    // (cover) over it at the original 50% opacity, grain
    // on top (100%). Material softness 55%, sliminess 0%.
    // No automatic surface animation: the pattern is
    // frozen (fixed time phase, no drift); only the
    // pointer-driven bulge moves. Deformation
    // 0%. The surface drift direction random-walks on its
    // own; the silhouette swells only where the pointer
    // touches an edge (bulge 30px, gel spring 100%, follow
    // lag 700ms, tau = 280ms). When WebGL is unavailable
    // the card keeps its plain styling.
    const initializeCardLiquidGL = () => {
        const canvas = document.querySelector(".card-liquid-gl");
        const card = document.querySelector(".card");
        const wrap = card ? card.closest(".wrap") : null;
        if (!canvas || !card || !wrap) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        // The full layer stack (background, liquid metal,
        // artwork at 50% over it, grain on top) runs on
        // every viewport. The metal itself stays exactly
        // as tuned: still surface, bulge on contact.
        const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
        if (!gl) return;
        const VS = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }";
        const FS = [
            "precision highp float;",
            "uniform vec2 u_res;",
            "uniform vec4 u_card;",
            "uniform vec2 u_ptr;",
            "uniform vec2 u_q;",
            "uniform vec2 u_vel;",
            "uniform vec2 u_flow;",
            "uniform float u_amp;",
            "uniform float u_on;",
            "uniform float u_time;",
            "uniform float u_soft;",
            "uniform float u_opaque;",
            "uniform float u_slim;",
            "uniform float u_wob;",
            "uniform float u_phase;",
            "float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }",
            "float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);",
            "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }",
            "float fbm(vec2 p){ float v = 0.0; float a = 0.55; for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(17.3, 9.1); a *= 0.55; } return v; }",
            "float sdRBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }",
            "float field(vec2 p){",
            "  vec2 cc = u_card.xy + u_card.zw * 0.5;",
            "  vec2 lp = p - cc;",
            "  lp.x *= 1.0 - 0.012 * sin(u_phase) * u_wob;",
            "  lp.y *= 1.0 + 0.012 * sin(u_phase) * u_wob;",
            "  float d = sdRBox(lp, u_card.zw * 0.5, 4.0);",
            "  vec2 q = clamp(u_q, u_card.xy, u_card.xy + u_card.zw);",
            "  float dL = u_q.x - u_card.x;",
            "  float dR = (u_card.x + u_card.z) - u_q.x;",
            "  float dT = u_q.y - u_card.y;",
            "  float dB = (u_card.y + u_card.w) - u_q.y;",
            "  float mE = min(min(dL, dR), min(dT, dB));",
            "  vec2 nOut = mE == dL ? vec2(-1.0, 0.0) : (mE == dR ? vec2(1.0, 0.0) : (mE == dT ? vec2(0.0, -1.0) : vec2(0.0, 1.0)));",
            "  vec2 rel = p - q;",
            "  float t = dot(rel, vec2(-nOut.y, nOut.x));",
            "  float nrm = dot(rel, nOut);",
            "  float g = exp(-(t * t) / (52.0 * 52.0));",
            "  float band = exp(-(d * d) / (34.0 * 34.0)) * exp(-(nrm * nrm) / (40.0 * 40.0));",
            "  float per = (p.x - cc.x) / u_card.z + (p.y - cc.y) / u_card.w;",
            "  float und = (vnoise(vec2(per * 4.0, u_time * 0.22)) - 0.5) * u_slim * 4.4 * exp(-(d * d) / (20.0 * 20.0));",
            "  return d - u_amp * u_on * g * band - und;",
            "}",
            "void main(){",
            "  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);",
            "  float d = field(p);",
            "  float body = smoothstep(1.6, -1.6, d);",
            "  float shadow = smoothstep(26.0, 2.0, d) * 0.20;",
            "  float alpha = max(body * u_opaque, shadow * (1.0 - body));",
            "  if (alpha <= 0.004) { gl_FragColor = vec4(0.0); return; }",
            "  vec2 uv = (p - u_card.xy) / u_card.zw;",
            "  float tm = u_time * 0.010;",
            "  vec2 fp = uv * vec2(3.2, 2.1);",
            "  float w1 = fbm(fp + u_flow + fbm(fp * 1.4 - tm * 0.3) * mix(1.6, 2.7, u_slim) - u_vel * 0.010 * (0.4 + u_slim));",
            "  float ridge = 1.0 - abs(w1 * 2.0 - 1.0);",
            "  float streak = pow(ridge, mix(3.4, 2.0, u_soft)) * 1.37;",
            "  float w2 = fbm(fp * 0.8 - vec2(tm * 0.5, 0.0));",
            "  vec3 chrome = mix(vec3(0.028, 0.032, 0.042), vec3(0.105, 0.115, 0.135), u_soft);",
            "  chrome += vec3(0.88, 0.94, 1.05) * streak * mix(0.95, 0.55, u_soft);",
            "  chrome += vec3(0.35, 0.42, 0.55) * pow(ridge, 1.6) * mix(0.35, 0.30, u_soft);",
            "  chrome += vec3(1.0, 0.80, 0.52) * smoothstep(0.55, 0.85, w2) * streak * 0.35;",
            "  float e = 1.5;",
            "  vec2 grad = vec2(field(p + vec2(e, 0.0)) - field(p - vec2(e, 0.0)), field(p + vec2(0.0, e)) - field(p - vec2(0.0, e)));",
            "  vec2 n = length(grad) > 0.0001 ? normalize(grad) : vec2(0.0, -1.0);",
            "  float rim = smoothstep(9.0, 0.0, abs(d + 1.0));",
            "  chrome += vec3(1.0) * rim * (0.10 + 0.38 * max(dot(n, normalize(vec2(-0.45, -0.89))), 0.0));",
            "  vec3 col = chrome;",
            "  col += mix(hash(p * 1.71) - 0.5, vnoise(p * 0.35) - 0.5, u_soft * 0.7) * mix(0.14, 0.075, u_soft);",
            "  vec3 outC = body >= shadow ? col : vec3(0.0);",
            "  gl_FragColor = vec4(outC, alpha);",
            "}"
        ].join("\n");
        const compile = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
        };
        const vs = compile(gl.VERTEX_SHADER, VS);
        const fs = compile(gl.FRAGMENT_SHADER, FS);
        if (!vs || !fs) return;
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const uni = {};
        ["u_res", "u_card", "u_ptr", "u_q", "u_vel", "u_flow", "u_amp", "u_on", "u_time", "u_soft", "u_slim", "u_wob", "u_phase", "u_opaque"].forEach((name) => {
            uni[name] = gl.getUniformLocation(prog, name);
        });
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        document.body.classList.add("card-liquid-on");
        // The card carries no artwork layer (Mizuki,
        // 2026-11-20): the sliding image is the page
        // background (.back__slide in css/index.css),
        // which switches by sliding. The card surface
        // is the liquid metal plus grain only.

        const PAD = 40;
        const REACH = 90;
        const AMP = 30;
        const TAU = 280;
        const SOFT = 0.55;
        const SLIM = 0.0;
        // Gel spring at 100% (user setting).
        const STIFF = 0.215;
        const DAMP = 0.76;
        let tx = -9999, ty = -9999, px = -9999, py = -9999, pvx = 0, pvy = 0;
        let on = 0, onTarget = 0, lastT = 0;
        let ampS = 0, ampV = 0, wob = 0, phase = 0;
        let qx = -9999, qy = -9999;
        let autoT = 0, flowAng = Math.random() * 6.28, flowTgt = flowAng;
        const flowOff = { x: 0, y: 0 };
        const onMove = (event) => {
            const rect = card.getBoundingClientRect();
            tx = event.clientX - rect.left;
            ty = event.clientY - rect.top;
            if (px < -1000) { px = tx; py = ty; qx = tx; qy = ty; }
            const outX = Math.max(0, -tx, tx - rect.width);
            const outY = Math.max(0, -ty, ty - rect.height);
            onTarget = Math.hypot(outX, outY) <= REACH ? 1 : 0;
        };
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerdown", onMove);
        wrap.addEventListener("pointerleave", () => { onTarget = 0; });

        const frame = (t) => {
            requestAnimationFrame(frame);
            const dt = Math.min(50, t - lastT || 16);
            lastT = t;
            const k = 1 - Math.exp(-dt / TAU);
            const ox = px, oy = py;
            px += (tx - px) * k;
            py += (ty - py) * k;
            pvx = (px - ox) / Math.max(1, dt) * 16.7;
            pvy = (py - oy) / Math.max(1, dt) * 16.7;
            on += (onTarget - on) * (1 - Math.exp(-dt / 120));
            // No automatic surface animation (user instruction,
            // 2026-11-19): the flow offset stays fixed at zero
            // and u_time below is a fixed phase, so the metal
            // surface is static. Only the pointer-driven bulge
            // still moves.
            const qk = 1 - Math.exp(-dt / (200 + 380 * SLIM));
            qx += (px - qx) * qk;
            qy += (py - qy) * qk;
            const crd = card.getBoundingClientRect();
            const qxc = Math.min(Math.max(px, 0), crd.width);
            const qyc = Math.min(Math.max(py, 0), crd.height);
            const distEdge = Math.hypot(px - qxc, py - qyc);
            const insidePt = px >= 0 && px <= crd.width && py >= 0 && py <= crd.height;
            const edgeNear = insidePt ? Math.min(px, crd.width - px, py, crd.height - py) : distEdge;
            const contact = Math.max(0, 1 - Math.max(0, edgeNear - 3) / 13);
            const target = onTarget > 0 ? Math.pow(contact, 1.2) : 0;
            ampV += (target - ampS) * STIFF * (dt / 16.7);
            ampV *= Math.pow(DAMP, dt / 16.7);
            ampS += ampV * (dt / 16.7);
            const speed = Math.hypot(pvx, pvy);
            wob = Math.min(1, Math.max(wob * Math.pow(0.95, dt / 16.7), Math.abs(ampV) * 2.4, (ampS > 0.4 ? speed * 0.012 : 0), on * 0.25));
            phase += dt * 0.020;
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            const w = Math.round(canvas.clientWidth * dpr);
            const h = Math.round(canvas.clientHeight * dpr);
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
            gl.viewport(0, 0, canvas.width, canvas.height);
            const cr = card.getBoundingClientRect();
            const cvr = canvas.getBoundingClientRect();
            if (!cvr.width || !cvr.height) return;
            const sx = canvas.width / cvr.width;
            const sy = canvas.height / cvr.height;
            gl.uniform2f(uni.u_res, canvas.width, canvas.height);
            gl.uniform4f(uni.u_card, (cr.left - cvr.left) * sx, (cr.top - cvr.top) * sy, cr.width * sx, cr.height * sy);
            gl.uniform2f(uni.u_ptr, (px + PAD) * sx, (py + PAD) * sy);
            gl.uniform2f(uni.u_q, (qx + PAD) * sx, (qy + PAD) * sy);
            gl.uniform2f(uni.u_vel, pvx * sx, pvy * sy);
            gl.uniform2f(uni.u_flow, flowOff.x * sx, flowOff.y * sy);
            gl.uniform1f(uni.u_amp, Math.max(0, ampS) * AMP * sx);
            gl.uniform1f(uni.u_on, on);
            gl.uniform1f(uni.u_time, 12.0);
            gl.uniform1f(uni.u_soft, SOFT);
            gl.uniform1f(uni.u_opaque, 0.8);
            gl.uniform1f(uni.u_slim, SLIM);
            gl.uniform1f(uni.u_wob, wob);
            gl.uniform1f(uni.u_phase, phase);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        requestAnimationFrame(frame);
    };
    document.addEventListener("portfolio:homeready", initializeHomeSlides, { once: true });
    document.addEventListener("portfolio:homeready", initializeCardLiquidGL, { once: true });

    // Card notch (Mizuki 2026-11-20): the card's bottom edge
    // scoops into a hollow shaped like the NEXT button
    // itself where it straddles the edge. The same outline
    // is clipped into every card layer (background frame,
    // liquid canvas, card body, outline) in each element's
    // own coordinates, and recomputed whenever the layout
    // may have changed.
    function updateCardNotch() {
        const btn = document.querySelector(".card-nav");
        if (!btn) return;
        const b = btn.getBoundingClientRect();
        if (!b.width) return;
        const cx = b.left + b.width / 2;
        // The hollow follows the button's own pill outline
        // (Mizuki 2026-11-20): a capsule with the button's
        // cap centers, its radius widened by a small even
        // gap, so the card edge wraps the button like a
        // socket. (An offset capsule keeps the cap centers
        // and only grows the radius.)
        const gap = 6;
        const capR = b.height / 2 + gap;
        const capA = Math.max(0, (b.width - b.height) / 2);
        const dip = (lx, by) => {
            const y = by - capR;
            return " H " + (lx + capA + capR).toFixed(1) +
                " A " + capR.toFixed(1) + " " + capR.toFixed(1) + " 0 0 0 " + (lx + capA).toFixed(1) + " " + y.toFixed(1) +
                " H " + (lx - capA).toFixed(1) +
                " A " + capR.toFixed(1) + " " + capR.toFixed(1) + " 0 0 0 " + (lx - capA - capR).toFixed(1) + " " + by.toFixed(1);
        };
        // The card outline (rectangle with the button dip in
        // its bottom edge) for a box whose top-left corner is
        // (x, y); dipCx is the dip's center in the same
        // coordinate space. One shape, shared by every layer.
        const outlineAt = (x, y, w, h, dipCx) =>
            "M " + x.toFixed(1) + " " + y.toFixed(1) + " H " + (x + w).toFixed(1) + " V " + (y + h).toFixed(1) + dip(dipCx, y + h) + " H " + x.toFixed(1) + " Z";
        const card = document.querySelector(".card");
        // The outline's source of truth is the transparent
        // SVG overlay (Mizuki 2026-11-20): its path holds the
        // shape in card coordinates, it is laid exactly over
        // the card, and every layer below is clipped from
        // that same outline, mapped into its own coordinates
        // (the layers have different boxes, so a bare SVG
        // clip reference could not line them up).
        const shapeSvg = document.querySelector(".card-shape");
        const shapePath = document.getElementById("cardShapePath");
        if (card && shapeSvg && shapePath) {
            const kr = card.getBoundingClientRect();
            if (kr.width) {
                shapeSvg.style.left = kr.left.toFixed(1) + "px";
                shapeSvg.style.top = kr.top.toFixed(1) + "px";
                shapeSvg.style.width = kr.width.toFixed(1) + "px";
                shapeSvg.style.height = kr.height.toFixed(1) + "px";
                shapePath.setAttribute("d", outlineAt(0, 0, kr.width, kr.height, cx - kr.left));
            }
        }
        // Layers whose own bottom edge is the card's bottom
        // edge: the outline ends at the dip. The card's noise
        // veil is clipped on its own element too, so the
        // grain cannot linger over the scoop on engines that
        // composite its animated mask separately.
        document.querySelectorAll(".card, .card_line, .card-liquid-gl, .back__frame, #mainContent > .noise").forEach((el) => {
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return;
            el.style.clipPath = "path('" + outlineAt(0, 0, r.width, r.height, cx - r.left) + "')";
        });
        // Keep the button's clear zone fitted to it: the
        // pill is laid in viewport coordinates, matching
        // its fixed positioning.
        const clearPill = document.querySelector(".card-nav-clear");
        if (clearPill) {
            const m = 10;
            clearPill.style.left = (b.left - m).toFixed(1) + "px";
            clearPill.style.top = (b.top - m).toFixed(1) + "px";
            clearPill.style.width = (b.width + 2 * m).toFixed(1) + "px";
            clearPill.style.height = (b.height + 2 * m).toFixed(1) + "px";
        }
        // The page-wide noise veil keeps covering the page,
        // but the scoop is cut out of it at the card's
        // bottom line (Mizuki 2026-11-20: the noise filter
        // takes the same shape).
        const veil = document.querySelector("main > .noise");
        if (card && veil) {
            const r = veil.getBoundingClientRect();
            const cr = card.getBoundingClientRect();
            if (r.width && r.height) {
                const lx = cx - r.left;
                const by = cr.bottom - r.top;
                veil.style.clipPath = "path('M 0 0 H " + r.width.toFixed(1) + " V " + by.toFixed(1) + dip(lx, by) + " H 0 V " + r.height.toFixed(1) + " H " + r.width.toFixed(1) + " Z')";
            }
        }
        // The full-screen glowing ink canvas behind the page
        // is trimmed to the card's own outline (same dip as
        // the other layers) on phones and tablets, so the
        // glow never spills past the card (Mizuki
        // 2026-11-20). Wide screens keep the full-screen
        // mist as designed.
        const ink = document.getElementById("selected-ink-field-canvas");
        if (ink && card) {
            if (window.innerWidth > 1023) {
                if (ink.style.clipPath) ink.style.clipPath = "";
            } else {
                const c = ink.getBoundingClientRect();
                const kr = card.getBoundingClientRect();
                if (c.width && kr.width) {
                    const ox = kr.left - c.left;
                    const oy = kr.top - c.top;
                    ink.style.clipPath = "path('" + outlineAt(ox, oy, kr.width, kr.height, cx - c.left) + "')";
                }
            }
        }
    }
    window.addEventListener("resize", updateCardNotch);
    window.addEventListener("load", updateCardNotch);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateCardNotch);
    document.addEventListener("portfolio:homeready", updateCardNotch);
    updateCardNotch();
});

// Lens cursor (tuned by the user, 2026-11-19): a glass
// lens follows the pointer with no lag and refracts the
// page beneath it — a small 28px lens at rest, growing
// over links and buttons to the tuned 64px hover state.
// Refraction 100%, rim light 20%,
// chromatic aberration on (the SVG filter in index.html
// runs the same map at three scales for the R/G/B
// channels). The radial displacement map is generated
// here: sample points pull toward the center, strongest
// at t=0.58, and reach zero at the rim so the page stays
// continuous. Fine pointers only; reduced motion keeps
// the native cursor.
document.addEventListener("DOMContentLoaded", () => {
    const lens = document.getElementById("lensCursor");
    const blend = document.getElementById("lensBlend");
    if (!lens) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    // Hover state: over links and buttons the small 28px
    // lens grows to the tuned 64px state (CSS scale).
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
});
