import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('Phase 5: Control Flow & List Rendering', () => {
  describe('Control Flow - Ternary Operator', () => {
    it('should optimize ternary with JSX elements', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [show, setShow] = createSignal(true);
          return (
            <div>
              {show() ? <span>Visible</span> : <span>Hidden</span>}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should create separate templates for both branches
      expect(result!.code).toContain('_tmpl$1 = _$template(`<span>Visible</span>`)');
      expect(result!.code).toContain('_tmpl$2 = _$template(`<span>Hidden</span>`)');
      
      // Should use ternary with template clones (optimized - no call)
      expect(result!.code).toMatch(/show \? _tmpl\$1\.cloneNode\(true\) : _tmpl\$2\.cloneNode\(true\)/);
    });

    it('should handle ternary with null branch', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [show, setShow] = createSignal(false);
          return <div>{show() ? <p>Content</p> : null}</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should have template for the content
      expect(result!.code).toContain('_$template(`<p>Content</p>`)');
      
      // Should generate ternary with null
      expect(result!.code).toMatch(/\? .+\.cloneNode\(true\) : null/);
    });

    it('should handle nested ternary operators', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [status, setStatus] = createSignal('loading');
          return (
            <div>
              {status() === 'loading' ? <div>Loading...</div> : 
               status() === 'error' ? <div>Error</div> : 
               <div>Success</div>}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should create templates for all three branches
      expect(result!.code).toContain('Loading...');
      expect(result!.code).toContain('Error');
      expect(result!.code).toContain('Success');
    });
  });

  describe('Control Flow - Logical AND (&&)', () => {
    it('should optimize logical AND with JSX', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [show, setShow] = createSignal(true);
          return <div>{show() && <span>Conditional</span>}</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should generate template for the conditional element
      expect(result!.code).toContain('_$template(`<span>Conditional</span>`)');
      
      // Should use logical AND (optimized - no call)
      expect(result!.code).toMatch(/show &&/);
    });

    it('should handle multiple AND conditions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [a, setA] = createSignal(true);
          const [b, setB] = createSignal(true);
          return <div>{a() && b() && <span>Both true</span>}</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use multiple AND conditions (optimized - no calls)
      expect(result!.code).toMatch(/a && b &&/);
    });
  });

  describe('List Rendering - .map() Optimization', () => {
    it('should optimize .map() calls with mapArray helper', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function TodoList() {
          const [todos, setTodos] = createSignal(['Task 1', 'Task 2']);
          return (
            <ul>
              {todos().map(todo => <li>{todo}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should import mapArray helper
      expect(result!.code).toContain('mapArray as _$mapArray');
      
      // Should use _$mapArray instead of plain .map()
      expect(result!.code).toContain('_$mapArray(_el$, () => todos()');
      
      // Should create template for list item
      expect(result!.code).toContain('_$template(`<li><!--#0--></li>`)');
    });

    it('should optimize .map() with JSX elements', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function UserList() {
          const [users, setUsers] = createSignal([
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
          ]);
          return (
            <div>
              {users().map(user => (
                <div class="user">
                  <h3>{user.name}</h3>
                  <span>ID: {user.id}</span>
                </div>
              ))}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use mapArray
      expect(result!.code).toContain('_$mapArray');
      
      // Should have templates for the user card structure
      expect(result!.code).toContain('class="user"');
    });

    it('should handle .map() with index parameter', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          const [items, setItems] = createSignal(['a', 'b', 'c']);
          return (
            <ul>
              {items().map((item, index) => <li>{index}: {item}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should optimize the map call
      expect(result!.code).toContain('_$mapArray');
      
      // Map function should have both parameters
      expect(result!.code).toMatch(/\(item, index\) =>/);
    });

    it('should handle .map() with complex expressions', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function FilteredList() {
          const [items, setItems] = createSignal([1, 2, 3, 4, 5]);
          return (
            <ul>
              {items().filter(x => x > 2).map(x => <li>{x * 2}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // The filter().map() chain should be optimized
      // mapArray should wrap the filtered array
      expect(result!.code).toContain('_$mapArray(_el$, () => items().filter');
    });

    it('should not optimize non-.map() array methods', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [items, setItems] = createSignal([1, 2, 3]);
          return <div>{items().filter(x => x > 1)}</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should NOT use mapArray for filter
      expect(result!.code).not.toContain('_$mapArray');
      
      // Should use regular insert (optimized - no call on items)
      expect(result!.code).toContain('_$insert');
      expect(result!.code).toMatch(/items\.filter/);
    });
  });

  describe('List Rendering - Nested .map()', () => {
    it('should handle nested .map() calls', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function NestedLists() {
          const [groups, setGroups] = createSignal([
            { name: 'Group 1', items: ['a', 'b'] },
            { name: 'Group 2', items: ['c', 'd'] }
          ]);
          return (
            <div>
              {groups().map(group => (
                <div>
                  <h3>{group.name}</h3>
                  <ul>
                    {group.items.map(item => <li>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should optimize outer map
      const mapArrayCount = (result!.code.match(/_\$mapArray/g) || []).length;
      
      // Both outer and inner .map() should be optimized
      expect(mapArrayCount).toBeGreaterThanOrEqual(2);
      
      // Should have templates for group structure and list items
      expect(result!.code).toContain('_$template');
    });
  });

  describe('Integration - Control Flow + Lists', () => {
    it('should optimize ternary containing .map()', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function ConditionalList() {
          const [items, setItems] = createSignal([1, 2, 3]);
          const [showList, setShowList] = createSignal(true);
          return (
            <div>
              {showList() ? (
                <ul>
                  {items().map(item => <li>{item}</li>)}
                </ul>
              ) : (
                <p>List hidden</p>
              )}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should have ternary operator
      expect(result!.code).toContain('?');
      
      // Should optimize the .map() in the true branch
      expect(result!.code).toContain('_$mapArray');
    });

    it('should optimize .map() with conditional items', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function ConditionalItems() {
          const [items, setItems] = createSignal([
            { name: 'Item 1', active: true },
            { name: 'Item 2', active: false }
          ]);
          return (
            <ul>
              {items().map(item => (
                <li class={item.active ? 'active' : 'inactive'}>
                  {item.name}
                </li>
              ))}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should optimize the map
      expect(result!.code).toContain('_$mapArray');
      
      // The class attribute should be dynamic (ternary in attribute)
      expect(result!.code).toContain('item.active');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty .map() callback', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [items, setItems] = createSignal([1, 2, 3]);
          return <div>{items().map(() => <span>X</span>)}</div>;
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should still optimize
      expect(result!.code).toContain('_$mapArray');
    });

    it('should handle .map() with object destructuring', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Test() {
          const [users, setUsers] = createSignal([
            { name: 'Alice', age: 30 }
          ]);
          return (
            <div>
              {users().map(({ name, age }) => (
                <div>{name} - {age}</div>
              ))}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should optimize
      expect(result!.code).toContain('_$mapArray');
    });
  });
});
