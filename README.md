# HyperFX - Direct DOM Reactive Framework

HyperFX is a modern, lightweight framework for building reactive web applications with direct DOM manipulation and JSX.

## ✨ Key Features

- **Direct DOM JSX**: No virtual DOM - JSX returns actual DOM elements
- **Callable Signals**: Simple function-based API for state management
- **Component-Based Routing**: React Router-style routing without VDOM
- **Fine-Grained Reactivity**: Only affected elements update when data changes
- **SSR & Hydration**: First-class support for Server-Side Rendering
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
      <button onClick={() => count(count() + 1)}>
        Increment
      </button>
    </div>
  );
}

// Mount to DOM
const app = document.getElementById("app")!;
app.replaceChildren(<Counter />);
```

## 🎯 Reactive Features

### Signals

```tsx
import { createSignal, createComputed } from "hyperfx";

const name = createSignal("John");
const greeting = createComputed(() => `Hello, ${name()}!`);

// Reactive updates happen automatically
name("Jane"); // greeting updates immediately
```

### Reactive JSX Attributes

```tsx
const isVisible = createSignal(true);
const buttonText = createSignal("Click me");

<button
  style={{ display: () => isVisible() ? 'block' : 'none' }}
  onClick={() => isVisible(!isVisible())}
>
  {buttonText}
</button>
```

### Input Binding

```tsx
const inputValue = createSignal("");

<input
  value={inputValue}
  onInput={(e) => inputValue(e.target.value)}
  placeholder="Type something..."
/>

// Clear input reactively
inputValue(""); // Input clears automatically
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

<Show when={() => todos().length > 0}>
  <p>You have {() => todos().length} todos!</p>
</Show>
```

## 🌐 Server-Side Rendering (SSR)

HyperFX supports SSR with hydration, allowing for fast initial page loads and SEO optimization.

```tsx
import { renderToString, renderHydrationData } from "hyperfx/ssr";

const { html, hydrationData } = renderToString(<App />);
// ... send to client with hydration data
```

## 🏗️ Architecture

HyperFX uses a direct DOM approach:

- **No Virtual DOM**: JSX compiles to actual DOM element creation
- **Immediate Updates**: Signals notify subscribers synchronously
- **Fine-Grained**: Only affected DOM elements update
- **Hydration**: Re-attaches reactivity to server-rendered HTML

## 📚 API Reference

### Signals

- `const sig = createSignal<T>(val)` - Create a callable signal (`sig()` is get, `sig(val)` is set)
- `const comp = createComputed<T>(fn)` - Create a computed signal
- `createEffect(fn)` - Run an effect when dependencies change

### JSX

- Direct DOM element creation with reactive attributes
- Automatic signal subscription in JSX text nodes and attributes
- Fragment support with `<></>`

### Routing

- `<Router>` - Route container
- `<Route path="..." component={...} />` - Route definition
- `<Link to="...">` - Navigation links

### Control Flow

- `<For each={signal} />` - Reactive lists
- `<Show when={signal} />` - Conditional rendering
- `<Switch>`/`<Match>` - Pattern matching
