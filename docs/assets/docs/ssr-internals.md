# How SSR Hydration Works in HyperFX

This document explains the technical implementation of Server-Side Rendering (SSR) and hydration in HyperFX.

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [How It Works](#how-it-works)
- [Design Decisions](#design-decisions)
- [Implementation Details](#implementation-details)

---

## Overview

HyperFX uses structural hydration. The client validates that its DOM tree matches the server's DOM tree by comparing structure, not element IDs.

### Key Characteristics

- No hydration markers or IDs in HTML
- Validates by comparing tag names and tree structure
- Replaces server DOM with client DOM
- Restores signal state from serialized data
- Falls back to client-side render on mismatch

---

## The Problem

### JSX Evaluation Order

JSX evaluates children before parents:

```tsx
// This JSX:
<div id="parent">
  <span>Child</span>
</div>

// Compiles to:
jsx("div", { 
  id: "parent",
  children: jsx("span", { children: "Child" })
  //         ^ span executes first
})
// ^ div executes second
```

This means the client creates elements children-first (bottom-up), but the server serializes the tree parent-first (top-down). If you assign sequential IDs during creation, they don't match.

### Why Not Fix the Creation Order?

**Server serializes children-first**
- Requires post-order tree traversal
- Breaks streaming

**Client creates parent-first**  
- Requires changing how JSX works
- Would need to defer children evaluation

**Don't use creation order for matching**
- Match by structure instead

---

## The Solution

Walk both trees in parallel from root to leaves. At each node:
- Compare tag names
- Compare child counts
- Recursively validate children

Both trees have the same structure regardless of creation order.

---

## How It Works

### Server

```typescript
enableSSRMode();

const appElement = <App />;

const { html, hydrationData } = renderToString(appElement, { 
  ssrHydration: true 
});

const script = renderHydrationData(hydrationData);
// Creates: <script>window.__HYPERFX_HYDRATION_DATA__ = {...};</script>

disableSSRMode();
```

### Client

```typescript
const serverRoot = document.body.firstElementChild;
if (!serverRoot) return; // No SSR content

startHydration();

const clientRoot = factory(); // Build fresh tree with handlers

const matches = walkAndValidate(clientRoot, serverRoot);

serverRoot.replaceWith(clientRoot);

// Restore signals
const data = window.__HYPERFX_HYDRATION_DATA__;
for (const [key, value] of Object.entries(data.state.signals)) {
  const signal = getSignal(key);
  signal.set(value);
}

endHydration();
```

### Validation

```typescript
function walkAndValidate(clientNode: Element, serverNode: Element, path = 'root'): boolean {
  if (clientNode.tagName !== serverNode.tagName) {
    console.warn(`Tag mismatch at ${path}`);
    return false;
  }

  const clientChildren = Array.from(clientNode.children);
  const serverChildren = Array.from(serverNode.children);

  if (clientChildren.length !== serverChildren.length) {
    console.warn(`Child count mismatch at ${path}`);
    return false;
  }

  for (let i = 0; i < clientChildren.length; i++) {
    if (!walkAndValidate(clientChildren[i], serverChildren[i], `${path}[${i}]`)) {
      return false;
    }
  }

  return true;
}
```

---

## Design Decisions

### Replace Instead of Reuse

We replace the server DOM with the client DOM rather than reusing server elements.

**Why:**
- Client DOM already has event handlers attached
- Client DOM already has reactive bindings set up
- No need to copy attributes or handlers

### Window Global for Hydration Data

We use `window.__HYPERFX_HYDRATION_DATA__` instead of a JSON script tag.

**Why:**
- Available immediately
- Easy to inspect in dev tools
- Not affected by DOM mutations

Script tag is still checked as a fallback.

### Always Validate

We validate structure in all environments.

**Why:**
- Catches mismatches between server and client
- Provides error messages with paths
- Enables automatic fallback

### No Hydration IDs

We don't add `data-hfxh` or similar attributes.

**Why:**
- Cleaner HTML
- Smaller page size
- Not needed for structural matching

### Explicit Signal Keys

Signals need a `key` option to be serialized.

```tsx
// Will be serialized
const [count] = createSignal(0, { key: 'counter' });

// Won't be serialized
const [local] = createSignal(false);
```

**Why:**
- Explicit control over what gets serialized
- Prevents accidental serialization of transient state
- Keys must be unique

---

## Implementation Details

### Signal Registry

Server mode enables signal tracking:

```typescript
let ssrMode = false;
const signalRegistry = new Map<string, Signal>();

export function enableSSRMode() {
  ssrMode = true;
  signalRegistry.clear();
}

export function createSignal(initialValue, options) {
  const signal = new Signal(initialValue);
  
  if (ssrMode && options?.key) {
    signalRegistry.set(options.key, signal);
  }
  
  return signal;
}
```

During `renderToString`, signal values are collected:

```typescript
const signals = {};
for (const [key, signal] of getRegisteredSignals()) {
  signals[key] = signal.peek();
}
```

### Event Handlers

Event handlers are attached when creating elements:

```typescript
if (name.startsWith('on') && typeof value === 'function') {
  const eventName = name.slice(2).toLowerCase();
  element.addEventListener(eventName, value);
}
```

When we replace the server DOM with client DOM, handlers are already attached.

### Hydration Data Format

```typescript
interface HydrationData {
  state: {
    signals: Record<string, any>;
    resources: Record<string, any>;
    contexts: Record<string, any>;
  };
  version: string;
}
```

Currently only `signals` is implemented.

---

## Trade-offs

### What you get

- Simple implementation
- No IDs in HTML
- Structural validation with error messages

### What you don't get

- Partial hydration
- Progressive hydration
- Component-level hydration control

### Memory

During hydration, both server and client DOM trees exist briefly before replacement.

---

## Comparison to Other Approaches

### ID-based hydration
Assigns IDs during creation and matches by ID. Requires consistent creation order.

### Marker-based hydration  
Uses HTML comments or attributes to mark boundaries. Still requires some form of ordering.

### Attribute-based hydration
Uses attributes like `data-server-rendered`. Similar to our approach but with extra attributes.

### Compiled hydration
Generates optimized hydration code at build time. Requires build-time analysis.

HyperFX validates structure at runtime without IDs or markers.
