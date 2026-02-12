# The basics

## Creating HTML with JSX

HyperFX is built around JSX, providing a familiar and powerful way to create HTML elements directly in your code. Unlike other frameworks, HyperFX JSX returns **actual DOM elements**, not virtual nodes.

```tsx
function MyComponent() {
  return (
    <div>
      <span>Hello</span>
      <p>World!</p>
    </div>
  );
}
```

## Natural DOM Integration

Because HyperFX components return real DOM nodes, you can use them anywhere you'd use a standard element:

```tsx
import { mount } from "hyperfx";

const app = document.getElementById("app")!;
const myElement = <MyComponent />;

// It's just a div!
console.log(myElement instanceof HTMLDivElement); // true

mount(() => myElement, app, { mode: "append" });
```

## Reactive Text and Attributes

You can embed logic directly in your JSX. When you use a signal, HyperFX automatically tracks the dependency and updates only that specific part of the DOM.

```tsx
import { createSignal } from "hyperfx";

function Greeting() {
  const [name, setName] = createSignal("World");

  return (
    <div>
      <input 
        value={name()} 
        oninput={(e) => setName(e.target.value)} 
      />
      <h1>Hello, {name}!</h1>
    </div>
  );
}
```

## Styling

Styles can be strings or reactive values:

```tsx
const [color, setColor] = createSignal("red");

<div style={{ color: color(), fontWeight: "bold" }}>
  Reactive styles!
</div>
```
