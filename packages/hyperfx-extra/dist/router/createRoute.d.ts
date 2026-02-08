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
export declare function createRoute<Path extends string>(
  path: Path,
  options: CreateRouteOptions<Path>,
): RouteDefinition<Path>;
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
export declare function matchRoute<R extends RouteDefinition<any>>(
  route: R,
  urlPath: string,
  urlSearch: Record<string, string | string[]>,
): RouteMatch<R> | null;
/**
 * Match multiple routes and return the first match
 */
export declare function matchFirst<R extends RouteDefinition<any>>(
  routes: R[],
  urlPath: string,
  urlSearch: Record<string, string | string[]>,
): RouteMatch<R> | null;
/**
 * Match multiple routes and return all matches
 */
export declare function matchAll<R extends RouteDefinition<any>>(
  routes: R[],
  urlPath: string,
  urlSearch: Record<string, string | string[]>,
): Array<RouteMatch<R>>;
