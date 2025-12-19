// Client-side hydration and routing
import { Router, Route, hydrateWithNodeIds } from 'hyperfx';
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

        // Perform hydration with node IDs first
        const appElement = document.getElementById('app');
        if (appElement) {
            hydrateWithNodeIds(appElement);
            console.log('✅ HyperFX: Hydration complete');
        }

        // Setup component-based router for subsequent navigation
        const ClientApp = () => (
            <Router children={() => (
                <>
                    {getAllRoutePaths().map(path => {
                        const route = routes[path];
                        return <Route path={path} component={route.component} exact={path === '/'} />;
                    })}
                </>
            )} />
        );

        // Mount the router (this will enable client-side navigation)
        // Note: For full hydration benefit, the server and client should share the same component tree.
        // For this example, we mount the Router over the body or app element.
        if (appElement) {
            appElement.replaceChildren(ClientApp());
        } else {
            document.body.replaceChildren(ClientApp());
        }

        console.log('🚀 HyperFX: Client app initialized with component-based router');

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
