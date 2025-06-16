// For component for reactive arrays in JSX with improved types
import { VNode, FRAGMENT_TAG } from "../elem/elem";
import { ReactiveSignal } from "../reactive/state";

// Global counter for deterministic IDs
let forIdCounter = 0;

export interface ForProps<T> {
  each: ReactiveSignal<T[]> | T[];
  children: (item: T, index: number) => VNode;
  fallback?: VNode;
  key?: string | number; // Key for the For component itself
}

// Enhanced VNode with reactive For data
interface ReactiveForVNode extends VNode {
  __reactiveArrayFn?: ReactiveSignal<any[]>;
  __renderFn?: (item: any, index: number) => VNode;
  __fallback?: VNode;
}

export function For<T>(props: ForProps<T>): VNode {
  const { each, children, fallback } = props;
  
  // Check if each is a reactive signal or static array
  const isReactive = typeof each === 'function';
  
  // Create a deterministic container ID based on the signal reference
  // This ensures the same ID is generated during both SSR and hydration
  let containerId: string;
  if (isReactive) {
    // Use a simple incremental ID
    containerId = `for-${++forIdCounter}`;
  } else {
    // For static arrays, we can use a simpler approach
    containerId = `for-static-${++forIdCounter}`;
  }
  
  if (isReactive) {
    // For reactive arrays, create a reactive fragment that can update efficiently
    const reactiveSignal = each as ReactiveSignal<T[]>;
    let initialItems: T[] = [];
    
    try {
      // Get the current value of the reactive signal for SSR
      initialItems = reactiveSignal();
    } catch (error) {
      initialItems = [];
    }
    
    // Render initial content for SSR, but mark as reactive for hydration
    const initialChildren = initialItems.length === 0 && fallback 
      ? [fallback] 
      : initialItems.map((item, index) => {
          const childVNode = children(item, index);
          // Add a key for better reconciliation
          if (!childVNode.key) {
            childVNode.key = `item-${index}`;
          }
          return childVNode;
        });
    
    // Use a transparent wrapper div that can hold reactive data and be found during hydration
    const reactiveVNode: ReactiveForVNode = {
      tag: 'div',
      props: {
        'data-reactive-for': 'true',
        'data-reactive-id': containerId,
        style: 'display: contents;', // Make it transparent in layout
      },
      children: initialChildren,
      // Store the reactive function and render function for hydration
      __reactiveArrayFn: reactiveSignal,
      __renderFn: children,
      __fallback: fallback,
    };
    
    return reactiveVNode;
  } else {
    // For static arrays, render immediately as a fragment
    const items = each as T[];
    if (items.length === 0 && fallback) {
      return fallback;
    }
    
    // For static arrays, use a simple transparent wrapper for consistency
    return {
      tag: 'div',
      props: {
        style: 'display: contents;'
      },
      children: items.map((item, index) => {
        const childVNode = children(item, index);
        if (!childVNode.key) {
          childVNode.key = `static-item-${index}`;
        }
        return childVNode;
      }),
    };
  }
}
