# Server-Side Rendering (SSR)

HyperFX provides built-in support for Server-Side Rendering and client-side hydration. This allows you to generate HTML on the server for faster initial page loads and better SEO, while still maintaining full reactivity on the client.

## Key Functions

### `renderToString(element)`

Converts a JSX element (and its tree) into an HTML string and extracts hydration data.

```tsx
import { renderToString } from "hyperfx/ssr";
import { App } from "./App";

const { html, hydrationData } = renderToString(<App />);
```

### `renderHydrationData(data)`

Converts hydration data into a `<script>` tag that can be embedded in the HTML.

```tsx
import { renderHydrationData } from "hyperfx/ssr";

const hydrationScript = renderHydrationData(hydrationData);
```

---

## SSR Example (Nitro/Vite)

Here is a basic setup using Nitro as a server:

```tsx
// server.tsx
import { renderToString, renderHydrationData } from "hyperfx/ssr";
import { App } from "./src/App";

export default defineEventHandler(async (event) => {
  const { html, hydrationData } = renderToString(<App />);
  const hydrationScript = renderHydrationData(hydrationData);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>HyperFX SSR</title>
      </head>
      <body>
        <div id="app">${html}</div>
        ${hydrationScript}
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  `;
});
```

---

## Client-Side Hydration

On the client, you don't need to do anything special. If the hydration data script is present, HyperFX will automatically pick it up and re-attach reactive signals to the existing DOM elements.

```tsx
// main.tsx
import { App } from "./App";

// This will automatically hydrate if data is present
document.getElementById("app")?.replaceChildren(<App />);
```

---

## How it Works

1. **Server Phase**: `renderToString` walks the component tree, generating HTML and identifying reactive parts (attributes, text nodes).
2. **Transfer Phase**: The HTML and a small JSON object (hydration data) are sent to the browser.
3. **Client Phase**: HyperFX in the browser finds the server-rendered elements and uses the hydration data to re-create the signals and event listeners without re-rendering the entire DOM.
