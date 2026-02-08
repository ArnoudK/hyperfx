/**
 * Router factory - creates a typesafe router with signals and components
 */

import { createSignal, createEffect, createMemo, ReactiveSignal, JSXElement } from "hyperfx";
import type { RouteDefinition, RouteMatch } from "./createRoute";
import { matchFirst } from "./createRoute";
import { parseUrl, parseSearchParams } from "./path";

export type NavigateOptions = {
  replace?: boolean;
  scroll?: boolean;
};

interface RouterState<R extends RouteDefinition<any>> {
  currentPath: ReactiveSignal<string>;
  currentSearch: ReactiveSignal<Record<string, string | string[]>>;
  currentMatch: ReactiveSignal<RouteMatch<R> | null>;
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
  const currentPath = createSignal<string>("/");
  const currentSearch = createSignal<Record<string, string | string[]>>({});
  const currentMatch = createMemo(() => matchFirst(routes, currentPath(), currentSearch()));

  const navigate = (path: string, options?: NavigateOptions) => {
    const replace = options?.replace ?? false;
    const scroll = options?.scroll ?? true;

    const { path: newPath, search } = parseUrl(path);
    currentPath(newPath);
    currentSearch(search);

    if (isBrowser()) {
      if (replace) {
        window.history.replaceState({}, "", path);
      } else {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new CustomEvent("hfx:navigate"));
      }

      if (scroll) {
        window.scrollTo(0, 0);
      }
    }
  };

  const Link = function Link(props: LinkProps<R>) {
    const paramKeys = createMemo(() => props.to.path.match(/:(\w+)/g) || []);
    const path = createMemo(() =>
      paramKeys().reduce((result: string, match: string) => {
        const key = match.slice(1);
        return result.replace(match, String(props.params?.[key] ?? ""));
      }, props.to.path),
    );

    const searchEntries = createMemo(() =>
      Object.entries(props.search ?? {}).filter(([, v]) => v !== undefined && v !== null),
    );
    const searchString = createMemo(() =>
      searchEntries()
        .map(([k, v]) => `${k}=${v}`)
        .join("&"),
    );
    const fullPath = createMemo(() => (searchString() ? `${path()}?${searchString()}` : path()));

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
    const initialPath = props.initialPath ?? "/";
    const initialSearch = props.initialSearch ?? {};
    const notFound = props.notFound;
    const onRouteChange = props.onRouteChange;

    currentPath(initialPath);
    currentSearch(initialSearch);

    createEffect(() => {
      const match = currentMatch();
      onRouteChange?.(match ?? null);
    });

    createEffect(() => {
      if (isBrowser()) {
        const handleNavigate = () => {
          const pathname = window.location.pathname;
          const searchString = window.location.search;
          currentPath(pathname);
          currentSearch(parseSearchParams(searchString));
        };

        window.addEventListener("navigate", handleNavigate);
        window.addEventListener("hfx:navigate", handleNavigate);
        return () => {
          window.removeEventListener("hfx:navigate", handleNavigate);
          window.removeEventListener("navigate", handleNavigate);
        };
      }
    });

    return createMemo(() => {
      const match = currentMatch();
      const path = currentPath();
      if (match) {
        return match.route.view(match.params);
      }

      if (notFound) return notFound({ path });
      return null;
    });
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
