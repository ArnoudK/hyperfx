# State Management

HyperFX includes a powerful reactive state management system inspired by signals. It provides fine-grained reactivity with automatic dependency tracking, meaning only the parts of the DOM that actually change will be updated.

## Core Primitives

### Signals

Signals are the basic unit of state. In HyperFX, a signal is a **callable function** that acts as both a getter and a setter.

```tsx
import { createSignal } from 'hyperfx';

// Create a signal with an initial value
const count = createSignal(0);

// Get the current value by calling it
console.log(count()); // 0

// Set a new value by passing it as an argument
count(count() + 1);

// Use it directly in JSX
function Counter() {
  return (
    <button onClick={() => count(count() + 1)}>
      Count is: {count}
    </button>
  );
}
```

### Computed Values

Computed values are signals derived from other signals. They automatically update when their dependencies change.

```tsx
import { createSignal, createComputed } from 'hyperfx';

const firstName = createSignal('John');
const lastName = createSignal('Doe');

// Automatically tracks dependencies
const fullName = createComputed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // "John Doe"

firstName("Jane");
console.log(fullName()); // "Jane Doe"
```

### Effects

Effects are used for side effects that should run when signals change (e.g., logging, fetching data, manual DOM updates).

```tsx
import { createSignal, createEffect } from 'hyperfx';

const count = createSignal(0);

createEffect(() => {
  console.log(`The count is now: ${count()}`);
  
  // Optional cleanup function
  return () => {
    console.log("Cleaning up...");
  };
});
```

---

## React-like Hooks

If you prefer the `[value, setValue]` pattern from React, HyperFX provides `useState`, which is a thin wrapper around `createSignal`.

```tsx
import { useState } from 'hyperfx';

function HookExample() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count() + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## Global State

Because signals are just functions, they can be defined anywhere and shared across components easily.

```tsx
// store.ts
import { createSignal } from 'hyperfx';
export const theme = createSignal('light');

// ComponentA.tsx
import { theme } from './store';
const toggleTheme = () => theme(theme() === 'light' ? 'dark' : 'light');

// ComponentB.tsx
import { theme } from './store';
function Display() {
  return <div class={theme}>Current theme: {theme}</div>;
}
```

---

## Advanced Usage

### Batching Updates

When you need to update multiple signals at once, you can use `batch` to prevent intermediate re-renders.

```tsx
import { batch, createSignal } from 'hyperfx';

const x = createSignal(0);
const y = createSignal(0);

batch(() => {
  x(10);
  y(20);
}); // Both updates are processed, then listeners are notified once.
```

### Untracked Access

If you need to read a signal's value inside a computed or effect without creating a dependency, use `.peek()`.

```tsx
const count = createSignal(0);
const other = createSignal(0);

createComputed(() => {
  console.log(count()); // Creates dependency
  console.log(other.peek()); // Reads value without creating dependency
});
```

---

## API Reference

| Function | Description |
| --- | --- |
| `createSignal(value)` | Returns a callable signal: `sig()` to get, `sig(val)` to set. |
| `createComputed(fn)` | Returns a read-only signal that updates based on the function. |
| `createEffect(fn)` | Runs side effects on dependency changes. Returns a stop function. |
| `useState(value)` | Returns `[signal, setSignal]` array. |
| `batch(fn)` | Groups multiple signal updates into one notification cycle. |
| `template\`...\`` | Creates a reactive string template from signals. |
