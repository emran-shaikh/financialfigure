const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const ICON_PATH = path.join(ROOT, "app/icon.png");
const LOGO_PATH = path.join(ROOT, "public/logo.png");

(async () => {
  // 1. Generate 32x32 favicon.ico and favicon.png
  const faviconBuffer = await sharp(ICON_PATH)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(ROOT, "public/favicon.ico"), faviconBuffer);
  fs.writeFileSync(path.join(ROOT, "app/favicon.ico"), faviconBuffer);
  console.log("Generated favicon.ico in public/ and app/");

  // 2. Generate 1200x630 OpenGraph / Twitter social card
  // Fit the horizontal logo nicely within 1200x630 with a subtle clean background
  const logoResized = await sharp(LOGO_PATH)
    .resize(800, null, { fit: "inside" })
    .toBuffer();

  const ogCard = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 248, g: 250, b: 252, alpha: 1 }, // slate-50
    },
  })
    .composite([
      {
        input: logoResized,
        gravity: "center",
      },
    ])
    .png({ quality: 90 })
    .toFile(path.join(ROOT, "public/og-image.png"));

  console.log("Generated public/og-image.png (1200x630)");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
