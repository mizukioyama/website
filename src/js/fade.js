document.addEventListener("DOMContentLoaded", function () {
   function fadeInOnScroll() {
      const fadeElements = document.querySelectorAll(".fade_bottom");

      fadeElements.forEach(function (element) {
         const rect = element.getBoundingClientRect();
         const elementTop = rect.top; // 要素の上端位置
         const windowHeight = window.innerHeight;

         // トリガー位置（画面高さの 75%）
         const triggerPosition = windowHeight * 0.75;

         if (elementTop < triggerPosition) {
            element.classList.add("visible");
         }
      });
   }

   // スクロールイベント
   window.addEventListener("scroll", fadeInOnScroll);
   // ページ読み込み時
   fadeInOnScroll();
});
