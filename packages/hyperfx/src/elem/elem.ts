import {
  type ElementAttributes as AttrElementAttributes, // Keep original name for internal use
  booleanAttrs,
  type AttributesForElement,
} from "./attr";
import { ReactiveSignal, createEffect, EffectCleanup } from "../reactive/state";

// Enhanced VNode interface with reactive support
export interface VNode<TagType extends keyof HTMLElementTagNameMap | string | symbol = string | symbol> {
  tag: TagType;
  props: AttrElementAttributes; // Use the imported ElementAttributes from attr.ts
  children: (VNode | string | ReactiveSignal<string>)[]; // Children can be reactive signals
  key?: string | number;
  dom?: HTMLElement | Text | Comment; // Reference to the real DOM node after mounting
  reactiveProps?: Record<string, ReactiveSignal<any>>; // Reactive properties
  effects?: EffectCleanup[]; // Track effects for cleanup
}

// UPDATED Children type name and definition
export type VNodeChildren = readonly (VNode | string | ReactiveSignal<string>)[] | undefined;

// Helper function to resolve reactive values
export function resolveReactiveValue<T>(value: T | ReactiveSignal<T>): T {
  if (typeof value === 'function') {
    try {
      return (value as ReactiveSignal<T>)();
    } catch {
      return value as T;
    }
  }
  return value as T;
}

// el function now returns VNode
export const el = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes: AttributesForElement<K> = {} as AttributesForElement<K>, 
  children?: VNodeChildren
): VNode<K> => {
  // Ensure attributes are cast to the general ElementAttributes type for createElementWithChildren
  return createElementWithChildren(tagName, attributes as AttrElementAttributes, children);
};

// Div now returns VNode and uses AttributesForElement for better type safety
export const Div = (
  attributes: AttributesForElement<"div"> = {} as AttributesForElement<"div">,
  children?: VNodeChildren
): VNode<"div"> => el("div", attributes, children);

/** Render text (the text content inside a tag): now returns a string for VDOM */
export function t(text: TemplateStringsArray | string, ...values: (string | unknown)[]): string {
  let result = "";
  if (typeof text === "string") {
    result = text;
  } else {
    for (let i = 0; i < values.length; i++) {
      result += text[i];
      result += String(values[i]);
    }
    result += text[values.length];
  }
  return result;
}

// Fragment
export const FRAGMENT_TAG = Symbol("HyperFX.Fragment"); // Unique symbol for fragment tag

export const Fragment = (children: VNodeChildren): VNode<typeof FRAGMENT_TAG> => {
  return {
    tag: FRAGMENT_TAG,
    props: {}, // Fragments typically don't have attributes
    children: children ? [...children] : [],
  };
};

// Preserved logic for setting attributes, will be used by mount/patch.
// Renamed to avoid potential conflicts and signify internal VDOM usage.
const setElementAttributesInternal = (el: HTMLElement, attributes: AttrElementAttributes): void => {
  for (const [attrName, attrValue] of Object.entries(attributes)) {
    if (attrValue === null || attrValue === undefined) {
      continue;
    }

    if (attrName.startsWith("on") && typeof attrValue === "function") {
      const eventName = attrName.slice(2).toLowerCase();
      el.addEventListener(eventName, attrValue as EventListener);
      continue;
    }

    if (booleanAttrs.has(attrName)) {
      if (attrValue === true || attrValue === "") {
        el.setAttribute(attrName, "");
      } else {
        el.removeAttribute(attrName);
      }
      continue;
    }
    el.setAttribute(attrName, String(attrValue));
  }
};

// createElement now returns VNode
export const createElement = function <K extends keyof HTMLElementTagNameMap>(
  name: K,
  attributes: AttrElementAttributes // Correctly uses the defined ElementAttributes
): VNode<K> {
  return {
    tag: name,
    props: attributes,
    children: [],
  };
};

// createElementWithChildren now returns VNode
export const createElementWithChildren = function <
  K extends keyof HTMLElementTagNameMap
>(
  name: K,
  attributes: AttrElementAttributes, // Correctly uses the defined ElementAttributes
  children?: VNodeChildren
): VNode<K> {
  return {
    tag: name,
    props: attributes,
    children: children ? [...children] : [],
  };
};

// --- Basic VDOM Mounting Logic ---
export function mount(vnode: VNode | string | ReactiveSignal<string>, container: Node, anchor: Node | null = null) {
  // Handle reactive signals
  if (typeof vnode === 'function') {
    const signal = vnode as ReactiveSignal<string>;
    const textNode = document.createTextNode(signal());
    
    // Create effect to update text when signal changes
    createEffect(() => {
      textNode.textContent = signal();
    });
    
    container.insertBefore(textNode, anchor);
    return textNode;
  }

  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    container.insertBefore(textNode, anchor);
    return textNode;
  }

  let domNode: HTMLElement | Text | Comment;

  if (vnode.tag === FRAGMENT_TAG) {
    domNode = document.createComment("fragment");
    vnode.dom = domNode;
    container.insertBefore(domNode, anchor);
    vnode.children.forEach(child => mount(child, container, anchor));
    return domNode;
  }

  const el = document.createElement(vnode.tag as string);
  domNode = el;
  vnode.dom = el;

  setElementAttributesInternal(el, vnode.props);

  // Handle reactive props
  if (vnode.reactiveProps) {
    vnode.effects = vnode.effects || [];
    
    Object.entries(vnode.reactiveProps).forEach(([propName, signal]) => {
      const effect = createEffect(() => {
        const value = signal();
        
        if (propName === 'textContent') {
          el.textContent = String(value);
        } else if (propName.startsWith('on') && typeof value === 'function') {
          const eventName = propName.slice(2).toLowerCase();
          // Remove old listener if any
          const oldListener = (el as any)[`__${propName}`];
          if (oldListener) {
            el.removeEventListener(eventName, oldListener);
          }
          // Add new listener
          el.addEventListener(eventName, value);
          (el as any)[`__${propName}`] = value;
        } else if (propName === 'disabled') {
          // Handle boolean disabled attribute specially
          if (value) {
            el.setAttribute('disabled', '');
          } else {
            el.removeAttribute('disabled');
          }
        } else if (propName === 'checked') {
          // Handle boolean checked attribute specially
          if (value) {
            el.setAttribute('checked', '');
          } else {
            el.removeAttribute('checked');
          }
          (el as any).checked = !!value;
        } else {
          el.setAttribute(propName, String(value));
        }
      });
      
      vnode.effects!.push(effect);
    });
  }

  // Ensure children are always arrays, even if empty
  const childrenToMount = vnode.children || [];
  childrenToMount.forEach(child => mount(child, el));

  container.insertBefore(el, anchor);
  return el;
}

// --- VDOM Patching Logic ---

export function unmount(vnode: VNode | string | ReactiveSignal<string>) {
  // Handle reactive signals
  if (typeof vnode === 'function') {
    // For reactive text nodes, we'd need to track the DOM node separately
    // This is handled by the parent VNode's cleanup
    return;
  }
  
  if (typeof vnode === 'string') {
    // If it's a string, it was mounted as a Text node.
    // We need a way to get its DOM representation if we want to unmount it.
    // This scenario is less common for direct unmount calls; usually part of parent VNode unmounting.
    // For now, if it's just a string without a .dom, we can't do much.
    return;
  }
  
  if (!vnode.dom) {
    // console.warn("Cannot unmount VNode without a DOM reference:", vnode);
    return;
  }

  // Clean up effects first
  if (vnode.effects) {
    vnode.effects.forEach(cleanup => cleanup());
    vnode.effects = [];
  }

  const domNode = vnode.dom;
  if (domNode.parentNode) {
    domNode.parentNode.removeChild(domNode);
  }
  vnode.dom = undefined; // Clear the DOM reference

  // If it's a fragment, its children were mounted directly into the parent container,
  // so they need to be unmounted individually if the fragment itself is unmounted.
  // However, typical fragment unmounting is handled by the parent patch removing the fragment comment node
  // and then the parent patch unmounting the actual child DOM nodes.
  // Direct unmount of a fragment VNode should probably unmount its children VNodes.
  if (vnode.tag === FRAGMENT_TAG) {
    vnode.children.forEach(child => unmount(child));
  }
}

function patchProps(el: HTMLElement, oldProps: AttrElementAttributes | undefined, newProps: AttrElementAttributes | undefined) {
  if (oldProps === newProps) return;
  const _oldProps = oldProps || {};
  const _newProps = newProps || {};

  // Remove old props that are not in new props or have changed
  for (const key in _oldProps) {
    const k = key as keyof AttrElementAttributes;
    const oldPropValue = _oldProps[k];
    if (!(k in _newProps) || oldPropValue !== _newProps[k]) {
      if (key.startsWith("on") && typeof oldPropValue === "function") {
        const eventName = key.slice(2).toLowerCase();
        el.removeEventListener(eventName, oldPropValue as EventListener);
      } else if (key === "innerHTML") {
        // Clear innerHTML if it's removed or changed, new value will be set below
        el.innerHTML = "";
      } else if (booleanAttrs.has(key)) {
        el.removeAttribute(key);
      }
      else {
        el.removeAttribute(key);
      }
    }
  }

  // Add new props or update existing ones
  for (const key in _newProps) {
    const k = key as keyof AttrElementAttributes;
    const oldPropValue = _oldProps[k];
    const newPropValue = _newProps[k];

    if (oldPropValue !== newPropValue) {
      if (key.startsWith("on") && typeof newPropValue === "function") {
        const eventName = key.slice(2).toLowerCase();
        // Remove old listener before adding new one if it exists
        if (typeof oldPropValue === 'function') {
          el.removeEventListener(eventName, oldPropValue as EventListener);
        }
        el.addEventListener(eventName, newPropValue as EventListener);
      } else if (key === "innerHTML" && typeof newPropValue === 'string') {
        el.innerHTML = newPropValue;
      } else if (booleanAttrs.has(key)) {
        if (newPropValue === true || newPropValue === "") {
          el.setAttribute(key, "");
        } else {
          el.removeAttribute(key);
        }
      } else if (newPropValue == null) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, String(newPropValue));
      }
    }
  }
}

function patchChildren(
  parentEl: Node,
  c1: (VNode | string | ReactiveSignal<string>)[], // old children
  c2: (VNode | string | ReactiveSignal<string>)[]  // new children
) {
  const oldLen = c1.length;
  const newLen = c2.length;
  const commonLen = Math.min(oldLen, newLen);

  for (let i = 0; i < commonLen; i++) {
    const oldChild = c1[i];
    const newChild = c2[i];
    
    if (oldChild !== undefined && newChild !== undefined) {
      // Handle reactive signals by getting their current DOM representation
      let currentOldDomNode: Node | null = null;
      
      if (typeof oldChild === 'function') {
        // For reactive signals, we need to find the corresponding text node
        currentOldDomNode = parentEl.childNodes[i] || null;
      } else if (typeof oldChild === 'string') {
        currentOldDomNode = parentEl.childNodes[i] || null;
      } else {
        currentOldDomNode = (oldChild as VNode).dom || null;
      }
      
      patch(oldChild, newChild, parentEl, currentOldDomNode?.nextSibling || null);
    }
  }

  if (newLen > oldLen) {
    for (let i = commonLen; i < newLen; i++) {
      const newChild = c2[i];
      if (newChild !== undefined) {
        mount(newChild, parentEl, null);
      }
    }
  } else if (oldLen > newLen) {
    for (let i = oldLen - 1; i >= newLen; i--) {
      const oldChildToRemove = c1[i];
      if (oldChildToRemove !== undefined) {
        if (typeof oldChildToRemove === 'string' || typeof oldChildToRemove === 'function') {
          const domNodeToRemove = parentEl.childNodes[i];
          if (domNodeToRemove) {
            parentEl.removeChild(domNodeToRemove);
          }
        } else {
          unmount(oldChildToRemove as VNode);
        }
      }
    }
  }
}

export function patch(
  n1: VNode | string | ReactiveSignal<string> | null, // oldVNode
  n2: VNode | string | ReactiveSignal<string> | null, // newVNode
  container: Node,           // container for mount if n1 is null or types differ
  anchor: Node | null = null   // anchor for mount
) {
  if (n1 === n2) {
    if (n1 && typeof n1 !== 'string' && typeof n1 !== 'function') {
      return n1.dom;
    }
    return container.childNodes[0] || null;
  }

  const isN1VNode = n1 && typeof n1 !== 'string' && typeof n1 !== 'function';
  const isN2VNode = n2 && typeof n2 !== 'string' && typeof n2 !== 'function';
  const isN1Signal = typeof n1 === 'function';
  const isN2Signal = typeof n2 === 'function';

  // If types are different, replace completely
  if (n1 && (typeof n1 !== typeof n2 || (isN1VNode && isN2VNode && (n1 as VNode).tag !== (n2 as VNode).tag))) {
    if (isN1VNode) {
      unmount(n1 as VNode);
    } else if (isN1Signal || typeof n1 === 'string') {
      // Remove text node
      const domNodeToRemove = container.childNodes[0];
      if (domNodeToRemove) {
        container.removeChild(domNodeToRemove);
      }
    }
    n1 = null;
  }

  if (!n1 && n2) {
    return mount(n2, container, anchor);
  }

  if (n1 && !n2) {
    if (isN1VNode) {
      unmount(n1 as VNode);
    } else if (isN1Signal || typeof n1 === 'string') {
      const domNodeToRemove = container.childNodes[0];
      if (domNodeToRemove) {
        container.removeChild(domNodeToRemove);
      }
    }
    return null;
  }

  // Handle text content (strings and reactive signals)
  if ((typeof n1 === 'string' || isN1Signal) && (typeof n2 === 'string' || isN2Signal)) {
    const oldValue = isN1Signal ? (n1 as ReactiveSignal<string>)() : n1 as string;
    const newValue = isN2Signal ? (n2 as ReactiveSignal<string>)() : n2 as string;
    
    if (oldValue !== newValue || isN1Signal !== isN2Signal) {
      // If switching between signal and string, or content changed, replace
      const oldDomNode = container.childNodes[0];
      if (oldDomNode && oldDomNode.nodeType === Node.TEXT_NODE) {
        if (isN2Signal) {
          // Replace with reactive text node
          container.removeChild(oldDomNode);
          return mount(n2, container, anchor);
        } else {
          // Update text content
          oldDomNode.nodeValue = newValue;
          return oldDomNode;
        }
      } else {
        return mount(n2, container, anchor);
      }
    }
    return container.childNodes[0] || null;
  }

  if (isN1VNode && isN2VNode) {
    const vnode1 = n1 as VNode;
    const vnode2 = n2 as VNode;
    const el = (vnode2.dom = vnode1.dom!); // Assert dom is present on vnode1 and reuse it

    // Transfer effects
    vnode2.effects = vnode1.effects;

    if (vnode2.tag === FRAGMENT_TAG) {
      // For fragments, the 'el' is a comment node.
      // Props are not patched for fragments.
      // Children are patched in the fragment's container (el.parentNode),
      // using the comment node's nextSibling as the anchor for children.
      if (el.parentNode) { // Ensure parentNode exists before patching children
        patchChildren(el.parentNode, vnode1.children || [], vnode2.children || []);
      }
    } else {
      patchProps(el as HTMLElement, vnode1.props, vnode2.props);
      
      // Handle reactive props changes
      if (vnode1.reactiveProps !== vnode2.reactiveProps) {
        // Clean up old reactive props effects
        if (vnode1.effects) {
          vnode1.effects.forEach(cleanup => cleanup());
        }
        
        // Set up new reactive props effects
        if (vnode2.reactiveProps) {
          vnode2.effects = [];
          Object.entries(vnode2.reactiveProps).forEach(([propName, signal]) => {
            const effect = createEffect(() => {
              const value = signal();
              const element = el as HTMLElement;
              
              if (propName === 'textContent') {
                element.textContent = String(value);
              } else if (propName.startsWith('on') && typeof value === 'function') {
                const eventName = propName.slice(2).toLowerCase();
                // Remove old listener if any
                const oldListener = (element as any)[`__${propName}`];
                if (oldListener) {
                  element.removeEventListener(eventName, oldListener);
                }
                // Add new listener
                element.addEventListener(eventName, value);
                (element as any)[`__${propName}`] = value;
              } else {
                element.setAttribute(propName, String(value));
              }
            });
            
            vnode2.effects!.push(effect);
          });
        }
      }
      
      patchChildren(el as HTMLElement, vnode1.children || [], vnode2.children || []);
    }
    return el;
  }

  console.warn("Patch reached unexpected state. n1:", n1, "n2:", n2);
  if (isN1VNode) unmount(n1 as VNode);
  return mount(n2!, container, anchor);
}

/**
 * Renders a VNode tree into a container element.
 * This is the entry point for the VDOM rendering.
 */
export const RenderToBody = (vnode: VNode | VNode[]) => {
  const renderFn = () => {
    if (Array.isArray(vnode)) {
      const fragment = document.createDocumentFragment();
      vnode.forEach(childNode => mount(childNode, fragment));
      document.body.appendChild(fragment);
    } else {
      mount(vnode, document.body);
    }
  };

  if (document.body) {
    renderFn();
  } else {
    document.addEventListener('DOMContentLoaded', renderFn);
  }
};
