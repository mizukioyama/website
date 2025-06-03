    // Canvasに画像を描画
    const canvas = document.getElementById('artCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // ウォーターマーク追加（任意）
      ctx.font = '20px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('© YourName', canvas.width - 150, canvas.height - 20);
    };

    // 同じフォルダにある画像ファイル名を指定
    img.src = './img/20230629.jpg'; // 同じリポジトリ内にアップしてある画像名

    // カスタム右クリックメニュー
    const customMenu = document.getElementById('custom-context-menu');

    document.body.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      customMenu.style.left = `${e.clientX}px`;
      customMenu.style.top = `${e.clientY}px`;
      customMenu.style.display = 'block';
    });

    document.addEventListener('click', () => {
      customMenu.style.display = 'none';
    });

    // 特定キー押下時に作品非表示（抑止）
    window.addEventListener('keydown', (e) => {
      if ([16, 44, 91, 92].includes(e.keyCode)) {
        canvas.style.visibility = 'hidden';
      }
    });
    window.addEventListener('keyup', () => {
      canvas.style.visibility = 'visible';
    });