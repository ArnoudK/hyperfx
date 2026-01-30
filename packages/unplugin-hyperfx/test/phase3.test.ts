import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('Phase 3: Advanced Optimizations', () => {
  describe('Constant Expression Folding', () => {
    const transformer = new HyperFXTransformer({
      optimize: {
        constants: true,
      },
    });

    it('should fold numeric addition in attributes', () => {
      const code = `
        function Component() {
          return <div data-value={1 + 2}>Content</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      // Should be in template as static attribute
      expect(result!.code).toContain('data-value="3"');
      // Should NOT create an effect
      expect(result!.code).not.toContain('_$effect');
    });

    it('should fold string concatenation in attributes', () => {
      const code = `
        function Component() {
          return <div class={"hello" + " " + "world"}>Content</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      expect(result!.code).toContain('class="hello world"');
      expect(result!.code).not.toContain('_$effect');
    });

    it('should fold template literals without expressions', () => {
      const code = `
        function Component() {
          return <div title={\`Hello World\`}>Content</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      expect(result!.code).toContain('title="Hello World"');
      expect(result!.code).not.toContain('_$effect');
    });

    it('should fold numeric operations', () => {
      const code = `
        function Component() {
          return (
            <div 
              data-sum={5 + 3}
              data-diff={10 - 4}
              data-mult={2 * 3}
              data-div={8 / 2}
            >
              Content
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      expect(result!.code).toContain('data-sum="8"');
      expect(result!.code).toContain('data-diff="6"');
      expect(result!.code).toContain('data-mult="6"');
      expect(result!.code).toContain('data-div="4"');
    });

    it('should fold conditional with constant test', () => {
      const code = `
        function Component() {
          return <div class={true ? "active" : "inactive"}>Content</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      expect(result!.code).toContain('class="active"');
      expect(result!.code).not.toContain('inactive');
      expect(result!.code).not.toContain('_$effect');
    });

    it('should NOT fold expressions with function calls', () => {
      const code = `
        function Component() {
          return <div class={getValue() + 1}>Content</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      // Should remain dynamic
      expect(result!.code).toContain('_$effect');
      expect(result!.code).toContain('getValue()');
    });

    it('should NOT fold expressions with variables', () => {
      const code = `
        function Component() {
          const x = 5;
          return <div data-value={x + 1}>Content</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      // Should remain dynamic
      expect(result!.code).toContain('_$effect');
    });

    it('should fold template literals with constant expressions', () => {
      const code = `
        function Component() {
          return <div title={\`Count: \${5 + 3}\`}>Content</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      expect(result!.code).toContain('title="Count: 8"');
      expect(result!.code).not.toContain('_$effect');
    });

    it('should respect constants optimization flag', () => {
      const transformerNoConstants = new HyperFXTransformer({
        optimize: {
          constants: false,
        },
      });

      const code = `
        function Component() {
          return <div data-value={1 + 2}>Content</div>;
        }
      `;

      const result = transformerNoConstants.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      // Should NOT fold when optimization is disabled
      expect(result!.code).toContain('_$effect');
      expect(result!.code).not.toContain('data-value="3"');
    });
  });

  describe('Event Delegation', () => {
    const transformer = new HyperFXTransformer();

    it('should delegate click events', () => {
      const code = `
        function Component() {
          return <button onclick={handleClick}>Click</button>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      expect(result!.code).toContain('_$delegate');
      expect(result!.code).toContain('"click"');
      expect(result!.code).toContain('handleClick');
    });

    it('should handle multiple events on same element', () => {
      const code = `
        function Component() {
          return <button onclick={handleClick} onmouseenter={handleHover}>Hover</button>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      expect(result!.code).toContain('_$delegate');
      expect(result!.code).toContain('"click"');
      expect(result!.code).toContain('"mouseenter"');
    });
  });

  describe('Mixed Optimizations', () => {
    const transformer = new HyperFXTransformer();

    it('should apply multiple optimizations together', () => {
      const code = `
        function Component() {
          return (
            <div class={"container-" + "main"} data-count={1 + 1}>
              <p>{text()}</p>
              <button onclick={handleClick}>Click {5 * 2}</button>
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).toBeTruthy();
      
      // Constant folding
      expect(result!.code).toContain('class="container-main"');
      expect(result!.code).toContain('data-count="2"');
      
      // Dynamic content - signal parsing optimizes text() to text
      expect(result!.code).toContain('_$insert');
      expect(result!.code).toContain('text,');
      
      // Event delegation
      expect(result!.code).toContain('_$delegate');
      expect(result!.code).toContain('"click"');
    });
  });
});
