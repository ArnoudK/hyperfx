# State Management

HyperFX includes a powerful reactive state management system inspired by signals. It provides fine-grained reactivity with automatic dependency tracking, meaning only the parts of the DOM that actually change will be updated.

## Core Primitives

### Signals

Signals are the basic unit of state. In HyperFX, `createSignal` returns a **tuple** `[get, set]` where:

- `get` is a callable accessor function: call it to read the value
- `set` is a setter function: pass a value to update, returns an `undo()` function

```tsx
import { createSignal } from 'hyperfx';

// Create a signal with an initial value
const [count, setCount] = createSignal(0);

// Get the current value by calling the accessor
console.log(count()); // 0

// Set a new value by calling the setter
setCount(5);
console.log(count()); // 5

// Set using a function (receives previous value)
setCount(prev => prev + 1);
console.log(count()); // 6

// The setter returns an undo function
const undo = setCount(10);
undo(); // count is back to 6

// Use it directly in JSX
function Counter() {
  return (
    <button onclick={() => setCount(count() + 1)}>
      Count is: {count}
    </button>
  );
}
```

#### Signal Accessor Methods

The accessor (`count` in the example above) has a `.subscribe()` method for manual subscription:

```tsx
const [name, setName] = createSignal('Alice');

const unsubscribe = name.subscribe((value) => {
  console.log('Name changed to:', value);
});

setName('Bob'); // Logs: "Name changed to: Bob"
unsubscribe(); // Stop receiving updates
```

### Computed Values

Computed values are signals derived from other signals. They automatically update when their dependencies change.

```tsx
import { createSignal, createComputed } from 'hyperfx';

const [firstName, setFirstName] = createSignal('John');
const [lastName, setLastName] = createSignal('Doe');

// Automatically tracks dependencies
const fullName = createComputed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // "John Doe"

setFirstName("Jane");
console.log(fullName()); // "Jane Doe"
```

### Effects

Effects are used for side effects that should run when signals change (e.g., logging, fetching data, manual DOM updates).

```tsx
import { createSignal, createEffect } from 'hyperfx';

const [count, setCount] = createSignal(0);

createEffect(() => {
  console.log(`The count is now: ${count()}`);
  
  // Optional cleanup function returned by effect
  return () => {
    console.log("Cleaning up...");
  };
});

setCount(1); // Logs: "The count is now: 1"
```

---

## React-like Hooks

If you prefer the `[value, setValue]` pattern from React, you can use destructuring with `createSignal`:

```tsx
import { createSignal } from 'hyperfx';

function HookExample() {
  const [count, setCount] = createSignal(0);

  return (
    <button onclick={() => setCount(count() + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## Global State

Because signals are just functions/tuples, they can be defined anywhere and shared across components easily.

```tsx
// store.ts
import { createSignal } from 'hyperfx';
export const [theme, setTheme] = createSignal('light');

// ComponentA.tsx
import { theme, setTheme } from './store';
const toggleTheme = () => setTheme(theme() === 'light' ? 'dark' : 'light');

// ComponentB.tsx
import { theme } from './store';
function Display() {
  return <div class={theme}>Current theme: {theme}</div>;
}
```

---

## Advanced Usage

### Untracked Access

If you need to read a signal's value inside a computed or effect without creating a dependency, use `untrack()`.

```tsx
const [count, setCount] = createSignal(0);
const [other, setOther] = createSignal(0);

createComputed(() => {
  console.log(count()); // Creates dependency
  console.log(untrack(() => other())); // Reads value without creating dependency
});
```

### SSR Signal Registration

For server-side rendering with hydration, you can register signals with a unique key:

```tsx
import { createSignal } from 'hyperfx';

// Signals with the same key will return the same instance
export const [user, setUser] = createSignal(null, { key: 'user-session' });
```

This allows the server to serialize signal state and restore it on the client during hydration.

---

## API Reference

| Function | Description |
| --- | --- |
| `createSignal(value, options?)` | Returns `[get, set]` tuple. `get()` reads, `set(val)` sets and returns `undo()`. |
| `createComputed(fn)` | Returns a read-only accessor that updates based on dependencies. |
| `createEffect(fn)` | Runs side effects on dependency changes. Returns a stop function. |
| `untrack(fn)` | Runs function without tracking signal accesses. |
| `isAccessor(value)` | Type guard to check if value is a signal accessor. |
| `getAccessor(value)` | Extract accessor from signal tuple or return as-is. |
| `getSetter(value)` | Extract setter from signal tuple. |
| `batch(fn)` | Groups multiple signal updates into one notification cycle. |
| `derive(signal, fn)` | Creates a derived signal that transforms another signal's value. |
| `combine(...signals)` | Combines multiple signals into an array accessor. |

---

## Hooks API

HyperFX provides React-like hooks for component state management.

### useState

Returns a signal accessor and setter for local component state.

```tsx
import { useState } from 'hyperfx';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onclick={() => setCount(count() + 1)}>
      Count: {count}
    </button>
  );
}
```

### useComputed / useMemo

Returns a memoized computed value that only re-computes when dependencies change.

```tsx
import { useComputed, useState } from 'hyperfx';

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  
  const filteredTodos = useComputed(() => {
    if (filter() === 'all') return todos();
    return todos().filter(t => t.status === filter());
  });
  
  return (
    <ul>
      {filteredTodos().map(t => <li key={t.id}>{t.text}</li>)}
    </ul>
  );
}
```

### useEffect

Runs side effects with optional dependency tracking. Returns a cleanup function.

```tsx
import { useEffect, useState } from 'hyperfx';

function DataFetcher() {
  const [data, setData] = useState<unknown>(null);
  const [id, setId] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    
    fetch(`/api/${id()}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (!controller.signal.aborted) {
          setData(data);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          console.error('Fetch error:', err);
        }
      });

    return () => controller.abort();
  }, [id]); // Re-runs when id changes

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

---

## Utility Functions

### batch

Groups multiple signal updates into a single notification cycle, preventing intermediate re-renders.

```tsx
import { batch, createSignal } from 'hyperfx';

const [x, setX] = createSignal(0);
const [y, setY] = createSignal(0);

batch(() => {
  setX(10);
  setY(20);
}); // Both updates processed, single notification to subscribers
```

### derive

Creates a derived signal that transforms an existing signal's value.

```tsx
import { derive, createSignal } from 'hyperfx';

const [count, setCount] = createSignal(0);
const double = derive(count, v => v * 2);

console.log(double()); // 0
setCount(5);
console.log(double()); // 10
```

### combine

Combines multiple signals into a single computed signal that returns an array of values.

```tsx
import { combine, createSignal } from 'hyperfx';

const [firstName, setFirstName] = createSignal('John');
const [lastName, setLastName] = createSignal('Doe');

const fullName = combine(firstName, lastName);
console.log(fullName()); // ['John', 'Doe']

setFirstName('Jane');
console.log(fullName()); // ['Jane', 'Doe']
```
