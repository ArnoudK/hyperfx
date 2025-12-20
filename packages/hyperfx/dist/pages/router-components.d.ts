import { ReactiveSignal } from "../reactive/state";
import type { JSXElement, FunctionComponent, JSXChildren } from "../jsx/jsx-runtime";
/**
 * Router Component - Root routing context provider
 */
interface RouterProps {
    children?: JSXChildren | (() => JSXElement);
    initialPath?: string;
}
export declare function Router(props: RouterProps): JSXElement;
/**
 * Route Component - Renders content based on path matching
 */
interface RouteProps {
    path: string;
    component?: FunctionComponent;
    children?: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
    exact?: boolean;
    [key: string]: any;
}
export declare function Route(props: RouteProps): DocumentFragment;
/**
 * Link Component - Navigation link
 */
interface LinkProps {
    to: string;
    children: JSXElement | JSXElement[] | string;
    class?: string;
    activeClass?: string;
    exact?: boolean;
    replace?: boolean;
    onClick?: (event: MouseEvent) => void;
}
export declare function Link(props: LinkProps): JSXElement;
/**
 * Navigate Programmatically
 */
export declare function navigate(path: string, options?: {
    replace?: boolean;
}): void;
/**
 * Use current path in components
 */
export declare function usePath(): ReactiveSignal<string>;
/**
 * Use navigation function in components
 */
export declare function useNavigate(): (path: string, options?: {
    replace?: boolean;
}) => void;
/**
 * Outlet Component - For nested routing (placeholder for future implementation)
 */
export declare function Outlet(props: {
    children?: JSXElement | JSXElement[];
}): JSXElement;
/**
 * Switch Component - Renders first matching route
 */
export declare function Switch(props: {
    children: JSXElement | JSXElement[];
}): JSXElement;
/**
 * Redirect Component - Programmatic redirect
 */
export declare function Redirect(props: {
    to: string;
    replace?: boolean;
}): JSXElement;
/**
 * Get query parameter value from current URL as a reactive signal
 */
export declare function getQueryValue(name: string): ReactiveSignal<string | null>;
/**
 * Get all query parameter values for a name as a reactive signal
 */
export declare function getQueryValues(name: string): ReactiveSignal<string[]>;
/**
 * Get route parameter (placeholder for future implementation with dynamic routes)
 */
export declare function getParam(name: string): ReactiveSignal<string | undefined>;
export { Router as BrowserRouter };
export { Route as RouteComponent };
export { Link as NavLink };
