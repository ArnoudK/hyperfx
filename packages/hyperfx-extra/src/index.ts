/**
 * HyperFX Router - Typesafe routing for SSR and client-side rendering
 */

export { createRoute, type RouteDefinition, type RouteMatch } from "./router/createRoute";
export {
  parsePath,
  matchPath,
  buildPath,
  parseSearchParams,
  buildSearchString,
} from "./router/path";
export { createRouter, type RouterState } from "./router/createRouter";
export type { NavigateOptions } from "./router/createRouter";
export type {
  ExtractParams,
  RouteParams,
  SearchParams,
  ReturnTypeOf,
  FirstParamOf,
} from "./router/types";
