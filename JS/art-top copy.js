// jQueryがロードされるまで待機する
function waitForJQuery(callback) {
    if (window.jQuery) {
        callback(jQuery);
    } else {
        setTimeout(function () {
            waitForJQuery(callback);
        }, 50);
    }
}

// jQueryがロードされた後に実行する関数
waitForJQuery(function ($) {
    $(document).ready(function () {
        const toggleContent = (index) => {
            $('.toggle-content').removeClass('active');
            $('.toggle-content').eq(index * 2).addClass('active');
            $('.toggle-content').eq(index * 2 + 1).addClass('active');
        };

        // リンクに.activeクラスを追加し、対応するコンテンツを表示する
        $('.head a').each(function() {
            $(this).on('click', function(event) {
                event.preventDefault(); // リンクのデフォルト動作をキャンセル
                $('.head a').removeClass('active');
                $(this).addClass('active');
                
                const index = $(this).data('index') - 1;
                toggleContent(index);
            });
        });

        // 初期表示
        toggleContent(0);

        // パリの時刻を更新する関数
        function updateParisTime() {
            var now = new Date();
            var utc = now.getTime() + (now.getTimezoneOffset() * 60000); // Corrected to 60000 (milliseconds)
            var parisTime = new Date(utc + (3600000 * 2)); // UTC+2（夏時間）またはUTC+1（冬時間）を調整

            var hours = parisTime.getHours().toString().padStart(2, '0');
            var minutes = parisTime.getMinutes().toString().padStart(2, '0');
            var seconds = parisTime.getSeconds().toString().padStart(2, '0');

            $('#paris-time').text(`${hours}:${minutes}:${seconds}`);
        }

        function updateTokyoTime() {
            var now = new Date();
            var utc = now.getTime() + (now.getTimezoneOffset() * 60000); // Corrected to 60000 (milliseconds)
            var tokyoTime = new Date(utc + (3600000 * 9)); // UTC+9

            var hours = tokyoTime.getHours().toString().padStart(2, '0');
            var minutes = tokyoTime.getMinutes().toString().padStart(2, '0');
            var seconds = tokyoTime.getSeconds().toString().padStart(2, '0');

            $('#tokyo-time').text(`${hours}:${minutes}:${seconds}`);
        }

        setInterval(updateParisTime, 1000);
        setInterval(updateTokyoTime, 1000);
        updateParisTime();
        updateTokyoTime();
    });
});
