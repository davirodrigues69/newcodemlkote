import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");
const textAssets = [
  "index.html",
  "style.css",
  "script.js",
  "views.js",
  "freshViews.js",
  "manifest.json",
  "services/firebaseService.js",
  "services/platformService.js"
];
const binaryAssets = ["public/og.png", "public/logo.png"];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const asset of [...textAssets, ...binaryAssets]) {
  const source = resolve(root, asset);
  const destination = resolve(client, asset);
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};
const assets = {};

for (const asset of textAssets) {
  const path = "/" + asset.replaceAll("\\", "/");
  const extension = asset.slice(asset.lastIndexOf("."));
  assets[path] = {
    body: await readFile(resolve(root, asset), "utf8"),
    mime: mimeTypes[extension]
  };
}
for (const asset of binaryAssets) {
  const path = "/" + asset.replaceAll("\\", "/");
  const extension = asset.slice(asset.lastIndexOf("."));
  assets[path] = {
    base64: (await readFile(resolve(root, asset))).toString("base64"),
    mime: mimeTypes[extension]
  };
}

await writeFile(resolve(server, "assets.js"), "export default " + JSON.stringify(assets) + ";");
await cp(resolve(root, "worker", "index.js"), resolve(server, "index.js"));
try {
  await mkdir(resolve(dist, ".openai"), { recursive: true });
  await cp(resolve(root, ".openai", "hosting.json"), resolve(dist, ".openai", "hosting.json"));
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
console.log("New Code production bundle created.");
