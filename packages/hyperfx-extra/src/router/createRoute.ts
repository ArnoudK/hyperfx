/**
 * Route definition with createRoute API
 */

import { parsePath } from "./path";
import type { FunctionComponent } from "hyperfx/jsx/jsx-runtime";

/**
 * Options for createRoute
 */
export interface CreateRouteOptions<Path extends string> {
  /** The route view component */
  view: FunctionComponent<any>;
}

/**
 * Route definition created by createRoute
 */
export interface RouteDefinition<Path extends string = string> {
  /** The route path pattern */
  readonly path: Path;
  /** The view component */
  readonly view: FunctionComponent<any>;
  /** Parsed path segments for matching */
  readonly _parsed: ReturnType<typeof parsePath>;
}

/**
 * Create a typesafe route definition
 *
 * @param path - Route path pattern (e.g., "/users/:id", "/docs/...[slug]")
 * @param options - Route options including view component
 *
 * @example
 * ```tsx
 * const userRoute = createRoute("/user/:userId", {
 *   view: UserPage
 * });
 * ```
 */
export function createRoute<Path extends string>(
  path: Path,
  options: CreateRouteOptions<Path>,
): RouteDefinition<Path> {
  const route: RouteDefinition<Path> = {
    path,
    view: options.view,
    _parsed: parsePath(path),
  };

  return route;
}

/**
 * Route match result
 */
export interface RouteMatch<R extends RouteDefinition<any>> {
  route: R;
  params: Record<string, any>;
  search: Record<string, any>;
  matchedPath: string;
}

/**
 * Match a single route against a URL
 */
export function matchRoute<R extends RouteDefinition<any>>(
  route: R,
  urlPath: string,
  urlSearch: Record<string, string | string[]>,
): RouteMatch<R> | null {
  const matchResult = route._parsed.hasCatchAll
    ? matchCatchAll(urlPath, route.path)
    : matchStandard(urlPath, route.path);

  if (!matchResult || !matchResult.match) {
    return null;
  }

  const { params, matchedPath } = matchResult;

  return {
    route,
    params,
    search: {},
    matchedPath,
  };
}

/**
 * Match multiple routes and return the first match
 */
export function matchFirst<R extends RouteDefinition<any>>(
  routes: R[],
  urlPath: string,
  urlSearch: Record<string, string | string[]>,
): RouteMatch<R> | null {
  for (const route of routes) {
    const match = matchRoute(route, urlPath, urlSearch);
    if (match) {
      return match;
    }
  }
  return null;
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
    // Treat root route as a prefix match for matchAll (include it for non-root URLs)
    if (route.path === "/" && urlPath !== "/" && !urlPath.includes("//")) {
      matches.push({ route, params: {}, search: {}, matchedPath: "/" });
      continue;
    }

    const match = matchRoute(route, urlPath, urlSearch);
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

  // Root route ("/") should only match the root URL exactly.
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

  // Count required segments (non-optional parameters)
  let requiredSegments = 0;
  for (const seg of routeSegments) {
    if (!seg.endsWith("?")) {
      requiredSegments++;
    }
  }

  // URL must have at least the required segments
  if (urlSegments.length < requiredSegments) {
    return null;
  }

  // URL cannot have more segments than the route pattern allows
  if (urlSegments.length > routeSegments.length) {
    return null;
  }

  const params: Record<string, string | undefined> = {};

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSeg = routeSegments[i]!;
    const urlSeg = urlSegments[i];

    if (!routeSeg.startsWith(":")) {
      // Static segment - must match exactly
      if (routeSeg !== urlSeg) {
        return null;
      }
      continue;
    }

    if (routeSeg.startsWith(":")) {
      const paramName = routeSeg.slice(1).replace("?", "");
      const isOptional = routeSeg.endsWith("?");

      // If URL segment exists, use it; otherwise undefined for optional params
      if (urlSeg !== undefined) {
        params[paramName] = urlSeg;
      } else if (isOptional) {
        params[paramName] = undefined;
      } else {
        // Required param but no URL segment - this should not happen
        // due to the length check above, but be safe
        return null;
      }
    }
  }

  // Calculate matched path length
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
