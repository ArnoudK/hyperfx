import { VNode, VNodeChildren, FRAGMENT_TAG } from "../elem/elem";
import { type ElementAttributes } from "../elem/attr";
import { ReactiveSignal } from "../reactive/state";

// JSX types for TypeScript
export namespace JSX {
  export interface Element extends VNode {}
  
  export interface IntrinsicElements {
    [elemName: string]: any;
    
    // HTML Elements
    a: any;
    abbr: any;
    address: any;
    area: any;
    article: any;
    aside: any;
    audio: any;
    b: any;
    base: any;
    bdi: any;
    bdo: any;
    blockquote: any;
    body: any;
    br: any;
    button: any;
    canvas: any;
    caption: any;
    cite: any;
    code: any;
    col: any;
    colgroup: any;
    data: any;
    datalist: any;
    dd: any;
    del: any;
    details: any;
    dfn: any;
    dialog: any;
    div: any;
    dl: any;
    dt: any;
    em: any;
    embed: any;
    fieldset: any;
    figcaption: any;
    figure: any;
    footer: any;
    form: any;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    h6: any;
    head: any;
    header: any;
    hgroup: any;
    hr: any;
    html: any;
    i: any;
    iframe: any;
    img: any;
    input: any;
    ins: any;
    kbd: any;
    label: any;
    legend: any;
    li: any;
    link: any;
    main: any;
    map: any;
    mark: any;
    meta: any;
    meter: any;
    nav: any;
    noscript: any;
    object: any;
    ol: any;
    optgroup: any;
    option: any;
    output: any;
    p: any;
    picture: any;
    pre: any;
    progress: any;
    q: any;
    rp: any;
    rt: any;
    ruby: any;
    s: any;
    samp: any;
    script: any;
    section: any;
    select: any;
    small: any;
    source: any;
    span: any;
    strong: any;
    style: any;
    sub: any;
    summary: any;
    sup: any;
    table: any;
    tbody: any;
    td: any;
    template: any;
    textarea: any;
    tfoot: any;
    th: any;
    thead: any;
    time: any;
    title: any;
    tr: any;
    track: any;
    u: any;
    ul: any;
    var: any;
    video: any;
    wbr: any;
  }
  
  export interface ElementChildrenAttribute {
    children: {};
  }
}

// Normalize props for JSX compatibility
function normalizeProps(props: any): ElementAttributes {
  if (!props) return {};
  
  const normalizedProps: any = {}; // Use any to avoid index signature issues
  const reactiveProps: any = {};
  
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue; // Children are handled separately
    
    // Convert className to class
    if (key === 'className') {
      normalizedProps.class = value as string;
    }
    // Convert htmlFor to for
    else if (key === 'htmlFor') {
      normalizedProps.for = value as string;
    }
    // Handle reactive signals and expressions
    else if (typeof value === 'function') {
      // Event handlers start with 'on' - don't call them!
      if (key.startsWith('on')) {
        normalizedProps[key] = value;
      } else {
        // Non-event function - check if it's a reactive signal
        try {
          const testValue = value();
          // If the function can be called, it might be a reactive signal
          // Store it as a reactive prop for hydration
          reactiveProps[key] = value;
          normalizedProps[key] = testValue; // Use current value for SSR
        } catch {
          // If it throws, treat as a regular function
          normalizedProps[key] = value;
        }
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
  
  return normalizedProps as ElementAttributes;
}

// Normalize children to flatten arrays and handle reactive signals
function normalizeChildren(children: any): (VNode | string | ReactiveSignal<string>)[] {
  if (!children) return [];
  
  const normalizedChildren: (VNode | string | (() => any))[] = [];
  
  const flatten = (child: any) => {
    if (Array.isArray(child)) {
      child.forEach(flatten);
    } else if (child != null && child !== false && child !== true && child !== undefined) {
      if (typeof child === 'object' && child.tag) {
        // It's a VNode
        normalizedChildren.push(child);
      } else if (typeof child === 'function') {
        // Check if it's a reactive expression
        if ((child as any).__isReactiveExpression) {
          // It's a reactive expression - create a special container
          const reactiveContainer = createReactiveExpressionContainer(child);
          normalizedChildren.push(reactiveContainer);
        } else {
          // Try to evaluate the function to see what it returns
          try {
            const result = child();
            // Check if the original function name suggests it's a reactive signal
            if (child.name === 'bound signalOper' || child.name === 'bound computedOper' || 
                child.name === 'signalOper' || child.name === 'computedOper') {
              // This is a reactive signal - always preserve it as a function
              normalizedChildren.push(child);
            } else if (result === false || result === null || result === undefined) {
              // This might be a reactive conditional - store the function for processing
              normalizedChildren.push(child);
            } else if (typeof result === 'object' && result.tag) {
              // Regular function that returns a VNode
              flatten(result);
            } else {
              // Regular function result
              flatten(result);
            }
          } catch (error) {
            // If it throws, pass through for later processing
            normalizedChildren.push(child);
          }
        }
      } else {
        // Convert to string
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
  return processReactiveTextFragments(normalizedChildren) as (VNode | string | ReactiveSignal<string>)[];
}

// Create a special reactive container for array expressions
function createReactiveArrayContainer(reactiveArrayFn: () => VNode[]): VNode {
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
  } as any;
}

// Create a reactive container for reactive expressions
function createReactiveExpressionContainer(reactiveExprFn: () => any): VNode {
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
  } as any;
}

// Global counter for deterministic IDs
let reactiveIdCounter = 0;

// Create a reactive text marker for inline reactive content
function createReactiveTextMarker(reactiveExprFn: () => any): VNode {
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
  } as any;
}

// Helper to handle reactive conditional rendering (like condition && JSX)
function createReactiveConditional(conditionalExprFn: () => any): VNode {
  const containerId = `reactive-conditional-${++reactiveIdCounter}`;
  
  // Evaluate the expression to get initial content for SSR
  let initialContent: VNode[] = [];
  try {
    const result = conditionalExprFn();
    if (result && typeof result === 'object' && result.tag) {
      // It's a VNode
      initialContent = [result];
    } else if (Array.isArray(result)) {
      initialContent = result.filter(item => item && typeof item === 'object' && item.tag);
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
  } as any;
}

// Process children to detect and handle mixed reactive text
function processReactiveTextFragments(children: (VNode | string | (() => any))[]): (VNode | string | (() => any))[] {
  const processedChildren: (VNode | string | (() => any))[] = [];
  
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    
    if (!child) {
      continue;
    }
    
    // Check if this is a function (potential reactive signal)
    if (typeof child === 'function') {
      // Check if it's an alien-signals function by name OR if it might be a reactive function
      const isSignal = child.name === 'bound signalOper' || child.name === 'bound computedOper' || child.name === 'signalOper' || child.name === 'computedOper';
      
      // Also check if it's a function that might be reactive by trying to call it
      let isReactiveFunction = false;
      if (!isSignal) {
        try {
          const testValue = child();
          // If it returns a primitive value, it might be a reactive function
          isReactiveFunction = typeof testValue === 'string' || typeof testValue === 'number' || typeof testValue === 'boolean';
        } catch {
          // If it throws, it's probably not a reactive content function
          isReactiveFunction = false;
        }
      }
      
      if (isSignal || isReactiveFunction) {
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
        // Regular function
        processedChildren.push(child);
      }
    } else {
      // Regular child (string or VNode)
      processedChildren.push(child);
    }
  }
  
  return processedChildren;
}

// JSX Factory Function - used by TypeScript/Babel to transform JSX
export function jsx(
  type: string | typeof FRAGMENT_TAG | Function,
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
    // Call the component function with props
    return type(props);
  }
  
  const normalizedProps = normalizeProps(props);
  const children = normalizeChildren(props?.children);
  
  // Extract reactive props if they exist
  const reactiveProps = (normalizedProps as any).__reactiveProps;
  delete (normalizedProps as any).__reactiveProps;
  
  const vnode: VNode = {
    tag: type as string,
    props: normalizedProps,
    children,
    key
  };
  
  // Add reactive props if they exist
  if (reactiveProps) {
    (vnode as any).reactiveProps = reactiveProps;
  }
  
  return vnode;
}

// JSX Factory for fragments
export function Fragment(props: { children?: any }): VNode {
  return {
    tag: FRAGMENT_TAG,
    props: {},
    children: normalizeChildren(props?.children)
  };
}

// Classic JSX Factory (for backwards compatibility)
export function createElement(
  type: string | typeof FRAGMENT_TAG | Function,
  props: any,
  ...children: any[]
): VNode {
  const allChildren = children.length > 0 ? children : props?.children;
  
  return jsx(type, { ...props, children: allChildren });
}

// Export for JSX automatic runtime
export const jsxs = jsx;
export const jsxDEV = jsx;
