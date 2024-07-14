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

Example `./index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <script type="module" src="./src/main.ts" defer></script>
  </head>
  <body style="background-color: black; color: white">
    <div id="app">
      <p>Loading...</p>
    </div>
  </body>
</html>
```

Example `./src/main.ts`

```typescript
import { P } from 'hyperfx'
const appRoot = document.getElementById("app")!;
const myRender = P({style: 'font-size: 120%;'}, t('This is rendered from HyperFX');
appRoot.replaceChildren(myRender);
```

Run it with realtime updates with:

```bash
  pnpm dev
```
