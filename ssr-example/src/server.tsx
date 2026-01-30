/** @jsxImportSource hyperfx/jsx-server */
import { renderToString, renderHydrationData, Router, Route, JSX, enableSSRMode, disableSSRMode } from "hyperfx";
import { routes, getAllRoutePaths } from "./routes/config";
import { createDocument } from "./lib/document";
import NotFoundPage from "./components/not-found";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

// @ts-expect-error css url module misses typings
import styles from './styles.css?url';

// Cache the client script path
let clientScriptPath: string | null = null;

async function getClientScriptPath(): Promise<string> {
  if (clientScriptPath) return clientScriptPath;
  
  try {
    // In production, find the built client script
    const publicDir = join(process.cwd(), '.output/public/assets');
    const files = await readdir(publicDir);
    const clientFile = files.find(f => f.startsWith('client-') && f.endsWith('.js'));
    if (clientFile) {
      clientScriptPath = `/assets/${clientFile}`;
      return clientScriptPath;
    }
  } catch (e) {
    // Fallback for dev mode
  }
  
  // Dev mode fallback
  return '/src/client.tsx';
}

export default {
  async fetch(req: Request): Promise<Response | undefined> {
    // Get the requested pathname
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Skip SSR for static assets - return undefined to let Nitro's static handler serve them
    if (pathname.startsWith('/assets/') || pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.map')) {
      return undefined;
    }

    // No happy-dom needed! The server JSX runtime automatically creates virtual nodes
    // when running in Node.js thanks to package.json conditional exports

    enableSSRMode();

    const App = () => (
      <div id="app">
        <Router initialPath={pathname}>
          {() => (
            <>
              {getAllRoutePaths().map(path => (
                <Route
                  path={path}
                  component={routes[path]?.component}
                  exact={path === '/'}
                />
              ))}
            </>
          )}
        </Router>
      </div>
    );

    const appElement = <App />;
    
    const { html, hydrationData } = renderToString(appElement, { 
      ssrHydration: true
    });
    const hydrationScript = renderHydrationData(hydrationData);
    
    disableSSRMode();

    // Determine title and description from route
    const route = routes[pathname];
    const title = route?.title || '404 - Page Not Found';
    const description = route?.description || 'The requested page could not be found.';

    // Get client script path
    const clientScript = await getClientScriptPath();

    // Create full HTML document
    const documentHtml = createDocument({
      title,
      description,
      body: html,
      hydrationScript,
      styles,
      clientScript,
    });

    return new Response(documentHtml, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600" // Cache for 1 hour
      },
    });
  },
};