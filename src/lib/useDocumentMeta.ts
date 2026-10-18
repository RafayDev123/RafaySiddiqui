import { useEffect } from "react";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
};

const SITE_URL = "https://rafaysiddiqui.vercel.app";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Lightweight client-side "metadata API" for this Vite SPA — keeps <title>,
 * description, canonical and Open Graph/Twitter tags in sync per route.
 */
export function useDocumentMeta({ title, description, path = "/" }: MetaInput) {
  useEffect(() => {
    const normalizedTitle = title.replace(/ — /g, " | ");
    const fullTitle = normalizedTitle.includes("Rafay Siddiqui")
      ? normalizedTitle
      : `${normalizedTitle} | Rafay Siddiqui`;
    document.title = fullTitle;

    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", `${SITE_URL}${path}`, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setLink("canonical", `${SITE_URL}${path}`);
  }, [title, description, path]);
}
