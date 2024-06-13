jQuery(document).ready(function($) {
	// ページの読み込み後にローディング背景を非表示にする
	$(window).on('load', function() {
		 setTimeout(function() {
			  $('#loading-bg').fadeOut();
		 }, 1500);
	});

	// テキストのアニメーション効果を実装する関数
	function TypingAnimation() {
		 $(".js_typing").each(function(i) {
			  var elemPos = $(this).offset().top - 50; // 要素より、50px上の位置
			  var scroll = $(window).scrollTop();
			  var windowHeight = $(window).height();
			  if (scroll >= elemPos - windowHeight) {
					if (!$(this).hasClass("endAnime")) {
						 $(this).addClass("endAnime"); // アニメーションが終了したことを示すクラスを追加
						 var text = $(this).text(); // テキストを取得
						 $(this).text(''); // テキストを空にする
						 var shuffleText = new ShuffleText(this); // ShuffleTextのインスタンスを生成
						 $(this).append(shuffleText); // ShuffleTextを要素に追加
						 shuffleText.setText(text); // テキストを設定
						 shuffleText.start(); // アニメーションを開始
					}
			  }
		 });
	}

	// 画面をスクロールしたときのイベント
	$(window).scroll(function() {
		 TypingAnimation(); // テキストのアニメーション効果を実行
	});

	// ページが読み込まれたときのイベント
	$(window).on("load", function() {
		 TypingAnimation(); // テキストのアニメーション効果を実行
	});
});
