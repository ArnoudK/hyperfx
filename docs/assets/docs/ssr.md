# Server-Side Rendering (SSR)

HyperFX provides built-in support for Server-Side Rendering and client-side hydration. This allows you to generate HTML on the server for faster initial page loads and better SEO, while still maintaining full reactivity on the client.

## Key Concepts

### Structural Hydration

HyperFX uses **structural hydration** - the client validates that its component tree matches the server-rendered tree by walking both trees in parallel and comparing:
- Element tag names
- Tree structure and positions
- Child element counts

This approach is:
- **Order-independent**: Works regardless of JSX evaluation order
- **Clean**: No hydration IDs in the HTML output
- **Robust**: Validates structure and falls back to client-side render on mismatch

### State Restoration

Signal state is serialized on the server and restored on the client via `window.__HYPERFX_HYDRATION_DATA__`, ensuring your reactive state persists across the SSR boundary.

---

## Server-Side API

### `renderToString(element, options?)`

Converts a JSX element into an HTML string and extracts hydration data.

```tsx
import { renderToString, enableSSRMode, disableSSRMode } from "hyperfx";

// Enable SSR mode before creating components
enableSSRMode();

const appElement = <App />;

const { html, hydrationData } = renderToString(appElement, { 
  ssrHydration: true  // Enable signal serialization
});

disableSSRMode();
```

**Options:**
- `ssrHydration`: Enable/disable hydration data collection (default: `false`)
- `initialState`: Restore signals to specific values before rendering

### `renderHydrationData(data)`

Converts hydration data into a `<script>` tag that sets `window.__HYPERFX_HYDRATION_DATA__`.

```tsx
import { renderHydrationData } from "hyperfx";

const hydrationScript = renderHydrationData(hydrationData);
// Returns: <script>window.__HYPERFX_HYDRATION_DATA__ = {...};</script>
```

---

## Client-Side API

### `hydrate(container, factory)`

Hydrates server-rendered content by:
1. Building a fresh client DOM tree with event handlers
2. Validating it matches the server tree structurally
3. Replacing server DOM with client DOM
4. Restoring signal state

```tsx
import { hydrate, isHydratable, mount } from "hyperfx";

if (isHydratable(document.body)) {
  hydrate(document.body, () => <App />);
} else {
  // No SSR content, do client-side mount
  mount(() => <App />, document.body, { mode: "replace" });
}
```

### `isHydratable(container)`

Checks if a container has server-rendered content to hydrate.

```tsx
import { isHydratable } from "hyperfx";

if (isHydratable(document.body)) {
  // Has SSR content
}
```

---

## Complete SSR Example

### Server Setup

```tsx
// server.tsx
import { 
  renderToString, 
  renderHydrationData,
  enableSSRMode,
  disableSSRMode 
} from "hyperfx";
import { App } from "./App";

export default async function handler(req: Request) {
  // Enable SSR mode
  enableSSRMode();

  // Create app element
  const appElement = <App />;
  
  // Render to HTML with hydration data
  const { html, hydrationData } = renderToString(appElement, { 
    ssrHydration: true
  });
  
  // Generate hydration script
  const hydrationScript = renderHydrationData(hydrationData);
  
  // Disable SSR mode
  disableSSRMode();

  // Return complete HTML document
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>HyperFX SSR App</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        ${html}
        ${hydrationScript}
        <script src="/client.js" type="module"></script>
      </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html" }
  });
}
```

### Client Setup

```tsx
// client.tsx
import { hydrate, isHydratable, mount } from "hyperfx";
import { App } from "./App";

function initializeClient() {
  const ClientApp = () => <App />;

  if (isHydratable(document.body)) {
    // Hydrate server-rendered content
    hydrate(document.body, ClientApp);
  } else {
    // No SSR content, do client-side mount
    mount(() => <ClientApp />, document.body, { mode: "replace" });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeClient);
} else {
  initializeClient();
}
```

### Component with Signal

```tsx
// App.tsx
import { createSignal } from "hyperfx";

export function App() {
  // Register signal with a unique key for SSR
  const [count, setCount] = createSignal(0, { key: 'app-counter' });

  return (
    <div id="app">
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
```

---

## Signal Serialization

To serialize a signal across the SSR boundary, provide a unique `key`:

```tsx
// With key - will be serialized
const [count, setCount] = createSignal(0, { key: 'counter' });

// Without key - won't be serialized (local state only)
const [local, setLocal] = createSignal(0);
```

The key must be:
- Unique across your application
- Consistent between server and client
- A valid object property name

---

## How It Works

### 1. Server Phase
- `enableSSRMode()` activates signal registry
- Components create and register signals with keys
- `renderToString()` serializes the DOM tree to HTML
- Signal values are collected from the registry
- `renderHydrationData()` creates a script tag with state

### 2. Transfer Phase
- Clean HTML (no hydration markers)
- Hydration data via `window.__HYPERFX_HYDRATION_DATA__`

### 3. Client Phase
- Client creates fresh component tree with event handlers
- `hydrate()` validates client tree matches server tree structurally
- Server DOM is replaced with client DOM
- Signal values are restored from hydration data
- Application is fully interactive

### 4. Fallback Behavior
- If structure doesn't match: full client-side render
- If hydration fails: automatic fallback to client-side render
- Graceful degradation ensures app always works

---

## Best Practices

### ✅ Do
- Always call `enableSSRMode()` before creating components
- Always call `disableSSRMode()` after rendering
- Use unique, descriptive keys for signals that need SSR
- Match component structure exactly between server and client
- Handle both hydration and non-hydration paths in client code

### ❌ Don't
- Don't render different content on server vs client (causes mismatch)
- Don't use randomness or timestamps in SSR content
- Don't forget to include the hydration script in your HTML
- Don't reuse signal keys across different components

---

## Troubleshooting

### Structure Mismatch Warning

If you see: `[HyperFX] Structure mismatch detected`

**Causes:**
- Server and client rendering different content
- Conditional logic that differs between environments
- Missing or extra elements on client vs server

**Solution:**
- Ensure component logic is consistent
- Use same data for initial render
- Check for `window`/`document` checks that change rendering

### Signals Not Restoring

**Causes:**
- Signal created without a `key` option
- Key mismatch between server and client
- Hydration script not included in HTML

**Solution:**
- Add `key` option to signal: `createSignal(0, { key: 'my-signal' })`
- Verify keys match exactly
- Check `window.__HYPERFX_HYDRATION_DATA__` exists

### Event Handlers Not Working

**Causes:**
- Hydration failed and fell back to server DOM
- Event handlers not attached in component

**Solution:**
- Check console for hydration errors
- Ensure client creates handlers same as initial render
- Verify component code runs on client
