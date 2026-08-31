const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const webpack = require("webpack");

const cspPolicy = {
   "default-src": ["'self'"],
   "script-src": [
      "'self'",
      "https://code.jquery.com",
      "https://cdnjs.cloudflare.com",
      "https://cdn.jsdelivr.net"
   ],
   "style-src": [
      "'self'",
      "https://cdnjs.cloudflare.com",
      "https://fonts.googleapis.com",
      "https://cdn.jsdelivr.net",
      "https://use.typekit.net",
      "'unsafe-inline'"
   ],
   "font-src": [
      "'self'",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
      "https://cdn.jsdelivr.net",
      "https://use.typekit.net",
      "https://p.typekit.net",
      "data:"
   ],
   "img-src": [
      "'self'",
      "data:",
      "https://mizukioyama.github.io/website/",
      "https://raw.githubusercontent.com"
   ],
   "connect-src": [
      "'self'",
      "https://mizukioyama.github.io",
      "https://script.google.com",
      "https://script.googleusercontent.com",
      "https://cdn.jsdelivr.net",
      "https://fonts.googleapis.com"
   ],
   "object-src": ["'none'"],
   "base-uri": ["'self'"],
   "form-action": ["'self'", "https://mizukioyama.github.io"]
};

const processCspHtml = (builtPolicy, htmlPluginData, $) => {
   let metaTag = $('meta[http-equiv="Content-Security-Policy"]');

   if (!metaTag.length) {
      metaTag = $('<meta http-equiv="Content-Security-Policy">');
      metaTag.prependTo($('head'));
   }

   metaTag.attr("content", builtPolicy);
   htmlPluginData.html = $.html().replace(/^<!DOCTYPE\s*>/i, "<!doctype html>");
};

const htmlPages = [
   "index",
   "information",
   "gallery",
   "contact",
   "policy",
   "matching"
];

module.exports = (_env, argv = {}) => {
   const mode = argv.mode || "production";
   const isDevelopment = mode === "development";

   return {
      mode,
      devtool: isDevelopment ? "eval-source-map" : false,
      entry: {
         main: ["jquery", "./src/index.js"]
      },
      output: {
         path: path.resolve(__dirname, "docs"),
         filename: "js/main.js",
         clean: true,
         publicPath: "auto"
      },
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
            {
               test: /\.(png|jpe?g|gif|svg|ico)$/i,
               type: "asset/resource",
               generator: {
                  filename: "assets/images/[name][ext]"
               }
            }
         ]
      },
      plugins: [
         new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
         }),

         ...htmlPages.map(page => new HtmlWebpackPlugin({
            template: `./src/${page}.html`,
            filename: `${page}.html`,
            inject: "body",
            scriptLoading: "defer",
            minify: false
         })),

         new MiniCssExtractPlugin({
            filename: "styles/main.css"
         }),

         new CopyWebpackPlugin({
            patterns: [
               {
                  from: path.resolve(__dirname, "img/web.ico"),
                  to: path.resolve(__dirname, "docs/favicon.ico")
               },
               {
                  from: path.resolve(__dirname, "img/web.ico"),
                  to: path.resolve(__dirname, "docs/assets/images/pd.ico")
               },
               ...["header", "footer", "sidebar", "bot"].map(page => ({
                  from: path.resolve(__dirname, `src/${page}.html`),
                  to: path.resolve(__dirname, `docs/${page}.html`)
               }))
            ]
         }),

         new ImageMinimizerPlugin({
            test: /\.(jpe?g|png)$/i,
            minimizer: {
               implementation: ImageMinimizerPlugin.sharpMinify,
               options: {
                  encodeOptions: {
                     jpeg: {
                        quality: 75,
                        progressive: true
                     },
                     png: {
                        compressionLevel: 9,
                        adaptiveFiltering: true
                     }
                  }
               }
            }
         }),

         new CspHtmlWebpackPlugin(cspPolicy, {
            enabled: true,
            hashingMethod: "sha256",
            hashEnabled: {
               "script-src": true,
               "style-src": false
            },
            nonceEnabled: false,
            processFn: processCspHtml
         })
      ],
      devServer: {
         host: "127.0.0.1",
         static: path.resolve(__dirname, "docs"),
         hot: true,
         historyApiFallback: true
      }
   };
};
