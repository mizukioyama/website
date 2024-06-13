jQuery.noConflict();

(function ($) {
    $(function () {
        var cursor = $("#cursor");
        var stalker = $("#stalker");

        $("a").hover(
            function () {
                cursor.addClass('cursor--hover');
                stalker.addClass('stalker--hover');
            },
            function () {
                cursor.removeClass('cursor--hover');
                stalker.removeClass('stalker--hover');
            }
        );

        stalker.css("opacity", "0");

        $(document).on("mousemove", function (e) {
            var x = e.clientX;
            var y = e.clientY;

            cursor.css({
                "opacity": "1",
                "top": y + "px",
                "left": x + "px"
            });

            setTimeout(function () {
                stalker.css({
                    "opacity": "1",
                    "top": y + "px",
                    "left": x + "px"
                });
            }, 180);
        });
    });
})(jQuery);