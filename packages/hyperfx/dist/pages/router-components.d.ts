import { ReactiveSignal } from "../reactive/state";
import type { JSXElement, FunctionComponent } from "../jsx/jsx-runtime";
/**
 * Router Component - Root routing context provider
 */
interface RouterProps {
    children: JSXElement | JSXElement[];
    initialPath?: string;
}
export declare function Router({ children, initialPath }: RouterProps): JSXElement;
/**
 * Route Component - Renders content based on path matching
 */
interface RouteProps {
    path: string;
    component?: FunctionComponent;
    children?: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
    exact?: boolean;
}
export declare function Route({ path, component, children, exact }: RouteProps): JSXElement;
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
export declare function Link({ to, children, class: className, activeClass: activeClassName, exact, replace, onClick }: LinkProps): JSXElement;
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
interface OutletProps {
    children?: JSXElement | JSXElement[];
}
export declare function Outlet({ children }: OutletProps): JSXElement;
/**
 * Switch Component - Renders first matching route
 */
interface SwitchProps {
    children: JSXElement | JSXElement[];
}
export declare function Switch({ children }: SwitchProps): JSXElement;
/**
 * Redirect Component - Programmatic redirect
 */
interface RedirectProps {
    to: string;
    replace?: boolean;
}
export declare function Redirect({ to, replace }: RedirectProps): JSXElement;
export { Router as BrowserRouter };
export { Route as RouteComponent };
export { Link as NavLink };
