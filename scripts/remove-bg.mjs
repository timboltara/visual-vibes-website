import { Jimp } from 'jimp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input  = path.join(__dirname, '../public/visual-vibes-logo.png');
const output = path.join(__dirname, '../public/visual-vibes-logo-transparent.png');

const img = await Jimp.read(input);

// Pass 1 — remove near-black background pixels
img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
  const r = this.bitmap.data[idx];
  const g = this.bitmap.data[idx + 1];
  const b = this.bitmap.data[idx + 2];

  if (r < 45 && g < 45 && b < 45) {
    this.bitmap.data[idx + 3] = 0; // fully transparent
    return;
  }

  // Pass 2 — convert near-white pixels to dark #1c1c1c so logo is
  // readable on the white navbar background
  if (r > 200 && g > 200 && b > 200) {
    this.bitmap.data[idx]     = 28;  // #1c
    this.bitmap.data[idx + 1] = 28;  // #1c
    this.bitmap.data[idx + 2] = 28;  // #1c
  }
});

// Upscale 3× so the PNG has plenty of resolution when displayed at
// 44 px navbar height — eliminates jagged/aliased edges on screen
const upscaledWidth = img.bitmap.width * 3;
img.resize({ w: upscaledWidth });

await img.write(output);
console.log(`Done → ${output}  (${img.bitmap.width}×${img.bitmap.height})`);
