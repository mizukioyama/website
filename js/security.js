// 作品保護 右クリック時に表示するカスタムメニューの要素を作成
			var customContextMenu = document.createElement('div');
			customContextMenu.id = 'custom-context-menu';
			customContextMenu.style.position = 'fixed';
			customContextMenu.style.text = '#fff';
			customContextMenu.style.backgroundColor = 'rgba(255,255,255,0.6)';
			customContextMenu.style.padding = '10px';
			customContextMenu.style.display = 'none'; // 初期状態では非表示
			customContextMenu.style.zIndex = '1000'; // 追加: z-index を指定

			// カスタムメニューに項目を追加
			var menuItem1 = document.createElement('div');
			menuItem1.textContent = 'Nothing happens when I click.';
			menuItem1.addEventListener('click', function () {
				// メニュー項目1のクリック時の処理
				// ここに任意のコードを追加
			});
			customContextMenu.appendChild(menuItem1);
			//menu2
			var menuItem2 = document.createElement('div');
			menuItem2.textContent = 'Saving images is not permitted.';
			menuItem2.addEventListener('click', function () {
				// メニュー項目2のクリック時の処理
				// ここに任意のコードを追加
			});
			customContextMenu.appendChild(menuItem2);

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

			jQuery(document).ready(function ($) {
				// キーを押したとき
				$(window).on('keydown', function (e) {
					var keyCode = e.keyCode;

					if (keyCode == 16 || keyCode == 44 || keyCode == 91 || keyCode == 92) {
						$('img').hide();
						return false;
					}
				});

				// キーを離したとき
				$(window).on('keyup', function () {
					$('img').show();
				});
			});