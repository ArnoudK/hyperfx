import { createSignal, createEffect, createComputed, ReactiveSignal } from "../reactive/state";
import type { JSXElement, ComponentProps, FunctionComponent, JSXChildren } from "../jsx/jsx-runtime";
import {
  isSSR,
  createRouterFragment,
  createRouterComment,
  createRouterText,
  insertBefore,
  removeChild,
  type UniversalFragment,
  type UniversalComment,
  type UniversalNode,
  type UniversalContainer,
} from './router-helpers';

/**
 * SSR-safe element creation
 * On client: uses document.createElement
 * On server: creates a minimal mock that satisfies JSXElement interface
 */
function createSafeElement(tag: string): any {
  if (typeof document !== 'undefined') {
    return document.createElement(tag);
  }
  
  // Server: return a mock element structure
  // This will be processed by the server's renderToString which expects HTMLElement-like objects
  // However, our new virtual node system doesn't use these...
  // The issue is that JSXElement type is defined as HTMLElement | DocumentFragment | Text | Comment
  // But on the server we use VirtualNodes
  
  // For now, create a minimal mock that has the properties we use
  const mock: any = {
    tagName: tag.toUpperCase(),
    children: [] as any[],
    childNodes: [] as any[],
    className: '',
    href: '',
    textContent: '',
    attributes: [],
    classList: {
      add: () => {},
      remove: () => {},
    },
    style: {},
    setAttribute: () => {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: function(child: any) {
      this.children.push(child);
      this.childNodes.push(child);
      return child;
    },
    removeChild: function(child: any) {
      const idx = this.children.indexOf(child);
      if (idx > -1) this.children.splice(idx, 1);
      const idx2 = this.childNodes.indexOf(child);
      if (idx2 > -1) this.childNodes.splice(idx2, 1);
    },
    replaceChild: function(newChild: any, oldChild: any) {
      const idx = this.children.indexOf(oldChild);
      if (idx > -1) this.children[idx] = newChild;
      const idx2 = this.childNodes.indexOf(oldChild);
      if (idx2 > -1) this.childNodes[idx2] = newChild;
    },
  };
  
  return mock;
}

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

import { createContext, useContext, pushContext, popContext } from "../reactive/context";

/**
 * Global router context
 */
const RouterContext = createContext<RouterContext | null>(null);

/**
 * Router Component - Root routing context provider
 */
interface RouterProps {
  children?: JSXChildren | (() => JSXElement);
  initialPath?: string;
}

export function Router(props: RouterProps): JSXElement {
  // Use existing context if nested (though this simple router might not fully support nesting yet)
  const parentContext = useContext(RouterContext);
  if (parentContext) {
    console.warn('Router: Nested routers are not fully supported yet');
  }

  // Determine initial path safely for SSR
  const getInitialPath = () => {
    if (props.initialPath) {
      return props.initialPath;
    }
    // During SSR, window might be from happy-dom - use initialPath or default to '/'
    if (typeof window !== 'undefined' && window.location) {
      return window.location.pathname + window.location.search;
    }
    return '/';
  };

  const currentPath = createSignal(getInitialPath());
  const historyStack = createSignal<string[]>([currentPath()]);
  const historyIndex = createSignal(0);

  // Check if we're in a browser environment (not SSR)
  const isBrowser = typeof window !== 'undefined' && typeof window.addEventListener === 'function' && 
                    typeof window.history !== 'undefined';

  // Set up navigation effects only in browser
  if (isBrowser) {
    createEffect(() => {
      // Handle browser navigation
      const handlePopState = (): void => {
        const newPath = (window.location.pathname + window.location.search) || '/';
        currentPath(newPath);
        const newStack = [...historyStack()];
        newStack[historyIndex()] = newPath;
        historyStack(newStack);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      }
    });
  }

  const navigate = (path: string, options: { replace?: boolean } = {}): void => {
    if (isBrowser) {
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
    }
    currentPath(path);
  };

  const back = (): void => {
    if (isBrowser && historyIndex() > 0) {
      const newIndex = historyIndex() - 1;
      historyIndex(newIndex);
      const path = historyStack()[newIndex] || '/';
      window.history.back();
      currentPath(path);
    }
  };

  const forward = (): void => {
    if (isBrowser && historyIndex() < historyStack().length - 1) {
      const newIndex = historyIndex() + 1;
      historyIndex(newIndex);
      const path = historyStack()[newIndex] || '/';
      window.history.forward();
      currentPath(path);
    }
  };

  const context: RouterContext = {
    currentPath,
    navigate,
    back,
    forward,
  };

  // Use Provider to pass context to children
  const result = RouterContext.Provider({
    value: context,
    children: () => {
      // Render children - handle both function and direct children
      if (typeof props.children === 'function') {
        return props.children();
      }
      return props.children as JSXElement;
    }
  });
  
  return result;
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

export function Route(props: RouteProps): UniversalFragment {
  const fragment = createRouterFragment();
  const startMarker = createRouterComment(`Route start: ${props.path}`);
  const endMarker = createRouterComment(`Route end: ${props.path}`);

  // Append markers to fragment
  if (isSSR()) {
    // Server: manually add to virtual fragment's children array
    const virtualFragment = fragment as any;
    virtualFragment.children.push(startMarker, endMarker);
  } else {
    // Client: use DOM API
    (fragment as DocumentFragment).appendChild(startMarker as Comment);
    (fragment as DocumentFragment).appendChild(endMarker as Comment);
  }

  let renderedNodes: UniversalNode[] = [];
  let wasMatched = false;

  // Extract Route-specific props, pass the rest to the child component
  const { path, component, children, exact, ...restProps } = props;

  // DON'T capture context during construction - defer it to render time
  // This is crucial for SSR where Route is created before Router Provider runs
  let context: RouterContext | null = null;

  // Helper function to render route content
  const renderRouteContent = () => {
    // Lazily get context on first render if we don't have it yet
    if (!context) {
      context = useContext(RouterContext);
    }
    
    if (!context) return;

    const currentPath = context.currentPath;
    const currentPathValue = currentPath();
    const pathWithoutQuery = currentPathValue.split('?')[0]!;
    const matches = (exact !== undefined ? exact : false)
      ? pathWithoutQuery === path
      : pathWithoutQuery.startsWith(path);

    // Skip if no change in match state AND we've already rendered
    if (matches === wasMatched && renderedNodes.length > 0) {
      return;
    }
    wasMatched = matches;

    // Determine parent container
    let currentParent: UniversalContainer;
    if (isSSR()) {
      // Server: fragment is the parent
      currentParent = fragment as UniversalContainer;
    } else {
      // Client: use parentNode if available, otherwise fragment
      currentParent = ((startMarker as Comment).parentNode || fragment) as UniversalContainer;
    }

    // Remove old nodes from currentParent
    renderedNodes.forEach(node => {
      if (isSSR()) {
        // Server: remove from virtual children
        removeChild(currentParent, node);
      } else {
        // Client: check if node is still in parent before removing
        const domNode = node as Node;
        if (domNode.parentNode === currentParent) {
          (currentParent as Node).removeChild(domNode);
        }
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
          if (isSSR()) {
            // Server: insert before endMarker in virtual children array
            const virtualParent = currentParent as any;
            const endIndex = virtualParent.children.indexOf(endMarker);
            if (endIndex !== -1) {
              virtualParent.children.splice(endIndex, 0, node);
            } else {
              virtualParent.children.push(node);
            }
            renderedNodes.push(node);
          } else {
            // Client: DOM manipulation
            if (node instanceof Node) {
              (currentParent as Node).insertBefore(node, endMarker as Comment);
              renderedNodes.push(node);
            } else if (node != null) {
              // Handle primitives by converting to text nodes
              const textNode = createRouterText(String(node));
              (currentParent as Node).insertBefore(textNode as Text, endMarker as Comment);
              renderedNodes.push(textNode);
            }
          }
        });
      }
    }
  };

  // SSR: render once, synchronously (static rendering - matched route only)
  if (isSSR()) {
    renderRouteContent();
  } else {
    // Client: reactive rendering with effects
    createEffect(renderRouteContent);
  }

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
  onclick?: (event: MouseEvent) => void;
}

export function Link(props: LinkProps): JSXElement {
  const link = createSafeElement('a');
  link.href = props.to;
  link.className = props.class !== undefined ? props.class : '';

  // Skip interactive behavior on server
  if (typeof document === 'undefined') {
    // Server-side: just add children and return
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

  // Client: full interactive link with routing
  // Capture context during render
  const context = useContext(RouterContext);
  // console.log('Link: render', props.to, 'context:', !!context);

  // Handle clicks
  const handleClick = (event: MouseEvent): void => {
    //console.log('Link: clicked', props.to);
    event.preventDefault();

    if (props.onclick) {
      props.onclick(event);
    }

    if (context) {
      context.navigate(props.to, { replace: props.replace !== undefined ? props.replace : false });
    } else {
      // Fallback if router not initialized yet
      window.history.pushState({}, '', props.to);
      // Dispatch popstate event so other listeners (e.g. separate routers) might notice, 
      // though standard pushState doesn't do this. 
      // Ideally we should dispatch a custom event or manually trigger listeners.
      // But standard router behavior relies on the context.navigate above.

      // If we are here, we are outside a Router context. 
      // If there IS a Router mounted somewhere else (unlikely in this architecture), it relies on popstate.
      // We can manually dispatch valid popstate to notify others.
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  link.addEventListener('click', handleClick);

  // Update active class based on current path
  createEffect(() => {
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
  // NOTE: This global navigate function cannot use useContext efficiently
  // because it's called outside of component rendering.
  // It might need to be deprecated or we need a way to access the "topmost" router.
  // For now, we'll try to fallback to window history API, but context access is lost.
  console.warn("Global navigate() function called. This may not work with Context-based router. Use useNavigate() hook instead.");

  // Fallback to direct navigation
  if (options.replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }
}

/**
 * Use current path in components
 */
export function usePath(): ReactiveSignal<string> {
  const context = useContext(RouterContext);
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
  // Capture context at hook call time
  const context = useContext(RouterContext);
  return (path: string, options?: { replace?: boolean }) => {
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
    const container = createSafeElement('div');
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

  const outlet = createSafeElement('div');
  outlet.className = 'router-outlet';
  outlet.textContent = 'Outlet placeholder';
  return outlet;
}

/**
 * Switch Component - Renders first matching route
 */
export function Switch(props: { children: JSXElement | JSXElement[] }): JSXElement {
  const container = createSafeElement('div');
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
export function Redirect(props: { to: string; replace?: boolean }): UniversalComment {
  const context = useContext(RouterContext);
  if (context) {
    context.navigate(props.to, { replace: props.replace !== undefined ? props.replace : false });
  } else if (!isSSR()) {
    // Only create effect on client - no-op on server
    createEffect(() => {
      const ctx = useContext(RouterContext);
      if (ctx) {
        ctx.navigate(props.to, { replace: props.replace !== undefined ? props.replace : false });
      }
    });
  }

  return createRouterComment('Redirect component');
}

/**
 * Get query parameter value from current URL as a reactive signal
 */
export function getQueryValue(name: string): ReactiveSignal<string | null> {
  return createComputed(() => {
    const context = useContext(RouterContext);
    context?.currentPath()
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  });
}

/**
 * Get all query parameter values for a name as a reactive signal
 */
export function getQueryValues(name: string): ReactiveSignal<string[]> {
  const context = useContext(RouterContext);
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
  const context = useContext(RouterContext);
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