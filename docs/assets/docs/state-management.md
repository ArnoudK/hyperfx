# State Management with Alien Signals

HyperFX now includes powerful reactive state management using [alien-signals](https://github.com/xenova/alien-signals), providing fine-grained reactivity with automatic dependency tracking.

## Quick Start

```typescript
import { Component, RootComponent, el, t } from 'hyperfx';

// Create a component with reactive state
const counter = Component(
  RootComponent(),
  { initialCount: 0 },
  (data, comp) => {
    // Create a reactive signal
    const countSignal = comp.createSignal('count', data.initialCount);
    
    return el('div', {}, [
      el('p', {}, [t(`Count: ${countSignal.get()}`)]),
      el('button', {
        onclick: () => countSignal.set(countSignal.get() + 1)
      }, [t`Increment`])
    ]);
  }
);
```

## Core Concepts

### Signals
Signals are reactive primitive values that automatically track dependencies and trigger updates:

```typescript
// Create a signal in a component
const nameSignal = comp.createSignal('name', 'John');

// Get the current value
const currentName = nameSignal.get();

// Set a new value (triggers reactivity)
nameSignal.set('Jane');
```

### Computed Values
Computed values are derived from other reactive values:

```typescript
const firstName = comp.createSignal('firstName', 'John');
const lastName = comp.createSignal('lastName', 'Doe');

// Computed automatically updates when dependencies change
const fullName = comp.createComputed('fullName', () => 
  `${firstName.get()} ${lastName.get()}`
);
```

### Effects
Effects run side effects when dependencies change:

```typescript
// Effect runs when count changes
comp.addEffect(() => {
  const count = countSignal.get();
  console.log(`Count is now: ${count}`);
  
  // Optional cleanup function
  return () => {
    console.log('Cleaning up effect');
  };
});
```

## Component Integration

### Automatic Re-rendering
Components automatically re-render when their signals change:

```typescript
const todoApp = Component(
  RootComponent(),
  {},
  (data, comp) => {
    const todos = comp.createSignal('todos', []);
    const filter = comp.createSignal('filter', 'all');
    
    // This computed will trigger re-renders when todos or filter change
    const filteredTodos = comp.createComputed('filtered', () => {
      const allTodos = todos.get();
      const currentFilter = filter.get();
      
      return currentFilter === 'all' 
        ? allTodos 
        : allTodos.filter(todo => todo.completed === (currentFilter === 'completed'));
    });
    
    return el('div', {}, [
      // UI updates automatically when filteredTodos changes
      ...filteredTodos.get().map(todo => 
        el('div', {}, [t(todo.text)])
      )
    ]);
  }
);
```

### Local Component State
Each component has its own isolated state store:

```typescript
const userProfile = Component(
  RootComponent(),
  { userId: 123 },
  (data, comp) => {
    // These signals are scoped to this component
    const user = comp.createSignal('user', null);
    const loading = comp.createSignal('loading', true);
    
    // Load user data on mount
    comp.addEffect(() => {
      fetchUser(data.userId).then(userData => {
        user.set(userData);
        loading.set(false);
      });
    });
    
    return loading.get() 
      ? el('div', {}, [t`Loading...`])
      : el('div', {}, [t(`Hello, ${user.get()?.name}`)]);
  }
);
```

## Global State Management

### Global Store
Use the global store for app-wide state:

```typescript
import { globalStore } from 'hyperfx';

// Define global signals
const currentUser = globalStore.defineSignal('currentUser', null);
const theme = globalStore.defineSignal('theme', 'light');

// Access from any component
const header = Component(
  RootComponent(),
  {},
  (data, comp) => {
    // Re-render when global state changes
    comp.addEffect(() => {
      currentUser.get();
      theme.get();
      comp.Render(true);
    });
    
    return el('header', {
      class: theme.get() === 'dark' ? 'dark-theme' : 'light-theme'
    }, [
      t(`Welcome, ${currentUser.get()?.name || 'Guest'}`)
    ]);
  }
);
```

### Custom Stores
Create custom stores for domain-specific state:

```typescript
class ShoppingCartStore extends StateStore {
  private items = this.defineSignal('items', []);
  
  addItem(product) {
    const currentItems = this.items.get();
    this.items.set([...currentItems, product]);
  }
  
  getTotal() {
    return this.defineComputed('total', () =>
      this.items.get().reduce((sum, item) => sum + item.price, 0)
    );
  }
  
  getItems() {
    return this.items;
  }
}

// Use in components
const cart = new ShoppingCartStore();

const cartComponent = Component(
  RootComponent(),
  { cart },
  (data, comp) => {
    comp.addEffect(() => {
      data.cart.getItems().get();
      comp.Render(true);
    });
    
    return el('div', {}, [
      t(`Total: $${data.cart.getTotal().get()}`),
      t(`Items: ${data.cart.getItems().get().length}`)
    ]);
  }
);
```

## Hooks-Style API

For a more familiar React-like experience:

```typescript
import { useState, useComputed, useEffect } from 'hyperfx';

const myComponent = Component(
  RootComponent(),
  {},
  (data, comp) => {
    const [getCount, setCount] = useState(0);
    const [getName, setName] = useState('');
    
    const getGreeting = useComputed(() => 
      `Hello, ${getName() || 'Anonymous'}! Count: ${getCount()}`
    );
    
    useEffect(() => {
      console.log(`Count changed: ${getCount()}`);
    }, [getCount]);
    
    return el('div', {}, [
      el('input', {
        value: getName(),
        oninput: (e) => setName(e.target.value)
      }),
      el('p', {}, [t(getGreeting())]),
      el('button', {
        onclick: () => setCount(count => count + 1)
      }, [t`Increment`])
    ]);
  }
);
```

## Advanced Patterns

### Derived State
Create complex derived state from multiple sources:

```typescript
const todos = comp.createSignal('todos', []);
const searchTerm = comp.createSignal('search', '');
const statusFilter = comp.createSignal('status', 'all');

const filteredTodos = comp.createComputed('filtered', () => {
  let result = todos.get();
  
  // Filter by search term
  const search = searchTerm.get().toLowerCase();
  if (search) {
    result = result.filter(todo => 
      todo.text.toLowerCase().includes(search)
    );
  }
  
  // Filter by status
  const status = statusFilter.get();
  if (status !== 'all') {
    result = result.filter(todo => 
      todo.completed === (status === 'completed')
    );
  }
  
  return result;
});
```

### State Synchronization
Sync state with external sources:

```typescript
// Sync with localStorage
const settings = comp.createSignal('settings', 
  JSON.parse(localStorage.getItem('settings') || '{}')
);

comp.addEffect(() => {
  const currentSettings = settings.get();
  localStorage.setItem('settings', JSON.stringify(currentSettings));
});

// Sync with server
const userData = comp.createSignal('userData', null);

comp.addEffect(() => {
  const user = userData.get();
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

```typescript
const expensiveComponent = Component(
  parent,
  {},
  (data, comp) => {
    const count = comp.createSignal('count', 0);
    const name = comp.createSignal('name', '');
    
    // This computed only depends on count, not name
    const doubledCount = comp.createComputed('doubled', () => count.get() * 2);
    
    return el('div', {}, [
      // Changing name won't re-render this part
      el('p', {}, [t(`Doubled: ${doubledCount.get()}`)]),
      
      // Only this part re-renders when name changes
      el('p', {}, [t(`Name: ${name.get()}`)])
    ]);
  }
);
```

## Best Practices

1. **Keep state minimal**: Only store what you need in signals
2. **Use computed for derived data**: Don't manually update derived values
3. **Clean up effects**: Return cleanup functions from effects when needed
4. **Batch related updates**: Use the batch function for multiple related changes
5. **Use local state when possible**: Prefer component-local state over global state
6. **Name your signals**: Use descriptive keys for better debugging

## Migration from Other State Libraries

### From Redux
```typescript
// Redux style
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
  }
};

// HyperFX style
const count = comp.createSignal('count', 0);
const increment = () => count.set(count.get() + 1);
```

### From MobX
```typescript
// MobX style
class Store {
  @observable count = 0;
  @computed get doubled() { return this.count * 2; }
  @action increment() { this.count++; }
}

// HyperFX style
class Store extends StateStore {
  count = this.defineSignal('count', 0);
  doubled = this.defineComputed('doubled', () => this.count.get() * 2);
  increment() { this.count.set(this.count.get() + 1); }
}
```

## API Reference

### StateStore Methods
- `defineSignal<T>(key: string, initialValue: T): ReactiveSignal<T>`
- `getSignal<T>(key: string): ReactiveSignal<T> | undefined`
- `defineComputed<T>(key: string, computation: () => T): ComputedSignal<T>`
- `getComputed<T>(key: string): ComputedSignal<T> | undefined`
- `addEffect(effectFn: () => void | (() => void)): void`
- `dispose(): void`

### Component State Methods
- `comp.createSignal<T>(key: string, initialValue: T): ReactiveSignal<T>`
- `comp.getSignal<T>(key: string): ReactiveSignal<T> | undefined`
- `comp.createComputed<T>(key: string, computation: () => T): ComputedSignal<T>`
- `comp.getComputed<T>(key: string): ComputedSignal<T> | undefined`
- `comp.addEffect(effectFn: () => void | (() => void)): void`
- `comp.getStore(): StateStore`

### Utility Functions
- `createSignal<T>(initialValue: T): ReactiveSignal<T>`
- `createComputed<T>(computation: () => T): ComputedSignal<T>`
- `createEffect(effectFn: () => void | (() => void)): EffectCleanup`
- `useState<T>(initialValue: T): [() => T, (value: T | ((prev: T) => T)) => void]`
- `useComputed<T>(computation: () => T): () => T`
- `useEffect(effectFn: () => void | (() => void), deps?: (() => any)[]): EffectCleanup`
- `batch(updateFn: () => void): void`
- `derive<T, R>(signal: ReactiveSignal<T>, transform: (value: T) => R): ComputedSignal<R>`
- `combine<T>(...signals: ReactiveSignal<T>[]): ComputedSignal<T[]>`
