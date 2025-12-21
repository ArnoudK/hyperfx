import type { Signal } from "../reactive/signal";
import { isSignal, createComputed as signal_createComputed } from "../reactive/signal";
import { ComputedSignal } from "../reactive/state";
import { Prettify } from "../tools/type_utils";
// Define a type alias for IntrinsicElements for easier reference
type IntrinsicElements = JSX.IntrinsicElements;

// HTML5 void elements that cannot have children
type VoidElements = 'area' | 'base' | 'br' | 'col' | 'embed' | 'hr' | 'img' | 'input' | 'link' | 'meta' | 'param' | 'source' | 'track' | 'wbr';

// JSX namespace for TypeScript
export namespace JSX {
  export type Element = JSXElement;
  export interface ElementChildrenAttribute {
    children: JSXChildren;
  }
  export type IntrinsicElements = {
    [K in keyof HTMLElementTagNameMap]: (
      K extends 'a' ? import('./types/structural-attributes').AHTMLAttributes :
      K extends 'area' ? import('./types/media-attributes').AreaHTMLAttributes :
      K extends 'audio' ? import('./types/media-attributes').AudioHTMLAttributes :
      K extends 'base' ? import('./types/semantic-attributes').BaseHTMLAttributes :
      K extends 'blockquote' ? import('./types/structural-attributes').BlockquoteHTMLAttributes :
      K extends 'body' ? import('./types/semantic-attributes').BodyHTMLAttributes :
      K extends 'br' ? import('./types/structural-attributes').BrHTMLAttributes :
      K extends 'button' ? import('./types/form-attributes').ButtonHTMLAttributes :
      K extends 'canvas' ? import('./types/semantic-attributes').CanvasHTMLAttributes :
      K extends 'caption' ? import('./types/structural-attributes').CaptionHTMLAttributes :
      K extends 'cite' ? import('./types/structural-attributes').CiteHTMLAttributes :
      K extends 'code' ? import('./types/structural-attributes').CodeHTMLAttributes :
      K extends 'col' ? import('./types/structural-attributes').ColHTMLAttributes :
      K extends 'colgroup' ? import('./types/structural-attributes').ColgroupHTMLAttributes :
      K extends 'data' ? import('./types/semantic-attributes').DataHTMLAttributes :
      K extends 'datalist' ? import('./types/form-attributes').DatalistHTMLAttributes :
      K extends 'dd' ? import('./types/structural-attributes').DdHTMLAttributes :
      K extends 'del' ? import('./types/structural-attributes').DelHTMLAttributes :
      K extends 'details' ? import('./types/structural-attributes').DetailsHTMLAttributes :
      K extends 'dfn' ? import('./types/structural-attributes').DfnHTMLAttributes :
      K extends 'dialog' ? import('./types/structural-attributes').DialogHTMLAttributes :
      K extends 'div' ? import('./types/structural-attributes').DivHTMLAttributes :
      K extends 'dl' ? import('./types/structural-attributes').DlHTMLAttributes :
      K extends 'dt' ? import('./types/structural-attributes').DtHTMLAttributes :
      K extends 'em' ? import('./types/structural-attributes').EmHTMLAttributes :
      K extends 'embed' ? import('./types/media-attributes').EmbedHTMLAttributes :
      K extends 'fieldset' ? import('./types/form-attributes').FieldsetHTMLAttributes :
      K extends 'figcaption' ? import('./types/structural-attributes').FigcaptionHTMLAttributes :
      K extends 'figure' ? import('./types/structural-attributes').FigureHTMLAttributes :
      K extends 'footer' ? import('./types/semantic-attributes').FooterHTMLAttributes :
      K extends 'form' ? import('./types/form-attributes').FormHTMLAttributes :
      K extends 'h1' ? import('./types/semantic-attributes').H1HTMLAttributes :
      K extends 'h2' ? import('./types/semantic-attributes').H2HTMLAttributes :
      K extends 'h3' ? import('./types/semantic-attributes').H3HTMLAttributes :
      K extends 'h4' ? import('./types/semantic-attributes').H4HTMLAttributes :
      K extends 'h5' ? import('./types/semantic-attributes').H5HTMLAttributes :
      K extends 'h6' ? import('./types/semantic-attributes').H6HTMLAttributes :
      K extends 'head' ? import('./types/semantic-attributes').HeadHTMLAttributes :
      K extends 'header' ? import('./types/semantic-attributes').HeaderHTMLAttributes :
      K extends 'hgroup' ? import('./types/semantic-attributes').HgroupHTMLAttributes :
      K extends 'hr' ? import('./types/structural-attributes').HrHTMLAttributes :
      K extends 'html' ? import('./types/semantic-attributes').HtmlHTMLAttributes :
      K extends 'i' ? import('./types/structural-attributes').IHTMLAttributes :
      K extends 'iframe' ? import('./types/media-attributes').IframeHTMLAttributes :
      K extends 'img' ? import('./types/media-attributes').ImgHTMLAttributes :
      K extends 'input' ? import('./types/form-attributes').InputHTMLAttributes :
      K extends 'ins' ? import('./types/structural-attributes').InsHTMLAttributes :
      K extends 'kbd' ? import('./types/structural-attributes').KbdHTMLAttributes :
      K extends 'label' ? import('./types/form-attributes').LabelHTMLAttributes :
      K extends 'legend' ? import('./types/form-attributes').LegendHTMLAttributes :
      K extends 'li' ? import('./types/structural-attributes').LiHTMLAttributes :
      K extends 'link' ? import('./types/semantic-attributes').LinkHTMLAttributes :
      K extends 'main' ? import('./types/semantic-attributes').MainHTMLAttributes :
      K extends 'map' ? import('./types/media-attributes').MapHTMLAttributes :
      K extends 'mark' ? import('./types/structural-attributes').MarkHTMLAttributes :
      K extends 'menu' ? import('./types/semantic-attributes').MenuHTMLAttributes :
      K extends 'meta' ? import('./types/semantic-attributes').MetaHTMLAttributes :
      K extends 'meter' ? import('./types/form-attributes').MeterHTMLAttributes :
      K extends 'nav' ? import('./types/semantic-attributes').NavHTMLAttributes :
      K extends 'noscript' ? import('./types/semantic-attributes').NoscriptHTMLAttributes :
      K extends 'object' ? import('./types/media-attributes').ObjectHTMLAttributes :
      K extends 'ol' ? import('./types/structural-attributes').OlHTMLAttributes :
      K extends 'optgroup' ? import('./types/form-attributes').OptgroupHTMLAttributes :
      K extends 'option' ? import('./types/form-attributes').OptionHTMLAttributes :
      K extends 'output' ? import('./types/form-attributes').OutputHTMLAttributes :
      K extends 'p' ? import('./types/structural-attributes').PHTMLAttributes :
      K extends 'picture' ? import('./types/global-attributes').GlobalHTMLAttributes :
      K extends 'portal' ? import('./types/semantic-attributes').PortalHTMLAttributes :
      K extends 'pre' ? import('./types/structural-attributes').PreHTMLAttributes :
      K extends 'progress' ? import('./types/form-attributes').ProgressHTMLAttributes :
      K extends 'q' ? import('./types/structural-attributes').QHTMLAttributes :
      K extends 'rp' ? import('./types/semantic-attributes').RpHTMLAttributes :
      K extends 'rt' ? import('./types/semantic-attributes').RtHTMLAttributes :
      K extends 'ruby' ? import('./types/semantic-attributes').RubyHTMLAttributes :
      K extends 's' ? import('./types/structural-attributes').SHTMLAttributes :
      K extends 'samp' ? import('./types/structural-attributes').SampHTMLAttributes :
      K extends 'script' ? import('./types/semantic-attributes').ScriptHTMLAttributes :
      K extends 'section' ? import('./types/semantic-attributes').SectionHTMLAttributes :
      K extends 'select' ? import('./types/form-attributes').SelectHTMLAttributes :
      K extends 'slot' ? import('./types/semantic-attributes').SlotHTMLAttributes :
      K extends 'small' ? import('./types/structural-attributes').SmallHTMLAttributes :
      K extends 'source' ? import('./types/media-attributes').SourceHTMLAttributes :
      K extends 'span' ? import('./types/structural-attributes').SpanHTMLAttributes :
      K extends 'strong' ? import('./types/structural-attributes').StrongHTMLAttributes :
      K extends 'style' ? import('./types/semantic-attributes').StyleHTMLAttributes :
      K extends 'sub' ? import('./types/structural-attributes').SubHTMLAttributes :
      K extends 'summary' ? import('./types/structural-attributes').SummaryHTMLAttributes :
      K extends 'sup' ? import('./types/structural-attributes').SupHTMLAttributes :
      K extends 'table' ? import('./types/structural-attributes').TableHTMLAttributes :
      K extends 'tbody' ? import('./types/structural-attributes').TbodyHTMLAttributes :
      K extends 'td' ? import('./types/structural-attributes').TdHTMLAttributes :
      K extends 'template' ? import('./types/semantic-attributes').TemplateHTMLAttributes :
      K extends 'textarea' ? import('./types/form-attributes').TextareaHTMLAttributes :
      K extends 'tfoot' ? import('./types/structural-attributes').TfootHTMLAttributes :
      K extends 'th' ? import('./types/structural-attributes').ThHTMLAttributes :
      K extends 'thead' ? import('./types/structural-attributes').TheadHTMLAttributes :
      K extends 'time' ? import('./types/structural-attributes').TimeHTMLAttributes :
      K extends 'title' ? import('./types/semantic-attributes').TitleHTMLAttributes :
      K extends 'tr' ? import('./types/structural-attributes').TrHTMLAttributes :
      K extends 'track' ? import('./types/media-attributes').TrackHTMLAttributes :
      K extends 'u' ? import('./types/structural-attributes').UHTMLAttributes :
      K extends 'ul' ? import('./types/structural-attributes').UlHTMLAttributes :
      K extends 'var' ? import('./types/structural-attributes').VarHTMLAttributes :
      K extends 'video' ? import('./types/media-attributes').VideoHTMLAttributes :
      K extends 'wbr' ? import('./types/semantic-attributes').WbrHTMLAttributes :
      import('./types/global-attributes').GlobalHTMLAttributes
    ) & (K extends VoidElements ? {} : { children?: JSXChildren })
  };
}

type NormalizedValue<T> = {
  isReactive: boolean;
  isFunction: boolean;
  getValue: () => T;
  subscribe?: (callback: (v: T) => void) => () => void;
};

/**
 * Direct DOM JSX Runtime for HyperFX
 */

// Global node counter for generating unique node IDs (client-side)
let clientNodeCounter = 0;

// Track signal subscriptions for each element for cleanup
const elementSubscriptions = new WeakMap<Element, Set<() => void>>();

// Automatic cleanup using MutationObserver
if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node instanceof Element && elementSubscriptions.has(node)) {
          cleanupElementSubscriptions(node);
        }
        // Also check child nodes recursively
        if (node instanceof Element) {
          node.querySelectorAll('*').forEach((child) => {
            if (elementSubscriptions.has(child)) {
              cleanupElementSubscriptions(child);
            }
          });
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Batch update system for performance optimization
let batchQueue = new Set<() => void>();
let isBatching = false;

/**
 * Execute multiple updates together to reduce DOM manipulation
 */
export function batchUpdates<T>(fn: () => T): T {
  const wasBatching = isBatching;
  isBatching = true;

  try {
    const result = fn();
    return result;
  } finally {
    if (!wasBatching) {
      // Flush the batch
      isBatching = false;
      flushBatch();
    }
  }
}

/**
 * Add an update function to the batch queue
 */
function addToBatch(updateFn: () => void): void {
  if (isBatching) {
    batchQueue.add(updateFn);
  } else {
    updateFn();
  }
}

/**
 * Execute all queued updates
 */
function flushBatch(): void {
  const updates = Array.from(batchQueue);
  batchQueue.clear();

  updates.forEach(update => {
    try {
      update();
    } catch (error) {
      console.error('Error in batched update:', error);
    }
  });
}

/**
 * Check if we're in an SSR environment
 */
function isSSREnvironment(): boolean {
  return typeof window === 'undefined' || typeof document === 'undefined';
}

/**
 * Generate a unique node ID for client-side elements
 */
export function createClientId(): string {
  return String(++clientNodeCounter).padStart(6, '0');
}

/**
 * Add a subscription to an element's cleanup list
 */
function addElementSubscription(element: Element, unsubscribe: () => void): void {
  const subscriptions = elementSubscriptions.get(element);
  if (!subscriptions) {
    elementSubscriptions.set(element, new Set([unsubscribe]));
  } else {
    subscriptions.add(unsubscribe);
  }
}

/**
 * Clean up all signal subscriptions for an element
 */
export function cleanupElementSubscriptions(element: Element): void {
  const subscriptions = elementSubscriptions.get(element);
  if (subscriptions) {
    subscriptions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error during subscription cleanup:', error);
      }
    });
    subscriptions.clear();
    elementSubscriptions.delete(element);
  }
}

// Simple setAttribute function that handles all attribute types
function setAttribute(element: HTMLElement, key: string, value: any): void {
  // Skip children and key props
  if (key === 'children' || key === 'key') {
    return;
  }

  // Handle event handlers
  if (key.startsWith('on') && typeof value === 'function') {
    const eventName = key.slice(2).toLowerCase();
    element.addEventListener(eventName, value);
    return;
  }

  // Handle reactive signals
  if (isSignal(value)) {
    try {
      const update = () => {
        try {
          setAttribute(element, key, value());
        } catch (error) {
          console.error(`Error updating attribute "${key}":`, error);
          // Remove attribute on error
          element.removeAttribute(key);
        }
      };
      const unsubscribe = value.subscribe(() => addToBatch(update));
      addElementSubscription(element, unsubscribe);
      update(); // initial after subscribe succeeds
    } catch (error) {
      console.error(`Error subscribing to signal for attribute "${key}":`, error);
      // No attribute set if subscribe fails
    }
    return;
  }

  // Handle reactive functions (create computed for reactivity)
  else if (typeof value === 'function') {
    try {
      const computed = signal_createComputed(value as () => any);
      const update = () => {
        try {
          setAttribute(element, key, computed());
        } catch (error) {
          console.error(`Error updating computed attribute "${key}":`, error);
          // Remove attribute on error
          element.removeAttribute(key);
        }
      };
      const unsubscribe = computed.subscribe(() => addToBatch(update));
      addElementSubscription(element, unsubscribe);
      update(); // initial after subscribe
    } catch (error) {
      console.error(`Error creating computed for attribute "${key}":`, error);
      // No attribute set if fails
    }
    return;
  }

  // Handle class attribute specially
  if (key === 'class') {
    if (value != null) {
      element.className = String(value);
    } else {
      element.removeAttribute('class');
    }
    return;
  }

  // Handle boolean attributes
  const booleanAttrs = new Set([
    'disabled', 'checked', 'readonly', 'readOnly', 'required', 'autofocus', 'autoplay',
    'controls', 'default', 'defer', 'hidden', 'inert', 'loop', 'multiple',
    'muted', 'novalidate', 'open', 'reversed', 'selected'
  ]);

  if (booleanAttrs.has(key)) {
    const boolValue = Boolean(value);

    if (key === 'checked' && element instanceof HTMLInputElement) {
      element.checked = boolValue;
      element.toggleAttribute('checked', boolValue);
    } else if ((key === 'readonly' || key === 'readOnly') && element instanceof HTMLInputElement) {
      element.readOnly = boolValue;
      element.toggleAttribute('readonly', boolValue);
    } else if (key === 'disabled') {
      (element as any).disabled = boolValue;
      element.toggleAttribute('disabled', boolValue);
    } else {
      element.toggleAttribute(key, boolValue);
    }
    return;
  }

  // Handle style attribute
  if (key === 'style') {
    if (value == null) {
      element.removeAttribute('style');
    } else if (typeof value === 'string') {
      element.setAttribute('style', value);
    } else if (typeof value === 'object') {
      Object.entries(value as any).forEach(([property, styleValue]) => {
        if (styleValue != null) {
          try {
            const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            (element.style as any)[camelCaseProperty] = String(styleValue);
          } catch (styleError) {
            console.warn(`Failed to set CSS property "${property}":`, styleError);
          }
        }
      });
    } else {
      element.setAttribute('style', String(value));
    }
    return;
  }

  // Handle input properties
  if (key === 'value' && element instanceof HTMLInputElement) {
    element.value = String(value || '');
    return;
  }

  if (key === 'innerHTML' || key === 'textContent') {
    (element as any)[key] = value;
    return;
  }

  // Handle all other attributes
  if (value != null) {
    element.setAttribute(key, String(value));
  } else {
    element.removeAttribute(key);
  }
}

function normalizeValue<T>(value: T | Signal<T> | (() => T)): NormalizedValue<T> {
  // Handle signals
  if (isSignal(value)) {
    return {
      isReactive: true,
      isFunction: false,
      getValue: () => {
        try {
          return value();
        } catch (error) {
          console.error('Error accessing signal value:', error);
          return undefined as T;
        }
      },
      subscribe: (callback: (v: T) => void) => {
        try {
          return value.subscribe(callback);
        } catch (error) {
          console.error('Error subscribing to signal:', error);
          return () => { };
        }
      }
    };
  }

  // Handle functions (non-signal)
  if (typeof value === 'function') {
    return {
      isReactive: false,
      isFunction: true,
      getValue: () => {
        try {
          return (value as () => T)();
        } catch (error) {
          console.error('Error executing function value:', error);
          return undefined as T;
        }
      },
      subscribe: undefined
    };
  }

  // Handle static values
  return {
    isReactive: false,
    isFunction: false,
    getValue: () => value,
    subscribe: undefined
  };
}




// Global attribute manager instance
const attributeManager = {
  applyAttribute(element: HTMLElement, key: string, value: any): void {
    setAttribute(element, key, value);
  },

  applyAttributes(element: HTMLElement, props: Record<string, any>): void {
    for (const [key, value] of Object.entries(props)) {
      this.applyAttribute(element, key, value);
    }
  }
};

// Core reactive prop type - allows any value to be reactive
export type ReactiveValue<T> = T | Signal<T> | (() => T);

// Specific reactive types for common use cases
export type ReactiveString = ReactiveValue<string>;
export type ReactiveNumber = ReactiveValue<number>;
export type ReactiveBoolean = ReactiveValue<boolean>;

// JSX Element types (actual DOM elements)
export type JSXElement =
  | HTMLElement
  | DocumentFragment
  | Text
  | Comment;

export type JSXChildPrimitive = string | number | boolean | null | undefined;

// JSX children types
export type JSXChild = Prettify<
  | JSXElement
  | JSXChildPrimitive
  | Signal<JSXElement | JSXChildPrimitive>
  | (() => JSXElement)
  | (() => JSXElement[])
  | ComputedSignal<JSXElement | JSXChildPrimitive>
>;

export type JSXChildren = JSXChild | JSXChild[];

// Event handler types (these should NOT be reactive)
export type EventHandler<E extends Event = Event> = (event: E) => void;

export interface EventHandlers {
  onclick?: EventHandler<MouseEvent>;
  oninput?: EventHandler<InputEvent>;
  onChange?: EventHandler<Event>;
  onSubmit?: EventHandler<SubmitEvent>;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
  onKeyDown?: EventHandler<KeyboardEvent>;
  onKeyUp?: EventHandler<KeyboardEvent>;
  onKeyPress?: EventHandler<KeyboardEvent>;
  onMouseEnter?: EventHandler<MouseEvent>;
  onMouseLeave?: EventHandler<MouseEvent>;
  onMouseMove?: EventHandler<MouseEvent>;
  onMouseDown?: EventHandler<MouseEvent>;
  onMouseUp?: EventHandler<MouseEvent>;
  onTouchStart?: EventHandler<TouchEvent>;
  onTouchEnd?: EventHandler<TouchEvent>;
  onTouchMove?: EventHandler<TouchEvent>;
  onScroll?: EventHandler<Event>;
  onResize?: EventHandler<Event>;
  onLoad?: EventHandler<Event>;
  onError?: EventHandler<Event>;
}



// Component props type
export type ComponentProps<P = {}> = P & {
  children?: JSXChildren;
  key?: string | number;
};

// Function component type
export type FunctionComponent<P extends ComponentProps = ComponentProps> = (props: P) => JSXElement;

// Hydration State
let hydrationEnabled = false;
let hydrationMap: Map<string, Element> | null = null;

/**
 * Start hydration mode with a map of existing nodes
 */
export function startHydration(map: Map<string, Element>): void {
  hydrationEnabled = true;
  hydrationMap = map;
  // Reset counter to match server-side generation sequence
  clientNodeCounter = 0;
}

/**
 * End hydration mode
 */
export function endHydration(): void {
  hydrationEnabled = false;
  hydrationMap = null;
}

// Fragment symbol
export const FRAGMENT_TAG = Symbol("HyperFX.Fragment");

// Create a DOM element with reactive attributes
function createElement(tag: string, props?: Record<string, any> | null): HTMLElement {
  let element: HTMLElement;
  let claimed = false;

  // Hydration Logic: Try to claim existing node
  if (hydrationEnabled && !isSSREnvironment()) {
    const id = createClientId();
    const existing = hydrationMap?.get(id);

    // Check if existing node matches the requested tag
    if (existing && existing.tagName.toLowerCase() === tag.toLowerCase()) {
      element = existing as HTMLElement;
      claimed = true;
    } else {
      // Mismatch or not found - create new
      element = document.createElement(tag);
      element.setAttribute('data-hfxh', id);
    }
  } else {
    // Normal Creation
    element = document.createElement(tag);
    // Add unique node ID for client-side elements (only if not in SSR)
    if (!isSSREnvironment()) {
      element.setAttribute('data-hfxh', createClientId());
    }
  }

  // Apply all attributes using the unified attribute manager
  if (props) {
    attributeManager.applyAttributes(element, props);
  }

  return element;
}

// Create a text node with optional reactive content
function createTextNode(content: string | number | boolean | Signal<string | number | boolean>): Text {
  const textNode = document.createTextNode('');

  const updateText = () => {
    let text = '';
    if (isSignal(content)) {
      text = String(content());
    } else {
      text = String(content);
    }
    textNode.textContent = text;
  };

  updateText(); // Set initial content

  if (isSignal(content)) {
    content.subscribe(updateText);
  }

  return textNode;
}

// Render children to a parent element - implementation using flattening to support hydration cleanup


// Improved renderChildren that handles recursion by flattening
function renderChildrenFlattened(parent: HTMLElement | DocumentFragment, children: JSXChildren, appendedSet?: Set<Node>): void {
  const childArray = Array.isArray(children) ? children : [children];

  for (const child of childArray) {
    if (child == null || child === false || child === true) continue;

    if (isSignal(child)) {
      const value = child();
      if (value instanceof Node) {
        parent.appendChild(value);
        appendedSet?.add(value);
      } else {
        const textNode = createTextNode(child);
        parent.appendChild(textNode);
        appendedSet?.add(textNode);
      }
    } else if (typeof child === 'function') {
      try {
        const result = child();
        if (result instanceof Node) {
          parent.appendChild(result);
          appendedSet?.add(result);
        } else if (Array.isArray(result)) {
          // Recursion!
          renderChildrenFlattened(parent, result, appendedSet);
        } else {
          const textNode = document.createTextNode(String(result));
          parent.appendChild(textNode);
          appendedSet?.add(textNode);
        }
      } catch (error) {
        console.warn('Error rendering function child:', error);
      }
    } else if (typeof child === 'object' && child instanceof Node) {
      parent.appendChild(child);
      appendedSet?.add(child);
    } else {
      const textNode = document.createTextNode(String(child));
      parent.appendChild(textNode);
      appendedSet?.add(textNode);
    }
  }
}

// Main renderChildren entry point
function renderChildren(parent: HTMLElement | DocumentFragment, children: JSXChildren): void {
  if (!children) return;

  const isHydratingParent = hydrationEnabled &&
    (parent instanceof HTMLElement && parent.isConnected ||
      parent === document.body);

  const appendedNodes = isHydratingParent ? new Set<Node>() : undefined;
  const initialChildNodes = isHydratingParent ? Array.from(parent.childNodes) : null;

  // Use flattened renderer
  renderChildrenFlattened(parent, children, appendedNodes);

  // Cleanup
  if (isHydratingParent && initialChildNodes && appendedNodes) {
    for (const node of initialChildNodes) {
      if (!appendedNodes.has(node)) {
        node.remove();
      }
    }
  }
}

// JSX Factory Function - creates actual DOM elements

// Fragment component
export function Fragment(props: { children?: JSXChildren }): DocumentFragment {
  const fragment = document.createDocumentFragment();
  renderChildren(fragment, props.children);
  return fragment;
}

// JSX Factory Function - creates actual DOM elements
export function jsx(
  type: string | FunctionComponent<any> | typeof FRAGMENT_TAG,
  props: Record<string, any> | null,
  key?: string | number | null
): JSXElement {
  // Handle fragments
  if (type === FRAGMENT_TAG || type === Fragment) {
    const allChildren = props?.children;
    const fragment = document.createDocumentFragment();
    renderChildren(fragment, allChildren);
    return fragment;
  }

  // Handle function components
  if (typeof type === 'function') {
    // Wrap props in a proxy to auto-unwrap signals
    const proxyProps = new Proxy(props || {}, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (isSignal(value)) {
          return value();
        }
        return value;
      }
    });
    return type(proxyProps);
  }

  // Handle regular HTML elements
  const element = createElement(type as string, props);

  // Handle children
  if (props?.children) {
    renderChildren(element, props.children);
  }

  return element;
}

// jsxs is used for multiple children in automatic runtime, same logic for us
export const jsxs = jsx;
export const jsxDEV = jsx;

// Classic JSX Factory (for transform runtime)
export function createJSXElement(
  type: string | FunctionComponent<any> | typeof FRAGMENT_TAG,
  props: Record<string, any> | null,
  ...children: JSXChildren[]
): JSXElement {
  const allProps = { ...props, children: children.length > 0 ? children.flat() : props?.children };
  return jsx(type, allProps);
}

// Template literal helpers for reactive strings
export function template(strings: TemplateStringsArray, ...values: any[]): Signal<string> {
  return signal_createComputed(() => {
    let result = strings[0] || '';
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const resolvedValue = isSignal(value) ? value() : value;
      result += String(resolvedValue) + (strings[i + 1] || '');
    }
    return result;
  });
}

export function r<T>(fn: () => T): Signal<T> {
  return signal_createComputed(fn);
}

// Classic JSX Factory (for backwards compatibility)
export { createJSXElement as createElement };

/**
 * Reset client node counter (useful for testing)
 */
export function resetClientNodeCounter(): void {
  clientNodeCounter = 0;
}

// JSX namespace imported from elements.ts



