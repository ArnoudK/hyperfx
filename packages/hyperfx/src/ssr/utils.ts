// SSR utilities and common patterns - Virtual Node Implementation
import type { VirtualNode } from "../jsx/runtime/virtual-node";
import { renderToString } from "./render";

/**
 * SSR context for passing server-side data
 */
export interface SSRContext {
  url: string;
  userAgent?: string;
  isBot?: boolean;
  cookies?: Record<string, string>;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  params?: Record<string, string>;
}

/**
 * SSR page configuration
 */
export interface SSRPageConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

/**
 * HTML document options for full page rendering
 */
export interface HtmlDocumentOptions {
  title?: string;
  description?: string;
  lang?: string;
  charset?: string;
  viewport?: string;
  favicon?: string;
  inlineStyles?: string;
  inlineScripts?: string;
  bodyClass?: string;
}

/**
 * Enhanced SSR renderer with common patterns
 */
export class SSRRenderer {
  private context: SSRContext;
  private config: SSRPageConfig;

  constructor(context: SSRContext, config: SSRPageConfig = {}) {
    this.context = context;
    this.config = config;
  }

  /**
   * Render a page with full HTML document
   */
  renderPage(
    element: VirtualNode | VirtualNode[],
    options: HtmlDocumentOptions = {}
  ): string {
    return this.renderDocument(element, options);
  }

  /**
   * Render with streaming support (for large pages)
   */
  async *renderStream(
    element: VirtualNode | VirtualNode[],
    options: HtmlDocumentOptions = {}
  ): AsyncIterableIterator<string> {
    yield '<!DOCTYPE html>';
    yield `<html lang="${options.lang || 'en'}">`;
    yield '<head>';
    
    const metaTags = this.generateMetaTags(options);
    yield metaTags;
    
    yield '</head>';
    yield '<body>';
    
    // Render element in chunks
    yield this.renderPage(element);
    
    yield '</body>';
    yield '</html>';
  }

  /**
   * Render with hydration support
   */
  renderWithHydration(element: VirtualNode): {
    html: string;
    hydrationScript: string;
    fullDocument?: string;
  } {
    const { html: elementHtml, hydrationData } = renderToString(element);
    
    // Helper function to create the hydration script
    function createHydrationScript(data: unknown): string {
      return `<script type="application/json" id="__HYPERFX_HYDRATION_DATA__">${JSON.stringify(data)}</script>`;
    }

    const hydrationScript = createHydrationScript(hydrationData);
    const fullDocument = this.renderPage(element);

    return {
      html: elementHtml,
      hydrationScript,
      fullDocument
    };
  }

  /**
   * Render a full HTML document
   */
  private renderDocument(
    element: VirtualNode | VirtualNode[],
    options: HtmlDocumentOptions
  ): string {
    let elementToRender: VirtualNode;
    if (Array.isArray(element)) {
      // Create a virtual fragment for multiple elements
      elementToRender = {
        type: 'fragment',
        children: element
      };
    } else {
      elementToRender = element;
    }
    
    const { html: elementHtml } = renderToString(elementToRender);

    const metaTags = this.generateMetaTags(options);
    
    return `<!DOCTYPE html>
<html lang="${options.lang || 'en'}">
<head>
  <meta charset="${options.charset || 'UTF-8'}">
  <meta name="viewport" content="${options.viewport || 'width=device-width, initial-scale=1.0'}">
  <title>${options.title || 'HyperFX App'}</title>
  ${options.description ? `<meta name="description" content="${options.description}">` : ''}
  ${options.favicon ? `<link rel="icon" href="${options.favicon}">` : ''}
  ${metaTags}
  ${options.inlineStyles ? `<style>\n${options.inlineStyles}\n</style>` : ''}
</head>
<body class="${options.bodyClass || ''}">
${elementHtml}
${options.inlineScripts ? `<script>\n${options.inlineScripts}\n</script>` : ''}
</body>
</html>`;
  }

  /**
   * Generate meta tags for SEO
   */
  private generateMetaTags(_options: HtmlDocumentOptions): string {
    const tags: string[] = [];

    // Keywords
    if (this.config.keywords?.length) {
      tags.push(`<meta name="keywords" content="${this.config.keywords.join(', ')}">`);
    }

    // Canonical URL
    if (this.config.canonical) {
      tags.push(`<link rel="canonical" href="${this.config.canonical}">`);
    }

    // Open Graph
    if (this.config.openGraph) {
      const og = this.config.openGraph;
      if (og.title) tags.push(`<meta property="og:title" content="${og.title}">`);
      if (og.description) tags.push(`<meta property="og:description" content="${og.description}">`);
      if (og.image) tags.push(`<meta property="og:image" content="${og.image}">`);
      if (og.type) tags.push(`<meta property="og:type" content="${og.type}">`);
      tags.push(`<meta property="og:url" content="${this.context.url}">`);
    }

    // Twitter Cards
    if (this.config.twitter) {
      const tw = this.config.twitter;
      if (tw.card) tags.push(`<meta name="twitter:card" content="${tw.card}">`);
      if (tw.title) tags.push(`<meta name="twitter:title" content="${tw.title}">`);
      if (tw.description) tags.push(`<meta name="twitter:description" content="${tw.description}">`);
      if (tw.image) tags.push(`<meta name="twitter:image" content="${tw.image}">`);
    }

    return tags.join('\n  ');
  }

  /**
   * Generate critical CSS for above-the-fold content
   */
  private generateCriticalCSS(): string {
    // Basic critical CSS - can be extended
    return `
      /* Critical CSS for HyperFX SSR */
      body { margin: 0; font-family: system-ui, sans-serif; }
      [data-hfx-hydration] { /* Hydration markers */ }
    `;
  }

  /**
   * Check if request is from a bot/crawler
   */
  static isBot(userAgent: string): boolean {
    const botPatterns = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /twitterbot/i,
      /facebookexternalhit/i,
      /linkedinbot/i,
      /whatsapp/i
    ];

    return botPatterns.some(pattern => pattern.test(userAgent));
  }
}

/**
 * Static site generation helpers
 */
export class StaticGenerator {
  private routes: Map<string, () => VirtualNode | Promise<VirtualNode>> = new Map();

  /**
   * Add a route handler
   */
  addRoute(path: string, component: () => VirtualNode | Promise<VirtualNode>): void {
    this.routes.set(path, component);
  }

  /**
   * Generate static HTML for all routes
   */
  async generateAll(_outputDir: string = './dist'): Promise<Map<string, string>> {
    const pages = new Map<string, string>();

    for (const [path, component] of this.routes) {
      try {
        const element = await component();
        const context: SSRContext = { url: path };
        const renderer = new SSRRenderer(context);
        const html = renderer.renderPage(element);

        pages.set(path, html);
      } catch (error) {
        console.error(`Failed to generate page for ${path}:`, error);
      }
    }

    return pages;
  }

  /**
   * Generate sitemap.xml
   */
  generateSitemap(baseUrl: string): string {
    const urls = Array.from(this.routes.keys())
      .map(path => `  <url><loc>${baseUrl}${path}</loc></url>`)
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }
}

/**
 * Component-level SSR utilities
 */
export const SSRUtils = {
  /**
   * Create a server-safe component that handles client-only features
   */
  serverSafe<T>(
    serverComponent: () => VirtualNode,
    clientComponent: () => T,
    fallback?: () => VirtualNode
  ): () => VirtualNode | T {
    return () => {
      if (typeof window === 'undefined') {
        // Server-side
        return serverComponent();
      } else {
        // Client-side
        try {
          return clientComponent();
        } catch (error) {
          console.warn('Client component failed, using fallback:', error);
          return fallback ? fallback() : serverComponent();
        }
      }
    };
  },

  /**
   * Conditional rendering based on environment
   */
  clientOnly<T>(component: () => T, fallback?: () => VirtualNode): () => VirtualNode | T | null {
    return () => {
      if (typeof window === 'undefined') {
        return fallback ? fallback() : null;
      }
      return component();
    };
  },

  /**
   * Server-only rendering
   */
  serverOnly(component: () => VirtualNode): () => VirtualNode | null {
    return () => {
      if (typeof window === 'undefined') {
        return component();
      }
      return null;
    };
  },

  /**
   * Create placeholder for client-side hydration
   */
  createHydrationPlaceholder(id: string, tagName: string = 'div'): VirtualNode {
    return {
      type: 'element',
      tag: tagName,
      props: {
        id,
        'data-hydration-placeholder': 'true',
        style: 'display: none'
      },
      children: []
    };
  }
};