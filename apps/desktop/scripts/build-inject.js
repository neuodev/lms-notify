const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

// Ensure dist directory exists
const distDir = path.join(__dirname, "../dist");
const injectDir = path.join(distDir, "inject");

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
if (!fs.existsSync(injectDir)) fs.mkdirSync(injectDir, { recursive: true });

esbuild
  .build({
    entryPoints: ["src/inject/index.ts"],
    bundle: true,
    outfile: "dist/inject/bundle.js",
    format: "iife",
    globalName: "WhatsAppPluginInit",
    target: ["chrome58", "firefox57", "safari11", "edge16"],
    minify: false,
    sourcemap: false,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    loader: {
      ".ts": "ts",
    },
    tsconfig: "tsconfig.inject.json",

    platform: "browser",
  })
  .then(() => {
    console.log("✅ WhatsApp injection script built successfully!");
    console.log("📁 Output: dist/inject/bundle.js");

    const bundle = fs.readFileSync("dist/inject/bundle.js", "utf8");
    console.log("📏 Bundle size:", Math.round(bundle.length / 1024), "KB");
  })
  .catch((err) => {
    console.error("❌ Build failed:", err);
    process.exit(1);
  });
