/**
 * Router factory - creates a typesafe router with signals and components
 */
import { createSignal, createEffect, createMemo } from "hyperfx";
import { matchFirst } from "./createRoute";
import { parseUrl } from "./path";
function isBrowser() {
  return typeof window !== "undefined";
}
export function createRouter(routes) {
  const currentPath = createSignal("/");
  const currentSearch = createSignal({});
  const currentMatch = createMemo(() => matchFirst(routes, currentPath(), currentSearch()));
  const navigate = (path, options) => {
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
  const Link = function Link(props) {
    const paramKeys = createMemo(() => props.to.path.match(/:(\w+)/g) || []);
    const path = createMemo(() =>
      paramKeys().reduce((result, match) => {
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
        onclick={(e) => {
          e.preventDefault();
          navigate(fullPath());
        }}
      >
        {props.children}
      </a>
    );
  };
  function Router(props) {
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
        console.log("Setting up navigate listener for router");
        const handleNavigate = () => {
          const { path, search } = parseUrl(window.location.href);
          console.log("Navigate detected, navigating to:", path, search);
          currentPath(path);
          currentSearch(search);
        };
        window.addEventListener("navigate", handleNavigate);
        window.addEventListener("hfx:navigate", handleNavigate);
        return () => {
          console.log("Removing navigate listener for router");
          window.removeEventListener("hfx:navigate", handleNavigate);
          window.removeEventListener("navigate", handleNavigate);
        };
      }
    });
    return createMemo(() => {
      const match = currentMatch();
      const path = currentPath();
      console.log("Router rendering for path:", path);
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
//# sourceMappingURL=createRouter.jsx.map
