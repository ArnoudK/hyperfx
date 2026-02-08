/**
 * Router factory - creates a typesafe router with signals and components
 */
import { ReactiveSignal, JSXElement } from "hyperfx";
import type { RouteDefinition, RouteMatch } from "./createRoute";
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
export declare function createRouter<R extends RouteDefinition<any>>(
  routes: R[],
): {
  Router: (props: Omit<RouterProps<R>, "routes">) => import("hyperfx").ComputedSignal<JSXElement>;
  Link: (props: LinkProps<R>) => JSXElement;
  currentPath: ReactiveSignal<string>;
  currentSearch: ReactiveSignal<Record<string, string | string[]>>;
  currentMatch: import("hyperfx").ComputedSignal<RouteMatch<R> | null>;
  navigate: (path: string, options?: NavigateOptions) => void;
  routes: R[];
};
export type { RouterState };
