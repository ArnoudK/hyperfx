import { readdir } from "node:fs/promises";
import { join } from "node:path";
const FRAGMENT_TAG = /* @__PURE__ */ Symbol("HyperFX.Fragment");
let AsyncLocalStorage = null;
try {
  AsyncLocalStorage = require("async_hooks").AsyncLocalStorage;
} catch {
}
const asyncLocalStorage = AsyncLocalStorage ? new AsyncLocalStorage() : null;
function createDefaultContext() {
  return {
    trackingStack: [],
    ownerStack: [],
    currentOwner: null,
    globalSignalRegistry: /* @__PURE__ */ new Map(),
    ownerIdCounter: 0,
    templateCounter: 0,
    isTracking: false,
    insideEffect: false
  };
}
function getContext() {
  if (asyncLocalStorage) {
    let context = asyncLocalStorage.getStore();
    if (!context) {
      context = defaultContext;
      asyncLocalStorage.enterWith(context);
    }
    return context;
  }
  return defaultContext;
}
const defaultContext = createDefaultContext();
function getIsTracking() {
  return getContext().isTracking;
}
function setIsTracking(value) {
  getContext().isTracking = value;
}
function setInsideEffect(value) {
  getContext().insideEffect = value;
}
function pushTrackingFrame() {
  getContext().trackingStack.push({ dependencies: /* @__PURE__ */ new Set() });
}
function popTrackingFrame() {
  const frame = getContext().trackingStack.pop();
  return frame?.dependencies ?? /* @__PURE__ */ new Set();
}
function getCurrentFrame() {
  const stack = getContext().trackingStack;
  return stack[stack.length - 1];
}
function trackSignal(signal) {
  const frame = getCurrentFrame();
  if (!frame)
    return;
  const deps = signal.__deps;
  if (deps && deps.size > 0) {
    deps.forEach((dep) => frame.dependencies.add(dep));
    return;
  }
  frame.dependencies.add(signal);
}
function getOwnerStack() {
  return getContext().ownerStack;
}
function getCurrentOwner() {
  return getContext().currentOwner;
}
function setCurrentOwner(owner) {
  getContext().currentOwner = owner;
}
function incrementOwnerIdCounter() {
  return getContext().ownerIdCounter++;
}
function createOwner(parent = null, isRoot = false) {
  const owner = {
    id: incrementOwnerIdCounter(),
    parent,
    children: /* @__PURE__ */ new Set(),
    effects: /* @__PURE__ */ new Set(),
    signals: /* @__PURE__ */ new Set(),
    cleanups: /* @__PURE__ */ new Set(),
    mountCallbacks: /* @__PURE__ */ new Set(),
    mountCleanups: /* @__PURE__ */ new Set(),
    mounted: false,
    disposed: false,
    isRoot
  };
  return owner;
}
function disposeOwner(owner) {
  if (owner.disposed)
    return;
  owner.disposed = true;
  const safeDispose = (fn) => {
    try {
      fn();
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  };
  const children = Array.from(owner.children).reverse();
  for (const child of children) {
    disposeOwner(child);
  }
  owner.children.clear();
  const effects = Array.from(owner.effects).reverse();
  for (const dispose of effects) {
    safeDispose(dispose);
  }
  owner.effects.clear();
  const signals = Array.from(owner.signals).reverse();
  for (const dispose of signals) {
    safeDispose(dispose);
  }
  owner.signals.clear();
  if (owner.mountCleanups.size > 0) {
    const mountCleanups = Array.from(owner.mountCleanups).reverse();
    for (const cleanup of mountCleanups) {
      safeDispose(cleanup);
    }
    owner.mountCleanups.clear();
  }
  const cleanups = Array.from(owner.cleanups).reverse();
  for (const cleanup of cleanups) {
    safeDispose(cleanup);
  }
  owner.cleanups.clear();
  if (owner.parent) {
    owner.parent.children.delete(owner);
  }
}
function getGlobalSignalRegistry() {
  return getContext().globalSignalRegistry;
}
let isSSRMode$1 = false;
function enableSSRMode() {
  if (!isSSRMode$1) {
    isSSRMode$1 = true;
    getGlobalSignalRegistry().clear();
  }
}
function disableSSRMode() {
  isSSRMode$1 = false;
}
function getRegisteredSignals() {
  return getGlobalSignalRegistry();
}
function registerSignal(key, signal) {
  getGlobalSignalRegistry().set(key, signal);
}
class SignalImpl {
  constructor(initialValue) {
    this.subscribers = /* @__PURE__ */ new Set();
    this._value = initialValue;
  }
  get() {
    return this._value;
  }
  getSubscriberCount() {
    return this.subscribers.size;
  }
  clearSubscribers() {
    this.subscribers.clear();
  }
  set(newValue) {
    if (Object.is(this._value, newValue)) {
      return newValue;
    }
    this._value = newValue;
    const subscribersToNotify = Array.from(this.subscribers);
    let error = null;
    for (const callback of subscribersToNotify) {
      try {
        callback(newValue);
      } catch (e) {
        error = e;
        break;
      }
    }
    if (error) {
      this.subscribers.clear();
      throw error;
    }
    return newValue;
  }
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }
}
function createRawSignal(initialValue) {
  return new SignalImpl(initialValue);
}
function createSignal(initialValue, options) {
  const registry = getGlobalSignalRegistry();
  if (options?.key && registry.has(options.key)) {
    return registry.get(options.key);
  }
  const impl = createRawSignal(initialValue);
  const getter = createGetter(impl);
  const setter = createSetter(impl);
  const signalTuple = [getter, setter];
  const destroy = () => {
    impl.clearSubscribers();
    registry.delete(options?.key || "");
  };
  getter.destroy = destroy;
  if (!options?.unowned && getCurrentOwner()) {
    getCurrentOwner().signals.add(destroy);
  }
  if (options?.key) {
    if (registry.has(options.key)) {
      throw new Error(`Signal with key "${options.key}" already exists.`);
    } else {
      registerSignal(options.key, signalTuple);
    }
  }
  return signalTuple;
}
function createGetter(impl) {
  const fn = () => {
    if (getIsTracking()) {
      trackSignal(fn);
    }
    return impl.get();
  };
  fn.subscribe = (cb) => {
    const unsubscribe = impl.subscribe(cb);
    fn.subscriberCount = impl.getSubscriberCount();
    return () => {
      unsubscribe();
      fn.subscriberCount = impl.getSubscriberCount();
    };
  };
  fn.subscriberCount = impl.getSubscriberCount();
  return fn;
}
function createSetter(impl) {
  return (valueOrUpdater) => {
    const prev = impl.get();
    const newValue = typeof valueOrUpdater === "function" ? valueOrUpdater(prev) : valueOrUpdater;
    impl.set(newValue);
    return () => {
      impl.set(prev);
    };
  };
}
function createComputed(computeFn) {
  const oldTracking = getIsTracking();
  setIsTracking(true);
  pushTrackingFrame();
  let initialValue;
  let deps;
  try {
    initialValue = computeFn();
  } finally {
    deps = popTrackingFrame();
    setIsTracking(oldTracking);
  }
  const impl = createRawSignal(initialValue);
  const getter = createGetter(impl);
  getter.__deps = deps;
  let isRecomputing = false;
  const recompute = () => {
    if (isRecomputing)
      return;
    isRecomputing = true;
    const newValue = computeFn();
    if (!Object.is(newValue, impl.get())) {
      impl.set(newValue);
    }
    isRecomputing = false;
  };
  const unsubscribers = Array.from(deps).map((dep) => dep.subscribe(recompute));
  getter.destroy = () => {
    for (let i = 0; i < unsubscribers.length; i++) {
      unsubscribers[i]();
    }
    unsubscribers.length = 0;
    getter.__deps = void 0;
  };
  return getter;
}
function createEffect(effectFn) {
  let isDisposed = false;
  let isRunning = false;
  let pendingRun = false;
  const childOwner = createOwner(getCurrentOwner(), false);
  let cleanup = void 0;
  let unsubscribers = [];
  const dispose = () => {
    if (isDisposed)
      return;
    isDisposed = true;
    if (getCurrentOwner()) {
      getCurrentOwner().effects.delete(dispose);
    }
    if (typeof cleanup === "function") {
      cleanup();
    }
    cleanup = void 0;
    disposeOwner(childOwner);
  };
  if (getCurrentOwner()) {
    getCurrentOwner().effects.add(dispose);
  }
  const runEffect = () => {
    if (isDisposed)
      return;
    if (isRunning) {
      pendingRun = true;
      return;
    }
    isRunning = true;
    let iterations = 0;
    const MAX_ITERATIONS = 100;
    while (iterations < MAX_ITERATIONS) {
      pendingRun = false;
      if (typeof cleanup === "function") {
        cleanup();
      }
      cleanup = void 0;
      unsubscribers.forEach((u) => u());
      unsubscribers = [];
      const previousOwner = getCurrentOwner();
      setCurrentOwner(childOwner);
      getOwnerStack().push(childOwner);
      const oldTracking = getIsTracking();
      setIsTracking(true);
      pushTrackingFrame();
      setInsideEffect(true);
      try {
        cleanup = effectFn();
      } finally {
        setIsTracking(oldTracking);
        setInsideEffect(false);
        getOwnerStack().pop();
        setCurrentOwner(previousOwner);
      }
      const dependencies = Array.from(popTrackingFrame());
      unsubscribers = dependencies.map((dep) => dep.subscribe(() => {
        runEffect();
      }));
      if (!pendingRun) {
        break;
      }
      iterations++;
    }
    if (iterations >= MAX_ITERATIONS) {
      throw new Error("createEffect: Maximum iterations reached - possible infinite loop in effect");
    }
    isRunning = false;
  };
  runEffect();
  return dispose;
}
function untrack(fn) {
  const wasTracking = getIsTracking();
  setIsTracking(false);
  try {
    return fn();
  } finally {
    setIsTracking(wasTracking);
  }
}
function isAccessor(value) {
  return typeof value === "function" && "subscribe" in value && typeof value.subscribe === "function";
}
function getAccessor(value) {
  if (Array.isArray(value) && value.length >= 2 && typeof value[0] === "function" && typeof value[1] === "function") {
    return value[0];
  }
  if (isAccessor(value))
    return value;
  return void 0;
}
function getSetter(value) {
  if (Array.isArray(value) && value.length >= 2 && typeof value[0] === "function" && typeof value[1] === "function") {
    return value[1];
  }
  return void 0;
}
const SSR_STATE_KEY = "__HYPERFX_SSR_STATE_V2__";
const globalState = globalThis;
if (!globalState[SSR_STATE_KEY]) {
  globalState[SSR_STATE_KEY] = {
    hydrationEnabled: false,
    ssrMode: false,
    clientNodeCounter: 0,
    ssrNodeCounter: 0,
    hydrationContainer: null,
    hydrationPointer: null,
    hydrationStack: []
  };
}
const SSR_STATE = globalState[SSR_STATE_KEY];
function isHydrationEnabled() {
  return SSR_STATE.hydrationEnabled;
}
function setSSRMode(enabled) {
  SSR_STATE.ssrMode = enabled;
}
function isSSRMode() {
  return SSR_STATE.ssrMode;
}
function clearSSRState() {
  SSR_STATE.hydrationEnabled = false;
  SSR_STATE.ssrMode = false;
  SSR_STATE.clientNodeCounter = 0;
  SSR_STATE.ssrNodeCounter = 0;
  SSR_STATE.hydrationContainer = null;
}
function escapeHtml$1(text) {
  if (typeof text !== "string")
    return String(text);
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function domNodeToString(node) {
  if (node.nodeType === 1) {
    return String(node.outerHTML ?? "");
  }
  if (node.nodeType === 3) {
    return String(node.data ?? "");
  }
  if (node.nodeType === 8) {
    return `<!--${String(node.data ?? "")}-->`;
  }
  if (node.nodeType === 11) {
    const fragment = node;
    const wrapper = document.createElement("div");
    wrapper.appendChild(fragment.cloneNode(true));
    return wrapper.innerHTML;
  }
  return "";
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
function renderAttributes(props) {
  let result = "";
  if (!props)
    return result;
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || key === "key" || key === "ref" || key.startsWith("on"))
      continue;
    if (BOOLEAN_ATTRIBUTES.has(key)) {
      if (value)
        result += ` ${key}`;
      continue;
    }
    if (key === "style" && typeof value === "object" && value !== null) {
      const styleStr = Object.entries(value).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${v}`).join("; ");
      if (styleStr)
        result += ` style="${escapeHtml$1(styleStr)}"`;
      continue;
    }
    if (value != null && value !== false) {
      result += ` ${key}="${escapeHtml$1(String(value))}"`;
    }
  }
  return result;
}
function renderToString(element, options = {}) {
  const { ssrHydration = false, initialState } = options;
  const prevHydrating = isSSRMode();
  clearSSRState();
  setSSRMode(ssrHydration || prevHydrating);
  try {
    if (ssrHydration && initialState?.signals) {
      const registeredSignals = getRegisteredSignals();
      for (const [key, value] of Object.entries(initialState.signals)) {
        const sig = registeredSignals.get(key);
        const setter = sig ? getSetter(sig) : void 0;
        if (setter)
          setter(value);
      }
    }
    let result = element;
    if (typeof element === "function") {
      result = element();
    }
    let html = "";
    if (result && result.__ssr) {
      html = result.t;
    } else if (typeof result === "string") {
      html = result;
    } else if (typeof Node !== "undefined" && result instanceof Node) {
      html = domNodeToString(result);
    } else {
      if (result && typeof result === "object" && Array.isArray(result.childNodes)) {
        const nodes = result.childNodes;
        let buffer = "";
        for (const node of nodes) {
          if (node && node.__ssr) {
            buffer += node.t;
          } else {
            buffer += escapeHtml$1(String(node));
          }
        }
        html = buffer;
      } else {
        html = String(result || "");
      }
    }
    const state = { signals: {}, resources: {}, contexts: {} };
    if (ssrHydration) {
      const registeredSignals = getRegisteredSignals();
      for (const [key, signal] of registeredSignals) {
        const acc = getAccessor(signal);
        state.signals[key] = acc ? acc() : void 0;
      }
    }
    return {
      html,
      hydrationData: { state, version: "1.0.0" }
    };
  } finally {
    setSSRMode(prevHydrating);
  }
}
function ssrElement(tag, props, children) {
  const t = tag.toLowerCase();
  let html = `<${t}`;
  html += renderAttributes(props);
  if (VOID_ELEMENTS.has(t)) {
    html += ">";
    return { t: html, __ssr: true };
  }
  html += `>${children}</${t}>`;
  return { t: html, __ssr: true };
}
function renderHydrationData(hydrationData) {
  return `<script>window.__HYPERFX_HYDRATION_DATA__ = ${JSON.stringify(hydrationData)};<\/script>`;
}
function Fragment(props) {
  return {
    t: renderChildrenToString(props.children),
    __ssr: true
  };
}
function marker() {
  return {
    t: "<!--hfx:dyn-->",
    __ssr: true
  };
}
function renderChildrenToString(children) {
  if (children == null || children === false || children === true) {
    return "";
  }
  if (Array.isArray(children)) {
    return children.map(renderChildrenToString).join("");
  }
  const childAccessor = getAccessor(children);
  if (childAccessor) {
    return renderChildrenToString(childAccessor());
  }
  if (children && children.__ssr) {
    return children.t;
  }
  return escapeHtml$1(String(children));
}
function jsx(type, props, _key) {
  if (type === FRAGMENT_TAG || type === Fragment) {
    return {
      t: renderChildrenToString(props?.children),
      __ssr: true
    };
  }
  if (typeof type === "function") {
    const proxyProps = new Proxy(props || {}, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        const acc = getAccessor(value);
        if (acc)
          return acc();
        return value;
      }
    });
    return type(proxyProps);
  }
  const childrenHtml = props?.children ? renderChildrenToString(props.children) : "";
  const unwrappedProps = {};
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (key === "children")
        continue;
      const acc = getAccessor(value);
      unwrappedProps[key] = acc ? acc() : value;
    }
  }
  return ssrElement(type, unwrappedProps, childrenHtml);
}
function isSSR() {
  return typeof document === "undefined";
}
function createUniversalFragment() {
  if (isSSR()) {
    const fragment = {
      t: "",
      __ssr: true,
      childNodes: [],
      appendChild(n) {
        this.childNodes.push(n);
        this.t += n && n.__ssr ? n.t : escapeHtml$1(String(n));
        return n;
      },
      removeChild(n) {
        const idx = this.childNodes.indexOf(n);
        if (idx !== -1) {
          this.childNodes.splice(idx, 1);
          this.t = this.childNodes.map((c) => c && c.__ssr ? c.t : escapeHtml$1(String(c))).join("");
        }
        return n;
      },
      insertBefore(newNode, referenceNode) {
        if (referenceNode) {
          const index = this.childNodes.indexOf(referenceNode);
          if (index !== -1) {
            this.childNodes.splice(index, 0, newNode);
          } else {
            this.childNodes.push(newNode);
          }
        } else {
          this.childNodes.push(newNode);
        }
        this.t = this.childNodes.map((c) => c && c.__ssr ? c.t : escapeHtml$1(String(c))).join("");
        return newNode;
      },
      cloneNode() {
        return {
          ...this,
          childNodes: this.childNodes ? [...this.childNodes] : []
        };
      }
    };
    return fragment;
  }
  return document.createDocumentFragment();
}
function createUniversalComment(text) {
  if (isSSR()) {
    return {
      t: `<!--${escapeHtml$1(text)}-->`,
      __ssr: true,
      textContent: text,
      nodeType: 8,
      cloneNode() {
        return { ...this };
      }
    };
  }
  return document.createComment(text);
}
const elementSubscriptions = /* @__PURE__ */ new WeakMap();
const elementSignals = /* @__PURE__ */ new WeakMap();
const elementSubscriptionSet = /* @__PURE__ */ new Set();
let cleanupInterval = null;
function ensureCleanupInterval() {
  if (cleanupInterval || typeof window === "undefined" || typeof Element === "undefined") {
    return;
  }
  cleanupInterval = setInterval(() => {
    const elementsToCheck = Array.from(elementSubscriptionSet);
    for (const element of elementsToCheck) {
      if (!element.isConnected) {
        cleanupElementSubscriptions(element);
      }
    }
    if (elementSubscriptionSet.size === 0 && cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }, 10);
}
function addElementSubscription(element, unsubscribe) {
  const subscriptions = elementSubscriptions.get(element);
  if (!subscriptions) {
    elementSubscriptions.set(element, /* @__PURE__ */ new Set([unsubscribe]));
  } else {
    subscriptions.add(unsubscribe);
  }
  elementSubscriptionSet.add(element);
  ensureCleanupInterval();
}
function addElementSignal(element, computed) {
  const Signals = elementSignals.get(element);
  if (!Signals) {
    elementSignals.set(element, /* @__PURE__ */ new Set([computed]));
  } else {
    Signals.add(computed);
  }
  elementSubscriptionSet.add(element);
  ensureCleanupInterval();
}
function cleanupElementSubscriptions(element) {
  const subscriptions = elementSubscriptions.get(element);
  if (subscriptions) {
    subscriptions.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (error) {
        console.error("Error during subscription cleanup:", error);
      }
    });
    subscriptions.clear();
    elementSubscriptions.delete(element);
  }
  const Signals = elementSignals.get(element);
  if (Signals) {
    Signals.forEach((computed) => {
      try {
        if (typeof computed.destroy === "function") {
          computed.destroy();
        }
      } catch (error) {
        console.error("Error destroying computed signal:", error);
      }
    });
    Signals.clear();
    elementSignals.delete(element);
  }
  elementSubscriptionSet.delete(element);
}
function For(props) {
  const fragment = createUniversalFragment();
  const startMarker = createUniversalComment("For start");
  const endMarker = createUniversalComment("For end");
  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);
  const renderItem = Array.isArray(props.children) ? props.children[0] : props.children;
  if (typeof renderItem !== "function") {
    throw new Error(`For component children must be a function.`);
  }
  const instanceMap = /* @__PURE__ */ new Map();
  const updateList = () => {
    let newItems = [];
    if (isAccessor(props.each)) {
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
        instance.setIndex(index);
        nextInstances.push(instance);
      } else {
        const [indexSignalGet, indexSignalSet] = createSignal(index);
        const element = renderItem(item, indexSignalGet);
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
        nextInstances.push({ nodes, indexSignal: indexSignalGet, setIndex: indexSignalSet });
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
      const children = parent.childNodes || [];
      const startIndex = children.indexOf(startMarker);
      const endIndex = children.indexOf(endMarker);
      if (startIndex >= 0 && endIndex > startIndex) {
        const toRemove = children.slice(startIndex + 1, endIndex);
        toRemove.forEach((n) => parent.removeChild(n));
      }
      const allNodes = nextInstances.flatMap((inst) => inst.nodes);
      allNodes.forEach((node) => parent.insertBefore(node, endMarker));
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
  const fragment = createUniversalFragment();
  const startMarker = createUniversalComment("Show start");
  const endMarker = createUniversalComment("Show end");
  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);
  let currentNodes = [];
  const update = () => {
    const when = typeof props.when === "function" ? props.when() : isAccessor(props.when) ? props.when() : props.when;
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
        nodes.forEach((n) => parent.insertBefore(n, endMarker));
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
const PARAM_ARRAY_REGEX = /^\[([^\]]+)\]$/;
function parsePath(path) {
  const segments = [];
  let hasCatchAll = false;
  let catchAllParam;
  const pathParts = path.split("/").filter(Boolean);
  for (const part of pathParts) {
    if (part.startsWith("...[") && (part.endsWith("]") || part.endsWith("]?"))) {
      const isOptional = part.endsWith("]?");
      const paramName = isOptional ? part.slice(4, -2) : part.slice(4, -1);
      segments.push({ type: "catchAll", name: paramName, optional: isOptional });
      hasCatchAll = true;
      catchAllParam = paramName;
      continue;
    }
    const paramArrayMatch = PARAM_ARRAY_REGEX.exec(part);
    if (paramArrayMatch) {
      const paramName = paramArrayMatch[1];
      segments.push({ type: "paramArray", name: paramName });
      continue;
    }
    if (part.startsWith(":") && part.endsWith("?")) {
      const paramName = part.slice(1, -1);
      segments.push({ type: "param", name: paramName, optional: true });
      continue;
    }
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      segments.push({ type: "param", name: paramName, optional: false });
      continue;
    }
    segments.push({ type: "static", value: part });
  }
  return { segments, hasCatchAll, catchAllParam };
}
function parseSearchParams(url) {
  const searchStart = url.indexOf("?");
  if (searchStart === -1) {
    return {};
  }
  const search = url.slice(searchStart + 1);
  const params = {};
  const pairs = search.split("&");
  for (const pair of pairs) {
    const parts = pair.split("=");
    const key = decodeURIComponent(parts[0] || "");
    const value = decodeURIComponent(parts.slice(1).join("="));
    if (key in params) {
      const existing = params[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        params[key] = [existing, value];
      }
    } else {
      params[key] = value;
    }
  }
  return params;
}
function parseUrl(url) {
  const hashIndex = url.indexOf("#");
  const pathAndSearch = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const questionIndex = pathAndSearch.indexOf("?");
  if (questionIndex < 0) {
    return {
      path: pathAndSearch || "/",
      search: {},
      raw: url
    };
  }
  const path = pathAndSearch.slice(0, questionIndex);
  const searchPart = pathAndSearch.slice(questionIndex);
  return {
    path: path || "/",
    search: parseSearchParams(searchPart),
    raw: url
  };
}
function createRoute(path, options) {
  const route = {
    path,
    view: options.view,
    _parsed: parsePath(path),
    _paramsValidator: options.params,
    _searchValidator: options.search
  };
  return route;
}
function matchRoute(route, urlPath, urlSearch) {
  const matchResult = route._parsed.hasCatchAll ? matchCatchAll(urlPath, route.path) : matchStandard(urlPath, route.path);
  if (!matchResult || !matchResult.match) {
    return {
      route,
      params: {},
      search: {},
      matchedPath: "/",
      error: { type: "params", message: "Route not matched" }
    };
  }
  return {
    route,
    params: matchResult.params,
    search: urlSearch,
    matchedPath: matchResult.matchedPath
  };
}
function matchFirst(routes, urlPath, urlSearch) {
  for (const route of routes) {
    const match = matchRoute(route, urlPath, urlSearch);
    if (match && !match.error) {
      return match;
    }
  }
  const lastRoute = routes[routes.length - 1];
  if (lastRoute) {
    return matchRoute(lastRoute, urlPath, urlSearch);
  }
  return {
    route: void 0,
    params: {},
    search: {},
    matchedPath: "/",
    error: { type: "params", message: "No routes defined" }
  };
}
function matchStandard(urlPath, routePath) {
  if (urlPath.includes("//")) {
    return null;
  }
  const urlSegments = urlPath.split("/").filter(Boolean);
  const routeSegments = routePath.split("/").filter(Boolean);
  if (routeSegments.length === 0) {
    if (urlSegments.length === 0) {
      return {
        match: true,
        params: {},
        matchedPath: "/"
      };
    }
    return null;
  }
  let requiredSegments = 0;
  for (const seg of routeSegments) {
    if (!seg.endsWith("?")) {
      requiredSegments++;
    }
  }
  if (urlSegments.length < requiredSegments) {
    return null;
  }
  const params = {};
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSeg = routeSegments[i];
    const urlSeg = urlSegments[i];
    if (!routeSeg.startsWith(":")) {
      if (routeSeg !== urlSeg) {
        return null;
      }
      continue;
    }
    if (routeSeg.startsWith(":")) {
      const paramName = routeSeg.slice(1).replace("?", "");
      const isOptional = routeSeg.endsWith("?");
      if (urlSeg !== void 0) {
        params[paramName] = urlSeg;
      } else if (isOptional) {
        params[paramName] = void 0;
      } else {
        return null;
      }
    }
  }
  const matchedSegmentCount = Math.min(urlSegments.length, routeSegments.length);
  return {
    match: true,
    params,
    matchedPath: matchedSegmentCount === 0 ? "/" : "/" + urlSegments.slice(0, matchedSegmentCount).join("/")
  };
}
function matchCatchAll(urlPath, routePath) {
  if (urlPath.includes("//")) {
    return null;
  }
  const catchAllIndex = routePath.indexOf("...[");
  if (catchAllIndex === -1) {
    return matchStandard(urlPath, routePath);
  }
  const prefixPath = routePath.slice(0, catchAllIndex);
  const prefixSegments = prefixPath.split("/").filter(Boolean);
  const urlSegments = urlPath.split("/").filter(Boolean);
  if (urlSegments.length < prefixSegments.length) {
    return null;
  }
  for (let i = 0; i < prefixSegments.length; i++) {
    const prefixSeg = prefixSegments[i];
    const urlSeg = urlSegments[i];
    if (!prefixSeg.startsWith(":")) {
      if (prefixSeg !== urlSeg) {
        return null;
      }
    } else {
      prefixSegments[i] = urlSeg;
    }
  }
  const bracketEnd = routePath.indexOf("]", catchAllIndex);
  const paramName = routePath.slice(catchAllIndex + 4, bracketEnd);
  const isOptional = routePath.slice(bracketEnd + 1) === "?";
  const catchAllSegments = urlSegments.slice(prefixSegments.length);
  const catchAllValue = catchAllSegments.join("/");
  const params = {};
  params[paramName] = catchAllValue || (isOptional ? void 0 : "");
  const routePathSegments = routePath.split("/").filter(Boolean);
  for (let i = 0; i < prefixSegments.length; i++) {
    const prefixSeg = routePathSegments[i];
    if (prefixSeg && prefixSeg.startsWith(":")) {
      const name = prefixSeg.slice(1).replace("?", "");
      params[name] = urlSegments[i];
    }
  }
  return {
    match: true,
    params,
    matchedPath: "/" + urlSegments.slice(0, prefixSegments.length + catchAllSegments.length).join("/")
  };
}
function isSignalValue(value) {
  return isAccessor(value);
}
function insert(parent, accessor, marker2, init) {
  if (isSignalValue(accessor)) {
    return insertExpression(parent, accessor, init, marker2);
  }
  if (typeof accessor !== "function") {
    return insertExpression(parent, accessor, init, marker2);
  }
  let parentNode = parent;
  let current = init;
  const resolveParent = () => {
    if (marker2 && marker2.parentNode) {
      return marker2.parentNode;
    }
    if (Array.isArray(current)) {
      for (let i = 0; i < current.length; i++) {
        const entry = current[i];
        if (entry instanceof Node && entry.parentNode) {
          return entry.parentNode;
        }
        if (entry && typeof entry === "object") {
          const node = entry._node;
          if (node && node.parentNode) {
            return node.parentNode;
          }
        }
      }
      return null;
    }
    if (current instanceof Node && current.parentNode) {
      return current.parentNode;
    }
    if (current && typeof current === "object") {
      const node = current._node;
      if (node && node.parentNode) {
        return node.parentNode;
      }
    }
    return null;
  };
  const stop = createEffect(() => {
    if (typeof DocumentFragment !== "undefined" && parentNode instanceof DocumentFragment) {
      const resolved = resolveParent();
      if (resolved) {
        parentNode = resolved;
      }
    }
    current = insertExpression(parentNode, accessor(), current, marker2);
    if (typeof DocumentFragment !== "undefined" && parentNode instanceof DocumentFragment) {
      const resolved = resolveParent();
      if (resolved) {
        parentNode = resolved;
      }
    }
  });
  if (parent instanceof Element) {
    addElementSubscription(parent, stop);
  }
  return current;
}
function markerSlot(accessor, markerId = "hfx:slot") {
  const fragment = document.createDocumentFragment();
  const startMarker = document.createComment(markerId);
  const endMarker = document.createComment(`${markerId}:end`);
  fragment.appendChild(startMarker);
  fragment.appendChild(endMarker);
  const resolveValue = () => {
    if (isSignalValue(accessor)) {
      return accessor();
    }
    if (typeof accessor === "function") {
      return accessor();
    }
    return accessor;
  };
  const wrapped = () => {
    const parent = endMarker.parentNode;
    if (parent) {
      let node = startMarker.nextSibling;
      while (node && node !== endMarker) {
        const next = node.nextSibling;
        parent.removeChild(node);
        node = next;
      }
    }
    return resolveValue();
  };
  insert(fragment, wrapped, endMarker);
  return fragment;
}
function insertExpression(parent, value, current, marker2, unwrapArray = true) {
  const hydrating = isHydrationEnabled();
  if (hydrating && marker2 && marker2.nodeType === 8 && marker2.textContent && (marker2.textContent === "hfx:dyn" || marker2.textContent.startsWith("hfx:dyn:") || marker2.textContent.startsWith("#"))) {
    const prev = marker2.previousSibling;
    const next = marker2.nextSibling;
    const reuse = prev && prev.nodeType === 3 ? prev : next && next.nodeType === 3 ? next : null;
    if (reuse && current === void 0) {
      const textNode2 = reuse;
      const valueText = value == null ? "" : String(value);
      if (textNode2.data !== valueText) {
        textNode2.data = valueText;
      }
      return { _node: textNode2, toString: () => textNode2.data };
    }
  }
  if (value == null) {
    if (current !== null && current !== void 0) {
      cleanChildren(parent, current, marker2);
    }
    return null;
  }
  if (Array.isArray(value)) {
    if (unwrapArray) {
      if (current != null) {
        cleanChildren(parent, current, marker2);
      }
      return insertArray(parent, value, current, marker2);
    }
    value = String(value);
  }
  if (typeof DocumentFragment !== "undefined" && value instanceof DocumentFragment) {
    if (current != null) {
      cleanChildren(parent, current, marker2);
    }
    const nodes = Array.from(value.childNodes);
    const insertBeforeNode2 = marker2 && marker2.parentNode === parent ? marker2 : null;
    for (let i = 0; i < nodes.length; i++) {
      parent.insertBefore(nodes[i], insertBeforeNode2);
    }
    return nodes;
  }
  if (value instanceof Node) {
    if (current !== value) {
      if (current != null) {
        cleanChildren(parent, current, marker2);
      }
      const insertBeforeNode2 = marker2 && marker2.parentNode === parent ? marker2 : null;
      parent.insertBefore(value, insertBeforeNode2);
    }
    return value;
  }
  if (isAccessor(value)) {
    const initialResult = value();
    if (initialResult instanceof Node) {
      const insertBeforeNode2 = marker2 && marker2.parentNode === parent ? marker2 : null;
      parent.insertBefore(initialResult, insertBeforeNode2);
      let currentNode = initialResult;
      const stop = createEffect(() => {
        const newResult = value();
        if (newResult !== currentNode) {
          if (newResult instanceof Node) {
            if (currentNode.parentNode === parent) {
              parent.replaceChild(newResult, currentNode);
            } else {
              parent.insertBefore(newResult, insertBeforeNode2);
            }
            currentNode = newResult;
          } else {
            const textNode2 = document.createTextNode(String(newResult));
            if (currentNode.parentNode === parent) {
              parent.replaceChild(textNode2, currentNode);
            } else {
              parent.insertBefore(textNode2, insertBeforeNode2);
            }
            currentNode = textNode2;
          }
        }
      });
      if (parent instanceof Element) {
        addElementSubscription(parent, stop);
      }
      const hasDestroy = typeof value.destroy === "function";
      if (hasDestroy && parent instanceof Element) {
        addElementSignal(parent, value);
      }
      return currentNode;
    } else {
      const textNode2 = document.createTextNode(String(initialResult));
      const insertBeforeNode2 = marker2 && marker2.parentNode === parent ? marker2 : null;
      parent.insertBefore(textNode2, insertBeforeNode2);
      const stop = createEffect(() => {
        textNode2.data = String(value());
      });
      if (parent instanceof Element) {
        addElementSubscription(parent, stop);
      }
      const hasDestroy = typeof value.destroy === "function";
      if (hasDestroy && parent instanceof Element) {
        addElementSignal(parent, value);
      }
      return { _node: textNode2, toString: () => textNode2.data, _cleanup: stop };
    }
  }
  const stringValue = String(value);
  if (current && typeof current === "object" && current._node instanceof Text) {
    const node = current._node;
    node.data = stringValue;
    return current;
  }
  if (hydrating) {
    const existing = marker2 && marker2.parentNode === parent ? marker2.previousSibling : parent.lastChild;
    if (existing instanceof Text) {
      if (current === void 0 || existing.data === stringValue) {
        existing.data = stringValue;
        return { _node: existing, toString: () => stringValue };
      }
    }
  }
  const textNode = document.createTextNode(stringValue);
  if (current != null) {
    cleanChildren(parent, current, marker2);
  }
  const insertBeforeNode = marker2 && marker2.parentNode === parent ? marker2 : null;
  parent.insertBefore(textNode, insertBeforeNode);
  return { _node: textNode, toString: () => stringValue };
}
function insertArray(parent, array, _current, marker2) {
  const normalized = [];
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    normalized.push(insertExpression(parent, value, null, marker2, false));
  }
  return normalized;
}
function cleanChildren(parent, current, marker2) {
  if (Array.isArray(current)) {
    for (let i = 0; i < current.length; i++) {
      cleanChildren(parent, current[i], marker2);
    }
  } else if (current && typeof current === "object" && current._node instanceof Text) {
    const node = current._node;
    if (node.parentNode === parent) {
      parent.removeChild(node);
    }
  } else if (current instanceof Node) {
    if (current.parentNode === parent) {
      parent.removeChild(current);
    }
  } else {
    const node = marker2 ? marker2.previousSibling : parent.lastChild;
    if (node && node.parentNode === parent) {
      parent.removeChild(node);
    }
  }
}
function isBrowser() {
  return typeof window !== "undefined";
}
function createRouter(routes) {
  const [currentPath, setCurrentPath] = createSignal("/");
  const [currentSearch, setCurrentSearch] = createSignal({});
  const currentMatch = createComputed(() => {
    const path = currentPath();
    const search = currentSearch();
    const match = matchFirst(routes, path, search);
    if (!match || match.error)
      return match;
    const route = match.route;
    let validatedParams = match.params;
    let validatedSearch = match.search;
    let error;
    const paramsValidator = route._paramsValidator;
    if (paramsValidator) {
      try {
        validatedParams = paramsValidator(match.params);
      } catch (e) {
        error = { type: "params", message: e instanceof Error ? e.message : "Invalid params", details: e };
      }
    }
    const searchValidator = route._searchValidator;
    if (searchValidator) {
      try {
        validatedSearch = searchValidator(match.search);
      } catch (e) {
        error = error || { type: "search", message: e instanceof Error ? e.message : "Invalid search params", details: e };
      }
    }
    return error ? { ...match, error, params: validatedParams, search: validatedSearch } : { ...match, params: validatedParams, search: validatedSearch };
  });
  const navigate = (path, options) => {
    const replace = options?.replace ?? false;
    const scroll = options?.scroll ?? true;
    const { path: newPath, search } = parseUrl(path);
    setCurrentPath(newPath);
    setCurrentSearch(search);
    if (isBrowser()) {
      if (replace) {
        window.history.replaceState({}, "", path);
      } else {
        window.history.pushState({}, "", path);
      }
      window.dispatchEvent(new CustomEvent("hfx:navigate"));
      if (scroll) {
        window.scrollTo(0, 0);
      }
    }
  };
  const Link2 = function Link22(props) {
    const paramKeys = createComputed(() => {
      const matches = props.to.path.match(/:(\w+)/g) || [];
      const arrayMatches = props.to.path.match(/\[(\w+)\]/g) || [];
      return [...matches, ...arrayMatches];
    });
    const path = createComputed(() => {
      let result = props.to.path;
      for (const key of paramKeys()) {
        const paramKey = key.replace(/[:\[\]]/g, "");
        const value = props.params?.[paramKey];
        if (Array.isArray(value)) {
          result = result.replace(key, value.join("/"));
        } else if (value !== void 0) {
          result = result.replace(key, String(value));
        }
      }
      return result;
    });
    const searchEntries = createComputed(() => Object.entries(props.search ?? {}).filter(([, v]) => v !== void 0 && v !== null));
    const searchString = createComputed(() => searchEntries().map(([k, v]) => `${k}=${v}`).join("&"));
    const fullPath = createComputed(() => searchString() ? `${path()}?${searchString()}` : path());
    return jsx("a", { href: fullPath(), class: props.class, onclick: (e) => {
      e.preventDefault();
      navigate(fullPath());
    }, children: [marker(), props.children] });
  };
  function Router2(props) {
    let initialized = false;
    createEffect(() => {
      if (initialized)
        return;
      initialized = true;
      if (props.initialPath) {
        const { path, search } = parseUrl(props.initialPath);
        setCurrentPath(path);
        setCurrentSearch(search);
        return;
      }
      if (props.initialSearch) {
        setCurrentSearch(props.initialSearch);
      }
    });
    createEffect(() => {
      if (isBrowser()) {
        const handleNavigate = () => {
          const pathname = window.location.pathname;
          const searchString = window.location.search;
          setCurrentPath(pathname);
          setCurrentSearch(parseSearchParams(searchString));
        };
        window.addEventListener("popstate", handleNavigate);
        window.addEventListener("hfx:navigate", handleNavigate);
        return () => {
          window.removeEventListener("hfx:navigate", handleNavigate);
          window.removeEventListener("popstate", handleNavigate);
        };
      }
    });
    createEffect(() => {
      if (props.onRouteChange) {
        props.onRouteChange(currentMatch());
      }
    });
    const renderRoute = () => {
      const match = currentMatch();
      if (!match) {
        if (props.notFound) {
          return untrack(() => props.notFound({ path: currentPath() }));
        }
        return null;
      }
      const error = match.error;
      if (error) {
        const onRouteError = props.onRouteError;
        if (onRouteError) {
          return untrack(() => onRouteError(error));
        }
        return untrack(() => jsx("div", { style: { color: "red", padding: "20px" }, children: ["\n            Route Error: ", [marker(), error.message]] }));
      }
      const view = match.route.view;
      if (!view) {
        return null;
      }
      return untrack(() => view({ params: match.params, search: match.search }));
    };
    if (typeof document === "undefined") {
      return renderRoute();
    }
    return markerSlot(renderRoute, "hfx:router");
  }
  return {
    Router: Router2,
    Link: Link2,
    currentPath,
    currentSearch,
    currentMatch,
    navigate,
    routes
  };
}
const HomeRoute = createRoute(
  "/about",
  {
    view: HomePage
  }
);
function HomePage() {
  const [count, setCount] = createSignal(0, { key: "homepage-counter" });
  const increment = () => {
    setCount(count() + 1);
  };
  const decrement = () => {
    setCount(count() - 1);
  };
  const reset = () => {
    setCount(0);
  };
  return jsx("div", { class: "min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white", children: [jsx("nav", { children: jsx(TopNav, {}) }), jsx("main", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [jsx("section", { class: "text-center mb-16", children: [jsx("h1", { class: "text-5xl md:text-7xl font-bold p-2 mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent", children: "\n                        🚀 Welcome to HyperFX JSX\n                    " }), jsx("p", { class: "text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed", children: "\n                        A modern SSR framework with reactive JSX components\n                    " })] }), jsx("section", { class: "mb-16", "aria-labelledby": "counter-heading", children: jsx("div", { class: "bg-linear-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm p-10 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10", children: [jsx("h2", { id: "counter-heading", class: "text-3xl font-semibold mb-8 text-center text-blue-300", children: "🧮 Interactive Counter" }), jsx("div", { class: "text-center", children: [jsx("div", { class: "text-7xl md:text-8xl font-bold mb-10 text-transparent bg-linear-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text animate-pulse", role: "status", "aria-live": "polite", children: [marker(), count] }), jsx("div", { class: "flex flex-wrap justify-center gap-6", children: [jsx("button", { class: "group px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25", onclick: increment, type: "button", "aria-label": "Increment counter", children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-2xl group-hover:animate-bounce", children: "➕" }), "\n                                        Increment\n                                    "] }) }), jsx("button", { class: "group px-8 py-4 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25", onclick: decrement, type: "button", "aria-label": "Decrement counter", children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-2xl group-hover:animate-bounce", children: "➖" }), "\n                                        Decrement\n                                    "] }) }), jsx("button", { class: "group px-8 py-4 bg-linear-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25", onclick: reset, type: "button", "aria-label": "Reset counter to zero", children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-2xl group-hover:animate-spin", children: "🔄" }), "\n                                        Reset\n                                    "] }) })] })] })] }) }), jsx("section", { class: "mb-12", "aria-labelledby": "features-heading", children: [jsx("h2", { class: "sr-only", children: "Features" }), jsx("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [jsx("article", { class: "bg-gray-800 p-6 rounded-lg border border-gray-700", children: [jsx("h3", { class: "text-xl font-semibold mb-3 text-green-400", children: "⚡ Fast SSR" }), jsx("p", { class: "text-gray-300", children: "Server-side rendering with automatic hydration for optimal performance and SEO benefits." })] }), jsx("article", { class: "bg-gray-800 p-6 rounded-lg border border-gray-700", children: [jsx("h3", { class: "text-xl font-semibold mb-3 text-blue-400", children: "🔄 Reactive" }), jsx("p", { class: "text-gray-300", children: "Fine-grained reactivity with signals that update only what's needed for maximum efficiency." })] }), jsx("article", { class: "bg-gray-800 p-6 rounded-lg border border-gray-700", children: [jsx("h3", { class: "text-xl font-semibold mb-3 text-purple-400", children: "📱 JSX" }), jsx("p", { class: "text-gray-300", children: "Familiar React-like JSX syntax with TypeScript support for a great developer experience." })] })] })] }), jsx("section", { "aria-labelledby": "getting-started-heading", children: jsx("article", { class: "bg-gray-800 p-6 rounded-lg border border-gray-700", children: [jsx("h3", { id: "getting-started-heading", class: "text-xl font-semibold mb-4 text-orange-400", children: "🚀 Getting Started" }), jsx("p", { class: "text-gray-300 mb-4", children: "This counter demonstrates HyperFX's reactive capabilities. The count value is stored in a reactive signal that automatically updates the UI when changed." }), jsx("p", { class: "text-gray-300", children: "Try clicking the buttons above - the count updates instantly with no manual DOM manipulation required!" })] }) })] })] });
}
const ProductsRoute = createRoute(
  "/products",
  {
    view: ProductsPage
  }
);
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
const [cart, setCart] = createSignal([]);
const cartTotal = createComputed(
  () => cart().reduce((total, product) => total + product.price, 0)
);
const cartItemCount = createComputed(() => cart().length);
const showCartItems = createComputed(() => cartItemCount() > 0);
const isCartEmpty = createComputed(() => cartItemCount() === 0);
function addToCart(product) {
  const currentCart = cart();
  if (!currentCart.find((item) => item.id === product.id)) {
    setCart([...currentCart, product]);
  }
}
function removeFromCart(productId) {
  const currentCart = cart();
  setCart(currentCart.filter((item) => item.id !== productId));
}
function clearCart() {
  setCart([]);
}
function ProductsPage() {
  return jsx("div", { class: "min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white", children: [jsx(TopNav, {}), jsx("main", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [jsx("section", { class: "text-center mb-16", children: [jsx("h1", { class: "text-5xl md:text-7xl p-2 font-bold mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent", children: "\n            🛍️ HyperFX Products\n          " }), jsx("p", { class: "text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed", children: "\n            Discover our premium tools and components for reactive web development\n          " })] }), jsx("section", { class: "mb-16", "aria-labelledby": "cart-heading", children: jsx("div", { class: "bg-linear-to-br from-green-900/50 via-emerald-900/50 to-teal-900/50 backdrop-blur-sm p-10 rounded-2xl border border-green-500/30 shadow-2xl shadow-green-500/10", children: [jsx("h2", { id: "cart-heading", class: "text-3xl font-semibold mb-8 text-center text-green-300", children: "\n              🛒 Shopping Cart\n            " }), jsx("div", { class: "flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8", children: [jsx("div", { class: "flex flex-col sm:flex-row gap-6 text-xl", children: [jsx("div", { "aria-live": "polite", class: "text-center lg:text-left", children: ["\n                  Items: ", jsx("span", { class: "text-transparent bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold text-2xl", children: [marker(), cartItemCount] })] }), jsx("div", { "aria-live": "polite", class: "text-center lg:text-left", children: ["\n                  Total: ", jsx("span", { class: "text-transparent bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text font-bold text-2xl", children: ["$", [marker(), cartTotal]] })] })] }), jsx("button", { class: "group px-8 py-4 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25", onclick: clearCart, disabled: isCartEmpty, type: "button", "aria-label": `Clear all ${cartItemCount} items from cart`, children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-xl group-hover:animate-bounce", children: "🗑️" }), "\n                  Clear Cart\n                "] }) })] }), jsx(Show, { when: showCartItems, children: jsx("div", { children: [jsx("h3", { class: "text-2xl font-medium mb-6 text-center", children: "Cart Items:" }), jsx("ul", { class: "space-y-4", role: "list", "aria-label": "Items in shopping cart", children: jsx(For, { each: cart, children: (item, index) => jsx("li", { class: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-linear-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300", children: [jsx("div", { class: "flex-1", children: [jsx("span", { class: "font-medium text-lg text-white", children: [marker(), item.name] }), jsx("span", { class: "text-green-400 ml-3 font-bold text-xl", children: ["$", [marker(), item.price]] })] }), jsx("button", { class: "group px-4 py-2 bg-linear-to-r from-red-300 to-rose-400 hover:from-red-800 hover:to-rose-900 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 self-start sm:self-center", onclick: () => removeFromCart(item.id), type: "button", "aria-label": `Remove ${item.name} from cart`, children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-lg group-hover:animate-pulse", children: "❌" }), "\n                            Remove\n                          "] }) })] }) }) })] }) })] }) }), jsx("section", { "aria-labelledby": "products-heading", children: [jsx("h2", { id: "products-heading", class: "text-3xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent", children: "\n            Available Products\n          " }), jsx("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16", children: jsx(For, { each: products, children: [marker(), (product) => {
    const isInCart = createComputed(() => !!cart().find((item) => item.id === product.id));
    const buttonText = createComputed(() => isInCart() ? "In Cart" : "Add to Cart");
    const buttonLabel = createComputed(() => isInCart() ? `${product.name} is already in cart` : `Add ${product.name} to cart for $${product.price}`);
    return jsx("article", { class: "bg-linear-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 group hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10", children: [jsx("header", { class: "mb-6", children: [jsx("div", { class: "flex justify-between items-start mb-4", children: [jsx("h3", { class: "text-2xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300", children: [marker(), product.name] }), jsx("span", { class: "text-sm bg-linear-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-full text-white font-medium", children: [marker(), product.category] })] }), jsx("p", { class: "text-gray-300 text-lg leading-relaxed", children: [marker(), product.description] })] }), jsx("footer", { class: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6", children: [jsx("span", { class: "text-3xl font-bold text-transparent bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text", "aria-label": `Price: ${product.price} dollars`, children: ["\n                        $", [marker(), product.price]] }), jsx("button", { class: "group px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white disabled:from-gray-600 disabled:to-slate-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:ring-blue-500/50 hover:shadow-blue-500/25", onclick: () => addToCart(product), disabled: isInCart, type: "button", "aria-label": buttonLabel, children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-xl group-hover:animate-bounce", children: [marker(), isInCart ? "✓" : "🛒"] }), [marker(), buttonText]] }) })] })] });
  }] }) })] })] })] });
}
function TopNav() {
  return jsx("header", { class: "bg-linear-to-r from-gray-800/95 via-gray-700/95 to-gray-800/95 backdrop-blur-md border-b border-gray-600/50 sticky top-0 z-50", children: jsx("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: jsx("nav", { class: "flex justify-center space-x-12 py-6", role: "navigation", "aria-label": "Main navigation", children: [jsx(Link, { to: HomeRoute, class: "group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative", children: [jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-xl group-hover:animate-bounce", children: "🏠" }), "\n                            Home\n                        "] }), jsx("span", { class: "absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" })] }), jsx(Link, { to: AboutRoute, class: "group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative", children: [jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-xl group-hover:animate-bounce", children: "📖" }), "\n                            About\n                        "] }), jsx("span", { class: "absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" })] }), jsx(Link, { to: ProductsRoute, class: "group text-blue-400 hover:text-blue-300 transition-all duration-300 text-lg font-medium relative", children: [jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-xl group-hover:animate-bounce", children: "🛍️" }), "\n                            Products\n                        "] }), jsx("span", { class: "absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300" })] })] }) }) });
}
const [featureList, setFeatureList] = createSignal(["SSR", "Hydration", "Routing", "Reactivity"]);
const [newFeature, setNewFeature] = createSignal("");
const featureCount = createComputed(() => featureList().length);
function addFeature() {
  const feature = newFeature().trim();
  if (feature) {
    setFeatureList([...featureList(), feature]);
    setNewFeature("");
  }
}
function removeFeature(index) {
  const features = featureList();
  setFeatureList([...features.slice(0, index), ...features.slice(index + 1)]);
}
function updateNewFeature(event) {
  const value = event.target.value;
  setNewFeature(value);
}
function resetFeatures() {
  setFeatureList(["SSR", "Hydration", "Routing", "Reactivity"]);
  setNewFeature("");
}
const AboutRoute = createRoute(
  "/about",
  {
    view: AboutPage
  }
);
function AboutPage() {
  return jsx("div", { class: "min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white", children: [jsx(TopNav, {}), jsx("main", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [jsx("section", { class: "text-center mb-16", children: [jsx("h1", { class: "text-5xl p-2 md:text-7xl font-bold mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent", children: "\n                        📖 About HyperFX JSX\n                    " }), jsx("p", { class: "text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed", children: "\n                        Learn about our modern SSR framework with JSX support\n                    " })] }), jsx("section", { class: "mb-16", "aria-labelledby": "features-section", children: jsx("div", { class: "bg-linear-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 backdrop-blur-sm p-10 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10", children: [jsx("h2", { id: "features-section", class: "text-3xl font-semibold mb-8 text-center text-purple-300", children: "\n                            🚀 Framework Features\n                        " }), jsx("div", { class: "mb-8", children: [jsx("h3", { class: "text-2xl font-medium mb-6 text-center", children: ["\n                                Feature List (\n                                ", jsx("span", { "aria-live": "polite", class: "text-transparent bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold", children: [marker(), featureCount] }), "\n                                items)\n                            "] }), jsx("ul", { class: "space-y-3 mb-8", role: "list", "aria-label": "Framework features", children: jsx(For, { each: featureList, children: (feature, index) => jsx("li", { class: "flex items-center justify-between bg-linear-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300", role: "listitem", children: [jsx("span", { class: "text-white font-medium text-lg", children: [marker(), feature] }), jsx("button", { class: "group px-4 py-2 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25", onclick: () => removeFeature(index()), type: "button", "aria-label": `Remove ${feature} from feature list`, children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-lg group-hover:animate-pulse", children: "🗑️" }), "\n                                                    Remove\n                                                "] }) })] }) }) }), jsx("form", { class: "flex flex-col lg:flex-row gap-4", onsubmit: (e) => {
    e.preventDefault();
    addFeature();
  }, children: [jsx("label", { for: "new-feature", class: "sr-only", children: "\n                                    Add new feature\n                                " }), jsx("input", { id: "new-feature", type: "text", placeholder: "Add new feature...", class: "flex-1 px-6 py-4 bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 text-lg", value: newFeature, oninput: updateNewFeature, required: true }), jsx("div", { class: "flex gap-4", children: [jsx("button", { type: "submit", class: "group px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25", children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-xl group-hover:animate-bounce", children: "➕" }), "\n                                            Add\n                                        "] }) }), jsx("button", { type: "button", class: "group px-8 py-4 bg-linear-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25", onclick: resetFeatures, children: jsx("span", { class: "flex items-center gap-2", children: [jsx("span", { class: "text-xl group-hover:animate-spin", children: "🔄" }), "\n                                            Reset\n                                        "] }) })] })] })] })] }) }), jsx("section", { class: "mb-16", "aria-labelledby": "technical-details", children: [jsx("h2", { id: "technical-details", class: "text-3xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent", children: "\n                        Technical Excellence\n                    " }), jsx("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [jsx("article", { class: "bg-linear-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300 group", children: [jsx("h3", { class: "text-2xl font-semibold mb-6 text-green-400 group-hover:text-green-300 transition-colors duration-300", children: "\n                                🔧 Technical Stack\n                            " }), jsx("ul", { class: "space-y-3 text-gray-300", role: "list", children: [jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-green-400 rounded-full" }), jsx("strong", { children: "HyperFX:" }), " Reactive UI framework\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-blue-400 rounded-full" }), jsx("strong", { children: "Vinxi:" }), " Full-stack meta-framework\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-purple-400 rounded-full" }), jsx("strong", { children: "JSX:" }), " Familiar React-like syntax\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-cyan-400 rounded-full" }), jsx("strong", { children: "Tailwind CSS v4:" }), " Modern styling\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-indigo-400 rounded-full" }), jsx("strong", { children: "TypeScript:" }), " Type safety\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-orange-400 rounded-full" }), jsx("strong", { children: "Vite:" }), " Fast development\n                                "] })] })] }), jsx("article", { class: "bg-linear-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 group", children: [jsx("h3", { class: "text-2xl font-semibold mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300", children: "\n                                ⚡ Performance\n                            " }), jsx("ul", { class: "space-y-3 text-gray-300", role: "list", children: [jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-yellow-400 rounded-full" }), "\n                                    Fast server-side rendering\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-green-400 rounded-full" }), "\n                                    Progressive hydration\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-blue-400 rounded-full" }), "\n                                    Minimal JavaScript bundle\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-purple-400 rounded-full" }), "\n                                    Efficient client-side updates\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-pink-400 rounded-full" }), "\n                                    Smart caching strategies\n                                "] }), jsx("li", { class: "flex items-center gap-3", children: [jsx("span", { class: "w-2 h-2 bg-cyan-400 rounded-full" }), "\n                                    SEO-friendly architecture\n                                "] })] })] })] })] }), jsx("section", { "aria-labelledby": "philosophy-heading", children: jsx("article", { class: "bg-linear-to-br from-orange-900/50 via-amber-900/50 to-yellow-900/50 backdrop-blur-sm p-10 rounded-2xl border border-orange-500/30 shadow-2xl shadow-orange-500/10", children: [jsx("h3", { id: "philosophy-heading", class: "text-3xl font-semibold mb-8 text-center text-orange-400", children: "\n                            💭 Philosophy\n                        " }), jsx("div", { class: "space-y-6 text-lg leading-relaxed", children: [jsx("p", { class: "text-gray-300", children: "\n                                HyperFX combines the best of both worlds: the familiar JSX syntax that developers love\n                                with the performance and simplicity of a lightweight framework.\n                            " }), jsx("p", { class: "text-gray-300", children: "\n                                We believe in progressive enhancement, where your app works great even without JavaScript,\n                                but becomes more interactive as it loads. This ensures the best user experience\n                                across all devices and network conditions.\n                            " })] })] }) })] })] });
}
const router = createRouter(
  [
    AboutRoute,
    HomeRoute,
    ProductsRoute
  ]
);
const Router = router.Router;
const Link = router.Link;
function App(props) {
  return jsx("div", { id: "app", children: jsx(Router, { initialPath: props.pathname }) });
}
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
    console.warn("Failed to locate client script in production build:", e);
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
    const appElement = jsx(App, { pathname });
    const { html, hydrationData } = renderToString(appElement, {
      ssrHydration: true
    });
    const hydrationScript = renderHydrationData(hydrationData);
    disableSSRMode();
    const clientScript = await getClientScriptPath();
    const documentHtml = createDocument({
      "title": "HyperFX SSR Example",
      "description": "A server-side rendered example using HyperFX",
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
