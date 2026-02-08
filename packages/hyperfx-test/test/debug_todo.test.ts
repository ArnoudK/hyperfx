
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createComputed, createSignal, For, Show } from 'hyperfx'

describe('Todo App Debug', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container.innerHTML = '';
    });

    it('reproduces todo list update issue', () => {
        interface Todo { id: number; text: string; completed: boolean; }

        const todos = createSignal<Todo[]>([
            { id: 1, text: 'A', completed: false }
        ]);

        const filteredTodos = createComputed(() => {
            return todos();
        });

        const showList = createComputed(() => filteredTodos().length > 0);

        // Mimic structure in todo.tsx
        // <Show when={showList}>
        //   <div class="divide-y">
        //     <For each={filteredTodos}>...</For>
        //   </div>
        // </Show>

        // Hand-cranked JSX since we are in test file
        const Content = () => {
            // Mimic the div wrapper
            const wrapper = document.createElement('div');

            const list = For({
                each: filteredTodos,
                children: (item: Todo) => {
                    const div = document.createElement('div');
                    // Checkbox
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = item.completed;
                    div.appendChild(input);

                    const span = document.createElement('span');
                    span.textContent = item.text;
                    div.appendChild(span);
                    return div;
                }
            }) as Node;

            wrapper.appendChild(list);
            return wrapper;
        };

        const Root = Show({
            when: showList,
            children: Content,
            fallback: () => document.createTextNode('Empty')
        }) as Node;

        container.appendChild(Root);

        // Verify initial
        const inputBefore = container.querySelector('input');
        expect(inputBefore).not.toBeNull();
        expect(inputBefore?.checked).toBe(false);
        expect(container.textContent).toContain('A');

        // Toggle todo
        todos(todos().map(t =>
            t.id === 1 ? { ...t, completed: true } : t
        ));

        // It should update
        const inputAfter = container.querySelector('input');
        expect(inputAfter).not.toBeNull();
        // Since For does reconciliation by object identity, and we created a NEW object for the todo,
        // it should have replaced the node with a new one (or updated it if it reused it, but our For implementation replaces if reference changes)
        // So this should be true.
        expect(inputAfter?.checked).toBe(true);
    });
});
