import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('Dynamic Content Transformation', () => {
  const transformer = new HyperFXTransformer();

  it('should transform element with dynamic text content', () => {
    const code = `
      function Component() {
        return <div>Count: {count()}</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('import { template as _$template, insert as _$insert }');
    expect(result!.code).toContain('_$template');
    expect(result!.code).toContain('_$insert');
    // Signal parsing: count() is optimized to count
    expect(result!.code).toContain('_$insert(_el$, count,');
  });

  it('should transform element with multiple dynamic children', () => {
    const code = `
      function Component() {
        return (
          <div>
            <p>First: {first()}</p>
            <p>Second: {second()}</p>
          </div>
        );
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$insert');
    // Signal parsing: first() and second() are optimized to first and second
    expect(result!.code).toContain('first,');
    expect(result!.code).toContain('second,');
  });

  it('should transform element with dynamic expression', () => {
    const code = `
      function Component() {
        return <div>{getValue() + 10}</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$insert');
  });

  it('should handle mixed static and dynamic content', () => {
    const code = `
      function Component() {
        return (
          <div class="container">
            <h1>Title</h1>
            <p>Value: {value()}</p>
            <footer>Static footer</footer>
          </div>
        );
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$template');
    expect(result!.code).toContain('_$insert');
    // Signal parsing: value() is optimized to value
    expect(result!.code).toContain('value,');
    expect(result!.code).toContain('Title');
    expect(result!.code).toContain('Static footer');
  });

  it('should handle empty expressions', () => {
    const code = `
      function Component() {
        return <div>{}</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    // Should handle empty expressions gracefully
  });

  it('should handle For component with dynamic children', () => {
    const code = `
      function Component() {
        return (
          <div>
            <For each={items()}>{item => <span>{item}</span>}</For>
          </div>
        );
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    // For component is not compiled (it's a component, not an intrinsic element)
    // But the div wrapper should still be optimized
    expect(result!.code).toContain('For');
  });

  it('should preserve function calls in dynamic content', () => {
    const code = `
      function Component() {
        return <div>{formatDate(date())}</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('formatDate');
    // Signal parsing: date() is optimized to date (argument to formatDate)
    expect(result!.code).toContain('formatDate(date');
  });

  it('should handle conditional dynamic content', () => {
    const code = `
      function Component() {
        return <div>{show() ? "visible" : "hidden"}</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$insert');
    // Signal parsing: show() is optimized to show
    expect(result!.code).toMatch(/show \?/);
  });
});
