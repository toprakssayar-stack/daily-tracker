import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.resolve(root, "../public/icon.svg");
const svg = await readFile(svgPath);

async function gen(size, name) {
  const buf = await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toBuffer();
  await writeFile(path.resolve(root, `../public/${name}`), buf);
  console.log(`wrote public/${name}`);
}

await gen(192, "icon-192.png");
await gen(512, "icon-512.png");
await gen(180, "apple-icon.png");
await gen(32, "favicon-32.png");
