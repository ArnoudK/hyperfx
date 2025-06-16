// Vinxi SSR Server Handler with File System Routing
import { eventHandler } from "vinxi/http";
import { getManifest } from "vinxi/manifest";
import { SSRRenderer, SSRContext, SSRPageConfig, Div, H1, t, P, A, renderWithHydration } from 'hyperfx';

// Import route components directly
import HomePage from './routes/index.tsx';
import AboutPage from './routes/about.tsx';
import ProductsPage from './routes/products.tsx';


export default eventHandler(async (event) => {
    const url = event.node.req.url || '/';
    const pathname = new URL(url, 'http://localhost').pathname;

    // Skip asset routes - let Vinxi handle them
    if (pathname.startsWith('/_build/') || pathname.startsWith('/assets/') ||
        pathname.includes('.css') || pathname.includes('.js') || pathname.includes('.map')) {
        return; // Let Vinxi's static router handle these
    }

    // Get route components from direct imports
    const routes: Record<string, () => any> = {
        '/': HomePage,
        '/about': AboutPage,
        '/products': ProductsPage,
    };

    // Get route component
    const RouteComponent = routes[pathname] || (() => getNotFoundComponent(pathname));

    try {
        // Create SSR context
        const context: SSRContext = {
            url: pathname,
            userAgent: event.node.req.headers['user-agent'] || '',
            isBot: SSRRenderer.isBot(event.node.req.headers['user-agent'] || ''),
            headers: event.node.req.headers as Record<string, string>,
            query: {}
        };

        // Page configuration
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
        const vnode = RouteComponent();

        // Generate HTML with hydration markers
        const { html: renderedContent, hydrationData } = renderWithHydration(vnode);

        // Get client assets from Vinxi manifest
        const clientManifest = getManifest("client");
        const assets = await clientManifest.inputs[clientManifest.handler].assets();

        // Convert Vinxi assets to HyperFX format
        const stylesheets: string[] = [];
        const moduleScripts: string[] = [];

        assets.forEach(asset => {
            if (asset.tag === 'link' && asset.attrs.rel === 'stylesheet') {
                stylesheets.push(asset.attrs.href);
            } else if (asset.tag === 'script') {
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
            moduleScripts.forEach(script => {
                customScripts += `<script type="module" src="${script}"></script>\n`;
            });
        }

        // HTML options with proper assets
        const htmlOptions: any = {
            bodyAttributes: { class: 'antialiased' },
            inlineStyles: '', // Disable default critical CSS
            stylesheets
        };

        // Add module scripts if we have any
        if (customScripts) {
            htmlOptions.inlineScripts = `/* Module scripts will be injected after rendering */`;
        }

        // Create HTML document with the pre-rendered content
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <meta name="description" content="${config.description}">
  ${stylesheets.map(href => `<link rel="stylesheet" href="${href}">`).join('\n  ')}
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

    } catch (error) {
        console.error('❌ SSR Error:', error);

        // Return a simple error page
        const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server Error</title>
  <style>
    body { font-family: system-ui; padding: 2rem; background: #1f2937; color: #f3f4f6; }
    .error { background: #dc2626; color: white; padding: 1rem; border-radius: 0.5rem; }
  </style>
</head>
<body>
  <div class="error">
    <h1>Server Error</h1>
    <p>There was an error rendering this page.</p>
    <pre>${error instanceof Error ? error.message : String(error)}</pre>
  </div>
</body>
</html>`;

        event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return errorHtml;
    }
});

// 404 Not Found component
function getNotFoundComponent(pathname: string) {


    return () => Div({ class: 'min-h-screen bg-gray-900 text-white flex items-center justify-center' }, [
        H1({ class: 'text-4xl font-bold text-red-400' }, [t('404 - Page Not Found')]),
        P({ class: 'text-gray-300 mt-4' }, [t(`Route "${pathname}" not found`)]),
        A({ href: '/', class: 'text-blue-400 hover:text-blue-300 mt-4 inline-block' }, [t('← Back to Home')])
    ]);
}
