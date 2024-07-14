# The basics

## Creating HTML

HyperFX export function to create HTML elements.

```typescript
import { Span, Div, Main, Footer, P } from "hyperfx";
```

These functions accept atributes and children if applicable.
Text can be added by import the `t` function which creates a TextNode.

```typescript
P(
  {},
  t("This is basic text with a "),
  Span({ style: "font-weight: bold;" }, "bold"),
  t(" text in the middle."),
);
```

Results in

```html
<p>
  This is basic text with a
  <span style="font-weight: bold;">bold</span>
  text the middle.
</p>
```
