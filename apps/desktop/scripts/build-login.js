const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

// Define directories
const distDir = path.join(__dirname, "../dist");
const loginDir = path.join(distDir, "login");

// Ensure dist/login exists
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
if (!fs.existsSync(loginDir)) fs.mkdirSync(loginDir, { recursive: true });

// 1. Build preload script
esbuild
  .build({
    entryPoints: ["src/login/preload.ts"],
    bundle: true,
    outfile: "dist/login/preload.js",
    format: "cjs",
    platform: "node",
    target: ["node16"],
    external: ["electron"], // electron is built-in
  })
  .then(() => {
    console.log("✅ Login preload script built successfully!");
    console.log("📁 Output: dist/login/preload.js");
  })
  .catch((err) => {
    console.error("❌ Preload build failed:", err);
    process.exit(1);
  });

// 2. Copy HTML file
const srcHtml = path.join(__dirname, "../src/login/index.html");
const destHtml = path.join(loginDir, "index.html");
fs.copyFileSync(srcHtml, destHtml);
console.log("✅ Login HTML copied to dist/login/index.html");

const srcImage = path.join(__dirname, "../src/login/logo.jpg");
const destImage = path.join(loginDir, "logo.jpg");
if (fs.existsSync(srcImage)) {
  fs.copyFileSync(srcImage, destImage);
  console.log("✅ Logo image copied to dist/login/logo.jpg");
} else {
  console.warn("⚠️ Logo image not found at src/login/logo.jpg");
}
