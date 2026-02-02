// Client-side hydration and routing
import { Router, Route, hydrate, isHydratable } from 'hyperfx';
import { routes, getAllRoutePaths } from './routes/config';

/**
 * Initialize client-side app with hydration and routing
 */
function initializeClient(): void {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            console.warn('Client initialization called in non-browser environment');
            return;
        }

        const appElement = document.getElementById('app');
        
        if (!appElement) {
            console.error('❌ No #app element found');
            return;
        }

        // Pre-compute route paths to avoid issues in minified code
        const routePaths = getAllRoutePaths();

        // Create the app component tree (must match server exactly)
        // Note: Server renders <div id="app">...</div>, so we hydrate inside it
        const ClientApp = () => {
            return (
                <Router initialPath={window.location.pathname}>
                    {() => (
                        <>
                            {routePaths.map(path => {
                                const route = routes[path];
                                return <Route path={path} component={route.component} exact={path === '/'} />;
                            })}
                        </>
                    )}
                </Router>
            );
        };

        // Check if we have SSR content to hydrate
        if (isHydratable(appElement)) {
            // Hydrate server-rendered content inside #app
            hydrate(appElement, ClientApp);
        } else {
            // No SSR content, perform client-side mount
            appElement.appendChild(ClientApp());
        }

    } catch (error: unknown) {
        console.error('❌ Error initializing client app:', error);
    }
}

// Ensure DOM is ready before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClient);
} else {
    // DOM is already ready
    initializeClient();
}

// Default export for module systems
export default initializeClient;
