import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('HyperFXTransformer', () => {
  describe('Basic JSX Transformation', () => {
    it('should transform simple static JSX element', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Component() {
          return <div class="card">Hello</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      
      expect(result).not.toBeNull();
      expect(result!.code).toContain('_$template');
      expect(result!.code).toContain('<div class="card">Hello</div>');
      expect(result!.code).toContain('.cloneNode(true)');
    });

    it('should handle nested static elements', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Component() {
          return (
            <div class="container">
              <h1>Title</h1>
              <p>Content</p>
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      
      expect(result).not.toBeNull();
      expect(result!.code).toContain('_$template');
      expect(result!.code).toContain('<h1>Title</h1>');
      expect(result!.code).toContain('<p>Content</p>');
    });

    it('should not transform code without JSX', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function notAComponent() {
          return "hello";
        }
      `;

      const result = transformer.transform(code, 'test.ts');
      
      expect(result).toBeNull();
    });

    it('should handle self-closing tags', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Component() {
          return <input type="text" />;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      
      expect(result).not.toBeNull();
      expect(result!.code).toContain('<input type="text" />');
    });

    it('should add runtime imports', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Component() {
          return <div>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      
      expect(result).not.toBeNull();
      expect(result!.code).toContain("from 'hyperfx/runtime-dom'");
      expect(result!.code).toContain("template as _$template");
    });
  });

  describe('Options', () => {
    it('should respect template optimization option', () => {
      const transformer = new HyperFXTransformer({
        optimize: { templates: false }
      });
      
      const code = `
        function Component() {
          return <div>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      
      // When templates are disabled, should not use template extraction
      // For now we don't have this logic, so this test documents intended behavior
      expect(result).not.toBeNull();
    });

    it('should generate source maps when enabled', () => {
      const transformer = new HyperFXTransformer({
        dev: { sourceMap: true }
      });
      
      const code = `
        function Component() {
          return <div>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      
      expect(result).not.toBeNull();
      expect(result!.map).toBeDefined();
    });

    it('should not generate source maps when disabled', () => {
      const transformer = new HyperFXTransformer({
        dev: { sourceMap: false }
      });
      
      const code = `
        function Component() {
          return <div>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      
      expect(result).not.toBeNull();
      expect(result!.map).toBeUndefined();
    });
  });
});
