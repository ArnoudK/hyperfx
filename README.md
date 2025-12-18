# HyperFX - Direct DOM Reactive Framework

HyperFX is a modern, lightweight framework for building reactive web applications with direct DOM manipulation and JSX.

## ✨ Key Features

- **Direct DOM JSX**: No virtual DOM - JSX returns actual DOM elements
- **Reactive Signals**: Automatic dependency tracking and immediate updates
- **Component-Based Routing**: React Router-style routing without VDOM
- **Fine-Grained Reactivity**: Only affected elements update when data changes
- **TypeScript First**: Full type safety with JSX and reactive primitives

## 🚀 Get Started

```bash
# Create a new project
pnpm create vite my-app --template vanilla-ts
cd my-app
pnpm add hyperfx

# Configure JSX
echo '{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "hyperfx"
  }
}' > tsconfig.json
```

## 📝 Basic Example

```tsx
import { createSignal } from "hyperfx";

function Counter() {
  const count = createSignal(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => count.set(count.get() + 1)}>
        Increment
      </button>
    </div>
  );
}

// Mount to DOM
const app = document.getElementById("app")!;
app.appendChild(<Counter />);
```

## 🎯 Reactive Features

### Signals
```tsx
import { createSignal, createComputed } from "hyperfx";

const name = createSignal("John");
const greeting = createComputed(() => `Hello, ${name.get()}!`);

// Reactive updates happen automatically
name.set("Jane"); // greeting updates immediately
```

### Reactive JSX Attributes
```tsx
const isVisible = createSignal(true);
const buttonText = createSignal("Click me");

<button
  style={{ display: isVisible }}
  onClick={() => isVisible.set(false)}
>
  {buttonText}
</button>
```

### Input Binding
```tsx
const inputValue = createSignal("");

<input
  value={inputValue}
  onInput={(e) => inputValue.set(e.target.value)}
  placeholder="Type something..."
/>

// Clear input reactively
inputValue.set(""); // Input clears automatically
```

## 🛣️ Component-Based Routing

```tsx
import { Router, Route, Link } from "hyperfx";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
    </Router>
  );
}
```

## 🔧 Control Flow Components

```tsx
import { For, Show, Switch, Match } from "hyperfx";

const todos = createSignal([{ id: 1, text: "Learn HyperFX", done: false }]);

<For each={todos}>
  {(todo) => (
    <div>
      <input type="checkbox" checked={todo.done} />
      <span>{todo.text}</span>
    </div>
  )}
</For>

<Show when={todos.get().length > 0}>
  <p>You have {todos.get().length} todos!</p>
</Show>
```

## 📁 Example Project

The `example_project/` directory contains a complete example with:
- Todo app with reactive lists
- Component-based routing
- Fine-grained reactivity demonstrations

```bash
cd example_project
pnpm install
pnpm dev
```

## 🏗️ Architecture

HyperFX uses a direct DOM approach:
- **No Virtual DOM**: JSX compiles to actual DOM element creation
- **Immediate Updates**: Signals notify subscribers synchronously
- **Fine-Grained**: Only affected DOM elements update
- **Zero Abstraction**: Direct DOM API access when needed

## 📚 API Reference

### Signals
- `createSignal<T>(initialValue: T)` - Create a reactive signal
- `createComputed<T>(computeFn: () => T)` - Create a computed value

### JSX
- Direct DOM element creation with reactive attributes
- Automatic signal subscription in JSX attributes
- Fragment support with `<></>`

### Routing
- `<Router>` - Route container
- `<Route path="..." component={...} />` - Route definition
- `<Link to="...">` - Navigation links

### Control Flow
- `<For each={signal} children={(item) => JSX} />` - Reactive lists
- `<Show when={condition} children={JSX} />` - Conditional rendering
- `<Switch>`/`<Match>` - Pattern matching
