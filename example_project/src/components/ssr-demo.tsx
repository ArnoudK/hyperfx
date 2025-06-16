// SSR Demo Component - Server-Side Rendering Example
import { createSignal } from "hyperfx";

export function SSRDemo() {
  // This component can be rendered on both server and client
  const count = createSignal(0);

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-6">🚀 Server-Side Rendering Demo</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
        <h2 className="text-xl font-semibold text-blue-300 mb-4">What is SSR?</h2>
        <p className="text-gray-300 mb-4">
          Server-Side Rendering (SSR) generates HTML on the server before sending it to the browser. 
          This improves initial page load times and SEO by providing fully rendered content immediately.
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
        <h2 className="text-xl font-semibold text-purple-300 mb-4">HyperFX SSR Features</h2>
        <div className="space-y-3">
          <p className="text-gray-300 flex items-start">
            ✅ Render VNodes to HTML strings
          </p>
          <p className="text-gray-300 flex items-start">
            ✅ Full HTML document generation with meta tags
          </p>
          <p className="text-gray-300 flex items-start">
            ✅ Client-side hydration support
          </p>
          <p className="text-gray-300 flex items-start">
            ✅ SEO optimization with Open Graph and Twitter Cards
          </p>
          <p className="text-gray-300 flex items-start">
            ✅ Static site generation utilities
          </p>
          <p className="text-gray-300 flex items-start">
            ✅ Bot detection for conditional rendering
          </p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
        <h2 className="text-xl font-semibold text-yellow-300 mb-4">Interactive Counter (Hydrated)</h2>
        <p className="text-gray-300 mb-4">
          This counter can be server-rendered and then hydrated on the client for interactivity:
        </p>
        <div className="space-y-4">
          <p className="text-2xl font-bold text-blue-400">
            Count: {count()}
          </p>
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => count(count() + 1)}
            >
              Increment
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={() => count(count() - 1)}
            >
              Decrement
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              onClick={() => count(0)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
        <h2 className="text-xl font-semibold text-red-300 mb-4">Code Example</h2>
        <p className="text-gray-300 mb-4">Here's how to use HyperFX SSR:</p>
        <div className="bg-black p-4 rounded font-mono text-sm text-green-400 overflow-x-auto">
          <p className="whitespace-pre">{`import { renderToString, SSRRenderer } from "hyperfx/ssr";

// Basic SSR rendering
const html = renderToString(MyComponent());

// Advanced SSR with full document
const renderer = new SSRRenderer(
  { url: "/my-page" },
  { title: "My Page", description: "SSR Demo" }
);
const fullHTML = renderer.renderPage(MyComponent());

// With hydration support  
const { html, hydrationScript } = renderer.renderWithHydration(MyComponent());`}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
        <h2 className="text-xl font-semibold text-cyan-300 mb-4">Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="font-semibold text-green-400">Performance:</p>
            <p className="text-gray-300 text-sm">Faster initial page loads</p>
            <p className="text-gray-300 text-sm">Reduced client-side processing</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-blue-400">SEO:</p>
            <p className="text-gray-300 text-sm">Search engine friendly</p>
            <p className="text-gray-300 text-sm">Social media previews</p>
          </div>
        </div>
      </div>
    </div>
  );
}
