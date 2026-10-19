import { useEffect } from "react";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  indexable?: boolean;
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
  const elements = document.head.querySelectorAll<HTMLLinkElement>(`link[rel="${rel}"]`);
  const [el, ...duplicates] = elements;
  duplicates.forEach((duplicate) => duplicate.remove());

  if (!el) {
    const newLink = document.createElement("link");
    newLink.setAttribute("rel", rel);
    document.head.appendChild(newLink);
    newLink.setAttribute("href", href);
    return;
  }
  el.setAttribute("href", href);
}

function removeLinks(rel: string) {
  document.head
    .querySelectorAll<HTMLLinkElement>(`link[rel="${rel}"]`)
    .forEach((el) => el.remove());
}

/**
 * Lightweight client-side "metadata API" for this Vite SPA — keeps <title>,
 * description, canonical and Open Graph/Twitter tags in sync per route.
 */
export function useDocumentMeta({
  title,
  description,
  path = "/",
  indexable = true,
}: MetaInput) {
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
    setMeta("robots", indexable ? "index, follow" : "noindex, nofollow");
    if (indexable) {
      setLink("canonical", `${SITE_URL}${path}`);
    } else {
      removeLinks("canonical");
    }
  }, [title, description, path, indexable]);
}
