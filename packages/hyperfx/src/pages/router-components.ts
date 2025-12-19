import { createSignal, createEffect, createComputed, ReactiveSignal } from "../reactive/state";
import type { JSXElement, ComponentProps, FunctionComponent, JSXChildren } from "../jsx/jsx-runtime";

/**
 * Component-Based Routing System for HyperFX
 *
 * This provides React Router-style component-based routing with
 * <Router>, <Route>, <Link>, and <Outlet> components.
 */

// Router Context
interface RouterContext {
  currentPath: ReactiveSignal<string>;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  back: () => void;
  forward: () => void;
}

/**
 * Global router context signal
 * This allows components like Link to be reactive to router availability
 */
export const routerContextSignal = createSignal<RouterContext | null>(null);

/**
 * Router Component - Root routing context provider
 */
interface RouterProps {
  children?: JSXChildren;
  initialPath?: string;
}

export function Router(props: RouterProps): JSXElement {

  // Handle re-initialization (e.g. HMR or remounting)
  if (routerContextSignal()) {
    console.warn('Router: Router already initialized, resetting context');
    // We could either bail out or reset. Resetting is safer for HMR.
    routerContextSignal(null);
  }

  const currentPath = createSignal(props.initialPath || (window.location.pathname + window.location.search));
  const historyStack = createSignal<string[]>([currentPath()]);
  const historyIndex = createSignal(0);


  // Set up navigation effects
  createEffect(() => {
    // Handle browser navigation
    const handlePopState = (): void => {
      const newPath = (window.location.pathname + window.location.search) || '/';
      currentPath(newPath);
      const stack = historyStack();
      stack[historyIndex()] = newPath;
      historyStack(stack);
      console.log('Router: Path changed to', newPath);
    };
    console.log('Router: Setting up popstate listener');
    window.addEventListener('popstate', handlePopState);
    return () => {
      console.log('Router: Removing popstate listener');
      window.removeEventListener('popstate', handlePopState);
      // Clean up global context on unmount to allow re-initialization
      routerContextSignal(null);
    }
  });

  const navigate = (path: string, options: { replace?: boolean } = {}): void => {
    if (options.replace) {
      window.history.replaceState({}, '', path);
      const newStack = [...historyStack()];
      newStack[historyIndex()] = path;
      historyStack(newStack);
    } else {
      window.history.pushState({}, '', path);
      const newStack = [...historyStack().slice(0, historyIndex() + 1), path];
      historyStack(newStack);
      historyIndex(historyIndex() + 1);
    }
    currentPath(path);
    // Context is stable, no need to update it
  };

  const back = (): void => {
    if (historyIndex() > 0) {
      const newIndex = historyIndex() - 1;
      historyIndex(newIndex);
      const path = historyStack()[newIndex] || '/';
      window.history.back();
      currentPath(path);
    }
    // Context is stable, no need to update it
  };

  const forward = (): void => {
    if (historyIndex() < historyStack().length - 1) {
      const newIndex = historyIndex() + 1;
      historyIndex(newIndex);
      const path = historyStack()[newIndex] || '/';
      window.history.forward();
      currentPath(path);
    }
    // Context is stable, no need to update it
  };

  const context: RouterContext = {
    currentPath,
    navigate,
    back,
    forward,
  };

  // Set global context signal immediately
  routerContextSignal(context);

  // Create container div
  const container = document.createElement('div');
  container.className = 'router-container';

  // Support deferred rendering (important for bottom-up JSX execution)
  let content: any;
  if (typeof props.children === 'function') {
    content = props.children();
  } else {
    content = props.children;
  }

  // Mount content
  const appendChild = (parent: HTMLElement, child: any) => {
    if (child === null || child === undefined || child === false) return;

    if (child instanceof Node) {
      parent.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach(c => appendChild(parent, c));
    } else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  };

  appendChild(container, content);

  return container;
}

/**
 * Route Component - Renders content based on path matching
 */
interface RouteProps {
  path: string;
  component?: FunctionComponent;
  children?: JSXElement | JSXElement[] | (() => JSXElement | JSXElement[]);
  exact?: boolean;
  [key: string]: any; // Allow passing props to the component
}

export function Route(props: RouteProps): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment(`Route start: ${props.path}`);
  const endMarker = document.createComment(`Route end: ${props.path}`);

  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);

  let renderedNodes: Node[] = [];
  let wasMatched = false;

  // Extract Route-specific props, pass the rest to the child component
  const { path, component, children, exact, ...restProps } = props;

  createEffect(() => {
    const context = routerContextSignal();
    // console.log('router context:', context);
    if (!context) return;

    const currentPath = context.currentPath;
    const currentPathValue = currentPath();
    const matches = (exact !== undefined ? exact : false)
      ? currentPathValue === path
      : currentPathValue.startsWith(path);

    if (matches === wasMatched) {
      return; // No change in match state, do nothing
    }
    wasMatched = matches;

    const parent = startMarker.parentNode;
    const currentParent = parent || fragment;

    // Remove old nodes from currentParent
    renderedNodes.forEach(node => {
      if (node.parentNode === currentParent) {
        // console.log('Removed old node:', node);
        node.parentNode?.removeChild(node);

      }
    });
    renderedNodes = [];

    if (matches) {
      // Render new content
      let content: any;
      if (component) {
        // Pass the rest of the props to the component
        content = component({ ...restProps } as ComponentProps);
      } else if (typeof children === 'function') {
        content = children();
      } else {
        content = children;
      }

      if (content) {
        const nodesToAdd = Array.isArray(content) ? content : [content];
        nodesToAdd.forEach(node => {
          if (node instanceof Node) {
            currentParent.insertBefore(node, endMarker);
            renderedNodes.push(node);
          } else if (node != null) {
            // Handle primitives by converting to text nodes
            const textNode = document.createTextNode(String(node));
            currentParent.insertBefore(textNode, endMarker);
            renderedNodes.push(textNode);
          }
        });
      }
    }

  });

  return fragment;
}

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

export function Link(props: LinkProps): JSXElement {
  const link = document.createElement('a');
  link.href = props.to;
  link.className = props.class !== undefined ? props.class : '';

  // Handle clicks
  const handleClick = (event: MouseEvent): void => {
    event.preventDefault();

    if (props.onClick) {
      props.onClick(event);
    }

    const context = routerContextSignal();
    if (context) {
      context.navigate(props.to, { replace: props.replace !== undefined ? props.replace : false });
    } else {
      // Fallback if router not initialized yet
      window.history.pushState({}, '', props.to);
    }
  };

  link.addEventListener('click', handleClick);

  // Update active class based on current path
  createEffect(() => {
    const context = routerContextSignal();
    if (!context) {
      return;
    };

    const currentPath = context.currentPath;
    const currentPathValue = currentPath();
    const isActive = (props.exact !== undefined ? props.exact : false)
      ? currentPathValue === props.to
      : currentPathValue.startsWith(props.to);

    const activeClassName = props.activeClass !== undefined ? props.activeClass : 'active';
    if (isActive) {
      link.classList.add(activeClassName);
    } else {
      link.classList.remove(activeClassName);
    }
  });

  // Add children
  if (typeof props.children === 'string') {
    link.textContent = props.children;
  } else if (Array.isArray(props.children)) {
    props.children.forEach((child) => {
      link.appendChild(child);
    });
  } else if (props.children) {
    link.appendChild(props.children);
  }

  return link;
}

/**
 * Navigate Programmatically
 */
export function navigate(path: string, options: { replace?: boolean } = {}): void {
  const context = routerContextSignal();
  if (context) {
    context.navigate(path, options);
  } else {
    // Fallback to direct navigation
    if (options.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
  }
}

/**
 * Use current path in components
 */
export function usePath(): ReactiveSignal<string> {
  const context = routerContextSignal();
  if (!context) {
    // Return a dummy signal if router not yet available, it will be reactive once context is set if used in effect
    return createSignal(window.location.pathname);
  }
  return context.currentPath;
}

/**
 * Use navigation function in components
 */
export function useNavigate(): (path: string, options?: { replace?: boolean }) => void {
  return (path: string, options?: { replace?: boolean }) => {
    const context = routerContextSignal();
    if (context) {
      context.navigate(path, options);
    } else {
      if (options?.replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
    }
  };
}

/**
 * Outlet Component - For nested routing (placeholder for future implementation)
 */
export function Outlet(props: { children?: JSXElement | JSXElement[] }): JSXElement {
  if (props.children) {
    const container = document.createElement('div');
    container.className = 'router-outlet';

    if (Array.isArray(props.children)) {
      props.children.forEach((child) => {
        container.appendChild(child);
      });
    } else {
      container.appendChild(props.children);
    }

    return container;
  }

  const outlet = document.createElement('div');
  outlet.className = 'router-outlet';
  outlet.textContent = 'Outlet placeholder';
  return outlet;
}

/**
 * Switch Component - Renders first matching route
 */
export function Switch(props: { children: JSXElement | JSXElement[] }): JSXElement {
  const container = document.createElement('div');
  container.className = 'router-switch';

  if (Array.isArray(props.children)) {
    props.children.forEach((child) => {
      container.appendChild(child);
    });
  } else {
    container.appendChild(props.children);
  }

  return container;
}

/**
 * Redirect Component - Programmatic redirect
 */
export function Redirect(props: { to: string; replace?: boolean }): JSXElement {
  const context = routerContextSignal();
  if (context) {
    context.navigate(props.to, { replace: props.replace !== undefined ? props.replace : false });
  } else {
    // Deferred redirect handled in effect
    createEffect(() => {
      const ctx = routerContextSignal();
      if (ctx) {
        ctx.navigate(props.to, { replace: props.replace !== undefined ? props.replace : false });
      }
    });
  }

  return document.createComment('Redirect component');
}

/**
 * Get query parameter value from current URL as a reactive signal
 */
export function getQueryValue(name: string): ReactiveSignal<string | null> {
  const context = routerContextSignal();
  return createComputed(() => {
    if (context) {
      context.currentPath(); // Track path changes
    }
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  });
}

/**
 * Get all query parameter values for a name as a reactive signal
 */
export function getQueryValues(name: string): ReactiveSignal<string[]> {
  const context = routerContextSignal();
  return createComputed(() => {
    if (context) {
      context.currentPath(); // Track path changes
    }
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.getAll(name);
  });
}

/**
 * Get route parameter (placeholder for future implementation with dynamic routes)
 */
export function getParam(name: string): ReactiveSignal<string | undefined> {
  const context = routerContextSignal();
  return createComputed(() => {
    if (context) {
      context.currentPath(); // Track path changes
    }
    // Simple extraction if name is in search as fallback or until Route integration
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name) || undefined;
  });
}

// Legacy exports for compatibility
export { Router as BrowserRouter };
export { Route as RouteComponent };
export { Link as NavLink };