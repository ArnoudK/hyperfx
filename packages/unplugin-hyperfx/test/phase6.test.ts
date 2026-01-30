import { describe, it, expect } from 'vitest';
import { HyperFXTransformer } from '../src/core/transform';

describe('Phase 6: Keyed Diffing', () => {
  describe('Key Detection', () => {
    it('should detect key prop with property access', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          const [items, setItems] = createSignal([]);
          return (
            <ul>
              {items().map(item => <li key={item.id}>{item.name}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use mapArrayKeyed
      expect(result!.code).toContain('_$mapArrayKeyed');
      
      // Should extract key function
      expect(result!.code).toContain('(item, i) => item.id');
      
      // Key prop should NOT be in the template
      expect(result!.code).not.toContain('key=');
    });

    it('should detect key prop with index', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <div>
              {items().map((item, i) => <div key={i}>{item}</div>)}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use mapArrayKeyed
      expect(result!.code).toContain('_$mapArrayKeyed');
      
      // Should extract key function using index
      expect(result!.code).toContain('(item, i) => i');
      
      // Key prop should NOT be in DOM
      expect(result!.code).not.toContain('key=');
    });

    it('should detect key prop with complex expression', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <ul>
              {users().map(user => <li key={user.id + '-' + user.name}>{user.name}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use mapArrayKeyed
      expect(result!.code).toContain('_$mapArrayKeyed');
      
      // Should have key function with complex expression
      expect(result!.code).toMatch(/\(user, i\) => user\.id \+ .*-.*\+ user\.name/);
    });

    it('should use non-keyed mapArray when no key prop', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <ul>
              {items().map(item => <li>{item.name}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use non-keyed mapArray
      expect(result!.code).toContain('_$mapArray');
      
      // Should NOT use keyed version
      expect(result!.code).not.toContain('_$mapArrayKeyed');
    });
  });

  describe('Key Prop Stripping', () => {
    it('should strip key prop from static attributes', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <div>
              {items().map(item => <div key={item.id} class="item">{item.name}</div>)}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Template should have class but not key
      expect(result!.code).toMatch(/_\$template\(`<div class="item">.*<\/div>`\)/);
      expect(result!.code).not.toMatch(/key=/);
    });

    it('should handle key prop alongside other attributes', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <ul>
              {items().map(item => (
                <li key={item.id} class="item" data-id={item.id}>
                  {item.name}
                </li>
              ))}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should have static class attribute
      expect(result!.code).toMatch(/class="item"/);
      
      // Should have dynamic data-id attribute
      expect(result!.code).toContain('data-id');
      
      // Key should be extracted to key function
      expect(result!.code).toContain('(item, i) => item.id');
      
      // Key should NOT be in attributes
      expect(result!.code).not.toMatch(/key=/);
    });

    it('should strip key prop even with string literal value', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <div>
              {items().map(item => <div key="static-key">{item}</div>)}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use keyed version
      expect(result!.code).toContain('_$mapArrayKeyed');
      
      // Key should NOT appear in template
      expect(result!.code).not.toMatch(/key=/);
    });
  });

  describe('Import Generation', () => {
    it('should import mapArrayKeyed when key is present', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <ul>
              {items().map(item => <li key={item.id}>{item.name}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should import mapArrayKeyed
      expect(result!.code).toContain('mapArrayKeyed as _$mapArrayKeyed');
      
      // Should also import template, insert, etc.
      expect(result!.code).toContain("from 'hyperfx/runtime-dom'");
    });

    it('should only import mapArray when no key is present', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <ul>
              {items().map(item => <li>{item.name}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should import mapArray
      expect(result!.code).toContain('mapArray as _$mapArray');
      
      // Should NOT import mapArrayKeyed
      expect(result!.code).not.toContain('mapArrayKeyed');
    });
  });

  describe('Nested Maps', () => {
    it('should handle nested keyed maps', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Grid() {
          return (
            <div>
              {rows().map(row => (
                <div key={row.id}>
                  {row.cells().map(cell => (
                    <span key={cell.id}>{cell.value}</span>
                  ))}
                </div>
              ))}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Both outer and inner maps should use keyed version
      const keyedCalls = (result!.code.match(/_\$mapArrayKeyed/g) || []);
      expect(keyedCalls.length).toBeGreaterThanOrEqual(2);
      
      // Should have key functions for both levels
      expect(result!.code).toContain('(row, i) => row.id');
      expect(result!.code).toContain('(cell, i) => cell.id');
    });

    it('should handle mixed keyed and non-keyed nested maps', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function Mixed() {
          return (
            <div>
              {groups().map(group => (
                <div key={group.id}>
                  {group.items().map(item => (
                    <span>{item.name}</span>
                  ))}
                </div>
              ))}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use mapArrayKeyed
      expect(result!.code).toContain('_$mapArrayKeyed');
      expect(result!.code).toContain('(group, i) => group.id');
      
      // Inner map should be non-keyed
      expect(result!.code).toContain('_$mapArray');
    });
  });

  describe('Edge Cases', () => {
    it('should handle key with function call', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <ul>
              {items().map(item => <li key={getId(item)}>{item.name}</li>)}
            </ul>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use keyed version
      expect(result!.code).toContain('_$mapArrayKeyed');
      
      // Should preserve function call in key function
      expect(result!.code).toContain('(item, i) => getId(item)');
    });

    it('should handle components with key prop', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function List() {
          return (
            <div>
              {items().map(item => <CustomItem key={item.id} data={item} />)}
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use keyed version
      expect(result!.code).toContain('_$mapArrayKeyed');
      
      // Should extract key function
      expect(result!.code).toContain('(item, i) => item.id');
      
      // Should still pass data prop to component
      expect(result!.code).toContain('data');
      
      // Key should not be passed to component
      expect(result!.code).not.toMatch(/key=/);
    });

    it('should handle multiple maps in same component', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function MultiList() {
          return (
            <div>
              <ul>
                {users().map(user => <li key={user.id}>{user.name}</li>)}
              </ul>
              <ul>
                {posts().map(post => <li key={post.id}>{post.title}</li>)}
              </ul>
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should have two keyed maps (plus one in import statement)
      const keyedCalls = (result!.code.match(/_\$mapArrayKeyed/g) || []);
      expect(keyedCalls.length).toBeGreaterThanOrEqual(2);
      
      // Should have key functions for both
      expect(result!.code).toContain('(user, i) => user.id');
      expect(result!.code).toContain('(post, i) => post.id');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should optimize a todo list with keyed items', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function TodoList() {
          const [todos, setTodos] = createSignal([]);
          
          return (
            <div class="todo-list">
              <ul>
                {todos().map(todo => (
                  <li key={todo.id} class={todo.completed ? 'completed' : ''}>
                    <input type="checkbox" checked={todo.completed} />
                    <span>{todo.text}</span>
                    <button onclick={() => deleteTodo(todo.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use keyed diffing
      expect(result!.code).toContain('_$mapArrayKeyed');
      expect(result!.code).toContain('(todo, i) => todo.id');
      
      // Should have event delegation
      expect(result!.code).toContain('_$delegate');
      
      // Should handle dynamic class
      expect(result!.code).toContain('todo.completed');
      
      // Key should not be in DOM
      expect(result!.code).not.toMatch(/key=/);
    });

    it('should optimize a data table with keyed rows', () => {
      const transformer = new HyperFXTransformer();
      const code = `
        function DataTable() {
          const [rows, setRows] = createSignal([]);
          
          return (
            <table>
              <tbody>
                {rows().map(row => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
      `;

      const result = transformer.transform(code, 'test.tsx');
      expect(result).not.toBeNull();
      
      // Should use keyed diffing
      expect(result!.code).toContain('_$mapArrayKeyed');
      expect(result!.code).toContain('(row, i) => row.id');
      
      // Should optimize multiple dynamic children
      expect(result!.code).toContain('row.name');
      expect(result!.code).toContain('row.email');
      expect(result!.code).toContain('row.status');
    });
  });
});
