# Rendering

Learn how to render HyperFX components and elements to the DOM.

## Basic Rendering

With JSX, rendering is straightforward. Create your component and append it to the DOM:

```tsx
import { createSignal, mount } from "hyperfx";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <h1>My App</h1>
      <p>Count: {count}</p>
      <button onclick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}

// Render to DOM (returns an unmount function)
const appRoot = document.getElementById('app')!;
mount(App, undefined, appRoot, { mode: 'replace' });
```

## Replacing Content

Use `mount()` with `mode: "replace"` to replace all content in a container:

```tsx
function updatePage() {
  const container = document.getElementById('page-content')!;

  mount(() => (
    <div>
      <h2>Updated Content</h2>
      <p>This content replaced everything in the container.</p>
    </div>
  ), container, { mode: 'replace' });
}

## Appending Content

Use `mode: "append"` to add content without clearing the container:

```tsx
import { mount } from "hyperfx";

const container = document.getElementById("list")!;
mount(() => <li>New item</li>, container, { mode: "append" });
```
```

---

## Control Flow Components

HyperFX provides specialized components for common rendering patterns. These are more efficient than standard JavaScript expressions because they can optimize DOM updates.

### `<Show>`

Use `<Show>` for conditional rendering.

```tsx
import { Show, createSignal } from "hyperfx";

function Profile() {
  const [loggedIn, setLoggedIn] = createSignal(false);

  return (
    <div>
      <Show when={loggedIn}>
        <button onclick={() => setLoggedIn(false)}>Logout</button>
      </Show>
      
      <Show when={() => !loggedIn()}>
        <button onclick={() => setLoggedIn(true)}>Login</button>
      </Show>
    </div>
  );
}
```

### `<For>`

Use `<For>` for rendering lists of data.

```tsx
import { For, createSignal } from "hyperfx";

function TodoList() {
  const [todos, setTodos] = createSignal([
    { id: 1, text: 'Learn HyperFX' },
    { id: 2, text: 'Build an app' }
  ]);

  return (
    <ul>
      <For each={todos}>
        {(todo) => (
          <li>{todo.text}</li>
        )}
      </For>
    </ul>
  );
}
```

### `<Switch>` and `<Match>`

Use `<Switch>` for multiple conditional branches.

```tsx
import { Switch, Match, createSignal } from "hyperfx";

const [status, setStatus] = createSignal("loading");

<Switch>
  <Match when={() => status() === "loading"}>
    <p>Loading...</p>
  </Match>
  <Match when={() => status() === "error"}>
    <p>Error occurred!</p>
  </Match>
  <Match when={() => status() === "success"}>
    <p>Data loaded successfully!</p>
  </Match>
</Switch>
```

---

## innerHTML

For complex HTML content (like markdown), use the `innerHTML` attribute with signals:

```tsx
import { createSignal, createComputed } from "hyperfx";

function MarkdownViewer({ markdownText }: { markdownText: string }) {
  const renderedHTML = createComputed(() => parseMarkdown(markdownText));

  return (
    <article 
      class="markdown-content"
      innerHTML={renderedHTML}
    />
  );
}
```
