# The basics

## Creating HTML with JSX

HyperFX now supports JSX for creating HTML elements with a familiar syntax:

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

## Traditional Function API

You can still use the traditional function API if preferred:

```typescript
import { Span, Div, Main, Footer, P, t } from "hyperfx";
```

These functions accept attributes and children if applicable.
Text can be added directly as strings or JSX text nodes.

```tsx
// Old imperative style (deprecated)
// P({}, [
//   t("This is basic text with a "),
//   Span({ style: "font-weight: bold;" }, [t("bold")]),
//   t(" text in the middle."),
// ]);

// Modern JSX style (recommended)
<p>
  This is basic text with a{" "}
  <span style="font-weight: bold;">bold</span>{" "}
  text in the middle.
</p>
```

## JSX Syntax (Recommended)

The same result using JSX syntax:

```tsx
function TextExample() {
  return (
    <p>
      This is basic text with a{" "}
      <span style="font-weight: bold;">bold</span>
      {" "}text in the middle.
    </p>
  );
}
```

Results in

```html
<p>
  This is basic text with a
  <span style="font-weight: bold;">bold</span>
  text in the middle.
</p>
```
