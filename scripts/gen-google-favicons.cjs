const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
// Source monogram icon
const SRC_ICON = path.join(ROOT, "app/icon.png");

(async () => {
  // First read the source icon into a buffer so we don't lock the file while overwriting it
  const srcBuffer = fs.readFileSync(SRC_ICON);

  // Generate 512x512 master square icon with clean padding so the monogram is centered
  const icon512 = await sharp(srcBuffer)
    .resize(460, 460, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 26,
      bottom: 26,
      left: 26,
      right: 26,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ quality: 100 })
    .toBuffer();

  // Overwrite app/icon.png with the perfect 512x512 square!
  fs.writeFileSync(path.join(ROOT, "app/icon.png"), icon512);
  fs.writeFileSync(path.join(ROOT, "public/icon-512.png"), icon512);

  // Generate Google-specific multiples of 48px square:
  // 1. 48x48 (exact Google requirement)
  const icon48 = await sharp(icon512)
    .resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ROOT, "public/icon-48.png"), icon48);

  // 2. 96x96 (48 * 2)
  const icon96 = await sharp(icon512)
    .resize(96, 96, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ROOT, "public/icon-96.png"), icon96);

  // 3. 192x192 (48 * 4 - Google recommended Android/Search)
  const icon192 = await sharp(icon512)
    .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ROOT, "public/icon-192.png"), icon192);

  // 4. Apple Touch Icon 180x180
  const apple180 = await sharp(icon512)
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(ROOT, "app/apple-icon.png"), apple180);
  fs.writeFileSync(path.join(ROOT, "public/apple-icon.png"), apple180);

  // 5. favicon.ico (48x48 square for Googlebot root crawl)
  fs.writeFileSync(path.join(ROOT, "public/favicon.ico"), icon48);
  fs.writeFileSync(path.join(ROOT, "app/favicon.ico"), icon48);

  console.log("Successfully generated all square Google Search favicons:");
  console.log("- app/icon.png: 512x512 square");
  console.log("- public/icon-48.png: 48x48 square (Google multiple of 48)");
  console.log("- public/icon-96.png: 96x96 square (Google multiple of 48)");
  console.log("- public/icon-192.png: 192x192 square (Google multiple of 48)");
  console.log("- public/icon-512.png: 512x512 square");
  console.log("- public/favicon.ico & app/favicon.ico: 48x48 square");
  console.log("- app/apple-icon.png: 180x180 square");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
