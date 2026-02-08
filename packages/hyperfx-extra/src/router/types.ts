/**
 * Type utilities for the HyperFX Router
 * Provides type inference from route definitions
 */

/**
 * Utility type to capture the return type of a function
 */
export type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

/**
 * Utility type to capture the first parameter of a function
 */
export type FirstParamOf<T> = T extends (param: infer P) => any ? P : never;

/**
 * Check if a string literal contains a colon parameter segment
 */
type HasColonParam<S extends string> = S extends `${string}:${string}` ? true : false;

/**
 * Extract parameter names from a path string
 * Handles both :param and ...[slug] catch-all patterns
 */
export type ExtractParams<S extends string> = S extends `${string}:${string}/${infer Rest}`
  ? { [K in ExtractParamName<S>]: string } & ExtractParams<`/${Rest}`>
  : S extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : S extends `${string}:${infer Param}?`
      ? { [K in Param]?: string }
      : S extends `${string}...[${infer Slug}]`
        ? { [K in Slug]: string }
        : S extends `${string}...[${infer Slug}]?`
          ? { [K in Slug]?: string }
          : S extends `${string}:${string}${infer Rest}`
            ? ExtractParams<Rest>
            : never;

/**
 * Extract a single parameter name from a path segment
 */
type ExtractParamName<S extends string> = S extends `${string}:${infer Param}/${infer _Rest}`
  ? Param
  : S extends `${string}:${infer Param}`
    ? Param
    : S extends `${string}:${infer Param}?`
      ? Param
      : never;

/**
 * Helper to get required params from a path
 */
export type RequiredParams<S extends string> = {
  [K in keyof ExtractParams<S> as ExtractParams<S>[K] extends undefined
    ? never
    : K]: ExtractParams<S>[K];
};

/**
 * Helper to get optional params from a path
 */
export type OptionalParams<S extends string> = {
  [K in keyof ExtractParams<S> as ExtractParams<S>[K] extends undefined
    ? K
    : never]?: ExtractParams<S>[K];
};

/**
 * Extract the search params type from a validation function return
 */
export type SearchParams<T> = T extends { search: infer S } ? S : {};

/**
 * Check if route has path parameters
 */
export type HasPathParams<S extends string> = HasColonParam<S>;

/**
 * Build the full params type for a route
 */
export type RouteParams<Path extends string> = Path extends `${string}...[${string}]${string}`
  ? ExtractParams<Path>
  : RequiredParams<Path> & OptionalParams<Path>;

/**
 * Infer the complete route type from createRoute
 */
export type InferRouteType<T> = T extends { path: infer Path; validate: infer Validate }
  ? {
      path: Path;
      params: Path extends string ? RouteParams<Path> : never;
      search: T extends { validate: (params: any) => infer R } ? SearchParams<R> : {};
    }
  : never;

/**
 * Utility to make all properties of T optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Utility to merge two types
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Mark required fields in T with keys K
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Mark optional fields in T with keys K
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
