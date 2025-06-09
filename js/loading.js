
// =======================
// タイピング初期化
// =======================
function initializeTyping() {
  const lines = document.querySelectorAll('.typing-line');
  const typingSpeed = 50;

  function typeLine(lineEl, text, callback) {
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        lineEl.textContent += text[i++];
        setTimeout(typeChar, typingSpeed);
      } else {
        callback();
      }
    }
    typeChar();
  }

  function typeAllLines(index = 0) {
    if (index >= lines.length) {
      setTimeout(() => {
        const loadingBg = document.getElementById('loading-bg');
        if (loadingBg) {
          loadingBg.style.transition = 'opacity 0.8s';
          loadingBg.style.opacity = 0;
          setTimeout(() => {
            loadingBg.style.display = 'none';
          }, 1000);
        }
      }, 800);
      return;
    }

    const line = lines[index];
    const text = line.dataset.text;
    typeLine(line, text, () => typeAllLines(index + 1));
  }

  if (lines.length > 0) {
    typeAllLines();
  }
}