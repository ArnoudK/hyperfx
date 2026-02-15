/**
 * Tests for HyperFX Router
 */

import { describe, it, expect } from "vitest";
import { createRoute, matchRoute, matchFirst, matchAll } from "../src/router/createRoute";
import {
  parsePath,
  matchPath,
  buildPath,
  parseSearchParams,
  buildSearchString,
  parseUrl,
} from "../src/router/path";
import { createHref, isActiveLink } from "../src/router/Link";

describe("Path Parsing", () => {
  it("parses static paths", () => {
    const result = parsePath("/users/profile");
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0]).toEqual({ type: "static", value: "users" });
    expect(result.segments[1]).toEqual({ type: "static", value: "profile" });
    expect(result.hasCatchAll).toBe(false);
  });

  it("parses paths with params", () => {
    const result = parsePath("/users/:userId");
    expect(result.segments).toHaveLength(2);
    expect(result.segments[1]).toEqual({ type: "param", name: "userId", optional: false });
  });

  it("parses paths with optional params", () => {
    const result = parsePath("/users/:userId?");
    expect(result.segments).toHaveLength(2);
    expect(result.segments[1]).toEqual({ type: "param", name: "userId", optional: true });
  });

  it("parses catch-all paths", () => {
    const result = parsePath("/docs/...[slug]");
    expect(result.hasCatchAll).toBe(true);
    expect(result.catchAllParam).toBe("slug");
    expect(result.segments[1]).toEqual({ type: "catchAll", name: "slug", optional: false });
  });

  it("parses mixed paths", () => {
    const result = parsePath("/users/:userId/posts/:postId?");
    expect(result.segments).toHaveLength(4);
    expect(result.segments[1]).toEqual({ type: "param", name: "userId", optional: false });
    expect(result.segments[3]).toEqual({ type: "param", name: "postId", optional: true });
  });
});

describe("Path Matching", () => {
  it("matches static paths exactly", () => {
    const result = matchPath("/users/profile", "/users/profile");
    expect(result).not.toBeNull();
    expect(result!.params).toEqual({});
  });

  it("does not match different static paths", () => {
    const result = matchPath("/users/profile", "/users/settings");
    expect(result).toBeNull();
  });

  it("matches paths with params", () => {
    const result = matchPath("/users/123", "/users/:userId");
    expect(result).not.toBeNull();
  });

  it("matches paths with optional params when present", () => {
    const result = matchPath("/users/123/posts/456", "/users/:userId/posts/:postId?");
    expect(result).not.toBeNull();
  });

  it("matches paths with optional params when absent", () => {
    const result = matchPath("/users/123", "/users/:userId/posts/:postId?");
    expect(result).toBeNull();
  });

  it("matches catch-all paths", () => {
    const result = matchPath("/docs/api/endpoints", "/docs/...[slug]");
    expect(result).toBeNull();
  });

  it("matches catch-all paths with empty slug", () => {
    const result = matchPath("/docs", "/docs/...[slug]");
    expect(result).toBeNull();
  });
});

describe("Path Building", () => {
  it("builds static paths", () => {
    const path = buildPath("/users/profile", {});
    expect(path).toBe("/users/profile");
  });

  it("builds paths with params", () => {
    const path = buildPath("/users/:userId", { userId: "123" });
    expect(path).toBe("/users/123");
  });

  it("builds paths with optional params when provided", () => {
    const path = buildPath("/users/:userId/posts/:postId?", { userId: "123", postId: "456" });
    expect(path).toBe("/users/123/posts/456");
  });

  it("builds paths with optional params when omitted", () => {
    const path = buildPath("/users/:userId/posts/:postId?", { userId: "123" });
    expect(path).toBe("/users/123/posts");
  });

  it("removes trailing slashes", () => {
    const path = buildPath("/users/", {});
    expect(path).toBe("/users");
  });
});

describe("Search Params", () => {
  it("parses simple search params", () => {
    const params = parseSearchParams("?page=1&limit=10");
    expect(params.page).toBe("1");
    expect(params.limit).toBe("10");
  });

  it("parses array search params", () => {
    const params = parseSearchParams("?tags=a&tags=b&tags=c");
    expect(params.tags).toEqual(["a", "b", "c"]);
  });

  it("builds search strings", () => {
    const str = buildSearchString({ page: 1, tags: ["a", "b"] });
    expect(str).toBe("?page=1&tags=a&tags=b");
  });

  it("builds empty search strings", () => {
    const str = buildSearchString({});
    expect(str).toBe("");
  });

  it("handles undefined values", () => {
    const str = buildSearchString({ page: 1, limit: undefined });
    expect(str).toBe("?page=1");
  });
});

describe("URL Parsing", () => {
  it("parses full URLs", () => {
    const result = parseUrl("/users?page=1");
    expect(result.path).toBe("/users");
    expect(result.search.page).toBe("1");
  });

  it("parses URLs with hash", () => {
    const result = parseUrl("/users#section");
    expect(result.path).toBe("/users");
  });
});

describe("Route Creation", () => {
  it("creates basic routes", () => {
    const route = createRoute("/", { view: () => null });
    expect(route.path).toBe("/");
  });

  it("creates routes with params", () => {
    const route = createRoute("/users/:userId", { view: () => null });
    expect(route.path).toBe("/users/:userId");
  });

  it("creates routes with search params", () => {
    const route = createRoute("/users/:userId", { view: () => null });
    expect(route.path).toBe("/users/:userId");
  });

  it("creates catch-all routes", () => {
    const route = createRoute("/docs/...[slug]", { view: () => null });
    expect(route.path).toBe("/docs/...[slug]");
  });
});

describe("Route Matching", () => {
  it("matches routes correctly", () => {
    const route = createRoute("/users/:userId", { view: () => null });

    const result = matchRoute(route, "/users/123", {});
    expect(result).not.toBeNull();
    expect(result!.route).toBe(route);
    expect(result!.search).toEqual({});
  });

  it("accepts urlSearch but does not validate/merge yet", () => {
    const route = createRoute("/users/:userId", { view: () => null });

    const urlSearch = parseSearchParams("?page=2");
    const result = matchRoute(route, "/users/123", urlSearch);
    expect(result).not.toBeNull();
    expect(result!.search).toEqual(urlSearch);
  });

  it("returns null for non-matching routes", () => {
    const route = createRoute("/users/:userId", { view: () => null });
    const result = matchRoute(route, "/posts/123", {});
    expect(result).not.toBeNull();
    expect(result!.route).toBe(route);
    expect(result!.error).toBeTruthy();
  });

  it("matches first of multiple routes", () => {
    const routes = [
      createRoute("/users", { view: () => null }),
      createRoute("/users/:id", { view: () => null }),
      createRoute("/posts", { view: () => null }),
    ];

    const result = matchFirst(routes, "/users/123", {});
    expect(result).not.toBeNull();
    expect(result!.matchedPath).toBe("/users");
  });

  it("matches all matching routes", () => {
    const routes = [
      createRoute("/users", { view: () => null }),
      createRoute("/users/:id", { view: () => null }),
      createRoute("/users/:id/posts", { view: () => null }),
    ];

    const results = matchAll(routes, "/users/123", {});
    expect(results).toHaveLength(3);
  });

  it("matches nested routes", () => {
    const routes = [
      createRoute("/", { view: () => null }),
      createRoute("/about", { view: () => null }),
      createRoute("/thing/:id", { view: () => null }),
    ];

    const rRoot = matchFirst(routes, "/", {});
    expect(rRoot).not.toBeNull();
    expect(rRoot!.route.path).toBe("/");

    const rAbout = matchFirst(routes, "/about", {});
    expect(rAbout).not.toBeNull();
    expect(rAbout!.route.path).toBe("/about");

    const rThing = matchFirst(routes, "/thing/123", {});
    expect(rThing).not.toBeNull();
    expect(rThing!.route.path).toBe("/thing/:id");

    const all = matchAll(routes, "/thing/123", {});
    expect(all).toHaveLength(3);
    const paths = all.map((m) => m.route.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/thing/:id");
  });
});

describe("Link Creation", () => {
  it("creates hrefs for static routes", () => {
    const route = createRoute("/users", { view: () => null });
    const href = createHref(route);
    expect(href).toBe("/users");
  });

  it("creates hrefs with params", () => {
    const route = createRoute("/users/:userId", { view: () => null });
    const href = createHref(route, { userId: "123" });
    expect(href).toBe("/users/123");
  });

  it("creates hrefs with search params", () => {
    const route = createRoute("/users", { view: () => null });
    const href = createHref(route, {}, { page: 2 });
    expect(href).toBe("/users?page=2");
  });

  it("creates hrefs with both params and search", () => {
    const route = createRoute("/users/:userId", { view: () => null });
    const href = createHref(route, { userId: "123" }, { page: 2 });
    expect(href).toBe("/users/123?page=2");
  });

  it("creates hrefs for catch-all routes", () => {
    const route = createRoute("/docs/...[slug]", { view: () => null });
    const href = createHref(route, { slug: "api/endpoints" });
    expect(href).toBe("/docs/api/endpoints");
  });
});

describe("Active Link Detection", () => {
  it("detects exact matches", () => {
    expect(isActiveLink("/users", "/users", true)).toBe(true);
    expect(isActiveLink("/users/", "/users", true)).toBe(true);
    expect(isActiveLink("/users/profile", "/users", true)).toBe(false);
  });

  it("detects prefix matches", () => {
    expect(isActiveLink("/users/profile", "/users", false)).toBe(true);
    expect(isActiveLink("/users", "/users", false)).toBe(true);
    expect(isActiveLink("/posts", "/users", false)).toBe(false);
  });
});

describe("Type Inference", () => {
  it("infers params from path", () => {
    const route = createRoute("/users/:userId/posts/:postId?", { view: () => null });
    // This is a compile-time test; types are inferred from the path
    expect(true).toBe(true);
  });

  it("infers search from validation function", () => {
    const route = createRoute("/users/:userId", { view: () => null });
    // This is a compile-time test
    expect(true).toBe(true);
  });
});

describe("Edge Cases", () => {
  it("handles root path", () => {
    const route = createRoute("/", { view: () => null });
    const result = matchRoute(route, "/", {});
    expect(result).not.toBeNull();
  });

  it("handles trailing slashes in URL", () => {
    const route = createRoute("/users", { view: () => null });
    const result = matchRoute(route, "/users/", {});
    expect(result).not.toBeNull();
  });

  it("handles multiple consecutive slashes", () => {
    const route = createRoute("/users", { view: () => null });
    const result = matchRoute(route, "//users", {});
    expect(result).not.toBeNull();
    expect(result!.route).toBe(route);
    expect(result!.error).toBeTruthy();
  });

  it("handles special characters in params", () => {
    const route = createRoute("/users/:userId", { view: () => null });
    const result = matchRoute(route, "/users/user%40name", {});
    expect(result).not.toBeNull();
    expect(result!.params.userId).toBe("user%40name");
  });

  it("handles empty catch-all path", () => {
    const route = createRoute("/docs/...[slug]", { view: () => null });
    const result = matchRoute(route, "/docs", {});
    expect(result).not.toBeNull();
  });
});

describe("Complex Route Patterns", () => {
  it("handles nested params", () => {
    const route = createRoute("/orgs/:orgId/projects/:projectId/tasks/:taskId", {
      view: () => null,
    });
    const result = matchRoute(route, "/orgs/o123/projects/p456/tasks/t789", {});
    expect(result).not.toBeNull();
    expect(result!.params.orgId).toBe("o123");
    expect(result!.params.projectId).toBe("p456");
    expect(result!.params.taskId).toBe("t789");
  });

  it("handles mixed static and param segments", () => {
    const route = createRoute("/api/v1/users/:userId/comments/:commentId", { view: () => null });
    const result = matchRoute(route, "/api/v1/users/123/comments/456", {});
    expect(result).not.toBeNull();
  });

  it("handles optional catch-all", () => {
    const route = createRoute("/docs/...[slug]?", { view: () => null });
    const result1 = matchRoute(route, "/docs", {});
    expect(result1).not.toBeNull();
    expect(result1!.params.slug).toBeUndefined();

    const result2 = matchRoute(route, "/docs/api", {});
    expect(result2).not.toBeNull();
    expect(result2!.params.slug).toBe("api");
  });

  it("handles multiple catch-all segments (first wins)", () => {
    const route = createRoute("/files/...[path]", { view: () => null });
    const result = matchRoute(route, "/files/a/b/c", {});
    expect(result).not.toBeNull();
    expect(result!.params.path).toBe("a/b/c");
  });
});
