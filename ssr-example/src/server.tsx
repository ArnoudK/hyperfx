import { renderToString, renderHydrationData,  enableSSRMode, disableSSRMode, SSRNode } from "hyperfx";

import { createDocument } from "./lib/document";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import styles from './styles.css?url';
import { App, router } from "./app";

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
    console.warn('Failed to locate client script in production build:', e);
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

   
    const appElement = <App pathname={pathname}  />;
    
    const { html, hydrationData } = renderToString(appElement as SSRNode, { 
      ssrHydration: true
    });
    const hydrationScript = renderHydrationData(hydrationData);
    
    disableSSRMode();

    // Determine title and description from route
    
    // Get client script path
    const clientScript = await getClientScriptPath();

    // Create full HTML document
    const documentHtml = createDocument({
      'title': 'HyperFX SSR Example',
      'description': 'A server-side rendered example using HyperFX',
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