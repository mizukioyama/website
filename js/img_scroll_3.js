document.addEventListener('DOMContentLoaded', (event) => {
    const box_07 = document.getElementById('imgbox-07');
    const box_08 = document.getElementById('imgbox-08');
    const box_09 = document.getElementById('imgbox-09');

    let wheelDelta = 0;

    window.addEventListener('wheel', (event) => {
        wheelDelta += event.deltaY;
        moveBoxes();
    });

    function moveBoxes() {
        const moveAmount = wheelDelta / -20;

        // パラメータを変数に設定
        const params_07 = { top: 12, width: 50, speed: 3 };
        const params_08 = { top: 64, width: 150, speed: .5 };
        const params_09 = { top: 20, width: 95, speed: 2 };

        moveBox(box_07, params_07, moveAmount);
        moveBox(box_08, params_08, moveAmount);
        moveBox(box_09, params_09, moveAmount);
    }

    function moveBox(box, params, moveAmount) {
        const adjustedMoveAmount = moveAmount * params.speed;

        // 要素が拡大した後に縮小するように変更
        if (adjustedMoveAmount > 0) {
            box.style.top = `${params.top}%`;
            box.style.width = `${params.width}px`;
            box.style.transform = `translate(0%, -20%) scale(1) translateY(${adjustedMoveAmount}px)`;
        } else {
            // 縮小時の調整はここで行います
            const newWidth = params.width + Math.abs(adjustedMoveAmount);
            box.style.top = `${params.top}%`;
            box.style.width = `${newWidth}px`;
            box.style.transform = `translate(0%, -30%) scale(1) translateY(${adjustedMoveAmount}px)`;
        }
    }
});