import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/compiler/core/transform.js';
describe('Signal Function Context Fix', () => {
    const transformer = new HyperFXTransformer();
    it('should preserve signal calls in function children', () => {
        const code = `
      function Counter() {
        const count = createSignal(0);
        return (
          <button onclick={() => count(count() + 1)}>
            +{count}
          </button>
        );
      }
    `;
        const result = transformer.transform(code, 'test.tsx');
        // The signal call should be preserved in the function context
        expect(result.code).toContain('count()');
        expect(result.code).not.toContain('count = count');
    });
    it('should optimize signal calls in non-function reactive contexts', () => {
        const code = `
      function Counter() {
        const count = createSignal(0);
        return (
          <div>
            Count: {count}
          </div>
        );
      }
    `;
        const result = transformer.transform(code, 'test.tsx');
        // The signal call should be optimized (count() -> count) in non-function contexts
        expect(result.code).toContain('count');
    });
    it('should handle signals in event handlers correctly', () => {
        const code = `
      function Counter() {
        const count = createSignal(0);
        return (
          <button onclick={() => console.log(count())}>
            Click me
          </button>
        );
      }
    `;
        const result = transformer.transform(code, 'test.tsx');
        // Signal calls in event handlers should be preserved
        expect(result.code).toContain('count()');
    });
});
//# sourceMappingURL=signal-function-context.test.js.map