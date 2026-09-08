import type { PageRoute } from "../types";

/**
 * Parses current window.location into a typed PageRoute.
 * Supports both standard HTML5 pathname paths (/consult, /astrologer/:slug, etc.)
 * and fallback hash fragments (#/consult, #/kundli) for seamless hosting.
 */
export function getCurrentRoute(): PageRoute {
  if (typeof window === "undefined") {
    return { page: "landing" };
  }

  // Check hash first if present (e.g. #/kundli-matching)
  let path = window.location.pathname;
  if (window.location.hash && window.location.hash.startsWith("#/")) {
    path = window.location.hash.replace(/^#/, "");
  }

  return pathToRoute(path, window.location.search);
}

/**
 * Maps a URL pathname and search query to a typed PageRoute
 */
export function pathToRoute(pathname: string, search = ""): PageRoute {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(search);

  if (cleanPath === "/" || cleanPath === "") {
    return { page: "landing" };
  }

  if (cleanPath === "/consult") {
    const category = params.get("category") || undefined;
    return { page: "consult", category };
  }

  const astrologerMatch = cleanPath.match(/^\/astrologer\/([^/]+)$/);
  if (astrologerMatch) {
    return { page: "astrologer-detail", slug: decodeURIComponent(astrologerMatch[1]) };
  }

  if (cleanPath === "/kundli") {
    return { page: "kundli" };
  }

  if (cleanPath === "/kundli-matching" || cleanPath === "/matching" || cleanPath === "/gun-milan") {
    return { page: "kundli-matching" };
  }

  if (cleanPath === "/horoscope" || cleanPath === "/panchang") {
    const sign = params.get("sign") || undefined;
    return { page: "horoscope", sign };
  }

  if (cleanPath === "/tarot") {
    return { page: "tarot" };
  }

  if (cleanPath === "/wallet") {
    return { page: "wallet" };
  }

  if (cleanPath === "/profile") {
    const tabParam = params.get("tab");
    const tab = (tabParam === "charts" || tabParam === "history" || tabParam === "ledger" || tabParam === "details")
      ? tabParam
      : "details";
    return { page: "profile", tab };
  }

  if (cleanPath === "/blogs" || cleanPath === "/blog") {
    const slug = params.get("slug") || undefined;
    return { page: "blogs", slug };
  }

  const blogMatch = cleanPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return { page: "blogs", slug: decodeURIComponent(blogMatch[1]) };
  }

  if (cleanPath === "/support" || cleanPath === "/help") {
    return { page: "support" };
  }

  // Fallback to landing page
  return { page: "landing" };
}

/**
 * Maps a PageRoute object back into a canonical URL string
 */
export function routeToPath(route: PageRoute): string {
  switch (route.page) {
    case "landing":
      return "/";
    case "consult":
      return route.category ? `/consult?category=${encodeURIComponent(route.category)}` : "/consult";
    case "astrologer-detail":
      return `/astrologer/${encodeURIComponent(route.slug)}`;
    case "kundli":
      return "/kundli";
    case "kundli-matching":
      return "/kundli-matching";
    case "horoscope":
      return route.sign ? `/horoscope?sign=${encodeURIComponent(route.sign)}` : "/horoscope";
    case "tarot":
      return "/tarot";
    case "wallet":
      return "/wallet";
    case "profile":
      return route.tab ? `/profile?tab=${route.tab}` : "/profile";
    case "blogs":
      return route.slug ? `/blog/${encodeURIComponent(route.slug)}` : "/blogs";
    case "support":
      return "/support";
    default:
      return "/";
  }
}

/**
 * Smoothly navigates the application and synchronizes browser history
 */
export function navigateTo(route: PageRoute, replace = false) {
  if (typeof window === "undefined") return;

  const targetPath = routeToPath(route);
  if (window.location.pathname !== targetPath) {
    if (replace) {
      window.history.replaceState({ route }, "", targetPath);
    } else {
      window.history.pushState({ route }, "", targetPath);
    }
  }

  // Dispatch custom route change event for components
  window.dispatchEvent(new CustomEvent("app:routechange", { detail: route }));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
