(function () {
  "use strict";

  const DEFAULTS = Object.freeze({
    speed: 0.42,
    lineWidth: 1.4,
    opacity: 0.36,
    lineCount: 22,
    movementStrength: 58,
    direction: -24,
    color: "#deded8",
    blendMode: "source-over"
  });

  const VARIANTS = Object.freeze({
    contour: { name: "Organic Contour", detail: "輪郭が静かに呼吸する" },
    ribbons: { name: "Flowing Ribbons", detail: "細い帯が球体の周囲を横切る" },
    currents: { name: "Branching Currents", detail: "枝分かれした流れがゆっくり伸びる" },
    atmosphere: { name: "Atmospheric Flow", detail: "空気の流線が淡く揺らぐ" }
  });

  const VARIANT_KEYS = Object.freeze(Object.keys(VARIANTS));
  const SHOWCASE_KEYS = Object.freeze(VARIANT_KEYS.concat("hybrid-random"));
  const HYBRID_DEFAULTS = Object.freeze({ contour: 40, ribbons: 25, currents: 15, atmosphere: 20 });
  const DEFAULT_WEIGHTS = Object.freeze({ contour: 25, ribbons: 25, currents: 25, atmosphere: 25 });
  const SHOWCASE_DEFAULT_WEIGHTS = Object.freeze({ contour: 20, ribbons: 20, currents: 20, atmosphere: 20, "hybrid-random": 20 });
  const VALID_CONFIG_MODES = Object.freeze(["manual", "random", "hybrid", "showcase-random"]);
  const VALID_RENDER_MODES = Object.freeze(["manual", "random", "hybrid"]);
  const VALID_BLEND_MODES = Object.freeze(["source-over", "soft-light", "screen", "multiply", "overlay"]);

  const TAU = Math.PI * 2;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;

  function sanitizeSettings(source, fallback) {
    const base = fallback || DEFAULTS;
    const value = source && typeof source === "object" ? source : {};
    const number = (key, min, max) => {
      const next = Number(value[key]);
      return Number.isFinite(next) ? clamp(next, min, max) : base[key];
    };
    const color = typeof value.color === "string" && /^#[\da-f]{6}$/i.test(value.color) ? value.color : base.color;
    const blendMode = VALID_BLEND_MODES.includes(value.blendMode) ? value.blendMode : base.blendMode;
    return {
      speed: number("speed", 0, 1.4),
      lineWidth: number("lineWidth", 0.3, 2.4),
      opacity: number("opacity", 0.03, 0.42),
      lineCount: Math.round(number("lineCount", 4, 32)),
      movementStrength: Math.round(number("movementStrength", 0, 100)),
      direction: Math.round(number("direction", -180, 180)),
      color,
      blendMode
    };
  }

  function createDefaultConfig() {
    const variantSettings = {};
    VARIANT_KEYS.forEach((key) => { variantSettings[key] = { ...DEFAULTS }; });
    return {
      schemaVersion: 3,
      mode: "manual",
      selectedVariant: "contour",
      commonSettings: { ...DEFAULTS },
      variantSettings,
      random: { weights: { ...DEFAULT_WEIGHTS }, seed: 0, seedLocked: false, drawIndex: 0 },
      showcaseRandom: { weights: { ...SHOWCASE_DEFAULT_WEIGHTS } },
      hybridContributions: { ...HYBRID_DEFAULTS },
      hybridRandomizeOnReload: false,
      animationEnabled: true,
      provenance: { kind: "new-defaults", userTunedValuesRecovered: false }
    };
  }

  function normalizeConfig(source) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      throw new Error("設定JSONはオブジェクト形式である必要があります。");
    }
    const version = Number(source.schemaVersion || 0);
    if (version > 3) throw new Error("この設定JSONのschemaVersionにはまだ対応していません。");
    const config = createDefaultConfig();
    const warnings = [];
    if (version === 2 || version === 3) {
      config.mode = VALID_CONFIG_MODES.includes(source.mode) ? source.mode : "manual";
      config.selectedVariant = VARIANT_KEYS.includes(source.selectedVariant) ? source.selectedVariant : "contour";
      config.commonSettings = sanitizeSettings(source.commonSettings, DEFAULTS);
      VARIANT_KEYS.forEach((key) => {
        config.variantSettings[key] = sanitizeSettings(source.variantSettings && source.variantSettings[key], config.commonSettings);
      });
      const random = source.random && typeof source.random === "object" ? source.random : {};
      const weights = random.weights && typeof random.weights === "object" ? random.weights : {};
      VARIANT_KEYS.forEach((key) => {
        const weight = Number(weights[key]);
        config.random.weights[key] = Number.isFinite(weight) ? clamp(weight, 0, 100) : DEFAULT_WEIGHTS[key];
      });
      const showcase = source.showcaseRandom && typeof source.showcaseRandom === "object" ? source.showcaseRandom : {};
      const showcaseWeights = showcase.weights && typeof showcase.weights === "object" ? showcase.weights : {};
      SHOWCASE_KEYS.forEach((key) => {
        const weight = Number(showcaseWeights[key]);
        config.showcaseRandom.weights[key] = Number.isFinite(weight) ? clamp(weight, 0, 100) : SHOWCASE_DEFAULT_WEIGHTS[key];
      });
      const seed = Number(random.seed);
      config.random.seed = Number.isFinite(seed) ? (Math.trunc(seed) >>> 0) : 0;
      config.random.seedLocked = Boolean(random.seedLocked);
      config.random.drawIndex = Math.max(0, Math.min(1000000, Math.trunc(Number(random.drawIndex) || 0)));
      const contributions = source.hybridContributions && typeof source.hybridContributions === "object"
        ? source.hybridContributions : {};
      VARIANT_KEYS.forEach((key) => {
        const weight = Number(contributions[key]);
        config.hybridContributions[key] = Number.isFinite(weight) ? clamp(weight, 0, 100) : HYBRID_DEFAULTS[key];
      });
      config.hybridRandomizeOnReload = source.hybridRandomizeOnReload === true;
      config.animationEnabled = source.animationEnabled !== false;
      if (source.provenance && typeof source.provenance === "object") {
        config.provenance = {
          kind: String(source.provenance.kind || (version === 3 ? "imported-v3" : "imported-v2")).slice(0, 80),
          userTunedValuesRecovered: Boolean(source.provenance.userTunedValuesRecovered),
          importedVariant: VARIANT_KEYS.includes(source.provenance.importedVariant) ? source.provenance.importedVariant : undefined
        };
      } else {
        config.provenance = { kind: version === 3 ? "imported-v3" : "imported-v2", userTunedValuesRecovered: false };
      }
      return { config, warnings };
    }

    // The previous preview exported one active variant and a single parameter set.
    // Do not imply that it contained the separate values for all four variants.
    if (source.settings && typeof source.settings === "object") {
      const selected = VARIANT_KEYS.includes(source.variant) ? source.variant : "contour";
      const imported = sanitizeSettings(source.settings, DEFAULTS);
      config.selectedVariant = selected;
      config.variantSettings[selected] = { ...imported };
      config.commonSettings = { ...imported };
      config.provenance = { kind: "legacy-single-variant-import", userTunedValuesRecovered: false, importedVariant: selected };
      warnings.push("旧形式のJSONから選択中Variantの値のみ読み込みました。A〜D個別の保存値は旧形式に含まれていません。");
      return { config, warnings };
    }
    throw new Error("schemaVersion 2または旧形式の { variant, settings } を含むJSONではありません。");
  }

  function createSeededRandom(seed) {
    let value = Math.trunc(Number(seed) || 0) >>> 0;
    return function () {
      value = (value + 0x6D2B79F5) >>> 0;
      let mixed = value;
      mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalizedWeights(weights) {
    const clean = {};
    let total = 0;
    VARIANT_KEYS.forEach((key) => {
      const value = Number(weights && weights[key]);
      clean[key] = Number.isFinite(value) ? clamp(value, 0, 100) : 0;
      total += clean[key];
    });
    if (total <= 0) {
      VARIANT_KEYS.forEach((key) => { clean[key] = 1; });
      total = VARIANT_KEYS.length;
    }
    VARIANT_KEYS.forEach((key) => { clean[key] /= total; });
    return clean;
  }

  function normalizedShowcaseWeights(weights) {
    const clean = {};
    let total = 0;
    SHOWCASE_KEYS.forEach((key) => {
      const value = Number(weights && weights[key]);
      clean[key] = Number.isFinite(value) ? clamp(value, 0, 100) : 0;
      total += clean[key];
    });
    if (total <= 0) {
      SHOWCASE_KEYS.forEach((key) => { clean[key] = 1; });
      total = SHOWCASE_KEYS.length;
    }
    SHOWCASE_KEYS.forEach((key) => { clean[key] /= total; });
    return clean;
  }

  function chooseShowcaseVariant(weights, randomValue, excludedChoice) {
    const normalized = normalizedShowcaseWeights(weights);
    let candidates = SHOWCASE_KEYS.filter((key) => normalized[key] > 0 && key !== excludedChoice);
    if (!candidates.length) candidates = SHOWCASE_KEYS.filter((key) => normalized[key] > 0);
    const total = candidates.reduce((sum, key) => sum + normalized[key], 0);
    const sample = Number(randomValue);
    const roll = clamp(Number.isFinite(sample) ? sample : 0, 0, 0.999999999999) * total;
    let cumulative = 0;
    for (const key of candidates) {
      cumulative += normalized[key];
      if (roll < cumulative) return key;
    }
    return candidates[candidates.length - 1];
  }

  function chooseWeightedVariant(weights, randomValue, excludedVariant) {
    const normalized = normalizedWeights(weights);
    let candidates = VARIANT_KEYS.filter((key) => normalized[key] > 0 && key !== excludedVariant);
    if (!candidates.length) candidates = VARIANT_KEYS.filter((key) => normalized[key] > 0);
    const total = candidates.reduce((sum, key) => sum + normalized[key], 0);
    const roll = clamp(Number(randomValue), 0, 0.999999999999) * total;
    let cumulative = 0;
    for (const key of candidates) {
      cumulative += normalized[key];
      if (roll < cumulative) return key;
    }
    return candidates[candidates.length - 1];
  }

  function randomizeHybridContributions(randomSource) {
    const nextRandom = typeof randomSource === "function" ? randomSource : Math.random;
    const minimum = 12;
    const maximum = 38;
    const result = {};
    let remaining = 100;
    VARIANT_KEYS.forEach((key, index) => {
      const slotsAfter = VARIANT_KEYS.length - index - 1;
      if (slotsAfter === 0) {
        result[key] = remaining;
        return;
      }
      const low = Math.max(minimum, remaining - maximum * slotsAfter);
      const high = Math.min(maximum, remaining - minimum * slotsAfter);
      const sample = Number(nextRandom());
      const roll = Number.isFinite(sample) ? clamp(sample, 0, 0.999999999999) : 0.5;
      const value = Math.floor(low + roll * (high - low + 1));
      result[key] = value;
      remaining -= value;
    });
    return result;
  }

  function seeded(index) {
    const value = Math.sin(index * 127.1 + 311.7) * 43758.5453123;
    return value - Math.floor(value);
  }

  function smoothField(x, y, time, seed) {
    const phase = seed * TAU;
    return (
      Math.sin(x * 2.18 + Math.sin(y * 1.12 + time * 0.13 + phase) * 0.72 + time * 0.08) * 0.48 +
      Math.cos(y * 2.54 - Math.sin(x * 1.38 - time * 0.1 + phase) * 0.55 - time * 0.065) * 0.34 +
      Math.sin((x + y) * 1.31 + phase * 2 + time * 0.045) * 0.18
    );
  }

  function createOrganicFlow(canvas, frameWindow, onMetrics, initialState) {
    const initial = initialState && typeof initialState === "object" ? initialState : {};
    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!context) throw new Error("Canvas2D is unavailable for Organic Flow.");
    const frameDocument = frameWindow.document;
    const mediaReduced = frameWindow.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = frameWindow.matchMedia("(pointer: coarse)");
    const metrics = {
      frameTimes: [], drawTimes: [], resizeTimes: [], frameCount: 0,
      longTaskCount: 0, longTaskDurationMs: 0, resizeCount: 0,
      width: 0, height: 0, dpr: 1, running: false, enabled: true,
      lastFrameAt: 0, elapsed: 0
    };
    let settings = sanitizeSettings(initial.settings, DEFAULTS);
    let variant = Object.prototype.hasOwnProperty.call(VARIANTS, initial.variant) ? initial.variant : "contour";
    let mode = VALID_RENDER_MODES.includes(initial.mode) ? initial.mode : "manual";
    const suppliedContributions = initial.hybridContributions && typeof initial.hybridContributions === "object"
      ? initial.hybridContributions : HYBRID_DEFAULTS;
    let hybridContributions = {};
    VARIANT_KEYS.forEach((key) => {
      const value = Number(suppliedContributions[key]);
      hybridContributions[key] = Number.isFinite(value) ? clamp(value, 0, 100) : HYBRID_DEFAULTS[key];
    });
    let rafId = 0;
    let lastFrame = 0;
    let destroyed = false;
    let enabled = initial.enabled !== false;
    let paused = initial.paused === true;
    metrics.enabled = enabled;
    let resizeObserver = null;
    let longTaskObserver = null;

    function mobileQuality() {
      return coarse.matches || frameWindow.innerWidth <= 768;
    }

    function resize() {
      const start = frameWindow.performance.now();
      const width = Math.max(1, Math.round(frameWindow.innerWidth));
      const height = Math.max(1, Math.round(frameWindow.innerHeight));
      const mobile = mobileQuality();
      const dprCap = mobile ? 1.05 : 1.35;
      const dpr = Math.max(0.75, Math.min(frameWindow.devicePixelRatio || 1, dprCap));
      metrics.width = width;
      metrics.height = height;
      metrics.dpr = dpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const elapsed = frameWindow.performance.now() - start;
      metrics.resizeCount += 1;
      metrics.resizeTimes.push(elapsed);
      if (metrics.resizeTimes.length > 80) metrics.resizeTimes.shift();
      draw(metrics.elapsed);
    }

    function alphaFor(index, count, variantScale, influence) {
      const edgeFade = count > 1 ? 0.68 + 0.32 * Math.sin(Math.PI * (index + 0.5) / count) : 1;
      return clamp(settings.opacity * variantScale * edgeFade * Math.sqrt(influence === undefined ? 1 : influence), 0, 0.75);
    }

    function rgba(hex, alpha) {
      const normalized = /^#[\da-f]{6}$/i.test(hex) ? hex.slice(1) : "555550";
      const red = parseInt(normalized.slice(0, 2), 16);
      const green = parseInt(normalized.slice(2, 4), 16);
      const blue = parseInt(normalized.slice(4, 6), 16);
      return "rgba(" + red + "," + green + "," + blue + "," + alpha.toFixed(4) + ")";
    }

    function setupStroke(alpha) {
      context.strokeStyle = rgba(settings.color, alpha);
      context.lineWidth = settings.lineWidth;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.globalCompositeOperation = settings.blendMode;
    }

    function renderContours(time, count, influence) {
      const cx = metrics.width * 0.5;
      const cy = metrics.height * 0.49;
      const minSide = Math.min(metrics.width, metrics.height);
      const sampleCount = mobileQuality() ? 96 : 144;
      for (let line = 0; line < count; line += 1) {
        const fraction = count > 1 ? line / (count - 1) : 0.5;
        const radius = minSide * (0.14 + fraction * 0.37);
        const seed = seeded(line + 3);
        setupStroke(alphaFor(line, count, 0.92, influence));
        context.beginPath();
        for (let point = 0; point <= sampleCount; point += 1) {
          const angle = (point / sampleCount) * TAU;
          const nx = Math.cos(angle) * (1.3 + fraction * 1.5);
          const ny = Math.sin(angle) * 1.85;
          const warp = smoothField(nx, ny, time, seed);
          const fineWarp = smoothField(nx * 1.85 + 2.1, ny * 1.7 - 0.7, time * 1.16, seed + 0.19);
          const drift = smoothField(ny + 2.2, nx - 1.7, time * 0.7, seed + 0.37);
          const amount = settings.movementStrength / 100 * (influence === undefined ? 1 : 0.58 + influence * 0.42);
          const radial = radius * (1 + warp * amount * 0.16 + fineWarp * amount * 0.075);
          const x = cx + Math.cos(angle + drift * amount * 0.11) * radial * (1.1 + fraction * 0.2);
          const y = cy + Math.sin(angle + drift * amount * 0.085) * radial * 0.74;
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.stroke();
      }
    }

    function renderRibbons(time, count, influence) {
      const width = metrics.width;
      const height = metrics.height;
      const sampleCount = mobileQuality() ? 48 : 72;
      const angle = (settings.direction * Math.PI) / 180;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const amplitude = Math.min(width, height) * (0.018 + settings.movementStrength / 100 * 0.09) * (influence === undefined ? 1 : 0.62 + influence * 0.38);
      for (let line = 0; line < count; line += 1) {
        const lane = (line + 0.5) / count;
        setupStroke(alphaFor(line, count, 0.84, influence));
        context.beginPath();
        for (let point = 0; point <= sampleCount; point += 1) {
          const u = point / sampleCount;
          const along = (u - 0.5) * Math.hypot(width, height) * 1.1;
          const cross = (lane - 0.5) * Math.min(width, height) * 0.75;
          const field = smoothField(u * 4.1, lane * 3.2, time, seeded(line + 91));
          const undulation = Math.sin(u * 8.2 + time * 0.42 + line * 0.48) * 0.55 + field * 0.45;
          const bend = undulation * amplitude;
          const x = width * 0.5 + dx * along - dy * (cross + bend);
          const y = height * 0.49 + dy * along + dx * (cross + bend);
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
    }

    function drawBranch(x, y, heading, length, depth, seed, time, alpha, lineWidth) {
      if (depth < 0 || length < 7) return;
      const segments = mobileQuality() ? 9 : 13;
      const points = [{ x, y }];
      let px = x;
      let py = y;
      let direction = heading;
      for (let step = 1; step <= segments; step += 1) {
        const ratio = step / segments;
        const localTime = time + depth * 0.37;
        direction += smoothField(px / Math.max(1, metrics.width) * 3, py / Math.max(1, metrics.height) * 3, localTime, seed) * 0.07 * (settings.movementStrength / 24);
        const stride = length / segments;
        px += Math.cos(direction) * stride;
        py += Math.sin(direction) * stride;
        points.push({ x: px, y: py });
      }
      context.globalCompositeOperation = settings.blendMode;
      context.strokeStyle = rgba(settings.color, alpha);
      context.lineWidth = Math.max(0.3, lineWidth * (0.76 + depth * 0.16));
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < points.length - 1; index += 1) {
        const midX = (points[index].x + points[index + 1].x) * 0.5;
        const midY = (points[index].y + points[index + 1].y) * 0.5;
        context.quadraticCurveTo(points[index].x, points[index].y, midX, midY);
      }
      const lastPoint = points[points.length - 1];
      context.lineTo(lastPoint.x, lastPoint.y);
      context.stroke();
      if (depth > 0) {
        const end = points[points.length - 1];
        const split = 0.23 + seeded(seed * 71 + depth) * 0.18;
        const sway = smoothField(end.x / metrics.width, end.y / metrics.height, time, seed + 0.5) * 0.14;
        drawBranch(end.x, end.y, direction - split + sway, length * 0.69, depth - 1, seed + 1.2, time, alpha * 0.86, lineWidth * 0.86);
        drawBranch(end.x, end.y, direction + split + sway, length * 0.66, depth - 1, seed + 2.7, time, alpha * 0.79, lineWidth * 0.79);
      }
    }

    function renderCurrents(time, count, influence, rootOverride) {
      const roots = rootOverride === undefined ? clamp(Math.round(count / 4.4), 3, 8) : clamp(Math.round(rootOverride), 1, 8);
      const minSide = Math.min(metrics.width, metrics.height);
      const direction = (settings.direction * Math.PI) / 180;
      for (let root = 0; root < roots; root += 1) {
        const fromLeft = root % 2 === 0;
        const sideIndex = Math.floor(root / 2);
        const sideCount = Math.ceil(roots / 2);
        const spread = sideCount > 1 ? sideIndex / (sideCount - 1) : 0.5;
        const x = fromLeft ? -18 : metrics.width + 18;
        const y = metrics.height * (0.17 + spread * 0.66);
        const heading = (fromLeft ? 0 : Math.PI) + direction * 0.42;
        const length = Math.max(metrics.width, minSide) * (0.34 + seeded(root + 11) * 0.18);
        drawBranch(x, y, heading, length, 2, seeded(root + 48), time, alphaFor(root, roots, 0.98, influence), settings.lineWidth);
      }
    }

    function renderAtmosphere(time, count, influence) {
      const width = metrics.width;
      const height = metrics.height;
      const mobile = mobileQuality();
      const lineSamples = mobile ? 48 : 68;
      const direction = (settings.direction * Math.PI) / 180;
      const baseX = Math.cos(direction);
      const baseY = Math.sin(direction);
      const step = Math.min(width, height) / (mobile ? 68 : 84);
      for (let line = 0; line < count; line += 1) {
        const seed = seeded(line + 203);
        let x = width * (0.12 + seeded(line + 6) * 0.76);
        let y = height * (0.12 + seeded(line + 34) * 0.76);
        setupStroke(alphaFor(line, count, 0.78, influence));
        context.beginPath();
        context.moveTo(x, y);
        for (let point = 0; point < lineSamples; point += 1) {
          const nx = x / Math.max(1, width) * 3.4;
          const ny = y / Math.max(1, height) * 3.4;
          const curlA = smoothField(nx + 1, ny - 2, time, seed);
          const curlB = smoothField(nx - 2, ny + 1, time, seed + 0.23);
          const angle = Math.atan2(baseY + curlB * 0.52, baseX + curlA * 0.52);
          const amount = settings.movementStrength / 100;
          x += Math.cos(angle) * step * (0.42 + amount * 0.55);
          y += Math.sin(angle) * step * (0.42 + amount * 0.55);
          if (x < -40 || x > width + 40 || y < -40 || y > height + 40) break;
          context.lineTo(x, y);
        }
        context.stroke();
      }
    }

    function renderHybrid(time, count) {
      const weights = normalizedWeights(hybridContributions);
      const budget = Math.max(6, Math.round(count * 0.72));
      const contourCount = weights.contour > 0 ? Math.max(1, Math.round(budget * weights.contour)) : 0;
      const ribbonCount = weights.ribbons > 0 ? Math.max(1, Math.round(budget * weights.ribbons)) : 0;
      const atmosphereCount = weights.atmosphere > 0 ? Math.max(1, Math.round(budget * weights.atmosphere)) : 0;
      const branchRoots = weights.currents > 0 ? Math.max(1, Math.round(3 * weights.currents)) : 0;
      if (contourCount) renderContours(time, contourCount, weights.contour);
      if (ribbonCount) renderRibbons(time, ribbonCount, weights.ribbons);
      if (branchRoots) renderCurrents(time, count, weights.currents, branchRoots);
      if (atmosphereCount) renderAtmosphere(time, atmosphereCount, weights.atmosphere);
    }

    function draw(time) {
      if (destroyed) return 0;
      const started = frameWindow.performance.now();
      const width = metrics.width;
      const height = metrics.height;
      context.clearRect(0, 0, width, height);
      const qualityScale = mobileQuality() ? 0.68 : frameWindow.innerWidth <= 1024 ? 0.82 : 1;
      const count = Math.max(2, Math.round(settings.lineCount * qualityScale));
      if (enabled) {
        if (mode === "hybrid") renderHybrid(time, count);
        else if (variant === "contour") renderContours(time, count);
        else if (variant === "ribbons") renderRibbons(time, count);
        else if (variant === "currents") renderCurrents(time, count);
        else renderAtmosphere(time, count);
      }
      const drawMs = frameWindow.performance.now() - started;
      metrics.drawTimes.push(drawMs);
      if (metrics.drawTimes.length > 7200) metrics.drawTimes.shift();
      if (onMetrics && metrics.frameCount % 30 === 0) onMetrics(snapshot());
      return drawMs;
    }

    function frame(now) {
      rafId = 0;
      if (destroyed || paused || !enabled || mediaReduced.matches) return;
      if (lastFrame) {
        const interval = now - lastFrame;
        metrics.frameTimes.push(interval);
        if (metrics.frameTimes.length > 7200) metrics.frameTimes.shift();
      }
      lastFrame = now;
      metrics.frameCount += 1;
      metrics.lastFrameAt = now;
      const delta = Math.min(0.08, Math.max(0, (now - (metrics.elapsedLast || now)) / 1000));
      metrics.elapsedLast = now;
      metrics.elapsed += delta * settings.speed;
      draw(metrics.elapsed);
      rafId = frameWindow.requestAnimationFrame(frame);
    }

    function start() {
      if (destroyed || paused || !enabled || mediaReduced.matches || rafId) return;
      lastFrame = 0;
      metrics.elapsedLast = 0;
      rafId = frameWindow.requestAnimationFrame(frame);
    }

    function pause() {
      paused = true;
      if (rafId) frameWindow.cancelAnimationFrame(rafId);
      rafId = 0;
      metrics.running = false;
    }

    function resume() {
      if (destroyed || mediaReduced.matches || !enabled) return;
      paused = false;
      metrics.running = true;
      start();
    }

    function onMotionChange() {
      if (mediaReduced.matches) {
        pause();
        draw(metrics.elapsed);
      } else {
        paused = false;
        metrics.running = enabled;
        start();
      }
    }

    function readPercentile(values, percentile) {
      if (!values.length) return null;
      const sorted = values.slice().sort((a, b) => a - b);
      return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * percentile) - 1)];
    }

    function snapshot() {
      const frameAvg = metrics.frameTimes.length
        ? metrics.frameTimes.reduce((sum, value) => sum + value, 0) / metrics.frameTimes.length : null;
      const frameMax = metrics.frameTimes.length ? Math.max.apply(null, metrics.frameTimes) : null;
      const drawAvg = metrics.drawTimes.length
        ? metrics.drawTimes.reduce((sum, value) => sum + value, 0) / metrics.drawTimes.length : null;
      const resizeAvg = metrics.resizeTimes.length
        ? metrics.resizeTimes.reduce((sum, value) => sum + value, 0) / metrics.resizeTimes.length : null;
      const selected = frameWindow.__selectedInkField && frameWindow.__selectedInkField.getState
        ? frameWindow.__selectedInkField.getState() : null;
      const trunk = frameWindow.__PORTFOLIO_BACKGROUND_ACCENTS__ && frameWindow.__PORTFOLIO_BACKGROUND_ACCENTS__.getTrunkSphereInstance
        ? frameWindow.__PORTFOLIO_BACKGROUND_ACCENTS__.getTrunkSphereInstance() : null;
      const canvases = Array.from(frameDocument.querySelectorAll("canvas"));
      const webglCount = (selected && selected.renderer === "webgl" ? 1 : 0) + (trunk && trunk.mode === "webgl" ? 1 : 0);
      const heapBytes = frameWindow.performance.memory && Number.isFinite(frameWindow.performance.memory.usedJSHeapSize)
        ? frameWindow.performance.memory.usedJSHeapSize : null;
      const resizeEntries = metrics.resizeTimes;
      return {
        variant: variant,
        variantName: mode === "hybrid" ? "Hybrid Organic Flow" : VARIANTS[variant].name,
        mode: mode,
        hybridContributions: { ...hybridContributions },
        page: frameWindow.location.pathname,
        viewport: { width: metrics.width, height: metrics.height },
        dpr: metrics.dpr,
        canvasResolution: { width: canvas.width, height: canvas.height },
        qualityMode: mobileQuality() ? "mobile · capped DPR / reduced lines" : (frameWindow.innerWidth <= 1024 ? "tablet · reduced lines" : "desktop · capped DPR"),
        lineCount: Math.round(settings.lineCount * (mobileQuality() ? 0.68 : frameWindow.innerWidth <= 1024 ? 0.82 : 1)),
        settings: { ...settings },
        fps: frameAvg ? 1000 / frameAvg : null,
        minimumFps: frameMax ? 1000 / frameMax : null,
        averageFrameTimeMs: frameAvg,
        p95FrameTimeMs: readPercentile(metrics.frameTimes, 0.95),
        maximumFrameTimeMs: frameMax,
        organicDrawAverageMs: drawAvg,
        organicDrawP95Ms: readPercentile(metrics.drawTimes, 0.95),
        canvasCount: canvases.length,
        organicCanvasCount: canvas.isConnected ? 1 : 0,
        organicCanvasConnected: canvas.isConnected,
        organicAnimationEnabled: enabled,
        selectedInk: selected ? {
          renderer: selected.renderer, canvasCount: selected.canvasCount,
          frameCount: selected.frameCount, averageFps: selected.averageFps,
          webglErrors: selected.webglErrors, rippleCanvasCount: selected.rippleCanvasCount,
          trunkCanvasCount: selected.trunkCanvasCount
        } : null,
        trunkCanvasCount: frameDocument.querySelectorAll("#vanta-bg-bio canvas").length,
        webglContextCount: webglCount,
        heapUsedBytes: heapBytes,
        memory: heapBytes === null ? "NOT_AVAILABLE" : "available",
        resizeCount: metrics.resizeCount,
        lastResizeHandlerMs: resizeEntries.length ? resizeEntries[resizeEntries.length - 1] : null,
        averageResizeHandlerMs: resizeAvg,
        longTaskCount: metrics.longTaskCount,
        longTaskDurationMs: metrics.longTaskDurationMs,
        longTaskApi: longTaskObserver ? "available" : "NOT_AVAILABLE",
        frameCount: metrics.frameCount,
        rafActive: Boolean(rafId),
        reducedMotion: mediaReduced.matches,
        rippleResourceCount: frameWindow.performance.getEntriesByType("resource").filter((entry) => /ripples?|bg_wave/i.test(entry.name)).length,
        selectedInkWebglErrors: selected ? selected.webglErrors : ["NOT_AVAILABLE"]
      };
    }

    function resetMetrics() {
      metrics.frameTimes.length = 0;
      metrics.drawTimes.length = 0;
      metrics.resizeTimes.length = 0;
      metrics.frameCount = 0;
      metrics.longTaskCount = 0;
      metrics.longTaskDurationMs = 0;
      metrics.resizeCount = 0;
      metrics.lastFrameAt = 0;
    }

    function update(nextSettings) {
      settings = { ...settings, ...nextSettings };
      draw(metrics.elapsed);
    }

    function setVariant(nextVariant) {
      if (!Object.prototype.hasOwnProperty.call(VARIANTS, nextVariant)) return;
      variant = nextVariant;
      draw(metrics.elapsed);
    }

    function setMode(nextMode) {
      if (!VALID_RENDER_MODES.includes(nextMode)) return;
      mode = nextMode;
      draw(metrics.elapsed);
    }

    function setHybridContributions(nextContributions) {
      VARIANT_KEYS.forEach((key) => {
        const next = Number(nextContributions && nextContributions[key]);
        if (Number.isFinite(next)) hybridContributions[key] = clamp(next, 0, 100);
      });
      draw(metrics.elapsed);
    }

    function setEnabled(nextEnabled) {
      enabled = Boolean(nextEnabled);
      metrics.enabled = enabled;
      if (!enabled) {
        if (rafId) frameWindow.cancelAnimationFrame(rafId);
        rafId = 0;
        context.clearRect(0, 0, metrics.width, metrics.height);
        metrics.running = false;
        canvas.remove();
      } else {
        if (!canvas.isConnected) {
          const overlay = frameDocument.querySelector("#portfolio-overlay-animation");
          if (overlay) overlay.appendChild(canvas);
        }
        metrics.running = !paused && !mediaReduced.matches;
        resize();
        start();
        draw(metrics.elapsed);
      }
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      if (rafId) frameWindow.cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      if (longTaskObserver) longTaskObserver.disconnect();
      frameWindow.removeEventListener("resize", resize);
      frameWindow.removeEventListener("pagehide", destroy);
      if (mediaReduced.removeEventListener) mediaReduced.removeEventListener("change", onMotionChange);
      else if (mediaReduced.removeListener) mediaReduced.removeListener(onMotionChange);
      canvas.remove();
    }

    canvas.className = "organic-flow-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.engine = "organic-flow-canvas2d";
    frameDocument.querySelector("#portfolio-overlay-animation").appendChild(canvas);
    frameWindow.addEventListener("resize", resize, { passive: true });
    frameWindow.addEventListener("pagehide", destroy, { once: true });
    if (frameWindow.ResizeObserver) {
      resizeObserver = new frameWindow.ResizeObserver(resize);
      resizeObserver.observe(frameDocument.querySelector("#portfolio-overlay-animation"));
    }
    if (frameWindow.PerformanceObserver) {
      try {
        longTaskObserver = new frameWindow.PerformanceObserver((entries) => {
          entries.getEntries().forEach((entry) => {
            metrics.longTaskCount += 1;
            metrics.longTaskDurationMs += entry.duration;
          });
        });
        longTaskObserver.observe({ type: "longtask", buffered: true });
      } catch (error) {
        longTaskObserver = null;
      }
    }
    if (mediaReduced.addEventListener) mediaReduced.addEventListener("change", onMotionChange);
    else if (mediaReduced.addListener) mediaReduced.addListener(onMotionChange);
    resize();
    metrics.running = enabled && !paused && !mediaReduced.matches;
    if (mediaReduced.matches || !enabled || paused) draw(0);
    else start();

    return {
      defaults: { ...DEFAULTS },
      variants: VARIANTS,
      update,
      setVariant,
      setMode,
      setHybridContributions,
      setEnabled,
      pause,
      resume,
      resetMetrics,
      snapshot,
      destroy
    };
  }

  window.OrganicFlow = {
    DEFAULTS, VARIANTS, VARIANT_KEYS, SHOWCASE_KEYS, HYBRID_DEFAULTS, DEFAULT_WEIGHTS, SHOWCASE_DEFAULT_WEIGHTS,
    createDefaultConfig, normalizeConfig, sanitizeSettings, createSeededRandom,
    normalizedWeights, chooseWeightedVariant, normalizedShowcaseWeights, chooseShowcaseVariant,
    randomizeHybridContributions, create: createOrganicFlow
  };
})();
