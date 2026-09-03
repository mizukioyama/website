$(function () {
    // 波紋コンテナ
    var $ripplesContainer = $('div.ripples');

    $ripplesContainer.ripples({
        resolution: 512,
        dropRadius: 20,
        perturbance: 0.5,
    });

    /* ----------------------------------
       ★ ランダム波の最大数を制限する設定
    ---------------------------------- */
    let maxRandomDrops = 50; // ← 好きな数に変更（30〜100）
    let currentRandomDrops = 0;

    /* ----------------------------------
       ★ マウスの波紋（常時許可）
       → 波の大きさも自動調整（ゆっくり動くと小さく）
    ---------------------------------- */
    let lastX = 0;
    let lastY = 0;

    $(document).on('mousemove', function (event) {
        var x = event.clientX;
        var y = event.clientY;

        // マウス移動速度から波サイズを決定
        var dx = x - lastX;
        var dy = y - lastY;
        var speed = Math.sqrt(dx * dx + dy * dy);

        var dropRadius = 5 + Math.min(speed / 4, 30); // 自動調整された波の大きさ
        var strength = 0.05 + Math.min(speed / 500, 0.15);

        $ripplesContainer.ripples("drop", x, y, dropRadius, strength);

        lastX = x;
        lastY = y;
    });

    /* ----------------------------------
       ★ ランダム波の発生（最大数を超えたら停止）
       → 波の大きさも自動調整（小〜大）
    ---------------------------------- */
    function triggerRandomDrop() {

        // 最大数を超えたらランダム波はこれ以上出さない
        if (currentRandomDrops >= maxRandomDrops) return;

        currentRandomDrops++;

        var x = Math.random() * $ripplesContainer.outerWidth();
        var y = Math.random() * $ripplesContainer.outerHeight();

        // 波の大きさを自動調整
        var dropRadius = 10 + Math.random() * 30; // 10〜40px
        var strength = 0.08 + Math.random() * 0.15;

        $ripplesContainer.ripples("drop", x, y, dropRadius, strength);

        // ランダム間隔
        var minInterval = 220;
        var maxInterval = 400;
        var nextInterval = Math.floor(
            Math.random() * (maxInterval - minInterval + 1) + minInterval
        );

        setTimeout(triggerRandomDrop, nextInterval);
    }

    // ランダム波スタート
    triggerRandomDrop();
});
