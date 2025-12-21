(function () { const e = document.createElement("link").relList; if (e && e.supports && e.supports("modulepreload")) return; for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r); new MutationObserver(r => { for (const i of r) if (i.type === "childList") for (const a of i.addedNodes) a.tagName === "LINK" && a.rel === "modulepreload" && s(a) }).observe(document, { childList: !0, subtree: !0 }); function n(r) { const i = {}; return r.integrity && (i.integrity = r.integrity), r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? i.credentials = "include" : r.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i } function s(r) { if (r.ep) return; r.ep = !0; const i = n(r); fetch(r.href, i) } })(); let ie = !1; const ae = new Set; class Sr { constructor(e) { this.subscribers = new Set, this._value = e } get() { return ie && ae.add(this.callableSignal), this._value } set(e) { return Object.is(this._value, e) || (this._value = e, this.subscribers.forEach(n => { try { n(e) } catch (s) { console.error("Signal subscriber error:", s) } })), e } subscribe(e) { return this.subscribers.add(e), () => { this.subscribers.delete(e) } } peek() { return this._value } update(e) { return this.set(e(this._value)) } get subscriberCount() { return this.subscribers.size } } function fe(t) { const e = new Sr(t), n = Object.assign(s => s !== void 0 ? e.set(s) : e.get(), { get: () => e.get(), set: s => e.set(s), subscribe: s => e.subscribe(s), peek: () => e.peek(), update: s => e.update(s) }); return Object.defineProperty(n, "subscriberCount", { get() { return e.subscriberCount }, enumerable: !0, configurable: !0 }), e.callableSignal = n, n } function Er(t) { const e = ie; ie = !0, ae.clear(); let n; try { n = t() } finally { ie = e } const s = fe(n), r = Array.from(ae); ae.clear(); const i = s.set; s.set = () => { throw new Error("Cannot set computed signal directly. Computed signals are read-only.") }; const a = r.map(l => l.subscribe(() => { const d = t(); i(d) })); return s._unsubscribers = a, s } function vr(t) { const e = ie; ie = !0, ae.clear(); let n; n = t(); const r = Array.from(ae).map(i => i.subscribe(() => { const a = ie; ie = !0, ae.clear(), typeof n == "function" && n(), n = t(), ie = a, ae.clear() })); return ie = e, ae.clear(), () => { r.forEach(i => { i() }), typeof n == "function" && n() } } function ye(t) { return typeof t == "function" && "subscribe" in t && "get" in t && "set" in t } let _r = 0; const Wt = new WeakMap; function Tr(t) { t() } function Ar() { return typeof window > "u" || typeof document > "u" } function Rr() { return String(++_r).padStart(6, "0") } function Cr(t, e) { const n = Wt.get(t); n ? n.add(e) : Wt.set(t, new Set([e])) } function on(t, e, n) { if (e === "children" || e === "key") return; if (e.startsWith("on") && typeof n == "function") { const r = e.slice(2).toLowerCase(); t.addEventListener(r, n); return } if (ye(n)) { const r = () => on(t, e, n()); r(); const i = n.subscribe(() => Tr(r)); Cr(t, i); return } if (e === "class") { n != null ? t.className = String(n) : t.className = ""; return } if (new Set(["disabled", "checked", "readonly", "readOnly", "required", "autofocus", "autoplay", "controls", "default", "defer", "hidden", "inert", "loop", "multiple", "muted", "novalidate", "open", "reversed", "selected"]).has(e)) { const r = !!n; e === "checked" && t instanceof HTMLInputElement ? (t.checked = r, t.toggleAttribute("checked", r)) : (e === "readonly" || e === "readOnly") && t instanceof HTMLInputElement ? (t.readOnly = r, t.toggleAttribute("readonly", r)) : e === "disabled" ? (t.disabled = r, t.toggleAttribute("disabled", r)) : t.toggleAttribute(e, r); return } if (e === "style") { n == null ? t.removeAttribute("style") : typeof n == "string" ? t.setAttribute("style", n) : typeof n == "object" ? Object.entries(n).forEach(([r, i]) => { if (i != null) try { const a = r.replace(/-([a-z])/g, (l, d) => d.toUpperCase()); t.style[a] = String(i) } catch (a) { console.warn(`Failed to set CSS property "${r}":`, a) } }) : t.setAttribute("style", String(n)); return } if (e === "value" && t instanceof HTMLInputElement) { t.value = String(n || ""); return } if (e === "innerHTML" || e === "textContent") { t[e] = n; return } n != null ? t.setAttribute(e, String(n)) : t.removeAttribute(e) } const Nr = { applyAttribute(t, e, n) { on(t, e, n) }, applyAttributes(t, e) { for (const [n, s] of Object.entries(e)) this.applyAttribute(t, n, s) } }, Mr = Symbol("HyperFX.Fragment"); function Or(t, e) { let n; return n = document.createElement(t), Ar() || n.setAttribute("data-hfxh", Rr()), e && Nr.applyAttributes(n, e), n } function Ir(t) { const e = document.createTextNode(""), n = () => { let s = ""; ye(t) ? s = String(t()) : s = String(t), e.textContent = s }; return n(), ye(t) && t.subscribe(n), e } function an(t, e, n) { const s = Array.isArray(e) ? e : [e]; for (const r of s) if (!(r == null || r === !1 || r === !0)) if (ye(r)) { const i = r(); if (i instanceof Node) t.appendChild(i); else { const a = Ir(r); t.appendChild(a) } } else if (typeof r == "function") try { const i = r(); if (i instanceof Node) t.appendChild(i), n?.add(i); else if (Array.isArray(i)) an(t, i, n); else { const a = document.createTextNode(String(i)); t.appendChild(a), n?.add(a) } } catch (i) { console.warn("Error rendering function child:", i) } else if (typeof r == "object" && r instanceof Node) t.appendChild(r); else { const i = document.createTextNode(String(r)); t.appendChild(i) } } function mt(t, e) { if (!e) return; an(t, e, void 0) } function A(t, e, n) { if (t === Mr || t === ln) { const r = e?.children, i = document.createDocumentFragment(); return mt(i, r), i } if (typeof t == "function") { const r = new Proxy(e || {}, { get(i, a, l) { const d = Reflect.get(i, a, l); return ye(d) ? d() : d } }); return t(r) } const s = Or(t, e); return e?.children && mt(s, e.children), s } const $ = A; function ln(t) { const e = document.createDocumentFragment(); return mt(e, t.children), e } function Ie(t) { return Er(t) } function ue(t) { return vr(t) } const bt = new Map; function Lr(t) { const e = Symbol("Context"); return { id: e, defaultValue: t, Provider: s => { let r = bt.get(e); r || (r = [], bt.set(e, r)), r.push(s.value); let i; try { typeof s.children == "function" ? i = s.children() : (console.warn("Context.Provider: children should be a function to receive context value."), i = s.children) } finally { r.pop() } if (Array.isArray(i)) { const a = document.createDocumentFragment(); return i.forEach(l => { l instanceof Node && a.appendChild(l) }), a } return i } } } function Ae(t) { const e = bt.get(t.id); return e && e.length > 0 ? e[e.length - 1] : t.defaultValue } const we = Lr(null); function Pr(t) { Ae(we) && console.warn("Router: Nested routers are not fully supported yet"); const n = fe(t.initialPath || window.location.pathname + window.location.search), s = fe([n()]), r = fe(0); ue(() => { const c = () => { const m = window.location.pathname + window.location.search || "/"; n(m); const k = [...s()]; k[r()] = m, s(k) }; return window.addEventListener("popstate", c), () => { window.removeEventListener("popstate", c) } }); const d = { currentPath: n, navigate: (c, m = {}) => { if (console.log("Router: navigate called", c), m.replace) { window.history.replaceState({}, "", c); const k = [...s()]; k[r()] = c, s(k) } else { window.history.pushState({}, "", c); const k = [...s().slice(0, r() + 1), c]; s(k), r(r() + 1) } console.log("Router: updating currentPath signal", c), n(c) }, back: () => { if (r() > 0) { const c = r() - 1; r(c); const m = s()[c] || "/"; window.history.back(), n(m) } }, forward: () => { if (r() < s().length - 1) { const c = r() + 1; r(c); const m = s()[c] || "/"; window.history.forward(), n(m) } } }; return we.Provider({ value: d, children: t.children }) } function Kt(t) { const e = document.createDocumentFragment(), n = document.createComment(`Route start: ${t.path}`), s = document.createComment(`Route end: ${t.path}`); e.appendChild(n), e.appendChild(s); let r = [], i = !1; const { path: a, component: l, children: d, exact: c, ...m } = t, k = Ae(we); return ue(() => { if (!k) return; const b = k.currentPath, S = b().split("?")[0], E = c !== void 0 && c ? S === a : S.startsWith(a); if (E === i) return; i = E; const F = n.parentNode || e; if (r.forEach(L => { L.parentNode === F && L.parentNode?.removeChild(L) }), r = [], E) { let L; l ? L = l({ ...m }) : typeof d == "function" ? L = d() : L = d, L && (Array.isArray(L) ? L : [L]).forEach(W => { if (W instanceof Node) F.insertBefore(W, s), r.push(W); else if (W != null) { const J = document.createTextNode(String(W)); F.insertBefore(J, s), r.push(J) } }) } }), e } function Ke(t) { const e = document.createElement("a"); e.href = t.to, e.className = t.class !== void 0 ? t.class : ""; const n = Ae(we); console.log("Link: render", t.to, "context:", !!n); const s = r => { console.log("Link: clicked", t.to), r.preventDefault(), t.onclick && t.onclick(r), n ? n.navigate(t.to, { replace: t.replace !== void 0 ? t.replace : !1 }) : (window.history.pushState({}, "", t.to), window.dispatchEvent(new PopStateEvent("popstate"))) }; return e.addEventListener("click", s), ue(() => { if (!n) return; const r = n.currentPath, i = r(), a = t.exact !== void 0 && t.exact ? i === t.to : i.startsWith(t.to), l = t.activeClass !== void 0 ? t.activeClass : "active"; a ? e.classList.add(l) : e.classList.remove(l) }), typeof t.children == "string" ? e.textContent = t.children : Array.isArray(t.children) ? t.children.forEach(r => { e.appendChild(r) }) : t.children && e.appendChild(t.children), e } function cn() { const t = Ae(we); return t ? t.currentPath : fe(window.location.pathname) } function Br() { const t = Ae(we); return (e, n) => { t ? t.navigate(e, n) : n?.replace ? window.history.replaceState({}, "", e) : window.history.pushState({}, "", e) } } function $r(t) { const e = Ae(we); return Ie(() => (e && e.currentPath(), new URLSearchParams(window.location.search).get(t))) } function Dr(t) { const e = document.createDocumentFragment(), n = document.createComment("For start"), s = document.createComment("For end"); e.appendChild(n), e.appendChild(s); const r = Array.isArray(t.children) ? t.children[0] : t.children; if (typeof r != "function") throw new Error("For component children must be a function."); const i = new Map; return ue(() => { let l = []; ye(t.each) || typeof t.each == "function" ? l = t.each() : l = t.each, Array.isArray(l) || (l = []); const d = n.parentNode || e, c = [], m = new Map; i.forEach((b, C) => { m.set(C, [...b]) }), l.forEach((b, C) => { const S = m.get(b); if (S && S.length > 0) { const E = S.shift(); E.indexSignal(C), c.push(E) } else { const E = fe(C), D = r(b, E); let F = []; D instanceof DocumentFragment ? F = Array.from(D.childNodes) : D instanceof Node && (F = [D]), c.push({ nodes: F, indexSignal: E }) } }), m.forEach(b => { b.forEach(C => { C.nodes.forEach(S => S.parentElement?.removeChild(S)) }) }); let k = s; for (let b = c.length - 1; b >= 0; b--) { const C = c[b]; if (!C) continue; const S = C.nodes; for (let E = S.length - 1; E >= 0; E--) { const D = S[E]; D.nextSibling !== k && d.insertBefore(D, k), k = D } } i.clear(), c.forEach((b, C) => { const S = l[C], E = i.get(S) || []; E.push(b), i.set(S, E) }) }), e } function Jt(t) { const e = document.createDocumentFragment(), n = document.createComment("Show start"), s = document.createComment("Show end"); e.appendChild(n), e.appendChild(s); let r = []; return ue(() => { const i = typeof t.when == "function" || ye(t.when) ? t.when() : t.when, a = n.parentNode || e; r.forEach(d => d.parentElement?.removeChild(d)), r = []; const l = i ? t.children : t.fallback; if (l) { const d = typeof l == "function" ? l() : l, c = d instanceof DocumentFragment ? Array.from(d.childNodes) : [d]; c.forEach(m => a.insertBefore(m, s)), r = c } }), e } function Hr(t) { const e = t.tagName, n = {}, s = [], r = t.childNodes, i = t.attributes; for (const a of i) { const l = a.name, d = a.value; n[l] = d } for (const a of r) s.push(un(a)); return { tag: e, attrs: n, children: s } } function un(t) { return t instanceof Text ? t.textContent ?? "" : Hr(t) } function dn(t) { if (typeof t == "string") return document.createTextNode(t); const e = document.createElement(t.tag); for (const s of t.children) e.appendChild(dn(s)); const n = Object.keys(t.attrs); for (const s of n) e.setAttribute(s, t.attrs[s]); return e } const zr = `# The basics

## Creating HTML with JSX

HyperFX is built around JSX, providing a familiar and powerful way to create HTML elements directly in your code. Unlike other frameworks, HyperFX JSX returns **actual DOM elements**, not virtual nodes.

\`\`\`tsx
function MyComponent() {
  return (
    <div>
      <span>Hello</span>
      <p>World!</p>
    </div>
  );
}
\`\`\`

## Natural DOM Integration

Because HyperFX components return real DOM nodes, you can use them anywhere you'd use a standard element:

\`\`\`tsx
const app = document.getElementById("app")!;
const myElement = <MyComponent />;

// It's just a div!
console.log(myElement instanceof HTMLDivElement); // true

app.appendChild(myElement);
\`\`\`

## Reactive Text and Attributes

You can embed logic directly in your JSX. When you use a signal, HyperFX automatically tracks the dependency and updates only that specific part of the DOM.

\`\`\`tsx
import { createSignal } from "hyperfx";

function Greeting() {
  const name = createSignal("World");

  return (
    <div>
      <input 
        value={name} 
        oninput={(e) => name(e.target.value)} 
      />
      <h1>Hello, {name}!</h1>
    </div>
  );
}
\`\`\`

## Styling

Styles can be strings or reactive objects:

\`\`\`tsx
const color = createSignal("red");

<div style={{ color: color, fontWeight: "bold" }}>
  Reactive styles!
</div>
\`\`\`
`, Fr = `# Routing & SPA

HyperFX provides a declarative, component-based routing system that allows you to build Single Page Applications (SPAs) with ease.

## Core Components


### \`<Router>\`

The \`<Router>\` component is the root of your routing system. It manages the current path and provides routing context to its children.

### \`<Route>\`

The \`<Route>\` component renders its content only when the current path matches its \`path\` prop.

\`\`\`tsx
import { Router, Route } from "hyperfx";

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      {/* Catch-all route */}
      <Route path="*" component={NotFoundPage} />
    </Router>
  );
}
\`\`\`


### \`<Link>\`

The \`<Link>\` component provides a declarative way to navigate between routes. It prevents full page reloads and updates the URL.

\`\`\`tsx
<nav>
  <Link to="/">Home</Link>
  <Link to="/about" activeClass="font-bold">About</Link>
</nav>
\`\`\`

---

## Routing Hooks


### \`usePath()\`

Returns a reactive signal containing the current URL path.

\`\`\`tsx
import { usePath } from "hyperfx";

function PathDisplay() {
  const path = usePath();
  return <p>Current path is: {path}</p>;
}
\`\`\`


### \`useNavigate()\`

Returns a function that can be used to programmatically navigate.

\`\`\`tsx
import { useNavigate } from "hyperfx";

function LogoutButton() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };
  
  return <button onclick={handleLogout}>Logout</button>;
}
\`\`\`

---

## Query Parameters & Params


### \`getQueryValue(key)\`

Returns the value of a query parameter from the current URL.

\`\`\`tsx
import { getQueryValue } from "hyperfx";

function Docs() {
  const doc = getQueryValue("doc") || "home";
  // ...
}
\`\`\`


### \`getParam(key)\` (In progress)

Used for extracting parameters from dynamic routes (e.g., \`/user/:id\`). Note: Full dynamic route support is currently being refined.

---

## Manual Navigation

If you need to navigate outside of a component, you can use the \`navigateTo\` function:

\`\`\`tsx
import { navigateTo } from "hyperfx";

function checkAuth() {
  if (!isLoggedIn) {
    navigateTo("/login");
  }
}
\`\`\`
`, Ur = `# Components

Components in HyperFX are just functions that return JSX elements. They can use signals for reactive state management.

\`\`\`tsx
import { createSignal } from "hyperfx";

// Simple component function
function MyComponent() {
  const [text, setText] = createSignal("");

  return (
    <div class="p-2">
      <p class="text-2xl text-red-500">
        <span class="font-semibold">Text: </span>
        {text}
      </p>
      <label for="live_type">live update </label>
      <p>
        This is basic text with a{" "}
        <span style="font-weight: bold;">bold</span>{" "}
        text in the middle.
      </p>
      <input
        class="border-2 rounded-xl p-2"
        name="live_type"
        id="live_type_input"
        type="text"
        value={text()}
        oninput={(e) => {
          setText((e.target as HTMLInputElement).value);
        }}
      />
    </div>
  );
}

// Usage
const myComponent = <MyComponent />;
document.body.appendChild(myComponent);
\`\`\`

## Should you use them?

Yes! Components are the recommended way to structure your HyperFX applications. They provide clean separation of concerns and work seamlessly with the signal-based reactivity system.

Since components are just functions that return JSX elements, you can:
- Pass props as function parameters
- Use signals for internal state
- Compose them easily
- Return arrays of elements when needed

Example:

\`\`\`tsx
import { elementToHFXObject } from "hyperfx";

function JsonRepresentation({ element }: { element: Element }) {
  return (
    <div
      id="my_id"
      class="bg-black/20 p-2 border-2 border-gray-500 rounded-md"
    >
      <output name="json_output">
        <pre class="overflow-x-scroll">
          {JSON.stringify(elementToHFXObject(element), null, "  ")}
        </pre>
      </output>
    </div>
  );
}
\`\`\`
`, Xr = `# Get started with HyperFX

Add HyperFX to your project.

\`\`\`bash
pnpm add hyperfx
\`\`\`

## Live development with vite

Use HyperFX with vite to develop with live updating.
Use the following command to create a folder with a new vite project with HyperFX.

\`\`\`bash
pnpm create vite my-hyperfx-app --template vanilla-ts
pnpm add hyperfx
\`\`\`

After removing the vite base content inside the files you can write your HyperFX code in the src/main.ts file.

## JSX Setup

HyperFX now supports JSX! Update your \`tsconfig.json\` to enable JSX:

\`\`\`json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hyperfx"
  }
}
\`\`\`

Rename your \`main.ts\` to \`main.tsx\` and update your HTML:

Example \`./index.html\`

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <script type="module" src="./src/main.tsx" defer><\/script>
  </head>
  <body style="background-color: black; color: white">
    <div id="app">
      <p>Loading...</p>
    </div>
  </body>
</html>
\`\`\`

Example \`./src/main.tsx\`

\`\`\`tsx
import { RenderToBody } from 'hyperfx'

function App() {
  return (
    <div>
      <p style="font-size: 120%;">This is rendered from HyperFX with JSX!</p>
    </div>
  );
}

const appRoot = document.getElementById("app")!;
appRoot.replaceChildren(App());
\`\`\`

Run it with realtime updates with:

\`\`\`bash
  pnpm dev
\`\`\`
`, Gr = `# State Management

HyperFX includes a powerful reactive state management system inspired by signals. It provides fine-grained reactivity with automatic dependency tracking, meaning only the parts of the DOM that actually change will be updated.

## Core Primitives

### Signals

Signals are the basic unit of state. In HyperFX, a signal is a **callable function** that acts as both a getter and a setter.

\`\`\`tsx
import { createSignal } from 'hyperfx';

// Create a signal with an initial value
const count = createSignal(0);

// Get the current value by calling it
console.log(count()); // 0

// Set a new value by passing it as an argument
count(count() + 1);

// Use it directly in JSX
function Counter() {
  return (
    <button onclick={() => count(count() + 1)}>
      Count is: {count}
    </button>
  );
}
\`\`\`

### Computed Values

Computed values are signals derived from other signals. They automatically update when their dependencies change.

\`\`\`tsx
import { createSignal, createComputed } from 'hyperfx';

const firstName = createSignal('John');
const lastName = createSignal('Doe');

// Automatically tracks dependencies
const fullName = createComputed(() => \`\${firstName()} \${lastName()}\`);

console.log(fullName()); // "John Doe"

firstName("Jane");
console.log(fullName()); // "Jane Doe"
\`\`\`

### Effects

Effects are used for side effects that should run when signals change (e.g., logging, fetching data, manual DOM updates).

\`\`\`tsx
import { createSignal, createEffect } from 'hyperfx';

const count = createSignal(0);

createEffect(() => {
  console.log(\`The count is now: \${count()}\`);
  
  // Optional cleanup function
  return () => {
    console.log("Cleaning up...");
  };
});
\`\`\`

---

## React-like Hooks

If you prefer the \`[value, setValue]\` pattern from React, HyperFX provides \`useState\`, which is a thin wrapper around \`createSignal\`.

\`\`\`tsx
import { useState } from 'hyperfx';

function HookExample() {
  const [count, setCount] = useState(0);

  return (
    <button onclick={() => setCount(count() + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

---

## Global State

Because signals are just functions, they can be defined anywhere and shared across components easily.

\`\`\`tsx
// store.ts
import { createSignal } from 'hyperfx';
export const theme = createSignal('light');

// ComponentA.tsx
import { theme } from './store';
const toggleTheme = () => theme(theme() === 'light' ? 'dark' : 'light');

// ComponentB.tsx
import { theme } from './store';
function Display() {
  return <div class={theme}>Current theme: {theme}</div>;
}
\`\`\`

---

## Advanced Usage

### Batching Updates

When you need to update multiple signals at once, you can use \`batch\` to prevent intermediate re-renders.

\`\`\`tsx
import { batch, createSignal } from 'hyperfx';

const x = createSignal(0);
const y = createSignal(0);

batch(() => {
  x(10);
  y(20);
}); // Both updates are processed, then listeners are notified once.
\`\`\`

### Untracked Access

If you need to read a signal's value inside a computed or effect without creating a dependency, use \`.peek()\`.

\`\`\`tsx
const count = createSignal(0);
const other = createSignal(0);

createComputed(() => {
  console.log(count()); // Creates dependency
  console.log(other.peek()); // Reads value without creating dependency
});
\`\`\`

---

## API Reference

| Function | Description |
| --- | --- |
| \`createSignal(value)\` | Returns a callable signal: \`sig()\` to get, \`sig(val)\` to set. |
| \`createComputed(fn)\` | Returns a read-only signal that updates based on the function. |
| \`createEffect(fn)\` | Runs side effects on dependency changes. Returns a stop function. |
| \`useState(value)\` | Returns \`[signal, setSignal]\` array. |
| \`batch(fn)\` | Groups multiple signal updates into one notification cycle. |
| \`template\\\`...\\\`\` | Creates a reactive string template from signals. |
`, jr = `# Rendering

Learn how to render HyperFX components and elements to the DOM.

## Basic Rendering

With JSX, rendering is straightforward. Create your component and append it to the DOM:

\`\`\`tsx
import { createSignal } from "hyperfx";

function App() {
  const count = createSignal(0);

  return (
    <div>
      <h1>My App</h1>
      <p>Count: {count}</p>
      <button onclick={() => count(count() + 1)}>
        Increment
      </button>
    </div>
  );
}

// Render to DOM
const appRoot = document.getElementById('app')!;
appRoot.replaceChildren(<App />);
\`\`\`

## Replacing Content

Use \`replaceChildren()\` to replace all content in a container:

\`\`\`tsx
function updatePage() {
  const container = document.getElementById('page-content')!;
  
  container.replaceChildren(
    <div>
      <h2>Updated Content</h2>
      <p>This content replaced everything in the container.</p>
    </div>
  );
}
\`\`\`

---

## Control Flow Components

HyperFX provides specialized components for common rendering patterns. These are more efficient than standard JavaScript expressions because they can optimize DOM updates.

### \`<Show>\`

Use \`<Show>\` for conditional rendering.

\`\`\`tsx
import { Show, createSignal } from "hyperfx";

function Profile() {
  const loggedIn = createSignal(false);

  return (
    <div>
      <Show when={loggedIn}>
        <button onclick={() => logout()}>Logout</button>
      </Show>
      
      <Show when={() => !loggedIn()}>
        <button onclick={() => login()}>Login</button>
      </Show>
    </div>
  );
}
\`\`\`

### \`<For>\`

Use \`<For>\` for rendering lists of data.

\`\`\`tsx
import { For, createSignal } from "hyperfx";

function TodoList() {
  const todos = createSignal([
    { id: 1, text: 'Learn HyperFX' },
    { id: 2, text: 'Build an app' }
  ]);

  return (
    <ul>
      <For each={todos}>
        {(todo) => (
          <li>{todo.text}</li>
        )}
      </For>
    </ul>
  );
}
\`\`\`

### \`<Switch>\` and \`<Match>\`

Use \`<Switch>\` for multiple conditional branches.

\`\`\`tsx
import { Switch, Match, createSignal } from "hyperfx";

const status = createSignal("loading");

<Switch>
  <Match when={() => status() === "loading"}>
    <p>Loading...</p>
  </Match>
  <Match when={() => status() === "error"}>
    <p>Error occurred!</p>
  </Match>
  <Match when={() => status() === "success"}>
    <p>Data loaded successfully!</p>
  </Match>
</Switch>
\`\`\`

---

## innerHTML

For complex HTML content (like markdown), use the \`innerHTML\` attribute with signals:

\`\`\`tsx
import { createSignal, createComputed } from "hyperfx";

function MarkdownViewer({ markdownText }: { markdownText: string }) {
  const renderedHTML = createComputed(() => parseMarkdown(markdownText));

  return (
    <article 
      class="markdown-content"
      innerHTML={renderedHTML}
    />
  );
}
\`\`\`
`, Zr = `# Server-Side Rendering (SSR)

HyperFX provides built-in support for Server-Side Rendering and client-side hydration. This allows you to generate HTML on the server for faster initial page loads and better SEO, while still maintaining full reactivity on the client.

## Key Functions

### \`renderToString(element)\`

Converts a JSX element (and its tree) into an HTML string and extracts hydration data.

\`\`\`tsx
import { renderToString } from "hyperfx/ssr";
import { App } from "./App";

const { html, hydrationData } = renderToString(<App />);
\`\`\`

### \`renderHydrationData(data)\`

Converts hydration data into a \`<script>\` tag that can be embedded in the HTML.

\`\`\`tsx
import { renderHydrationData } from "hyperfx/ssr";

const hydrationScript = renderHydrationData(hydrationData);
\`\`\`

---

## SSR Example (Nitro/Vite)

Here is a basic setup using Nitro as a server:

\`\`\`tsx
// server.tsx
import { renderToString, renderHydrationData } from "hyperfx/ssr";
import { App } from "./src/App";

export default defineEventHandler(async (event) => {
  const { html, hydrationData } = renderToString(<App />);
  const hydrationScript = renderHydrationData(hydrationData);

  return \`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HyperFX SSR</title>
      </head>
      <body>
        <div id="app">\${html}</div>
        \${hydrationScript}
        <script type="module" src="/src/main.tsx"><\/script>
      </body>
    </html>
  \`;
});
\`\`\`

---

## Client-Side Hydration

On the client, you don't need to do anything special. If the hydration data script is present, HyperFX will automatically pick it up and re-attach reactive signals to the existing DOM elements.

\`\`\`tsx
// main.tsx
import { App } from "./App";

// This will automatically hydrate if data is present
document.getElementById("app")?.replaceChildren(<App />);
\`\`\`

---

## How it Works

1. **Server Phase**: \`renderToString\` walks the component tree, generating HTML and identifying reactive parts (attributes, text nodes).
2. **Transfer Phase**: The HTML and a small JSON object (hydration data) are sent to the browser.
3. **Client Phase**: HyperFX in the browser finds the server-rendered elements and uses the hydration data to re-create the signals and event listeners without re-rendering the entire DOM.
`, qr = "/hyperfx?doc=", hn = [{ title: "Get Started", route_name: "get_started", data: Xr }, { title: "HyperFX basics", route_name: "basics", data: zr }, { title: "State Management", route_name: "state-management", data: Gr }, { title: "Rendering & Control Flow", route_name: "render", data: jr }, { title: "HyperFX components", route_name: "components", data: Ur }, { title: "Single Page Application", route_name: "spa", data: Fr }, { title: "Server-Side Rendering", route_name: "ssr", data: Zr }]; function Wr() { return $("nav", { class: "flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg", children: [A(Ke, { class: "px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400", to: "/hyperfx", children: "Home" }), A(Ke, { class: "px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400", to: "/hyperfx?doc=get_started", children: "Docs" }), A(Ke, { class: "px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400", to: "/hyperfx/editor", children: "Example" })] }) } const xt = fe(!1); function Kr() { console.log(xt(!xt())) } function Jr() { const t = Ie(() => `flex-col sm:flex gap-1 ${xt() ? "flex" : "hidden"}`); return $("aside", { class: "bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl", children: [A("div", { class: "flex items-center justify-between mb-6 sm:hidden", children: $("button", { class: "text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform", title: "Toggle Navigation", onclick: Kr, children: [A("span", { class: "text-lg", children: "☰" }), A("span", { class: "sr-only", children: "Toggle Navigation" })] }) }), $("nav", { class: t, children: [A("p", { class: "hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3", children: "Fundamentals" }), A(Dr, { each: hn, children: e => A(Ke, { class: "px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block", to: `${qr}${e.route_name}`, children: e.title }) })] })] }) } function Et() { return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null } } var Se = Et(); function pn(t) { Se = t } var Oe = { exec: () => null }; function M(t, e = "") { let n = typeof t == "string" ? t : t.source; const s = { replace: (r, i) => { let a = typeof i == "string" ? i : i.source; return a = a.replace(K.caret, "$1"), n = n.replace(r, a), s }, getRegex: () => new RegExp(n, e) }; return s } var K = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: t => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: t => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: t => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: t => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: t => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: t => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i") }, Qr = /^(?:[ \t]*(?:\n|$))+/, Yr = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Vr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Le = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, es = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, vt = /(?:[*+-]|\d{1,9}[.)])/, fn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, gn = M(fn).replace(/bull/g, vt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), ts = M(fn).replace(/bull/g, vt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), _t = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, ns = /^[^\n]+/, Tt = /(?!\s*\])(?:\\.|[^\[\]\\])+/, rs = M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Tt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ss = M(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, vt).getRegex(), tt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", At = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, is = M("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", At).replace("tag", tt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), mn = M(_t).replace("hr", Le).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", tt).getRegex(), os = M(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", mn).getRegex(), Rt = { blockquote: os, code: Yr, def: rs, fences: Vr, heading: es, hr: Le, html: is, lheading: gn, list: ss, newline: Qr, paragraph: mn, table: Oe, text: ns }, Qt = M("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Le).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", tt).getRegex(), as = { ...Rt, lheading: ts, table: Qt, paragraph: M(_t).replace("hr", Le).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Qt).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", tt).getRegex() }, ls = {
  ...Rt, html: M(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", At).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Oe, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: M(_t).replace("hr", Le).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", gn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, cs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, us = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, bn = /^( {2,}|\\)\n(?!\s*$)/, ds = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, nt = /[\p{P}\p{S}]/u, Ct = /[\s\p{P}\p{S}]/u, xn = /[^\s\p{P}\p{S}]/u, hs = M(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ct).getRegex(), yn = /(?!~)[\p{P}\p{S}]/u, ps = /(?!~)[\s\p{P}\p{S}]/u, fs = /(?:[^\s\p{P}\p{S}]|~)/u, gs = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, wn = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ms = M(wn, "u").replace(/punct/g, nt).getRegex(), bs = M(wn, "u").replace(/punct/g, yn).getRegex(), kn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", xs = M(kn, "gu").replace(/notPunctSpace/g, xn).replace(/punctSpace/g, Ct).replace(/punct/g, nt).getRegex(), ys = M(kn, "gu").replace(/notPunctSpace/g, fs).replace(/punctSpace/g, ps).replace(/punct/g, yn).getRegex(), ws = M("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, xn).replace(/punctSpace/g, Ct).replace(/punct/g, nt).getRegex(), ks = M(/\\(punct)/, "gu").replace(/punct/g, nt).getRegex(), Ss = M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Es = M(At).replace("(?:-->|$)", "-->").getRegex(), vs = M("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Es).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Qe = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, _s = M(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Qe).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Sn = M(/^!?\[(label)\]\[(ref)\]/).replace("label", Qe).replace("ref", Tt).getRegex(), En = M(/^!?\[(ref)\](?:\[\])?/).replace("ref", Tt).getRegex(), Ts = M("reflink|nolink(?!\\()", "g").replace("reflink", Sn).replace("nolink", En).getRegex(), Nt = { _backpedal: Oe, anyPunctuation: ks, autolink: Ss, blockSkip: gs, br: bn, code: us, del: Oe, emStrongLDelim: ms, emStrongRDelimAst: xs, emStrongRDelimUnd: ws, escape: cs, link: _s, nolink: En, punctuation: hs, reflink: Sn, reflinkSearch: Ts, tag: vs, text: ds, url: Oe }, As = { ...Nt, link: M(/^!?\[(label)\]\((.*?)\)/).replace("label", Qe).getRegex(), reflink: M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Qe).getRegex() }, yt = { ...Nt, emStrongRDelimAst: ys, emStrongLDelim: bs, url: M(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/, text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/ }, Rs = { ...yt, br: M(bn).replace("{2,}", "*").getRegex(), text: M(yt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, We = { normal: Rt, gfm: as, pedantic: ls }, Ne = { normal: Nt, gfm: yt, breaks: Rs, pedantic: As }, Cs = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Yt = t => Cs[t]; function se(t, e) { if (e) { if (K.escapeTest.test(t)) return t.replace(K.escapeReplace, Yt) } else if (K.escapeTestNoEncode.test(t)) return t.replace(K.escapeReplaceNoEncode, Yt); return t } function Vt(t) { try { t = encodeURI(t).replace(K.percentDecode, "%") } catch { return null } return t } function en(t, e) { const n = t.replace(K.findPipe, (i, a, l) => { let d = !1, c = a; for (; --c >= 0 && l[c] === "\\";)d = !d; return d ? "|" : " |" }), s = n.split(K.splitPipe); let r = 0; if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e); else for (; s.length < e;)s.push(""); for (; r < s.length; r++)s[r] = s[r].trim().replace(K.slashPipe, "|"); return s } function Me(t, e, n) { const s = t.length; if (s === 0) return ""; let r = 0; for (; r < s && t.charAt(s - r - 1) === e;)r++; return t.slice(0, s - r) } function Ns(t, e) { if (t.indexOf(e[1]) === -1) return -1; let n = 0; for (let s = 0; s < t.length; s++)if (t[s] === "\\") s++; else if (t[s] === e[0]) n++; else if (t[s] === e[1] && (n--, n < 0)) return s; return n > 0 ? -2 : -1 } function tn(t, e, n, s, r) { const i = e.href, a = e.title || null, l = t[1].replace(r.other.outputLinkReplace, "$1"); s.state.inLink = !0; const d = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: a, text: l, tokens: s.inlineTokens(l) }; return s.state.inLink = !1, d } function Ms(t, e, n) {
  const s = t.match(n.other.indentCodeCompensation); if (s === null) return e; const r = s[1]; return e.split(`
`).map(i => { const a = i.match(n.other.beginningSpace); if (a === null) return i; const [l] = a; return l.length >= r.length ? i.slice(r.length) : i }).join(`
`)
} var Ye = class {
  options; rules; lexer; constructor(t) { this.options = t || Se } space(t) { const e = this.rules.block.newline.exec(t); if (e && e[0].length > 0) return { type: "space", raw: e[0] } } code(t) {
    const e = this.rules.block.code.exec(t); if (e) {
      const n = e[0].replace(this.rules.other.codeRemoveIndent, ""); return {
        type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Me(n, `
`)
      }
    }
  } fences(t) { const e = this.rules.block.fences.exec(t); if (e) { const n = e[0], s = Ms(n, e[3] || "", this.rules); return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s } } } heading(t) { const e = this.rules.block.heading.exec(t); if (e) { let n = e[2].trim(); if (this.rules.other.endingHash.test(n)) { const s = Me(n, "#"); (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim()) } return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) } } } hr(t) {
    const e = this.rules.block.hr.exec(t); if (e) return {
      type: "hr", raw: Me(e[0], `
`)
    }
  } blockquote(t) {
    const e = this.rules.block.blockquote.exec(t); if (e) {
      let n = Me(e[0], `
`).split(`
`), s = "", r = ""; const i = []; for (; n.length > 0;) {
        let a = !1; const l = []; let d; for (d = 0; d < n.length; d++)if (this.rules.other.blockquoteStart.test(n[d])) l.push(n[d]), a = !0; else if (!a) l.push(n[d]); else break; n = n.slice(d); const c = l.join(`
`), m = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, ""); s = s ? `${s}
${c}` : c, r = r ? `${r}
${m}` : m; const k = this.lexer.state.top; if (this.lexer.state.top = !0, this.lexer.blockTokens(m, i, !0), this.lexer.state.top = k, n.length === 0) break; const b = i.at(-1); if (b?.type === "code") break; if (b?.type === "blockquote") {
          const C = b, S = C.raw + `
`+ n.join(`
`), E = this.blockquote(S); i[i.length - 1] = E, s = s.substring(0, s.length - C.raw.length) + E.raw, r = r.substring(0, r.length - C.text.length) + E.text; break
        } else if (b?.type === "list") {
          const C = b, S = C.raw + `
`+ n.join(`
`), E = this.list(S); i[i.length - 1] = E, s = s.substring(0, s.length - b.raw.length) + E.raw, r = r.substring(0, r.length - C.raw.length) + E.raw, n = S.substring(i.at(-1).raw.length).split(`
`); continue
        }
      } return { type: "blockquote", raw: s, tokens: i, text: r }
    }
  } list(t) {
    let e = this.rules.block.list.exec(t); if (e) {
      let n = e[1].trim(); const s = n.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: !1, items: [] }; n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]"); const i = this.rules.other.listItemRegex(n); let a = !1; for (; t;) {
        let d = !1, c = "", m = ""; if (!(e = i.exec(t)) || this.rules.block.hr.test(t)) break; c = e[0], t = t.substring(c.length); let k = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, F => " ".repeat(3 * F.length)), b = t.split(`
`, 1)[0], C = !k.trim(), S = 0; if (this.options.pedantic ? (S = 2, m = k.trimStart()) : C ? S = e[1].length + 1 : (S = e[2].search(this.rules.other.nonSpaceChar), S = S > 4 ? 1 : S, m = k.slice(S), S += e[1].length), C && this.rules.other.blankLine.test(b) && (c += b + `
`, t = t.substring(b.length + 1), d = !0), !d) {
          const F = this.rules.other.nextBulletRegex(S), L = this.rules.other.hrRegex(S), Y = this.rules.other.fencesBeginRegex(S), W = this.rules.other.headingBeginRegex(S), J = this.rules.other.htmlBeginRegex(S); for (; t;) {
            const V = t.split(`
`, 1)[0]; let te; if (b = V, this.options.pedantic ? (b = b.replace(this.rules.other.listReplaceNesting, "  "), te = b) : te = b.replace(this.rules.other.tabCharGlobal, "    "), Y.test(b) || W.test(b) || J.test(b) || F.test(b) || L.test(b)) break; if (te.search(this.rules.other.nonSpaceChar) >= S || !b.trim()) m += `
`+ te.slice(S); else {
              if (C || k.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Y.test(k) || W.test(k) || L.test(k)) break; m += `
`+ b
            } !C && !b.trim() && (C = !0), c += V + `
`, t = t.substring(V.length + 1), k = te.slice(S)
          }
        } r.loose || (a ? r.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (a = !0)); let E = null, D; this.options.gfm && (E = this.rules.other.listIsTask.exec(m), E && (D = E[0] !== "[ ] ", m = m.replace(this.rules.other.listReplaceTask, ""))), r.items.push({ type: "list_item", raw: c, task: !!E, checked: D, loose: !1, text: m, tokens: [] }), r.raw += c
      } const l = r.items.at(-1); if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd(); else return; r.raw = r.raw.trimEnd(); for (let d = 0; d < r.items.length; d++)if (this.lexer.state.top = !1, r.items[d].tokens = this.lexer.blockTokens(r.items[d].text, []), !r.loose) { const c = r.items[d].tokens.filter(k => k.type === "space"), m = c.length > 0 && c.some(k => this.rules.other.anyLine.test(k.raw)); r.loose = m } if (r.loose) for (let d = 0; d < r.items.length; d++)r.items[d].loose = !0; return r
    }
  } html(t) { const e = this.rules.block.html.exec(t); if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] } } def(t) { const e = this.rules.block.def.exec(t); if (e) { const n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3]; return { type: "def", tag: n, raw: e[0], href: s, title: r } } } table(t) {
    const e = this.rules.block.table.exec(t); if (!e || !this.rules.other.tableDelimiter.test(e[2])) return; const n = en(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] }; if (n.length === s.length) { for (const a of s) this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null); for (let a = 0; a < n.length; a++)i.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: !0, align: i.align[a] }); for (const a of r) i.rows.push(en(a, i.header.length).map((l, d) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: i.align[d] }))); return i }
  } lheading(t) { const e = this.rules.block.lheading.exec(t); if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) } } paragraph(t) {
    const e = this.rules.block.paragraph.exec(t); if (e) {
      const n = e[1].charAt(e[1].length - 1) === `
`? e[1].slice(0, -1) : e[1]; return { type: "paragraph", raw: e[0], text: n, tokens: this.lexer.inline(n) }
    }
  } text(t) { const e = this.rules.block.text.exec(t); if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) } } escape(t) { const e = this.rules.inline.escape.exec(t); if (e) return { type: "escape", raw: e[0], text: e[1] } } tag(t) { const e = this.rules.inline.tag.exec(t); if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] } } link(t) { const e = this.rules.inline.link.exec(t); if (e) { const n = e[2].trim(); if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) { if (!this.rules.other.endAngleBracket.test(n)) return; const i = Me(n.slice(0, -1), "\\"); if ((n.length - i.length) % 2 === 0) return } else { const i = Ns(e[2], "()"); if (i === -2) return; if (i > -1) { const l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i; e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "" } } let s = e[2], r = ""; if (this.options.pedantic) { const i = this.rules.other.pedanticHrefTitle.exec(s); i && (s = i[1], r = i[3]) } else r = e[3] ? e[3].slice(1, -1) : ""; return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), tn(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules) } } reflink(t, e) { let n; if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) { const s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[s.toLowerCase()]; if (!r) { const i = n[0].charAt(0); return { type: "text", raw: i, text: i } } return tn(n, r, n[0], this.lexer, this.rules) } } emStrong(t, e, n = "") { let s = this.rules.inline.emStrongLDelim.exec(t); if (!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return; if (!(s[1] || s[2] || "") || !n || this.rules.inline.punctuation.exec(n)) { const i = [...s[0]].length - 1; let a, l, d = i, c = 0; const m = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd; for (m.lastIndex = 0, e = e.slice(-1 * t.length + i); (s = m.exec(e)) != null;) { if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a) continue; if (l = [...a].length, s[3] || s[4]) { d += l; continue } else if ((s[5] || s[6]) && i % 3 && !((i + l) % 3)) { c += l; continue } if (d -= l, d > 0) continue; l = Math.min(l, l + d + c); const k = [...s[0]][0].length, b = t.slice(0, i + s.index + k + l); if (Math.min(i, l) % 2) { const S = b.slice(1, -1); return { type: "em", raw: b, text: S, tokens: this.lexer.inlineTokens(S) } } const C = b.slice(2, -2); return { type: "strong", raw: b, text: C, tokens: this.lexer.inlineTokens(C) } } } } codespan(t) { const e = this.rules.inline.code.exec(t); if (e) { let n = e[2].replace(this.rules.other.newLineCharGlobal, " "); const s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n); return s && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n } } } br(t) { const e = this.rules.inline.br.exec(t); if (e) return { type: "br", raw: e[0] } } del(t) { const e = this.rules.inline.del.exec(t); if (e) return { type: "del", raw: e[0], text: e[2], tokens: this.lexer.inlineTokens(e[2]) } } autolink(t) { const e = this.rules.inline.autolink.exec(t); if (e) { let n, s; return e[2] === "@" ? (n = e[1], s = "mailto:" + n) : (n = e[1], s = n), { type: "link", raw: e[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] } } } url(t) { let e; if (e = this.rules.inline.url.exec(t)) { let n, s; if (e[2] === "@") n = e[0], s = "mailto:" + n; else { let r; do r = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? ""; while (r !== e[0]); n = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0] } return { type: "link", raw: e[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] } } } inlineText(t) { const e = this.rules.inline.text.exec(t); if (e) { const n = this.lexer.state.inRawBlock; return { type: "text", raw: e[0], text: e[0], escaped: n } } }
}, le = class wt {
  tokens; options; state; tokenizer; inlineQueue; constructor(e) { this.tokens = [], this.tokens.links = Object.create(null), this.options = e || Se, this.options.tokenizer = this.options.tokenizer || new Ye, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 }; const n = { other: K, block: We.normal, inline: Ne.normal }; this.options.pedantic ? (n.block = We.pedantic, n.inline = Ne.pedantic) : this.options.gfm && (n.block = We.gfm, this.options.breaks ? n.inline = Ne.breaks : n.inline = Ne.gfm), this.tokenizer.rules = n } static get rules() { return { block: We, inline: Ne } } static lex(e, n) { return new wt(n).lex(e) } static lexInline(e, n) { return new wt(n).inlineTokens(e) } lex(e) {
    e = e.replace(K.carriageReturn, `
`), this.blockTokens(e, this.tokens); for (let n = 0; n < this.inlineQueue.length; n++) { const s = this.inlineQueue[n]; this.inlineTokens(s.src, s.tokens) } return this.inlineQueue = [], this.tokens
  } blockTokens(e, n = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(K.tabCharGlobal, "    ").replace(K.spaceLine, "")); e;) {
      let r; if (this.options.extensions?.block?.some(a => (r = a.call({ lexer: this }, e, n)) ? (e = e.substring(r.raw.length), n.push(r), !0) : !1)) continue; if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length); const a = n.at(-1); r.raw.length === 1 && a !== void 0 ? a.raw += `
`: n.push(r); continue
      } if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length); const a = n.at(-1); a?.type === "paragraph" || a?.type === "text" ? (a.raw += `
`+ r.raw, a.text += `
`+ r.text, this.inlineQueue.at(-1).src = a.text) : n.push(r); continue
      } if (r = this.tokenizer.fences(e)) { e = e.substring(r.raw.length), n.push(r); continue } if (r = this.tokenizer.heading(e)) { e = e.substring(r.raw.length), n.push(r); continue } if (r = this.tokenizer.hr(e)) { e = e.substring(r.raw.length), n.push(r); continue } if (r = this.tokenizer.blockquote(e)) { e = e.substring(r.raw.length), n.push(r); continue } if (r = this.tokenizer.list(e)) { e = e.substring(r.raw.length), n.push(r); continue } if (r = this.tokenizer.html(e)) { e = e.substring(r.raw.length), n.push(r); continue } if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length); const a = n.at(-1); a?.type === "paragraph" || a?.type === "text" ? (a.raw += `
`+ r.raw, a.text += `
`+ r.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }); continue
      } if (r = this.tokenizer.table(e)) { e = e.substring(r.raw.length), n.push(r); continue } if (r = this.tokenizer.lheading(e)) { e = e.substring(r.raw.length), n.push(r); continue } let i = e; if (this.options.extensions?.startBlock) { let a = 1 / 0; const l = e.slice(1); let d; this.options.extensions.startBlock.forEach(c => { d = c.call({ lexer: this }, l), typeof d == "number" && d >= 0 && (a = Math.min(a, d)) }), a < 1 / 0 && a >= 0 && (i = e.substring(0, a + 1)) } if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        const a = n.at(-1); s && a?.type === "paragraph" ? (a.raw += `
`+ r.raw, a.text += `
`+ r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(r), s = i.length !== e.length, e = e.substring(r.raw.length); continue
      } if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length); const a = n.at(-1); a?.type === "text" ? (a.raw += `
`+ r.raw, a.text += `
`+ r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(r); continue
      } if (e) { const a = "Infinite loop on byte: " + e.charCodeAt(0); if (this.options.silent) { console.error(a); break } else throw new Error(a) }
    } return this.state.top = !0, n
  } inline(e, n = []) { return this.inlineQueue.push({ src: e, tokens: n }), n } inlineTokens(e, n = []) { let s = e, r = null; if (this.tokens.links) { const l = Object.keys(this.tokens.links); if (l.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null;)l.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex)) } for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null;)s = s.slice(0, r.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex); for (; (r = this.tokenizer.rules.inline.blockSkip.exec(s)) != null;)s = s.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex); let i = !1, a = ""; for (; e;) { i || (a = ""), i = !1; let l; if (this.options.extensions?.inline?.some(c => (l = c.call({ lexer: this }, e, n)) ? (e = e.substring(l.raw.length), n.push(l), !0) : !1)) continue; if (l = this.tokenizer.escape(e)) { e = e.substring(l.raw.length), n.push(l); continue } if (l = this.tokenizer.tag(e)) { e = e.substring(l.raw.length), n.push(l); continue } if (l = this.tokenizer.link(e)) { e = e.substring(l.raw.length), n.push(l); continue } if (l = this.tokenizer.reflink(e, this.tokens.links)) { e = e.substring(l.raw.length); const c = n.at(-1); l.type === "text" && c?.type === "text" ? (c.raw += l.raw, c.text += l.text) : n.push(l); continue } if (l = this.tokenizer.emStrong(e, s, a)) { e = e.substring(l.raw.length), n.push(l); continue } if (l = this.tokenizer.codespan(e)) { e = e.substring(l.raw.length), n.push(l); continue } if (l = this.tokenizer.br(e)) { e = e.substring(l.raw.length), n.push(l); continue } if (l = this.tokenizer.del(e)) { e = e.substring(l.raw.length), n.push(l); continue } if (l = this.tokenizer.autolink(e)) { e = e.substring(l.raw.length), n.push(l); continue } if (!this.state.inLink && (l = this.tokenizer.url(e))) { e = e.substring(l.raw.length), n.push(l); continue } let d = e; if (this.options.extensions?.startInline) { let c = 1 / 0; const m = e.slice(1); let k; this.options.extensions.startInline.forEach(b => { k = b.call({ lexer: this }, m), typeof k == "number" && k >= 0 && (c = Math.min(c, k)) }), c < 1 / 0 && c >= 0 && (d = e.substring(0, c + 1)) } if (l = this.tokenizer.inlineText(d)) { e = e.substring(l.raw.length), l.raw.slice(-1) !== "_" && (a = l.raw.slice(-1)), i = !0; const c = n.at(-1); c?.type === "text" ? (c.raw += l.raw, c.text += l.text) : n.push(l); continue } if (e) { const c = "Infinite loop on byte: " + e.charCodeAt(0); if (this.options.silent) { console.error(c); break } else throw new Error(c) } } return n }
}, Ve = class {
  options; parser; constructor(t) { this.options = t || Se } space(t) { return "" } code({ text: t, lang: e, escaped: n }) {
    const s = (e || "").match(K.notSpaceStart)?.[0], r = t.replace(K.endingNewline, "") + `
`; return s ? '<pre><code class="language-' + se(s) + '">' + (n ? r : se(r, !0)) + `</code></pre>
`: "<pre><code>" + (n ? r : se(r, !0)) + `</code></pre>
`} blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`} html({ text: t }) { return t } heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`} hr(t) {
    return `<hr>
`} list(t) {
    const e = t.ordered, n = t.start; let s = ""; for (let a = 0; a < t.items.length; a++) { const l = t.items[a]; s += this.listitem(l) } const r = e ? "ol" : "ul", i = e && n !== 1 ? ' start="' + n + '"' : ""; return "<" + r + i + `>
`+ s + "</" + r + `>
`} listitem(t) {
    let e = ""; if (t.task) { const n = this.checkbox({ checked: !!t.checked }); t.loose ? t.tokens[0]?.type === "paragraph" ? (t.tokens[0].text = n + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = n + " " + se(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: !0 }) : e += n + " " } return e += this.parser.parse(t.tokens, !!t.loose), `<li>${e}</li>
`} checkbox({ checked: t }) { return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox">' } paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`} table(t) {
    let e = "", n = ""; for (let r = 0; r < t.header.length; r++)n += this.tablecell(t.header[r]); e += this.tablerow({ text: n }); let s = ""; for (let r = 0; r < t.rows.length; r++) { const i = t.rows[r]; n = ""; for (let a = 0; a < i.length; a++)n += this.tablecell(i[a]); s += this.tablerow({ text: n }) } return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
`+ e + `</thead>
`+ s + `</table>
`} tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`} tablecell(t) {
    const e = this.parser.parseInline(t.tokens), n = t.header ? "th" : "td"; return (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>
`} strong({ tokens: t }) { return `<strong>${this.parser.parseInline(t)}</strong>` } em({ tokens: t }) { return `<em>${this.parser.parseInline(t)}</em>` } codespan({ text: t }) { return `<code>${se(t, !0)}</code>` } br(t) { return "<br>" } del({ tokens: t }) { return `<del>${this.parser.parseInline(t)}</del>` } link({ href: t, title: e, tokens: n }) { const s = this.parser.parseInline(n), r = Vt(t); if (r === null) return s; t = r; let i = '<a href="' + t + '"'; return e && (i += ' title="' + se(e) + '"'), i += ">" + s + "</a>", i } image({ href: t, title: e, text: n, tokens: s }) { s && (n = this.parser.parseInline(s, this.parser.textRenderer)); const r = Vt(t); if (r === null) return se(n); t = r; let i = `<img src="${t}" alt="${n}"`; return e && (i += ` title="${se(e)}"`), i += ">", i } text(t) { return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : se(t.text) }
}, Mt = class { strong({ text: t }) { return t } em({ text: t }) { return t } codespan({ text: t }) { return t } del({ text: t }) { return t } html({ text: t }) { return t } text({ text: t }) { return t } link({ text: t }) { return "" + t } image({ text: t }) { return "" + t } br() { return "" } }, ce = class kt {
  options; renderer; textRenderer; constructor(e) { this.options = e || Se, this.options.renderer = this.options.renderer || new Ve, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Mt } static parse(e, n) { return new kt(n).parse(e) } static parseInline(e, n) { return new kt(n).parseInline(e) } parse(e, n = !0) {
    let s = ""; for (let r = 0; r < e.length; r++) {
      const i = e[r]; if (this.options.extensions?.renderers?.[i.type]) { const l = i, d = this.options.extensions.renderers[l.type].call({ parser: this }, l); if (d !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(l.type)) { s += d || ""; continue } } const a = i; switch (a.type) {
        case "space": { s += this.renderer.space(a); continue } case "hr": { s += this.renderer.hr(a); continue } case "heading": { s += this.renderer.heading(a); continue } case "code": { s += this.renderer.code(a); continue } case "table": { s += this.renderer.table(a); continue } case "blockquote": { s += this.renderer.blockquote(a); continue } case "list": { s += this.renderer.list(a); continue } case "html": { s += this.renderer.html(a); continue } case "paragraph": { s += this.renderer.paragraph(a); continue } case "text": {
          let l = a, d = this.renderer.text(l); for (; r + 1 < e.length && e[r + 1].type === "text";)l = e[++r], d += `
`+ this.renderer.text(l); n ? s += this.renderer.paragraph({ type: "paragraph", raw: d, text: d, tokens: [{ type: "text", raw: d, text: d, escaped: !0 }] }) : s += d; continue
        } default: { const l = 'Token with "' + a.type + '" type was not found.'; if (this.options.silent) return console.error(l), ""; throw new Error(l) }
      }
    } return s
  } parseInline(e, n = this.renderer) { let s = ""; for (let r = 0; r < e.length; r++) { const i = e[r]; if (this.options.extensions?.renderers?.[i.type]) { const l = this.options.extensions.renderers[i.type].call({ parser: this }, i); if (l !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) { s += l || ""; continue } } const a = i; switch (a.type) { case "escape": { s += n.text(a); break } case "html": { s += n.html(a); break } case "link": { s += n.link(a); break } case "image": { s += n.image(a); break } case "strong": { s += n.strong(a); break } case "em": { s += n.em(a); break } case "codespan": { s += n.codespan(a); break } case "br": { s += n.br(a); break } case "del": { s += n.del(a); break } case "text": { s += n.text(a); break } default: { const l = 'Token with "' + a.type + '" type was not found.'; if (this.options.silent) return console.error(l), ""; throw new Error(l) } } } return s }
}, Je = class { options; block; constructor(t) { this.options = t || Se } static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens"]); preprocess(t) { return t } postprocess(t) { return t } processAllTokens(t) { return t } provideLexer() { return this.block ? le.lex : le.lexInline } provideParser() { return this.block ? ce.parse : ce.parseInline } }, Os = class {
  defaults = Et(); options = this.setOptions; parse = this.parseMarkdown(!0); parseInline = this.parseMarkdown(!1); Parser = ce; Renderer = Ve; TextRenderer = Mt; Lexer = le; Tokenizer = Ye; Hooks = Je; constructor(...t) { this.use(...t) } walkTokens(t, e) { let n = []; for (const s of t) switch (n = n.concat(e.call(this, s)), s.type) { case "table": { const r = s; for (const i of r.header) n = n.concat(this.walkTokens(i.tokens, e)); for (const i of r.rows) for (const a of i) n = n.concat(this.walkTokens(a.tokens, e)); break } case "list": { const r = s; n = n.concat(this.walkTokens(r.items, e)); break } default: { const r = s; this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach(i => { const a = r[i].flat(1 / 0); n = n.concat(this.walkTokens(a, e)) }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, e))) } }return n } use(...t) { const e = this.defaults.extensions || { renderers: {}, childTokens: {} }; return t.forEach(n => { const s = { ...n }; if (s.async = this.defaults.async || s.async || !1, n.extensions && (n.extensions.forEach(r => { if (!r.name) throw new Error("extension name required"); if ("renderer" in r) { const i = e.renderers[r.name]; i ? e.renderers[r.name] = function (...a) { let l = r.renderer.apply(this, a); return l === !1 && (l = i.apply(this, a)), l } : e.renderers[r.name] = r.renderer } if ("tokenizer" in r) { if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'"); const i = e[r.level]; i ? i.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start])) } "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens) }), s.extensions = e), n.renderer) { const r = this.defaults.renderer || new Ve(this.defaults); for (const i in n.renderer) { if (!(i in r)) throw new Error(`renderer '${i}' does not exist`); if (["options", "parser"].includes(i)) continue; const a = i, l = n.renderer[a], d = r[a]; r[a] = (...c) => { let m = l.apply(r, c); return m === !1 && (m = d.apply(r, c)), m || "" } } s.renderer = r } if (n.tokenizer) { const r = this.defaults.tokenizer || new Ye(this.defaults); for (const i in n.tokenizer) { if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`); if (["options", "rules", "lexer"].includes(i)) continue; const a = i, l = n.tokenizer[a], d = r[a]; r[a] = (...c) => { let m = l.apply(r, c); return m === !1 && (m = d.apply(r, c)), m } } s.tokenizer = r } if (n.hooks) { const r = this.defaults.hooks || new Je; for (const i in n.hooks) { if (!(i in r)) throw new Error(`hook '${i}' does not exist`); if (["options", "block"].includes(i)) continue; const a = i, l = n.hooks[a], d = r[a]; Je.passThroughHooks.has(i) ? r[a] = c => { if (this.defaults.async) return Promise.resolve(l.call(r, c)).then(k => d.call(r, k)); const m = l.call(r, c); return d.call(r, m) } : r[a] = (...c) => { let m = l.apply(r, c); return m === !1 && (m = d.apply(r, c)), m } } s.hooks = r } if (n.walkTokens) { const r = this.defaults.walkTokens, i = n.walkTokens; s.walkTokens = function (a) { let l = []; return l.push(i.call(this, a)), r && (l = l.concat(r.call(this, a))), l } } this.defaults = { ...this.defaults, ...s } }), this } setOptions(t) { return this.defaults = { ...this.defaults, ...t }, this } lexer(t, e) { return le.lex(t, e ?? this.defaults) } parser(t, e) { return ce.parse(t, e ?? this.defaults) } parseMarkdown(t) { return (n, s) => { const r = { ...s }, i = { ...this.defaults, ...r }, a = this.onError(!!i.silent, !!i.async); if (this.defaults.async === !0 && r.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.")); if (typeof n > "u" || n === null) return a(new Error("marked(): input parameter is undefined or null")); if (typeof n != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected")); i.hooks && (i.hooks.options = i, i.hooks.block = t); const l = i.hooks ? i.hooks.provideLexer() : t ? le.lex : le.lexInline, d = i.hooks ? i.hooks.provideParser() : t ? ce.parse : ce.parseInline; if (i.async) return Promise.resolve(i.hooks ? i.hooks.preprocess(n) : n).then(c => l(c, i)).then(c => i.hooks ? i.hooks.processAllTokens(c) : c).then(c => i.walkTokens ? Promise.all(this.walkTokens(c, i.walkTokens)).then(() => c) : c).then(c => d(c, i)).then(c => i.hooks ? i.hooks.postprocess(c) : c).catch(a); try { i.hooks && (n = i.hooks.preprocess(n)); let c = l(n, i); i.hooks && (c = i.hooks.processAllTokens(c)), i.walkTokens && this.walkTokens(c, i.walkTokens); let m = d(c, i); return i.hooks && (m = i.hooks.postprocess(m)), m } catch (c) { return a(c) } } } onError(t, e) {
    return n => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) { const s = "<p>An error occurred:</p><pre>" + se(n.message + "", !0) + "</pre>"; return e ? Promise.resolve(s) : s } if (e) return Promise.reject(n); throw n
    }
  }
}, ke = new Os; function I(t, e) { return ke.parse(t, e) } I.options = I.setOptions = function (t) { return ke.setOptions(t), I.defaults = ke.defaults, pn(I.defaults), I }; I.getDefaults = Et; I.defaults = Se; I.use = function (...t) { return ke.use(...t), I.defaults = ke.defaults, pn(I.defaults), I }; I.walkTokens = function (t, e) { return ke.walkTokens(t, e) }; I.parseInline = ke.parseInline; I.Parser = ce; I.parser = ce.parse; I.Renderer = Ve; I.TextRenderer = Mt; I.Lexer = le; I.lexer = le.lex; I.Tokenizer = Ye; I.Hooks = Je; I.parse = I; I.options; I.setOptions; I.use; I.walkTokens; I.parseInline; var vn = I; ce.parse; le.lex; const Is = `# HyperFX

HyperFX (hypermedia functions) is a simple library for DOM manipulation by using functions.
Right now it's JSX based. And it is not production ready.   

## Use case

Absolutely none, it is just a fun project.
`; function Ls(t) { return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t } var ft, nn; function Ps() {
  if (nn) return ft; nn = 1; function t(o) { return o instanceof Map ? o.clear = o.delete = o.set = function () { throw new Error("map is read-only") } : o instanceof Set && (o.add = o.clear = o.delete = function () { throw new Error("set is read-only") }), Object.freeze(o), Object.getOwnPropertyNames(o).forEach(u => { const p = o[u], _ = typeof p; (_ === "object" || _ === "function") && !Object.isFrozen(p) && t(p) }), o } class e { constructor(u) { u.data === void 0 && (u.data = {}), this.data = u.data, this.isMatchIgnored = !1 } ignoreMatch() { this.isMatchIgnored = !0 } } function n(o) { return o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;") } function s(o, ...u) { const p = Object.create(null); for (const _ in o) p[_] = o[_]; return u.forEach(function (_) { for (const H in _) p[H] = _[H] }), p } const r = "</span>", i = o => !!o.scope, a = (o, { prefix: u }) => { if (o.startsWith("language:")) return o.replace("language:", "language-"); if (o.includes(".")) { const p = o.split("."); return [`${u}${p.shift()}`, ...p.map((_, H) => `${_}${"_".repeat(H + 1)}`)].join(" ") } return `${u}${o}` }; class l { constructor(u, p) { this.buffer = "", this.classPrefix = p.classPrefix, u.walk(this) } addText(u) { this.buffer += n(u) } openNode(u) { if (!i(u)) return; const p = a(u.scope, { prefix: this.classPrefix }); this.span(p) } closeNode(u) { i(u) && (this.buffer += r) } value() { return this.buffer } span(u) { this.buffer += `<span class="${u}">` } } const d = (o = {}) => { const u = { children: [] }; return Object.assign(u, o), u }; class c { constructor() { this.rootNode = d(), this.stack = [this.rootNode] } get top() { return this.stack[this.stack.length - 1] } get root() { return this.rootNode } add(u) { this.top.children.push(u) } openNode(u) { const p = d({ scope: u }); this.add(p), this.stack.push(p) } closeNode() { if (this.stack.length > 1) return this.stack.pop() } closeAllNodes() { for (; this.closeNode();); } toJSON() { return JSON.stringify(this.rootNode, null, 4) } walk(u) { return this.constructor._walk(u, this.rootNode) } static _walk(u, p) { return typeof p == "string" ? u.addText(p) : p.children && (u.openNode(p), p.children.forEach(_ => this._walk(u, _)), u.closeNode(p)), u } static _collapse(u) { typeof u != "string" && u.children && (u.children.every(p => typeof p == "string") ? u.children = [u.children.join("")] : u.children.forEach(p => { c._collapse(p) })) } } class m extends c { constructor(u) { super(), this.options = u } addText(u) { u !== "" && this.add(u) } startScope(u) { this.openNode(u) } endScope() { this.closeNode() } __addSublanguage(u, p) { const _ = u.root; p && (_.scope = `language:${p}`), this.add(_) } toHTML() { return new l(this, this.options).value() } finalize() { return this.closeAllNodes(), !0 } } function k(o) { return o ? typeof o == "string" ? o : o.source : null } function b(o) { return E("(?=", o, ")") } function C(o) { return E("(?:", o, ")*") } function S(o) { return E("(?:", o, ")?") } function E(...o) { return o.map(p => k(p)).join("") } function D(o) { const u = o[o.length - 1]; return typeof u == "object" && u.constructor === Object ? (o.splice(o.length - 1, 1), u) : {} } function F(...o) { return "(" + (D(o).capture ? "" : "?:") + o.map(_ => k(_)).join("|") + ")" } function L(o) { return new RegExp(o.toString() + "|").exec("").length - 1 } function Y(o, u) { const p = o && o.exec(u); return p && p.index === 0 } const W = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./; function J(o, { joinWith: u }) { let p = 0; return o.map(_ => { p += 1; const H = p; let z = k(_), x = ""; for (; z.length > 0;) { const g = W.exec(z); if (!g) { x += z; break } x += z.substring(0, g.index), z = z.substring(g.index + g[0].length), g[0][0] === "\\" && g[1] ? x += "\\" + String(Number(g[1]) + H) : (x += g[0], g[0] === "(" && p++) } return x }).map(_ => `(${_})`).join(u) } const V = /\b\B/, te = "[a-zA-Z]\\w*", Ee = "[a-zA-Z_]\\w*", Be = "\\b\\d+(\\.\\d+)?", $e = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", De = "\\b(0b[01]+)", rt = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", st = (o = {}) => { const u = /^#![ ]*\//; return o.binary && (o.begin = E(u, /.*\b/, o.binary, /\b.*/)), s({ scope: "meta", begin: u, end: /$/, relevance: 0, "on:begin": (p, _) => { p.index !== 0 && _.ignoreMatch() } }, o) }, ge = { begin: "\\\\[\\s\\S]", relevance: 0 }, it = { scope: "string", begin: "'", end: "'", illegal: "\\n", contains: [ge] }, He = { scope: "string", begin: '"', end: '"', illegal: "\\n", contains: [ge] }, ot = { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, j = function (o, u, p = {}) { const _ = s({ scope: "comment", begin: o, end: u, contains: [] }, p); _.contains.push({ scope: "doctag", begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)", end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/, excludeBegin: !0, relevance: 0 }); const H = F("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/); return _.contains.push({ begin: E(/[ ]+/, "(", H, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), _ }, de = j("//", "$"), me = j("/\\*", "\\*/"), ve = j("#", "$"), Re = { scope: "number", begin: Be, relevance: 0 }, ze = { scope: "number", begin: $e, relevance: 0 }, In = { scope: "number", begin: De, relevance: 0 }, Ln = { scope: "regexp", begin: /\/(?=[^/\n]*\/)/, end: /\/[gimuy]*/, contains: [ge, { begin: /\[/, end: /\]/, relevance: 0, contains: [ge] }] }, Pn = { scope: "title", begin: te, relevance: 0 }, Bn = { scope: "title", begin: Ee, relevance: 0 }, $n = { begin: "\\.\\s*" + Ee, relevance: 0 }; var Fe = Object.freeze({ __proto__: null, APOS_STRING_MODE: it, BACKSLASH_ESCAPE: ge, BINARY_NUMBER_MODE: In, BINARY_NUMBER_RE: De, COMMENT: j, C_BLOCK_COMMENT_MODE: me, C_LINE_COMMENT_MODE: de, C_NUMBER_MODE: ze, C_NUMBER_RE: $e, END_SAME_AS_BEGIN: function (o) { return Object.assign(o, { "on:begin": (u, p) => { p.data._beginMatch = u[1] }, "on:end": (u, p) => { p.data._beginMatch !== u[1] && p.ignoreMatch() } }) }, HASH_COMMENT_MODE: ve, IDENT_RE: te, MATCH_NOTHING_RE: V, METHOD_GUARD: $n, NUMBER_MODE: Re, NUMBER_RE: Be, PHRASAL_WORDS_MODE: ot, QUOTE_STRING_MODE: He, REGEXP_MODE: Ln, RE_STARTERS_RE: rt, SHEBANG: st, TITLE_MODE: Pn, UNDERSCORE_IDENT_RE: Ee, UNDERSCORE_TITLE_MODE: Bn }); function Dn(o, u) { o.input[o.index - 1] === "." && u.ignoreMatch() } function Hn(o, u) { o.className !== void 0 && (o.scope = o.className, delete o.className) } function zn(o, u) { u && o.beginKeywords && (o.begin = "\\b(" + o.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", o.__beforeBegin = Dn, o.keywords = o.keywords || o.beginKeywords, delete o.beginKeywords, o.relevance === void 0 && (o.relevance = 0)) } function Fn(o, u) { Array.isArray(o.illegal) && (o.illegal = F(...o.illegal)) } function Un(o, u) { if (o.match) { if (o.begin || o.end) throw new Error("begin & end are not supported with match"); o.begin = o.match, delete o.match } } function Xn(o, u) { o.relevance === void 0 && (o.relevance = 1) } const Gn = (o, u) => { if (!o.beforeMatch) return; if (o.starts) throw new Error("beforeMatch cannot be used with starts"); const p = Object.assign({}, o); Object.keys(o).forEach(_ => { delete o[_] }), o.keywords = p.keywords, o.begin = E(p.beforeMatch, b(p.begin)), o.starts = { relevance: 0, contains: [Object.assign(p, { endsParent: !0 })] }, o.relevance = 0, delete p.beforeMatch }, jn = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"], Zn = "keyword"; function Ot(o, u, p = Zn) { const _ = Object.create(null); return typeof o == "string" ? H(p, o.split(" ")) : Array.isArray(o) ? H(p, o) : Object.keys(o).forEach(function (z) { Object.assign(_, Ot(o[z], u, z)) }), _; function H(z, x) { u && (x = x.map(g => g.toLowerCase())), x.forEach(function (g) { const v = g.split("|"); _[v[0]] = [z, qn(v[0], v[1])] }) } } function qn(o, u) { return u ? Number(u) : Wn(o) ? 0 : 1 } function Wn(o) { return jn.includes(o.toLowerCase()) } const It = {}, be = o => { console.error(o) }, Lt = (o, ...u) => { console.log(`WARN: ${o}`, ...u) }, _e = (o, u) => { It[`${o}/${u}`] || (console.log(`Deprecated as of ${o}. ${u}`), It[`${o}/${u}`] = !0) }, Ue = new Error; function Pt(o, u, { key: p }) { let _ = 0; const H = o[p], z = {}, x = {}; for (let g = 1; g <= u.length; g++)x[g + _] = H[g], z[g + _] = !0, _ += L(u[g - 1]); o[p] = x, o[p]._emit = z, o[p]._multi = !0 } function Kn(o) { if (Array.isArray(o.begin)) { if (o.skip || o.excludeBegin || o.returnBegin) throw be("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ue; if (typeof o.beginScope != "object" || o.beginScope === null) throw be("beginScope must be object"), Ue; Pt(o, o.begin, { key: "beginScope" }), o.begin = J(o.begin, { joinWith: "" }) } } function Jn(o) { if (Array.isArray(o.end)) { if (o.skip || o.excludeEnd || o.returnEnd) throw be("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ue; if (typeof o.endScope != "object" || o.endScope === null) throw be("endScope must be object"), Ue; Pt(o, o.end, { key: "endScope" }), o.end = J(o.end, { joinWith: "" }) } } function Qn(o) { o.scope && typeof o.scope == "object" && o.scope !== null && (o.beginScope = o.scope, delete o.scope) } function Yn(o) { Qn(o), typeof o.beginScope == "string" && (o.beginScope = { _wrap: o.beginScope }), typeof o.endScope == "string" && (o.endScope = { _wrap: o.endScope }), Kn(o), Jn(o) } function Vn(o) { function u(x, g) { return new RegExp(k(x), "m" + (o.case_insensitive ? "i" : "") + (o.unicodeRegex ? "u" : "") + (g ? "g" : "")) } class p { constructor() { this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0 } addRule(g, v) { v.position = this.position++, this.matchIndexes[this.matchAt] = v, this.regexes.push([v, g]), this.matchAt += L(g) + 1 } compile() { this.regexes.length === 0 && (this.exec = () => null); const g = this.regexes.map(v => v[1]); this.matcherRe = u(J(g, { joinWith: "|" }), !0), this.lastIndex = 0 } exec(g) { this.matcherRe.lastIndex = this.lastIndex; const v = this.matcherRe.exec(g); if (!v) return null; const G = v.findIndex((Ce, lt) => lt > 0 && Ce !== void 0), U = this.matchIndexes[G]; return v.splice(0, G), Object.assign(v, U) } } class _ { constructor() { this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0 } getMatcher(g) { if (this.multiRegexes[g]) return this.multiRegexes[g]; const v = new p; return this.rules.slice(g).forEach(([G, U]) => v.addRule(G, U)), v.compile(), this.multiRegexes[g] = v, v } resumingScanAtSamePosition() { return this.regexIndex !== 0 } considerAll() { this.regexIndex = 0 } addRule(g, v) { this.rules.push([g, v]), v.type === "begin" && this.count++ } exec(g) { const v = this.getMatcher(this.regexIndex); v.lastIndex = this.lastIndex; let G = v.exec(g); if (this.resumingScanAtSamePosition() && !(G && G.index === this.lastIndex)) { const U = this.getMatcher(0); U.lastIndex = this.lastIndex + 1, G = U.exec(g) } return G && (this.regexIndex += G.position + 1, this.regexIndex === this.count && this.considerAll()), G } } function H(x) { const g = new _; return x.contains.forEach(v => g.addRule(v.begin, { rule: v, type: "begin" })), x.terminatorEnd && g.addRule(x.terminatorEnd, { type: "end" }), x.illegal && g.addRule(x.illegal, { type: "illegal" }), g } function z(x, g) { const v = x; if (x.isCompiled) return v;[Hn, Un, Yn, Gn].forEach(U => U(x, g)), o.compilerExtensions.forEach(U => U(x, g)), x.__beforeBegin = null, [zn, Fn, Xn].forEach(U => U(x, g)), x.isCompiled = !0; let G = null; return typeof x.keywords == "object" && x.keywords.$pattern && (x.keywords = Object.assign({}, x.keywords), G = x.keywords.$pattern, delete x.keywords.$pattern), G = G || /\w+/, x.keywords && (x.keywords = Ot(x.keywords, o.case_insensitive)), v.keywordPatternRe = u(G, !0), g && (x.begin || (x.begin = /\B|\b/), v.beginRe = u(v.begin), !x.end && !x.endsWithParent && (x.end = /\B|\b/), x.end && (v.endRe = u(v.end)), v.terminatorEnd = k(v.end) || "", x.endsWithParent && g.terminatorEnd && (v.terminatorEnd += (x.end ? "|" : "") + g.terminatorEnd)), x.illegal && (v.illegalRe = u(x.illegal)), x.contains || (x.contains = []), x.contains = [].concat(...x.contains.map(function (U) { return er(U === "self" ? x : U) })), x.contains.forEach(function (U) { z(U, v) }), x.starts && z(x.starts, g), v.matcher = H(v), v } if (o.compilerExtensions || (o.compilerExtensions = []), o.contains && o.contains.includes("self")) throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation."); return o.classNameAliases = s(o.classNameAliases || {}), z(o) } function Bt(o) { return o ? o.endsWithParent || Bt(o.starts) : !1 } function er(o) { return o.variants && !o.cachedVariants && (o.cachedVariants = o.variants.map(function (u) { return s(o, { variants: null }, u) })), o.cachedVariants ? o.cachedVariants : Bt(o) ? s(o, { starts: o.starts ? s(o.starts) : null }) : Object.isFrozen(o) ? s(o) : o } var tr = "11.11.1"; class nr extends Error { constructor(u, p) { super(u), this.name = "HTMLInjectionError", this.html = p } } const at = n, $t = s, Dt = Symbol("nomatch"), rr = 7, Ht = function (o) {
    const u = Object.create(null), p = Object.create(null), _ = []; let H = !0; const z = "Could not find the language '{}', did you forget to load/include a language module?", x = { disableAutodetect: !0, name: "Plain text", contains: [] }; let g = { ignoreUnescapedHTML: !1, throwUnescapedHTML: !1, noHighlightRe: /^(no-?highlight)$/i, languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-", cssSelector: "pre code", languages: null, __emitter: m }; function v(h) { return g.noHighlightRe.test(h) } function G(h) { let w = h.className + " "; w += h.parentNode ? h.parentNode.className : ""; const N = g.languageDetectRe.exec(w); if (N) { const P = he(N[1]); return P || (Lt(z.replace("{}", N[1])), Lt("Falling back to no-highlight mode for this block.", h)), P ? N[1] : "no-highlight" } return w.split(/\s+/).find(P => v(P) || he(P)) } function U(h, w, N) {
      let P = "", X = ""; typeof w == "object" ? (P = h, N = w.ignoreIllegals, X = w.language) : (_e("10.7.0", "highlight(lang, code, ...args) has been deprecated."), _e("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), X = h, P = w), N === void 0 && (N = !0); const ee = { code: P, language: X }; Ge("before:highlight", ee); const pe = ee.result ? ee.result : Ce(ee.language, ee.code, N); return pe.code = ee.code, Ge("after:highlight", pe), pe
    } function Ce(h, w, N, P) {
      const X = Object.create(null); function ee(f, y) { return f.keywords[y] } function pe() { if (!T.keywords) { Z.addText(B); return } let f = 0; T.keywordPatternRe.lastIndex = 0; let y = T.keywordPatternRe.exec(B), R = ""; for (; y;) { R += B.substring(f, y.index); const O = re.case_insensitive ? y[0].toLowerCase() : y[0], q = ee(T, O); if (q) { const [oe, wr] = q; if (Z.addText(R), R = "", X[O] = (X[O] || 0) + 1, X[O] <= rr && (qe += wr), oe.startsWith("_")) R += y[0]; else { const kr = re.classNameAliases[oe] || oe; ne(y[0], kr) } } else R += y[0]; f = T.keywordPatternRe.lastIndex, y = T.keywordPatternRe.exec(B) } R += B.substring(f), Z.addText(R) } function je() { if (B === "") return; let f = null; if (typeof T.subLanguage == "string") { if (!u[T.subLanguage]) { Z.addText(B); return } f = Ce(T.subLanguage, B, !0, qt[T.subLanguage]), qt[T.subLanguage] = f._top } else f = ct(B, T.subLanguage.length ? T.subLanguage : null); T.relevance > 0 && (qe += f.relevance), Z.__addSublanguage(f._emitter, f.language) } function Q() { T.subLanguage != null ? je() : pe(), B = "" } function ne(f, y) { f !== "" && (Z.startScope(y), Z.addText(f), Z.endScope()) } function Xt(f, y) { let R = 1; const O = y.length - 1; for (; R <= O;) { if (!f._emit[R]) { R++; continue } const q = re.classNameAliases[f[R]] || f[R], oe = y[R]; q ? ne(oe, q) : (B = oe, pe(), B = ""), R++ } } function Gt(f, y) { return f.scope && typeof f.scope == "string" && Z.openNode(re.classNameAliases[f.scope] || f.scope), f.beginScope && (f.beginScope._wrap ? (ne(B, re.classNameAliases[f.beginScope._wrap] || f.beginScope._wrap), B = "") : f.beginScope._multi && (Xt(f.beginScope, y), B = "")), T = Object.create(f, { parent: { value: T } }), T } function jt(f, y, R) { let O = Y(f.endRe, R); if (O) { if (f["on:end"]) { const q = new e(f); f["on:end"](y, q), q.isMatchIgnored && (O = !1) } if (O) { for (; f.endsParent && f.parent;)f = f.parent; return f } } if (f.endsWithParent) return jt(f.parent, y, R) } function gr(f) { return T.matcher.regexIndex === 0 ? (B += f[0], 1) : (pt = !0, 0) } function mr(f) { const y = f[0], R = f.rule, O = new e(R), q = [R.__beforeBegin, R["on:begin"]]; for (const oe of q) if (oe && (oe(f, O), O.isMatchIgnored)) return gr(y); return R.skip ? B += y : (R.excludeBegin && (B += y), Q(), !R.returnBegin && !R.excludeBegin && (B = y)), Gt(R, f), R.returnBegin ? 0 : y.length } function br(f) { const y = f[0], R = w.substring(f.index), O = jt(T, f, R); if (!O) return Dt; const q = T; T.endScope && T.endScope._wrap ? (Q(), ne(y, T.endScope._wrap)) : T.endScope && T.endScope._multi ? (Q(), Xt(T.endScope, f)) : q.skip ? B += y : (q.returnEnd || q.excludeEnd || (B += y), Q(), q.excludeEnd && (B = y)); do T.scope && Z.closeNode(), !T.skip && !T.subLanguage && (qe += T.relevance), T = T.parent; while (T !== O.parent); return O.starts && Gt(O.starts, f), q.returnEnd ? 0 : y.length } function xr() { const f = []; for (let y = T; y !== re; y = y.parent)y.scope && f.unshift(y.scope); f.forEach(y => Z.openNode(y)) } let Ze = {}; function Zt(f, y) {
        const R = y && y[0]; if (B += f, R == null) return Q(), 0; if (Ze.type === "begin" && y.type === "end" && Ze.index === y.index && R === "") { if (B += w.slice(y.index, y.index + 1), !H) { const O = new Error(`0 width match regex (${h})`); throw O.languageName = h, O.badRule = Ze.rule, O } return 1 } if (Ze = y, y.type === "begin") return mr(y); if (y.type === "illegal" && !N) { const O = new Error('Illegal lexeme "' + R + '" for mode "' + (T.scope || "<unnamed>") + '"'); throw O.mode = T, O } else if (y.type === "end") { const O = br(y); if (O !== Dt) return O } if (y.type === "illegal" && R === "") return B += `
`, 1; if (ht > 1e5 && ht > y.index * 3) throw new Error("potential infinite loop, way more iterations than matches"); return B += R, R.length
      } const re = he(h); if (!re) throw be(z.replace("{}", h)), new Error('Unknown language: "' + h + '"'); const yr = Vn(re); let dt = "", T = P || yr; const qt = {}, Z = new g.__emitter(g); xr(); let B = "", qe = 0, xe = 0, ht = 0, pt = !1; try { if (re.__emitTokens) re.__emitTokens(w, Z); else { for (T.matcher.considerAll(); ;) { ht++, pt ? pt = !1 : T.matcher.considerAll(), T.matcher.lastIndex = xe; const f = T.matcher.exec(w); if (!f) break; const y = w.substring(xe, f.index), R = Zt(y, f); xe = f.index + R } Zt(w.substring(xe)) } return Z.finalize(), dt = Z.toHTML(), { language: h, value: dt, relevance: qe, illegal: !1, _emitter: Z, _top: T } } catch (f) { if (f.message && f.message.includes("Illegal")) return { language: h, value: at(w), illegal: !0, relevance: 0, _illegalBy: { message: f.message, index: xe, context: w.slice(xe - 100, xe + 100), mode: f.mode, resultSoFar: dt }, _emitter: Z }; if (H) return { language: h, value: at(w), illegal: !1, relevance: 0, errorRaised: f, _emitter: Z, _top: T }; throw f }
    } function lt(h) { const w = { value: at(h), illegal: !1, relevance: 0, _top: x, _emitter: new g.__emitter(g) }; return w._emitter.addText(h), w } function ct(h, w) { w = w || g.languages || Object.keys(u); const N = lt(h), P = w.filter(he).filter(Ut).map(Q => Ce(Q, h, !1)); P.unshift(N); const X = P.sort((Q, ne) => { if (Q.relevance !== ne.relevance) return ne.relevance - Q.relevance; if (Q.language && ne.language) { if (he(Q.language).supersetOf === ne.language) return 1; if (he(ne.language).supersetOf === Q.language) return -1 } return 0 }), [ee, pe] = X, je = ee; return je.secondBest = pe, je } function sr(h, w, N) { const P = w && p[w] || N; h.classList.add("hljs"), h.classList.add(`language-${P}`) } function ut(h) { let w = null; const N = G(h); if (v(N)) return; if (Ge("before:highlightElement", { el: h, language: N }), h.dataset.highlighted) { console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", h); return } if (h.children.length > 0 && (g.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(h)), g.throwUnescapedHTML)) throw new nr("One of your code blocks includes unescaped HTML.", h.innerHTML); w = h; const P = w.textContent, X = N ? U(P, { language: N, ignoreIllegals: !0 }) : ct(P); h.innerHTML = X.value, h.dataset.highlighted = "yes", sr(h, N, X.language), h.result = { language: X.language, re: X.relevance, relevance: X.relevance }, X.secondBest && (h.secondBest = { language: X.secondBest.language, relevance: X.secondBest.relevance }), Ge("after:highlightElement", { el: h, result: X, text: P }) } function ir(h) { g = $t(g, h) } const or = () => { Xe(), _e("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.") }; function ar() { Xe(), _e("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.") } let zt = !1; function Xe() { function h() { Xe() } if (document.readyState === "loading") { zt || window.addEventListener("DOMContentLoaded", h, !1), zt = !0; return } document.querySelectorAll(g.cssSelector).forEach(ut) } function lr(h, w) { let N = null; try { N = w(o) } catch (P) { if (be("Language definition for '{}' could not be registered.".replace("{}", h)), H) be(P); else throw P; N = x } N.name || (N.name = h), u[h] = N, N.rawDefinition = w.bind(null, o), N.aliases && Ft(N.aliases, { languageName: h }) } function cr(h) { delete u[h]; for (const w of Object.keys(p)) p[w] === h && delete p[w] } function ur() { return Object.keys(u) } function he(h) { return h = (h || "").toLowerCase(), u[h] || u[p[h]] } function Ft(h, { languageName: w }) { typeof h == "string" && (h = [h]), h.forEach(N => { p[N.toLowerCase()] = w }) } function Ut(h) { const w = he(h); return w && !w.disableAutodetect } function dr(h) { h["before:highlightBlock"] && !h["before:highlightElement"] && (h["before:highlightElement"] = w => { h["before:highlightBlock"](Object.assign({ block: w.el }, w)) }), h["after:highlightBlock"] && !h["after:highlightElement"] && (h["after:highlightElement"] = w => { h["after:highlightBlock"](Object.assign({ block: w.el }, w)) }) } function hr(h) { dr(h), _.push(h) } function pr(h) { const w = _.indexOf(h); w !== -1 && _.splice(w, 1) } function Ge(h, w) { const N = h; _.forEach(function (P) { P[N] && P[N](w) }) } function fr(h) { return _e("10.7.0", "highlightBlock will be removed entirely in v12.0"), _e("10.7.0", "Please use highlightElement now."), ut(h) } Object.assign(o, { highlight: U, highlightAuto: ct, highlightAll: Xe, highlightElement: ut, highlightBlock: fr, configure: ir, initHighlighting: or, initHighlightingOnLoad: ar, registerLanguage: lr, unregisterLanguage: cr, listLanguages: ur, getLanguage: he, registerAliases: Ft, autoDetection: Ut, inherit: $t, addPlugin: hr, removePlugin: pr }), o.debugMode = function () { H = !1 }, o.safeMode = function () { H = !0 }, o.versionString = tr, o.regex = { concat: E, lookahead: b, either: F, optional: S, anyNumberOfTimes: C }; for (const h in Fe) typeof Fe[h] == "object" && t(Fe[h]); return Object.assign(o, Fe), o
  }, Te = Ht({}); return Te.newInstance = () => Ht({}), ft = Te, Te.HighlightJS = Te, Te.default = Te, ft
} var Bs = Ps(); const Pe = Ls(Bs); function $s(t) { const e = t.regex, n = {}, s = { begin: /\$\{/, end: /\}/, contains: ["self", { begin: /:-/, contains: [n] }] }; Object.assign(n, { className: "variable", variants: [{ begin: e.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])") }, s] }); const r = { className: "subst", begin: /\$\(/, end: /\)/, contains: [t.BACKSLASH_ESCAPE] }, i = t.inherit(t.COMMENT(), { match: [/(^|\s)/, /#.*$/], scope: { 2: "comment" } }), a = { begin: /<<-?\s*(?=\w+)/, starts: { contains: [t.END_SAME_AS_BEGIN({ begin: /(\w+)/, end: /(\w+)/, className: "string" })] } }, l = { className: "string", begin: /"/, end: /"/, contains: [t.BACKSLASH_ESCAPE, n, r] }; r.contains.push(l); const d = { match: /\\"/ }, c = { className: "string", begin: /'/, end: /'/ }, m = { match: /\\'/ }, k = { begin: /\$?\(\(/, end: /\)\)/, contains: [{ begin: /\d+#[0-9a-f]+/, className: "number" }, t.NUMBER_MODE, n] }, b = ["fish", "bash", "zsh", "sh", "csh", "ksh", "tcsh", "dash", "scsh"], C = t.SHEBANG({ binary: `(${b.join("|")})`, relevance: 10 }), S = { className: "function", begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/, returnBegin: !0, contains: [t.inherit(t.TITLE_MODE, { begin: /\w[\w\d_]*/ })], relevance: 0 }, E = ["if", "then", "else", "elif", "fi", "time", "for", "while", "until", "in", "do", "done", "case", "esac", "coproc", "function", "select"], D = ["true", "false"], F = { match: /(\/[a-z._-]+)+/ }, L = ["break", "cd", "continue", "eval", "exec", "exit", "export", "getopts", "hash", "pwd", "readonly", "return", "shift", "test", "times", "trap", "umask", "unset"], Y = ["alias", "bind", "builtin", "caller", "command", "declare", "echo", "enable", "help", "let", "local", "logout", "mapfile", "printf", "read", "readarray", "source", "sudo", "type", "typeset", "ulimit", "unalias"], W = ["autoload", "bg", "bindkey", "bye", "cap", "chdir", "clone", "comparguments", "compcall", "compctl", "compdescribe", "compfiles", "compgroups", "compquote", "comptags", "comptry", "compvalues", "dirs", "disable", "disown", "echotc", "echoti", "emulate", "fc", "fg", "float", "functions", "getcap", "getln", "history", "integer", "jobs", "kill", "limit", "log", "noglob", "popd", "print", "pushd", "pushln", "rehash", "sched", "setcap", "setopt", "stat", "suspend", "ttyctl", "unfunction", "unhash", "unlimit", "unsetopt", "vared", "wait", "whence", "where", "which", "zcompile", "zformat", "zftp", "zle", "zmodload", "zparseopts", "zprof", "zpty", "zregexparse", "zsocket", "zstyle", "ztcp"], J = ["chcon", "chgrp", "chown", "chmod", "cp", "dd", "df", "dir", "dircolors", "ln", "ls", "mkdir", "mkfifo", "mknod", "mktemp", "mv", "realpath", "rm", "rmdir", "shred", "sync", "touch", "truncate", "vdir", "b2sum", "base32", "base64", "cat", "cksum", "comm", "csplit", "cut", "expand", "fmt", "fold", "head", "join", "md5sum", "nl", "numfmt", "od", "paste", "ptx", "pr", "sha1sum", "sha224sum", "sha256sum", "sha384sum", "sha512sum", "shuf", "sort", "split", "sum", "tac", "tail", "tr", "tsort", "unexpand", "uniq", "wc", "arch", "basename", "chroot", "date", "dirname", "du", "echo", "env", "expr", "factor", "groups", "hostid", "id", "link", "logname", "nice", "nohup", "nproc", "pathchk", "pinky", "printenv", "printf", "pwd", "readlink", "runcon", "seq", "sleep", "stat", "stdbuf", "stty", "tee", "test", "timeout", "tty", "uname", "unlink", "uptime", "users", "who", "whoami", "yes"]; return { name: "Bash", aliases: ["sh", "zsh"], keywords: { $pattern: /\b[a-z][a-z0-9._-]+\b/, keyword: E, literal: D, built_in: [...L, ...Y, "set", "shopt", ...W, ...J] }, contains: [C, t.SHEBANG(), S, k, i, a, F, l, d, c, m, n] } } const et = "[A-Za-z$_][0-9A-Za-z$_]*", _n = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends", "using"], Tn = ["true", "false", "null", "undefined", "NaN", "Infinity"], An = ["Object", "Function", "Boolean", "Symbol", "Math", "Date", "Number", "BigInt", "String", "RegExp", "Array", "Float32Array", "Float64Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Int32Array", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array", "Set", "Map", "WeakSet", "WeakMap", "ArrayBuffer", "SharedArrayBuffer", "Atomics", "DataView", "JSON", "Promise", "Generator", "GeneratorFunction", "AsyncFunction", "Reflect", "Proxy", "Intl", "WebAssembly"], Rn = ["Error", "EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"], Cn = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], Nn = ["arguments", "this", "super", "console", "window", "document", "localStorage", "sessionStorage", "module", "global"], Mn = [].concat(Cn, An, Rn); function Ds(t) { const e = t.regex, n = (j, { after: de }) => { const me = "</" + j[0].slice(1); return j.input.indexOf(me, de) !== -1 }, s = et, r = { begin: "<>", end: "</>" }, i = /<[A-Za-z0-9\\._:-]+\s*\/>/, a = { begin: /<[A-Za-z0-9\\._:-]+/, end: /\/[A-Za-z0-9\\._:-]+>|\/>/, isTrulyOpeningTag: (j, de) => { const me = j[0].length + j.index, ve = j.input[me]; if (ve === "<" || ve === ",") { de.ignoreMatch(); return } ve === ">" && (n(j, { after: me }) || de.ignoreMatch()); let Re; const ze = j.input.substring(me); if (Re = ze.match(/^\s*=/)) { de.ignoreMatch(); return } if ((Re = ze.match(/^\s+extends\s+/)) && Re.index === 0) { de.ignoreMatch(); return } } }, l = { $pattern: et, keyword: _n, literal: Tn, built_in: Mn, "variable.language": Nn }, d = "[0-9](_?[0-9])*", c = `\\.(${d})`, m = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", k = { className: "number", variants: [{ begin: `(\\b(${m})((${c})|\\.)?|(${c}))[eE][+-]?(${d})\\b` }, { begin: `\\b(${m})\\b((${c})\\b|\\.)?|(${c})\\b` }, { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" }, { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" }, { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" }, { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" }, { begin: "\\b0[0-7]+n?\\b" }], relevance: 0 }, b = { className: "subst", begin: "\\$\\{", end: "\\}", keywords: l, contains: [] }, C = { begin: ".?html`", end: "", starts: { end: "`", returnEnd: !1, contains: [t.BACKSLASH_ESCAPE, b], subLanguage: "xml" } }, S = { begin: ".?css`", end: "", starts: { end: "`", returnEnd: !1, contains: [t.BACKSLASH_ESCAPE, b], subLanguage: "css" } }, E = { begin: ".?gql`", end: "", starts: { end: "`", returnEnd: !1, contains: [t.BACKSLASH_ESCAPE, b], subLanguage: "graphql" } }, D = { className: "string", begin: "`", end: "`", contains: [t.BACKSLASH_ESCAPE, b] }, L = { className: "comment", variants: [t.COMMENT(/\/\*\*(?!\/)/, "\\*/", { relevance: 0, contains: [{ begin: "(?=@[A-Za-z]+)", relevance: 0, contains: [{ className: "doctag", begin: "@[A-Za-z]+" }, { className: "type", begin: "\\{", end: "\\}", excludeEnd: !0, excludeBegin: !0, relevance: 0 }, { className: "variable", begin: s + "(?=\\s*(-)|$)", endsParent: !0, relevance: 0 }, { begin: /(?=[^\n])\s/, relevance: 0 }] }] }), t.C_BLOCK_COMMENT_MODE, t.C_LINE_COMMENT_MODE] }, Y = [t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, C, S, E, D, { match: /\$\d+/ }, k]; b.contains = Y.concat({ begin: /\{/, end: /\}/, keywords: l, contains: ["self"].concat(Y) }); const W = [].concat(L, b.contains), J = W.concat([{ begin: /(\s*)\(/, end: /\)/, keywords: l, contains: ["self"].concat(W) }]), V = { className: "params", begin: /(\s*)\(/, end: /\)/, excludeBegin: !0, excludeEnd: !0, keywords: l, contains: J }, te = { variants: [{ match: [/class/, /\s+/, s, /\s+/, /extends/, /\s+/, e.concat(s, "(", e.concat(/\./, s), ")*")], scope: { 1: "keyword", 3: "title.class", 5: "keyword", 7: "title.class.inherited" } }, { match: [/class/, /\s+/, s], scope: { 1: "keyword", 3: "title.class" } }] }, Ee = { relevance: 0, match: e.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/), className: "title.class", keywords: { _: [...An, ...Rn] } }, Be = { label: "use_strict", className: "meta", relevance: 10, begin: /^\s*['"]use (strict|asm)['"]/ }, $e = { variants: [{ match: [/function/, /\s+/, s, /(?=\s*\()/] }, { match: [/function/, /\s*(?=\()/] }], className: { 1: "keyword", 3: "title.function" }, label: "func.def", contains: [V], illegal: /%/ }, De = { relevance: 0, match: /\b[A-Z][A-Z_0-9]+\b/, className: "variable.constant" }; function rt(j) { return e.concat("(?!", j.join("|"), ")") } const st = { match: e.concat(/\b/, rt([...Cn, "super", "import"].map(j => `${j}\\s*\\(`)), s, e.lookahead(/\s*\(/)), className: "title.function", relevance: 0 }, ge = { begin: e.concat(/\./, e.lookahead(e.concat(s, /(?![0-9A-Za-z$_(])/))), end: s, excludeBegin: !0, keywords: "prototype", className: "property", relevance: 0 }, it = { match: [/get|set/, /\s+/, s, /(?=\()/], className: { 1: "keyword", 3: "title.function" }, contains: [{ begin: /\(\)/ }, V] }, He = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + t.UNDERSCORE_IDENT_RE + ")\\s*=>", ot = { match: [/const|var|let/, /\s+/, s, /\s*/, /=\s*/, /(async\s*)?/, e.lookahead(He)], keywords: "async", className: { 1: "keyword", 3: "title.function" }, contains: [V] }; return { name: "JavaScript", aliases: ["js", "jsx", "mjs", "cjs"], keywords: l, exports: { PARAMS_CONTAINS: J, CLASS_REFERENCE: Ee }, illegal: /#(?![$_A-z])/, contains: [t.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }), Be, t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, C, S, E, D, L, { match: /\$\d+/ }, k, Ee, { scope: "attr", match: s + e.lookahead(":"), relevance: 0 }, ot, { begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*", keywords: "return throw case", relevance: 0, contains: [L, t.REGEXP_MODE, { className: "function", begin: He, returnBegin: !0, end: "\\s*=>", contains: [{ className: "params", variants: [{ begin: t.UNDERSCORE_IDENT_RE, relevance: 0 }, { className: null, begin: /\(\s*\)/, skip: !0 }, { begin: /(\s*)\(/, end: /\)/, excludeBegin: !0, excludeEnd: !0, keywords: l, contains: J }] }] }, { begin: /,/, relevance: 0 }, { match: /\s+/, relevance: 0 }, { variants: [{ begin: r.begin, end: r.end }, { match: i }, { begin: a.begin, "on:begin": a.isTrulyOpeningTag, end: a.end }], subLanguage: "xml", contains: [{ begin: a.begin, end: a.end, skip: !0, contains: ["self"] }] }] }, $e, { beginKeywords: "while if switch catch for" }, { begin: "\\b(?!function)" + t.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{", returnBegin: !0, label: "func.def", contains: [V, t.inherit(t.TITLE_MODE, { begin: s, className: "title.function" })] }, { match: /\.\.\./, relevance: 0 }, ge, { match: "\\$" + s, relevance: 0 }, { match: [/\bconstructor(?=\s*\()/], className: { 1: "title.function" }, contains: [V] }, st, De, te, it, { match: /\$[(.]/ }] } } function Hs(t) { const e = t.regex, n = Ds(t), s = et, r = ["any", "void", "number", "boolean", "string", "object", "never", "symbol", "bigint", "unknown"], i = { begin: [/namespace/, /\s+/, t.IDENT_RE], beginScope: { 1: "keyword", 3: "title.class" } }, a = { beginKeywords: "interface", end: /\{/, excludeEnd: !0, keywords: { keyword: "interface extends", built_in: r }, contains: [n.exports.CLASS_REFERENCE] }, l = { className: "meta", relevance: 10, begin: /^\s*['"]use strict['"]/ }, d = ["type", "interface", "public", "private", "protected", "implements", "declare", "abstract", "readonly", "enum", "override", "satisfies"], c = { $pattern: et, keyword: _n.concat(d), literal: Tn, built_in: Mn.concat(r), "variable.language": Nn }, m = { className: "meta", begin: "@" + s }, k = (E, D, F) => { const L = E.contains.findIndex(Y => Y.label === D); if (L === -1) throw new Error("can not find mode to replace"); E.contains.splice(L, 1, F) }; Object.assign(n.keywords, c), n.exports.PARAMS_CONTAINS.push(m); const b = n.contains.find(E => E.scope === "attr"), C = Object.assign({}, b, { match: e.concat(s, e.lookahead(/\s*\?:/)) }); n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE, b, C]), n.contains = n.contains.concat([m, i, a, C]), k(n, "shebang", t.SHEBANG()), k(n, "use_strict", l); const S = n.contains.find(E => E.label === "func.def"); return S.relevance = 0, Object.assign(n, { name: "TypeScript", aliases: ["ts", "tsx", "mts", "cts"] }), n } function zs(t) { const e = t.regex, n = e.concat(/[\p{L}_]/u, e.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), s = /[\p{L}0-9._:-]+/u, r = { className: "symbol", begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/ }, i = { begin: /\s/, contains: [{ className: "keyword", begin: /#?[a-z_][a-z1-9_-]+/, illegal: /\n/ }] }, a = t.inherit(i, { begin: /\(/, end: /\)/ }), l = t.inherit(t.APOS_STRING_MODE, { className: "string" }), d = t.inherit(t.QUOTE_STRING_MODE, { className: "string" }), c = { endsWithParent: !0, illegal: /</, relevance: 0, contains: [{ className: "attr", begin: s, relevance: 0 }, { begin: /=\s*/, relevance: 0, contains: [{ className: "string", endsParent: !0, variants: [{ begin: /"/, end: /"/, contains: [r] }, { begin: /'/, end: /'/, contains: [r] }, { begin: /[^\s"'=<>`]+/ }] }] }] }; return { name: "HTML, XML", aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"], case_insensitive: !0, unicodeRegex: !0, contains: [{ className: "meta", begin: /<![a-z]/, end: />/, relevance: 10, contains: [i, d, l, a, { begin: /\[/, end: /\]/, contains: [{ className: "meta", begin: /<![a-z]/, end: />/, contains: [i, a, d, l] }] }] }, t.COMMENT(/<!--/, /-->/, { relevance: 10 }), { begin: /<!\[CDATA\[/, end: /\]\]>/, relevance: 10 }, r, { className: "meta", end: /\?>/, variants: [{ begin: /<\?xml/, relevance: 10, contains: [d] }, { begin: /<\?[a-z][a-z0-9]+/ }] }, { className: "tag", begin: /<style(?=\s|>)/, end: />/, keywords: { name: "style" }, contains: [c], starts: { end: /<\/style>/, returnEnd: !0, subLanguage: ["css", "xml"] } }, { className: "tag", begin: /<script(?=\s|>)/, end: />/, keywords: { name: "script" }, contains: [c], starts: { end: /<\/script>/, returnEnd: !0, subLanguage: ["javascript", "handlebars", "xml"] } }, { className: "tag", begin: /<>|<\/>/ }, { className: "tag", begin: e.concat(/</, e.lookahead(e.concat(n, e.either(/\/>/, />/, /\s/)))), end: /\/?>/, contains: [{ className: "name", begin: n, relevance: 0, starts: c }] }, { className: "tag", begin: e.concat(/<\//, e.lookahead(e.concat(n, />/))), contains: [{ className: "name", begin: n, relevance: 0 }, { begin: />/, relevance: 0, endsParent: !0 }] }] } } const St = fe("todo"), Fs = Ie(() => { const t = St(); if (typeof t == "string" || !t) return '<p class="border rounded-md p-2">Start editing to get a preview!</p>'; const e = dn(t); return e instanceof Text ? '<p class="border rounded-md p-2">Start editing to get a preview!</p>' : (console.log("Preview HTML:", e.outerHTML), On(e), e.outerHTML) }), gt = "editor_content"; function Us() { const t = s => { s.preventDefault(); const r = document.getSelection(); if (!r || r.rangeCount === 0) return; const i = r.getRangeAt(0); if (i.collapsed) return; const a = document.createElement("strong"); try { i.surroundContents(a), r.removeAllRanges(), e() } catch { try { const d = i.extractContents(); a.appendChild(d), i.insertNode(a), r.removeAllRanges(), e() } catch (d) { console.warn("Could not apply bold formatting:", d) } } }, e = () => { const s = document.getElementById(gt); s && St(un(s)) }; return $("div", { class: "p-2 w-full flex flex-auto gap-4 flex-col", children: [$("div", { id: "article_editor", children: [$("div", { id: "edit_buttons", class: "p-2 flex gap-2", children: [A("span", { children: "Formatting:" }), A("button", { class: "p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700", onmousedown: t, title: "Bold selected text", children: A("strong", { children: "B" }) })] }), A("div", { class: "border-2 rounded-md p-2 bg-white text-black", children: A("div", { id: gt, class: "", children: A("article", { contentEditable: "true", oninput: s => { e() }, children: $("p", { children: ["Edit me! Select some text and click the ", A("strong", { children: "B" }), " button to make it bold."] }) }) }) })] }), $("div", { children: [A("p", { class: "text-xl font-semibold", children: "Preview:" }), A("div", { class: "p-2 border-2 bg-white text-black", children: A("div", { innerHTML: Fs }) })] }), $("div", { class: "p-2 bg-purple-950 rounded-md", children: [A("p", { class: "text-xl font-semibold", children: "JSON:" }), A("div", { class: "bg-black/20 p-2 border-2 border-gray-500 rounded-md", children: A("output", { class: "", name: "json_output", for: gt, children: A("pre", { class: "overflow-x-scroll", children: () => JSON.stringify(St(), null, "  ") }) }) })] })] }) } function On(t) { t.removeAttribute("contenteditable"); for (const e of t.children) On(e) } const Xs = `import {
  HFXObjectToElement,
  nodeToHFXObject,
  JSX,
  createSignal,
  createComputed,
} from "hyperfx";
import type { HFXObject } from "hyperfx";

// Create reactive signals for state management
const articleSignal = createSignal<HFXObject>("todo" as HFXObject);

// Create a derived signal for the preview HTML
const previewHtml = createComputed(() => {
  const articleContent = articleSignal();
  if (typeof articleContent === 'string' || !articleContent) {
    return '<p class="border rounded-md p-2">Start editing to get a preview!</p>';
  }

  const render = HFXObjectToElement(articleContent);
  if (render instanceof Text) {
    return '<p class="border rounded-md p-2">Start editing to get a preview!</p>';
  }
  console.log("Preview HTML:", render.outerHTML);
  removeContentEditable(render);
  return render.outerHTML;
});

const editor_content_id = "editor_content" as const;

export function editor(): JSX.Element {
  const handleBoldClick = (e: MouseEvent) => {
    e.preventDefault();

    // Get the current selection
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // No text selected

    // Create a bold element
    const boldElement = document.createElement('strong');

    try {
      // Wrap the selected content in a bold element
      range.surroundContents(boldElement);

      // Clear the selection
      selection.removeAllRanges();

      // Update the article signal with the new content
      updateArticleFromEditor();
    } catch (error) {
      // If surroundContents fails (e.g., selection spans multiple elements),
      // extract the contents and wrap them
      try {
        const contents = range.extractContents();
        boldElement.appendChild(contents);
        range.insertNode(boldElement);

        // Clear the selection
        selection.removeAllRanges();

        // Update the article signal
        updateArticleFromEditor();
      } catch (innerError) {
        console.warn('Could not apply bold formatting:', innerError);
      }
    }
  };

  const updateArticleFromEditor = () => {
    const editorEl = document.getElementById(editor_content_id);
    if (editorEl) {
      articleSignal(nodeToHFXObject(editorEl));
    }
  };

  const handleInput = (_e: InputEvent) => {
    // Update the article signal when content changes
    updateArticleFromEditor();
  };

  return (
    <div class="p-2 w-full flex flex-auto gap-4 flex-col">
      <div id="article_editor">
        <div id="edit_buttons" class="p-2 flex gap-2">
          <span>Formatting:</span>
          <button
            class="p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700"
            onmousedown={handleBoldClick}
            title="Bold selected text"
          >
            <strong>B</strong>
          </button>
        </div>
        <div class="border-2 rounded-md p-2 bg-white text-black">
          <div id={editor_content_id} class="">
            <article contentEditable="true" oninput={handleInput}>
              <p>Edit me! Select some text and click the <strong>B</strong> button to make it bold.</p>
            </article>
          </div>
        </div>
      </div>
      <div>
        <p class="text-xl font-semibold">Preview:</p>
        <div class="p-2 border-2 bg-white text-black">
          <div innerHTML={previewHtml}></div>
        </div>
      </div>
      <div class="p-2 bg-purple-950 rounded-md">
        <p class="text-xl font-semibold">JSON:</p>
        <div class="bg-black/20 p-2 border-2 border-gray-500 rounded-md">
          <output class="" name="json_output" for={editor_content_id}>
            <pre class="overflow-x-scroll">
              {() => JSON.stringify(articleSignal(), null, "  ")}
            </pre>
          </output>
        </div>
      </div>
    </div>
  );
}

function removeContentEditable(e: Element) {
  e.removeAttribute("contenteditable");
  for (const e2 of e.children) {
    removeContentEditable(e2);
  }
}`; Pe.registerLanguage("typescript", Hs); Pe.registerLanguage("html", zs); Pe.registerLanguage("bash", $s); const Gs = vn(Is); function rn(t) { document.title = t } function sn(t) { const e = document.querySelector('meta[name="description"]'); e && e.setAttribute("content", t) } function js() { const t = cn(), e = Ie(() => { const s = $r("doc")() || "main"; return hn.find(i => i.route_name == s) }), n = Ie(() => { const s = e(); return s ? vn(s.data) : "" }); return ue(() => { const s = e(); s ? (rn(`${s.title} | HyperFX`), sn(`HyperFX docs about ${s.title}.`)) : (rn("HyperFX"), sn("HyperFX docs")) }), ue(() => { t(), setTimeout(() => { const s = document.querySelectorAll("pre code"); for (const r of s) Pe.highlightElement(r) }, 0) }), $(ln, { children: [A(Jt, { when: () => e() !== void 0 && e().route_name !== "main", children: $("div", { class: "flex flex-auto", children: [A(Jr, {}), A("article", { class: "p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl", children: A("div", { class: "markdown-body", innerHTML: n }) })] }) }), A(Jt, { when: () => e() === void 0 || e().route_name === "main", children: $("div", { class: "grow flex flex-col", children: [A("article", { class: "p-4 mx-auto w-full max-w-4xl", children: A("div", { class: "markdown-body-main", innerHTML: Gs }) }), $("div", { class: "p-2 bg-red-950 text-white mt-4 mx-auto", children: [A("p", { class: "text-xl", children: "This is a work in progress!" }), A("p", { class: "text-xl", children: "The docs are not finished yet!" })] })] }) })] }) } function Zs() { const t = Us(), e = A("pre", { class: "mx-auto max-w-[70vw]! max-h-[50vw]", children: A("code", { class: "language-tsx", children: Xs }) }); return ue(() => { setTimeout(() => { const n = document.querySelector("pre code"); n && n.attributes.getNamedItem("data-highlighted")?.value != "yes" && Pe.highlightElement(n) }, 0) }), $("div", { class: "flex flex-col p-4 max-w-[80vw] mx-auto", children: [$("div", { class: "p-2", children: [$("p", { class: "mx-auto", children: ["This is the code used to create the editor.", $("span", { class: "text-purple-500/80", children: [" ", "(The editor is far from done but it is still cool IMO.)"] })] }), A("div", { class: "w-full", children: e })] }), t] }) } function qs() { const t = Br(), e = cn(); return ue(() => { e() === "/" && t("/hyperfx") }), $("div", { class: "flex flex-auto flex-col min-h-screen", children: [A(Wr, {}), $("main", { class: "flex flex-auto flex-col", id: "main-content", children: [A("p", { class: "p-2 bg-red-800 text-white text-center w-full! max-w-full!", children: "A LOT OF CHANGES. DOCS ARE NOT UP TO DATE." }), A(Kt, { path: "/hyperfx/editor", component: Zs }), A(Kt, { path: "/hyperfx", component: js, exact: !0 })] }), $("footer", { class: "bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto", children: [A("a", { href: "https://github.com/ArnoudK/hyperfx", target: "_blank", class: "underline", children: "Github" }), $("span", { class: "w-full ", children: [" - © ", new Date().getFullYear(), " Arnoud Kerkhof"] })] })] }) } function Ws() { return A(Pr, { initialPath: "/hyperfx", children: () => A(qs, {}) }) } const Ks = document.getElementById("app"); Ks.replaceChildren(Ws());
