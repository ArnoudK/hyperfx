import { buildPath, buildSearchString } from "./path";
/**
 * Build an href for a route using params and search
 */
export function createHref(route, params = {}, search = {}) {
  const path = buildPath(route.path, params);
  const searchString = buildSearchString(search);
  return `${path}${searchString}`;
}
/**
 * Determine whether a link is active
 * - exact: ignores trailing slash and requires full match
 * - non-exact: treats route as prefix
 */
export function isActiveLink(currentPath, routePath, exact) {
  const normalizedUrl = currentPath.replace(/\/$/, "");
  const normalizedRoute = routePath.replace(/\/$/, "");
  if (exact) {
    return normalizedUrl === normalizedRoute;
  }
  return normalizedUrl === normalizedRoute || normalizedUrl.startsWith(normalizedRoute + "/");
}
//# sourceMappingURL=Link.js.map
