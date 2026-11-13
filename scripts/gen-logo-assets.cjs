// One-off asset generation for the Financial Figure logo.
// Produces:
//   public/logo.png        - full horizontal logo (header + footer)
//   app/icon.png           - monogram favicon (browser tab icon)
//   app/apple-icon.png     - monogram fitted to a 180px square (iOS home screen)
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC_LOGO = "C:/Users/epicmetry/Downloads/ff-logo.png";
const SRC_ICON = "C:/Users/epicmetry/Downloads/fav-icon.png";
const ROOT = path.join(__dirname, "..");

(async () => {
  const meta = await sharp(SRC_LOGO).metadata();

  // Full logo: copy byte-for-byte so the source image is used completely
  // unchanged (no re-encoding, no metadata stripped).
  fs.copyFileSync(SRC_LOGO, path.join(ROOT, "public/logo.png"));

  // Favicon: use the monogram-only icon as-is for the browser tab.
  fs.copyFileSync(SRC_ICON, path.join(ROOT, "app/icon.png"));

  // iOS home-screen icon must be square; fit the monogram into a transparent
  // square without cropping or recolouring it.
  await sharp(SRC_ICON)
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: false })
    .toFile(path.join(ROOT, "app/apple-icon.png"));

  console.log("Generated logo.png, app/icon.png, app/apple-icon.png (180)");
  console.log(`Logo source: ${meta.width}x${meta.height}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
