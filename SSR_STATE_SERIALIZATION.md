# HyperFX SSR State Serialization

## Overview

HyperFX now supports comprehensive Server-Side Rendering (SSR) with automatic state serialization and client-side hydration. This allows signals (and in the future, resources and contexts) to maintain their state across the server-client boundary.

## Architecture

### Key Components

1. **Signal Registry** - Global registry that tracks signals with keys during SSR
2. **SSR Mode** - Lifecycle management for enabling/disabling signal registration
3. **State Serialization** - Automatic collection and serialization of registered state
4. **Client Hydration** - Restoration of serialized state on the client

### Design Decisions

- **Explicit opt-in**: `ssrHydration` defaults to `false` - must be explicitly enabled
- **Keyed signals**: Developers must provide unique keys for signals that need serialization
- **Server-managed lifecycle**: Server code must call `enableSSRMode()` before component creation
- **No helper functions**: Simple `renderToString(element, options)` API

## Usage

### Server-Side (server.tsx)

```typescript
import { renderToString, enableSSRMode, disableSSRMode } from 'hyperfx';

// 1. Enable SSR mode BEFORE creating components
enableSSRMode();

// 2. Create component tree (signals register during creation)
const appElement = <App />;

// 3. Render with hydration enabled
const { html, hydrationData } = renderToString(appElement, {
  ssrHydration: true
});

// 4. Disable SSR mode after rendering
disableSSRMode();

// 5. Inject hydration data into HTML
const hydrationScript = renderHydrationData(hydrationData);
```

### Component with Keyed Signal

```typescript
import { createSignal } from 'hyperfx';

export default function Counter() {
  // Provide unique key for SSR serialization
  const count = createSignal(0, { key: 'counter' });
  
  return (
    <div>
      <div>{count}</div>
      <button onclick={() => count(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Client-Side Hydration (client.tsx)

```typescript
import { hydrate } from 'hyperfx';

// Hydration automatically:
// 1. Reads hydration data from script tag
// 2. Creates component tree
// 3. Restores signal values from hydration data
// 4. Attaches event handlers

hydrate(
  document.getElementById('app')!,
  () => <App />
);
```

## Hydration Data Format

```json
{
  "markers": [],
  "state": {
    "signals": {
      "homepage-counter": 42,
      "user-id": "abc123"
    },
    "resources": {},
    "contexts": {}
  },
  "version": "1.0.0"
}
```

## Advanced: Initial State (Stateful SSR)

For scenarios where the server needs to provide initial values from a database or API:

```typescript
const { html, hydrationData } = renderToString(appElement, {
  ssrHydration: true,
  initialState: {
    signals: {
      'user-name': 'John Doe',
      'cart-items': ['item1', 'item2']
    }
  }
});
```

The server will:
1. Create signals with their default values
2. Override with `initialState` values before rendering
3. Serialize the final values to hydration data
4. Client restores these values during hydration

## Execution Flow

### Server Timeline

```
1. enableSSRMode()
   └─> Clears signal registry
   └─> Sets SSR mode flag

2. Create component tree
   └─> JSX components execute
   └─> createSignal(..., { key: 'x' }) called
   └─> Signal registers itself in global registry

3. renderToString(element, { ssrHydration: true })
   └─> (Optional) Restores initialState values
   └─> Renders components to HTML string
   └─> Collects all registered signals
   └─> Serializes signal values to hydrationData

4. disableSSRMode()
   └─> Clears SSR mode flag
```

### Client Timeline

```
1. Browser receives HTML with:
   - Rendered content
   - <script type="application/hyperfx-hydration"> with state

2. Client script loads and executes

3. hydrate(container, factory) called
   └─> Reads hydration data from script tag
   └─> Executes factory() to create components
       └─> createSignal(..., { key: 'x' }) called
       └─> Signal created with default value
   └─> Restores signal values from hydration data
       └─> Looks up signal by key
       └─> Calls signal.set(restoredValue)
   └─> Attaches event handlers to existing DOM
```

## Current Status

### Implemented ✅

- Signal key registration system
- SSR mode lifecycle (enable/disable)
- Signal serialization during SSR
- Client-side signal restoration
- Initial state support for signals
- Comprehensive type definitions

### In Progress 🚧

- Resource serialization (data, error, loading state)
- Context serialization

### Future 📋

- Promise streaming for async resources
- Error serialization for resources
- Nested context serialization
- Performance optimizations

## Testing

### Verify Signal Serialization

```bash
# Start the server
cd ssr-example && pnpm build && node .output/server/index.mjs

# Check hydration data in HTML
curl -s http://localhost:3000 | grep -A5 'application/hyperfx-hydration'

# Should output:
# <script type="application/hyperfx-hydration">
# {"markers":[],"state":{"signals":{"homepage-counter":0},...},"version":"1.0.0"}
# </script>
```

### Test Interactive Behavior

1. Open http://localhost:3000 in browser
2. Open DevTools console
3. Click counter buttons
4. Verify counter updates without page reload
5. Verify no hydration mismatch warnings

## Implementation Notes

### Why enableSSRMode() Must Be Called Before Component Creation

JSX components execute **immediately** when their JSX syntax is evaluated:

```typescript
// WRONG: Component executes before SSR mode enabled
const appElement = <App />;  // Signals create here!
enableSSRMode();  // Too late!

// CORRECT: Enable SSR mode first
enableSSRMode();
const appElement = <App />;  // Signals register during creation
```

### Signal Registry Pattern

The global signal registry allows signals to self-register during creation:

```typescript
// In signal.ts
const globalSignalRegistry = new Map<string, Signal>();

export function createSignal<T>(value: T, options?: { key?: string }) {
  const signal = new SignalImpl(value);
  
  if (options?.key) {
    globalSignalRegistry.set(options.key, signal);
  }
  
  return signal;
}
```

### Hydration Data Injection

The hydration data is injected as a JSON script tag:

```html
<script type="application/hyperfx-hydration">
{"markers":[],"state":{"signals":{"counter":42}},"version":"1.0.0"}
</script>
```

This allows the client to read it synchronously before hydration begins.

## Comparison with Other Frameworks

### React Server Components

- **React**: Separates Server/Client components, serializes RSC payload
- **HyperFX**: Isomorphic components, serializes reactive state

### SolidJS

- **Solid**: SSR with automatic hydration, serializes resource state
- **HyperFX**: Similar approach, inspired by Solid's architecture

### Qwik

- **Qwik**: Resumability - serializes entire application state
- **HyperFX**: Hydration - only serializes explicit keyed state

## FAQ

### Why do signals need keys?

Keys allow the server and client to match up the same logical signal across the SSR/hydration boundary. Without keys, the client wouldn't know which hydration data corresponds to which signal.

### What happens if I forget to call enableSSRMode()?

Signals will still be created, but they won't register in the global registry. The `ssrHydration` data will have empty `signals: {}`.

### Can I use the same key for multiple signals?

No. Keys must be unique. If you create a signal with an existing key, it will return the already-registered signal instead of creating a new one.

### Do all signals need keys?

No. Only signals that need to be serialized for SSR require keys. Local component state that doesn't need SSR hydration can omit keys.

### What about signal values that can't be serialized (functions, DOM nodes, etc.)?

Currently, only JSON-serializable values are supported. If serialization fails, a warning is logged and that signal is skipped.

## Contributing

To extend SSR state serialization:

1. Add new registry for your primitive (like `globalResourceRegistry`)
2. Implement registration during primitive creation
3. Add collection logic in `renderToString()`
4. Add restoration logic in `hydrate()`
5. Update `HydrationData` interface
6. Add tests

Example for resources:

```typescript
// In resource.ts
const globalResourceRegistry = new Map<string, Resource>();

export function createResource(fetcher, options?: { key?: string }) {
  const resource = new ResourceImpl(fetcher);
  
  if (options?.key && isSSRMode) {
    globalResourceRegistry.set(options.key, resource);
  }
  
  return resource;
}
```
