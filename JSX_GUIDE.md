# JSX/TSX Support in HyperFX

HyperFX now supports JSX/TSX syntax for a more familiar React-like development experience while maintaining its fine-grained reactivity.

## Setup

### 1. TypeScript Configuration

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hyperfx/jsx",
    // ... other options
  }
}
```

### 2. Vite Configuration

Update your `vite.config.ts`:

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "hyperfx/jsx",
  },
  // ... other config
});
```

### 3. JSX Types

Create a `jsx.d.ts` file in your src folder:

```typescript
/// <reference types="hyperfx/jsx" />
import "hyperfx/jsx";
```

## Basic Usage

### Creating Components

```tsx
import { createSignal } from "hyperfx";

function Counter() {
  const count = createSignal(0);

  return (
    <div className="counter">
      <h1>Count: {count}</h1>
      <button onClick={() => count(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Reactive Properties

JSX expressions that contain signals are automatically reactive:

```tsx
function App() {
  const name = createSignal("World");
  
  return (
    <div>
      <input 
        value={name()} 
        onInput={(e) => name(e.target.value)}
      />
      <p>Hello, {name}!</p>  {/* Automatically updates */}
    </div>
  );
}
```

### Conditional Rendering

```tsx
function ConditionalExample() {
  const showMessage = createSignal(false);
  
  return (
    <div>
      <button onClick={() => showMessage(!showMessage())}>
        Toggle Message
      </button>
      {showMessage() ? (
        <p>Message is visible!</p>
      ) : (
        <p>Message is hidden</p>
      )}
    </div>
  );
}
```

### List Rendering

```tsx
function TodoList() {
  const items = createSignal(['Buy milk', 'Walk dog', 'Write code']);
  
  return (
    <ul>
      {items().map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

## Key Differences from React

1. **Signals instead of useState**: Use `createSignal(value)` which returns a signal function
2. **Signal getters/setters**: Call `signal()` to get value, `signal(newValue)` to set
3. **Automatic reactivity**: JSX expressions with signals update automatically
4. **className vs class**: Both work, `className` gets converted to `class`
5. **htmlFor vs for**: Both work, `htmlFor` gets converted to `for`

## Component Integration

You can integrate JSX components with HyperFX's mount system:

```tsx
import { mount } from "hyperfx";

function MyApp() {
  return <div>Hello JSX!</div>;
}

// Mount to DOM
const container = document.getElementById("app");
const vnode = <MyApp />;
mount(vnode, container);
```

## Performance Benefits

- **Fine-grained reactivity**: Only the specific DOM nodes that depend on changed signals update
- **No virtual DOM diffing**: Direct updates to DOM elements
- **Minimal bundle size**: Lightweight JSX runtime
- **No unnecessary re-renders**: Components don't re-run, only reactive expressions update

## Example: Complete App

```tsx
import { createSignal, mount } from "hyperfx";

function TodoApp() {
  const todos = createSignal([
    { id: 1, text: "Learn HyperFX", done: false },
    { id: 2, text: "Build an app", done: false }
  ]);
  const newTodo = createSignal("");

  const addTodo = () => {
    if (newTodo().trim()) {
      todos([
        ...todos(),
        { id: Date.now(), text: newTodo(), done: false }
      ]);
      newTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    todos(todos().map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  return (
    <div className="todo-app">
      <h1>HyperFX Todos</h1>
      
      <div className="add-todo">
        <input
          type="text"
          value={newTodo()}
          onInput={(e) => newTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos().map(todo => (
          <li 
            key={todo.id}
            className={todo.done ? "done" : ""}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
      
      <p>
        Total: {todos().length}, 
        Done: {todos().filter(t => t.done).length}
      </p>
    </div>
  );
}

// Mount the app
mount(<TodoApp />, document.getElementById("app")!);
```

This example shows how HyperFX's JSX support provides a familiar React-like syntax while delivering superior performance through fine-grained reactivity.
