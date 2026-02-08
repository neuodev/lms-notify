const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

// Ensure dist directory exists
const distDir = path.join(__dirname, "../dist");
const injectDir = path.join(distDir, "inject");

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
if (!fs.existsSync(injectDir)) fs.mkdirSync(injectDir, { recursive: true });

console.log("🔨 Building WhatsApp injection script...");

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
    // Mark xlsx as external and load it from CDN
    external: ["xlsx"],
    platform: "browser",
    banner: {
      js: `/* WhatsApp Plugin - ${new Date().toISOString()} */
    // Load xlsx from CDN
    const XLSX = window.XLSX || (() => {
      console.warn('XLSX not loaded, Excel import will not work');
      return null;
    });`,
    },
  })
  .then(() => {
    console.log("✅ WhatsApp injection script built successfully!");
    console.log("📁 Output: dist/inject/bundle.js");

    // Read and log first few lines to verify
    const bundle = fs.readFileSync("dist/inject/bundle.js", "utf8");
    console.log("📏 Bundle size:", Math.round(bundle.length / 1024), "KB");

    // Copy xlsx.min.js to dist folder
    const xlsxSource = path.join(
      __dirname,
      "../node_modules/xlsx/dist/xlsx.mini.min.js",
    );
    const xlsxDest = path.join(injectDir, "xlsx.min.js");

    if (fs.existsSync(xlsxSource)) {
      fs.copyFileSync(xlsxSource, xlsxDest);
      console.log("📊 XLSX library copied to dist/inject/");
    }
  })
  .catch((err) => {
    console.error("❌ Build failed:", err);
    process.exit(1);
  });
