// SSR utilities and common patterns - Direct DOM Implementation
import { JSXElement } from "../jsx/jsx-runtime";
import { renderToString, renderWithHydration } from "./render";

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
    element: JSXElement | JSXElement[],
    options: Partial<HtmlDocumentOptions> = {}
  ): string {
    const documentOptions: HtmlDocumentOptions = {
      title: this.config.title || 'HyperFX App',
      description: this.config.description,
      lang: 'en',
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1.0',
      ...options,
      // Add meta tags for SEO
      inlineStyles: [
        options.inlineStyles || '',
        this.generateCriticalCSS()
      ].filter(Boolean).join('\n'),
    };

    return this.renderDocument(element, documentOptions);
  }

  /**
   * Render with hydration support
   */
  renderWithHydration(element: JSXElement): {
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
    element: JSXElement | JSXElement[],
    options: HtmlDocumentOptions
  ): string {
    let elementToRender: JSXElement;
    if (Array.isArray(element)) {
      const fragment = document.createDocumentFragment();
      element.forEach(child => {
        fragment.appendChild(child);
      });
      elementToRender = fragment;
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
  private generateMetaTags(options: HtmlDocumentOptions): string {
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
  private routes: Map<string, () => JSXElement | Promise<JSXElement>> = new Map();

  /**
   * Register a route for static generation
   */
  addRoute(path: string, component: () => JSXElement | Promise<JSXElement>): void {
    this.routes.set(path, component);
  }

  /**
   * Generate static HTML for all routes
   */
  async generateAll(outputDir: string = './dist'): Promise<Map<string, string>> {
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
    serverComponent: () => JSXElement,
    clientComponent: () => T,
    fallback?: () => JSXElement
  ): () => JSXElement | T {
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
  clientOnly<T>(component: () => T, fallback?: () => JSXElement): () => JSXElement | T | null {
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
  serverOnly(component: () => JSXElement): () => JSXElement | null {
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
  createHydrationPlaceholder(id: string, tagName: string = 'div'): JSXElement {
    const element = document.createElement(tagName);
    element.id = id;
    element.setAttribute('data-hydration-placeholder', 'true');
    element.style.display = 'none';
    return element;
  }
};