// Client-side hydration and routing
import {  hydrate, isHydratable } from 'hyperfx';
import { App } from './app';

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

    
    

        // Check if we have SSR content to hydrate
        if (isHydratable(appElement)) {
            // Hydrate server-rendered content inside #app
            hydrate(appElement, ()=> <App pathname={window.location.pathname} />);
        } else {
            // No SSR content, perform client-side mount
            appElement.appendChild(<App pathname={window.location.pathname} /> as Node);
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
