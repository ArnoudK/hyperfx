// Client-side router for SPA navigation with SSR support
import { VNode, mount, el } from "../elem/elem";
import { autoHydrate } from "../ssr/hydrate";

export interface Route {
  path: string;
  component: () => VNode;
  title?: string;
}

export interface RouterOptions {
  baseUrl?: string;
  mode?: 'history' | 'hash';
  container?: HTMLElement;
}

/**
 * Client-side router for handling navigation
 */
export class Router {
  private routes: Map<string, Route> = new Map();
  private currentRoute: string = '';
  private container: HTMLElement;
  private baseUrl: string;
  private mode: 'history' | 'hash';
  private isInitialized = false;

  constructor(options: RouterOptions = {}) {
    this.container = options.container || document.body;
    this.baseUrl = options.baseUrl || '';
    this.mode = options.mode || 'history';
  }

  /**
   * Register a route
   */
  addRoute(path: string, component: () => VNode, title?: string): void {
    this.routes.set(path, { path, component, title });
  }

  /**
   * Initialize the router
   */
  init(): void {
    if (this.isInitialized) return;

    this.isInitialized = true;

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
      const path = this.getCurrentPath();
      this.navigate(path, false); // Don't push to history on popstate
    });

    // Handle initial route
    const initialPath = this.getCurrentPath();
    this.navigate(initialPath, false);
  }

  /**
   * Navigate to a route
   */
  async navigate(path: string, pushState: boolean = true): Promise<void> {
    const route = this.routes.get(path);

    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    // Update browser history
    if (pushState && path !== this.currentRoute) {
      const url = this.baseUrl + path;
      window.history.pushState({ path }, route.title || '', url);
    }

    // Update document title
    if (route.title) {
      document.title = route.title;
    }

    // Render the new route
    try {
      // const vnode = route.component(); // Component factory is passed to autoHydrate

      const isInitialLoad = this.currentRoute === '' && path === this.getCurrentPath();
      // Check for actual SSR marker. The router assumes the first load *might* have SSR content.
      // autoHydrate will internally check for the presence of actual SSR content to decide mode.
      
      // Always call autoHydrate. It will determine if it's an SSR hydration or a fresh mount + hydration.
      autoHydrate(route.component, this.container);

      this.currentRoute = path;

      // Scroll to top on navigation (only for actual navigation, not initial load if content was already there)
      // Consider if scrolling should happen before or after potential async operations in autoHydrate if any.
      // For now, after is fine.
      if (!isInitialLoad || this.container.innerHTML === '') { // Scroll if not initial load or if container was cleared
        window.scrollTo(0, 0);
      }

    } catch (error) {
      console.error('Error navigating to route:', path, error);
    }
  }

  /**
   * Get current path from URL
   */
  private getCurrentPath(): string {
    if (this.mode === 'hash') {
      return window.location.hash.slice(1) || '/';
    } else {
      return window.location.pathname.replace(this.baseUrl, '') || '/';
    }
  }

  /**
   * Get current route
   */
  getCurrentRoute(): string {
    return this.currentRoute;
  }
}

// Global router instance
let globalRouter: Router | null = null;

/**
 * Get or create global router instance
 */
export function getRouter(options?: RouterOptions): Router {
  if (!globalRouter) {
    globalRouter = new Router(options);
  }
  return globalRouter;
}

/**
 * RouterLink Props interface for JSX
 */
export interface RouterLinkProps {
  href: string;
  className?: string;
  class?: string;
  id?: string;
  title?: string;
  target?: string;
  children?: any;
  [key: string]: any;
}

/**
 * Link component for client-side navigation (Function Component style)
 */
export function RouterLink(props: RouterLinkProps): VNode {
  const { href, target, children, className, class: cls, ...otherProps } = props;

  // Normalize class attribute (support both className and class)
  const finalClass = className || cls;
  const finalProps = finalClass ? { ...otherProps, class: finalClass } : otherProps;

  // If it's an external link or has target="_blank", use regular link behavior
  if (target === '_blank' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return el('a', { href, target, ...finalProps }, children || []);
  }

  // Internal navigation - use router
  return el('a', {
    href,
    ...finalProps,
    onclick: (event: MouseEvent) => {
      event.preventDefault();
      const router = getRouter();
      router.navigate(href);
    }
  }, children || []);
}

/**
 * Legacy Link component for VNode-style usage (backwards compatibility)
 */
export function RouterLinkVNode(
  props: {
    href: string;
    class?: string;
    id?: string;
    title?: string;
    target?: string;
  },
  children: (VNode | string)[]
): VNode {
  const { href, target, ...otherProps } = props;

  // If it's an external link or has target="_blank", use regular link behavior
  if (target === '_blank' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return el('a', { href, target, ...otherProps }, children);
  }

  // Internal navigation - use router
  return el('a', {
    href,
    ...otherProps,
    onclick: (event: MouseEvent) => {
      event.preventDefault();
      const router = getRouter();
      router.navigate(href);
    }
  }, children);
}

/**
 * Programmatic navigation helper
 */
export function navigate(path: string): void {
  const router = getRouter();
  router.navigate(path);
}

/**
 * Setup router with routes - convenience function
 */
export function setupRouter(routes: Route[], options?: RouterOptions): Router {
  const router = getRouter(options);

  routes.forEach(route => {
    router.addRoute(route.path, route.component, route.title);
  });

  router.init();
  return router;
}
