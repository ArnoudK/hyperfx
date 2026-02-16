# HyperFX

HyperFX is a JSX framework that compiles to highly optimized runtime code.
It uses signals and is heavily inspired by SolidJS.

**Key Principle:** The compiler is **required**. HyperFX cannot work without compilation.

## Project Structure

- **packages/hyperfx/** - Core framework with compiler, runtime, and JSX runtime
- **packages/hyperfx-test/** - Test suite using vitest
- **packages/hyperfx-extra/** - Additional utilities  
- **example_project/** - Example application

## Architecture

HyperFX uses a **compiler + runtime** architecture:

1. **Compiler** (`packages/hyperfx/src/compiler/`) - Transform JSX at build time
   - Parses JSX and generates optimized JavaScript
   - Creates static templates with dynamic markers
   - Optimizes signal access patterns
   
2. **Runtime** (`packages/hyperfx/src/runtime-dom/`, `packages/hyperfx/src/jsx/runtime/`) - Executes compiled code
   - Handles DOM insertion and updates
   - Manages reactive subscriptions
   - Processes signals and effects

The compiler transforms:
```jsx
<div>{signal}</div>
```
Into efficient runtime calls that create static templates with reactive markers.

## Development Workflow

### Building
After making changes to the hyperfx package source:
```bash
pnpm --filter hyperfx run build
```

### Testing
**Important:** Tests are in the `hyperfx-test` package, NOT in the hyperfx package itself.

hyperfx-extra has its own tests, but they are separate from the core hyperfx tests.

We use **vitest** for testing. Run tests with:
```bash
pnpm pkg:test
```

Most usage should be done like this:
```bash
pnpm pkg:build && pnpm pkg:test

```


#### Test Conventions
- Use `.tsx` extension for tests with JSX
- Use JSX syntax, not `document.createElement`
- Tests go in `packages/hyperfx-test/test/`
- If you have an issue, do not write a one-off script. Instead, write a test that reproduces the issue and then fix it in the hyperfx package.

## Implementation Guidelines

NEVER leave bloat, backwards compatibility code, or dead code in the codebase. If it's not needed, remove it.

Treat warnings as errors. Fix them before proceeding.

Correctness is more important than performance. Write code that is correct and easy to understand first, then optimize if necessary.

Falsehoods are not allowed. it's better to throw an error than to silently fail or produce incorrect results.

Make sure to write clean, well-documented code. Use comments to explain complex logic.

Files should be modular and be under 1000 lines. Split into multiple files if necessary.

Use ESM modules.

Use TypeScript with strict type checking enabled.

Avoid using `filter`, `map`, or `reduce`. Use simple loops instead.

Do not use `any` type. Always provide explicit types, or let TypeScript infer them. The only exception is when using generic types that require `any` for flexibility, but this should be rare.

## Signals


Signals are callable functions that manage reactive state:

`const [accessor, setter] = createSignal(1)`



The compiler optimizes signal calls in reactive contexts.

## Getting Inspired by SolidJS

Make sure to check the source code of SolidJS for inspiration. But do not copy the code directly (we work differently). We want to create our own implementation. Make sure to check the master branch that's for Solid-JS 2.0.

## Documentation

Never claim to be better or more efficient than other frameworks. Avoid marketing language.
