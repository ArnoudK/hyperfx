import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('Phase 7: Signal Parsing Optimization', () => {
  describe('Simple Identifiers', () => {
    it('should optimize zero-arg calls to function references', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [count, setCount] = createSignal(0);
          return <div>{count()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should pass function reference, not call it
      expect(result!.code).toContain('_$insert(_el$, count,');
      expect(result!.code).not.toMatch(/_\$insert\(_el\$, count\(\)/);
    });

    it('should optimize multiple signal calls', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [first, setFirst] = createSignal('John');
          const [last, setLast] = createSignal('Doe');
          return <div>{first()} {last()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('first,');
      expect(result!.code).toContain('last,');
    });
  });

  describe('Member Expressions', () => {
    it('should optimize props.signal()', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test(props) {
          return <div>{props.count()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('_$insert(_el$, props.count,');
      expect(result!.code).not.toMatch(/props\.count\(\)/);
    });

    it('should optimize nested member expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test(props) {
          return <div>{props.user.name()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('_$insert(_el$, props.user.name,');
    });

    it('should optimize deeply nested paths', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          return <div>{store.data.user.profile.name()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('store.data.user.profile.name,');
      expect(result!.code).not.toMatch(/store\.data\.user\.profile\.name\(\)/);
    });
  });

  describe('Should NOT Optimize', () => {
    it('should keep calls with arguments', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          return <div>{getData(123)}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('getData(123)');
    });

    it('should keep member expression calls with arguments', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          return <div>{props.getData(123)}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('props.getData(123)');
    });

    it('should keep computed member expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const key = 'data';
          return <div>{obj[key]()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('obj[key]()');
    });

    it('should keep global constructors', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          return <div>{Date()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('Date()');
    });

    it('should keep Math.random()', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          return <div>{Math.random()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('Math.random()');
    });

    it('should keep console.log()', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          return <div>{console.log()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('console.log()');
    });
  });

  describe('Complex Expressions', () => {
    it('should optimize in ternary expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [show, setShow] = createSignal(true);
          const [count, setCount] = createSignal(5);
          return <div>{show() ? count() : 0}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Both show() and count() should be optimized
      expect(result!.code).toMatch(/show \? count : 0/);
    });

    it('should optimize in logical AND expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [show, setShow] = createSignal(true);
          const [count, setCount] = createSignal(5);
          return <div>{show() && count()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toMatch(/show && count/);
    });

    it('should optimize in logical OR expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [value, setValue] = createSignal(null);
          const [fallback, setFallback] = createSignal('default');
          return <div>{value() || fallback()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toMatch(/value \|\| fallback/);
    });

    it('should optimize in binary expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [a, setA] = createSignal(5);
          const [b, setB] = createSignal(3);
          return <div>{a() + b()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toMatch(/a \+ b/);
    });
  });

  describe('Event Handlers', () => {
    it('should NOT optimize calls in event handlers', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [count, setCount] = createSignal(0);
          return <button onclick={() => setCount(count() + 1)}>Click</button>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // count() should remain a call inside the handler
      expect(result!.code).toContain('count() + 1');
    });

    it('should NOT optimize direct event handler calls', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const handleClick = () => console.log('clicked');
          return <button onclick={handleClick()}>Click</button>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('handleClick()');
    });
  });

  describe('Attributes', () => {
    it('should handle signal calls in class attributes (inside effect)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [active, setActive] = createSignal(false);
          return <div class={active() ? 'active' : 'inactive'}></div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Inside effect, should keep the call (effect context)
      expect(result!.code).toContain('_$effect');
      expect(result!.code).toContain('active()');
    });

    it('should handle signal calls in other attributes', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [title, setTitle] = createSignal('Hello');
          return <div title={title()}></div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Attributes are inside effects, keep calls
      expect(result!.code).toContain('title()');
    });
  });

  describe('List Rendering', () => {
    it('should optimize signals in map function bodies', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [items, setItems] = createSignal([1, 2, 3]);
          return (
            <ul>
              {items().map(item => <li>{item.name()}</li>)}
            </ul>
          );
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // item.name() should be optimized inside map
      expect(result!.code).toContain('item.name,');
    });

    it('should NOT optimize the items() call itself', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [items, setItems] = createSignal([1, 2, 3]);
          return (
            <ul>
              {items().map(item => <li>{item}</li>)}
            </ul>
          );
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // items() is part of array accessor, should be kept as call
      expect(result!.code).toContain('items()');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should optimize counter component', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Counter() {
          const [count, setCount] = createSignal(0);
          return (
            <div>
              <div class="count">{count()}</div>
              <button onclick={() => setCount(count() + 1)}>+</button>
            </div>
          );
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // count() in children should be optimized
      expect(result!.code).toMatch(/_\$insert\(_el\$, count,/);
      
      // count() in event handler should NOT be optimized
      expect(result!.code).toContain('count() + 1');
    });

    it('should optimize todo list with props', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function TodoItem(props) {
          return (
            <li>
              <span>{props.text()}</span>
              <button onclick={() => props.onDelete(props.id())}>Delete</button>
            </li>
          );
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // props.text() in children should be optimized
      expect(result!.code).toContain('props.text,');
      
      // props.id() in event handler should NOT be optimized
      expect(result!.code).toContain('props.id()');
      
      // props.onDelete() should NOT be optimized (has arguments in actual call)
      expect(result!.code).toContain('props.onDelete(');
    });

    it('should optimize complex data access patterns', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function UserCard(props) {
          return (
            <div class="card">
              <h2>{props.user.name()}</h2>
              <p>{props.user.email()}</p>
              <span>{props.user.profile.bio()}</span>
            </div>
          );
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // All deeply nested signals should be optimized
      expect(result!.code).toContain('props.user.name,');
      expect(result!.code).toContain('props.user.email,');
      expect(result!.code).toContain('props.user.profile.bio,');
    });
  });

  describe('Edge Cases', () => {
    it('should handle mixed optimizable and non-optimizable calls', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [data, setData] = createSignal(null);
          return <div>{data() || getData(123)}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // data() should be optimized
      expect(result!.code).toMatch(/data \|\|/);
      
      // getData(123) should NOT be optimized (has arguments)
      expect(result!.code).toContain('getData(123)');
    });

    it('should handle nullish coalescing', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [value, setValue] = createSignal(null);
          const [fallback, setFallback] = createSignal('default');
          return <div>{value() ?? fallback()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toMatch(/value \?\? fallback/);
    });

    it('should handle optional chaining', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test(props) {
          return <div>{props.user?.name()}</div>;
        }
      `;
      
      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Optional chaining with call should still optimize the call
      expect(result!.code).toMatch(/props\.user\?\.name[,\s]/);
    });
  });
});
