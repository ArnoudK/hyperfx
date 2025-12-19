import HomePage from "./homepage";
import AboutPage from "./about";
import ProductsPage from "./products";
import { JSX } from "hyperfx/jsx/jsx-runtime";

/**
 * Route configuration for SSR and client-side routing
 */
export interface RouteConfig {
  path: string;
  component: () => JSX.Element;
  title: string;
  description?: string;
}

/**
 * All application routes
 */
export const routes: Record<string, RouteConfig> = {
  '/': {
    path: '/',
    component: HomePage,
    title: 'Home - HyperFX SSR Example',
    description: 'Modern SSR framework with reactive JSX components'
  },
  '/about': {
    path: '/about',
    component: AboutPage,
    title: 'About - HyperFX SSR Example',
    description: 'Learn about HyperFX - a modern SSR framework with JSX support'
  },
  '/products': {
    path: '/products',
    component: ProductsPage,
    title: 'Products - HyperFX SSR Example',
    description: 'Browse our product showcase with interactive cart'
  }
};

/**
 * Get route configuration by pathname
 */
export function getRoute(pathname: string): RouteConfig | null {
  // Normalize pathname (remove trailing slash unless it's root)
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  return routes[normalized] || null;
}

/**
 * Get all route paths
 */
export function getAllRoutePaths(): string[] {
  return Object.keys(routes);
}
