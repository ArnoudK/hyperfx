import { renderToString, renderHydrationData, Router, Route, JSX } from "hyperfx";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { routes, getAllRoutePaths } from "./routes/config";
import { createDocument } from "./lib/document";
import NotFoundPage from "./components/not-found";

// @ts-expect-error css url module misses typings
import styles from './styles.css?url';

export default {
  async fetch(req: Request): Promise<Response> {
    // Register happy-dom for server-side rendering
    if (!GlobalRegistrator.isRegistered) {
      GlobalRegistrator.register({
        url: process.env.VITE_PUBLIC_URL || "http://localhost:3000",
      });
    }

    // Clear document for clean rendering
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Get the requested pathname
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Define the application with routing for SSR
    const App = () => (
      <Router initialPath={pathname}>
        {getAllRoutePaths().map(path => (
          <Route
            path={path}
            component={routes[path]?.component}
            exact={path === '/'}
          />
        ))}
        {/* Handle 404 by not matching any route, or we could add a catch-all */}
      </Router>
    );

    // Render component to HTML with hydration data
    const { html, hydrationData } = renderToString(<App />);
    const hydrationScript = renderHydrationData(hydrationData);

    // Determine title and description from route
    const route = routes[pathname];
    const title = route?.title || '404 - Page Not Found';
    const description = route?.description || 'The requested page could not be found.';

    // Create full HTML document
    const documentHtml = createDocument({
      title,
      description,
      body: html,
      hydrationScript,
      styles,
    });

    return new Response(documentHtml, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600" // Cache for 1 hour
      },
    });
  },
};