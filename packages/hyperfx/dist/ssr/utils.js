import { renderToDocument, renderWithHydration } from "./render";
/**
 * Enhanced SSR renderer with common patterns
 */
export class SSRRenderer {
    constructor(context, config = {}) {
        this.context = context;
        this.config = config;
    }
    /**
     * Render a page with full HTML document
     */
    renderPage(vnode, options = {}) {
        const documentOptions = {
            title: this.config.title || 'HyperFX App',
            description: this.config.description,
            ...options,
            // Add meta tags for SEO
            inlineStyles: [
                options.inlineStyles || '',
                this.generateCriticalCSS()
            ].filter(Boolean).join('\n'),
        };
        let html = renderToDocument(vnode, documentOptions);
        // Add SEO meta tags
        html = this.addSEOMetaTags(html);
        return html;
    }
    /**
     * Render with hydration support
     */
    renderWithHydration(vnode) {
        const { html: vnodeHtml, hydrationData } = renderWithHydration(vnode);
        // Helper function to create the hydration script
        function createHydrationScript(data) {
            return `<script type="application/json" id="__HYPERFX_HYDRATION_DATA__">${JSON.stringify(data)}</script>`;
        }
        const hydrationScript = createHydrationScript(hydrationData);
        const fullDocument = this.renderPage(vnode);
        return {
            html: vnodeHtml,
            hydrationScript,
            fullDocument
        };
    }
    /**
     * Generate critical CSS for above-the-fold content
     */
    generateCriticalCSS() {
        // Basic critical CSS - can be extended
        return `
      /* Critical CSS for HyperFX SSR */
      body { margin: 0; font-family: system-ui, sans-serif; }
      [data-hyperfx-hydrate] { /* Hydration markers */ }
    `;
    }
    /**
     * Add SEO meta tags to HTML
     */
    addSEOMetaTags(html) {
        const metaTags = [];
        // Keywords
        if (this.config.keywords?.length) {
            metaTags.push(`<meta name="keywords" content="${this.config.keywords.join(', ')}">`);
        }
        // Canonical URL
        if (this.config.canonical) {
            metaTags.push(`<link rel="canonical" href="${this.config.canonical}">`);
        }
        // Open Graph
        if (this.config.openGraph) {
            const og = this.config.openGraph;
            if (og.title)
                metaTags.push(`<meta property="og:title" content="${og.title}">`);
            if (og.description)
                metaTags.push(`<meta property="og:description" content="${og.description}">`);
            if (og.image)
                metaTags.push(`<meta property="og:image" content="${og.image}">`);
            if (og.type)
                metaTags.push(`<meta property="og:type" content="${og.type}">`);
            metaTags.push(`<meta property="og:url" content="${this.context.url}">`);
        }
        // Twitter Cards
        if (this.config.twitter) {
            const tw = this.config.twitter;
            if (tw.card)
                metaTags.push(`<meta name="twitter:card" content="${tw.card}">`);
            if (tw.title)
                metaTags.push(`<meta name="twitter:title" content="${tw.title}">`);
            if (tw.description)
                metaTags.push(`<meta name="twitter:description" content="${tw.description}">`);
            if (tw.image)
                metaTags.push(`<meta name="twitter:image" content="${tw.image}">`);
        }
        // Inject meta tags before closing </head>
        if (metaTags.length > 0) {
            const metaString = metaTags.join('\n  ');
            html = html.replace('</head>', `  ${metaString}\n</head>`);
        }
        return html;
    }
    /**
     * Check if request is from a bot/crawler
     */
    static isBot(userAgent) {
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
    constructor() {
        this.routes = new Map();
    }
    /**
     * Register a route for static generation
     */
    addRoute(path, component) {
        this.routes.set(path, component);
    }
    /**
     * Generate static HTML for all routes
     */
    async generateAll(outputDir = './dist') {
        const pages = new Map();
        for (const [path, component] of this.routes) {
            try {
                const vnode = await component();
                const context = { url: path };
                const renderer = new SSRRenderer(context);
                const html = renderer.renderPage(vnode);
                pages.set(path, html);
            }
            catch (error) {
                console.error(`Failed to generate page for ${path}:`, error);
            }
        }
        return pages;
    }
    /**
     * Generate sitemap.xml
     */
    generateSitemap(baseUrl) {
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
    serverSafe(serverComponent, clientComponent, fallback) {
        return () => {
            if (typeof window === 'undefined') {
                // Server-side
                return serverComponent();
            }
            else {
                // Client-side
                try {
                    return clientComponent();
                }
                catch (error) {
                    console.warn('Client component failed, using fallback:', error);
                    return fallback ? fallback() : serverComponent();
                }
            }
        };
    },
    /**
     * Conditional rendering based on environment
     */
    clientOnly(component, fallback) {
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
    serverOnly(component) {
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
    createHydrationPlaceholder(id, tagName = 'div') {
        return {
            tag: tagName,
            props: {
                id,
                'data-hydration-placeholder': 'true',
                style: 'display: none;'
            },
            children: []
        };
    }
};
//# sourceMappingURL=utils.js.map