const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const rootVisualPages = [
  "index",
  "artist-statement",
  "biography",
  "order",
  "gallery",
  "contact",
  "policy"
];

const rootVisualScripts = [
  "bg_wave.js",
  "cursor.js",
  "form.js",
  "gallery-captions-data.js",
  "jquery-3.7.1.min.js",
  "jquery.ripples-min.js",
  "loading.js",
  "menu.js",
  "mobile.js",
  "p5.min.js",
  "page-nation.js",
  "three.r134.min.js",
  "time.js",
  "vanta.fog.min.js",
  "vanta.trunk.min.js"
];

module.exports = {
  mode: "production",
  entry: {},
  output: {
    path: path.resolve(__dirname, "docs"),
    clean: true
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "img/web.ico"),
          to: "favicon.ico"
        },
        {
          from: path.resolve(__dirname, "src/information.html"),
          to: "information.html",
          force: true,
          info: { minimized: true }
        },
        {
          from: path.resolve(__dirname, "src/404.html"),
          to: "404.html",
          force: true,
          info: { minimized: true }
        },
        {
          from: path.resolve(__dirname, "src/exhibition-yurayura-2026.html"),
          to: "exhibition-yurayura-2026.html",
          force: true,
          info: { minimized: true }
        },
        {
          from: path.resolve(__dirname, "src/exhibitions"),
          to: "exhibitions",
          force: true,
          info: { minimized: true }
        },
        {
          from: path.resolve(__dirname, "sitemap.xml"),
          to: "sitemap.xml",
          force: true
        },
        ...rootVisualPages.map(page => ({
          from: path.resolve(__dirname, `${page}.html`),
          to: `${page}.html`,
          force: true,
          info: { minimized: true }
        })),
        {
          from: path.resolve(__dirname, "css"),
          to: "css",
          force: true
        },
        ...rootVisualScripts.map(file => ({
          from: path.resolve(__dirname, `js/${file}`),
          to: `js/${file}`,
          force: true
        })),
        {
          from: path.resolve(__dirname, "img"),
          to: "img",
          force: true
        }
      ]
    })
  ],
  devServer: {
    static: path.resolve(__dirname, "docs"),
    hot: true,
    historyApiFallback: true
  }
};
