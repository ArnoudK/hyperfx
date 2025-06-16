import { VNode, VNodeChildren, FRAGMENT_TAG } from "../elem/elem";
import { type ElementAttributes, type AttributesForElement } from "../elem/attr";
import { ReactiveSignal, ComputedSignal, createComputed } from "../reactive/state";

/**
 * JSX Runtime for HyperFX
 * 
 * Features supported:
 * - Full TypeScript JSX support with type safety
 * - Reactive signals as props and children
 * - htmlFor attribute (maps to 'for')
 * - className attribute (maps to 'class')
 * - Key props for reconciliation
 * - Event handlers with proper typing
 * - Fragment support
 * - Function components
 * 
 * Example usage:
 * ```tsx
 * // Reactive children
 * <div>{count()}</div>
 * <span>{() => `Count: ${count()}`}</span>
 * 
 * // Reactive template literals (recommended approach)
 * <button aria-label={template`Clear all ${cartItemCount} items from cart`}>
 *   Clear Cart
 * </button>
 * 
 * // Alternative: Use r() helper for complex reactive expressions
 * <div title={r(() => `User ${userName()}: ${status()}`)}>Content</div>
 * 
 * // htmlFor attribute
 * <label htmlFor="input-id">Label</label>
 * 
 * // Reactive props
 * <div className={isActive() ? 'active' : 'inactive'}>Content</div>
 * 
 * // Key props
 * <div key="unique-id">Item</div>
 * ```
 */

// Core reactive prop type - allows any value to be reactive
export type ReactiveValue<T> = T | ReactiveSignal<T> | (() => T);

// Specific reactive types for common use cases
export type ReactiveString = ReactiveValue<string>;
export type ReactiveNumber = ReactiveValue<number>;
export type ReactiveBoolean = ReactiveValue<boolean>;

// Template literal support for reactive strings
export type ReactiveStringExpression =
  | string
  | ReactiveSignal<string>
  | (() => string); // Support for template literals and computed expressions (must be wrapped in function)

// Event handler type (should NOT be reactive)
export type EventHandler<E extends Event = Event> = (event: E) => void;

// Utility type to make attribute values reactive, but preserve event handlers and special props
type MakeReactive<T> = {
  [K in keyof T]: K extends `on${string}`
  ? T[K] // Keep event handlers as-is
  : K extends 'key'
  ? T[K] // Keep key as-is for performance
  : K extends 'ref'
  ? T[K] // Keep ref as-is
  : T[K] extends string | undefined
  ? ReactiveStringExpression | T[K] // Enhanced string support with template literals
  : T[K] extends number | undefined
  ? ReactiveNumber | T[K]
  : T[K] extends boolean | undefined
  ? ReactiveBoolean | T[K]
  : T[K] extends string | number | undefined
  ? ReactiveValue<string | number> | T[K]
  : ReactiveValue<T[K]> | T[K];
};

// Apply reactive transformation to HTML element attributes
export type ReactiveElementAttributes<K extends keyof HTMLElementTagNameMap> =
  MakeReactive<AttributesForElement<K>> & {
    // Add special JSX attributes that don't exist in standard HTML
    htmlFor?: ReactiveStringExpression; // Maps to 'for' attribute with template literal support
    className?: ReactiveStringExpression; // Maps to 'class' attribute with template literal support
    key?: string | number; // Key for reconciliation (not reactive for performance)
  };

// Type guards for reactive signals
function isReactiveSignal<T = any>(fn: unknown): fn is ReactiveSignal<T> {
  if (typeof fn !== 'function') return false;

  // Check for alien-signals function names (these are the most reliable)
  const signalNames = ['bound signalOper', 'bound computedOper', 'signalOper', 'computedOper'];
  if (signalNames.includes(fn.name)) {
    return true;
  }

  // Try to call the function to see if it's reactive
  try {
    const result = fn();
    // If it returns a primitive value, it's likely reactive
    const isPrimitive = typeof result === 'string' || typeof result === 'number' || typeof result === 'boolean';

    if (isPrimitive) {
      // Additional check: see if the function string contains signal calls
      const fnString = fn.toString();
      // Look for common reactive patterns:
      const hasReactivePattern =
        /\w+\(\)/.test(fnString) || // function calls ending with ()
        /signal|computed|createSignal|createComputed/.test(fnString) || // signal creation
        /\$\{[^}]*\(\)[^}]*\}/.test(fnString) || // template literal patterns with ${...()}
        /\$\{[^}]*signal|computed[^}]*\}/.test(fnString) || // template literals with signal/computed
        /`[^`]*\$\{[^}]*\}[^`]*`/.test(fnString); // template literal detection

      return hasReactivePattern;
    }

    return false;
  } catch {
    // If calling the function throws, but it looks like it might be reactive, 
    // check if it has reactive patterns in its string representation
    try {
      const fnString = fn.toString();
      return /signal|computed|createSignal|createComputed|\$\{[^}]*\(\)/.test(fnString);
    } catch {
      return false;
    }
  }
}

function isComputedSignal<T = any>(fn: unknown): fn is ComputedSignal<T> {
  if (typeof fn !== 'function') return false;
  return fn.name.includes('computedOper') || fn.name.includes('bound computedOper');
}

// Component types
export type ComponentProps<P = {}> = P & {
  children?: JSXChildren;
  key?: string | number; // Key for reconciliation
};

export type FunctionComponent<P = {}> = (props: ComponentProps<P>) => VNode;

// JSX children types
export type JSXChild =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | ReactiveSignal<string>
  | ReactiveSignal<number>
  | ReactiveSignal<boolean>
  | ReactiveSignal<VNode>
  | ReactiveSignal<VNode[]>;

export type JSXChildren = JSXChild | JSXChild[];

// Event handler types (these should NOT be reactive)
export interface EventHandlers {
  onClick?: EventHandler<MouseEvent>;
  onInput?: EventHandler<InputEvent>;
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


// JSX types for TypeScript
export namespace JSX {
  export interface Element extends VNode { }

  export interface IntrinsicElements {
    // HTML Elements with proper reactive attribute types
    a: ReactiveElementAttributes<'a'> & EventHandlers & { children?: JSXChildren };
    abbr: ReactiveElementAttributes<'abbr'> & EventHandlers & { children?: JSXChildren };
    address: ReactiveElementAttributes<'address'> & EventHandlers & { children?: JSXChildren };
    area: ReactiveElementAttributes<'area'> & EventHandlers;
    article: ReactiveElementAttributes<'article'> & EventHandlers & { children?: JSXChildren };
    aside: ReactiveElementAttributes<'aside'> & EventHandlers & { children?: JSXChildren };
    audio: ReactiveElementAttributes<'audio'> & EventHandlers & { children?: JSXChildren };
    b: ReactiveElementAttributes<'b'> & EventHandlers & { children?: JSXChildren };
    base: ReactiveElementAttributes<'base'> & EventHandlers;
    bdi: ReactiveElementAttributes<'bdi'> & EventHandlers & { children?: JSXChildren };
    bdo: ReactiveElementAttributes<'bdo'> & EventHandlers & { children?: JSXChildren };
    blockquote: ReactiveElementAttributes<'blockquote'> & EventHandlers & { children?: JSXChildren };
    body: ReactiveElementAttributes<'body'> & EventHandlers & { children?: JSXChildren };
    br: ReactiveElementAttributes<'br'> & EventHandlers;
    button: ReactiveElementAttributes<'button'> & EventHandlers & { children?: JSXChildren };
    canvas: ReactiveElementAttributes<'canvas'> & EventHandlers & { children?: JSXChildren };
    caption: ReactiveElementAttributes<'caption'> & EventHandlers & { children?: JSXChildren };
    cite: ReactiveElementAttributes<'cite'> & EventHandlers & { children?: JSXChildren };
    code: ReactiveElementAttributes<'code'> & EventHandlers & { children?: JSXChildren };
    col: ReactiveElementAttributes<'col'> & EventHandlers;
    colgroup: ReactiveElementAttributes<'colgroup'> & EventHandlers & { children?: JSXChildren };
    data: ReactiveElementAttributes<'data'> & EventHandlers & { children?: JSXChildren };
    datalist: ReactiveElementAttributes<'datalist'> & EventHandlers & { children?: JSXChildren };
    dd: ReactiveElementAttributes<'dd'> & EventHandlers & { children?: JSXChildren };
    del: ReactiveElementAttributes<'del'> & EventHandlers & { children?: JSXChildren };
    details: ReactiveElementAttributes<'details'> & EventHandlers & { children?: JSXChildren };
    dfn: ReactiveElementAttributes<'dfn'> & EventHandlers & { children?: JSXChildren };
    dialog: ReactiveElementAttributes<'dialog'> & EventHandlers & { children?: JSXChildren };
    div: ReactiveElementAttributes<'div'> & EventHandlers & { children?: JSXChildren };
    dl: ReactiveElementAttributes<'dl'> & EventHandlers & { children?: JSXChildren };
    dt: ReactiveElementAttributes<'dt'> & EventHandlers & { children?: JSXChildren };
    em: ReactiveElementAttributes<'em'> & EventHandlers & { children?: JSXChildren };
    embed: ReactiveElementAttributes<'embed'> & EventHandlers;
    fieldset: ReactiveElementAttributes<'fieldset'> & EventHandlers & { children?: JSXChildren };
    figcaption: ReactiveElementAttributes<'figcaption'> & EventHandlers & { children?: JSXChildren };
    figure: ReactiveElementAttributes<'figure'> & EventHandlers & { children?: JSXChildren };
    footer: ReactiveElementAttributes<'footer'> & EventHandlers & { children?: JSXChildren };
    form: ReactiveElementAttributes<'form'> & EventHandlers & { children?: JSXChildren };
    h1: ReactiveElementAttributes<'h1'> & EventHandlers & { children?: JSXChildren };
    h2: ReactiveElementAttributes<'h2'> & EventHandlers & { children?: JSXChildren };
    h3: ReactiveElementAttributes<'h3'> & EventHandlers & { children?: JSXChildren };
    h4: ReactiveElementAttributes<'h4'> & EventHandlers & { children?: JSXChildren };
    h5: ReactiveElementAttributes<'h5'> & EventHandlers & { children?: JSXChildren };
    h6: ReactiveElementAttributes<'h6'> & EventHandlers & { children?: JSXChildren };
    head: ReactiveElementAttributes<'head'> & EventHandlers & { children?: JSXChildren };
    header: ReactiveElementAttributes<'header'> & EventHandlers & { children?: JSXChildren };
    hgroup: ReactiveElementAttributes<'hgroup'> & EventHandlers & { children?: JSXChildren };
    hr: ReactiveElementAttributes<'hr'> & EventHandlers;
    html: ReactiveElementAttributes<'html'> & EventHandlers & { children?: JSXChildren };
    i: ReactiveElementAttributes<'i'> & EventHandlers & { children?: JSXChildren };
    iframe: ReactiveElementAttributes<'iframe'> & EventHandlers & { children?: JSXChildren };
    img: ReactiveElementAttributes<'img'> & EventHandlers;
    input: ReactiveElementAttributes<'input'> & EventHandlers;
    ins: ReactiveElementAttributes<'ins'> & EventHandlers & { children?: JSXChildren };
    kbd: ReactiveElementAttributes<'kbd'> & EventHandlers & { children?: JSXChildren };
    label: ReactiveElementAttributes<'label'> & EventHandlers & { children?: JSXChildren };
    legend: ReactiveElementAttributes<'legend'> & EventHandlers & { children?: JSXChildren };
    li: ReactiveElementAttributes<'li'> & EventHandlers & { children?: JSXChildren };
    link: ReactiveElementAttributes<'link'> & EventHandlers;
    main: ReactiveElementAttributes<'main'> & EventHandlers & { children?: JSXChildren };
    map: ReactiveElementAttributes<'map'> & EventHandlers & { children?: JSXChildren };
    mark: ReactiveElementAttributes<'mark'> & EventHandlers & { children?: JSXChildren };
    meta: ReactiveElementAttributes<'meta'> & EventHandlers;
    meter: ReactiveElementAttributes<'meter'> & EventHandlers & { children?: JSXChildren };
    nav: ReactiveElementAttributes<'nav'> & EventHandlers & { children?: JSXChildren };
    noscript: ReactiveElementAttributes<'noscript'> & EventHandlers & { children?: JSXChildren };
    object: ReactiveElementAttributes<'object'> & EventHandlers & { children?: JSXChildren };
    ol: ReactiveElementAttributes<'ol'> & EventHandlers & { children?: JSXChildren };
    optgroup: ReactiveElementAttributes<'optgroup'> & EventHandlers & { children?: JSXChildren };
    option: ReactiveElementAttributes<'option'> & EventHandlers & { children?: JSXChildren };
    output: ReactiveElementAttributes<'output'> & EventHandlers & { children?: JSXChildren };
    p: ReactiveElementAttributes<'p'> & EventHandlers & { children?: JSXChildren };
    picture: ReactiveElementAttributes<'picture'> & EventHandlers & { children?: JSXChildren };
    pre: ReactiveElementAttributes<'pre'> & EventHandlers & { children?: JSXChildren };
    progress: ReactiveElementAttributes<'progress'> & EventHandlers & { children?: JSXChildren };
    q: ReactiveElementAttributes<'q'> & EventHandlers & { children?: JSXChildren };
    rp: ReactiveElementAttributes<'rp'> & EventHandlers & { children?: JSXChildren };
    rt: ReactiveElementAttributes<'rt'> & EventHandlers & { children?: JSXChildren };
    ruby: ReactiveElementAttributes<'ruby'> & EventHandlers & { children?: JSXChildren };
    s: ReactiveElementAttributes<'s'> & EventHandlers & { children?: JSXChildren };
    samp: ReactiveElementAttributes<'samp'> & EventHandlers & { children?: JSXChildren };
    script: ReactiveElementAttributes<'script'> & EventHandlers & { children?: JSXChildren };
    section: ReactiveElementAttributes<'section'> & EventHandlers & { children?: JSXChildren };
    select: ReactiveElementAttributes<'select'> & EventHandlers & { children?: JSXChildren };
    small: ReactiveElementAttributes<'small'> & EventHandlers & { children?: JSXChildren };
    source: ReactiveElementAttributes<'source'> & EventHandlers;
    span: ReactiveElementAttributes<'span'> & EventHandlers & { children?: JSXChildren };
    strong: ReactiveElementAttributes<'strong'> & EventHandlers & { children?: JSXChildren };
    style: ReactiveElementAttributes<'style'> & EventHandlers & { children?: JSXChildren };
    sub: ReactiveElementAttributes<'sub'> & EventHandlers & { children?: JSXChildren };
    summary: ReactiveElementAttributes<'summary'> & EventHandlers & { children?: JSXChildren };
    sup: ReactiveElementAttributes<'sup'> & EventHandlers & { children?: JSXChildren };
    table: ReactiveElementAttributes<'table'> & EventHandlers & { children?: JSXChildren };
    tbody: ReactiveElementAttributes<'tbody'> & EventHandlers & { children?: JSXChildren };
    td: ReactiveElementAttributes<'td'> & EventHandlers & { children?: JSXChildren };
    template: ReactiveElementAttributes<'template'> & EventHandlers & { children?: JSXChildren };
    textarea: ReactiveElementAttributes<'textarea'> & EventHandlers & { children?: JSXChildren };
    tfoot: ReactiveElementAttributes<'tfoot'> & EventHandlers & { children?: JSXChildren };
    th: ReactiveElementAttributes<'th'> & EventHandlers & { children?: JSXChildren };
    thead: ReactiveElementAttributes<'thead'> & EventHandlers & { children?: JSXChildren };
    time: ReactiveElementAttributes<'time'> & EventHandlers & { children?: JSXChildren };
    title: ReactiveElementAttributes<'title'> & EventHandlers & { children?: JSXChildren };
    tr: ReactiveElementAttributes<'tr'> & EventHandlers & { children?: JSXChildren };
    track: ReactiveElementAttributes<'track'> & EventHandlers;
    u: ReactiveElementAttributes<'u'> & EventHandlers & { children?: JSXChildren };
    ul: ReactiveElementAttributes<'ul'> & EventHandlers & { children?: JSXChildren };
    var: ReactiveElementAttributes<'var'> & EventHandlers & { children?: JSXChildren };
    video: ReactiveElementAttributes<'video'> & EventHandlers & { children?: JSXChildren };
    wbr: ReactiveElementAttributes<'wbr'> & EventHandlers;
  }

  export interface ElementChildrenAttribute {
    children: JSXChildren;
  }
}

// Normalize props for JSX compatibility with better type safety
function normalizeProps<T extends Record<string, any>>(props: T | null | undefined): ElementAttributes & {
  __reactiveProps?: Record<string, ReactiveSignal<any>>;
  __key?: string | number;
} {
  if (!props) return {};

  const normalizedProps: Record<string, any> = {};
  const reactiveProps: Record<string, ReactiveSignal<any>> = {};

  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue; // Children are handled separately
    if (key === 'key') {
      // Extract key for special handling - it shouldn't be in props
      normalizedProps.__key = value;
      continue;
    }

    // Convert className to class
    if (key === 'className') {
      if (isReactiveSignal(value)) {
        reactiveProps.class = value;
        normalizedProps.class = value(); // Use current value for SSR
      } else {
        normalizedProps.class = value as string;
      }
    }
    // Convert htmlFor to for
    else if (key === 'htmlFor') {
      if (isReactiveSignal(value)) {
        reactiveProps.for = value;
        normalizedProps.for = value(); // Use current value for SSR
      } else {
        normalizedProps.for = value as string;
      }
    }
    // Handle reactive signals and expressions
    else if (typeof value === 'function') {
      // Event handlers start with 'on' - don't call them!
      if (key.startsWith('on') && typeof value === 'function') {
        normalizedProps[key] = value;
      } else if (isReactiveSignal(value)) {
        // Reactive signal - extract for special handling
        reactiveProps[key] = value;
        normalizedProps[key] = value(); // Use current value for SSR
      } else {
        // Regular function - keep as is
        normalizedProps[key] = value;
        console.log('🔍 Regular function prop:', key, 'name:', value.name);
      }
    }
    else {
      normalizedProps[key] = value;
    }
  }

  // If we have reactive props, add them to the VNode
  if (Object.keys(reactiveProps).length > 0) {
    normalizedProps.__reactiveProps = reactiveProps;
  }

  return normalizedProps as ElementAttributes & {
    __reactiveProps?: Record<string, ReactiveSignal<any>>;
    __key?: string | number;
  };
}

// Normalize children to flatten arrays and handle reactive signals with better type safety
function normalizeChildren(children: JSXChildren): (VNode | string | ReactiveSignal<any>)[] {
  if (!children) return [];

  const normalizedChildren: (VNode | string | ReactiveSignal<any>)[] = [];

  const flatten = (child: JSXChild): void => {
    if (Array.isArray(child)) {
      child.forEach(flatten);
    } else if (child != null && child !== false && child !== true && child !== undefined) {
      if (typeof child === 'object' && 'tag' in child) {
        // It's a VNode
        normalizedChildren.push(child as VNode);
      } else if (typeof child === 'function') {
        if (isReactiveSignal(child)) {
          // This is a reactive signal - preserve it as a function
          // The signal could return string, number, boolean, VNode, or VNode[]
          normalizedChildren.push(child);
        } else {
          // Try to evaluate the function to see what it returns
          try {
            const result = (child as () => any)();
            flatten(result);
          } catch (error) {
            // If it throws, convert to string for safety
            normalizedChildren.push(String(child));
          }
        }
      } else {
        // Convert to string (handles numbers, booleans, etc.)
        normalizedChildren.push(String(child));
      }
    }
  };

  if (Array.isArray(children)) {
    children.forEach(flatten);
  } else {
    flatten(children);
  }

  // Process reactive text fragments to handle mixed content properly
  return processReactiveTextFragments(normalizedChildren);
}

// Create a special reactive container for array expressions with better types
function createReactiveArrayContainer(reactiveArrayFn: ReactiveSignal<VNode[]>): VNode {
  const containerId = `reactive-array-${++reactiveIdCounter}`;

  return {
    tag: 'div',
    props: {
      'data-reactive-array': 'true',
      'data-reactive-id': containerId,
      style: 'display: contents;' // Don't affect layout
    },
    children: [],
    // Store the reactive function for hydration
    __reactiveArrayFn: reactiveArrayFn,
  } as VNode & { __reactiveArrayFn: ReactiveSignal<VNode[]> };
}

// Create a reactive container for reactive expressions with better types
function createReactiveExpressionContainer(reactiveExprFn: ReactiveSignal<any>): VNode {
  const containerId = `reactive-expr-${++reactiveIdCounter}`;

  // Evaluate the expression to get initial content
  let initialContent: (VNode | string)[] = [];
  try {
    const result = reactiveExprFn();
    if (Array.isArray(result)) {
      initialContent = result;
    } else {
      initialContent = [String(result)];
    }
  } catch (error) {
    console.warn('Failed to evaluate reactive expression:', error);
    initialContent = [];
  }

  return {
    tag: 'div',
    props: {
      'data-reactive-expr': 'true',
      'data-reactive-id': containerId,
      style: 'display: contents;' // Don't affect layout
    },
    children: initialContent,
    // Store the reactive function for hydration
    __reactiveExprFn: reactiveExprFn,
  } as VNode & { __reactiveExprFn: ReactiveSignal<any> };
}

// Global counter for deterministic IDs
let reactiveIdCounter = 0;

// Create a reactive text marker for inline reactive content with better types
function createReactiveTextMarker(reactiveExprFn: ReactiveSignal<any>): VNode {
  const markerId = `reactive-text-${++reactiveIdCounter}`;

  // Evaluate the expression to get initial content for SSR
  let initialContent = '';
  try {
    const result = reactiveExprFn();
    initialContent = String(result);
  } catch (error) {
    console.warn('Failed to evaluate reactive expression:', error);
    initialContent = '';
  }

  return {
    tag: 'span',
    props: {
      'data-reactive-text': 'true',
      'data-reactive-id': markerId,
      style: 'display: contents;' // Don't affect layout
    },
    children: [initialContent],
    // Store the reactive function for hydration
    __reactiveTextFn: reactiveExprFn,
  } as VNode & { __reactiveTextFn: ReactiveSignal<any> };
}

// Helper to handle reactive conditional rendering (like condition && JSX) with better types
function createReactiveConditional(conditionalExprFn: ReactiveSignal<any>): VNode {
  const containerId = `reactive-conditional-${++reactiveIdCounter}`;

  // Evaluate the expression to get initial content for SSR
  let initialContent: VNode[] = [];
  try {
    const result = conditionalExprFn();
    if (result && typeof result === 'object' && 'tag' in result) {
      // It's a VNode
      initialContent = [result];
    } else if (Array.isArray(result)) {
      initialContent = result.filter(item => item && typeof item === 'object' && 'tag' in item);
    }
    // If result is false/null/undefined, initialContent stays empty
  } catch (error) {
    console.warn('Failed to evaluate reactive conditional:', error);
    initialContent = [];
  }

  return {
    tag: 'div',
    props: {
      'data-reactive-conditional': 'true',
      'data-reactive-id': containerId,
      style: 'display: contents;' // Don't affect layout
    },
    children: initialContent,
    // Store the reactive function for hydration
    __reactiveConditionalFn: conditionalExprFn,
  } as VNode & { __reactiveConditionalFn: ReactiveSignal<any> };
}

// Process children to detect and handle mixed reactive text with better types
function processReactiveTextFragments(
  children: (VNode | string | ReactiveSignal<any>)[]
): (VNode | string | ReactiveSignal<any>)[] {
  const processedChildren: (VNode | string | ReactiveSignal<any>)[] = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (!child) {
      continue;
    }

    // Check if this is a function (potential reactive signal)
    if (typeof child === 'function') {
      if (isReactiveSignal(child)) {
        // Check if this is in a mixed text context by looking at siblings
        const hasStringSiblings = children.some((sibling, index) =>
          index !== i && typeof sibling === 'string' && sibling.trim().length > 0
        );

        if (hasStringSiblings) {
          // This is mixed text context - create reactive text marker
          processedChildren.push(createReactiveTextMarker(child));
        } else {
          // This is standalone reactive content - pass through as-is for normal processing
          processedChildren.push(child);
        }
      } else {
        // Regular function - this shouldn't happen in normalized children
        processedChildren.push(child as ReactiveSignal<any>);
      }
    } else {
      // Regular child (string or VNode)
      processedChildren.push(child);
    }
  }

  return processedChildren;
}

// Template literal helpers for reactive strings
/**
 * Creates a reactive template literal that automatically updates when any signals change
 * Usage: 
 * @example template`Clear all ${cartItemCount()} items from cart`
 */
export function template(strings: TemplateStringsArray, ...values: any[]): ReactiveSignal<string> {
  return createComputed(() => {
    let result = strings[0] || '';
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      // If the value is a reactive signal, call it to get the current value
      const resolvedValue = typeof value === 'function' && isReactiveSignal(value) ? value() : value;
      result += String(resolvedValue) + (strings[i + 1] || '');
    }
    return result;
  }) as ReactiveSignal<string>;
}

/**
 * Alternative syntax for reactive template literals using a function wrapper
 * Usage: r(() => `Clear all ${cartItemCount()} items from cart`)
 */
export function r<T>(fn: () => T): ReactiveSignal<T> {
  return createComputed(fn);
}

// JSX Factory Function - used by TypeScript/Babel to transform JSX with improved types
export function jsx<K extends keyof JSX.IntrinsicElements>(
  type: K,
  props: JSX.IntrinsicElements[K],
  key?: string | number
): VNode;
export function jsx<P extends ComponentProps>(
  type: FunctionComponent<P>,
  props: P,
  key?: string | number
): VNode;
export function jsx(
  type: typeof FRAGMENT_TAG,
  props: { children?: JSXChildren },
  key?: string | number
): VNode;
export function jsx(
  type: string | typeof FRAGMENT_TAG | FunctionComponent<any>,
  props: any,
  key?: string | number
): VNode {
  // Handle fragments
  if (type === FRAGMENT_TAG || type === Fragment) {
    return {
      tag: FRAGMENT_TAG,
      props: {},
      children: normalizeChildren(props?.children),
      key
    };
  }

  // Handle function components
  if (typeof type === 'function') {
    // Extract key from props if it exists
    const { key: propsKey, ...componentProps } = props || {};
    const resultVNode = type(componentProps);

    // Apply key to the result if provided
    if (key !== undefined || propsKey !== undefined) {
      resultVNode.key = key ?? propsKey;
    }

    return resultVNode;
  }

  const normalizedProps = normalizeProps(props);
  const children = normalizeChildren(props?.children);

  // Extract key and reactive props if they exist
  const extractedKey = normalizedProps.__key;
  const reactiveProps = normalizedProps.__reactiveProps;
  delete normalizedProps.__key;
  delete normalizedProps.__reactiveProps;

  const vnode: VNode = {
    tag: type as string,
    props: normalizedProps,
    children,
    key: key ?? extractedKey // Use explicit key parameter or extracted key from props
  };

  // Add reactive props if they exist
  if (reactiveProps) {
    (vnode as any).reactiveProps = reactiveProps;
  }

  return vnode;
}

// JSX Factory for fragments with better types
export function Fragment(props: { children?: JSXChildren }): VNode {
  return {
    tag: FRAGMENT_TAG,
    props: {},
    children: normalizeChildren(props?.children)
  };
}

// Classic JSX Factory (for backwards compatibility) with looser typing for dynamic usage
export function createElement(
  type: string | typeof FRAGMENT_TAG | FunctionComponent<any>,
  props: any,
  ...children: any[]
): VNode {
  const allChildren = children.length > 0 ? children : props?.children;

  // Use a type assertion since createElement is more dynamic than jsx
  return jsx(type as any, { ...props, children: allChildren });
}

// Export for JSX automatic runtime
export const jsxs = jsx;
export const jsxDEV = jsx;
