(() => {
  const DATA_URL = new URL('js/gallery-captions-data.js?v=20260910-2', document.baseURI).href;
  const titleMap = new Map();
  let ready = false;

  function ensureCategoryGlassOverlay() {
    if (!window.matchMedia('(max-width: 599px)').matches) return;

    const gallery = document.querySelector('main.gallery');
    const galleryContent = document.querySelector('.gallery-containt');
    const categoryMenu = document.getElementById('category-menu');
    const categoryHeader = document.getElementById('category-header');
    const sidebar = document.getElementById('sidebar-container');
    if (!gallery || !categoryMenu || !categoryHeader || !sidebar) return;

    // Keep the visible toggle label in the real DOM so it cannot disappear
    // when pseudo-element masks or browser-specific text clipping change.
    categoryHeader.textContent = '・Category';
    categoryHeader.setAttribute('aria-label', 'Category');

    let overlay = document.getElementById('category-glass-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'category-glass-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      gallery.insertBefore(overlay, gallery.firstChild);
    }

    Object.assign(overlay.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '2999',
      opacity: '0',
      visibility: 'hidden',
      pointerEvents: 'none',
      background: 'linear-gradient(135deg, rgba(190,220,220,0.16), rgba(18,38,40,0.30) 42%, rgba(4,12,14,0.42))',
      backdropFilter: 'blur(18px) saturate(135%) contrast(104%)',
      WebkitBackdropFilter: 'blur(18px) saturate(135%) contrast(104%)',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
      transition: 'opacity 0.28s ease, visibility 0.28s ease'
    });

    Object.assign(categoryHeader.style, {
      background: 'linear-gradient(135deg, rgba(220,235,235,0.16), rgba(30,55,58,0.30))',
      backdropFilter: 'blur(18px) saturate(135%)',
      WebkitBackdropFilter: 'blur(18px) saturate(135%)',
      border: '1px solid rgba(255,255,255,0.16)',
      borderRadius: '0',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 24px rgba(0,0,0,0.26)',
      paddingLeft: '0',
      paddingRight: '1.2rem'
    });

    Object.assign(categoryMenu.style, {
      background: 'linear-gradient(145deg, rgba(210,230,230,0.12), rgba(18,36,38,0.50) 48%, rgba(5,13,14,0.66))',
      backdropFilter: 'blur(24px) saturate(145%)',
      WebkitBackdropFilter: 'blur(24px) saturate(145%)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '0',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 18px 42px rgba(0,0,0,0.42)'
    });

    const syncOverlay = () => {
      const isOpen = categoryMenu.classList.contains('mobile-open');
      overlay.style.opacity = isOpen ? '1' : '0';
      overlay.style.visibility = isOpen ? 'visible' : 'hidden';
      overlay.style.pointerEvents = isOpen ? 'auto' : 'none';
      overlay.setAttribute('aria-hidden', String(!isOpen));
      if (galleryContent) galleryContent.style.pointerEvents = isOpen ? 'none' : '';
      gallery.classList.toggle('category-glass-open', isOpen);
      categoryHeader.style.background = isOpen
        ? 'linear-gradient(135deg, rgba(225,240,240,0.22), rgba(40,70,72,0.38))'
        : 'linear-gradient(135deg, rgba(220,235,235,0.16), rgba(30,55,58,0.30))';
    };

    if (overlay.dataset.categoryOverlayBound !== 'true') {
      overlay.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        categoryMenu.classList.remove('mobile-open');
        categoryHeader.setAttribute('aria-expanded', 'false');
        syncOverlay();
      });
      const observer = new MutationObserver(syncOverlay);
      observer.observe(categoryMenu, { attributes: true, attributeFilter: ['class'] });
      overlay.dataset.categoryOverlayBound = 'true';
    }
    syncOverlay();
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureCategoryGlassOverlay();
    setTimeout(ensureCategoryGlassOverlay, 0);
    setTimeout(ensureCategoryGlassOverlay, 250);
  });
  document.addEventListener('site:sidebar-ready', ensureCategoryGlassOverlay);

  function decodeJsString(value) {
    try {
      return JSON.parse('"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"')
        .replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t')
        .replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    } catch (_error) {
      return value.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
    }
  }

  function parseCaptionSource(source) {
    const pattern = /jaTitle:\s*"((?:\\.|[^"\\])*)",\s*enTitle:\s*"((?:\\.|[^"\\])*)",\s*ja:\s*"((?:\\.|[^"\\])*)",\s*en:\s*"((?:\\.|[^"\\])*)"/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const item = { jaTitle: decodeJsString(match[1]), enTitle: decodeJsString(match[2]), ja: decodeJsString(match[3]), en: decodeJsString(match[4]) };
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
    if (nextCaption && captionEl.innerHTML !== nextCaption) captionEl.innerHTML = nextCaption;
  }

  function bindRuntimePatch() {
    const modalBox = document.getElementById('modalBox');
    if (modalBox) {
      const observer = new MutationObserver(() => queueMicrotask(applyCaption));
      observer.observe(modalBox, { childList: true, subtree: true, characterData: true });
    }
    document.addEventListener('click', event => {
      if (event.target && event.target.closest('.view-policy-button')) {
        requestAnimationFrame(applyCaption); setTimeout(applyCaption, 50); setTimeout(applyCaption, 250);
      }
    });
    document.addEventListener('change', event => {
      if (event.target && event.target.matches('input[name="lang"]')) {
        requestAnimationFrame(applyCaption); setTimeout(applyCaption, 50);
      }
    });
    applyCaption();
  }

  fetch(DATA_URL, { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error(`Caption data request failed: ${response.status}`); return response.text(); })
    .then(source => { parseCaptionSource(source); bindRuntimePatch(); })
    .catch(error => console.error('Gallery captions could not be loaded.', error));
})();
