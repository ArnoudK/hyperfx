/**
 * Route definition with createRoute API
 */

import { parsePath } from "./path";
import type { FunctionComponent } from "hyperfx/jsx/jsx-runtime";
import type { RouteMatch, RouteError } from "./types";

export type { RouteMatch, RouteError };
export type { InferRouteProps } from "./types";

/**
 * Options for createRoute
 */
export interface CreateRouteOptions<
  Path extends string,
  Params = undefined,
  Search = undefined,
> {
  /** The route view component */
  view: FunctionComponent<any>;
  /** Params validator - can be a type assertion or validation function */
  params?: Params;
  /** Search params validator function */
  search?: Search;
}

/**
 * Route definition with full type information
 */
export interface RouteDefinition<
  Path extends string = string,
  RawParams = undefined,
  RawSearch = undefined,
> {
  readonly path: Path;
  readonly view: FunctionComponent<any>;
  readonly _parsed: ReturnType<typeof parsePath>;
  readonly _paramsValidator?: RawParams;
  readonly _searchValidator?: RawSearch;
}

/**
 * Create a typesafe route definition
 *
 * @param path - Route path pattern (e.g., "/users/:id", "/posts/[slug]")
 * @param options - Route options including view component and validators
 *
 * @example
 * ```tsx
 * // Basic usage - params inferred from path
 * const userRoute = createRoute("/user/:userId", {
 *   view: UserPage
 * });
 *
 * // With param validation
 * const userRoute = createRoute("/user/:userId", {
 *   view: UserPage,
 *   params: (raw) => ({ userId: Number(raw.userId) })
 * });
 *
 * // With search params validation
 * const postsRoute = createRoute("/posts", {
 *   view: PostsPage,
 *   search: (raw) => ({
 *     page: Number(raw.page) || 1,
 *     filter: raw.filter as string | undefined
 *   })
 * });
 * ```
 */
export function createRoute<
  Path extends string,
  Params = undefined,
  Search = undefined,
>(
  path: Path,
  options: CreateRouteOptions<Path, Params, Search>,
): RouteDefinition<Path, Params, Search> {
  const route: RouteDefinition<Path, Params, Search> = {
    path,
    view: options.view,
    _parsed: parsePath(path),
    _paramsValidator: options.params as any,
    _searchValidator: options.search as any,
  };

  return route;
}

/**
 * Match a single route against a URL
 */
export function matchRoute<R extends RouteDefinition<any>>(
  route: R,
  urlPath: string,
  urlSearch: Record<string, string | string[]>,
): RouteMatch<R> {
  const matchResult = route._parsed.hasCatchAll
    ? matchCatchAll(urlPath, route.path)
    : matchStandard(urlPath, route.path);

  if (!matchResult || !matchResult.match) {
    return {
      route,
      params: {},
      search: {},
      matchedPath: "/",
      error: { type: "params", message: "Route not matched" },
    };
  }

  return {
    route,
    params: matchResult.params,
    search: urlSearch,
    matchedPath: matchResult.matchedPath,
  };
}

/**
 * Match multiple routes and return the first match
 */
export function matchFirst<R extends RouteDefinition<any>>(
  routes: R[],
  urlPath: string,
  urlSearch: Record<string, string | string[]>,
): RouteMatch<R> {
  for (const route of routes) {
    const match = matchRoute(route, urlPath, urlSearch);
    if (match && !match.error) {
      return match;
    }
  }

  const lastRoute = routes[routes.length - 1];
  if (lastRoute) {
    return matchRoute(lastRoute, urlPath, urlSearch);
  }

  return {
    route: undefined as any,
    params: {} as any,
    search: {} as any,
    matchedPath: "/",
    error: { type: "params" as const, message: "No routes defined" },
  };
}

/**
 * Match multiple routes and return all matches
 */
export function matchAll<R extends RouteDefinition<any>>(
  routes: R[],
  urlPath: string,
  urlSearch: Record<string, string | string[]>,
): Array<RouteMatch<R>> {
  const matches: Array<RouteMatch<R>> = [];

  for (const route of routes) {
    const match = matchRoute(route, urlPath, urlSearch);

    if (route.path === "/" && urlPath !== "/" && !urlPath.includes("//")) {
      matches.push({
        route,
        params: {} as any,
        search: {} as any,
        matchedPath: "/",
        error: { type: "params" as const, message: "Root route only matches exact path" },
      });
      continue;
    }

    if (match) {
      matches.push(match);
    }
  }

  return matches;
}

function matchStandard(
  urlPath: string,
  routePath: string,
): {
  match: boolean;
  params: Record<string, string | undefined>;
  matchedPath: string;
} | null {
  if (urlPath.includes("//")) {
    return null;
  }

  const urlSegments = urlPath.split("/").filter(Boolean);
  const routeSegments = routePath.split("/").filter(Boolean);

  if (routeSegments.length === 0) {
    if (urlSegments.length === 0) {
      return {
        match: true,
        params: {},
        matchedPath: "/",
      };
    }
    return null;
  }

  let requiredSegments = 0;
  for (const seg of routeSegments) {
    if (!seg.endsWith("?")) {
      requiredSegments++;
    }
  }

  if (urlSegments.length < requiredSegments) {
    return null;
  }

  const params: Record<string, string | undefined> = {};

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSeg = routeSegments[i]!;
    const urlSeg = urlSegments[i];

    if (!routeSeg.startsWith(":")) {
      if (routeSeg !== urlSeg) {
        return null;
      }
      continue;
    }

    if (routeSeg.startsWith(":")) {
      const paramName = routeSeg.slice(1).replace("?", "");
      const isOptional = routeSeg.endsWith("?");

      if (urlSeg !== undefined) {
        params[paramName] = urlSeg;
      } else if (isOptional) {
        params[paramName] = undefined;
      } else {
        return null;
      }
    }
  }

  const matchedSegmentCount = Math.min(urlSegments.length, routeSegments.length);

  return {
    match: true,
    params,
    matchedPath:
      matchedSegmentCount === 0 ? "/" : "/" + urlSegments.slice(0, matchedSegmentCount).join("/"),
  };
}

function matchCatchAll(
  urlPath: string,
  routePath: string,
): {
  match: boolean;
  params: Record<string, string | undefined>;
  matchedPath: string;
} | null {
  if (urlPath.includes("//")) {
    return null;
  }

  const catchAllIndex = routePath.indexOf("...[");
  if (catchAllIndex === -1) {
    return matchStandard(urlPath, routePath);
  }

  const prefixPath = routePath.slice(0, catchAllIndex);
  const prefixSegments = prefixPath.split("/").filter(Boolean);
  const urlSegments = urlPath.split("/").filter(Boolean);

  if (urlSegments.length < prefixSegments.length) {
    return null;
  }

  for (let i = 0; i < prefixSegments.length; i++) {
    const prefixSeg = prefixSegments[i]!;
    const urlSeg = urlSegments[i]!;

    if (!prefixSeg.startsWith(":")) {
      if (prefixSeg !== urlSeg) {
        return null;
      }
    } else {
      prefixSegments[i] = urlSeg;
    }
  }

  const bracketEnd = routePath.indexOf("]", catchAllIndex);
  const paramName = routePath.slice(catchAllIndex + 4, bracketEnd);
  const isOptional = routePath.slice(bracketEnd + 1) === "?";

  const catchAllSegments = urlSegments.slice(prefixSegments.length);
  const catchAllValue = catchAllSegments.join("/");

  const params: Record<string, string | undefined> = {};
  params[paramName] = catchAllValue || (isOptional ? undefined : "");

  const routePathSegments = routePath.split("/").filter(Boolean);
  for (let i = 0; i < prefixSegments.length; i++) {
    const prefixSeg = routePathSegments[i];
    if (prefixSeg && prefixSeg.startsWith(":")) {
      const name = prefixSeg.slice(1).replace("?", "");
      params[name] = urlSegments[i];
    }
  }

  return {
    match: true,
    params,
    matchedPath:
      "/" + urlSegments.slice(0, prefixSegments.length + catchAllSegments.length).join("/"),
  };
}
