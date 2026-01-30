import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('Reactive Attributes Transformation', () => {
  const transformer = new HyperFXTransformer();

  it('should transform element with reactive class attribute', () => {
    const code = `
      function Component() {
        return <div class={className()}>Content</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$effect');
    expect(result!.code).toContain('_$setProp');
    expect(result!.code).toContain('className()');
  });

  it('should handle mixed static and dynamic attributes', () => {
    const code = `
      function Component() {
        return <div id="static" class={dynamicClass()}>Content</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('id="static"');
    expect(result!.code).toContain('_$effect');
    expect(result!.code).toContain('dynamicClass()');
  });

  it('should transform event handlers', () => {
    const code = `
      function Component() {
        return <button onclick={handleClick}>Click me</button>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$delegate');
    expect(result!.code).toContain('click');
    expect(result!.code).toContain('handleClick');
  });

  it('should handle multiple dynamic attributes', () => {
    const code = `
      function Component() {
        return <div class={className()} style={styleObj()} title={title()}>Content</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('className()');
    expect(result!.code).toContain('styleObj()');
    expect(result!.code).toContain('title()');
    // Should have multiple _$effect calls
    const effectCount = (result!.code.match(/_\$effect/g) || []).length;
    expect(effectCount).toBeGreaterThanOrEqual(3);
  });

  it('should handle reactive attributes with dynamic children', () => {
    const code = `
      function Component() {
        return <div class={className()}>{count()}</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$effect');
    expect(result!.code).toContain('_$insert');
    // Attributes are in effect context, keep calls
    expect(result!.code).toContain('className()');
    // Children are in reactive context, optimize
    expect(result!.code).toContain('count,');
  });

  it('should handle spread attributes', () => {
    const code = `
      function Component() {
        return <div {...props}>Content</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$spread');
    expect(result!.code).toContain('props');
  });

  it('should preserve static attributes in template', () => {
    const code = `
      function Component() {
        return <div id="test" data-value="123" class={dynamicClass()}>Content</div>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    // Static attributes should be in template
    expect(result!.code).toContain('id="test"');
    expect(result!.code).toContain('data-value="123"');
    // Dynamic class should use effect
    expect(result!.code).toContain('_$effect');
    expect(result!.code).toContain('dynamicClass()');
  });

  it('should handle boolean attributes', () => {
    const code = `
      function Component() {
        return <input type="text" disabled={isDisabled()} />;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('type="text"');
    expect(result!.code).toContain('_$effect');
    expect(result!.code).toContain('isDisabled()');
  });

  it('should handle multiple event handlers', () => {
    const code = `
      function Component() {
        return <button onclick={handleClick} onmouseenter={handleEnter}>Hover me</button>;
      }
    `;

    const result = transformer.transform(code, 'test.tsx');
    expect(result).toBeTruthy();
    expect(result!.code).toContain('_$delegate');
    expect(result!.code).toContain('click');
    expect(result!.code).toContain('mouseenter');
    expect(result!.code).toContain('handleClick');
    expect(result!.code).toContain('handleEnter');
  });
});
