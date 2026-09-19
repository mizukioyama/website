const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const docs = path.join(root, "docs");
const projectBase = "/website/";
const port = Number(process.env.PORT || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2"
};

function insideDocs(target) {
  const relative = path.relative(docs, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function sendFile(response, filePath, statusCode = 200, method = "GET") {
  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(statusCode, {
    "Content-Type": types[extension] || "application/octet-stream",
    "Cache-Control": "no-store"
  });

  if (method === "HEAD") {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  const method = request.method || "GET";
  if (method !== "GET" && method !== "HEAD") {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method not allowed");
    return;
  }

  const url = new URL(request.url || "/", "http://127.0.0.1");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    pathname = url.pathname;
  }

  if (pathname === projectBase.slice(0, -1)) {
    response.writeHead(308, { Location: projectBase });
    response.end();
    return;
  }

  if (!pathname.startsWith(projectBase)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const relative = pathname.slice(projectBase.length);
  let target = path.resolve(docs, relative);

  if (!insideDocs(target)) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  }

  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    sendFile(response, target, 200, method);
    return;
  }

  const notFound = path.join(docs, "404.html");
  if (fs.existsSync(notFound)) {
    sendFile(response, notFound, 404, method);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(port, "127.0.0.1", () => {
  console.log("Visual test server: http://127.0.0.1:" + port + projectBase);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
