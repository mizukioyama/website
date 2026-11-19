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
    // The card itself is rendered as a liquid-metal droplet
    // by a small WebGL shader (user settings, 2026-11-19):
    // flowing chrome (metal strength 150%: streak x1.37),
    // the real artwork images over the whole card (cover,
    // 40%, multiply-leaning composite) and grain on top
    // (100%), material softness 100%, sliminess
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
            "uniform float u_slim;",
            "uniform float u_wob;",
            "uniform float u_phase;",
            "uniform sampler2D u_tex1;",
            "uniform sampler2D u_tex2;",
            "uniform float u_ready1;",
            "uniform float u_ready2;",
            "uniform float u_mix;",
            "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
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
            "  float alpha = max(body, shadow * (1.0 - body));",
            "  if (alpha <= 0.004) { gl_FragColor = vec4(0.0); return; }",
            "  vec2 uv = (p - u_card.xy) / u_card.zw;",
            "  float tm = u_time * 0.030;",
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
            "  vec3 art = vec3(0.0);",
            "  float artA = 0.0;",
            "  {",
            "    float ca = u_card.z / u_card.w;",
            "    vec3 c1 = vec3(0.0);",
            "    vec3 c2 = vec3(0.0);",
            "    if (u_ready1 > 0.5) {",
            "      vec2 t1 = uv;",
            "      float ia1 = 1920.0 / 1080.0;",
            "      if (ca > ia1) { t1.y = (t1.y - 0.5) * (ia1 / ca) + 0.5; } else { t1.x = (t1.x - 0.5) * (ca / ia1) + 0.5; }",
            "      c1 = texture2D(u_tex1, clamp(t1, 0.001, 0.999)).rgb;",
            "    }",
            "    if (u_ready2 > 0.5) {",
            "      vec2 t2 = uv;",
            "      float ia2 = 1300.0 / 768.0;",
            "      if (ca > ia2) { t2.y = (t2.y - 0.5) * (ia2 / ca) + 0.5; } else { t2.x = (t2.x - 0.5) * (ca / ia2) + 0.5; }",
            "      c2 = texture2D(u_tex2, clamp(t2, 0.001, 0.999)).rgb;",
            "    }",
            "    art = mix(c1, c2, u_mix);",
            "    artA = mix(u_ready1, u_ready2, u_mix);",
            "  }",
            "  vec3 colM = chrome * (art * 1.5 + 0.30);",
            "  colM = mix(colM, art, artA * 0.40 * 0.35);",
            "  vec3 col = mix(chrome, colM, artA);",
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
        ["u_res", "u_card", "u_ptr", "u_q", "u_vel", "u_flow", "u_amp", "u_on", "u_time", "u_soft", "u_slim", "u_wob", "u_phase", "u_tex1", "u_tex2", "u_ready1", "u_ready2", "u_mix"].forEach((name) => {
            uni[name] = gl.getUniformLocation(prog, name);
        });
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        document.body.classList.add("card-liquid-on");
        // The artwork layer is the real slide artwork over
        // the whole card: img/202343-2.jpg (slide 1) and
        // img/couryoku.jpg (slide 2), crossfaded on switches.
        // Textures are sampled without a Y flip: uv.y is 0 at
        // the card top and v=0 is the image's top row.
        const texReady = [0, 0];
        const loadTex = (unit, readyIdx, srcPath) => {
            const tex = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 12, 16, 255]));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            const img = new Image();
            img.onload = () => {
                gl.activeTexture(gl.TEXTURE0 + unit);
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                texReady[readyIdx] = 1;
            };
            img.src = srcPath;
        };
        loadTex(0, 0, "img/202343-2.jpg");
        loadTex(1, 1, "img/couryoku.jpg");
        gl.uniform1i(uni.u_tex1, 0);
        gl.uniform1i(uni.u_tex2, 1);
        let slideMix = 0;

        const PAD = 40;
        const REACH = 90;
        const AMP = 30;
        const TAU = 280;
        const SOFT = 1.0;
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
            // The surface drift direction random-walks on its own.
            autoT -= dt / 1000;
            if (autoT <= 0) {
                autoT = 2.6 + Math.random() * 3.2;
                flowTgt += (Math.random() - 0.5) * 2.4;
            }
            flowAng += (flowTgt - flowAng) * (1 - Math.exp(-dt / 1600));
            flowOff.x += Math.cos(flowAng) * dt * 0.006 * (0.4 + SLIM);
            flowOff.y += Math.sin(flowAng) * dt * 0.006 * (0.4 + SLIM);
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
            gl.uniform1f(uni.u_time, t / 1000);
            gl.uniform1f(uni.u_soft, SOFT);
            gl.uniform1f(uni.u_slim, SLIM);
            gl.uniform1f(uni.u_wob, wob);
            gl.uniform1f(uni.u_phase, phase);
            const slides = document.querySelectorAll(".card__slide");
            let activeIdx = 0;
            slides.forEach((s, i) => { if (s.classList.contains("active")) activeIdx = i; });
            slideMix += (activeIdx - slideMix) * (1 - Math.exp(-dt / 220));
            gl.uniform1f(uni.u_ready1, texReady[0]);
            gl.uniform1f(uni.u_ready2, texReady[1]);
            gl.uniform1f(uni.u_mix, Math.min(1, Math.max(0, slideMix)));
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        requestAnimationFrame(frame);
    };
    document.addEventListener("portfolio:homeready", initializeHomeSlides, { once: true });
    document.addEventListener("portfolio:homeready", initializeCardLiquidGL, { once: true });
});
