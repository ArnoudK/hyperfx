// SSR Example and Test
import { 
  createSignal,
  renderToString, renderToDocument, SSRRenderer, SSRContext, SSRPageConfig 
} from "hyperfx";

// Example: Simple static component
export function StaticPage() {
  return (
    <div className="container">
      <h1 className="title">Welcome to HyperFX SSR!</h1>
      <p className="description">
        This page was rendered on the server using HyperFX's SSR capabilities.
      </p>
      <div className="features">
        <h1 className="subtitle">Features:</h1>
        <p>✅ Server-side rendering</p>
        <p>✅ Client-side hydration</p>
        <p>✅ SEO-friendly output</p>
        <p>✅ Progressive enhancement</p>
      </div>
    </div>
  );
}

// Example: Component with interactivity (needs hydration)
export function InteractivePage() {
  const count = createSignal(0);
  
  return (
    <div className="container">
      <h1>Interactive SSR Example</h1>
      <p>
        Count: {count()}
      </p>
      <button
        className="btn"
        onClick={() => count(count() + 1)}
      >
        Increment
      </button>
    </div>
  );
}

// Example: SSR usage
export function renderStaticExample(): string {
  const page = StaticPage();
  return renderToString(page);
}

export function renderDocumentExample(): string {
  const page = StaticPage();
  
  return renderToDocument(page, {
    title: "HyperFX SSR Example",
    description: "Example of server-side rendering with HyperFX",
    stylesheets: ["/styles/main.css"],
    scripts: ["/scripts/main.js"],
    inlineStyles: `
      .container { max-width: 800px; margin: 0 auto; padding: 20px; }
      .title { color: #333; font-size: 2rem; }
      .description { color: #666; line-height: 1.6; }
      .features { margin-top: 2rem; }
      .subtitle { color: #555; font-size: 1.5rem; }
      .btn { padding: 10px 20px; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer; }
      .btn:hover { background: #005a9e; }
    `
  });
}

export function renderWithSSRRenderer(): string {
  const context: SSRContext = {
    url: "https://example.com/ssr-demo",
    userAgent: "Mozilla/5.0 (compatible; HyperFX SSR)",
    isBot: false
  };
  
  const config: SSRPageConfig = {
    title: "HyperFX SSR Demo",
    description: "Demonstrating server-side rendering capabilities",
    keywords: ["SSR", "HyperFX", "server-side rendering"],
    openGraph: {
      title: "HyperFX SSR Demo",
      description: "Demonstrating server-side rendering capabilities",
      type: "website"
    }
  };
  
  const renderer = new SSRRenderer(context, config);
  const page = StaticPage();
  
  return renderer.renderPage(page);
}

// Example: Testing different scenarios
export function testSSRExamples(): void {
  console.log("=== HyperFX SSR Examples ===\n");
  
  // Test 1: Basic string rendering
  console.log("1. Basic String Rendering:");
  console.log(renderStaticExample());
  console.log("\n");
  
  // Test 2: Full document rendering
  console.log("2. Full Document Rendering:");
  console.log(renderDocumentExample());
  console.log("\n");
  
  // Test 3: SSR Renderer with SEO
  console.log("3. SSR Renderer with SEO:");
  console.log(renderWithSSRRenderer());
  console.log("\n");
}
