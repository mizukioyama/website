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
      "https://mizukioyama.github.io/website/"
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

// These pages are restored from the verified backup and intentionally keep
// their original CSS/JavaScript links so their appearance does not change.
const backupPages = new Set([
   "index",
   "artist-statement",
   "biography",
   "gallery",
   "contact",
   "policy"
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
         nonceEnabled: false
      })
   ],
   devServer: {
      static: path.resolve(__dirname, "docs"),
      hot: true,
      historyApiFallback: true
   }
};
