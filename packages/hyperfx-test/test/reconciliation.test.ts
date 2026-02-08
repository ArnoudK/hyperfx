
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSignal } from 'hyperfx';
import { For } from 'hyperfx';

describe('For Component Reconciliation', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('should reuse DOM nodes when items are reordered', () => {
        const list = createSignal([1, 2, 3]);
        let renderCount = 0;

        const Component = () => {
            return For({
                each: list,
                children: (item) => {
                    renderCount++;
                    const el = document.createElement('div');
                    el.textContent = String(item);
                    return el;
                }
            });
        };

        container.appendChild(Component() as any);

        // Initial render
        const initialNodes = Array.from(container.childNodes);
        expect(initialNodes.length).toBe(5); // 2 markers + 3 items
        expect(renderCount).toBe(3);

        // Reorder list
        list([3, 1, 2]);

        const newNodes = Array.from(container.childNodes);
        expect(newNodes.length).toBe(5);

        // Check if nodes are reused (they should be, but currently aren't)
        // Finding the node for '1'
        const node1_initial = initialNodes.find(n => n.textContent === '1');
        const node1_new = newNodes.find(n => n.textContent === '1');

        // This expectation will FAIL with current implementation
        expect(node1_new).toBe(node1_initial);

        // Check render count (should not have increased if nodes were reused)
        // currently updateList calls renderItem for every item on every update
        expect(renderCount).toBe(3);
    });
});
