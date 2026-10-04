(function selectedInkFieldModule() {
  "use strict";

  const systemMode = window.__PORTFOLIO_BACKGROUND_SYSTEM__;
  if (systemMode !== "selectedInkField" || !document.body) return;

  const SOURCE_PARAMETERS = Object.freeze({
    inkDensity: 1.0,
    flowSpeed: 0.0,
    flowStrength: 1.0,
    noise: 1.0,
    fog: 1.0,
    particle: 1.0,
    scrollReaction: 1.14,
    cursorReaction: 0.27,
    trail: 0.48,
    transitionStrength: 1.0
  });
  const MAX_SCROLL_SPEED = 1500;
  const SCROLL_DEAD_ZONE = 45;
  const MOBILE_WIDTH = 760;
  const MOBILE_QUALITY = 0.58;
  const DESKTOP_DPR_LIMIT = 1.2;
  const MOBILE_DPR_LIMIT = 1.0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let instance = null;

  const vertexSource = [
    "attribute vec2 aPosition;",
    "varying vec2 vUv;",
    "void main(){",
    "  vUv = (aPosition + 1.0) * 0.5;",
    "  gl_Position = vec4(aPosition, 0.0, 1.0);",
    "}"
  ].join("\n");

  const fragmentSource = [
    "precision mediump float;",
    "varying vec2 vUv;",
    "uniform vec2 uResolution;",
    "uniform vec2 uWaveDirection;",
    "uniform vec2 uPointer;",
    "uniform vec2 uPointerVelocity;",
    "uniform float uTime;",
    "uniform float uDensity;",
    "uniform float uFlowSpeed;",
    "uniform float uFlowStrength;",
    "uniform float uNoise;",
    "uniform float uFog;",
    "uniform float uParticle;",
    "uniform float uScrollVelocity;",
    "uniform float uScrollAcceleration;",
    "uniform float uWaveAmplitude;",
    "uniform float uWaveSpeed;",
    "uniform float uWavePhase;",
    "uniform float uPointerStrength;",
    "uniform float uCursorReaction;",
    "uniform float uSectionInfluence;",
    "uniform float uQuality;",
    "uniform float uOctaves;",
    "float hash21(vec2 p){",
    "  p = fract(p * vec2(123.34, 456.21));",
    "  p += dot(p, p + 45.32);",
    "  return fract(p.x * p.y);",
    "}",
    "float noise2(vec2 p){",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  vec2 u = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);",
    "}",
    "float fbm(vec2 p){",
    "  float value = 0.0;",
    "  float amplitude = 0.5;",
    "  for(int i = 0; i < 5; i++){",
    "    if(float(i) >= uOctaves) break;",
    "    value += amplitude * noise2(p);",
    "    p = mat2(0.80, -0.60, 0.60, 0.80) * p * 2.02 + vec2(17.1, 9.2);",
    "    amplitude *= 0.5;",
    "  }",
    "  return value;",
    "}",
    "float particleDot(vec2 p, float scale, float salt, float cloud){",
    "  vec2 scaled = p * scale;",
    "  vec2 cell = floor(scaled);",
    "  vec2 local = fract(scaled);",
    "  float seed = hash21(cell + vec2(salt, salt * 1.71));",
    "  vec2 randomPoint = vec2(hash21(cell + vec2(salt + 17.1, salt + 43.7)), hash21(cell + vec2(salt + 67.4, salt + 11.6)));",
    "  vec2 center = mix(vec2(0.17), vec2(0.83), randomPoint);",
    "  float phase = seed * 6.2831853;",
    "  vec2 drift = vec2(sin(uTime * 0.21 + phase), cos(uTime * 0.17 + phase * 1.47)) * 0.037;",
    "  vec2 perpendicular = vec2(-uWaveDirection.y, uWaveDirection.x);",
    "  drift += uWaveDirection * min(0.05, uScrollVelocity * 0.028 + uWaveAmplitude * 0.022);",
    "  drift += perpendicular * uScrollAcceleration * 0.004;",
    "  vec2 pointerCenter = (uPointer - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);",
    "  float pointerField = exp(-dot(p - pointerCenter, p - pointerCenter) * 15.0) * uPointerStrength * uCursorReaction;",
    "  drift += uPointerVelocity * pointerField * 0.040;",
    "  float radius = mix(0.035, 0.145, hash21(cell + vec2(salt + 27.3, salt + 61.8)));",
    "  radius *= 1.0 + uWaveAmplitude * 0.10;",
    "  float spot = 1.0 - smoothstep(radius * 0.42, radius, length(local - center - drift));",
    "  float cluster = mix(0.08, 1.0, smoothstep(0.34, 0.76, cloud));",
    "  return spot * smoothstep(0.36, 0.77, seed) * cluster;",
    "}",
    "void main(){",
    "  float aspect = uResolution.x / max(uResolution.y, 1.0);",
    "  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);",
    "  float motion = uFlowSpeed;",
    "  vec2 flow = vec2(uTime * motion * 0.095, -uTime * motion * 0.073);",
    "  flow += uWaveDirection * (sin(uWavePhase) * uWaveAmplitude * 0.08 + uWaveSpeed * 0.018);",
    "  flow += uWaveDirection * uScrollVelocity * 0.012;",
    "  vec2 pointerCenter = (uPointer - 0.5) * vec2(aspect, 1.0);",
    "  vec2 pointerDelta = p - pointerCenter;",
    "  float pointerSpeed = clamp(length(uPointerVelocity), 0.0, 1.5);",
    "  float pointerFalloff = exp(-dot(pointerDelta, pointerDelta) * 13.0) * uPointerStrength * uCursorReaction;",
    "  vec2 pointerDirection = pointerSpeed > 0.001 ? normalize(uPointerVelocity) : vec2(0.0);",
    "  flow += pointerDirection * pointerFalloff * pointerSpeed * 0.110;",
    "  vec2 q = vec2(fbm(p * 1.55 + flow), fbm(p * 1.55 + vec2(4.9, -3.1) - flow * 0.82));",
    "  vec2 pointerPull = -pointerDelta * pointerFalloff * (0.075 + pointerSpeed * 0.150);",
    "  vec2 pointerStretch = pointerDirection * pointerFalloff * pointerSpeed * 0.030;",
    "  vec2 sectionFlow = vec2(sin(uTime * 0.13 + p.y * 2.0), cos(uTime * 0.11 + p.x * 2.0)) * uSectionInfluence * 0.035;",
    "  vec2 broad = p + (q - 0.5) * (0.72 + uFlowStrength * 1.26 + uWaveAmplitude * 0.38) + pointerPull + pointerStretch + sectionFlow;",
    "  vec2 curl = vec2(noise2(broad * 3.1 + vec2(2.4, -1.8) + flow * 0.52), noise2(broad * 3.1 + vec2(-5.7, 3.2) - flow * 0.48));",
    "  float directionalWave = sin(dot(broad, uWaveDirection) * 7.0 - uWavePhase - uWaveSpeed * curl.x * 0.18 + (curl.y - 0.5) * 2.0);",
    "  vec2 curlPerpendicular = vec2(curl.y - 0.5, 0.5 - curl.x);",
    "  vec2 waveDisplacement = uWaveDirection * directionalWave * uWaveAmplitude * 0.045 + curlPerpendicular * uWaveAmplitude * 0.12;",
    "  waveDisplacement += vec2(-uWaveDirection.y, uWaveDirection.x) * uScrollAcceleration * 0.012;",
    "  waveDisplacement += uWaveDirection * uScrollVelocity * 0.014;",
    "  vec2 warped = broad + waveDisplacement + (curl - 0.5) * (0.18 + uFlowStrength * 0.42 + uWaveAmplitude * 0.20);",
    "  float field = fbm(warped * (2.25 + uNoise * 0.55) + flow * 0.28);",
    "  float detail = noise2(warped * (7.0 + uNoise * 7.0 + uScrollAcceleration * 0.45) + flow * 1.2);",
    "  float micro = noise2(p * (24.0 + uNoise * 22.0) + vec2(4.1, 8.3) - flow * 1.4);",
    "  float cloud = clamp(field * 0.64 + detail * (0.23 + uNoise * 0.06) + micro * (0.07 + uNoise * 0.04), 0.0, 1.0);",
    "  float cloudBody = smoothstep(0.30 - uDensity * 0.05, 0.82 - uDensity * 0.08, cloud);",
    "  float particleA = particleDot(p, 25.0, 7.3, cloud);",
    "  float particleB = particleDot(p, mix(54.0, 78.0, uQuality), 19.1, cloud);",
    "  float particles = max(particleA * 0.82, particleB * 0.64) * uParticle;",
    "  particles += pointerFalloff * pointerSpeed * uParticle * 0.025;",
    "  float grain = hash21(gl_FragCoord.xy + floor(uTime * 13.0));",
    "  float backgroundAlpha = cloudBody * (0.009 + uDensity * 0.040);",
    "  backgroundAlpha += (1.0 - cloudBody) * uFog * 0.020;",
    "  backgroundAlpha += particles * (0.028 + uWaveAmplitude * 0.035);",
    "  backgroundAlpha += (micro - 0.5) * uNoise * 0.012;",
    "  vec3 fogColor = mix(vec3(0.73), vec3(0.47), cloudBody);",
    "  vec3 inkColor = mix(vec3(0.28), vec3(0.09), cloudBody);",
    "  vec3 backgroundColor = mix(fogColor, inkColor, cloudBody * (0.28 + uDensity * 0.30));",
    "  backgroundColor = mix(backgroundColor, vec3(0.30), clamp(particles * 0.82, 0.0, 0.55));",
    "  backgroundColor += (grain - 0.5) * uNoise * 0.016;",
    "  float alpha = clamp(backgroundAlpha, 0.0, 0.14);",
    "  gl_FragColor = vec4(backgroundColor * alpha, alpha);",
    "}"
  ].join("\n");

  function createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "selected-ink-field-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");
    canvas.dataset.engine = "selected-ink-field";
    return canvas;
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("WebGL shader allocation failed");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader) || "WebGL shader compilation failed";
      gl.deleteShader(shader);
      throw new Error(error);
    }
    return shader;
  }

  function mount() {
    if (instance || !document.body) return instance;

    let canvas = createCanvas();
    document.body.prepend(canvas);
    let gl = null;
    let context2d = null;
    let program = null;
    let buffer = null;
    let uniforms = null;
    let renderer = "webgl";
    let rafId = 0;
    let destroyed = false;
    let paused = false;
    let width = 1;
    let height = 1;
    let quality = 1;
    let effectiveDpr = 1;
    let targetFrameMs = 1000 / 60;
    let lastFrameAt = 0;
    let frameCount = 0;
    let rafCallbackCount = 0;
    let frameIntervals = [];
    let lastScrollEventAt = 0;
    let lastScrollY = window.scrollY;
    let lastScrollX = window.scrollX;
    let targetScrollX = 0;
    let targetScrollY = 0;
    let scrollX = 0;
    let scrollY = 0;
    let scrollMagnitude = 0;
    let scrollDirectionX = 0.72;
    let scrollDirectionY = -0.34;
    let scrollDirectionAngle = Math.atan2(scrollDirectionY, scrollDirectionX);
    let scrollImpulse = 0;
    let targetScrollAcceleration = 0;
    let scrollAcceleration = 0;
    let waveAmplitude = 0;
    let waveSpeed = 0;
    let wavePhase = 0;
    let lastPointerAt = 0;
    let lastPointerEventAt = 0;
    let lastPointerClientX = 0;
    let lastPointerClientY = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetPointerX = 0.5;
    let targetPointerY = 0.5;
    let pointerVelocityX = 0;
    let pointerVelocityY = 0;
    let targetPointerVelocityX = 0;
    let targetPointerVelocityY = 0;
    let pointerStrength = 0;
    let targetPointerStrength = 0;
    let sectionInfluence = 0;
    let targetSectionInfluence = 0;
    let sectionObserver = null;
    const sectionVisibility = new Map();
    let fallbackParticles = [];
    let listeners = [];
    let pointerListenerCleanups = [];
    let pointerListenersActive = false;
    let webglErrors = [];
    let rendererWarnings = [];
    const startedAt = performance.now();
    let finePointerAvailable = finePointer.matches && !reducedMotion.matches;

    function listen(target, type, handler, options) {
      target.addEventListener(type, handler, options);
      const cleanup = () => target.removeEventListener(type, handler, options);
      listeners.push(cleanup);
      return cleanup;
    }

    function resetCanvasFor2D(contextAlreadyLost) {
      if (gl && !contextAlreadyLost) {
        try {
          const loseContext = gl.getExtension("WEBGL_lose_context");
          if (loseContext) loseContext.loseContext();
        } catch (error) {
          rendererWarnings.push("Could not release failed WebGL context: " + String(error && error.message || error));
        }
      }
      const replacement = createCanvas();
      canvas.replaceWith(replacement);
      canvas = replacement;
      gl = null;
      program = null;
      buffer = null;
      uniforms = null;
      context2d = canvas.getContext("2d", { alpha: true });
      renderer = context2d ? "canvas-2d-fallback" : "unavailable";
      if (context2d) {
        let seed = 641;
        const random = () => {
          seed = (seed * 16807) % 2147483647;
          return (seed - 1) / 2147483646;
        };
        fallbackParticles = Array.from({ length: 74 }, () => ({
          x: random(),
          y: random(),
          radius: 0.5 + random() * 1.8,
          phase: random() * Math.PI * 2,
          speed: 0.12 + random() * 0.36
        }));
      } else {
        webglErrors.push("Canvas 2D fallback unavailable");
      }
    }

    function initializeWebGL() {
      try {
        gl = canvas.getContext("webgl", {
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          premultipliedAlpha: true,
          preserveDrawingBuffer: false,
          powerPreference: "low-power"
        });
        if (!gl) throw new Error("WebGL unavailable");
        const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
        const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        program = gl.createProgram();
        if (!program) throw new Error("WebGL program allocation failed");
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) || "WebGL program link failed");
        }
        gl.useProgram(program);
        buffer = gl.createBuffer();
        if (!buffer) throw new Error("WebGL vertex buffer allocation failed");
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          -1, -1, 1, -1, -1, 1,
          -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        const names = [
          "uResolution", "uWaveDirection", "uPointer", "uPointerVelocity",
          "uTime", "uDensity", "uFlowSpeed", "uFlowStrength", "uNoise",
          "uFog", "uParticle", "uScrollVelocity", "uScrollAcceleration",
          "uWaveAmplitude", "uWaveSpeed", "uWavePhase", "uPointerStrength",
          "uCursorReaction", "uSectionInfluence", "uQuality", "uOctaves"
        ];
        uniforms = Object.fromEntries(names.map((name) => [
          name.slice(1).replace(/^./, (letter) => letter.toLowerCase()),
          gl.getUniformLocation(program, name)
        ]));
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.clearColor(0, 0, 0, 0);
        return true;
      } catch (error) {
        rendererWarnings.push(String(error && error.message || error));
        resetCanvasFor2D(false);
        return false;
      }
    }

    function isMobileQuality() {
      return window.matchMedia("(max-width: " + MOBILE_WIDTH + "px)").matches ||
        window.matchMedia("(pointer: coarse)").matches;
    }

    function resize() {
      if (destroyed) return;
      const mobile = isMobileQuality();
      const nativeDpr = window.devicePixelRatio || 1;
      quality = mobile ? MOBILE_QUALITY : 1;
      effectiveDpr = Math.min(nativeDpr, mobile ? MOBILE_DPR_LIMIT : DESKTOP_DPR_LIMIT) * quality;
      targetFrameMs = 1000 / (mobile ? 30 : 60);
      width = Math.max(1, Math.round(window.innerWidth * effectiveDpr));
      height = Math.max(1, Math.round(window.innerHeight * effectiveDpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      if (gl) gl.viewport(0, 0, width, height);
      draw(performance.now());
    }

    function renderWebGL(now) {
      if (!gl || !program || !uniforms) return;
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform2f(uniforms.waveDirection, scrollDirectionX, scrollDirectionY);
      gl.uniform2f(uniforms.pointer, pointerX, pointerY);
      gl.uniform2f(uniforms.pointerVelocity, pointerVelocityX, pointerVelocityY);
      gl.uniform1f(uniforms.time, (now - startedAt) / 1000);
      gl.uniform1f(uniforms.density, SOURCE_PARAMETERS.inkDensity);
      gl.uniform1f(uniforms.flowSpeed, SOURCE_PARAMETERS.flowSpeed);
      gl.uniform1f(uniforms.flowStrength, SOURCE_PARAMETERS.flowStrength);
      gl.uniform1f(uniforms.noise, SOURCE_PARAMETERS.noise);
      gl.uniform1f(uniforms.fog, SOURCE_PARAMETERS.fog);
      gl.uniform1f(uniforms.particle, SOURCE_PARAMETERS.particle);
      gl.uniform1f(uniforms.scrollVelocity, scrollMagnitude);
      gl.uniform1f(uniforms.scrollAcceleration, scrollAcceleration);
      gl.uniform1f(uniforms.waveAmplitude, waveAmplitude);
      gl.uniform1f(uniforms.waveSpeed, waveSpeed);
      gl.uniform1f(uniforms.wavePhase, wavePhase);
      gl.uniform1f(uniforms.pointerStrength, pointerStrength);
      gl.uniform1f(uniforms.cursorReaction, finePointerAvailable && !reducedMotion.matches ? SOURCE_PARAMETERS.cursorReaction : 0);
      gl.uniform1f(uniforms.sectionInfluence, reducedMotion.matches ? 0 : sectionInfluence);
      gl.uniform1f(uniforms.quality, quality);
      gl.uniform1f(uniforms.octaves, quality < 0.8 ? 3 : 4);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function renderFallback(now) {
      if (!context2d) return;
      const ctx = context2d;
      const seconds = (now - startedAt) / 1000;
      const scale = width / Math.max(1, window.innerWidth);
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.filter = "blur(" + Math.max(10, 24 * scale) + "px)";
      const count = Math.round(5 + SOURCE_PARAMETERS.inkDensity * 7);
      for (let index = 0; index < count; index += 1) {
        const seed = index * 12.9898 + 78.233;
        const offset = Math.sin(seed * 0.035 - wavePhase + scrollAcceleration * 0.4) * waveAmplitude;
        const x = (0.5 + Math.sin(seed) * 0.34 + scrollDirectionX * waveAmplitude * 0.045) * width;
        const y = (0.5 + Math.cos(seed * 1.31) * 0.31 - scrollDirectionY * waveAmplitude * 0.045 + offset * 0.02) * height;
        const radius = Math.max(width, height) * (0.08 + (index % 4) * 0.035);
        const gradient = ctx.createRadialGradient(x, y, radius * 0.05, x, y, radius);
        gradient.addColorStop(0, "rgba(17,17,16,0.08)");
        gradient.addColorStop(0.55, "rgba(85,85,82,0.045)");
        gradient.addColorStop(1, "rgba(85,85,82,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(x, y, radius * 1.4, radius * 0.85, seconds * 0.02 + seed, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.filter = "none";
      ctx.fillStyle = "rgba(30,30,29,0.12)";
      for (const particle of fallbackParticles) {
        const x = ((particle.x + Math.sin(seconds * particle.speed + particle.phase) * 0.009 + scrollDirectionX * waveSpeed * 0.025) % 1) * width;
        const y = ((particle.y + Math.cos(seconds * particle.speed * 0.83 + particle.phase) * 0.012 - scrollDirectionY * waveSpeed * 0.025) % 1) * height;
        ctx.beginPath();
        ctx.arc(x, y, particle.radius * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function draw(now) {
      if (renderer === "webgl") renderWebGL(now);
      else if (renderer === "canvas-2d-fallback") renderFallback(now);
    }

    function updateScroll(now, dt) {
      if (reducedMotion.matches) {
        targetScrollX = targetScrollY = scrollX = scrollY = 0;
        scrollMagnitude = scrollImpulse = targetScrollAcceleration = scrollAcceleration = 0;
        waveAmplitude = waveSpeed = 0;
        return;
      }
      if (now - lastScrollEventAt > 70) {
        const inputDecay = Math.exp(-dt / (0.13 + SOURCE_PARAMETERS.trail * 0.18));
        targetScrollX *= inputDecay;
        targetScrollY *= inputDecay;
        targetScrollAcceleration *= Math.exp(-dt / 0.12);
      }
      const velocityBlend = 1 - Math.exp(-dt / 0.075);
      scrollX += (targetScrollX - scrollX) * velocityBlend;
      scrollY += (targetScrollY - scrollY) * velocityBlend;
      const speed = Math.hypot(scrollX, scrollY);
      scrollMagnitude = Math.min(1, speed / MAX_SCROLL_SPEED);
      const response = speed <= SCROLL_DEAD_ZONE
        ? (speed / SCROLL_DEAD_ZONE) * 0.025
        : 0.025 + 0.975 * Math.min(1, (speed - SCROLL_DEAD_ZONE) / (MAX_SCROLL_SPEED - SCROLL_DEAD_ZONE));
      const targetImpulse = Math.min(1, response);
      const impulseTau = targetImpulse > scrollImpulse ? 0.075 : 0.28 + SOURCE_PARAMETERS.trail * 1.20;
      scrollImpulse += (targetImpulse - scrollImpulse) * (1 - Math.exp(-dt / impulseTau));
      const accelerationBlend = 1 - Math.exp(-dt / (targetScrollAcceleration > scrollAcceleration ? 0.06 : 0.18));
      scrollAcceleration += (targetScrollAcceleration - scrollAcceleration) * accelerationBlend;
      waveAmplitude = clamp((scrollImpulse * 0.78 + scrollAcceleration * 0.10) * SOURCE_PARAMETERS.scrollReaction, 0, 0.9);
      waveSpeed = clamp((scrollImpulse * 0.64 + scrollAcceleration * 0.20) * SOURCE_PARAMETERS.scrollReaction, 0, 1);
      if (speed > SCROLL_DEAD_ZONE) {
        const angle = Math.atan2(-scrollY, scrollX);
        const delta = Math.atan2(Math.sin(angle - scrollDirectionAngle), Math.cos(angle - scrollDirectionAngle));
        const blend = 1 - Math.exp(-dt / (0.16 + SOURCE_PARAMETERS.trail * 0.18));
        scrollDirectionAngle += delta * blend;
        scrollDirectionX = Math.cos(scrollDirectionAngle);
        scrollDirectionY = Math.sin(scrollDirectionAngle);
      }
      wavePhase = (wavePhase + waveSpeed * dt * 2.4) % 6.2831853;
    }

    function updatePointer(now, dt) {
      const available = finePointerAvailable && !reducedMotion.matches;
      const idle = !available || now - lastPointerAt > 72;
      if (idle) {
        targetPointerVelocityX = 0;
        targetPointerVelocityY = 0;
        targetPointerStrength = 0;
      }
      const positionBlend = 1 - Math.exp(-dt / (0.075 + SOURCE_PARAMETERS.trail * 0.10));
      const decayBlend = 1 - Math.exp(-dt / (0.14 + SOURCE_PARAMETERS.trail * 0.30));
      pointerX += (targetPointerX - pointerX) * positionBlend;
      pointerY += (targetPointerY - pointerY) * positionBlend;
      pointerVelocityX += (targetPointerVelocityX - pointerVelocityX) * (idle ? decayBlend : positionBlend);
      pointerVelocityY += (targetPointerVelocityY - pointerVelocityY) * (idle ? decayBlend : positionBlend);
      pointerStrength += (targetPointerStrength - pointerStrength) * decayBlend;
      if (!available && pointerStrength < 0.002) {
        pointerStrength = 0;
        pointerVelocityX = 0;
        pointerVelocityY = 0;
      }
    }

    function updateSectionInfluence(dt) {
      const target = reducedMotion.matches ? 0 : targetSectionInfluence;
      const blend = 1 - Math.exp(-dt / 0.85);
      sectionInfluence += (target - sectionInfluence) * blend;
    }

    function onScroll() {
      const now = performance.now();
      const currentX = window.scrollX;
      const currentY = window.scrollY;
      if (reducedMotion.matches) {
        targetScrollX = targetScrollY = scrollX = scrollY = 0;
        scrollMagnitude = scrollImpulse = targetScrollAcceleration = scrollAcceleration = 0;
        waveAmplitude = waveSpeed = 0;
        lastScrollX = currentX;
        lastScrollY = currentY;
        lastScrollEventAt = now;
        return;
      }
      const elapsed = Math.max(8, lastScrollEventAt ? now - lastScrollEventAt : 16);
      const rawX = (currentX - lastScrollX) / elapsed * 1000;
      const rawY = (currentY - lastScrollY) / elapsed * 1000;
      const velocityChange = Math.hypot(rawX - targetScrollX, rawY - targetScrollY);
      targetScrollAcceleration = Math.min(1, velocityChange / MAX_SCROLL_SPEED);
      targetScrollX = clamp(rawX, -MAX_SCROLL_SPEED, MAX_SCROLL_SPEED);
      targetScrollY = clamp(rawY, -MAX_SCROLL_SPEED, MAX_SCROLL_SPEED);
      lastScrollX = currentX;
      lastScrollY = currentY;
      lastScrollEventAt = now;
    }

    function onPointerMove(event) {
      if (!finePointerAvailable || reducedMotion.matches || (event.pointerType && event.pointerType === "touch")) return;
      const now = performance.now();
      const clientX = event.clientX;
      const clientY = event.clientY;
      const x = clamp(clientX / Math.max(1, window.innerWidth), 0, 1);
      const y = 1 - clamp(clientY / Math.max(1, window.innerHeight), 0, 1);
      if (lastPointerEventAt) {
        const elapsedSeconds = Math.max(0.008, (now - lastPointerEventAt) / 1000);
        targetPointerVelocityX = clamp(
          (x - lastPointerClientX / Math.max(1, window.innerWidth)) / elapsedSeconds,
          -1.5,
          1.5
        );
        targetPointerVelocityY = clamp(
          (lastPointerClientY / Math.max(1, window.innerHeight) - clientY / Math.max(1, window.innerHeight)) / elapsedSeconds,
          -1.5,
          1.5
        );
        const speed = Math.hypot(targetPointerVelocityX, targetPointerVelocityY);
        targetPointerStrength = speed > 0.008 ? Math.min(1, 0.12 + speed * 1.15) : 0;
      }
      targetPointerX = x;
      targetPointerY = y;
      lastPointerClientX = clientX;
      lastPointerClientY = clientY;
      lastPointerAt = now;
      lastPointerEventAt = now;
    }

    function onPointerLeave() {
      targetPointerVelocityX = 0;
      targetPointerVelocityY = 0;
      targetPointerStrength = 0;
      lastPointerAt = 0;
      lastPointerEventAt = 0;
    }

    function syncPointerListeners() {
      const shouldListen = finePointer.matches && !reducedMotion.matches;
      finePointerAvailable = shouldListen;
      if (shouldListen && !pointerListenersActive) {
        pointerListenerCleanups = [
          listen(window, "pointermove", onPointerMove, { passive: true }),
          listen(window, "pointerleave", onPointerLeave, { passive: true }),
          listen(window, "blur", onPointerLeave, { passive: true })
        ];
        pointerListenersActive = true;
      } else if (!shouldListen && pointerListenersActive) {
        pointerListenerCleanups.forEach((remove) => remove());
        listeners = listeners.filter((remove) => !pointerListenerCleanups.includes(remove));
        pointerListenerCleanups = [];
        pointerListenersActive = false;
        onPointerLeave();
      }
    }

    function sampleSections() {
      if (sectionObserver) sectionObserver.disconnect();
      sectionObserver = null;
      const sections = Array.from(document.querySelectorAll("main section"));
      sectionVisibility.clear();
      if (reducedMotion.matches || !("IntersectionObserver" in window) || !sections.length) {
        targetSectionInfluence = 0;
        return;
      }
      sectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          sectionVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        targetSectionInfluence = Math.max(0, ...sectionVisibility.values()) * 0.15;
      }, { rootMargin: "-12% 0px -12% 0px", threshold: [0, 0.15, 0.35, 0.6, 0.85, 1] });
      sections.forEach((section) => sectionVisibility.set(section, 0));
      sections.forEach((section) => sectionObserver.observe(section));
    }

    function loop(now) {
      rafCallbackCount += 1;
      rafId = 0;
      if (destroyed || paused || document.hidden || reducedMotion.matches) return;
      if (lastFrameAt && now - lastFrameAt < targetFrameMs) {
        rafId = window.requestAnimationFrame(loop);
        return;
      }
      if (lastFrameAt) {
        frameIntervals.push(now - lastFrameAt);
        if (frameIntervals.length > 300) frameIntervals.shift();
      }
      const elapsed = lastFrameAt ? Math.min(0.1, (now - lastFrameAt) / 1000) : targetFrameMs / 1000;
      lastFrameAt = now;
      updateScroll(now, elapsed);
      updatePointer(now, elapsed);
      updateSectionInfluence(elapsed);
      draw(now);
      frameCount += 1;
      rafId = window.requestAnimationFrame(loop);
    }

    function startLoop() {
      if (!rafId && !destroyed && !paused && !document.hidden && !reducedMotion.matches) {
        rafId = window.requestAnimationFrame(loop);
      } else if (reducedMotion.matches) {
        draw(performance.now());
      }
    }

    function pause() {
      paused = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function resume() {
      if (destroyed) return;
      paused = false;
      lastFrameAt = 0;
      startLoop();
    }

    function onMotionChange() {
      targetScrollX = targetScrollY = scrollX = scrollY = 0;
      scrollMagnitude = scrollImpulse = targetScrollAcceleration = scrollAcceleration = 0;
      waveAmplitude = waveSpeed = 0;
      targetPointerVelocityX = targetPointerVelocityY = targetPointerStrength = 0;
      syncPointerListeners();
      sampleSections();
      if (reducedMotion.matches) {
        pause();
        draw(performance.now());
      } else {
        resume();
      }
    }

    function fallbackAfterContextLoss(event) {
      event.preventDefault();
      if (destroyed || renderer !== "webgl") return;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      webglErrors.push("WebGL context lost; switched to Canvas 2D fallback");
      resetCanvasFor2D(true);
      resize();
      startLoop();
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      if (sectionObserver) sectionObserver.disconnect();
      sectionObserver = null;
      listeners.forEach((remove) => remove());
      listeners = [];
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        const loseContext = gl.getExtension("WEBGL_lose_context");
        if (loseContext) loseContext.loseContext();
      }
      if (canvas && canvas.parentNode) canvas.remove();
      if (instance && instance.destroy === destroy) instance = null;
    }

    function snapshot() {
      const sortedIntervals = frameIntervals.slice().sort((a, b) => a - b);
      const averageFrameTimeMs = frameIntervals.length
        ? frameIntervals.reduce((sum, value) => sum + value, 0) / frameIntervals.length
        : null;
      const p95FrameTimeMs = sortedIntervals.length
        ? sortedIntervals[Math.min(sortedIntervals.length - 1, Math.floor((sortedIntervals.length - 1) * 0.95))]
        : null;
      const maximumFrameTimeMs = sortedIntervals.length ? sortedIntervals[sortedIntervals.length - 1] : null;
      const aspect = width / Math.max(1, height);
      const coarseParticles = 25 * Math.round(25 * aspect);
      const fineScale = Math.round(54 + 24 * quality);
      const fineParticles = fineScale * Math.round(fineScale * aspect);
      return {
        mode: systemMode,
        renderer: renderer,
        parameters: SOURCE_PARAMETERS,
        nativeDpr: window.devicePixelRatio || 1,
        appliedDpr: effectiveDpr,
        resolution: { width: width, height: height },
        qualityMode: isMobileQuality() ? "mobile · 58% render scale · 30fps cap" : "desktop · full render scale · 60fps cap",
        particleCount: renderer === "webgl"
          ? Math.round((coarseParticles + fineParticles) * (0.43 * (0.18 + SOURCE_PARAMETERS.particle * 0.82)))
          : fallbackParticles.length,
        frameCount: frameCount,
        rafCallbackCount: rafCallbackCount,
        averageFps: averageFrameTimeMs ? 1000 / averageFrameTimeMs : null,
        minimumFps: maximumFrameTimeMs ? 1000 / maximumFrameTimeMs : null,
        averageFrameTimeMs: averageFrameTimeMs,
        p95FrameTimeMs: p95FrameTimeMs,
        maximumFrameTimeMs: maximumFrameTimeMs,
        rafActive: Boolean(rafId),
        canvasCount: document.querySelectorAll("#selected-ink-field-canvas").length,
        legacyCanvasCount: document.querySelectorAll(".ripples canvas, #vanta-bg canvas, #vanta-bg-bio canvas").length,
        eventListenerCount: listeners.length,
        scrollVelocityPxPerSecond: Math.hypot(scrollX, scrollY),
        waveAmplitude: waveAmplitude,
        waveSpeed: waveSpeed,
        scrollDirection: { x: scrollDirectionX, y: scrollDirectionY },
        pointerEnabled: finePointerAvailable && !reducedMotion.matches,
        pointerStrength: pointerStrength,
        sectionInfluence: sectionInfluence,
        reducedMotion: reducedMotion.matches,
        webglErrors: webglErrors.slice(),
        rendererWarnings: rendererWarnings.slice()
      };
    }

    initializeWebGL();
    resize();
    canvas.addEventListener("webglcontextlost", fallbackAfterContextLoss, false);
    listen(window, "resize", resize, { passive: true });
    listen(window, "orientationchange", resize, { passive: true });
    listen(window, "scroll", onScroll, { passive: true });
    syncPointerListeners();
    listen(document, "visibilitychange", () => {
      if (document.hidden) pause();
      else resume();
    }, false);
    const onMediaChange = () => onMotionChange();
    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", onMediaChange);
      listeners.push(() => reducedMotion.removeEventListener("change", onMediaChange));
    } else if (reducedMotion.addListener) {
      reducedMotion.addListener(onMediaChange);
      listeners.push(() => reducedMotion.removeListener(onMediaChange));
    }
    const onFinePointerChange = () => {
      syncPointerListeners();
      resize();
    };
    if (finePointer.addEventListener) {
      finePointer.addEventListener("change", onFinePointerChange);
      listeners.push(() => finePointer.removeEventListener("change", onFinePointerChange));
    } else if (finePointer.addListener) {
      finePointer.addListener(onFinePointerChange);
      listeners.push(() => finePointer.removeListener(onFinePointerChange));
    }
    sampleSections();

    instance = {
      config: SOURCE_PARAMETERS,
      getState: snapshot,
      resize: resize,
      pause: pause,
      resume: resume,
      destroy: destroy
    };
    if (reducedMotion.matches) draw(performance.now());
    else startLoop();
    return instance;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }

  window.addEventListener("pagehide", (event) => {
    if (!instance) return;
    if (event.persisted) instance.pause();
    else instance.destroy();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && !instance) mount();
    else if (event.persisted && instance) instance.resume();
  });

  Object.defineProperty(window, "__selectedInkField", {
    configurable: true,
    get: () => instance
  });
})();
