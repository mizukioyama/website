// タイピング
$(window).on('load', function() {
	$(".typing").each(function() {
		 var text = $(this).text();
		 var textbox = "";
		 var words = text.split(' ');

		 for (var i = 0; i < words.length; i++) {
			  var word = words[i];
			  for (var j = 0; j < word.length; j++) {
					textbox += '<span>' + word[j] + '</span>';
			  }
			  if (i < words.length - 1) {
					textbox += '<span>&nbsp;</span>';
			  }
		 }
		 $(this).html(textbox);

		 $(".typing span").each(function(i) {
			  var time = 100;
			  $(this).delay(time * i).fadeIn(time);
		 });

		 if (!$(this).hasClass('menu-animation-target')) {
			  var positionX = Math.random() * ($(this).parent().width() - $(this).width());
			  var positionY = Math.random() * ($(this).parent().height() - $(this).height());
			  $(this).css({ 'left': positionX, 'top': positionY });
		 }

		 if ($(this).hasClass('animation1')) {
			  $(this).addClass('animation1-style');
		 } else if ($(this).hasClass('animation2')) {
			  $(this).addClass('animation2-style');
		 }
	});
});
