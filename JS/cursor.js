jQuery.noConflict();

(function ($) {
    $(function () {
        var stalker = $("#stalker");

        $("a").hover(
            function () {
                stalker.addClass('stalker--hover');
            },
            function () {
                stalker.removeClass('stalker--hover');
            }
        );

        stalker.css("opacity", "0");

        $(document).on("mousemove", function (e) {
            var x = e.clientX;
            var y = e.clientY;
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
