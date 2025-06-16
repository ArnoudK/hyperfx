import { BaseFileSystemRouter } from "vinxi/fs-router";

/**
 * Custom file system router for HyperFX SSR routes
 */
export class HyperFXFileSystemRouter extends BaseFileSystemRouter {
  /**
   * Convert file path to route path
   * Examples:
   * - index.ts -> /
   * - about.ts -> /about
   * - products/index.ts -> /products
   * - products/[id].ts -> /products/:id
   */
  toPath(filePath: string): string {
    let routePath = filePath
      .replace(/\.(ts|tsx|js|jsx)$/, '') // Remove file extension
      .replace(/\/index$/, '') // Convert /index to /
      .replace(/\[([^\]]+)\]/g, ':$1'); // Convert [param] to :param
    
    // Ensure root path
    if (routePath === '' || routePath === 'index') {
      routePath = '/';
    } else if (!routePath.startsWith('/')) {
      routePath = '/' + routePath;
    }
    
    return routePath;
  }

  /**
   * Convert file path to route object
   */
  toRoute(filePath: string) {
    return {
      path: this.toPath(filePath),
      $component: {
        src: filePath,
        pick: ["default"],
      },
    };
  }
}
