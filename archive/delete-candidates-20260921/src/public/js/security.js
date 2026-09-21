    // 保存妨害：toDataURL 無効化
    if (typeof HTMLCanvasElement !== 'undefined') {
      HTMLCanvasElement.prototype.toDataURL = function () {
      alert("画像の保存は禁止されています。");
      return "";
      };
    }

    // Canvas に画像描画
    const canvas = document.getElementById('artCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const img = new Image();

      if (ctx) {
        img.onload = function () {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.font = '20px sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fillText('© YourName', canvas.width - 150, canvas.height - 20);
        };
        img.src = './img/20230629.jpg';
      }
    }

    // カスタム右クリックメニュー
    const customMenu = document.getElementById('custom-context-menu');
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (customMenu) {
        customMenu.style.left = `${e.clientX}px`;
        customMenu.style.top = `${e.clientY}px`;
        customMenu.style.display = 'block';
      }
    });

    document.addEventListener('click', () => {
      if (customMenu) customMenu.style.display = 'none';
    });

    // 特定キーで作品非表示
    window.addEventListener('keydown', (e) => {
      if (canvas && [16, 44, 91, 92].includes(e.keyCode)) {
        canvas.style.visibility = 'hidden';
      }
    });

    window.addEventListener('keyup', () => {
      if (canvas) canvas.style.visibility = 'visible';
    });

    // コピー操作禁止
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      alert("コピーは禁止されています。");
    });
