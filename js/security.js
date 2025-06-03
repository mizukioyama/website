    // canvasに画像を描画（画像はGitHubにアップロードされたものを指定）
    const canvas = document.getElementById('artCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous"; // クロスオリジン対策（GitHub Pagesで不要なら省略）
    img.src = './img/230033-2.jpg'; // 同じリポジトリに置いた画像ファイル名

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // ウォーターマーク追加（任意）
      ctx.font = '20px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('© mizukioyama', canvas.width - 150, canvas.height - 20);
    };

    // 右クリック無効＋カスタムメニュー
    const customMenu = document.getElementById('custom-context-menu');

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      customMenu.style.left = `${e.clientX}px`;
      customMenu.style.top = `${e.clientY}px`;
      customMenu.style.display = 'block';
    });

    document.addEventListener('click', () => {
      customMenu.style.display = 'none';
    });

    // 特定キー押下で画像を非表示（簡易対策）
    window.addEventListener('keydown', (e) => {
      if ([16, 44, 91, 92].includes(e.keyCode)) {
        canvas.style.display = 'none';
      }
    });
    window.addEventListener('keyup', () => {
      canvas.style.display = 'block';
    });