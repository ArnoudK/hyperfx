import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('Real-world transformation examples', () => {
  it('should compile the Counter component from our example', () => {
    const transformer = new HyperFXTransformer();
    const code = `
import { createSignal } from 'hyperfx';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="card">
      <div class="counter">
        <h2>Counter Example</h2>
        <div class="count-display">{count()}</div>
        <div>
          <button onclick={() => setCount(c => c - 1)}>-</button>
          <button onclick={() => setCount(0)}>Reset</button>
          <button onclick={() => setCount(c => c + 1)}>+</button>
        </div>
      </div>
    </div>
  );
}
    `;

    const result = transformer.transform(code, 'Counter.tsx');
    
    expect(result).not.toBeNull();
    console.log('\n========== COMPILED OUTPUT ==========\n');
    console.log(result!.code);
    console.log('\n====================================\n');
    
    // Should have template import
    expect(result!.code).toContain("from 'hyperfx/runtime-dom'");
    expect(result!.code).toContain("template as _$template");
    
    // Should have template constant
    expect(result!.code).toContain('const _tmpl$');
    
    // Should contain the static HTML
    expect(result!.code).toContain('<div class="card">');
    expect(result!.code).toContain('<h2>Counter Example</h2>');
    
    // Should use cloneNode
    expect(result!.code).toContain('.cloneNode(true)');
  });

  it('should compile the App component from our example', () => {
    const transformer = new HyperFXTransformer();
    const code = `
function App() {
  return (
    <div>
      <h1>HyperFX Compiled Example</h1>
      <p class="subtitle">Using unplugin-hyperfx for optimized builds</p>
      
      <div class="info">
        <strong>This app is compiled!</strong>
        <br />
        Open DevTools and check the Network tab.
      </div>
    </div>
  );
}
    `;

    const result = transformer.transform(code, 'App.tsx');
    
    expect(result).not.toBeNull();
    console.log('\n========== APP COMPONENT COMPILED ==========\n');
    console.log(result!.code);
    console.log('\n===========================================\n');
    
    // Should compile the entire static tree
    expect(result!.code).toContain('<h1>HyperFX Compiled Example</h1>');
    expect(result!.code).toContain('<strong>This app is compiled!</strong>');
  });
});
