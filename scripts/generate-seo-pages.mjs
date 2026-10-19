import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
const siteUrl = "https://rafaysiddiqui.vercel.app";
const projectSource = await readFile(
  path.join(root, "src/data/projects.ts"),
  "utf8",
);
const { outputText, diagnostics } = ts.transpileModule(projectSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
  reportDiagnostics: true,
});

const errors = diagnostics.filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);
if (errors.length) {
  throw new Error(
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: (fileName) => fileName,
      getNewLine: () => "\n",
    }),
  );
}

const { projects } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const pageMetadata = JSON.parse(
  await readFile(path.join(root, "src/data/pageMetadata.json"), "utf8"),
);
const template = await readFile(path.join(dist, "index.html"), "utf8");

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tagPattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}="${escapedKey}")[^>]*>`,
    "gi",
  );
  let count = 0;
  const updated = html.replace(tagPattern, (tag) => {
    count += 1;
    if (count > 1) return "";
    if (!/\bcontent="[^"]*"/i.test(tag)) {
      throw new Error(
        `Missing content attribute for meta ${attribute}="${key}"`,
      );
    }
    return tag.replace(
      /\bcontent="[^"]*"/i,
      `content="${escapeAttribute(content)}"`,
    );
  });
  if (count !== 1) {
    throw new Error(`Expected one meta ${attribute}="${key}", found ${count}`);
  }
  return updated;
}

function withPageMetadata(page, { indexable = true } = {}) {
  const title = escapeAttribute(page.title);
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${title}</title>`,
  );
  if (!html.includes(`<title>${title}</title>`)) {
    throw new Error("Could not update document title");
  }

  html = setMeta(html, "name", "description", page.description);
  html = setMeta(
    html,
    "name",
    "robots",
    indexable ? "index, follow" : "noindex, nofollow",
  );
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:url", `${siteUrl}${page.path}`);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  html = html.replace(/\b(?:href|src)="\.\//g, (prefix) => prefix.replace("./", "/"));

  const canonicalPattern = /<link\b(?=[^>]*\brel="canonical")[^>]*>/gi;
  const canonicals = [...html.matchAll(canonicalPattern)];
  if (indexable) {
    if (canonicals.length !== 1) {
      throw new Error(`Expected one canonical link, found ${canonicals.length}`);
    }
    html = html.replace(
      canonicalPattern,
      `<link rel="canonical" href="${escapeAttribute(`${siteUrl}${page.path}`)}" />`,
    );
  } else {
    html = html.replace(canonicalPattern, "");
  }
  return html;
}

const pages = [
  pageMetadata.home,
  pageMetadata.work,
  ...projects.map((project) => ({
    title: `${project.title} | Rafay Siddiqui`,
    description: project.description,
    path: `/work/${project.slug}`,
  })),
];
const paths = new Set();
for (const page of pages) {
  if (paths.has(page.path)) throw new Error(`Duplicate SEO route: ${page.path}`);
  paths.add(page.path);
  if (!page.title || !page.description || !page.path.startsWith("/")) {
    throw new Error(`Invalid SEO metadata for route: ${page.path}`);
  }
  if (
    page.path.startsWith("/work/") &&
    !/^\/work\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.path)
  ) {
    throw new Error(`Invalid project route: ${page.path}`);
  }
  const routePath = page.path === "/" ? "" : page.path.slice(1);
  const outputPath = path.join(dist, routePath, "index.html");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, withPageMetadata(page));
}

const notFoundPage = {
  title: "Page Not Found | Rafay Siddiqui",
  description: "This page doesn't exist.",
  path: "/404",
};
await writeFile(
  path.join(dist, "404.html"),
  withPageMetadata(notFoundPage, { indexable: false }),
);

const xmlEscape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map(
    (page) => `  <url><loc>${xmlEscape(`${siteUrl}${page.path}`)}</loc></url>`,
  ),
  "</urlset>",
  "",
].join("\n");
await writeFile(path.join(dist, "sitemap.xml"), sitemap);
