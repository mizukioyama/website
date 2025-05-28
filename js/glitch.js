function toggleActiveClass() {
    const glitchLabel = document.getElementById('glitch_label');
    // ランダムな停止時間を生成（1.5秒から4.5秒の範囲）
    let stopTime = Math.floor(Math.random() * (6500 - 1500) + 1500);

    // アニメーションの停止
    glitchLabel.classList.add('is-active');
    setTimeout(() => {
        glitchLabel.classList.remove('is-active');
        // ランダムな再生までの待機時間（0.5秒から2.5秒の範囲）
        let playTime = Math.floor(Math.random() * 1000) + 500;
        // 再生
        setTimeout(toggleActiveClass, playTime);
    }, stopTime);
}

// 最初のアニメーションスタート
toggleActiveClass();
