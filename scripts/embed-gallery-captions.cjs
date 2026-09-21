const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const captionSourcePath = path.join(root, 'js', 'gallery-captions-data.js');
const runtimeHelperPath = path.join(root, 'js', 'gallery-captions.js');
const generatedArtworkPath = path.join(root, 'docs', 'js', 'page-nation.js');
const generatedRuntimeHelperPath = path.join(root, 'docs', 'js', 'gallery-captions.js');
const generatedGalleryPath = path.join(root, 'docs', 'gallery.html');
const generatedDocsPath = path.join(root, 'docs');

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

function listHtmlFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(absolutePath);
    return entry.name.toLowerCase().endsWith('.html') ? [absolutePath] : [];
  });
}

function contentHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
}

function resolveGeneratedAsset(htmlPath, assetUrl) {
  if (
    !assetUrl ||
    /^(?:[a-z]+:)?\/\//i.test(assetUrl) ||
    /^(?:data:|mailto:|tel:|#)/i.test(assetUrl)
  ) {
    return null;
  }

  const cleanUrl = assetUrl.split(/[?#]/, 1)[0];
  if (!/\.(?:css|js)$/i.test(cleanUrl)) return null;

  if (cleanUrl.startsWith('/website/')) {
    return path.join(generatedDocsPath, cleanUrl.slice('/website/'.length));
  }

  if (cleanUrl.startsWith('/')) return null;
  return path.resolve(path.dirname(htmlPath), cleanUrl);
}

function versionGeneratedAssets(htmlPath, html) {
  return html.replace(
    /(href|src)=(["'])([^"']+\.(?:css|js))(?:\?[^"']*)?\2/gi,
    (full, attribute, quote, assetUrl) => {
      const assetPath = resolveGeneratedAsset(htmlPath, assetUrl);
      if (!assetPath || !fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
        return full;
      }

      const cleanUrl = assetUrl.split(/[?#]/, 1)[0];
      return attribute + '=' + quote + cleanUrl + '?v=' + contentHash(assetPath) + quote;
    }
  );
}

// Version every local generated CSS/JS reference from file contents.
// Repeated builds of unchanged sources now produce identical docs/ output.
if (fs.existsSync(generatedDocsPath)) {
  for (const htmlPath of listHtmlFiles(generatedDocsPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const updated = versionGeneratedAssets(htmlPath, html)
      .replace(/Nature inspire/g, 'NatureInspire')
      .replace(/Nature Inspire/g, 'NatureInspire');

    if (updated !== html) fs.writeFileSync(htmlPath, updated, 'utf8');
  }
}
const remaining = (result.content.match(/準備中\.\.\./g) || []).length;
console.log(`Embedded ${result.replaced} gallery captions into docs/js/page-nation.js.`);
console.log('Copied js/gallery-captions.js into docs/js/gallery-captions.js.');
console.log('Versioned local generated CSS/JS references from content hashes.');
console.log('Standardized NatureInspire across generated HTML.');
console.log(`Remaining placeholders: ${remaining}.`);

if (remaining > 0) throw new Error(`Gallery still contains ${remaining} "準備中..." placeholders.`);
