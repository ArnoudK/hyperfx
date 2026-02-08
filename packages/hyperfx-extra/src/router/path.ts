/**
 * Path parsing and matching utilities
 */

export interface ParsedPath {
  segments: PathSegment[];
  hasCatchAll: boolean;
  catchAllParam?: string;
}

export type PathSegment =
  | { type: "static"; value: string }
  | { type: "param"; name: string; optional: boolean }
  | { type: "catchAll"; name: string; optional?: boolean };

const COLON_PARAM_REGEX = /:([^/?]+)/g;
const CATCH_ALL_REGEX = /\.\.\.\[([^\]]+)\]/g;
const OPTIONAL_PARAM_REGEX = /:([^?]+)\?/g;

/**
 * Parse a path string into segments for matching
 */
export function parsePath(path: string): ParsedPath {
  const segments: PathSegment[] = [];
  let hasCatchAll = false;
  let catchAllParam: string | undefined;

  const pathParts = path.split("/").filter(Boolean);

  for (const part of pathParts) {
    // Check for catch-all pattern ...[slug] or optional ...[slug]?
    if (part.startsWith("...[") && (part.endsWith("]") || part.endsWith("]?"))) {
      const isOptional = part.endsWith("]?");
      const paramName = isOptional ? part.slice(4, -2) : part.slice(4, -1);
      segments.push({ type: "catchAll", name: paramName, optional: isOptional });
      hasCatchAll = true;
      catchAllParam = paramName;
      continue;
    }

    // Check for optional param :param?
    if (part.startsWith(":") && part.endsWith("?")) {
      const paramName = part.slice(1, -1);
      segments.push({ type: "param", name: paramName, optional: true });
      continue;
    }

    // Check for required param :param
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      segments.push({ type: "param", name: paramName, optional: false });
      continue;
    }

    // Static segment
    segments.push({ type: "static", value: part });
  }

  return { segments, hasCatchAll, catchAllParam };
}

/**
 * Build a regex for matching a path against a route pattern
 */
export function buildMatchRegex(parsed: ParsedPath): RegExp {
  let pattern = "";

  for (let i = 0; i < parsed.segments.length; i++) {
    const segment = parsed.segments[i]!;

    if (segment.type === "static") {
      pattern += `/${escapeRegExp(segment.value)}`;
      continue;
    }

    if (segment.type === "param") {
      if (segment.optional) {
        // If previous segment was a static part, make the whole '/static/:param?' optional
        const prev = parsed.segments[i - 1];
        if (prev && prev.type === "static") {
          const staticPart = escapeRegExp(prev.value);
          const lastIndex = pattern.lastIndexOf(`/${staticPart}`);
          if (lastIndex !== -1) {
            // remove the previously added static segment and replace with optional group
            pattern = pattern.slice(0, lastIndex);
            pattern += `(?:/${staticPart}(?:/([^/]*))?)?`;
          } else {
            pattern += `(?:/([^/]*))?`;
          }
        } else {
          pattern += `(?:/([^/]*))?`;
        }
      } else {
        pattern += `/([^/]+)`;
      }
      continue;
    }

    if (segment.type === "catchAll") {
      // allow optional presence of slash + catch-all; capture the rest
      pattern += `(?:/(.*))?`;
      continue;
    }
  }

  return new RegExp(`^${pattern}(/.*)?$`, "i");
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Match a URL path against a route pattern
 * Returns null if no match, or the extracted params
 */
export function matchPath(
  urlPath: string,
  routePath: string,
): {
  match: boolean;
  params: Record<string, string | undefined>;
  matchedPath: string;
} | null {
  // Check for multiple consecutive slashes - these should not match
  if (urlPath.includes("//")) {
    return null;
  }

  const parsed = parsePath(routePath);
  const regex = buildMatchRegex(parsed);

  // Normalize URL path - ensure it starts with /
  const normalizedUrlPath = urlPath.startsWith("/") ? urlPath : "/" + urlPath;

  const match = normalizedUrlPath.match(regex);

  if (!match) {
    return null;
  }

  const params: Record<string, string | undefined> = {};

  let paramIndex = 1;
  for (const segment of parsed.segments) {
    if (segment.type === "param") {
      params[segment.name] = match[paramIndex] !== undefined ? match[paramIndex] : undefined;
      paramIndex++;
    } else if (segment.type === "catchAll") {
      const value = match[paramIndex];
      // If catch-all segment is present, keep empty string; if absent and optional then undefined
      if (value !== undefined) {
        params[segment.name] = value.replace(/^\//, "");
      } else {
        params[segment.name] = segment.optional ? undefined : "";
      }
      paramIndex++;
    }
  }

  return {
    match: true,
    params,
    matchedPath: match[0] || urlPath,
  };
}

/**
 * Build a URL from a path pattern and params
 */
export function buildPath(path: string, params: Record<string, string | undefined>): string {
  let result = path;

  for (const [key, value] of Object.entries(params)) {
    const strValue = value != null ? String(value) : "";
    if (value != null) {
      result = result.replace(new RegExp(`:${key}\\??`, "g"), strValue);
    }
  }

  // Replace catch-all placeholders with provided values or remove them
  result = result.replace(/\.\.\.\[([^\]]+)\]\??/g, (_m, p1) => {
    const val = (params as Record<string, string | undefined>)[p1];
    return val != null ? String(val) : "";
  });

  // Remove any leftover optional param segments (including the preceding slash)
  result = result.replace(/\/?[^/]*:\w+\?/g, "");

  // Cleanup trailing slashes
  result = result.replace(/\/+$/, "");

  return result || "/";
}

/**
 * Extract path segments from a URL
 */
export function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

/**
 * Check if a path matches exactly (no trailing segments)
 */
export function isExactMatch(urlPath: string, routePath: string): boolean {
  const normalizedUrl = urlPath.replace(/\/$/, "");
  const normalizedRoute = routePath.replace(/\/$/, "");

  return normalizedUrl === normalizedRoute || normalizedUrl.startsWith(normalizedRoute + "/");
}

/**
 * Parse search params from a URL string
 */
export function parseSearchParams(url: string): Record<string, string | string[]> {
  const searchStart = url.indexOf("?");
  if (searchStart === -1) {
    return {};
  }

  const search = url.slice(searchStart + 1);
  const params: Record<string, string | string[]> = {};
  const pairs = search.split("&");

  for (const pair of pairs) {
    const parts = pair.split("=");
    const key = decodeURIComponent(parts[0] || "");
    const value = decodeURIComponent(parts.slice(1).join("="));

    if (key in params) {
      const existing = params[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        params[key] = [existing as string, value];
      }
    } else {
      params[key] = value;
    }
  }

  return params;
}

/**
 * Build search params string from an object
 */
export function buildSearchString(params: Record<string, any>): string {
  const pairs: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const v of value) {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
      }
    } else {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }

  return pairs.length > 0 ? "?" + pairs.join("&") : "";
}

/**
 * Parse the full URL into path and search
 */
export function parseUrl(url: string): {
  path: string;
  search: Record<string, string | string[]>;
  raw: string;
} {
  const hashIndex = url.indexOf("#");
  const pathAndSearch = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const questionIndex = pathAndSearch.indexOf("?");

  if (questionIndex < 0) {
    return {
      path: pathAndSearch || "/",
      search: {},
      raw: url,
    };
  }

  const path = pathAndSearch.slice(0, questionIndex);
  const searchPart = pathAndSearch.slice(questionIndex);

  return {
    path: path || "/",
    search: parseSearchParams(searchPart),
    raw: url,
  };
}
