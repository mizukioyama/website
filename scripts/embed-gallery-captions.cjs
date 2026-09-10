const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const captionSourcePath = path.join(root, 'js', 'gallery-captions-data.js');
const generatedArtworkPath = path.join(root, 'docs', 'js', 'page-nation.js');

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
  const lines = source.split(/\r?\n/);
  let currentTitle = null;
  let replaced = 0;

  const titlePattern = /title:\s*\{\s*ja:\s*"((?:\\.|[^"\\])*)",\s*en:\s*"((?:\\.|[^"\\])*)"\s*\}/;
  const placeholderPattern = /^(\s*)text:\s*\{\s*ja:\s*"準備中\.\.\.",\s*en:\s*"Preparing…"\s*\},?\s*$/;

  for (let i = 0; i < lines.length; i += 1) {
    const titleMatch = lines[i].match(titlePattern);
    if (titleMatch) {
      currentTitle = decodeJsString(titleMatch[1]);
    }

    const placeholderMatch = lines[i].match(placeholderPattern);
    if (!placeholderMatch || !currentTitle) continue;

    const caption = captionMap.get(currentTitle);
    if (!caption) continue;

    const comma = lines[i].trimEnd().endsWith(',') ? ',' : '';
    lines[i] = `${placeholderMatch[1]}text: { ja: ${JSON.stringify(caption.ja)}, en: ${JSON.stringify(caption.en)} }${comma}`;
    replaced += 1;
  }

  return { content: lines.join('\n'), replaced };
}

if (!fs.existsSync(captionSourcePath)) {
  throw new Error(`Caption data not found: ${captionSourcePath}`);
}

if (!fs.existsSync(generatedArtworkPath)) {
  throw new Error(`Generated artwork data not found: ${generatedArtworkPath}`);
}

const captionMap = readCaptionMap(fs.readFileSync(captionSourcePath, 'utf8'));
if (captionMap.size === 0) {
  throw new Error('No gallery captions could be parsed.');
}

const original = fs.readFileSync(generatedArtworkPath, 'utf8');
const result = embedCaptions(original, captionMap);

if (result.replaced === 0 && original.includes('準備中...')) {
  throw new Error('Gallery caption embedding replaced 0 placeholders.');
}

fs.writeFileSync(generatedArtworkPath, result.content, 'utf8');

const remaining = (result.content.match(/準備中\.\.\./g) || []).length;
console.log(`Embedded ${result.replaced} gallery captions into docs/js/page-nation.js.`);
console.log(`Remaining placeholders: ${remaining}.`);

if (remaining > 0) {
  throw new Error(`Gallery still contains ${remaining} "準備中..." placeholders.`);
}
