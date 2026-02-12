/**
 * Router factory - creates a typesafe router with signals and components
 */

import { createEffect, createComputed, JSXElement, Signal, createSignal, untrack } from "hyperfx";
import { markerSlot } from "hyperfx/runtime-dom";
import type { RouteDefinition, RouteMatch } from "./createRoute";
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
}

interface LinkProps<R extends RouteDefinition<any>> {
  to: R;
  params?: Record<string, any>;
  search?: Record<string, any>;
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
    return matchFirst(routes, path, search);
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
    const paramKeys = createComputed(() => props.to.path.match(/:(\w+)/g) || []);
    const path = createComputed<string>(() =>
      paramKeys().reduce((result: string, match: string) => {
        const key = match.slice(1);
        return result.replace(match, String(props.params?.[key] ?? ""));
      }, props.to.path),
    );

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
      if (match) {
        return untrack(() => match.route.view(match.params));
      }

      if (props.notFound) {
        return untrack(() => props.notFound!({ path: currentPath() }));
      }

      return null;
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
