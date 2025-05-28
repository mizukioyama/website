document.addEventListener('DOMContentLoaded', (event) => {
    const boxes = [
        { element: document.getElementById('imgbox-01'), params: { top: 52, width: 150, speed: 2 } },
        { element: document.getElementById('imgbox-02'), params: { top: 38, width: 300, speed: 3.5 } },
        { element: document.getElementById('imgbox-03'), params: { top: 55, width: 130, speed: 1.5 } },
        { element: document.getElementById('imgbox-04'), params: { top: 22, width: 180, speed: 7 } },
        { element: document.getElementById('imgbox-05'), params: { top: 48, width: 250, speed: 2.5 } },
        { element: document.getElementById('imgbox-06'), params: { top: 15, width: 220, speed: 4.5 } },
        { element: document.getElementById('imgbox-07'), params: { top: 12, width: 50, speed: 3 } },
        { element: document.getElementById('imgbox-08'), params: { top: 64, width: 150, speed: 0.5 } },
        { element: document.getElementById('imgbox-09'), params: { top: 20, width: 95, speed: 2 } }
    ];

    let wheelDelta = 0;

    window.addEventListener('wheel', (event) => {
        wheelDelta += event.deltaY;
        moveBoxes();
    });

    function moveBoxes() {
        const moveAmount = wheelDelta / -20;

        boxes.forEach(({ element, params }) => {
            moveBox(element, params, moveAmount);
        });
    }

    function moveBox(box, params, moveAmount) {
        const adjustedMoveAmount = moveAmount * params.speed;
    // 拡大後の縮小
        if (adjustedMoveAmount > 0) {
            box.style.top = `${params.top}%`;
            box.style.width = `${params.width}px`;
            box.style.transform = `translate(-50%, -50%) scale(1) translateY(${adjustedMoveAmount}px)`;
        } else {
        // 縮小調整
            const newWidth = params.width + Math.abs(adjustedMoveAmount);
            box.style.top = `${params.top}%`;
            box.style.width = `${newWidth}px`;
            box.style.transform = `translate(-50%, -50%) scale(1) translateY(${adjustedMoveAmount}px)`;
        }
    }
});