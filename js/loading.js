document.addEventListener('DOMContentLoaded', () => {
  const lines = document.querySelectorAll('.typing-line');
  const typingSpeed = 50; // 文字表示間隔（ミリ秒）

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
        document.getElementById('loading-bg').style.transition = 'opacity 0.8s';
        document.getElementById('loading-bg').style.opacity = 0;
        setTimeout(() => {
          document.getElementById('loading-bg').style.display = 'none';
        }, 800);
      }, 600); // 最後の行の後に少し待つ
      return;
    }

    const line = lines[index];
    const text = line.dataset.text;
    typeLine(line, text, () => typeAllLines(index + 1));
  }

  typeAllLines();
});
