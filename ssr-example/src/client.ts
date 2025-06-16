// Vinxi Client-side hydration
import './styles.css';
import { setupRouter, VNode } from 'hyperfx'; // autoHydrate is implicitly handled by router

// Import route components
import HomePage from './routes/index.tsx';
import AboutPage from './routes/about.tsx';
import ProductsPage from './routes/products.tsx';

// Type definitions for better type safety
interface RouteDefinition {
    path: string;
    component: () => VNode<any>;
    title: string;
}

interface RouterOptions {
    container: HTMLElement;
}

interface ClientAppConfig {
    enableDevtools?: boolean;
    initialRoute?: string;
}

// Client-side hydration logic
class ClientApp {
    private isInitialLoad: boolean = true;
    private config: ClientAppConfig;

    constructor(config: ClientAppConfig = {}) {
        this.config = config;
        this.initializeRouter();
    }

    private initializeRouter(): void {
        // Setup client-side router for subsequent navigation with proper typing
        const routes: RouteDefinition[] = [
            { path: '/', component: HomePage, title: 'HyperFX SSR - Home' },
            { path: '/about', component: AboutPage, title: 'HyperFX SSR - About' },
            { path: '/products', component: ProductsPage, title: 'HyperFX SSR - Products' },
        ];

        const container: HTMLElement = document.body; // Router will operate on the whole body
        const routerOptions: RouterOptions = { container };
        
        try {
            const router = setupRouter(routes, routerOptions);

            // Mark initial load as complete after router has had a chance to process
            // The router's navigate method handles the initial load/hydration.
            setTimeout(() => {
                this.isInitialLoad = false;
                if (this.config.enableDevtools && typeof window !== 'undefined') {
                    console.log('🚀 HyperFX Client App initialized');
                }
            }, 100); // Small delay to ensure router init completes
        } catch (error: unknown) {
            console.error('❌ Error initializing router:', error);
        }
    }

    public getIsInitialLoad(): boolean {
        return this.isInitialLoad;
    }
}

// Initialize client app with proper typing
function initializeClient(): void {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            console.warn('Client initialization called in non-browser environment');
            return;
        }

        const config: ClientAppConfig = {
            enableDevtools: process.env.NODE_ENV === 'development',
            initialRoute: window.location.pathname
        };

        // Initialize the client application
        new ClientApp(config);
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

// Default export for Vinxi
export default initializeClient;
