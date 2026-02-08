
import { createComputed, createSignal, For } from 'hyperfx';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';


describe('For Component Integration', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container.innerHTML = '';
    });

    it('updates when computed dependency matches todo example', async () => {
        // Mimic Todo structure
        interface Todo { id: number; text: string; completed: boolean; }

        const todos = createSignal<Todo[]>([
            { id: 1, text: 'A', completed: false }
        ]);

        const filteredTodos = createComputed(() => {
            return todos(); // Simple pass-through first
        });

        // Track renders
        let renders = 0;

        const element = For({
            each: filteredTodos,
            children: (item) => {
                renders++;
                const div = document.createElement('div');
                div.textContent = `${item.text}-${item.completed}`;
                return div;
            }
        }) as Node;

        container.appendChild(element);

        // Initial state
        expect(container.textContent).toBe('A-false');
        expect(renders).toBe(1);


        // Update item (immutable)
        todos(todos().map(t =>
            t.id === 1 ? { ...t, completed: true } : t
        ));

        // Expectation:
        // filteredTodos updates -> returns new array [ { id:1, text:'A', completed:true } ]
        // For effect runs.
        // Allocation: item (new ref) not in old map (old ref).
        // New instance created.
        // Old instance removed.

        // Wait for potential async effects (though signals should be synchronous)
        // Effect execution might be batched or what?
        // signal.ts: createEffect runs immediately. signal.set triggers subscribers immediately.

        expect(container.textContent).toBe('A-true');
        expect(renders).toBe(2); // Should have re-rendered new item
    });

    it('updates when computed does filtering', () => {
        const todos = createSignal([
            { id: 1, val: 10 },
            { id: 2, val: 20 }
        ]);

        const filterLimit = createSignal(15);

        const filtered = createComputed(() => {
            return todos().filter(t => t.val > filterLimit());
        });

        const element = For({
            each: filtered,
            children: (item) => {
                const div = document.createElement('div');
                div.textContent = String(item.val);
                return div;
            }
        }) as Node;

        container.appendChild(element);

        expect(container.textContent).toBe('20');

        // Change filter to include 10
        filterLimit(5);
        expect(container.textContent).toBe('1020'); // Order might vary depending on filter logic, but usually preserves source order

        // Update 10 to 5 (should disappear if limit is 5? No >5)
        todos(todos().map(t => t.id === 1 ? { ...t, val: 5 } : t));
        // Array is now [{id:1, val:5}, {id:2, val:20}].
        // Filter > 5. 5 is not > 5.
        // Filtered: [{id:2, val:20}].

        expect(container.textContent).toBe('20');
    });
});
