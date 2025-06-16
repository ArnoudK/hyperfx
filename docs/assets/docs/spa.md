# SPA (Single Page Application)

Build single page applications with HyperFX routing.

## SPA Status

The routing system is functional but still evolving. Page refresh handling and server-side routing registration are ongoing improvements.

## Behavior

The routing system automatically intercepts navigation for internal links when a route register is active.

## Current Usage

```tsx
import { RouteRegister, createSignal } from "hyperfx";

// Create a container element for page content
const pageSpace = document.getElementById('page-space')!;

// Register routes using JSX components
RouteRegister(pageSpace)
  .registerRoute(
    "/", // route path
    () => {
      // Component function for this route
      return (
        <article>
          <p>Welcome to the home page!</p>
        </article>
      );
    }
  )
  .registerRoute(
    "/about",
    () => {
      const [count, setCount] = createSignal(0);
      
      return (
        <article>
          <h1>About Page</h1>
          <p>Counter: {count}</p>
          <button onClick={() => setCount(count() + 1)}>
            Increment
          </button>
        </article>
      );
    }
  )
  .enable(); // Start the routing system
```

### Dynamic Content with Query Parameters

You can create dynamic routes that respond to query parameters:

```tsx
import { GetQueryValue, createSignal, createComputed } from "hyperfx";

RouteRegister(pageSpace)
  .registerRoute(
    "/docs",
    () => {
      const [currentDoc, setCurrentDoc] = createSignal(
        GetQueryValue("doc") || "main"
      );
      
      // Computed content based on the current doc
      const docContent = createComputed(() => {
        const doc = currentDoc();
        const mdDoc = docsMD.find((d) => d.route_name === doc);
        
        if (mdDoc) {
          return mdDoc.data;
        } else if (doc === "main") {
          return "Welcome to HyperFX documentation!";
        } else {
          return `Documentation for '${doc}' not found.`;
        }
      });

      return (
        <div class="flex flex-auto">
          <aside class="navigation">
            {/* Navigation sidebar */}
          </aside>
          <article 
            class="p-4 flex flex-col overflow-auto mx-auto"
            innerHTML={docContent}
          />
        </div>
      );
    }
  )
  .enable();
```

### Navigation

Use regular anchor tags for navigation. The router will automatically handle internal links:

```tsx
function Navigation() {
  return (
    <nav>
      <a href="/" class="nav-link">Home</a>
      <a href="/about" class="nav-link">About</a>
      <a href="/docs?doc=getting-started" class="nav-link">
        Getting Started
      </a>
    </nav>
  );
}
```
