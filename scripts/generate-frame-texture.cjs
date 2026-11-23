#!/usr/bin/env node
/*
 * generate-frame-texture.cjs
 *
 * Synthesizes the site frame's forged-iron textures at build time
 * (docs/img/frame-iron-dark.webp / frame-iron-light.webp), mirroring
 * scripts/generate-thumbs.cjs: outputs are gitignored and ship with
 * the built tree. Deterministic (seeded PRNG), so check:generated
 * and check:docs-sync stay stable.
 *
 * Recipe (tuned against the approved B5 reference):
 *   - fractal value noise (torus-wrapped octaves) for mottling
 *   - a bump map of hammer dents, shaded directionally (light from
 *     the upper left) so dents read as relief, not stains
 *   - faint scratches, sharp speckles and fine grain
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const S = 512;
const OUT_DIR = path.join(__dirname, "..", "docs", "img");

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One torus-wrapped value-noise octave, normalized to 0..1.
function octave(rand, g) {
  const grid = new Float32Array(g * g);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();
  const out = new Float32Array(S * S);
  for (let y = 0; y < S; y++) {
    const gy = (y / S) * g;
    const y0 = Math.floor(gy) % g;
    const y1 = (y0 + 1) % g;
    const fy = gy - Math.floor(gy);
    for (let x = 0; x < S; x++) {
      const gx = (x / S) * g;
      const x0 = Math.floor(gx) % g;
      const x1 = (x0 + 1) % g;
      const fx = gx - Math.floor(gx);
      const v00 = grid[y0 * g + x0];
      const v10 = grid[y0 * g + x1];
      const v01 = grid[y1 * g + x0];
      const v11 = grid[y1 * g + x1];
      const top = v00 + (v10 - v00) * fx;
      const bot = v01 + (v11 - v01) * fx;
      out[y * S + x] = top + (bot - top) * fy;
    }
  }
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < out.length; i++) {
    if (out[i] < min) min = out[i];
    if (out[i] > max) max = out[i];
  }
  const span = max - min || 1;
  for (let i = 0; i < out.length; i++) out[i] = (out[i] - min) / span;
  return out;
}

function fbm(seed, sizesAmps) {
  const rand = mulberry32(seed);
  const out = new Float32Array(S * S);
  for (const [g, amp] of sizesAmps) {
    const oct = octave(rand, g);
    for (let i = 0; i < out.length; i++) out[i] += amp * (oct[i] - 0.5);
  }
  return out;
}

function boxBlur(src, passes) {
  let cur = Float32Array.from(src);
  const tmp = new Float32Array(S * S);
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = (y + dy + S) % S;
          for (let dx = -1; dx <= 1; dx++) {
            sum += cur[yy * S + ((x + dx + S) % S)];
          }
        }
        tmp[y * S + x] = sum / 9;
      }
    }
    cur.set(tmp);
  }
  return cur;
}

function makeTexture(base, warm) {
  const rand = mulberry32(7);
  const lum = fbm(7, [
    [4, 24],
    [8, 17],
    [16, 12],
    [32, 8],
    [64, 6],
    [128, 3.5],
  ]);
  const warmMap = warm
    ? fbm(12, [
        [4, 1],
        [8, 0.6],
      ])
    : null;

  // Hammer-dent bump map: soft radial stamps on a mid-gray field.
  const bump = new Float32Array(S * S).fill(128);
  for (let n = 0; n < 560; n++) {
    const cx = rand() * S;
    const cy = rand() * S;
    const rad = 3 + rand() * 8;
    const v = 20 + rand() * 145;
    const r = Math.ceil(rad);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const d = Math.sqrt(dx * dx + dy * dy) / rad;
        if (d >= 1) continue;
        const fall = 0.5 + 0.5 * Math.cos(d * Math.PI);
        const x = ((Math.round(cx) + dx + S) % S) * 1;
        const y = ((Math.round(cy) + dy + S) % S) * 1;
        const idx = y * S + x;
        bump[idx] += (v - 128) * fall;
      }
    }
  }
  const soft = boxBlur(bump, 3);
  // Directional shading: light from the upper left.
  const shade = new Float32Array(S * S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const xp = (x + 2) % S;
      const xm = (x - 2 + S) % S;
      const yp = (y + 2) % S;
      const ym = (y - 2 + S) % S;
      shade[y * S + x] =
        (soft[y * S + xp] + soft[yp * S + x] - soft[y * S + xm] - soft[ym * S + x]) * 0.3;
    }
  }

  const rgb = new Float32Array(S * S * 3);
  for (let i = 0; i < S * S; i++) {
    const w = warmMap ? warmMap[i] : 0;
    rgb[i * 3] = base[0] + lum[i] + shade[i] + w * 9;
    rgb[i * 3 + 1] = base[1] + lum[i] + shade[i] + w * 2;
    rgb[i * 3 + 2] = base[2] + lum[i] + shade[i] - w * 5;
  }

  // Faint scratches.
  for (let n = 0; n < 84; n++) {
    const x0 = rand() * S;
    const y0 = rand() * S;
    const len = 8 + rand() * 32;
    const ang = rand() * Math.PI * 2;
    const light = rand() > 0.5;
    const amp = (light ? 1 : -1) * (18 + rand() * 24);
    const steps = Math.ceil(len);
    for (let sIdx = 0; sIdx <= steps; sIdx++) {
      const x = Math.round(x0 + Math.cos(ang) * sIdx + S) % S;
      const y = Math.round(y0 + Math.sin(ang) * sIdx + S) % S;
      const idx = (y * S + x) * 3;
      rgb[idx] += amp;
      rgb[idx + 1] += amp;
      rgb[idx + 2] += amp;
    }
  }
  // Sharp speckles.
  for (let n = 0; n < 2600; n++) {
    const i = Math.floor(rand() * S * S) * 3;
    const amp = rand() > 0.5 ? -58 : 44;
    rgb[i] += amp;
    rgb[i + 1] += amp;
    rgb[i + 2] += amp;
  }
  // Fine grain.
  for (let i = 0; i < rgb.length; i++) {
    rgb[i] += (rand() - 0.5) * 26;
  }

  const buf = Buffer.alloc(S * S * 3);
  for (let i = 0; i < rgb.length; i++) {
    buf[i] = Math.max(0, Math.min(255, Math.round(rgb[i])));
  }
  return buf;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const jobs = [
    ["frame-iron-dark.webp", [35, 37, 40], true],
    ["frame-iron-light.webp", [212, 212, 206], false],
  ];
  for (const [name, base, warm] of jobs) {
    const raw = makeTexture(base, warm);
    const out = path.join(OUT_DIR, name);
    await sharp(raw, { raw: { width: S, height: S, channels: 3 } })
      .webp({ quality: 82 })
      .toFile(out);
    console.log(name, fs.statSync(out).size, "bytes");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
