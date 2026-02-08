/**
 * Path parsing and matching utilities
 */
export interface ParsedPath {
  segments: PathSegment[];
  hasCatchAll: boolean;
  catchAllParam?: string;
}
export type PathSegment =
  | {
      type: "static";
      value: string;
    }
  | {
      type: "param";
      name: string;
      optional: boolean;
    }
  | {
      type: "catchAll";
      name: string;
      optional?: boolean;
    };
/**
 * Parse a path string into segments for matching
 */
export declare function parsePath(path: string): ParsedPath;
/**
 * Build a regex for matching a path against a route pattern
 */
export declare function buildMatchRegex(parsed: ParsedPath): RegExp;
/**
 * Match a URL path against a route pattern
 * Returns null if no match, or the extracted params
 */
export declare function matchPath(
  urlPath: string,
  routePath: string,
): {
  match: boolean;
  params: Record<string, string | undefined>;
  matchedPath: string;
} | null;
/**
 * Build a URL from a path pattern and params
 */
export declare function buildPath(path: string, params: Record<string, string | undefined>): string;
/**
 * Extract path segments from a URL
 */
export declare function getPathSegments(path: string): string[];
/**
 * Check if a path matches exactly (no trailing segments)
 */
export declare function isExactMatch(urlPath: string, routePath: string): boolean;
/**
 * Parse search params from a URL string
 */
export declare function parseSearchParams(url: string): Record<string, string | string[]>;
/**
 * Build search params string from an object
 */
export declare function buildSearchString(params: Record<string, any>): string;
/**
 * Parse the full URL into path and search
 */
export declare function parseUrl(url: string): {
  path: string;
  search: Record<string, string | string[]>;
  raw: string;
};
