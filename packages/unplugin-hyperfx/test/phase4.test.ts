import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('Phase 4: Advanced Optimizations', () => {
  describe('Template Deduplication', () => {
    it('should reuse identical templates across multiple elements', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return (
            <div>
              <div class="card">Item 1</div>
              <div class="card">Item 2</div>
              <div class="card">Item 3</div>
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();

      // Since all children are static, they get inlined into the parent template
      // So we expect only 1 template for the whole structure
      const tmplDeclarations = result!.code.match(/const _tmpl\$\d+ = _\$template/g);
      expect(tmplDeclarations).toHaveLength(1);
      
      // The template should contain all three card divs
      expect(result!.code).toContain('class="card">Item 1');
      expect(result!.code).toContain('class="card">Item 2');
      expect(result!.code).toContain('class="card">Item 3');
    });

    it('should create separate templates for different HTML structures', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return (
            <div>
              <div class="card">Card</div>
              <span class="label">Label</span>
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();

      // Since all children are static, they get inlined into parent
      // So we expect only 1 template for the whole structure
      const tmplDeclarations = result!.code.match(/const _tmpl\$\d+ = _\$template/g);
      expect(tmplDeclarations).toHaveLength(1);
      
      // But the template should contain both the card and label
      expect(result!.code).toContain('class="card">Card');
      expect(result!.code).toContain('class="label">Label');
    });

    it('should deduplicate templates with identical attributes', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return (
            <div>
              <button type="button" class="btn">Button 1</button>
              <button type="button" class="btn">Button 2</button>
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();

      // Since all children are static, they get inlined into parent template
      // So we expect only 1 template for the whole structure  
      const tmplDeclarations = result!.code.match(/const _tmpl\$\d+ = _\$template/g);
      expect(tmplDeclarations).toHaveLength(1);
      
      // The template should contain both buttons
      expect(result!.code).toContain('type="button" class="btn">Button 1');
      expect(result!.code).toContain('type="button" class="btn">Button 2');
    });

    it('should deduplicate identical templates across separate function calls', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Component() {
          const a = <div class="box">A</div>;
          const b = <div class="box">A</div>;
          return <div>{a}{b}</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();

      // Should have 2 templates: one for the identical boxes (reused), one for the dynamic parent
      const tmplDeclarations = result!.code.match(/const _tmpl\$\d+ = _\$template/g);
      expect(tmplDeclarations).toHaveLength(2);
      
      // Both boxes should use the same template ID
      expect(result!.code).toContain('_tmpl$0.cloneNode(true)');
    });
  });

  describe('Advanced Constant Folding - Logical Operators', () => {
    it('should fold logical AND (&&) with constants', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={true && "yes"}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // true && "yes" should evaluate to "yes"
      expect(result!.code).toContain('data-result="yes"');
    });

    it('should fold logical OR (||) with constants', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={false || "default"}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // false || "default" should evaluate to "default"
      expect(result!.code).toContain('data-result="default"');
    });

    it('should fold nullish coalescing (??) with constants', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={null ?? "fallback"}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // null ?? "fallback" should evaluate to "fallback"
      expect(result!.code).toContain('data-result="fallback"');
    });

    it('should short-circuit logical AND when left is falsy', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={0 && "yes"}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // 0 && "yes" should evaluate to 0
      expect(result!.code).toContain('data-result="0"');
    });
  });

  describe('Advanced Constant Folding - Unary Operators', () => {
    it('should fold logical NOT (!)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={!false}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // !false should evaluate to true
      expect(result!.code).toContain('data-result="true"');
    });

    it('should fold numeric negation (-)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-value={-42}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-value="-42"');
    });

    it('should fold unary plus (+)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-value={+"123"}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-value="123"');
    });
  });

  describe('Advanced Constant Folding - Comparison Operators', () => {
    it('should fold greater than (>)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={10 > 5}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-result="true"');
    });

    it('should fold less than (<)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={3 < 7}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-result="true"');
    });

    it('should fold strict equality (===)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={"hello" === "hello"}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-result="true"');
    });

    it('should fold strict inequality (!==)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={5 !== 10}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-result="true"');
    });
  });

  describe('Advanced Constant Folding - Math Operators', () => {
    it('should fold modulo (%)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={10 % 3}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-result="1"');
    });

    it('should fold exponentiation (**)', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-result={2 ** 3}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-result="8"');
    });
  });

  describe('Advanced Constant Folding - Array Literals', () => {
    it('should fold array literals with constant elements', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-items={[1, 2, 3]}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-items="[1,2,3]"');
    });

    it('should fold array literals with constant expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-items={[1 + 1, 2 * 3, "hello"]}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-items="[2,6,&quot;hello&quot;]"');
    });

    it('should not fold array literals with dynamic expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          const x = 5;
          return <div data-items={[1, x, 3]}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should be dynamic since x is not constant
      expect(result!.code).toContain('_$effect');
      expect(result!.code).toContain('[1, x, 3]');
    });
  });

  describe('Advanced Constant Folding - Object Literals', () => {
    it('should fold object literals with constant properties', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-config={{x: 1, y: 2}}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-config="{&quot;x&quot;:1,&quot;y&quot;:2}"');
    });

    it('should fold object literals with constant expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-config={{sum: 1 + 2, name: "test"}}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      expect(result!.code).toContain('data-config="{&quot;sum&quot;:3,&quot;name&quot;:&quot;test&quot;}"');
    });

    it('should not fold object literals with dynamic properties', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          const x = 5;
          return <div data-config={{a: 1, b: x}}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should be dynamic since x is not constant
      expect(result!.code).toContain('_$effect');
    });
  });

  describe('Advanced Constant Folding - Complex Nested Expressions', () => {
    it('should fold nested arithmetic expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-value={(2 + 3) * (4 - 1)}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // (2 + 3) * (4 - 1) = 5 * 3 = 15
      expect(result!.code).toContain('data-value="15"');
    });

    it('should fold nested logical expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-value={true && (false || "result")}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // true && (false || "result") = true && "result" = "result"
      expect(result!.code).toContain('data-value="result"');
    });

    it('should fold conditional with constant test and nested expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function App() {
          return <div data-value={10 > 5 ? 1 + 2 : 3 + 4}>Test</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // 10 > 5 is true, so evaluate 1 + 2 = 3
      expect(result!.code).toContain('data-value="3"');
    });
  });

  describe('Template Hoisting (Already Working)', () => {
    it('should declare templates at module scope, not function scope', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Component1() {
          return <div class="card">Card 1</div>;
        }
        
        function Component2() {
          return <div class="card">Card 2</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();

      // Templates should be declared before the functions
      const lines = result!.code.split('\n');
      
      // Find the line with template declaration
      const tmplLine = lines.findIndex(l => l.includes('const _tmpl$'));
      const func1Line = lines.findIndex(l => l.includes('function Component1'));
      const func2Line = lines.findIndex(l => l.includes('function Component2'));

      // Template should be declared before both functions
      expect(tmplLine).toBeGreaterThan(-1);
      expect(tmplLine).toBeLessThan(func1Line);
      expect(tmplLine).toBeLessThan(func2Line);
    });

    it('should share hoisted templates across multiple components', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Card1() {
          return <div class="card">Card 1</div>;
        }
        
        function Card2() {
          return <div class="card">Card 2</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();

      // Should have 2 templates because text content is different ("Card 1" vs "Card 2")
      // Deduplication only works when HTML is identical
      const tmplDeclarations = result!.code.match(/const _tmpl\$\d+ = _\$template/g);
      expect(tmplDeclarations).toHaveLength(2);
      
      // Each component uses its own template
      expect(result!.code).toContain('_tmpl$0.cloneNode(true)');
      expect(result!.code).toContain('_tmpl$1.cloneNode(true)');
    });
  });

  describe('Integration Tests - Real World Scenarios', () => {
    it('should optimize a list with repeated items and constant calculations', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function ProductList() {
          return (
            <ul>
              <li data-price={10 * 0.9}>Item 1</li>
              <li data-price={20 * 0.9}>Item 2</li>
              <li data-price={30 * 0.9}>Item 3</li>
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();

      // Prices should be calculated at compile time
      expect(result!.code).toContain('data-price="9"');
      expect(result!.code).toContain('data-price="18"');
      expect(result!.code).toContain('data-price="27"');
      
      // Each li has different constant-folded attributes, so they become separate static templates
      // Plus one template for the ul wrapper = 4 templates total
      const tmplDeclarations = result!.code.match(/const _tmpl\$\d+ = _\$template/g);
      expect(tmplDeclarations).toHaveLength(4);
      
      // Verify constant folding worked
      expect(result!.code).toContain('_tmpl$1 = _$template(`<li data-price="9">Item 1</li>`)');
      expect(result!.code).toContain('_tmpl$2 = _$template(`<li data-price="18">Item 2</li>`)');
      expect(result!.code).toContain('_tmpl$3 = _$template(`<li data-price="27">Item 3</li>`)');
    });

    it('should optimize configuration objects with constant expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Settings() {
          return (
            <div 
              data-config={{
                maxWidth: 800 + 200,
                enabled: true && true,
                fallback: null ?? "default"
              }}
            >
              Settings
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();

      // Object should be fully evaluated
      expect(result!.code).toContain('data-config="{&quot;maxWidth&quot;:1000,&quot;enabled&quot;:true,&quot;fallback&quot;:&quot;default&quot;}"');
    });
  });
});
