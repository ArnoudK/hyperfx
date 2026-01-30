import { readdir } from "node:fs/promises";
import { join } from "node:path";
let isTracking = false;
const accessedSignals = /* @__PURE__ */ new Set();
const globalSignalRegistry = /* @__PURE__ */ new Map();
let isSSRMode = false;
function enableSSRMode() {
  if (!isSSRMode) {
    isSSRMode = true;
    globalSignalRegistry.clear();
  }
}
function disableSSRMode() {
  isSSRMode = false;
}
function getRegisteredSignals() {
  return globalSignalRegistry;
}
function registerSignal(key, signal) {
  globalSignalRegistry.set(key, signal);
}
class SignalImpl {
  constructor(initialValue) {
    this.subscribers = /* @__PURE__ */ new Set();
    this._value = initialValue;
  }
  /**
   * Get the current signal value
   */
  get() {
    if (isTracking) {
      accessedSignals.add(this.callableSignal);
    }
    return this._value;
  }
  /**
   * Set a new signal value and notify subscribers
   */
  set(newValue) {
    if (Object.is(this._value, newValue)) {
      return newValue;
    }
    this._value = newValue;
    const subscribersToNotify = Array.from(this.subscribers);
    subscribersToNotify.forEach((callback) => {
      try {
        callback(newValue);
      } catch (error) {
        console.error("Signal subscriber error:", error);
      }
    });
    return newValue;
  }
  /**
   * Subscribe to signal changes
   * Returns an unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
  /**
   * Get current value and subscribe to changes in one call
   * Useful for reactive contexts
   */
  peek() {
    return this._value;
  }
  /**
   * Update value using a function
   */
  update(updater) {
    return this.set(updater(this._value));
  }
  /**
   * Get number of active subscribers (for debugging)
   */
  get subscriberCount() {
    return this.subscribers.size;
  }
}
function createSignal(initialValue, options) {
  const signal = new SignalImpl(initialValue);
  const callableSignal = Object.assign((value) => {
    if (value !== void 0) {
      return signal.set(value);
    }
    return signal.get();
  }, {
    get: () => signal.get(),
    set: (value) => signal.set(value),
    subscribe: (callback) => signal.subscribe(callback),
    peek: () => signal.peek(),
    update: (updater) => signal.update(updater),
    key: options?.key
  });
  Object.defineProperty(callableSignal, "subscriberCount", {
    get() {
      return signal.subscriberCount;
    },
    enumerable: true,
    configurable: true
  });
  signal.callableSignal = callableSignal;
  if (options?.key) {
    if (globalSignalRegistry.has(options.key)) {
      console.warn(`Signal with key "${options.key}" already exists. Using existing signal.`);
      return globalSignalRegistry.get(options.key);
    }
    registerSignal(options.key, callableSignal);
  }
  return callableSignal;
}
function createComputed$1(computeFn) {
  const oldTracking = isTracking;
  isTracking = true;
  accessedSignals.clear();
  let initialValue;
  try {
    initialValue = computeFn();
  } finally {
    isTracking = oldTracking;
  }
  const signal = createSignal(initialValue);
  const deps = Array.from(accessedSignals);
  accessedSignals.clear();
  const originalSet = signal.set;
  signal.set = () => {
    throw new Error("Cannot set computed signal directly. Computed signals are read-only.");
  };
  const unsubscribers = deps.map((dep) => dep.subscribe(() => {
    const newValue = computeFn();
    originalSet(newValue);
  }));
  const computedSignal = Object.assign(signal, {
    destroy: () => {
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers.length = 0;
    }
  });
  return computedSignal;
}
function createEffect$1(effectFn) {
  let cleanup;
  let unsubscribers = [];
  let isDisposed = false;
  let isRunning = false;
  let pendingRun = false;
  const runEffect = () => {
    if (isDisposed)
      return;
    if (isRunning) {
      pendingRun = true;
      return;
    }
    let iterations = 0;
    const MAX_ITERATIONS = 100;
    while (iterations < MAX_ITERATIONS) {
      pendingRun = false;
      unsubscribers.forEach((unsub) => unsub());
      unsubscribers = [];
      if (typeof cleanup === "function") {
        cleanup();
        cleanup = void 0;
      }
      const oldTracking = isTracking;
      isTracking = true;
      accessedSignals.clear();
      try {
        cleanup = effectFn();
      } finally {
        isTracking = oldTracking;
      }
      const dependencies = Array.from(accessedSignals);
      accessedSignals.clear();
      unsubscribers = dependencies.map((dep) => dep.subscribe(() => {
        runEffect();
      }));
      if (!pendingRun) {
        break;
      }
      iterations++;
    }
    if (iterations >= MAX_ITERATIONS) {
      console.error("createEffect: Maximum iterations reached - possible infinite loop in effect");
      pendingRun = false;
    }
    isRunning = false;
  };
  runEffect();
  return () => {
    isDisposed = true;
    unsubscribers.forEach((unsub) => {
      unsub();
    });
    if (typeof cleanup === "function") {
      cleanup();
    }
  };
}
function isSignal(value) {
  return typeof value === "function" && "subscribe" in value && "get" in value && "set" in value;
}
function renderChildrenFlattened(parent, children, appendedSet) {
  const childArray = Array.isArray(children) ? children : [children];
  for (const child of childArray) {
    if (child == null || child === false || child === true)
      continue;
    if (isSignal(child)) {
      const value = child();
      if (value instanceof Node) {
        parent.appendChild(value);
      } else {
        const textNode = createTextNode(child);
        parent.appendChild(textNode);
      }
    } else if (typeof child === "function") {
      try {
        const result = child();
        if (result instanceof Node) {
          parent.appendChild(result);
          appendedSet?.add(result);
        } else if (Array.isArray(result)) {
          renderChildrenFlattened(parent, result, appendedSet);
        } else {
          const textNode = document.createTextNode(String(result));
          parent.appendChild(textNode);
          appendedSet?.add(textNode);
        }
      } catch (error) {
        console.warn("Error rendering function child:", error);
      }
    } else if (typeof child === "object" && child instanceof Node) {
      parent.appendChild(child);
    } else {
      const textNode = document.createTextNode(String(child));
      parent.appendChild(textNode);
    }
  }
}
function renderChildren(parent, children) {
  if (!children)
    return;
  const appendedNodes = void 0;
  renderChildrenFlattened(parent, children, appendedNodes);
}
const FRAGMENT_TAG = /* @__PURE__ */ Symbol("HyperFX.Fragment");
function createTextNode(content) {
  const textNode = document.createTextNode("");
  const updateText = () => {
    let text = "";
    if (isSignal(content)) {
      text = String(content());
    } else {
      text = String(content);
    }
    textNode.textContent = text;
  };
  updateText();
  if (isSignal(content)) {
    content.subscribe(updateText);
  }
  return textNode;
}
function Fragment(props) {
  const fragment = document.createDocumentFragment();
  renderChildren(fragment, props.children);
  return fragment;
}
function createVirtualElement(tag, props, children) {
  return {
    type: "element",
    tag,
    props: props || {},
    children
  };
}
function createVirtualText(content) {
  return {
    type: "text",
    content
  };
}
function createVirtualFragment(children) {
  return {
    type: "fragment",
    children
  };
}
function createVirtualComment(content) {
  return {
    type: "comment",
    content
  };
}
function renderChildrenToVirtual(children) {
  if (children == null || children === false || children === true) {
    return [];
  }
  if (Array.isArray(children)) {
    return children.flatMap(renderChildrenToVirtual);
  }
  if (isSignal(children)) {
    const value = children();
    return renderChildrenToVirtual(value);
  }
  if (typeof children === "object" && children !== null && "type" in children && (children.type === "element" || children.type === "text" || children.type === "fragment" || children.type === "comment")) {
    return [children];
  }
  if (typeof children === "string" || typeof children === "number") {
    return [createVirtualText(String(children))];
  }
  if (typeof children === "object") {
    return [];
  }
  return [];
}
function jsx(type, props, _key) {
  if (type === FRAGMENT_TAG || type === Fragment) {
    const allChildren = props?.children;
    const children2 = renderChildrenToVirtual(allChildren);
    return createVirtualFragment(children2);
  }
  if (typeof type === "function") {
    const proxyProps = new Proxy(props || {}, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (isSignal(value)) {
          return value();
        }
        return value;
      }
    });
    const result = type(proxyProps);
    if (result == null || typeof result === "boolean") {
      return null;
    }
    return result;
  }
  const children = props?.children ? renderChildrenToVirtual(props.children) : [];
  const unwrappedProps = {};
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key === "children") {
        continue;
      }
      if (isSignal(value)) {
        unwrappedProps[key] = value();
      } else {
        unwrappedProps[key] = value;
      }
    }
  }
  return createVirtualElement(type, unwrappedProps, children);
}
const jsxs = jsx;
function createComputed(computation) {
  return createComputed$1(computation);
}
function createEffect(effectFn) {
  return createEffect$1(effectFn);
}
const contextStacks = /* @__PURE__ */ new Map();
function createContext(defaultValue) {
  const id = /* @__PURE__ */ Symbol("Context");
  const Provider = (props) => {
    let stack = contextStacks.get(id);
    if (!stack) {
      stack = [];
      contextStacks.set(id, stack);
    }
    stack.push(props.value);
    let children;
    try {
      if (typeof props.children === "function") {
        children = props.children();
      } else {
        children = props.children;
      }
    } finally {
      if (typeof props.children === "function") {
        stack.pop();
      }
    }
    if (Array.isArray(children)) {
      const fragment = document.createDocumentFragment();
      children.forEach((child) => {
        if (child instanceof Node)
          fragment.appendChild(child);
      });
      return fragment;
    }
    return children;
  };
  return {
    id,
    defaultValue,
    Provider
  };
}
function useContext(context) {
  const stack = contextStacks.get(context.id);
  if (stack && stack.length > 0) {
    return stack[stack.length - 1];
  }
  return context.defaultValue;
}
function isSSR() {
  return typeof document === "undefined";
}
function createRouterFragment() {
  if (isSSR()) {
    return createVirtualFragment([]);
  }
  return document.createDocumentFragment();
}
function createRouterComment(text) {
  if (isSSR()) {
    return createVirtualComment(text);
  }
  return document.createComment(text);
}
function createRouterText(text) {
  if (isSSR()) {
    return createVirtualText(text);
  }
  return document.createTextNode(text);
}
function removeChild(parent, child) {
  if (isSSR()) {
    const virtualParent = parent;
    const virtualChild = child;
    if (virtualParent.children) {
      const index = virtualParent.children.indexOf(virtualChild);
      if (index !== -1) {
        virtualParent.children.splice(index, 1);
      }
    }
  } else {
    parent.removeChild(child);
  }
}
function createSafeElement(tag) {
  if (typeof document !== "undefined") {
    return document.createElement(tag);
  }
  const mock = {
    tagName: tag.toUpperCase(),
    children: [],
    childNodes: [],
    className: "",
    href: "",
    textContent: "",
    attributes: [],
    classList: {
      add: () => {
      },
      remove: () => {
      }
    },
    style: {},
    setAttribute: () => {
    },
    getAttribute: () => null,
    addEventListener: () => {
    },
    removeEventListener: () => {
    },
    appendChild: function(child) {
      this.children.push(child);
      this.childNodes.push(child);
      return child;
    },
    removeChild: function(child) {
      const idx = this.children.indexOf(child);
      if (idx > -1)
        this.children.splice(idx, 1);
      const idx2 = this.childNodes.indexOf(child);
      if (idx2 > -1)
        this.childNodes.splice(idx2, 1);
    },
    replaceChild: function(newChild, oldChild) {
      const idx = this.children.indexOf(oldChild);
      if (idx > -1)
        this.children[idx] = newChild;
      const idx2 = this.childNodes.indexOf(oldChild);
      if (idx2 > -1)
        this.childNodes[idx2] = newChild;
    }
  };
  return mock;
}
const RouterContext = createContext(null);
function Router(props) {
  const parentContext = useContext(RouterContext);
  if (parentContext) {
    console.warn("Router: Nested routers are not fully supported yet");
  }
  const getInitialPath = () => {
    if (props.initialPath) {
      return props.initialPath;
    }
    if (typeof window !== "undefined" && window.location) {
      return window.location.pathname + window.location.search;
    }
    return "/";
  };
  const currentPath = createSignal(getInitialPath());
  const historyStack = createSignal([currentPath()]);
  const historyIndex = createSignal(0);
  const isBrowser = typeof window !== "undefined" && typeof window.addEventListener === "function" && typeof window.history !== "undefined";
  if (isBrowser) {
    createEffect(() => {
      const handlePopState = () => {
        const newPath = window.location.pathname + window.location.search || "/";
        currentPath(newPath);
        const newStack = [...historyStack()];
        newStack[historyIndex()] = newPath;
        historyStack(newStack);
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    });
  }
  const navigate = (path, options = {}) => {
    if (isBrowser) {
      if (options.replace) {
        window.history.replaceState({}, "", path);
        const newStack = [...historyStack()];
        newStack[historyIndex()] = path;
        historyStack(newStack);
      } else {
        window.history.pushState({}, "", path);
        const newStack = [...historyStack().slice(0, historyIndex() + 1), path];
        historyStack(newStack);
        historyIndex(historyIndex() + 1);
      }
    }
    currentPath(path);
  };
  const back = () => {
    if (isBrowser && historyIndex() > 0) {
      const newIndex = historyIndex() - 1;
      historyIndex(newIndex);
      const path = historyStack()[newIndex] || "/";
      window.history.back();
      currentPath(path);
    }
  };
  const forward = () => {
    if (isBrowser && historyIndex() < historyStack().length - 1) {
      const newIndex = historyIndex() + 1;
      historyIndex(newIndex);
      const path = historyStack()[newIndex] || "/";
      window.history.forward();
      currentPath(path);
    }
  };
  const context = {
    currentPath,
    navigate,
    back,
    forward
  };
  const result = RouterContext.Provider({
    value: context,
    children: () => {
      if (typeof props.children === "function") {
        return props.children();
      }
      return props.children;
    }
  });
  return result;
}
function Route(props) {
  const fragment = createRouterFragment();
  const startMarker = createRouterComment(`Route start: ${props.path}`);
  const endMarker = createRouterComment(`Route end: ${props.path}`);
  if (isSSR()) {
    const virtualFragment = fragment;
    virtualFragment.children.push(startMarker, endMarker);
  } else {
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
  }
  let renderedNodes = [];
  let wasMatched = false;
  const { path, component, children, exact, ...restProps } = props;
  let context = null;
  const renderRouteContent = () => {
    if (!context) {
      context = useContext(RouterContext);
    }
    if (!context)
      return;
    const currentPath = context.currentPath;
    const currentPathValue = currentPath();
    const pathWithoutQuery = currentPathValue.split("?")[0];
    const matches = (exact !== void 0 ? exact : false) ? pathWithoutQuery === path : pathWithoutQuery.startsWith(path);
    if (matches === wasMatched && renderedNodes.length > 0) {
      return;
    }
    wasMatched = matches;
    let currentParent;
    if (isSSR()) {
      currentParent = fragment;
    } else {
      currentParent = startMarker.parentNode || fragment;
    }
    renderedNodes.forEach((node) => {
      if (isSSR()) {
        removeChild(currentParent, node);
      } else {
        const domNode = node;
        if (domNode.parentNode === currentParent) {
          currentParent.removeChild(domNode);
        }
      }
    });
    renderedNodes = [];
    if (matches) {
      let content;
      if (component) {
        content = component({ ...restProps });
      } else if (typeof children === "function") {
        content = children();
      } else {
        content = children;
      }
      if (content) {
        const nodesToAdd = Array.isArray(content) ? content : [content];
        nodesToAdd.forEach((node) => {
          if (isSSR()) {
            const virtualParent = currentParent;
            const endIndex = virtualParent.children.indexOf(endMarker);
            if (endIndex !== -1) {
              virtualParent.children.splice(endIndex, 0, node);
            } else {
              virtualParent.children.push(node);
            }
            renderedNodes.push(node);
          } else {
            if (node instanceof Node) {
              currentParent.insertBefore(node, endMarker);
              renderedNodes.push(node);
            } else if (node != null) {
              const textNode = createRouterText(String(node));
              currentParent.insertBefore(textNode, endMarker);
              renderedNodes.push(textNode);
            }
          }
        });
      }
    }
  };
  if (isSSR()) {
    renderRouteContent();
  } else {
    createEffect(renderRouteContent);
  }
  return fragment;
}
function Link(props) {
  const link = createSafeElement("a");
  link.href = props.to;
  link.className = props.class !== void 0 ? props.class : "";
  if (typeof document === "undefined") {
    if (typeof props.children === "string") {
      link.textContent = props.children;
    } else if (Array.isArray(props.children)) {
      props.children.forEach((child) => {
        link.appendChild(child);
      });
    } else if (props.children) {
      link.appendChild(props.children);
    }
    return link;
  }
  const context = useContext(RouterContext);
  const handleClick = (event) => {
    event.preventDefault();
    if (props.onclick) {
      props.onclick(event);
    }
    if (context) {
      context.navigate(props.to, { replace: props.replace !== void 0 ? props.replace : false });
    } else {
      window.history.pushState({}, "", props.to);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };
  link.addEventListener("click", handleClick);
  createEffect(() => {
    if (!context) {
      return;
    }
    const currentPath = context.currentPath;
    const currentPathValue = currentPath();
    const isActive = (props.exact !== void 0 ? props.exact : false) ? currentPathValue === props.to : currentPathValue.startsWith(props.to);
    const activeClassName = props.activeClass !== void 0 ? props.activeClass : "active";
    if (isActive) {
      link.classList.add(activeClassName);
    } else {
      link.classList.remove(activeClassName);
    }
  });
  if (typeof props.children === "string") {
    link.textContent = props.children;
  } else if (Array.isArray(props.children)) {
    props.children.forEach((child) => {
      link.appendChild(child);
    });
  } else if (props.children) {
    link.appendChild(props.children);
  }
  return link;
}
function For(props) {
  const fragment = createRouterFragment();
  const startMarker = createRouterComment("For start");
  const endMarker = createRouterComment("For end");
  if (isSSR()) {
    const virtualFragment = fragment;
    virtualFragment.children.push(startMarker, endMarker);
  } else {
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
  }
  const renderItem = Array.isArray(props.children) ? props.children[0] : props.children;
  if (typeof renderItem !== "function") {
    throw new Error(`For component children must be a function.`);
  }
  const instanceMap = /* @__PURE__ */ new Map();
  const updateList = () => {
    let newItems = [];
    if (isSignal(props.each)) {
      newItems = props.each();
    } else if (typeof props.each === "function") {
      newItems = props.each();
    } else {
      newItems = props.each;
    }
    if (!Array.isArray(newItems))
      newItems = [];
    const parent = isSSR() ? fragment : startMarker.parentNode || fragment;
    const nextInstances = [];
    const availableInstances = /* @__PURE__ */ new Map();
    instanceMap.forEach((instances, item) => {
      availableInstances.set(item, [...instances]);
    });
    newItems.forEach((item, index) => {
      const stack = availableInstances.get(item);
      if (stack && stack.length > 0) {
        const instance = stack.shift();
        instance.indexSignal(index);
        nextInstances.push(instance);
      } else {
        const indexSignal = createSignal(index);
        const element = renderItem(item, indexSignal);
        let nodes = [];
        if (isSSR()) {
          nodes = [element];
        } else {
          if (element instanceof DocumentFragment) {
            nodes = Array.from(element.childNodes);
          } else if (element instanceof Node) {
            nodes = [element];
          }
        }
        nextInstances.push({ nodes, indexSignal });
      }
    });
    availableInstances.forEach((stack) => {
      stack.forEach((instance) => {
        if (!isSSR()) {
          instance.nodes.forEach((node) => node.parentElement?.removeChild(node));
        }
      });
    });
    if (isSSR()) {
      const virtualParent = parent;
      const endIndex = virtualParent.children.indexOf(endMarker);
      if (endIndex > 0) {
        const startIndex = virtualParent.children.indexOf(startMarker);
        if (startIndex >= 0 && startIndex < endIndex) {
          virtualParent.children.splice(startIndex + 1, endIndex - startIndex - 1);
        }
      }
      const insertIndex = virtualParent.children.indexOf(endMarker);
      const allNodes = nextInstances.flatMap((inst) => inst.nodes);
      virtualParent.children.splice(insertIndex, 0, ...allNodes);
    } else {
      let cursor = endMarker;
      for (let i = nextInstances.length - 1; i >= 0; i--) {
        const instance = nextInstances[i];
        if (!instance)
          continue;
        const nodes = instance.nodes;
        for (let j = nodes.length - 1; j >= 0; j--) {
          const node = nodes[j];
          if (node.nextSibling !== cursor) {
            parent.insertBefore(node, cursor);
          }
          cursor = node;
        }
      }
    }
    instanceMap.clear();
    nextInstances.forEach((instance, i) => {
      const item = newItems[i];
      const stack = instanceMap.get(item) || [];
      stack.push(instance);
      instanceMap.set(item, stack);
    });
  };
  if (isSSR()) {
    updateList();
  } else {
    createEffect(updateList);
  }
  return fragment;
}
function Show(props) {
  const fragment = createRouterFragment();
  const startMarker = createRouterComment("Show start");
  const endMarker = createRouterComment("Show end");
  if (isSSR()) {
    const virtualFragment = fragment;
    virtualFragment.children.push(startMarker, endMarker);
  } else {
    fragment.appendChild(startMarker);
    fragment.appendChild(endMarker);
  }
  let currentNodes = [];
  const update = () => {
    const when = typeof props.when === "function" ? props.when() : isSignal(props.when) ? props.when() : props.when;
    const condition = !!when;
    const data = when;
    const parent = isSSR() ? fragment : startMarker.parentNode || fragment;
    if (!isSSR()) {
      currentNodes.forEach((n) => n.parentElement?.removeChild(n));
    }
    currentNodes = [];
    const content = condition ? props.children : props.fallback;
    if (content) {
      const result = typeof content === "function" ? content(data) : content;
      if (isSSR()) {
        const nodes = [result];
        const virtualParent = parent;
        const insertIndex = virtualParent.children.indexOf(endMarker);
        virtualParent.children.splice(insertIndex, 0, ...nodes);
        currentNodes = nodes;
      } else {
        const nodes = result instanceof DocumentFragment ? Array.from(result.childNodes) : [result];
        nodes.forEach((n) => parent.insertBefore(n, endMarker));
        currentNodes = nodes;
      }
    }
  };
  if (isSSR()) {
    update();
  } else {
    createEffect(update);
  }
  return fragment;
}
const VOID_ELEMENTS = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
const BOOLEAN_ATTRIBUTES = /* @__PURE__ */ new Set([
  "autofocus",
  "autoplay",
  "async",
  "checked",
  "controls",
  "defer",
  "disabled",
  "hidden",
  "loop",
  "multiple",
  "muted",
  "open",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
function escapeHtml$2(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function isEventHandler(attr) {
  return attr.startsWith("on") && attr.length > 2;
}
function styleToString(style) {
  if (typeof style === "string") {
    return style;
  }
  return Object.entries(style).map(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    return `${cssKey}: ${value}`;
  }).join("; ");
}
function renderAttributes(props) {
  let result = "";
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || key === "key" || key === "ref") {
      continue;
    }
    if (isEventHandler(key)) {
      continue;
    }
    const attrName = key === "className" ? "class" : key;
    if (BOOLEAN_ATTRIBUTES.has(attrName)) {
      if (value) {
        result += ` ${attrName}`;
      }
      continue;
    }
    if (attrName === "style" && typeof value === "object") {
      const styleStr = styleToString(value);
      if (styleStr) {
        result += ` style="${escapeHtml$2(styleStr)}"`;
      }
      continue;
    }
    if (value != null && value !== false) {
      const attrValue = String(value);
      result += ` ${attrName}="${escapeHtml$2(attrValue)}"`;
    }
  }
  return result;
}
function virtualNodeToHtml(node) {
  if (node == null) {
    return "";
  }
  switch (node.type) {
    case "text":
      return escapeHtml$2(node.content);
    case "comment":
      return `<!--${escapeHtml$2(node.content)}-->`;
    case "fragment":
      return node.children.map(virtualNodeToHtml).join("");
    case "element": {
      const { tag, props, children } = node;
      const tagLower = tag.toLowerCase();
      let html = `<${tagLower}`;
      html += renderAttributes(props);
      if (VOID_ELEMENTS.has(tagLower)) {
        html += ">";
        return html;
      }
      html += ">";
      html += children.map(virtualNodeToHtml).join("");
      html += `</${tagLower}>`;
      return html;
    }
    default:
      return "";
  }
}
function escapeHtml$1(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderToString(element, options = {}) {
  const { ssrHydration = false, initialState } = options;
  if (ssrHydration && initialState) {
    if (initialState.signals) {
      const registeredSignals = getRegisteredSignals();
      for (const [key, value] of Object.entries(initialState.signals)) {
        const signal = registeredSignals.get(key);
        if (signal) {
          signal.set(value);
        }
      }
    }
  }
  let html;
  if (element && typeof element === "object" && "type" in element) {
    html = virtualNodeToHtml(element);
  } else if (element && typeof element === "object" && ("tagName" in element || "innerHTML" in element)) {
    if ("innerHTML" in element && element.innerHTML) {
      html = element.innerHTML;
    } else {
      html = mockElementToHtml(element);
    }
  } else {
    html = "";
  }
  const state = {
    signals: {},
    resources: {},
    contexts: {}
  };
  if (ssrHydration) {
    const registeredSignals = getRegisteredSignals();
    for (const [key, signal] of registeredSignals) {
      try {
        state.signals[key] = signal.peek();
      } catch (e) {
        console.warn(`[SSR] Failed to serialize signal "${key}":`, e);
      }
    }
  }
  const hydrationData = {
    state,
    version: "1.0.0"
  };
  return { html, hydrationData };
}
function mockElementToHtml(element) {
  const tagName = (element.tagName || "div").toLowerCase();
  let html = `<${tagName}`;
  if (element.className) {
    html += ` class="${escapeHtml$1(element.className)}"`;
  }
  if (element.href) {
    html += ` href="${escapeHtml$1(element.href)}"`;
  }
  if (element.id) {
    html += ` id="${escapeHtml$1(element.id)}"`;
  }
  if (element.style && typeof element.style === "object") {
    const styleStr = Object.entries(element.style).filter(([_, v]) => v !== "").map(([k, v]) => `${k}: ${v}`).join("; ");
    if (styleStr) {
      html += ` style="${escapeHtml$1(styleStr)}"`;
    }
  }
  html += ">";
  if (element.textContent) {
    html += escapeHtml$1(element.textContent);
  }
  if (element.children && Array.isArray(element.children)) {
    for (const child of element.children) {
      if (typeof child === "object" && "type" in child) {
        html += virtualNodeToHtml(child);
      } else if (typeof child === "object" && "tagName" in child) {
        html += mockElementToHtml(child);
      } else if (typeof child === "string") {
        html += escapeHtml$1(child);
      }
    }
  }
  html += `</${tagName}>`;
  return html;
}
function renderHydrationData(hydrationData) {
  const jsonData = JSON.stringify(hydrationData);
  return `<script>window.__HYPERFX_HYDRATION_DATA__ = ${jsonData};<\/script>`;
}
function TopNav() {
  return /* @__PURE__ */ jsx("header", { class: "bg-linear-to-r from-gray-800/95 via-gray-700/95 to-gray-800/95 backdrop-blur-md border-b border-gray-600/50 sticky top-0 z-50", children: /* @__PURE__ */ jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("nav", { class: "flex justify-center space-x-12 py-6", role: "navigation", "aria-label": "Main navigation", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/",
        class: "group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative",
        children: [
          /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { class: "text-xl group-hover:animate-bounce", children: "🏠" }),
            "Home"
          ] }),
          /* @__PURE__ */ jsx("span", { class: "absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/about",
        class: "group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative",
        children: [
          /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { class: "text-xl group-hover:animate-bounce", children: "📖" }),
            "About"
          ] }),
          /* @__PURE__ */ jsx("span", { class: "absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/products",
        class: "group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative",
        children: [
          /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { class: "text-xl group-hover:animate-bounce", children: "🛍️" }),
            "Products"
          ] }),
          /* @__PURE__ */ jsx("span", { class: "absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" })
        ]
      }
    )
  ] }) }) });
}
function HomePage() {
  const count = createSignal(0, { key: "homepage-counter" });
  const increment = () => {
    count(count() + 1);
  };
  const decrement = () => {
    count(count() - 1);
  };
  const reset = () => {
    count(0);
  };
  return /* @__PURE__ */ jsxs("div", { class: "min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white", children: [
    /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsx(TopNav, {}) }),
    /* @__PURE__ */ jsxs("main", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ jsxs("section", { class: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h1", { class: "text-5xl md:text-7xl font-bold p-2 mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent", children: "🚀 Welcome to HyperFX JSX" }),
        /* @__PURE__ */ jsx("p", { class: "text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed", children: "A modern SSR framework with reactive JSX components" })
      ] }),
      /* @__PURE__ */ jsx("section", { class: "mb-16", "aria-labelledby": "counter-heading", children: /* @__PURE__ */ jsxs("div", { class: "bg-linear-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm p-10 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10", children: [
        /* @__PURE__ */ jsx("h2", { id: "counter-heading", class: "text-3xl font-semibold mb-8 text-center text-blue-300", children: "🧮 Interactive Counter" }),
        /* @__PURE__ */ jsxs("div", { class: "text-center", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              class: "text-7xl md:text-8xl font-bold mb-10 text-transparent bg-linear-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text animate-pulse",
              role: "status",
              "aria-live": "polite",
              children: count
            }
          ),
          /* @__PURE__ */ jsxs("div", { class: "flex flex-wrap justify-center gap-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                class: "group px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25",
                onclick: increment,
                type: "button",
                "aria-label": "Increment counter",
                children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { class: "text-2xl group-hover:animate-bounce", children: "➕" }),
                  "Increment"
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                class: "group px-8 py-4 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25",
                onclick: decrement,
                type: "button",
                "aria-label": "Decrement counter",
                children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { class: "text-2xl group-hover:animate-bounce", children: "➖" }),
                  "Decrement"
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                class: "group px-8 py-4 bg-linear-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25",
                onclick: reset,
                type: "button",
                "aria-label": "Reset counter to zero",
                children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { class: "text-2xl group-hover:animate-spin", children: "🔄" }),
                  "Reset"
                ] })
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { class: "mb-12", "aria-labelledby": "features-heading", children: [
        /* @__PURE__ */ jsx("h2", { class: "sr-only", children: "Features" }),
        /* @__PURE__ */ jsxs("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("article", { class: "bg-gray-800 p-6 rounded-lg border border-gray-700", children: [
            /* @__PURE__ */ jsx("h3", { class: "text-xl font-semibold mb-3 text-green-400", children: "⚡ Fast SSR" }),
            /* @__PURE__ */ jsx("p", { class: "text-gray-300", children: "Server-side rendering with automatic hydration for optimal performance and SEO benefits." })
          ] }),
          /* @__PURE__ */ jsxs("article", { class: "bg-gray-800 p-6 rounded-lg border border-gray-700", children: [
            /* @__PURE__ */ jsx("h3", { class: "text-xl font-semibold mb-3 text-blue-400", children: "🔄 Reactive" }),
            /* @__PURE__ */ jsx("p", { class: "text-gray-300", children: "Fine-grained reactivity with signals that update only what's needed for maximum efficiency." })
          ] }),
          /* @__PURE__ */ jsxs("article", { class: "bg-gray-800 p-6 rounded-lg border border-gray-700", children: [
            /* @__PURE__ */ jsx("h3", { class: "text-xl font-semibold mb-3 text-purple-400", children: "📱 JSX" }),
            /* @__PURE__ */ jsx("p", { class: "text-gray-300", children: "Familiar React-like JSX syntax with TypeScript support for a great developer experience." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { "aria-labelledby": "getting-started-heading", children: /* @__PURE__ */ jsxs("article", { class: "bg-gray-800 p-6 rounded-lg border border-gray-700", children: [
        /* @__PURE__ */ jsx("h3", { id: "getting-started-heading", class: "text-xl font-semibold mb-4 text-orange-400", children: "🚀 Getting Started" }),
        /* @__PURE__ */ jsx("p", { class: "text-gray-300 mb-4", children: "This counter demonstrates HyperFX's reactive capabilities. The count value is stored in a reactive signal that automatically updates the UI when changed." }),
        /* @__PURE__ */ jsx("p", { class: "text-gray-300", children: "Try clicking the buttons above - the count updates instantly with no manual DOM manipulation required!" })
      ] }) })
    ] })
  ] });
}
const featureList = createSignal(["SSR", "Hydration", "Routing", "Reactivity"]);
const newFeature = createSignal("");
const featureCount = createComputed(() => featureList().length);
function addFeature() {
  const feature = newFeature().trim();
  if (feature) {
    featureList([...featureList(), feature]);
    newFeature("");
  }
}
function removeFeature(index) {
  const features = featureList();
  featureList([...features.slice(0, index), ...features.slice(index + 1)]);
}
function updateNewFeature(event) {
  const value = event.target.value;
  newFeature(value);
}
function resetFeatures() {
  featureList(["SSR", "Hydration", "Routing", "Reactivity"]);
  newFeature("");
}
function AboutPage() {
  return /* @__PURE__ */ jsxs("div", { class: "min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white", children: [
    /* @__PURE__ */ jsx(TopNav, {}),
    /* @__PURE__ */ jsxs("main", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ jsxs("section", { class: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h1", { class: "text-5xl p-2 md:text-7xl font-bold mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent", children: "📖 About HyperFX JSX" }),
        /* @__PURE__ */ jsx("p", { class: "text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed", children: "Learn about our modern SSR framework with JSX support" })
      ] }),
      /* @__PURE__ */ jsx("section", { class: "mb-16", "aria-labelledby": "features-section", children: /* @__PURE__ */ jsxs("div", { class: "bg-linear-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 backdrop-blur-sm p-10 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10", children: [
        /* @__PURE__ */ jsx("h2", { id: "features-section", class: "text-3xl font-semibold mb-8 text-center text-purple-300", children: "🚀 Framework Features" }),
        /* @__PURE__ */ jsxs("div", { class: "mb-8", children: [
          /* @__PURE__ */ jsxs("h3", { class: "text-2xl font-medium mb-6 text-center", children: [
            "Feature List (",
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-live": "polite",
                class: "text-transparent bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold",
                children: featureCount
              }
            ),
            "items)"
          ] }),
          /* @__PURE__ */ jsx("ul", { class: "space-y-3 mb-8", role: "list", "aria-label": "Framework features", children: /* @__PURE__ */ jsx(
            For,
            {
              each: featureList,
              children: (feature, index) => /* @__PURE__ */ jsxs(
                "li",
                {
                  class: "flex items-center justify-between bg-linear-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300",
                  role: "listitem",
                  children: [
                    /* @__PURE__ */ jsx("span", { class: "text-white font-medium text-lg", children: feature }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        class: "group px-4 py-2 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25",
                        onclick: () => removeFeature(index()),
                        type: "button",
                        "aria-label": `Remove ${feature} from feature list`,
                        children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx("span", { class: "text-lg group-hover:animate-pulse", children: "🗑️" }),
                          "Remove"
                        ] })
                      }
                    )
                  ]
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxs(
            "form",
            {
              class: "flex flex-col lg:flex-row gap-4",
              onsubmit: (e) => {
                e.preventDefault();
                addFeature();
              },
              children: [
                /* @__PURE__ */ jsx("label", { for: "new-feature", class: "sr-only", children: "Add new feature" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "new-feature",
                    type: "text",
                    placeholder: "Add new feature...",
                    class: "flex-1 px-6 py-4 bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 text-lg",
                    value: newFeature,
                    oninput: updateNewFeature,
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxs("div", { class: "flex gap-4", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      class: "group px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25",
                      children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { class: "text-xl group-hover:animate-bounce", children: "➕" }),
                        "Add"
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      class: "group px-8 py-4 bg-linear-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25",
                      onclick: resetFeatures,
                      children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { class: "text-xl group-hover:animate-spin", children: "🔄" }),
                        "Reset"
                      ] })
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { class: "mb-16", "aria-labelledby": "technical-details", children: [
        /* @__PURE__ */ jsx("h2", { id: "technical-details", class: "text-3xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent", children: "Technical Excellence" }),
        /* @__PURE__ */ jsxs("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("article", { class: "bg-linear-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300 group", children: [
            /* @__PURE__ */ jsx("h3", { class: "text-2xl font-semibold mb-6 text-green-400 group-hover:text-green-300 transition-colors duration-300", children: "🔧 Technical Stack" }),
            /* @__PURE__ */ jsxs("ul", { class: "space-y-3 text-gray-300", role: "list", children: [
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-green-400 rounded-full" }),
                /* @__PURE__ */ jsx("strong", { children: "HyperFX:" }),
                " Reactive UI framework"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-blue-400 rounded-full" }),
                /* @__PURE__ */ jsx("strong", { children: "Vinxi:" }),
                " Full-stack meta-framework"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-purple-400 rounded-full" }),
                /* @__PURE__ */ jsx("strong", { children: "JSX:" }),
                " Familiar React-like syntax"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-cyan-400 rounded-full" }),
                /* @__PURE__ */ jsx("strong", { children: "Tailwind CSS v4:" }),
                " Modern styling"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-indigo-400 rounded-full" }),
                /* @__PURE__ */ jsx("strong", { children: "TypeScript:" }),
                " Type safety"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-orange-400 rounded-full" }),
                /* @__PURE__ */ jsx("strong", { children: "Vite:" }),
                " Fast development"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("article", { class: "bg-linear-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 group", children: [
            /* @__PURE__ */ jsx("h3", { class: "text-2xl font-semibold mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300", children: "⚡ Performance" }),
            /* @__PURE__ */ jsxs("ul", { class: "space-y-3 text-gray-300", role: "list", children: [
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-yellow-400 rounded-full" }),
                "Fast server-side rendering"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-green-400 rounded-full" }),
                "Progressive hydration"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-blue-400 rounded-full" }),
                "Minimal JavaScript bundle"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-purple-400 rounded-full" }),
                "Efficient client-side updates"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-pink-400 rounded-full" }),
                "Smart caching strategies"
              ] }),
              /* @__PURE__ */ jsxs("li", { class: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { class: "w-2 h-2 bg-cyan-400 rounded-full" }),
                "SEO-friendly architecture"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { "aria-labelledby": "philosophy-heading", children: /* @__PURE__ */ jsxs("article", { class: "bg-linear-to-br from-orange-900/50 via-amber-900/50 to-yellow-900/50 backdrop-blur-sm p-10 rounded-2xl border border-orange-500/30 shadow-2xl shadow-orange-500/10", children: [
        /* @__PURE__ */ jsx("h3", { id: "philosophy-heading", class: "text-3xl font-semibold mb-8 text-center text-orange-400", children: "💭 Philosophy" }),
        /* @__PURE__ */ jsxs("div", { class: "space-y-6 text-lg leading-relaxed", children: [
          /* @__PURE__ */ jsx("p", { class: "text-gray-300", children: "HyperFX combines the best of both worlds: the familiar JSX syntax that developers love with the performance and simplicity of a lightweight framework." }),
          /* @__PURE__ */ jsx("p", { class: "text-gray-300", children: "We believe in progressive enhancement, where your app works great even without JavaScript, but becomes more interactive as it loads. This ensures the best user experience across all devices and network conditions." })
        ] })
      ] }) })
    ] })
  ] });
}
const products = [
  {
    id: 1,
    name: "HyperFX Pro",
    price: 99,
    description: "Advanced reactive framework with premium features",
    category: "Framework"
  },
  {
    id: 2,
    name: "JSX Components",
    price: 49,
    description: "Pre-built accessible component library",
    category: "Components"
  },
  {
    id: 3,
    name: "SSR Toolkit",
    price: 79,
    description: "Server-side rendering tools and optimization utilities",
    category: "Tools"
  },
  {
    id: 4,
    name: "Dev Tools",
    price: 29,
    description: "Development and debugging tools for enhanced productivity",
    category: "Tools"
  }
];
const cart = createSignal([]);
const cartTotal = createComputed(
  () => cart().reduce((total, product) => total + product.price, 0)
);
const cartItemCount = createComputed(() => cart().length);
const showCartItems = createComputed(() => cartItemCount() > 0);
const isCartEmpty = createComputed(() => cartItemCount() === 0);
function addToCart(product) {
  const currentCart = cart();
  if (!currentCart.find((item) => item.id === product.id)) {
    cart([...currentCart, product]);
  }
}
function removeFromCart(productId) {
  const currentCart = cart();
  cart(currentCart.filter((item) => item.id !== productId));
}
function clearCart() {
  cart([]);
}
function ProductsPage() {
  return /* @__PURE__ */ jsxs("div", { class: "min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white", children: [
    /* @__PURE__ */ jsx(TopNav, {}),
    /* @__PURE__ */ jsxs("main", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ jsxs("section", { class: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h1", { class: "text-5xl md:text-7xl p-2 font-bold mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent", children: "🛍️ HyperFX Products" }),
        /* @__PURE__ */ jsx("p", { class: "text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed", children: "Discover our premium tools and components for reactive web development" })
      ] }),
      /* @__PURE__ */ jsx("section", { class: "mb-16", "aria-labelledby": "cart-heading", children: /* @__PURE__ */ jsxs("div", { class: "bg-linear-to-br from-green-900/50 via-emerald-900/50 to-teal-900/50 backdrop-blur-sm p-10 rounded-2xl border border-green-500/30 shadow-2xl shadow-green-500/10", children: [
        /* @__PURE__ */ jsx("h2", { id: "cart-heading", class: "text-3xl font-semibold mb-8 text-center text-green-300", children: "🛒 Shopping Cart" }),
        /* @__PURE__ */ jsxs("div", { class: "flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { class: "flex flex-col sm:flex-row gap-6 text-xl", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                "aria-live": "polite",
                class: "text-center lg:text-left",
                children: [
                  "Items: ",
                  /* @__PURE__ */ jsx("span", { class: "text-transparent bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold text-2xl", children: cartItemCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "div",
              {
                "aria-live": "polite",
                class: "text-center lg:text-left",
                children: [
                  "Total: ",
                  /* @__PURE__ */ jsxs("span", { class: "text-transparent bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text font-bold text-2xl", children: [
                    "$",
                    cartTotal
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              class: "group px-8 py-4 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25",
              onclick: clearCart,
              disabled: isCartEmpty,
              type: "button",
              "aria-label": `Clear all ${cartItemCount} items from cart`,
              children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { class: "text-xl group-hover:animate-bounce", children: "🗑️" }),
                "Clear Cart"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Show, { when: showCartItems, children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { class: "text-2xl font-medium mb-6 text-center", children: "Cart Items:" }),
          /* @__PURE__ */ jsx("ul", { class: "space-y-4", role: "list", "aria-label": "Items in shopping cart", children: /* @__PURE__ */ jsx(
            For,
            {
              each: cart,
              children: (item, index) => /* @__PURE__ */ jsxs("li", { class: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-linear-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300", children: [
                /* @__PURE__ */ jsxs("div", { class: "flex-1", children: [
                  /* @__PURE__ */ jsx("span", { class: "font-medium text-lg text-white", children: item.name }),
                  /* @__PURE__ */ jsxs("span", { class: "text-green-400 ml-3 font-bold text-xl", children: [
                    "$",
                    item.price
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    class: "group px-4 py-2 bg-linear-to-r from-red-300 to-rose-400 hover:from-red-800 hover:to-rose-900 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 self-start sm:self-center",
                    onclick: () => removeFromCart(item.id),
                    type: "button",
                    "aria-label": `Remove ${item.name} from cart`,
                    children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { class: "text-lg group-hover:animate-pulse", children: "❌" }),
                      "Remove"
                    ] })
                  }
                )
              ] })
            }
          ) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "products-heading", children: [
        /* @__PURE__ */ jsx("h2", { id: "products-heading", class: "text-3xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent", children: "Available Products" }),
        /* @__PURE__ */ jsx("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16", children: /* @__PURE__ */ jsx(For, { each: products, children: (product) => {
          const isInCart = createComputed(() => !!cart().find((item) => item.id === product.id));
          const buttonText = createComputed(() => isInCart() ? "In Cart" : "Add to Cart");
          const buttonLabel = createComputed(
            () => isInCart() ? `${product.name} is already in cart` : `Add ${product.name} to cart for $${product.price}`
          );
          return /* @__PURE__ */ jsxs("article", { class: "bg-linear-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 group hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10", children: [
            /* @__PURE__ */ jsxs("header", { class: "mb-6", children: [
              /* @__PURE__ */ jsxs("div", { class: "flex justify-between items-start mb-4", children: [
                /* @__PURE__ */ jsx("h3", { class: "text-2xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300", children: product.name }),
                /* @__PURE__ */ jsx("span", { class: "text-sm bg-linear-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-full text-white font-medium", children: product.category })
              ] }),
              /* @__PURE__ */ jsx("p", { class: "text-gray-300 text-lg leading-relaxed", children: product.description })
            ] }),
            /* @__PURE__ */ jsxs("footer", { class: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6", children: [
              /* @__PURE__ */ jsxs(
                "span",
                {
                  class: "text-3xl font-bold text-transparent bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text",
                  "aria-label": `Price: ${product.price} dollars`,
                  children: [
                    "$",
                    product.price
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  class: "group px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white disabled:from-gray-600 disabled:to-slate-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:ring-blue-500/50 hover:shadow-blue-500/25",
                  onclick: () => addToCart(product),
                  disabled: isInCart,
                  type: "button",
                  "aria-label": buttonLabel,
                  children: /* @__PURE__ */ jsxs("span", { class: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { class: "text-xl group-hover:animate-bounce", children: isInCart ? "✓" : "🛒" }),
                    buttonText
                  ] })
                }
              )
            ] })
          ] }, product.id);
        } }) })
      ] })
    ] })
  ] });
}
const routes = {
  "/": {
    path: "/",
    component: HomePage,
    title: "Home - HyperFX SSR Example",
    description: "Modern SSR framework with reactive JSX components"
  },
  "/about": {
    path: "/about",
    component: AboutPage,
    title: "About - HyperFX SSR Example",
    description: "Learn about HyperFX - a modern SSR framework with JSX support"
  },
  "/products": {
    path: "/products",
    component: ProductsPage,
    title: "Products - HyperFX SSR Example",
    description: "Browse our product showcase with interactive cart"
  }
};
function getAllRoutePaths() {
  return Object.keys(routes);
}
function createDocument(options) {
  const {
    title,
    description,
    body,
    hydrationScript,
    styles: styles2 = "/styles.css",
    clientScript = "/assets/client.js"
    // Will be overridden by server
  } = options;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    ${description ? `<meta name="description" content="${escapeHtml(description)}" />` : ""}
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>">
    <link rel="stylesheet" href="${styles2}" />
</head>
<body>
    ${body}
    ${hydrationScript}
    <script src="${clientScript}" type="module"><\/script>
</body>
</html>`;
}
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}
const styles = "/assets/styles-D9lGc4u8.css";
let clientScriptPath = null;
async function getClientScriptPath() {
  if (clientScriptPath) return clientScriptPath;
  try {
    const publicDir = join(process.cwd(), ".output/public/assets");
    const files = await readdir(publicDir);
    const clientFile = files.find((f) => f.startsWith("client-") && f.endsWith(".js"));
    if (clientFile) {
      clientScriptPath = `/assets/${clientFile}`;
      return clientScriptPath;
    }
  } catch (e) {
  }
  return "/src/client.tsx";
}
const server = {
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    if (pathname.startsWith("/assets/") || pathname.endsWith(".js") || pathname.endsWith(".css") || pathname.endsWith(".map")) {
      return void 0;
    }
    enableSSRMode();
    const App = () => /* @__PURE__ */ jsx("div", { id: "app", children: /* @__PURE__ */ jsx(Router, { initialPath: pathname, children: () => /* @__PURE__ */ jsx(Fragment, { children: getAllRoutePaths().map((path) => /* @__PURE__ */ jsx(
      Route,
      {
        path,
        component: routes[path]?.component,
        exact: path === "/"
      }
    )) }) }) });
    const appElement = /* @__PURE__ */ jsx(App, {});
    const { html, hydrationData } = renderToString(appElement, {
      ssrHydration: true
    });
    const hydrationScript = renderHydrationData(hydrationData);
    disableSSRMode();
    const route = routes[pathname];
    const title = route?.title || "404 - Page Not Found";
    const description = route?.description || "The requested page could not be found.";
    const clientScript = await getClientScriptPath();
    const documentHtml = createDocument({
      title,
      description,
      body: html,
      hydrationScript,
      styles,
      clientScript
    });
    return new Response(documentHtml, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600"
        // Cache for 1 hour
      }
    });
  }
};
export {
  server as default
};
