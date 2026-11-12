import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BLOG_DATA } from "../src/data/blogData.js";
import { INDEXABLE_PAGES, NOINDEX_PAGES } from "../src/data/seoPages.js";

const siteUrl = "https://intervyo.xyz";
const distDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist"
);
const sitemapPath = path.join(distDirectory, "sitemap.xml");
const template = await readFile(path.join(distDirectory, "index.html"), "utf8");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const pageUrl = (route) => `${siteUrl}${route === "/" ? "/" : route}`;
const outputPath = (route) =>
  route === "/"
    ? path.join(distDirectory, "index.html")
    : path.join(distDirectory, `${route.slice(1).replaceAll("/", "-")}.html`);

const replaceRequired = (html, pattern, replacement, tagName) => {
  if (!pattern.test(html)) {
    throw new Error(`Could not find ${tagName} in the built HTML template.`);
  }
  return html.replace(pattern, replacement);
};

const createPageHtml = ({ route, title, description, noindex = false }) => {
  const canonical = pageUrl(route);
  const escapedTitle = escapeHtml(`${title} | Intervyo`);
  const escapedDescription = escapeHtml(description);
  let html = template;

  html = replaceRequired(html, /<title>[\s\S]*?<\/title>/, `<title>${escapedTitle}</title>`, "title");
  html = replaceRequired(
    html,
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapedDescription}" />`,
    "description"
  );
  html = replaceRequired(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonical}" />`,
    "canonical"
  );
  html = replaceRequired(
    html,
    /<meta name="robots" content="[^"]*"\s*\/>/,
    `<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}" />`,
    "robots directive"
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapedTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapedDescription}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonical}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${siteUrl}/intervyologo.png" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapedTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapedDescription}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${siteUrl}/intervyologo.png" />`
  );

  const initialLoader =
    '<div class="app-initial-loader" role="status" aria-label="Loading page"><span class="app-initial-loader__spinner"></span></div>';
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${initialLoader}</div>`,
  );
  const initialLoaderStyles = `<style>
    .app-initial-loader{display:grid;min-height:100vh;min-height:100dvh;place-items:center;background:#0a0d12}
    .app-initial-loader__spinner{width:42px;height:42px;border:3px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:app-initial-spin .8s linear infinite}
    @keyframes app-initial-spin{to{transform:rotate(360deg)}}
    @media(prefers-reduced-motion:reduce){.app-initial-loader__spinner{animation-duration:2s}}
  </style>`;
  return html.replace(
    "</head>",
    `${initialLoaderStyles}\n${routeIndexingGuard}\n  </head>`,
  );
};

const articles = BLOG_DATA.map((article) => ({
  route: `/blog/${article.slug}`,
  title: article.title,
  description: article.excerpt,
  article,
}));
const indexablePages = [
  ...INDEXABLE_PAGES,
  ...articles.map(({ route, title, description }) => ({
    path: route,
    title,
    description,
  })),
];
const noindexPages = NOINDEX_PAGES.map(({ path: route, title }) => ({
  route,
  title,
  description: `${title} page for Intervyo.`,
  noindex: true,
}));

const canonicalUrls = indexablePages.map(({ path: route }) => pageUrl(route));
if (new Set(canonicalUrls).size !== canonicalUrls.length) {
  throw new Error("SEO page configuration contains duplicate canonical URLs.");
}
const knownPaths = [...canonicalUrls, ...noindexPages.map(({ route }) => pageUrl(route))]
  .map((url) => new URL(url).pathname);
const routeIndexingGuard = `<script>(function(){var path=window.location.pathname.replace(/\\/+$/, "")||"/";var known=${JSON.stringify(
  knownPaths
)}.includes(path)||[/^\\/interview\\/[^/]+$/, /^\\/interview-room\\/[^/]+$/, /^\\/results\\/[^/]+$/].some(function(pattern){return pattern.test(path)});if(!known){var canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.remove();var robots=document.querySelector('meta[name="robots"]');if(robots)robots.setAttribute("content","noindex, follow")}})();</script>`;

for (const page of [...indexablePages.map(({ path: route, ...metadata }) => ({ route, ...metadata })), ...noindexPages]) {
  await writeFile(
    outputPath(page.route),
    createPageHtml(page)
  );
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...canonicalUrls.map((url) => `  <url><loc>${url}</loc></url>`),
  "</urlset>",
  "",
].join("\n");
await writeFile(sitemapPath, sitemap);

console.log(
  `Generated ${indexablePages.length} indexable pages, ${noindexPages.length} noindex pages, and sitemap.xml.`
);
