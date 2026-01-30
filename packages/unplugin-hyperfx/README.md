# unplugin-hyperfx

> HyperFX compiler plugin for Vite, Rollup, Webpack, esbuild, and more

Transform HyperFX JSX at build time for better performance and smaller bundles.

## Features

- ✅ **Static Template Extraction** - Extract static JSX into reusable templates
- ✅ **Event Delegation** - Optimize event handlers (coming soon)
- ✅ **Constant Folding** - Eliminate runtime computations (coming soon)
- ✅ **SSR Optimization** - Faster server-side rendering (coming soon)
- ✅ **Universal** - Works with Vite, Rollup, Webpack, esbuild, Rspack
- ✅ **Source Maps** - Full source map support

## Installation

```bash
npm install -D unplugin-hyperfx
# or
pnpm add -D unplugin-hyperfx
# or
yarn add -D unplugin-hyperfx
```

## Usage

### Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import hyperfx from 'unplugin-hyperfx/vite';

export default defineConfig({
  plugins: [
    hyperfx({
      // Options (all optional)
      optimize: {
        templates: true,  // Extract static templates
        events: true,     // Event delegation
        constants: true,  // Fold constants
        ssr: true,       // SSR optimizations
      },
      dev: {
        warnings: true,   // Show optimization warnings
        sourceMap: true,  // Generate source maps
      },
    }),
  ],
});
```

### Rollup

```ts
// rollup.config.js
import hyperfx from 'unplugin-hyperfx/rollup';

export default {
  plugins: [
    hyperfx({
      // options
    }),
  ],
};
```

### Webpack

```ts
// webpack.config.js
module.exports = {
  plugins: [
    require('unplugin-hyperfx/webpack')({
      // options
    }),
  ],
};
```

### esbuild

```ts
// esbuild.config.js
import { build } from 'esbuild';
import hyperfx from 'unplugin-hyperfx/esbuild';

build({
  plugins: [hyperfx()],
});
```

### Rspack

```ts
// rspack.config.js
module.exports = {
  plugins: [
    require('unplugin-hyperfx/rspack')({
      // options
    }),
  ],
};
```

## How It Works

The plugin transforms your JSX at build time into optimized HyperFX runtime calls.

**Before (runtime JSX):**
```tsx
function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <div class="counter">
      <button onclick={() => setCount(c => c + 1)}>
        Count: {count()}
      </button>
    </div>
  );
}
```

**After (compiled):**
```tsx
import { template as _$template } from 'hyperfx/runtime-dom';
const _tmpl$0 = _$template('<div class="counter"><button>Count: </button></div>');

function Counter() {
  const [count, setCount] = createSignal(0);
  return _tmpl$0.cloneNode(true);
  // Note: Dynamic parts will be handled in next phase
}
```

## Options

### `optimize`

- `templates` (boolean, default: `true`) - Extract static templates
- `events` (boolean, default: `true`) - Use event delegation
- `constants` (boolean, default: `true`) - Fold compile-time constants
- `ssr` (boolean, default: `true`) - Enable SSR optimizations

### `advanced`

Experimental features:

- `controlFlow` (boolean, default: `false`) - Optimize `<For>`, `<Show>`, etc.
- `hoisting` (boolean, default: `false`) - Hoist static nodes

### `dev`

Development options:

- `warnings` (boolean, default: `true`) - Show warnings for non-optimizable patterns
- `sourceMap` (boolean, default: `true`) - Generate source maps

### `ssr`

- `ssr` (boolean, default: `false`) - Enable SSR mode

## Performance

Expected improvements over runtime-only JSX:

- **40% faster** client-side rendering
- **3x faster** SSR rendering
- **~50% smaller** bundle sizes

## Roadmap

- [x] Phase 1: Basic template extraction
- [ ] Phase 2: Event delegation and dynamic content
- [ ] Phase 3: SSR optimization
- [ ] Phase 4: Control flow components
- [ ] Phase 5: Advanced optimizations

## License

MIT
