const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

// Ensure dist directory exists
const distDir = path.join(__dirname, "../dist");
const mainDir = path.join(distDir, "main");

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir, { recursive: true });

esbuild
  .build({
    entryPoints: ["src/main/index.ts"],
    bundle: true,
    outfile: "dist/main/index.js",
    format: "iife",
    globalName: "WhatsAppPluginInit",
    platform: "node",
    target: [],
    minify: false,
    sourcemap: false,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    loader: {
      ".ts": "ts",
    },
    tsconfig: "tsconfig.main.json",
    external: ["electron"],
  })
  .then(() => {
    console.log("✅ Main script built successfully!");
    console.log("📁 Output: dist/main/index.js");

    const bundle = fs.readFileSync("dist/main/index.js", "utf8");
    console.log("📏 Bundle size:", Math.round(bundle.length / 1024), "KB");
  })
  .catch((err) => {
    console.error("❌ Build failed:", err);
    process.exit(1);
  });
