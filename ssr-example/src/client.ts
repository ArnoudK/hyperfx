// Vinxi Client-side hydration
import './styles.css';
import { setupRouter } from 'hyperfx'; // autoHydrate is implicitly handled by router

// Import route components
import HomePage from './routes/index.tsx';
import AboutPage from './routes/about.tsx';
import ProductsPage from './routes/products.tsx';

// Client-side hydration logic
// HyperFX Client-side entry point

class ClientApp {
  private isInitialLoad = true; // This might still be useful for other client-side logic

  constructor() {
    // this.initializeHydration(); // Removed: Router will handle initial hydration
    this.initializeRouter();
  }


  private initializeRouter() {
    // Setup client-side router for subsequent navigation
    const routes = [
      { path: '/', component: HomePage, title: 'HyperFX SSR - Home' },
      { path: '/about', component: AboutPage, title: 'HyperFX SSR - About' },
      { path: '/products', component: ProductsPage, title: 'HyperFX SSR - Products' },

    ];

    const container = document.body; // Router will operate on the whole body
    const router = setupRouter(routes, { container });

    // Mark initial load as complete after router has had a chance to process
    // The router's navigate method handles the initial load/hydration.
    setTimeout(() => {
      this.isInitialLoad = false;
    }, 100); // Small delay to ensure router init completes
  }
}


// Initialize client app
function initializeClient() {
  // Initialize the client application
  new ClientApp();
}

document.addEventListener('DOMContentLoaded', initializeClient);

// Default export for Vinxi
export default initializeClient;
