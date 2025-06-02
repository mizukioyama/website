    $(function() {
        // 初期化
    var $ripplesContainer = $('div.ripples-2');
    $ripplesContainer.ripples({
    //解像度
        resolution: 512,
    //半径指定
        dropRadius: 20,
    //乱れ
        perturbance: 0.5,
    });
    
        // マウス移動イベントで波紋を発生させる
        $(document).on('mousemove', function(event) {
        // マウスの位置を取得
        var x = event.clientX;
        var y = event.clientY;
    
        // 発生させる波紋のパラメータ
        var dropRadius = 10;
        var strength = 0.1;
    
        // マウスの位置で波紋を発生させる
        $ripplesContainer.ripples('drop', x, y, dropRadius, strength);
        });
    
        // 自動的にランダムな位置で波紋を発生させる関数
        function triggerRandomDrop() {
        var x = Math.random() * $ripplesContainer.outerWidth();
        var y = Math.random() * $ripplesContainer.outerHeight();
        var dropRadius = 20;
        var strength = 0.1 + Math.random() * 0.1;
    
        $ripplesContainer.ripples('drop', x, y, dropRadius, strength);
    
        // 次の波紋を発生させるまでのランダムな待ち時間
        var minInterval = 250; // 最小待ち時間（ミリ秒）
        var maxInterval = 100; // 最大待ち時間（ミリ秒）
        var nextInterval = Math.floor(Math.random() * (maxInterval - minInterval + 0.5) + minInterval);
    
        // 次の波紋を発生させる
        setTimeout(triggerRandomDrop, nextInterval);
        }
    
        // 初期状態で波紋を発生させる
        triggerRandomDrop();
    });
    