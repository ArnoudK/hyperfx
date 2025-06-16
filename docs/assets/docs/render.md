# Rendering

Learn how to render HyperFX components and elements to the DOM.

## Basic Rendering

With JSX, rendering is straightforward. Create your component and append it to the DOM:

```tsx
import { createSignal } from "hyperfx";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <h1>My App</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}

// Render to DOM
const appRoot = document.getElementById('app')!;
appRoot.appendChild(<App />);
```

## Replacing Content

Use `replaceChildren()` to replace all content in a container:

```tsx
function updatePage() {
  const container = document.getElementById('page-content')!;
  
  container.replaceChildren(
    <div>
      <h2>Updated Content</h2>
      <p>This content replaced everything in the container.</p>
    </div>
  );
}
```

## Dynamic Rendering with Signals

Signals make content reactive without manual DOM manipulation:

```tsx
import { createSignal, createComputed } from "hyperfx";

function UserProfile() {
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(true);

  // Fetch user data
  fetch('/api/user')
    .then(response => response.json())
    .then(userData => {
      setUser(userData);
      setLoading(false);
    });

  // Computed content based on loading state
  const content = createComputed(() => {
    if (loading()) {
      return <div>Loading...</div>;
    }
    
    const userData = user();
    if (!userData) {
      return <div>User not found</div>;
    }

    return (
      <div>
        <h2>Welcome, {userData.name}!</h2>
        <p>Email: {userData.email}</p>
      </div>
    );
  });

  return (
    <div class="user-profile">
      {content}
    </div>
  );
}
```

## innerHTML for Complex Content

For complex HTML content (like markdown), use the `innerHTML` attribute with signals:

```tsx
import { createSignal, createComputed } from "hyperfx";

function MarkdownViewer({ markdownText }: { markdownText: string }) {
  const renderedHTML = createComputed(() => {
    // Assuming you have a markdown parser
    return parseMarkdown(markdownText);
  });

  return (
    <article 
      class="markdown-content"
      innerHTML={renderedHTML}
    />
  );
}
```

## Conditional Rendering

Use JavaScript conditionals and signals for dynamic content:

```tsx
function ConditionalExample() {
  const [showDetails, setShowDetails] = createSignal(false);
  const [userRole, setUserRole] = createSignal('guest');

  return (
    <div>
      <button onClick={() => setShowDetails(!showDetails())}>
        {showDetails() ? 'Hide' : 'Show'} Details
      </button>
      
      {showDetails() && (
        <div class="details">
          <p>Here are the details!</p>
          {userRole() === 'admin' && (
            <button>Admin Controls</button>
          )}
        </div>
      )}
    </div>
  );
}
```

## Lists and Iteration

Render dynamic lists using JavaScript array methods:

```tsx
import { createSignal } from "hyperfx";

function TodoList() {
  const [todos, setTodos] = createSignal([
    { id: 1, text: 'Learn HyperFX', completed: false },
    { id: 2, text: 'Build an app', completed: false }
  ]);

  const addTodo = (text: string) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos([...todos(), newTodo]);
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos().map(todo => (
          <li key={todo.id} class={todo.completed ? 'completed' : ''}>
            {todo.text}
          </li>
        ))}
      </ul>
      <button onClick={() => addTodo('New task')}>
        Add Todo
      </button>
    </div>
  );
}
```

## Performance Tips

1. **Use signals for reactive data** - Avoid manual DOM updates
2. **Key props for lists** - Use `key` attributes for efficient list updates
3. **Computed values** - Use `createComputed` for derived state
4. **Minimal re-renders** - Signals only update what actually changed

```tsx
// Good: Reactive and efficient
function OptimizedComponent() {
  const [data, setData] = createSignal([]);
  
  const filteredData = createComputed(() => 
    data().filter(item => item.active)
  );

  return (
    <div>
      {filteredData().map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```
