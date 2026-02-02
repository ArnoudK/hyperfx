# HyperFX

HyperFX is a JSX framework that compiles to highly optimized runtime code.
It uses signals and is heavily inspired by SolidJS.

Key differences from SolidJS:

- Compiler is enforced, so we can do more tricks to simplify code.
- We want async to be first class citizen, integrated with signals and EffectTS

## Instructions

### Docs

Never claim to be better or more efficient than other frameworks. Avoid marketing language.

### Implementation

Treat warnings as errors. Fix them before proceeding.

Make sure to write clean, well-documented code. Use comments to explain complex logic.

Files should be modular and be under 1000 lines. Split into multiple files if necessary.

Use ESM modules.

Use TypeScript with strict type checking enabled.

Avoid using `filter`, `map`, or `reduce`. Use simple loops instead.

Do not use `any` type. Always provide explicit types, or let TypeScript infer them.

### Getting inspired by SolidJS

Make sure to check the source code of SolidJS for inspiration. But do not copy the code directly (we work differently). We want to create our own implementation. Make sure to check the master branch that's for Solid-JS 2.0.
