// ReactiveList component for handling dynamic lists in JSX
import { VNode } from '../elem/elem';
import { createEffect, ReactiveSignal } from '../reactive/state';

export interface ReactiveListProps<T> {
  items: ReactiveSignal<T[]>;
  renderItem: (item: T, index: number) => VNode;
  keyExtractor?: (item: T, index: number) => string | number;
  className?: string;
  id?: string;
}

/**
 * ReactiveList component that properly handles reactive arrays in JSX
 * This component creates a container that automatically updates when the items array changes
 */
export function ReactiveList<T>(props: ReactiveListProps<T>): VNode {
  const { items, renderItem, keyExtractor, className, id } = props;
  
  // Create a container that will be updated reactively
  const container: VNode = {
    tag: 'div',
    props: { 
      class: className || '',
      id: id || '',
      'data-reactive-list': 'true'
    },
    children: [],
  };

  // Set up reactive effect to update the container when items change
  if (typeof window !== 'undefined') {
    // Client-side: set up reactive effect
    createEffect(() => {
      const currentItems = items();
      const newChildren = currentItems.map((item, index) => {
        const vnode = renderItem(item, index);
        if (keyExtractor) {
          vnode.key = keyExtractor(item, index);
        }
        return vnode;
      });
      
      // Update the container's children
      container.children = newChildren;
      
      // If the container is already mounted, we need to update the DOM
      if (container.dom) {
        // Clear existing content
        (container.dom as HTMLElement).innerHTML = '';
        
        // Mount new children
        newChildren.forEach(child => {
          if (typeof child === 'object' && child.tag) {
            // Use dynamic import to avoid circular dependency
            import('../elem/elem').then(({ mount }) => {
              mount(child, container.dom as HTMLElement);
            });
          }
        });
      }
    });
  } else {
    // Server-side: render initial state
    const currentItems = items();
    container.children = currentItems.map((item, index) => {
      const vnode = renderItem(item, index);
      if (keyExtractor) {
        vnode.key = keyExtractor(item, index);
      }
      return vnode;
    });
  }

  return container;
}
