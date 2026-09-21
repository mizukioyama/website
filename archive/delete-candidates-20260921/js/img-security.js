document.addEventListener('DOMContentLoaded', function () {
    // 作品保護 右クリック時に表示するカスタムメニューの要素を作成
    var customContextMenu = document.createElement('div');
    customContextMenu.id = 'custom-context-menu';
    customContextMenu.style.position = 'fixed';
    customContextMenu.style.color = 'rgba( 255, 255, 255)';
    customContextMenu.style.backgroundColor = 'rgba(250, 250, 250, .1)';
    customContextMenu.style.padding = '10px';
    customContextMenu.style.display = 'none'; // 初期状態では非表示

    // カスタムメニューに項目を追加
    var menuItem1 = document.createElement('div');
    menuItem1.textContent = 'nothing happens';
    menuItem1.addEventListener('click', function () {
        // メニュー項目1のクリック時の処理
        // ここに任意のコードを追加
    });
    customContextMenu.appendChild(menuItem1);

    // カスタムメニューをbody要素に追加
    document.body.appendChild(customContextMenu);

    // 右クリック時のイベントハンドラ
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault(); // デフォルトの右クリックメニューを無効化

        // カスタムメニューを表示
        customContextMenu.style.display = 'block';
        customContextMenu.style.left = e.clientX + 'px';
        customContextMenu.style.top = e.clientY + 'px';
    });

    // ドキュメントのクリック時にカスタムメニューを非表示にするイベントハンドラ
    document.addEventListener('click', function (e) {
        // カスタムメニュー自体のクリックの場合は非表示にしない
        if (!customContextMenu.contains(e.target)) {
            customContextMenu.style.display = 'none';
        }
    });

    // キーを押したとき
    window.addEventListener('keydown', function (e) {
        var keyCode = e.keyCode;

        if (keyCode == 16 || keyCode == 44 || keyCode == 91 || keyCode == 92) {
            var images = document.querySelectorAll('img');
            images.forEach(function (img) {
                img.style.display = 'none';
            });
            return false;
        }
    });

    // キーを離したとき
    window.addEventListener('keyup', function () {
        var images = document.querySelectorAll('img');
        images.forEach(function (img) {
            img.style.display = 'block';
        });
    });
});
