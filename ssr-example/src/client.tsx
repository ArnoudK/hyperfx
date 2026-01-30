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

        // Create the app component tree (must match server exactly)
        const ClientApp = () => {
            return (
                <div id="app">
                    <Router initialPath={window.location.pathname}>
                        {() => (
                            <>
                                {getAllRoutePaths().map(path => {
                                    const route = routes[path];
                                    return <Route path={path} component={route.component} exact={path === '/'} />;
                                })}
                            </>
                        )}
                    </Router>
                </div>
            );
        };

        // Check if we have SSR content to hydrate
        if (isHydratable(document.body)) {
            // Hydrate server-rendered content
            hydrate(document.body, ClientApp);
        } else {
            // No SSR content, perform client-side mount
            appElement.appendChild(<ClientApp />);
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
