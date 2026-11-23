// Generate gallery grid thumbnails into docs/img/thumb/ at build
// time (800w WebP). The output directory is gitignored: the
// committed docs/ never contains the binaries, and the deploy
// workflow uploads the built docs/ directory as-is.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "js", "page-nation.js"), "utf8");
const refs = [...new Set([...source.matchAll(/img:\s*"(img\/[^"]+)"/g)].map((m) => m[1]))];
const outDir = path.join(root, "docs", "img", "thumb");
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  let total = 0;
  for (const ref of refs) {
    const src = path.join(root, ref);
    const base = path.basename(ref).replace(/\.[a-z0-9]+$/i, ".webp");
    const dest = path.join(outDir, base);
    await sharp(src)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(dest);
    total += fs.statSync(dest).size;
  }
  console.log(`generate-thumbs: ${refs.length} files, ${(total / 1048576).toFixed(2)}MB total`);
})().catch((error) => {
  console.error("generate-thumbs failed:", error.message);
  process.exit(1);
});
