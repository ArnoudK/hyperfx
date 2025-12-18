// Vinxi SSR Server Handler with File System Routing
import { eventHandler } from "vinxi/http";
import { getManifest } from "vinxi/manifest";
import { SSRRenderer, SSRContext, SSRPageConfig, Div, H1, t, P, A, renderWithHydration, VNode, r, template } from 'hyperfx';

// Import route components directly
import HomePage from './routes/index.tsx';
import AboutPage from './routes/about.tsx';
import ProductsPage from './routes/products.tsx';

// Type definitions for better type safety
interface VinxiAsset {
    tag: 'link' | 'script' | 'style';
    attrs: {
        rel?: string;
        href?: string;
        src?: string;
        type?: string;
    };
}

interface ViteManifestEntry {
    file: string;
    name?: string;
    src?: string;
    isEntry?: boolean;
    css?: string[];
}

interface ViteManifest {
    [key: string]: ViteManifestEntry;
}

interface RouteComponent {
    (): VNode<any>;
}

interface RouteMap {
    [path: string]: RouteComponent;
}

interface HtmlOptions {
    bodyAttributes: { class: string };
    inlineStyles: string;
    stylesheets: string[];
    inlineScripts?: string;
}

interface ErrorContext {
    pathname: string;
    error: unknown;
    userAgent?: string;
}


export default eventHandler(async (event) => {
    const url = event.node.req.url || '/';
    const pathname = new URL(url, 'http://localhost').pathname;

    // Skip asset routes - let Vinxi handle them
    if (pathname.startsWith('/_build/') || pathname.startsWith('/assets/') ||
        pathname.includes('.css') || pathname.includes('.js') || pathname.includes('.map')) {
        return; // Let Vinxi's static router handle these
    }

    // Get route components from direct imports
    const routes: RouteMap = {
        '/': HomePage,
        '/about': AboutPage,
        '/products': ProductsPage,
    };

    // Get route component with proper type handling
    const routeResult = routes[pathname];
    const RouteComponent: RouteComponent = routeResult || (() => getNotFoundComponent(pathname));

    try {
        // Create SSR context with proper typing
        const context: SSRContext = {
            url: pathname,
            userAgent: event.node.req.headers['user-agent'] || '',
            isBot: SSRRenderer.isBot(event.node.req.headers['user-agent'] || ''),
            headers: event.node.req.headers as Record<string, string>,
            query: {}
        };

        // Page configuration with proper typing
        const config: SSRPageConfig = {
            title: `HyperFX SSR - ${pathname === '/' ? 'Home' : pathname.slice(1)}`,
            description: 'HyperFX Server-Side Rendering with Vinxi',
            keywords: ['hyperfx', 'ssr', 'vinxi', 'react', 'framework'],
            openGraph: {
                title: 'HyperFX + Vinxi SSR Demo',
                description: 'Modern SSR with HyperFX and Vinxi',
                type: 'website'
            }
        };

        // Render page with hydration
        const renderer = new SSRRenderer(context, config);
        const vnode: VNode<any> = RouteComponent();

        // Generate HTML with hydration markers
        const { html: renderedContent, hydrationData } = renderWithHydration(vnode);

        // Get client assets from Vinxi manifest with proper typing
        const clientManifest = getManifest("client");
        const assets: VinxiAsset[] = await clientManifest.inputs[clientManifest.handler].assets();

        // Convert Vinxi assets to HyperFX format with type safety
        const stylesheets: string[] = [];
        const moduleScripts: string[] = [];

        assets.forEach((asset: VinxiAsset) => {
            if (asset.tag === 'link' && asset.attrs.rel === 'stylesheet' && asset.attrs.href) {
                stylesheets.push(asset.attrs.href);
            } else if (asset.tag === 'script' && asset.attrs.src) {
                // For dev mode, we need to create proper ES module imports
                moduleScripts.push(asset.attrs.src);
            }
        });

        // In development mode, use the processed CSS from the build directory
        if (process.env.NODE_ENV !== 'production') {
            stylesheets.push('/_build/src/styles.css');
        }

        // Create proper module script tags as HTML strings instead of using inlineScripts
        const isDev = process.env.NODE_ENV !== 'production';
        let customScripts = '';

        if (isDev) {
            // In dev mode, use the processed client handler from the client router
            const vinxiRuntime = moduleScripts[0]; // Vinxi runtime
            const viteClient = moduleScripts[1];   // Vite client

            customScripts = [
                vinxiRuntime ? `<script type="module" src="${vinxiRuntime}"></script>` : '',
                viteClient ? `<script type="module" src="${viteClient}"></script>` : '',
                // Inject hydration data as a global variable
                `<script>window.__HYPERFX_HYDRATION_DATA__ = ${JSON.stringify(hydrationData)};</script>`,
                // Use the processed client handler instead of raw TypeScript
                `<script type="module" src="/_build/src/client.ts"></script>`
            ].filter(Boolean).join('\n');
        } else {
            // In production, use the bundled assets from manifest
            customScripts = `<script>window.__HYPERFX_HYDRATION_DATA__ = ${JSON.stringify(hydrationData)};</script>\n`;

            // Try to find the client JavaScript bundle in a more reliable way
            if (moduleScripts.length === 0) {
                // Look through all assets to find a JavaScript file with 'client' in the name
                const clientJSAsset: VinxiAsset | undefined = assets.find((asset: VinxiAsset) =>
                    asset.attrs &&
                    asset.attrs.src &&
                    asset.attrs.src.includes('client') &&
                    asset.attrs.src.endsWith('.js')
                );

                if (clientJSAsset?.attrs?.src) {
                    moduleScripts.push(clientJSAsset.attrs.src);
                } else {
                    // If we still can't find it, let's try to read the Vite manifest directly
                    try {
                        const fs = await import('fs');
                        const path = await import('path');
                        const viteManifestPath: string = path.resolve('.output/public/_build/.vite/manifest.json');

                        if (fs.existsSync(viteManifestPath)) {
                            const viteManifestContent: string = fs.readFileSync(viteManifestPath, 'utf-8');
                            const viteManifest: ViteManifest = JSON.parse(viteManifestContent);

                            // Look for the client entry in the Vite manifest
                            const clientEntry: ViteManifestEntry | undefined = viteManifest['virtual:$vinxi/handler/client'];

                            if (clientEntry?.file) {
                                moduleScripts.push(`/_build/${clientEntry.file}`);
                            } else {
                                // Fallback: look for any entry with isEntry: true
                                const anyEntry: ViteManifestEntry | undefined = Object.values(viteManifest).find((entry: ViteManifestEntry) =>
                                    entry.isEntry && entry.file && entry.file.endsWith('.js')
                                );

                                if (anyEntry?.file) {
                                    moduleScripts.push(`/_build/${anyEntry.file}`);
                                }
                            }
                        }
                    } catch (manifestError: unknown) {
                        console.warn('Could not read Vite manifest:', manifestError);
                    }
                }
            }

            moduleScripts.forEach((script: string) => {
                customScripts += `<script type="module" src="${script}"></script>\n`;
            });
        }

        // HTML options with proper typing
        const htmlOptions: HtmlOptions = {
            bodyAttributes: { class: 'antialiased' },
            inlineStyles: '', // Disable default critical CSS
            stylesheets
        };

        // Add module scripts if we have any
        if (customScripts) {
            htmlOptions.inlineScripts = `/* Module scripts will be injected after rendering */`;
        }

        // Create HTML document with the pre-rendered content
        const titleEscaped: string = config.title.replace(/"/g, '&quot;');
        const descriptionEscaped: string = config.description.replace(/"/g, '&quot;');
        const stylesheetsHtml: string = stylesheets.map((href: string) =>
            `<link rel="stylesheet" href="${href}">`
        ).join('\n  ');

        let html: string = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleEscaped}</title>
  <meta name="description" content="${descriptionEscaped}">
  ${stylesheetsHtml}
</head>
<body class="antialiased">
  ${renderedContent}
</body>
</html>`;

        // Inject custom module scripts into the HTML
        if (customScripts) {
            // Inject module scripts before closing </head>
            html = html.replace('</head>', `  ${customScripts}\n</head>`);
        }

        // Set headers and return
        event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        event.node.res.setHeader('Cache-Control', 'public, max-age=3600');

        return html;

    } catch (error: unknown) {
        const errorContext: ErrorContext = {
            pathname,
            error,
            userAgent: event.node.req.headers['user-agent']
        };

        console.error('❌ SSR Error:', errorContext);

        // Create proper error message with type safety
        const errorMessage: string = error instanceof Error ? error.message : String(error);
        const errorStack: string = error instanceof Error ? (error.stack || '') : '';

        // Return a simple error page with proper escaping
        const errorHtml: string = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server Error</title>
  <style>
    body { font-family: system-ui; padding: 2rem; background: #1f2937; color: #f3f4f6; }
    .error { background: #dc2626; color: white; padding: 1rem; border-radius: 0.5rem; }
    .error-details { background: #374151; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; }
    pre { overflow-x: auto; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="error">
    <h1>Server Error</h1>
    <p>There was an error rendering this page.</p>
    <div class="error-details">
      <pre>${errorMessage}</pre>
      ${process.env.NODE_ENV === 'development' ? `<pre>${errorStack}</pre>` : ''}
    </div>
  </div>
</body>
</html>`;

        event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return errorHtml;
    }
});

// 404 Not Found component with proper typing
function getNotFoundComponent(pathname: string): VNode<any> {
    return Div({ class: 'min-h-screen bg-gray-900 text-white flex items-center justify-center' }, [
        H1({ class: 'text-4xl font-bold text-red-400' }, ['404 - Page Not Found']),
        P({ class: 'text-gray-300 mt-4' }, [template`Route "${pathname}" not found`]),
        A({ href: '/', class: 'text-blue-400 hover:text-blue-300 mt-4 inline-block' }, ['← Back to Home'])
    ]);
}
