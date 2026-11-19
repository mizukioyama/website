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

        const goToSlide = (slideElements, index) => {
            if (!inProgress) {
                inProgress = true;

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
            setTimeout(() => goToSlide(slideElements, 2), 2000),
            setTimeout(() => goToSlide(slideElements, 1), 6000)
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
    // The card's liquid is a small WebGL shader: the card's own
    // outline joins the liquid's signed-distance field (smooth
    // union), so where the pointer nears an edge the boundary
    // becomes one continuous liquid contour. Droplet 22px,
    // boundary softness 20, follow lag 700ms (exponential
    // smoothing, tau = 280ms). The smooth union is localized
    // to the contact point (gate x window in the shader) so
    // the card's overall outline never morphs; only the
    // touched spot swells. No spectral rim (removed at the
    // user's request); only a soft specular highlight remains.
    // When WebGL is unavailable the card simply has no liquid.
    const initializeCardLiquidGL = () => {
        const canvas = document.querySelector(".card-liquid-gl");
        const card = document.querySelector(".card");
        const wrap = card ? card.closest(".wrap") : null;
        if (!canvas || !card || !wrap) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
        if (!gl) return;
        const VS = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }";
        const FS = [
            "precision highp float;",
            "uniform vec2 u_res;",
            "uniform vec4 u_card;",
            "uniform vec2 u_ptr;",
            "uniform vec2 u_vel;",
            "uniform float u_rad;",
            "uniform float u_soft;",
            "uniform float u_on;",
            "uniform float u_press;",
            "uniform float u_wob;",
            "uniform float u_phase;",
            "float sdBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }",
            "float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }",
            "float field(vec2 p){",
            "  vec2 cc = u_card.xy + u_card.zw * 0.5;",
            "  float dCard = sdBox(p - cc, u_card.zw * 0.5, 4.0);",
            "  vec2 rel = p - u_ptr;",
            "  float sp = length(u_vel);",
            "  vec2 dir = sp > 0.01 ? u_vel / sp : vec2(1.0, 0.0);",
            "  vec2 lp = vec2(dot(rel, dir), dot(rel, vec2(-dir.y, dir.x)));",
            "  lp.x /= 1.0 + min(sp * 0.004, 0.7);",
            "  lp.x *= 1.0 - 0.09 * sin(u_phase) * u_wob;",
            "  lp.y *= 1.0 + 0.13 * sin(u_phase) * u_wob;",
            "  float rEff = u_rad * (0.72 + 0.55 * u_press) * (1.0 + 0.06 * sin(u_phase) * u_wob);",
            "  float dDrop = length(lp) - rEff;",
            "  vec2 q = clamp(u_ptr, u_card.xy, u_card.xy + u_card.zw);",
            "  float gate = smoothstep(34.0, 14.0, length(u_ptr - q));",
            "  float win = smoothstep(150.0, 55.0, length(p - q));",
            "  float dU = smin(dDrop, dCard, u_soft * (0.7 + 0.6 * u_press));",
            "  return mix(dDrop, dU, gate * win);",
            "}",
            "void main(){",
            "  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);",
            "  float dCard = sdBox(p - (u_card.xy + u_card.zw * 0.5), u_card.zw * 0.5, 4.0);",
            "  float d = field(p);",
            "  float region = dCard >= 0.0 ? 1.0 : smoothstep(-22.0, -2.0, dCard);",
            "  float body = smoothstep(1.5, -1.5, d) * region * u_on;",
            "  float shadow = smoothstep(-20.0, -2.0, dCard) * smoothstep(30.0, 6.0, d) * u_on * 0.16;",
            "  float alpha = max(body * 0.94, shadow);",
            "  if (alpha <= 0.004) { gl_FragColor = vec4(0.0); return; }",
            "  float e = 1.5;",
            "  vec2 grad = vec2(field(p + vec2(e, 0.0)) - field(p - vec2(e, 0.0)), field(p + vec2(0.0, e)) - field(p - vec2(0.0, e)));",
            "  vec2 n = length(grad) > 0.0001 ? normalize(grad) : vec2(0.0, -1.0);",
            "  vec3 col = vec3(0.055, 0.058, 0.063);",
            "  vec2 L = normalize(vec2(-0.45, -0.89));",
            "  float spec = pow(max(dot(n, L), 0.0), 3.0);",
            "  col += vec3(1.0) * spec * 0.40;",
            "  vec2 rp = (p - u_ptr) / max(u_rad * (0.72 + 0.55 * u_press), 1.0);",
            "  float spot = pow(clamp(1.0 - length(rp - vec2(-0.38, -0.42)), 0.0, 1.0), 3.0);",
            "  col += vec3(1.0) * spot * 0.50;",
            "  float rim = smoothstep(7.0, 0.0, abs(d + 1.0));",
            "  col += vec3(1.0) * rim * (0.05 + 0.15 * max(dot(n, L), 0.0));",
            "  vec3 outCol = body > shadow ? col : vec3(0.0);",
            "  gl_FragColor = vec4(outCol, alpha);",
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
        ["u_res", "u_card", "u_ptr", "u_vel", "u_rad", "u_soft", "u_on", "u_press", "u_wob", "u_phase"].forEach((name) => {
            uni[name] = gl.getUniformLocation(prog, name);
        });
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const PAD = 30;
        const REACH = 80;
        const RADIUS = 11;
        const SOFT = 20;
        const TAU = 280;
        // Gel spring at full strength (user setting 100%):
        // pressing the edge grows the bulge, releasing it
        // makes it wobble back like jelly (WWDC25 Liquid
        // Glass dynamics: instant deformation, gel flex).
        const STIFF = 0.215;
        const DAMP = 0.76;
        let tx = -9999, ty = -9999, px = -9999, py = -9999, pvx = 0, pvy = 0;
        let on = 0, onTarget = 0, lastT = 0;
        let press = 0, pressV = 0, wob = 0, phase = 0;
        const onMove = (event) => {
            const rect = card.getBoundingClientRect();
            tx = event.clientX - rect.left;
            ty = event.clientY - rect.top;
            if (px < -1000) { px = tx; py = ty; }
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
            on += (onTarget - on) * (1 - Math.exp(-dt / 90));
            const crd = card.getBoundingClientRect();
            const qx = Math.min(Math.max(px, 0), crd.width);
            const qy = Math.min(Math.max(py, 0), crd.height);
            const distEdge = Math.hypot(px - qx, py - qy);
            const insidePt = px >= 0 && px <= crd.width && py >= 0 && py <= crd.height;
            const edgeNear = insidePt ? Math.min(px, crd.width - px, py, crd.height - py) : distEdge;
            const pressTarget = onTarget > 0 ? Math.max(0, 1 - edgeNear / (RADIUS * 2.1)) : 0;
            pressV += (pressTarget - press) * STIFF * (dt / 16.7);
            pressV *= Math.pow(DAMP, dt / 16.7);
            press += pressV * (dt / 16.7);
            const speed = Math.hypot(pvx, pvy);
            wob = Math.min(1, Math.max(wob * Math.pow(0.94, dt / 16.7), Math.abs(pressV) * 2.2, press > 0.4 ? speed * 0.010 : 0));
            phase += dt * 0.021;
            if (on < 0.01 && onTarget === 0 && Math.abs(press) < 0.01) return;
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
            gl.uniform2f(uni.u_vel, pvx * sx, pvy * sy);
            gl.uniform1f(uni.u_rad, RADIUS * sx);
            gl.uniform1f(uni.u_soft, SOFT * sx);
            gl.uniform1f(uni.u_on, on);
            gl.uniform1f(uni.u_press, Math.max(0, Math.min(1.15, press)));
            gl.uniform1f(uni.u_wob, wob);
            gl.uniform1f(uni.u_phase, phase);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        requestAnimationFrame(frame);
    };
    document.addEventListener("portfolio:homeready", initializeHomeSlides, { once: true });
    document.addEventListener("portfolio:homeready", initializeCardLiquidGL, { once: true });
});
