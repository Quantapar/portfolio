#!/usr/bin/env bun
import plugin from "bun-plugin-tailwind";
import { existsSync } from "fs";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import {
  getCanonicalUrl,
  getJsonLd,
  ogImageUrl,
  seoRoutes,
  siteName,
  siteUrl,
  type SeoRoute,
} from "./src/seo";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🏗️  Bun Build Script

Usage: bun run build.ts [options]

Common Options:
  --outdir <path>          Output directory (default: "dist")
  --minify                 Enable minification (or --minify.whitespace, --minify.syntax, etc)
  --sourcemap <type>      Sourcemap type: none|linked|inline|external
  --target <target>        Build target: browser|bun|node
  --format <format>        Output format: esm|cjs|iife
  --splitting              Enable code splitting
  --packages <type>        Package handling: bundle|external
  --public-path <path>     Public path for assets
  --env <mode>             Environment handling: inline|disable|prefix*
  --conditions <list>      Package.json export conditions (comma separated)
  --external <list>        External packages (comma separated)
  --banner <text>          Add banner text to output
  --footer <text>          Add footer text to output
  --define <obj>           Define global constants (e.g. --define.VERSION=1.0.0)
  --help, -h               Show this help message

Example:
  bun run build.ts --outdir=dist --minify --sourcemap=linked --external=react,react-dom
`);
  process.exit(0);
}

const toCamelCase = (str: string): string =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const parseValue = (value: string): any => {
  if (value === "true") return true;
  if (value === "false") return false;

  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d*\.\d+$/.test(value)) return parseFloat(value);

  if (value.includes(",")) return value.split(",").map((v) => v.trim());

  return value;
};

function parseArgs(): Partial<Bun.BuildConfig> {
  const config: Partial<Bun.BuildConfig> = {};
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === undefined) continue;
    if (!arg.startsWith("--")) continue;

    if (arg.startsWith("--no-")) {
      const key = toCamelCase(arg.slice(5));
      config[key] = false;
      continue;
    }

    if (
      !arg.includes("=") &&
      (i === args.length - 1 || args[i + 1]?.startsWith("--"))
    ) {
      const key = toCamelCase(arg.slice(2));
      config[key] = true;
      continue;
    }

    let key: string;
    let value: string;

    if (arg.includes("=")) {
      [key, value] = arg.slice(2).split("=", 2) as [string, string];
    } else {
      key = arg.slice(2);
      value = args[++i] ?? "";
    }

    key = toCamelCase(key);

    if (key.includes(".")) {
      const [parentKey, childKey] = key.split(".");
      config[parentKey] = config[parentKey] || {};
      config[parentKey][childKey] = parseValue(value);
    } else {
      config[key] = parseValue(value);
    }
  }

  return config;
}

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeJsonForHtml = (value: unknown): string =>
  JSON.stringify(value, null, 2).replace(/</g, "\\u003c");

const replaceOrInsertHeadTag = (
  html: string,
  pattern: RegExp,
  replacement: string,
): string => {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace("</head>", `${replacement}\n  </head>`);
};

const applySeoToHtml = (html: string, route: SeoRoute): string => {
  const canonicalUrl = getCanonicalUrl(route.path);
  const description = escapeHtml(route.description);
  const title = escapeHtml(route.title);
  const imageAlt = "Portfolio preview for Manu Sharma, also known as Quantapar";

  const replacements: Array<[RegExp, string]> = [
    [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`],
    [
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" />`,
    ],
    [
      /<meta name="author" content="[^"]*"\s*\/>/,
      '<meta name="author" content="Manu Sharma" />',
    ],
    [
      /<meta name="robots" content="[^"]*"\s*\/>/,
      '<meta name="robots" content="index, follow" />',
    ],
    [
      /<meta name="googlebot" content="[^"]*"\s*\/>/,
      '<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />',
    ],
    [
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    ],
    [
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${title}" />`,
    ],
    [
      /<meta property="og:description" content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${description}" />`,
    ],
    [
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    ],
    [
      /<meta property="og:site_name" content="[^"]*"\s*\/>/,
      `<meta property="og:site_name" content="${siteName}" />`,
    ],
    [
      /<meta property="og:image" content="[^"]*"\s*\/>/,
      `<meta property="og:image" content="${ogImageUrl}" />`,
    ],
    [
      /<meta property="og:image:alt" content="[^"]*"\s*\/>/,
      `<meta property="og:image:alt" content="${imageAlt}" />`,
    ],
    [
      /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${title}" />`,
    ],
    [
      /<meta name="twitter:description" content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${description}" />`,
    ],
    [
      /<meta name="twitter:image" content="[^"]*"\s*\/>/,
      `<meta name="twitter:image" content="${ogImageUrl}" />`,
    ],
    [
      /<meta name="twitter:image:alt" content="[^"]*"\s*\/>/,
      `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    ],
    [
      /<script type="application\/ld\+json" data-seo="route">[\s\S]*?<\/script>/,
      `<script type="application/ld+json" data-seo="route">${escapeJsonForHtml(
        getJsonLd(route.path),
      )}</script>`,
    ],
  ];

  return replacements.reduce(
    (nextHtml, [pattern, replacement]) =>
      replaceOrInsertHeadTag(nextHtml, pattern, replacement),
    html,
  );
};

const getRouteHtmlPath = (outdir: string, routePath: string): string => {
  if (routePath === "/") {
    return path.join(outdir, "index.html");
  }

  return path.join(outdir, routePath.slice(1), "index.html");
};

const writeStaticRouteHtml = async (outdir: string): Promise<void> => {
  const indexPath = path.join(outdir, "index.html");
  const baseHtml = await readFile(indexPath, "utf8");

  for (const route of seoRoutes) {
    const routeHtml = applySeoToHtml(baseHtml, route);
    const routePath = getRouteHtmlPath(outdir, route.path);
    await mkdir(path.dirname(routePath), { recursive: true });
    await writeFile(routePath, routeHtml);
  }
};

const writeSitemap = async (outdir: string): Promise<void> => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = seoRoutes
    .map(
      (route) => `  <url>
    <loc>${getCanonicalUrl(route.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority.toFixed(2)}</priority>
  </url>`,
    )
    .join("\n");

  await writeFile(
    path.join(outdir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
  );
};

const writeRobots = async (outdir: string): Promise<void> => {
  await writeFile(
    path.join(outdir, "robots.txt"),
    `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`,
  );
};

const copyDirectory = async (from: string, to: string): Promise<void> => {
  if (!existsSync(from)) return;

  for (const asset of new Bun.Glob("**/*").scanSync(from)) {
    const srcPath = path.join(from, asset);
    const destPath = path.join(to, asset);
    await mkdir(path.dirname(destPath), { recursive: true });
    await Bun.write(destPath, Bun.file(srcPath));
  }
};

console.log("\n🚀 Starting build process...\n");

const cliConfig = parseArgs();
const outdir = cliConfig.outdir || path.join(process.cwd(), "dist");

if (existsSync(outdir)) {
  console.log(`🗑️ Cleaning previous build at ${outdir}`);
  await rm(outdir, { recursive: true, force: true });
}

const start = performance.now();

const entrypoints = [...new Bun.Glob("**.html").scanSync("src")]
  .map((a) => path.resolve("src", a))
  .filter((dir) => !dir.includes("node_modules"));
console.log(
  `📄 Found ${entrypoints.length} HTML ${entrypoints.length === 1 ? "file" : "files"} to process\n`,
);

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [plugin],
  minify: true,
  target: "browser",
  sourcemap: "linked",
  publicPath: "/",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  ...cliConfig,
});

// Copy assets from src/assets to dist
const assetsSrc = path.join(process.cwd(), "src", "assets");
if (existsSync(assetsSrc)) {
  console.log(`📂 Copying assets from ${assetsSrc} to ${outdir}`);
  await copyDirectory(assetsSrc, outdir);
}

const publicSrc = path.join(process.cwd(), "public");
if (existsSync(publicSrc)) {
  console.log(`📂 Copying public assets from ${publicSrc} to ${outdir}`);
  await copyDirectory(publicSrc, outdir);
}

console.log("🔎 Writing SEO route HTML, sitemap, and robots.txt");
await writeStaticRouteHtml(outdir);
await writeSitemap(outdir);
await writeRobots(outdir);

const end = performance.now();

const outputTable = result.outputs.map((output) => ({
  File: path.relative(process.cwd(), output.path),
  Type: output.kind,
  Size: formatFileSize(output.size),
}));

console.table(outputTable);
const buildTime = (end - start).toFixed(2);

console.log(`\n✅ Build completed in ${buildTime}ms\n`);
