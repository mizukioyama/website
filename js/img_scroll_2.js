document.addEventListener('DOMContentLoaded', (event) => {
    const box_04 = document.getElementById('imgbox-04');
    const box_05 = document.getElementById('imgbox-05');
    const box_06 = document.getElementById('imgbox-06');

    let wheelDelta = 0;

    window.addEventListener('wheel', (event) => {
        wheelDelta += event.deltaY;
        moveBoxes();
    });

    function moveBoxes() {
        const moveAmount = wheelDelta / 50;

        // パラメータを変数に設定
        const params_04 = { top: 22, width: 180, speed: 7 };
        const params_05 = { top: 48, width: 250, speed: 2.5 };
        const params_06 = { top: 15, width: 220, speed: 4.5 };

        moveBox(box_04, params_04, moveAmount);
        moveBox(box_05, params_05, moveAmount);
        moveBox(box_06, params_06, moveAmount);
    }

    function moveBox(box, params, moveAmount) {
        const adjustedMoveAmount = moveAmount * params.speed;

        // 要素が拡大した後に縮小するように変更
        if (adjustedMoveAmount > 0) {
            box.style.top = `${params.top}%`;
            box.style.width = `${params.width}px`;
            box.style.transform = `translate(0%, -50%) scale(1) translateY(${adjustedMoveAmount}px)`;
        } else {
            // 縮小時の調整はここで行います
            const newWidth = params.width + Math.abs(adjustedMoveAmount);
            box.style.top = `${params.top}%`;
            box.style.width = `${newWidth}px`;
            box.style.transform = `translate(0%, 30%) scale(1) translateY(${adjustedMoveAmount}px)`;
        }
    }
});