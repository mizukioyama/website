console.log("Hello, Webpack!");

// ページ判定
const page = document.body.dataset.page; // 例: <body data-page="contact"> のように設定

// 各ページ固有の処理
switch (page) {
   case "home":
      import("./style/home.css");
      import("./js/time.js");
      break;

   case "gallery":
      import("./style/gallery.css");
      import("./js/bg_wave.js");
      import("./js/page.js");
      break;

   case "contact":
      import("./js/bg_wave.js");
      import("./style/gallery.css");
      import("./style/form.css");
      import("./js/form.js");
      break;

   case "matching":
      import("./style/matching.css");
      import("./js/hearing.js");
      break;
}

/////////// all css

// audio icon
//import '@fortawesome/fontawesome-free/css/all.min.css';
// font
//import "./assets/fonts/fonts.css";

// Mobile all（共通適用）


// PC all
import "./style/footer.css";   // フッター
//import "./style/bot.css";    // ボット
import "./style/noise.css";    // ノイズ
import "./style/all.css";      // 全ページ共通
import "./style/menu.css";     // メニュー
//import "https://use.typekit.net/meg7mel.css";

// 共通 JavaScript
import "./js/security.js";
import "./js/chat.js"; // chat
import "./js/fade.js"; // fade
import "./js/google.js"; // google
import "./js/all.js"; // section
import "./js/cursor.js"; // cursor
import "./js/load.js"; // load
import "./js/side-foot.js"; // head foot

/////////// all images
import "./assets/images/pd-bg-img.jpg";
import "./assets/images/pd-body-bg.jpg";
import "./assets/images/230053-2.jpg";
import "./assets/images/sinju-suisai02.png";
// bg
import "./assets/images/text-gold.png";
import "./assets/images/text-bronze.png";
//mobile
import "./assets/images/mobile-main-second.png";

import "./assets/audio/tukinohikari.mp3";