/**
 * Router factory - creates a typesafe router with signals and components
 */

import { createEffect, createComputed, JSXElement, Signal, createSignal, untrack } from "hyperfx";
import { markerSlot } from "hyperfx/runtime-dom";
import type { RouteDefinition, RouteMatch, RouteError, InferRouteProps } from "./types";
import { matchFirst } from "./createRoute";
import { parseUrl, parseSearchParams } from "./path";

export type NavigateOptions = {
  replace?: boolean;
  scroll?: boolean;
};

interface RouterState<R extends RouteDefinition<any>> {
  currentPath: Signal<string>;
  currentSearch: Signal<Record<string, string | string[]>>;
  currentMatch: Signal<RouteMatch<R> | null>;
  navigate: (path: string, options?: NavigateOptions) => void;
  routes: R[];
}

interface RouterProps<R extends RouteDefinition<any>> {
  routes: R[];
  initialPath?: string;
  initialSearch?: Record<string, string | string[]>;
  notFound?: (props: { path: string }) => JSXElement;
  onRouteChange?: (match: RouteMatch<R> | null) => void;
  onRouteError?: (error: NonNullable<RouteMatch<R>["error"]>) => JSXElement;
}

interface LinkProps<R extends RouteDefinition<any>> {
  to: R;
  params?: InferRouteProps<R>["params"];
  search?: InferRouteProps<R>["search"];
  class?: string;
  children: any;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function createRouter<R extends RouteDefinition<any>>(routes: R[]) {
  const [currentPath, setCurrentPath] = createSignal<string>("/");
  const [currentSearch, setCurrentSearch] = createSignal<Record<string, string | string[]>>({});

  const currentMatch = createComputed(() => {
    const path = currentPath();
    const search = currentSearch();
    const match = matchFirst(routes, path, search);
    if (!match || match.error) return match;

    const route = match.route;
    let validatedParams = match.params;
    let validatedSearch = match.search;
    let error: RouteError | undefined;

    const paramsValidator = route._paramsValidator as ((raw: typeof match.params) => any) | undefined;
    if (paramsValidator) {
      try {
        validatedParams = paramsValidator(match.params);
      } catch (e) {
        error = { type: "params", message: e instanceof Error ? e.message : "Invalid params", details: e };
      }
    }

    const searchValidator = route._searchValidator as ((raw: typeof match.search) => any) | undefined;
    if (searchValidator) {
      try {
        validatedSearch = searchValidator(match.search);
      } catch (e) {
        error = error || { type: "search", message: e instanceof Error ? e.message : "Invalid search params", details: e };
      }
    }

    return error
      ? { ...match, error, params: validatedParams, search: validatedSearch }
      : { ...match, params: validatedParams, search: validatedSearch };
  });

  const navigate = (path: string, options?: NavigateOptions) => {
    const replace = options?.replace ?? false;
    const scroll = options?.scroll ?? true;

    const { path: newPath, search } = parseUrl(path);
    setCurrentPath(newPath);
    setCurrentSearch(search);

    if (isBrowser()) {
      if (replace) {
        window.history.replaceState({}, "", path);
      } else {
        window.history.pushState({}, "", path);
      }

      window.dispatchEvent(new CustomEvent("hfx:navigate"));

      if (scroll) {
        window.scrollTo(0, 0);
      }
    }
  };

  const Link = function Link(props: LinkProps<R>) {
    const paramKeys = createComputed(() => {
      const matches = props.to.path.match(/:(\w+)/g) || [];
      const arrayMatches = props.to.path.match(/\[(\w+)\]/g) || [];
      return [...matches, ...arrayMatches];
    });

    const path = createComputed<string>(() => {
      let result = props.to.path;
      for (const key of paramKeys()) {
        const paramKey = key.replace(/[:\[\]]/g, "");
        const value = props.params?.[paramKey as keyof typeof props.params];
        if (Array.isArray(value)) {
          result = result.replace(key, value.join("/"));
        } else if (value !== undefined) {
          result = result.replace(key, String(value));
        }
      }
      return result;
    });

    const searchEntries = createComputed(() =>
      Object.entries(props.search ?? {}).filter(([, v]) => v !== undefined && v !== null),
    );
    const searchString = createComputed(() =>
      searchEntries()
        .map(([k, v]) => `${k}=${v}`)
        .join("&"),
    );
    const fullPath = createComputed(() => (searchString() ? `${path()}?${searchString()}` : path()));

    return (
      <a
        href={fullPath()}
        class={props.class}
        onclick={(e: MouseEvent) => {
          e.preventDefault();
          navigate(fullPath());
        }}
      >
        {props.children}
      </a>
    );
  };

  function Router(props: Omit<RouterProps<R>, "routes">) {
    let initialized = false;

    createEffect(() => {
      if (initialized) return;
      initialized = true;

      if (props.initialPath) {
        const { path, search } = parseUrl(props.initialPath);
        setCurrentPath(path);
        setCurrentSearch(search);
        return;
      }

      if (props.initialSearch) {
        setCurrentSearch(props.initialSearch);
      }
    });

    createEffect(() => {
      if (isBrowser()) {
        const handleNavigate = () => {
          const pathname = window.location.pathname;
          const searchString = window.location.search;
          setCurrentPath(pathname);
          setCurrentSearch(parseSearchParams(searchString));
        };

        window.addEventListener("popstate", handleNavigate);
        window.addEventListener("hfx:navigate", handleNavigate);
        return () => {
          window.removeEventListener("hfx:navigate", handleNavigate);
          window.removeEventListener("popstate", handleNavigate);
        };
      }
    });

    createEffect(() => {
      if (props.onRouteChange) {
        props.onRouteChange(currentMatch());
      }
    });

    const renderRoute = () => {
      const match = currentMatch();
      if (!match) {
        if (props.notFound) {
          return untrack(() => props.notFound!({ path: currentPath() }));
        }
        return null;
      }

      const error = match.error;
      if (error) {
        const onRouteError = props.onRouteError;
        if (onRouteError) {
          return untrack(() => onRouteError(error));
        }
        return untrack(() => (
          <div style={{ color: "red", padding: "20px" }}>
            Route Error: {error.message}
          </div>
        ));
      }

      const view = match.route.view;
      if (!view) {
        return null;
      }
      return untrack(() => view({ params: match.params, search: match.search }));
    };

    if (typeof document === "undefined") {
      return renderRoute();
    }

    return markerSlot(renderRoute, "hfx:router");
      
  }

  return {
    Router,
    Link,
    currentPath,
    currentSearch,
    currentMatch,
    navigate,
    routes,
  };
}

export type { RouterState };
