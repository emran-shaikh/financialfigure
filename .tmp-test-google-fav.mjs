import fs from "fs";

const url = "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAV_ICON&fallback_opts=TYPE,SIZE,URL&url=https://www.financialfigure.com&size=64";
const res = await fetch(url);
console.log("Google Favicon status:", res.status);
const buf = Buffer.from(await res.arrayBuffer());
console.log("Google Favicon bytes:", buf.length);
fs.writeFileSync("public/google-cached-favicon.png", buf);

// Also check the live site directly
const liveFav = await fetch("https://www.financialfigure.com/favicon.ico");
console.log("Live favicon.ico status:", liveFav.status, "content-type:", liveFav.headers.get("content-type"), "length:", (await liveFav.arrayBuffer()).byteLength);

const liveIcon48 = await fetch("https://www.financialfigure.com/icon-48.png");
console.log("Live icon-48.png status:", liveIcon48.status, "content-type:", liveIcon48.headers.get("content-type"), "length:", (await liveIcon48.arrayBuffer()).byteLength);
