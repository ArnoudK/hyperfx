# State Management with Alien Signals

HyperFX includes powerful reactive state management using [alien-signals](https://github.com/xenova/alien-signals), providing fine-grained reactivity with automatic dependency tracking.

## Quick Start with JSX

```tsx
import { createSignal } from 'hyperfx';

function Counter() {
  // Create a reactive signal
  const count = createSignal(0);
  
  const increment = () => {
    count(count() + 1); // Update signal value
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

## Core Concepts

### Signals
Signals are reactive primitive values that automatically track dependencies and trigger updates:

```tsx
import { createSignal } from 'hyperfx';

// Create a signal with initial value
const nameSignal = createSignal('John');

// Get the current value
const currentName = nameSignal();

// Set a new value (triggers reactivity)
nameSignal('Jane');

// Use in JSX (automatically reactive)
function Greeting() {
  return <p>{template`Hello, ${nameSignal}!`}</p>;
}
```

### Computed Values
Computed values are derived from other reactive values:

```tsx
import { createSignal, createComputed, template } from 'hyperfx';

const firstName = createSignal('John');
const lastName = createSignal('Doe');

// Automatically updates when firstName or lastName changes
const fullName = createComputed(() => template`${firstName()} ${lastName()}`);

function UserProfile() {
  return (
    <div>
      <p>Full name: {fullName}</p>
      <input 
        type="text" 
        value={firstName} 
        onInput={(e) => firstName(e.target.value)} 
      />
    </div>
  );
}

// Computed automatically updates when dependencies change
const fullName = createComputed(() => 
  template`${firstName()} ${lastName()}`
);
```

### Effects
Effects run side effects when dependencies change:

```tsx
import { createSignal, createEffect } from 'hyperfx';

function ExampleComponent() {
  const [count, setCount] = createSignal(0);

  // Effect runs when count changes
  createEffect(() => {
    console.log(`Count is now: ${count()}`);
    
    // Optional cleanup function
  return () => {
    console.log('Cleaning up effect');
  };
});
```

## Component Integration

### Automatic Re-rendering
Components automatically re-render when their signals change:

```tsx
import { createSignal, createComputed } from "hyperfx";

function TodoApp() {
  const [todos, setTodos] = createSignal([]);
  const [filter, setFilter] = createSignal('all');
  
  // This computed will trigger re-renders when todos or filter change
  const filteredTodos = createComputed(() => {
    const allTodos = todos();
    const currentFilter = filter();
    
    return currentFilter === 'all' 
      ? allTodos 
      : allTodos.filter(todo => todo.completed === (currentFilter === 'completed'));
  });
  
  return (
    <div>
      {/* UI updates automatically when filteredTodos changes */}
      {filteredTodos().map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

### Local Component State
Each component manages its own state using signals:

```tsx
import { createSignal, createEffect } from "hyperfx";

function UserProfile({ userId }: { userId: number }) {
  // These signals are scoped to this component
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  
  // Load user data on mount
  createEffect(() => {
    fetchUser(userId).then(userData => {
      setUser(userData);
      setLoading(false);
    });
  });
  
  return loading() 
    ? <div>Loading...</div>
    : <div>Hello, {user()?.name}</div>;
}
```

## Global State Management

### Global Store
Use the global store for app-wide state:

```tsx
import { createSignal, createComputed } from 'hyperfx';

// Define global signals (can be in a separate module)
export const [currentUser, setCurrentUser] = createSignal(null);
export const [theme, setTheme] = createSignal('light');

// Access from any component
function Header() {
  // Automatically reactive to global state changes
  const headerClass = createComputed(() =>
    theme() === 'dark' ? 'dark-theme' : 'light-theme'
  );
  
  return (
    <header class={headerClass()}>
      Welcome, {currentUser()?.name || 'Guest'}
    </header>
  );
}
```

### Custom Stores
Create custom stores for domain-specific state:

```tsx
import { createSignal, createComputed } from 'hyperfx';

class ShoppingCartStore {
  private [items, setItems] = createSignal([]);
  
  addItem(product) {
    setItems([...items(), product]);
  }
  
  getTotal() {
    return createComputed(() =>
      items().reduce((sum, item) => sum + item.price, 0)
    );
  }
  
  getItems() {
    return this.items;
  }
}

// Use in components
const cart = new ShoppingCartStore();

function CartComponent() {
  return (
    <div>
      <div>Total: ${cart.getTotal()()}</div>
      <div>Items: {cart.getItems()().length}</div>
    </div>
  );
}
```

## Modern Signal Patterns

HyperFX provides React-like primitives for state management:

```tsx
import { useState, useComputed, useEffect } from 'hyperfx';

import { createSignal, createComputed, createEffect, template } from 'hyperfx';

function MyComponent() {
  const [count, setCount] = createSignal(0);
  const [name, setName] = createSignal('');
  
  const greeting = createComputed(() => 
    template`Hello, ${name() || 'Anonymous'}! Count: ${count()}`
  );
  
  createEffect(() => {
    console.log(`Count changed: ${count()}`);
  });
  
  return (
    <div>
      <input 
        value={name()}
        onInput={(e) => setName((e.target as HTMLInputElement).value)}
        placeholder="Enter your name"
      />
      <p>{greeting()}</p>
      <button onClick={() => setCount(count => count + 1)}>
        Increment: {count()}
      </button>
    </div>
  );
}
```

## Advanced Patterns

### Derived State
Create complex derived state from multiple sources:

```tsx
import { createSignal, createComputed } from 'hyperfx';

function TodoApp() {
  const [todos, setTodos] = createSignal([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [statusFilter, setStatusFilter] = createSignal('all');

  const filteredTodos = createComputed(() => {
    let result = todos();
    
    // Filter by search term
    const search = searchTerm().toLowerCase();
    if (search) {
    result = result.filter(todo => 
      todo.text.toLowerCase().includes(search)
    );
  }
  
  // Filter by status
  const status = statusFilter();
  if (status !== 'all') {
    result = result.filter(todo => 
      todo.completed === (status === 'completed')
    );
  }
  
  return result;
});

  return (
    <div>
      <input 
        placeholder="Search todos..."
        value={searchTerm()}
        onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
      />
      <select value={statusFilter()} onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
      <ul>
        {filteredTodos().map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

### State Synchronization
Sync state with external sources:

```tsx
import { createSignal, createEffect } from 'hyperfx';

function SettingsComponent() {
  // Sync with localStorage
  const [settings, setSettings] = createSignal(
    JSON.parse(localStorage.getItem('settings') || '{}')
  );

  createEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings()));
  });

  // Sync with server
  const [userData, setUserData] = createSignal(null);

  createEffect(() => {
    const user = userData();
  if (user) {
    fetch('/api/users/update', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  }
});
```

### Performance Optimization

#### Batching Updates
Multiple signal updates are automatically batched:

```typescript
import { batch } from 'hyperfx';

// All updates in this function happen together
batch(() => {
  firstName.set('John');
  lastName.set('Doe');
  email.set('john@example.com');
}); // Only one re-render happens
```

#### Selective Re-rendering
Components only re-render when their specific dependencies change:

```tsx
import { createSignal, createComputed } from 'hyperfx';

function OptimizedComponent() {
  const [count, setCount] = createSignal(0);
  const [name, setName] = createSignal('');
  
  // This computed only depends on count, not name
  const doubledCount = createComputed(() => count() * 2);
  
  return (
    <div>
      {/* Changing name won't re-render this part */}
      <p>Doubled: {doubledCount()}</p>
      
      {/* Only this part re-renders when name changes */}
      <p>Name: {name()}</p>
      
      <input value={name()} onInput={(e) => setName((e.target as HTMLInputElement).value)} />
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </div>
  );
}
```

## Best Practices

1. **Keep state minimal**: Only store what you need in signals
2. **Use computed for derived data**: Don't manually update derived values
3. **Clean up effects**: Return cleanup functions from effects when needed
4. **Use functional updates**: Prefer `setValue(prev => prev + 1)` for state that depends on previous value
5. **Use local state when possible**: Prefer component-local state over global state
6. **Leverage JSX**: Use JSX for cleaner, more readable component code

## Migration from Other State Libraries

### From Redux
```tsx
// Redux style
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
  }
};

// HyperFX style
const [count, setCount] = createSignal(0);
const increment = () => setCount(count => count + 1);
```

### From React
```tsx
// React style
function Component() {
  const [count, setCount] = useState(0);
  const doubled = useMemo(() => count * 2, [count]);
  
  useEffect(() => {
    console.log(count);
  }, [count]);
  
  return <div>{doubled}</div>;
}

// HyperFX style
function Component() {
  const [count, setCount] = createSignal(0);
  const doubled = createComputed(() => count() * 2);
  
  createEffect(() => {
    console.log(count());
  });
  
  return <div>{doubled()}</div>;
}
```

## API Reference

### Signal Functions
- `createSignal<T>(initialValue: T): [() => T, (value: T | ((prev: T) => T)) => void]`
- `createComputed<T>(computation: () => T): () => T`
- `createEffect(effectFn: () => void | (() => void)): () => void`

### Utility Functions  
- `batch(updateFn: () => void): void` - Batch multiple signal updates
- `untrack<T>(fn: () => T): T` - Run computation without tracking dependencies
