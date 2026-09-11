const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const captionSourcePath = path.join(root, 'js', 'gallery-captions-data.js');
const runtimeHelperPath = path.join(root, 'js', 'gallery-captions.js');
const generatedArtworkPath = path.join(root, 'docs', 'js', 'page-nation.js');
const generatedRuntimeHelperPath = path.join(root, 'docs', 'js', 'gallery-captions.js');
const generatedGalleryPath = path.join(root, 'docs', 'gallery.html');
const generatedDocsPath = path.join(root, 'docs');
const cacheToken = (process.env.GITHUB_SHA || String(Date.now())).slice(0, 12);

function decodeJsString(value) {
  try {
    return JSON.parse(`"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  } catch (_error) {
    return value
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  }
}

function readCaptionMap(source) {
  const map = new Map();
  const pattern = /jaTitle:\s*"((?:\\.|[^"\\])*)",\s*enTitle:\s*"((?:\\.|[^"\\])*)",\s*ja:\s*"((?:\\.|[^"\\])*)",\s*en:\s*"((?:\\.|[^"\\])*)"/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const item = {
      jaTitle: decodeJsString(match[1]),
      enTitle: decodeJsString(match[2]),
      ja: decodeJsString(match[3]),
      en: decodeJsString(match[4])
    };
    map.set(item.jaTitle, item);
    map.set(item.enTitle, item);
  }

  return map;
}

function embedCaptions(source, captionMap) {
  const titlePattern = /title\s*:\s*\{\s*ja\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*en\s*:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
  const placeholderPattern = /text\s*:\s*\{\s*ja\s*:\s*"準備中\.\.\."\s*,\s*en\s*:\s*"Preparing…"\s*\}/;
  const matches = [...source.matchAll(titlePattern)];

  let cursor = 0;
  let output = '';
  let replaced = 0;

  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : source.length;
    const before = source.slice(cursor, start);
    let segment = source.slice(start, end);

    const jaTitle = decodeJsString(matches[i][1]);
    const enTitle = decodeJsString(matches[i][2]);
    const caption = captionMap.get(jaTitle) || captionMap.get(enTitle);

    if (caption && placeholderPattern.test(segment)) {
      segment = segment.replace(
        placeholderPattern,
        `text: { ja: ${JSON.stringify(caption.ja)}, en: ${JSON.stringify(caption.en)} }`
      );
      replaced += 1;
    }

    output += before + segment;
    cursor = end;
  }

  if (cursor < source.length) output += source.slice(cursor);
  return { content: output, replaced };
}

if (!fs.existsSync(captionSourcePath)) throw new Error(`Caption data not found: ${captionSourcePath}`);
if (!fs.existsSync(runtimeHelperPath)) throw new Error(`Gallery runtime helper not found: ${runtimeHelperPath}`);
if (!fs.existsSync(generatedArtworkPath)) throw new Error(`Generated artwork data not found: ${generatedArtworkPath}`);

const captionMap = readCaptionMap(fs.readFileSync(captionSourcePath, 'utf8'));
if (captionMap.size === 0) throw new Error('No gallery captions could be parsed.');

const original = fs.readFileSync(generatedArtworkPath, 'utf8');
const result = embedCaptions(original, captionMap);
if (result.replaced === 0 && original.includes('準備中...')) throw new Error('Gallery caption embedding replaced 0 placeholders.');

fs.writeFileSync(generatedArtworkPath, result.content, 'utf8');
fs.copyFileSync(runtimeHelperPath, generatedRuntimeHelperPath);

// Cache-bust gallery-specific assets on every Pages build using the commit SHA.
if (fs.existsSync(generatedGalleryPath)) {
  let galleryHtml = fs.readFileSync(generatedGalleryPath, 'utf8');
  galleryHtml = galleryHtml.replace(
    /css\/mobile\.css(?:\?v=[^"']*)?/,
    `css/mobile.css?v=${cacheToken}`
  );
  galleryHtml = galleryHtml.replace(
    /js\/gallery-captions\.js(?:\?v=[^"']*)?/,
    `js/gallery-captions.js?v=${cacheToken}`
  );
  galleryHtml = galleryHtml.replace(
    /js\/menu\.js(?:\?v=[^"']*)?/,
    `js/menu.js?v=${cacheToken}`
  );
  fs.writeFileSync(generatedGalleryPath, galleryHtml, 'utf8');
}

// Version shared UI assets and normalize the official site name on every
// generated HTML page. The public brand spelling is always "NatureInspire".
if (fs.existsSync(generatedDocsPath)) {
  for (const fileName of fs.readdirSync(generatedDocsPath)) {
    if (!fileName.endsWith('.html')) continue;
    const htmlPath = path.join(generatedDocsPath, fileName);
    let html = fs.readFileSync(htmlPath, 'utf8');
    let updated = html.replace(
      /css\/menu\.css(?:\?v=[^"']*)?/g,
      `css/menu.css?v=${cacheToken}`
    );
    updated = updated.replace(
      /css\/form\.css(?:\?v=[^"']*)?/g,
      `css/form.css?v=${cacheToken}`
    );
    updated = updated.replace(
      /js\/form\.js(?:\?v=[^"']*)?/g,
      `js/form.js?v=${cacheToken}`
    );
    updated = updated
      .replace(/Nature inspire/g, 'NatureInspire')
      .replace(/Nature Inspire/g, 'NatureInspire');
    if (updated !== html) fs.writeFileSync(htmlPath, updated, 'utf8');
  }
}

const remaining = (result.content.match(/準備中\.\.\./g) || []).length;
console.log(`Embedded ${result.replaced} gallery captions into docs/js/page-nation.js.`);
console.log('Copied js/gallery-captions.js into docs/js/gallery-captions.js.');
console.log(`Updated gallery mobile asset cache versions in docs/gallery.html (${cacheToken}).`);
console.log(`Updated shared asset cache versions and standardized NatureInspire across generated HTML (${cacheToken}).`);
console.log(`Remaining placeholders: ${remaining}.`);

if (remaining > 0) throw new Error(`Gallery still contains ${remaining} "準備中..." placeholders.`);
