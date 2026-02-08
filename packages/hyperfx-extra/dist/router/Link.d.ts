import type { RouteDefinition } from "./createRoute";
/**
 * Build an href for a route using params and search
 */
export declare function createHref(
  route: RouteDefinition<any>,
  params?: Record<string, string | undefined>,
  search?: Record<string, any>,
): string;
/**
 * Determine whether a link is active
 * - exact: ignores trailing slash and requires full match
 * - non-exact: treats route as prefix
 */
export declare function isActiveLink(
  currentPath: string,
  routePath: string,
  exact: boolean,
): boolean;
