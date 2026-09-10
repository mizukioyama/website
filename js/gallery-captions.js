(() => {
  const DATA_URL = new URL('js/gallery-captions-data.js?v=20260910-2', document.baseURI).href;
  const titleMap = new Map();
  let ready = false;

  function ensureCategoryGlassOverlay() {
    if (!window.matchMedia('(max-width: 599px)').matches) return;
    const gallery = document.querySelector('main.gallery');
    if (!gallery) return;

    let overlay = document.getElementById('category-glass-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'category-glass-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      gallery.appendChild(overlay);
    }

    if (overlay.dataset.categoryOverlayBound === 'true') return;
    overlay.addEventListener('click', () => {
      const categoryMenu = document.getElementById('category-menu');
      const categoryHeader = document.getElementById('category-header');
      categoryMenu?.classList.remove('mobile-open');
      categoryHeader?.setAttribute('aria-expanded', 'false');
    });
    overlay.dataset.categoryOverlayBound = 'true';
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureCategoryGlassOverlay();
    setTimeout(ensureCategoryGlassOverlay, 0);
  });
  document.addEventListener('site:sidebar-ready', ensureCategoryGlassOverlay);

  function decodeJsString(value) {
    try {
      return JSON.parse('"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"')
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

  function parseCaptionSource(source) {
    const pattern = /jaTitle:\s*"((?:\\.|[^"\\])*)",\s*enTitle:\s*"((?:\\.|[^"\\])*)",\s*ja:\s*"((?:\\.|[^"\\])*)",\s*en:\s*"((?:\\.|[^"\\])*)"/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const item = {
        jaTitle: decodeJsString(match[1]),
        enTitle: decodeJsString(match[2]),
        ja: decodeJsString(match[3]),
        en: decodeJsString(match[4])
      };
      titleMap.set(item.jaTitle, item);
      titleMap.set(item.enTitle, item);
    }
    ready = titleMap.size > 0;
  }

  function applyCaption() {
    if (!ready) return;
    const modalBox = document.getElementById('modalBox');
    if (!modalBox) return;
    const titleEl = modalBox.querySelector('.works h2');
    const captionEl = modalBox.querySelector('.modal-text p');
    if (!titleEl || !captionEl) return;

    const item = titleMap.get(titleEl.textContent.trim());
    if (!item) return;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ja';
    const nextCaption = item[lang];
    if (nextCaption && captionEl.innerHTML !== nextCaption) {
      captionEl.innerHTML = nextCaption;
    }
  }

  function bindRuntimePatch() {
    const modalBox = document.getElementById('modalBox');
    if (modalBox) {
      const observer = new MutationObserver(() => queueMicrotask(applyCaption));
      observer.observe(modalBox, { childList: true, subtree: true, characterData: true });
    }

    document.addEventListener('click', event => {
      if (event.target && event.target.closest('.view-policy-button')) {
        requestAnimationFrame(applyCaption);
        setTimeout(applyCaption, 50);
        setTimeout(applyCaption, 250);
      }
    });

    document.addEventListener('change', event => {
      if (event.target && event.target.matches('input[name="lang"]')) {
        requestAnimationFrame(applyCaption);
        setTimeout(applyCaption, 50);
      }
    });

    applyCaption();
  }

  fetch(DATA_URL, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`Caption data request failed: ${response.status}`);
      return response.text();
    })
    .then(source => {
      parseCaptionSource(source);
      bindRuntimePatch();
    })
    .catch(error => {
      console.error('Gallery captions could not be loaded.', error);
    });
})();
