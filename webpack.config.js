const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const webpack = require("webpack");

const cspPolicy = {
   'default-src': ["'self'"],
   'script-src': [
      "'self'",
      "https://code.jquery.com",
      "https://cdnjs.cloudflare.com",
      "https://cdn.jsdelivr.net"
   ],
   'style-src': [
      "'self'",
      "https://cdnjs.cloudflare.com",
      "https://fonts.googleapis.com",
      "https://use.typekit.net",
      "https://p.typekit.net",
      "https://unpkg.com",
      "https://cdn.jsdelivr.net"
   ],
   'font-src': [
      "'self'",
      "https://fonts.gstatic.com",
      "https://use.typekit.net",
      "https://cdnjs.cloudflare.com",
      "https://cdn.jsdelivr.net",
      "data:"
   ],
   'img-src': [
      "'self'",
      "data:",
      "https://mizukioyama.github.io/website/",
      // Some legacy gallery records use images hosted in the repository.
      // Keep the host explicitly allow-listed so CSP does not hide artwork
      // when those records are enabled again.
      "https://raw.githubusercontent.com"
   ],
   'connect-src': [
      "'self'",
      "https://mizukioyama.github.io",
      "https://script.google.com",
      "https://script.googleusercontent.com",
      "https://cdn.jsdelivr.net",
      "https://fonts.googleapis.com"
   ],
   'object-src': ["'none'"],
   'base-uri': ["'self'"],
   'form-action': ["'self'", "https://mizukioyama.github.io", "https://script.google.com"]
};

// csp-html-webpack-plugin serializes documents through Cheerio. Cheerio
// escapes operators such as `&&` and `=>` inside inline scripts, where HTML
// entities are not decoded by the browser's script parser. Restore only the
// script bodies after adding the CSP so the generated pages remain executable.
function restoreInlineScriptEntities(html) {
   const entities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">"
   };

   return html.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script\s*>)/gi, (_match, open, body, close) => {
      const decodedBody = body.replace(/&(?:amp|lt|gt);/g, entity => entities[entity]);
      return `${open}${decodedBody}${close}`;
   });
}

function processCsp(builtPolicy, htmlPluginData, $) {
   let metaTag = $('meta[http-equiv="Content-Security-Policy"]');

   if (!metaTag.length) {
      $('head').prepend('<meta http-equiv="Content-Security-Policy">');
      metaTag = $('meta[http-equiv="Content-Security-Policy"]');
   }

   metaTag.attr('content', builtPolicy);

   const serializedHtml = htmlPluginData.plugin.options.xhtml ? $.xml() : $.html();
   htmlPluginData.html = restoreInlineScriptEntities(serializedHtml);
}

const htmlPages = [
   "index",
   "artist-statement",
   "biography",
   "information",
   "gallery",
   "contact",
   "policy",
   "matching",
   "bot"
];

// These two pages are maintained as standalone legacy documents. The other
// pages use the verified backup templates together with the common Webpack
// bundle, matching the backup's generated output structure.
const backupPages = new Set([
   "artist-statement",
   "biography"
]);

module.exports = {
   mode: "production",
   devtool: "source-map",
   entry: {
      main: ["jquery", "./src/index.js"]
   },
   output: {
      path: path.resolve(__dirname, "docs"),
      filename: "js/main.js",
      clean: true,
      publicPath: "auto"
   },
   //resolve: {
   //   alias: {
   //      '@fortawesome': path.resolve(__dirname, 'node_modules/@fortawesome'),
   //      "@assets": path.resolve(__dirname, "src/assets")
   //   },
   //},
   module: {
      rules: [
         {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
         },
         {
            test: /\.js$/i,
            exclude: /node_modules/,
            use: {
               loader: "babel-loader"
            }
         },
         //{
         //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
         //   type: 'asset/resource',
         //   generator: {
         //      filename: 'assets/fonts/[name][ext]'
         //   }
         //},
         {
            test: /\.(png|jpe?g|gif|svg|ico)$/i,
            type: "asset/resource",
            generator: {
               filename: "assets/images/[name][ext]"
            }
         },
         {
            test: /\.mp3$/i,
            type: 'asset/resource',
            generator: {
               filename: 'assets/audio/[name][ext]'
            }
         }
      ]
   },
   plugins: [
      new webpack.ProvidePlugin({
         $: "jquery",
         jQuery: "jquery"
      }),

      // 複数HTMLページを出力
      ...htmlPages.map(page => new HtmlWebpackPlugin({
         template: `./src/${page}.html`,
         filename: `${page}.html`,
         chunks: backupPages.has(page) ? [] : ["main"]
      })),

      new MiniCssExtractPlugin({
         filename: "styles/main.css"
      }),

      new CopyWebpackPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, "node_modules/@fortawesome/fontawesome-free/webfonts"),
               to: path.resolve(__dirname, "docs/assets/fonts")
            },
            {
               from: path.resolve(__dirname, "img/web.ico"),
               to: path.resolve(__dirname, "docs/favicon.ico")
            },
            {
               from: path.resolve(__dirname, "img/web.ico"),
               to: path.resolve(__dirname, "docs/assets/images/pd.ico")
            },
            {
               // Static backup assets and the header/sidebar/footer fragments.
               from: path.resolve(__dirname, "src/public"),
               to: path.resolve(__dirname, "docs")
            },
            {
               from: path.resolve(__dirname, "src/assets/images"),
               to: path.resolve(__dirname, "docs/assets/images")
            }
         ]
      }),

      new CspHtmlWebpackPlugin(cspPolicy, {
         enabled: true,
         hashingMethod: 'sha256',
         hashEnabled: {
            'script-src': true,
            'style-src': false
         },
         nonceEnabled: false,
         processFn: processCsp
      })
   ],
   devServer: {
      static: path.resolve(__dirname, "docs"),
      hot: true,
      historyApiFallback: true
   }
};
