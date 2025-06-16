# Get started with HyperFX

Add HyperFX to your project.

```bash
pnpm add hyperfx
```

## Live development with vite

Use HyperFX with vite to develop with live updating.
Use the following command to create a folder with a new vite project with HyperFX.

```bash
pnpm create vite my-hyperfx-app --template vanilla-ts
pnpm add hyperfx
```

After removing the vite base content inside the files you can write your HyperFX code in the src/main.ts file.

## JSX Setup

HyperFX now supports JSX! Update your `tsconfig.json` to enable JSX:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hyperfx"
  }
}
```

Rename your `main.ts` to `main.tsx` and update your HTML:

Example `./index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <script type="module" src="./src/main.tsx" defer></script>
  </head>
  <body style="background-color: black; color: white">
    <div id="app">
      <p>Loading...</p>
    </div>
  </body>
</html>
```

Example `./src/main.tsx`

```tsx
import { RenderToBody } from 'hyperfx'

function App() {
  return (
    <div>
      <p style="font-size: 120%;">This is rendered from HyperFX with JSX!</p>
    </div>
  );
}

const appRoot = document.getElementById("app")!;
appRoot.replaceChildren(App());
```

Run it with realtime updates with:

```bash
  pnpm dev
```
