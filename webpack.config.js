const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const webpack = require("webpack");

// Static fragments are fetched after the page CSP has been created. Include
// hashes for their legacy inline blocks so restoring the backup markup does
// not cause the browser to discard the sidebar styles or footer script.
function getFragmentHashes(filePath, tagName) {
   if (!fs.existsSync(filePath)) {
      return [];
   }

   const source = fs.readFileSync(filePath, "utf8");
   const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}\\s*>`, "gi");
   const hashes = new Set();

   for (const match of source.matchAll(pattern)) {
      const bodies = new Set([match[1], match[1].replace(/\r\n?/g, "\n")]);
      for (const body of bodies) {
         const digest = crypto.createHash("sha256").update(body, "utf8").digest("base64");
         hashes.add(`'sha256-${digest}'`);
      }
   }

   return [...hashes];
}

const fragmentScriptHashes = getFragmentHashes(
   path.resolve(__dirname, "src/public/footer.html"),
   "script"
);
const fragmentStyleHashes = getFragmentHashes(
   path.resolve(__dirname, "sidebar.html"),
   "style"
);

const cspPolicy = {
   'default-src': ["'self'"],
   'script-src': [
      "'self'",
      "https://code.jquery.com",
      "https://cdnjs.cloudflare.com",
      "https://cdn.jsdelivr.net",
      ...fragmentScriptHashes
   ],
   'style-src': [
      "'self'",
      "https://cdnjs.cloudflare.com",
      "https://fonts.googleapis.com",
      "https://use.typekit.net",
      "https://p.typekit.net",
      "https://unpkg.com",
      "https://cdn.jsdelivr.net",
      ...fragmentStyleHashes
   ],
   // The legacy templates still use inline style attributes. Keep those
   // attributes working while the styles are gradually moved into CSS files.
   // Inline <style> blocks are covered by the hashes enabled below.
   'style-src-attr': ["'unsafe-inline'"],
   'font-src': [
      "'self'",
      "https://fonts.gstatic.com",
      "https://use.typekit.net",
      "https://p.typekit.net",
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
      "https://raw.githubusercontent.com",
      // The external artwork credit/icon used by the gallery stylesheet.
      "https://paradigmart.natureinspire.jp"
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

// Cheerio may serialize the HTML5 doctype as `<!DOCTYPE >`. That empty
// doctype puts the generated document into quirks mode in browsers, which can
// change box sizing and CSS layout even when the source styles are correct.
// Keep the generated output in standards mode by restoring the source HTML5
// doctype after CSP processing.
function restoreHtml5Doctype(html, sourceHtml) {
   if (!/^\s*<!doctype\s+html\s*>/i.test(sourceHtml)) {
      return html;
   }

   return html.replace(/^\s*<!doctype[^>]*>/i, "<!DOCTYPE html>");
}

function processCsp(builtPolicy, htmlPluginData, $) {
   let metaTag = $('meta[http-equiv="Content-Security-Policy"]');

   if (!metaTag.length) {
      $('head').prepend('<meta http-equiv="Content-Security-Policy">');
      metaTag = $('meta[http-equiv="Content-Security-Policy"]');
   }

   metaTag.attr('content', builtPolicy);

   const serializedHtml = htmlPluginData.plugin.options.xhtml ? $.xml() : $.html();
   const standardsHtml = restoreHtml5Doctype(serializedHtml, htmlPluginData.html);
   htmlPluginData.html = restoreInlineScriptEntities(standardsHtml);
}

// The root HTML files are the visual source of truth for the public site.
// Keep these pages static so page-specific CSS and scripts are not rewritten
// by HtmlWebpackPlugin or its CSP post-processing.
const rootVisualPages = [
   "index",
   "artist-statement",
   "biography",
   "gallery",
   "contact",
   "policy"
];

const rootVisualScripts = [
   "bg_wave.js",
   "cursor.js",
   "form.js",
   "jquery-3.7.1.min.js",
   "jquery.ripples-min.js",
   "loading.js",
   "menu.js",
   "mobile.js",
   "p5.min.js",
   "page-nation.js",
   "side.js",
   "three.r134.min.js",
   "time.js",
   "vanta.fog.min.js",
   "vanta.trunk.min.js"
];

// Pages that still use the current src-based Webpack application bundle.
const htmlPages = [
   "information",
   "matching",
   "bot"
];

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
         chunks: ["main"]
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
            ...["header", "footer"].map(page => ({
               from: path.resolve(__dirname, `src/${page}.html`),
               to: path.resolve(__dirname, `docs/${page}.html`),
               force: true
            })),
            {
               from: path.resolve(__dirname, "sidebar.html"),
               to: path.resolve(__dirname, "docs/sidebar.html"),
               force: true
            },
            // Copy the same visual pages and assets used by the local
            // preview. This avoids reintroducing legacy public assets.
            ...rootVisualPages.map(page => ({
               from: path.resolve(__dirname, `${page}.html`),
               to: path.resolve(__dirname, `docs/${page}.html`),
               force: true
            })),
            {
               from: path.resolve(__dirname, "css"),
               to: path.resolve(__dirname, "docs/css"),
               force: true
            },
            // Copy only scripts referenced by the root visual pages. This
            // excludes unused legacy files from the production asset graph.
            ...rootVisualScripts.map(file => ({
               from: path.resolve(__dirname, `js/${file}`),
               to: path.resolve(__dirname, `docs/js/${file}`),
               force: true
            })),
            {
               from: path.resolve(__dirname, "img"),
               to: path.resolve(__dirname, "docs/img"),
               force: true
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
            'style-src': true
         },
         nonceEnabled: {
            'script-src': false,
            'style-src': false
         },
         processFn: processCsp
      })
   ],
   devServer: {
      static: path.resolve(__dirname, "docs"),
      hot: true,
      historyApiFallback: true
   }
};
