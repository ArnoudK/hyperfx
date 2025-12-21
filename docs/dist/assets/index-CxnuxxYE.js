(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();let ie=!1;const ae=new Set;class Ar{constructor(e){this.subscribers=new Set,this._value=e}get(){return ie&&ae.add(this.callableSignal),this._value}set(e){return Object.is(this._value,e)||(this._value=e,this.subscribers.forEach(n=>{try{n(e)}catch(s){console.error("Signal subscriber error:",s)}})),e}subscribe(e){return this.subscribers.add(e),()=>{this.subscribers.delete(e)}}peek(){return this._value}update(e){return this.set(e(this._value))}get subscriberCount(){return this.subscribers.size}}function pe(t){const e=new Ar(t),n=Object.assign(s=>s!==void 0?e.set(s):e.get(),{get:()=>e.get(),set:s=>e.set(s),subscribe:s=>e.subscribe(s),peek:()=>e.peek(),update:s=>e.update(s)});return Object.defineProperty(n,"subscriberCount",{get(){return e.subscriberCount},enumerable:!0,configurable:!0}),e.callableSignal=n,n}function dn(t){const e=ie;ie=!0,ae.clear();let n;try{n=t()}finally{ie=e}const s=pe(n),r=Array.from(ae);ae.clear();const i=s.set;s.set=()=>{throw new Error("Cannot set computed signal directly. Computed signals are read-only.")};const a=r.map(c=>c.subscribe(()=>{const d=t();i(d)}));return s._unsubscribers=a,s}function Rr(t){const e=ie;ie=!0,ae.clear();let n;n=t();const r=Array.from(ae).map(i=>i.subscribe(()=>{const a=ie;ie=!0,ae.clear(),typeof n=="function"&&n(),n=t(),ie=a,ae.clear()}));return ie=e,ae.clear(),()=>{r.forEach(i=>{i()}),typeof n=="function"&&n()}}function fe(t){return typeof t=="function"&&"subscribe"in t&&"get"in t&&"set"in t}let Cr=0;const Ae=new WeakMap;function gt(t,e,n,s){try{if(fe(n)){const r=()=>{try{s(t,n())}catch(a){console.error(`Error updating ${e}:`,a),s(t,"")}},i=n.subscribe(()=>Qt(r));Yt(t,i),r()}else if(typeof n=="function"){const r=dn(n),i=()=>{try{s(t,r())}catch(c){console.error(`Error updating computed ${e}:`,c),s(t,"")}},a=r.subscribe(()=>Qt(i));Yt(t,a),i()}else s(t,n)}catch(r){console.error(`Error setting up reactivity for ${e}:`,r)}}typeof window<"u"&&typeof MutationObserver<"u"&&new MutationObserver(e=>{e.forEach(n=>{n.removedNodes.forEach(s=>{s instanceof Element&&Ae.has(s)&&Vt(s),s instanceof Element&&s.querySelectorAll("*").forEach(r=>{Ae.has(r)&&Vt(r)})})})}).observe(document.body,{childList:!0,subtree:!0});function Qt(t){t()}function Nr(){return typeof window>"u"||typeof document>"u"}function Mr(){return String(++Cr).padStart(6,"0")}function Yt(t,e){const n=Ae.get(t);n?n.add(e):Ae.set(t,new Set([e]))}function Vt(t){const e=Ae.get(t);e&&(e.forEach(n=>{try{n()}catch(s){console.error("Error during subscription cleanup:",s)}}),e.clear(),Ae.delete(t))}function xt(t,e,n){if(e==="children"||e==="key")return;if(e.startsWith("on")&&typeof n=="function"){const r=e.slice(2).toLowerCase();t.addEventListener(r,n);return}if(e==="innerHTML"||e==="textContent"){gt(t,e,n,(r,i)=>r[e]=i);return}if(fe(n)){gt(t,e,n,(r,i)=>xt(r,e,i));return}else if(typeof n=="function"){gt(t,e,n,(r,i)=>xt(r,e,i));return}if(e==="class"){n!=null?t.className=String(n):t.removeAttribute("class");return}if(new Set(["disabled","checked","readonly","readOnly","required","autofocus","autoplay","controls","default","defer","hidden","inert","loop","multiple","muted","novalidate","open","reversed","selected"]).has(e)){const r=!!n;e==="checked"&&t instanceof HTMLInputElement?(t.checked=r,t.toggleAttribute("checked",r)):(e==="readonly"||e==="readOnly")&&t instanceof HTMLInputElement?(t.readOnly=r,t.toggleAttribute("readonly",r)):e==="disabled"?(t.disabled=r,t.toggleAttribute("disabled",r)):t.toggleAttribute(e,r);return}if(e==="style"){n==null?t.removeAttribute("style"):typeof n=="string"?t.setAttribute("style",n):typeof n=="object"?Object.entries(n).forEach(([r,i])=>{if(i!=null)try{const a=r.replace(/-([a-z])/g,(c,d)=>d.toUpperCase());t.style[a]=String(i)}catch(a){console.warn(`Failed to set CSS property "${r}":`,a)}}):t.setAttribute("style",String(n));return}if(e==="value"&&t instanceof HTMLInputElement){t.value=String(n||"");return}n!=null?t.setAttribute(e,String(n)):t.removeAttribute(e)}const Or={applyAttribute(t,e,n){xt(t,e,n)},applyAttributes(t,e){for(const[n,s]of Object.entries(e))this.applyAttribute(t,n,s)}},Ir=Symbol("HyperFX.Fragment");function Lr(t,e){let n;return n=document.createElement(t),Nr()||n.setAttribute("data-hfxh",Mr()),e&&Or.applyAttributes(n,e),n}function Pr(t){const e=document.createTextNode(""),n=()=>{let s="";fe(t)?s=String(t()):s=String(t),e.textContent=s};return n(),fe(t)&&t.subscribe(n),e}function hn(t,e,n){const s=Array.isArray(e)?e:[e];for(const r of s)if(!(r==null||r===!1||r===!0))if(fe(r)){const i=r();if(i instanceof Node)t.appendChild(i);else{const a=Pr(r);t.appendChild(a)}}else if(typeof r=="function")try{const i=r();if(i instanceof Node)t.appendChild(i),n?.add(i);else if(Array.isArray(i))hn(t,i,n);else{const a=document.createTextNode(String(i));t.appendChild(a),n?.add(a)}}catch(i){console.warn("Error rendering function child:",i)}else if(typeof r=="object"&&r instanceof Node)t.appendChild(r);else{const i=document.createTextNode(String(r));t.appendChild(i)}}function yt(t,e){if(!e)return;hn(t,e,void 0)}function pn(t){const e=document.createDocumentFragment();return yt(e,t.children),e}function A(t,e,n){if(t===Ir||t===pn){const r=e?.children,i=document.createDocumentFragment();return yt(i,r),i}if(typeof t=="function"){const r=new Proxy(e||{},{get(i,a,c){const d=Reflect.get(i,a,c);return fe(d)?d():d}});return t(r)}const s=Lr(t,e);return e?.children&&yt(s,e.children),s}const B=A;function Le(t){return dn(t)}function ge(t){return Rr(t)}const wt=new Map;function $r(t){const e=Symbol("Context");return{id:e,defaultValue:t,Provider:s=>{let r=wt.get(e);r||(r=[],wt.set(e,r)),r.push(s.value);let i;try{typeof s.children=="function"?i=s.children():(console.warn("Context.Provider: children should be a function to receive context value."),i=s.children)}finally{r.pop()}if(Array.isArray(i)){const a=document.createDocumentFragment();return i.forEach(c=>{c instanceof Node&&a.appendChild(c)}),a}return i}}}function Re(t){const e=wt.get(t.id);return e&&e.length>0?e[e.length-1]:t.defaultValue}const we=$r(null);function Br(t){Re(we)&&console.warn("Router: Nested routers are not fully supported yet");const n=pe(t.initialPath||window.location.pathname+window.location.search),s=pe([n()]),r=pe(0);ge(()=>{const l=()=>{const m=window.location.pathname+window.location.search||"/";n(m);const k=[...s()];k[r()]=m,s(k)};return window.addEventListener("popstate",l),()=>{window.removeEventListener("popstate",l)}});const d={currentPath:n,navigate:(l,m={})=>{if(m.replace){window.history.replaceState({},"",l);const k=[...s()];k[r()]=l,s(k)}else{window.history.pushState({},"",l);const k=[...s().slice(0,r()+1),l];s(k),r(r()+1)}n(l)},back:()=>{if(r()>0){const l=r()-1;r(l);const m=s()[l]||"/";window.history.back(),n(m)}},forward:()=>{if(r()<s().length-1){const l=r()+1;r(l);const m=s()[l]||"/";window.history.forward(),n(m)}}};return we.Provider({value:d,children:t.children})}function en(t){const e=document.createDocumentFragment(),n=document.createComment(`Route start: ${t.path}`),s=document.createComment(`Route end: ${t.path}`);e.appendChild(n),e.appendChild(s);let r=[],i=!1;const{path:a,component:c,children:d,exact:l,...m}=t,k=Re(we);return ge(()=>{if(!k)return;const b=k.currentPath,E=b().split("?")[0],S=l!==void 0&&l?E===a:E.startsWith(a);if(S===i)return;i=S;const F=n.parentNode||e;if(r.forEach(L=>{L.parentNode===F&&L.parentNode?.removeChild(L)}),r=[],S){let L;c?L=c({...m}):typeof d=="function"?L=d():L=d,L&&(Array.isArray(L)?L:[L]).forEach(W=>{if(W instanceof Node)F.insertBefore(W,s),r.push(W);else if(W!=null){const J=document.createTextNode(String(W));F.insertBefore(J,s),r.push(J)}})}}),e}function Je(t){const e=document.createElement("a");e.href=t.to,e.className=t.class!==void 0?t.class:"";const n=Re(we),s=r=>{r.preventDefault(),t.onclick&&t.onclick(r),n?n.navigate(t.to,{replace:t.replace!==void 0?t.replace:!1}):(window.history.pushState({},"",t.to),window.dispatchEvent(new PopStateEvent("popstate")))};return e.addEventListener("click",s),ge(()=>{if(!n)return;const r=n.currentPath,i=r(),a=t.exact!==void 0&&t.exact?i===t.to:i.startsWith(t.to),c=t.activeClass!==void 0?t.activeClass:"active";a?e.classList.add(c):e.classList.remove(c)}),typeof t.children=="string"?e.textContent=t.children:Array.isArray(t.children)?t.children.forEach(r=>{e.appendChild(r)}):t.children&&e.appendChild(t.children),e}function fn(){const t=Re(we);return t?t.currentPath:pe(window.location.pathname)}function Dr(){const t=Re(we);return(e,n)=>{t?t.navigate(e,n):n?.replace?window.history.replaceState({},"",e):window.history.pushState({},"",e)}}function Hr(t){return Le(()=>(Re(we)?.currentPath(),new URLSearchParams(window.location.search).get(t)))}function zr(t){const e=document.createDocumentFragment(),n=document.createComment("For start"),s=document.createComment("For end");e.appendChild(n),e.appendChild(s);const r=Array.isArray(t.children)?t.children[0]:t.children;if(typeof r!="function")throw new Error("For component children must be a function.");const i=new Map;return ge(()=>{let c=[];fe(t.each)||typeof t.each=="function"?c=t.each():c=t.each,Array.isArray(c)||(c=[]);const d=n.parentNode||e,l=[],m=new Map;i.forEach((b,C)=>{m.set(C,[...b])}),c.forEach((b,C)=>{const E=m.get(b);if(E&&E.length>0){const S=E.shift();S.indexSignal(C),l.push(S)}else{const S=pe(C),D=r(b,S);let F=[];D instanceof DocumentFragment?F=Array.from(D.childNodes):D instanceof Node&&(F=[D]),l.push({nodes:F,indexSignal:S})}}),m.forEach(b=>{b.forEach(C=>{C.nodes.forEach(E=>E.parentElement?.removeChild(E))})});let k=s;for(let b=l.length-1;b>=0;b--){const C=l[b];if(!C)continue;const E=C.nodes;for(let S=E.length-1;S>=0;S--){const D=E[S];D.nextSibling!==k&&d.insertBefore(D,k),k=D}}i.clear(),l.forEach((b,C)=>{const E=c[C],S=i.get(E)||[];S.push(b),i.set(E,S)})}),e}function tn(t){const e=document.createDocumentFragment(),n=document.createComment("Show start"),s=document.createComment("Show end");e.appendChild(n),e.appendChild(s);let r=[];return ge(()=>{const i=typeof t.when=="function"||fe(t.when)?t.when():t.when,a=n.parentNode||e;r.forEach(d=>d.parentElement?.removeChild(d)),r=[];const c=i?t.children:t.fallback;if(c){const d=typeof c=="function"?c():c,l=d instanceof DocumentFragment?Array.from(d.childNodes):[d];l.forEach(m=>a.insertBefore(m,s)),r=l}}),e}function Fr(t){const e=t.tagName,n={},s=[],r=t.childNodes,i=t.attributes;for(const a of i){const c=a.name,d=a.value;n[c]=d}for(const a of r)s.push(gn(a));return{tag:e,attrs:n,children:s}}function gn(t){return t instanceof Text?t.textContent??"":Fr(t)}function mn(t){if(typeof t=="string")return document.createTextNode(t);const e=document.createElement(t.tag);for(const s of t.children)e.appendChild(mn(s));const n=Object.keys(t.attrs);for(const s of n)e.setAttribute(s,t.attrs[s]);return e}const Ur=`# The basics

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
`,Xr=`# Routing & SPA

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
`,Gr=`# Components

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
`,jr=`# Get started with HyperFX

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
`,qr=`# State Management

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
`,Zr=`# Rendering

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
`,Wr=`# Server-Side Rendering (SSR)

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
`,Kr="/hyperfx?doc=",bn=[{title:"Get Started",route_name:"get_started",data:jr},{title:"HyperFX basics",route_name:"basics",data:Ur},{title:"State Management",route_name:"state-management",data:qr},{title:"Rendering & Control Flow",route_name:"render",data:Zr},{title:"HyperFX components",route_name:"components",data:Gr},{title:"Single Page Application",route_name:"spa",data:Xr},{title:"Server-Side Rendering",route_name:"ssr",data:Wr}];function Jr(){return B("nav",{class:"flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg",children:[A(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx",children:"Home"}),A(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx?doc=get_started",children:"Docs"}),A(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx/editor",children:"Example"})]})}const kt=pe(!1);function Qr(){console.log(kt(!kt()))}function Yr(){const t=Le(()=>`flex-col sm:flex gap-1 ${kt()?"flex":"hidden"}`);return B("aside",{class:"bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl",children:[A("div",{class:"flex items-center justify-between mb-6 sm:hidden",children:B("button",{class:"text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform",title:"Toggle Navigation",onclick:Qr,children:[A("span",{class:"text-lg",children:"☰"}),A("span",{class:"sr-only",children:"Toggle Navigation"})]})}),B("nav",{class:t,children:[A("p",{class:"hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3",children:"Fundamentals"}),A(zr,{each:bn,children:e=>A(Je,{class:"px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block",to:`${Kr}${e.route_name}`,children:e.title})})]})]})}function Tt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ee=Tt();function xn(t){Ee=t}var Ie={exec:()=>null};function M(t,e=""){let n=typeof t=="string"?t:t.source;const s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(K.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,e)};return s}var K={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},Vr=/^(?:[ \t]*(?:\n|$))+/,es=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ts=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Pe=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ns=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,At=/(?:[*+-]|\d{1,9}[.)])/,yn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,wn=M(yn).replace(/bull/g,At).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),rs=M(yn).replace(/bull/g,At).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Rt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ss=/^[^\n]+/,Ct=/(?!\s*\])(?:\\.|[^\[\]\\])+/,is=M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Ct).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),os=M(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,At).getRegex(),nt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Nt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,as=M("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Nt).replace("tag",nt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),kn=M(Rt).replace("hr",Pe).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",nt).getRegex(),cs=M(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",kn).getRegex(),Mt={blockquote:cs,code:es,def:is,fences:ts,heading:ns,hr:Pe,html:as,lheading:wn,list:os,newline:Vr,paragraph:kn,table:Ie,text:ss},nn=M("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Pe).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",nt).getRegex(),ls={...Mt,lheading:rs,table:nn,paragraph:M(Rt).replace("hr",Pe).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",nn).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",nt).getRegex()},us={...Mt,html:M(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Nt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ie,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:M(Rt).replace("hr",Pe).replace("heading",` *#{1,6} *[^
]`).replace("lheading",wn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ds=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,hs=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,En=/^( {2,}|\\)\n(?!\s*$)/,ps=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,rt=/[\p{P}\p{S}]/u,Ot=/[\s\p{P}\p{S}]/u,Sn=/[^\s\p{P}\p{S}]/u,fs=M(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ot).getRegex(),vn=/(?!~)[\p{P}\p{S}]/u,gs=/(?!~)[\s\p{P}\p{S}]/u,ms=/(?:[^\s\p{P}\p{S}]|~)/u,bs=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,_n=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,xs=M(_n,"u").replace(/punct/g,rt).getRegex(),ys=M(_n,"u").replace(/punct/g,vn).getRegex(),Tn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ws=M(Tn,"gu").replace(/notPunctSpace/g,Sn).replace(/punctSpace/g,Ot).replace(/punct/g,rt).getRegex(),ks=M(Tn,"gu").replace(/notPunctSpace/g,ms).replace(/punctSpace/g,gs).replace(/punct/g,vn).getRegex(),Es=M("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Sn).replace(/punctSpace/g,Ot).replace(/punct/g,rt).getRegex(),Ss=M(/\\(punct)/,"gu").replace(/punct/g,rt).getRegex(),vs=M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),_s=M(Nt).replace("(?:-->|$)","-->").getRegex(),Ts=M("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",_s).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ye=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,As=M(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ye).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),An=M(/^!?\[(label)\]\[(ref)\]/).replace("label",Ye).replace("ref",Ct).getRegex(),Rn=M(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ct).getRegex(),Rs=M("reflink|nolink(?!\\()","g").replace("reflink",An).replace("nolink",Rn).getRegex(),It={_backpedal:Ie,anyPunctuation:Ss,autolink:vs,blockSkip:bs,br:En,code:hs,del:Ie,emStrongLDelim:xs,emStrongRDelimAst:ws,emStrongRDelimUnd:Es,escape:ds,link:As,nolink:Rn,punctuation:fs,reflink:An,reflinkSearch:Rs,tag:Ts,text:ps,url:Ie},Cs={...It,link:M(/^!?\[(label)\]\((.*?)\)/).replace("label",Ye).getRegex(),reflink:M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ye).getRegex()},Et={...It,emStrongRDelimAst:ks,emStrongLDelim:ys,url:M(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Ns={...Et,br:M(En).replace("{2,}","*").getRegex(),text:M(Et.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ke={normal:Mt,gfm:ls,pedantic:us},Me={normal:It,gfm:Et,breaks:Ns,pedantic:Cs},Ms={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},rn=t=>Ms[t];function se(t,e){if(e){if(K.escapeTest.test(t))return t.replace(K.escapeReplace,rn)}else if(K.escapeTestNoEncode.test(t))return t.replace(K.escapeReplaceNoEncode,rn);return t}function sn(t){try{t=encodeURI(t).replace(K.percentDecode,"%")}catch{return null}return t}function on(t,e){const n=t.replace(K.findPipe,(i,a,c)=>{let d=!1,l=a;for(;--l>=0&&c[l]==="\\";)d=!d;return d?"|":" |"}),s=n.split(K.splitPipe);let r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(K.slashPipe,"|");return s}function Oe(t,e,n){const s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function Os(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function an(t,e,n,s,r){const i=e.href,a=e.title||null,c=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;const d={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,d}function Is(t,e,n){const s=t.match(n.other.indentCodeCompensation);if(s===null)return e;const r=s[1];return e.split(`
`).map(i=>{const a=i.match(n.other.beginningSpace);if(a===null)return i;const[c]=a;return c.length>=r.length?i.slice(r.length):i}).join(`
`)}var Ve=class{options;rules;lexer;constructor(t){this.options=t||Ee}space(t){const e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){const e=this.rules.block.code.exec(t);if(e){const n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Oe(n,`
`)}}}fences(t){const e=this.rules.block.fences.exec(t);if(e){const n=e[0],s=Is(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){const e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){const s=Oe(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){const e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Oe(e[0],`
`)}}blockquote(t){const e=this.rules.block.blockquote.exec(t);if(e){let n=Oe(e[0],`
`).split(`
`),s="",r="";const i=[];for(;n.length>0;){let a=!1;const c=[];let d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))c.push(n[d]),a=!0;else if(!a)c.push(n[d]);else break;n=n.slice(d);const l=c.join(`
`),m=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${l}`:l,r=r?`${r}
${m}`:m;const k=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(m,i,!0),this.lexer.state.top=k,n.length===0)break;const b=i.at(-1);if(b?.type==="code")break;if(b?.type==="blockquote"){const C=b,E=C.raw+`
`+n.join(`
`),S=this.blockquote(E);i[i.length-1]=S,s=s.substring(0,s.length-C.raw.length)+S.raw,r=r.substring(0,r.length-C.text.length)+S.text;break}else if(b?.type==="list"){const C=b,E=C.raw+`
`+n.join(`
`),S=this.list(E);i[i.length-1]=S,s=s.substring(0,s.length-b.raw.length)+S.raw,r=r.substring(0,r.length-C.raw.length)+S.raw,n=E.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim();const s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");const i=this.rules.other.listItemRegex(n);let a=!1;for(;t;){let d=!1,l="",m="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;l=e[0],t=t.substring(l.length);let k=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,F=>" ".repeat(3*F.length)),b=t.split(`
`,1)[0],C=!k.trim(),E=0;if(this.options.pedantic?(E=2,m=k.trimStart()):C?E=e[1].length+1:(E=e[2].search(this.rules.other.nonSpaceChar),E=E>4?1:E,m=k.slice(E),E+=e[1].length),C&&this.rules.other.blankLine.test(b)&&(l+=b+`
`,t=t.substring(b.length+1),d=!0),!d){const F=this.rules.other.nextBulletRegex(E),L=this.rules.other.hrRegex(E),Y=this.rules.other.fencesBeginRegex(E),W=this.rules.other.headingBeginRegex(E),J=this.rules.other.htmlBeginRegex(E);for(;t;){const V=t.split(`
`,1)[0];let te;if(b=V,this.options.pedantic?(b=b.replace(this.rules.other.listReplaceNesting,"  "),te=b):te=b.replace(this.rules.other.tabCharGlobal,"    "),Y.test(b)||W.test(b)||J.test(b)||F.test(b)||L.test(b))break;if(te.search(this.rules.other.nonSpaceChar)>=E||!b.trim())m+=`
`+te.slice(E);else{if(C||k.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Y.test(k)||W.test(k)||L.test(k))break;m+=`
`+b}!C&&!b.trim()&&(C=!0),l+=V+`
`,t=t.substring(V.length+1),k=te.slice(E)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(a=!0));let S=null,D;this.options.gfm&&(S=this.rules.other.listIsTask.exec(m),S&&(D=S[0]!=="[ ] ",m=m.replace(this.rules.other.listReplaceTask,""))),r.items.push({type:"list_item",raw:l,task:!!S,checked:D,loose:!1,text:m,tokens:[]}),r.raw+=l}const c=r.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let d=0;d<r.items.length;d++)if(this.lexer.state.top=!1,r.items[d].tokens=this.lexer.blockTokens(r.items[d].text,[]),!r.loose){const l=r.items[d].tokens.filter(k=>k.type==="space"),m=l.length>0&&l.some(k=>this.rules.other.anyLine.test(k.raw));r.loose=m}if(r.loose)for(let d=0;d<r.items.length;d++)r.items[d].loose=!0;return r}}html(t){const e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){const e=this.rules.block.def.exec(t);if(e){const n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){const e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const n=on(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(const a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(const a of r)i.rows.push(on(a,i.header.length).map((c,d)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:i.align[d]})));return i}}lheading(t){const e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){const e=this.rules.block.paragraph.exec(t);if(e){const n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){const e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){const e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){const e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){const e=this.rules.inline.link.exec(t);if(e){const n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const i=Oe(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{const i=Os(e[2],"()");if(i===-2)return;if(i>-1){const c=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,c).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){const i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),an(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){const s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){const i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return an(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(s[1]||s[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const i=[...s[0]].length-1;let a,c,d=i,l=0;const m=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(m.lastIndex=0,e=e.slice(-1*t.length+i);(s=m.exec(e))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(c=[...a].length,s[3]||s[4]){d+=c;continue}else if((s[5]||s[6])&&i%3&&!((i+c)%3)){l+=c;continue}if(d-=c,d>0)continue;c=Math.min(c,c+d+l);const k=[...s[0]][0].length,b=t.slice(0,i+s.index+k+c);if(Math.min(i,c)%2){const E=b.slice(1,-1);return{type:"em",raw:b,text:E,tokens:this.lexer.inlineTokens(E)}}const C=b.slice(2,-2);return{type:"strong",raw:b,text:C,tokens:this.lexer.inlineTokens(C)}}}}codespan(t){const e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," ");const s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){const e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){const e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){const e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){const e=this.rules.inline.text.exec(t);if(e){const n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},ce=class St{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ee,this.options.tokenizer=this.options.tokenizer||new Ve,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={other:K,block:Ke.normal,inline:Me.normal};this.options.pedantic?(n.block=Ke.pedantic,n.inline=Me.pedantic):this.options.gfm&&(n.block=Ke.gfm,this.options.breaks?n.inline=Me.breaks:n.inline=Me.gfm),this.tokenizer.rules=n}static get rules(){return{block:Ke,inline:Me}}static lex(e,n){return new St(n).lex(e)}static lexInline(e,n){return new St(n).inlineTokens(e)}lex(e){e=e.replace(K.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){const s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(K.tabCharGlobal,"    ").replace(K.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);const a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);const a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);const a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title});continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0;const c=e.slice(1);let d;this.options.extensions.startBlock.forEach(l=>{d=l.call({lexer:this},c),typeof d=="number"&&d>=0&&(a=Math.min(a,d))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){const a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=`
`+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);const a=n.at(-1);a?.type==="text"?(a.raw+=`
`+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){const a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){const c=Object.keys(this.tokens.links);if(c.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)c.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let i=!1,a="";for(;e;){i||(a=""),i=!1;let c;if(this.options.extensions?.inline?.some(l=>(c=l.call({lexer:this},e,n))?(e=e.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(c.raw.length);const l=n.at(-1);c.type==="text"&&l?.type==="text"?(l.raw+=c.raw,l.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(e,s,a)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(e)){e=e.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(e))){e=e.substring(c.raw.length),n.push(c);continue}let d=e;if(this.options.extensions?.startInline){let l=1/0;const m=e.slice(1);let k;this.options.extensions.startInline.forEach(b=>{k=b.call({lexer:this},m),typeof k=="number"&&k>=0&&(l=Math.min(l,k))}),l<1/0&&l>=0&&(d=e.substring(0,l+1))}if(c=this.tokenizer.inlineText(d)){e=e.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(a=c.raw.slice(-1)),i=!0;const l=n.at(-1);l?.type==="text"?(l.raw+=c.raw,l.text+=c.text):n.push(c);continue}if(e){const l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return n}},et=class{options;parser;constructor(t){this.options=t||Ee}space(t){return""}code({text:t,lang:e,escaped:n}){const s=(e||"").match(K.notSpaceStart)?.[0],r=t.replace(K.endingNewline,"")+`
`;return s?'<pre><code class="language-'+se(s)+'">'+(n?r:se(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:se(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){const e=t.ordered,n=t.start;let s="";for(let a=0;a<t.items.length;a++){const c=t.items[a];s+=this.listitem(c)}const r=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
`+s+"</"+r+`>
`}listitem(t){let e="";if(t.task){const n=this.checkbox({checked:!!t.checked});t.loose?t.tokens[0]?.type==="paragraph"?(t.tokens[0].text=n+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=n+" "+se(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:!0}):e+=n+" "}return e+=this.parser.parse(t.tokens,!!t.loose),`<li>${e}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let r=0;r<t.header.length;r++)n+=this.tablecell(t.header[r]);e+=this.tablerow({text:n});let s="";for(let r=0;r<t.rows.length;r++){const i=t.rows[r];n="";for(let a=0;a<i.length;a++)n+=this.tablecell(i[a]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${se(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){const s=this.parser.parseInline(n),r=sn(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+se(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));const r=sn(t);if(r===null)return se(n);t=r;let i=`<img src="${t}" alt="${n}"`;return e&&(i+=` title="${se(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:se(t.text)}},Lt=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},le=class vt{options;renderer;textRenderer;constructor(e){this.options=e||Ee,this.options.renderer=this.options.renderer||new et,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Lt}static parse(e,n){return new vt(n).parse(e)}static parseInline(e,n){return new vt(n).parseInline(e)}parse(e,n=!0){let s="";for(let r=0;r<e.length;r++){const i=e[r];if(this.options.extensions?.renderers?.[i.type]){const c=i,d=this.options.extensions.renderers[c.type].call({parser:this},c);if(d!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(c.type)){s+=d||"";continue}}const a=i;switch(a.type){case"space":{s+=this.renderer.space(a);continue}case"hr":{s+=this.renderer.hr(a);continue}case"heading":{s+=this.renderer.heading(a);continue}case"code":{s+=this.renderer.code(a);continue}case"table":{s+=this.renderer.table(a);continue}case"blockquote":{s+=this.renderer.blockquote(a);continue}case"list":{s+=this.renderer.list(a);continue}case"html":{s+=this.renderer.html(a);continue}case"paragraph":{s+=this.renderer.paragraph(a);continue}case"text":{let c=a,d=this.renderer.text(c);for(;r+1<e.length&&e[r+1].type==="text";)c=e[++r],d+=`
`+this.renderer.text(c);n?s+=this.renderer.paragraph({type:"paragraph",raw:d,text:d,tokens:[{type:"text",raw:d,text:d,escaped:!0}]}):s+=d;continue}default:{const c='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){const i=e[r];if(this.options.extensions?.renderers?.[i.type]){const c=this.options.extensions.renderers[i.type].call({parser:this},i);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=c||"";continue}}const a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{const c='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},Qe=class{options;block;constructor(t){this.options=t||Ee}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?ce.lex:ce.lexInline}provideParser(){return this.block?le.parse:le.parseInline}},Ls=class{defaults=Tt();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=le;Renderer=et;TextRenderer=Lt;Lexer=ce;Tokenizer=Ve;Hooks=Qe;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(const s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{const r=s;for(const i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(const i of r.rows)for(const a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{const r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{const r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{const a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{const s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){const i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let c=r.renderer.apply(this,a);return c===!1&&(c=i.apply(this,a)),c}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){const r=this.defaults.renderer||new et(this.defaults);for(const i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;const a=i,c=n.renderer[a],d=r[a];r[a]=(...l)=>{let m=c.apply(r,l);return m===!1&&(m=d.apply(r,l)),m||""}}s.renderer=r}if(n.tokenizer){const r=this.defaults.tokenizer||new Ve(this.defaults);for(const i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;const a=i,c=n.tokenizer[a],d=r[a];r[a]=(...l)=>{let m=c.apply(r,l);return m===!1&&(m=d.apply(r,l)),m}}s.tokenizer=r}if(n.hooks){const r=this.defaults.hooks||new Qe;for(const i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;const a=i,c=n.hooks[a],d=r[a];Qe.passThroughHooks.has(i)?r[a]=l=>{if(this.defaults.async)return Promise.resolve(c.call(r,l)).then(k=>d.call(r,k));const m=c.call(r,l);return d.call(r,m)}:r[a]=(...l)=>{let m=c.apply(r,l);return m===!1&&(m=d.apply(r,l)),m}}s.hooks=r}if(n.walkTokens){const r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let c=[];return c.push(i.call(this,a)),r&&(c=c.concat(r.call(this,a))),c}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return ce.lex(t,e??this.defaults)}parser(t,e){return le.parse(t,e??this.defaults)}parseMarkdown(t){return(n,s)=>{const r={...s},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));i.hooks&&(i.hooks.options=i,i.hooks.block=t);const c=i.hooks?i.hooks.provideLexer():t?ce.lex:ce.lexInline,d=i.hooks?i.hooks.provideParser():t?le.parse:le.parseInline;if(i.async)return Promise.resolve(i.hooks?i.hooks.preprocess(n):n).then(l=>c(l,i)).then(l=>i.hooks?i.hooks.processAllTokens(l):l).then(l=>i.walkTokens?Promise.all(this.walkTokens(l,i.walkTokens)).then(()=>l):l).then(l=>d(l,i)).then(l=>i.hooks?i.hooks.postprocess(l):l).catch(a);try{i.hooks&&(n=i.hooks.preprocess(n));let l=c(n,i);i.hooks&&(l=i.hooks.processAllTokens(l)),i.walkTokens&&this.walkTokens(l,i.walkTokens);let m=d(l,i);return i.hooks&&(m=i.hooks.postprocess(m)),m}catch(l){return a(l)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const s="<p>An error occurred:</p><pre>"+se(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},ke=new Ls;function I(t,e){return ke.parse(t,e)}I.options=I.setOptions=function(t){return ke.setOptions(t),I.defaults=ke.defaults,xn(I.defaults),I};I.getDefaults=Tt;I.defaults=Ee;I.use=function(...t){return ke.use(...t),I.defaults=ke.defaults,xn(I.defaults),I};I.walkTokens=function(t,e){return ke.walkTokens(t,e)};I.parseInline=ke.parseInline;I.Parser=le;I.parser=le.parse;I.Renderer=et;I.TextRenderer=Lt;I.Lexer=ce;I.lexer=ce.lex;I.Tokenizer=Ve;I.Hooks=Qe;I.parse=I;I.options;I.setOptions;I.use;I.walkTokens;I.parseInline;var Cn=I;le.parse;ce.lex;const Ps=`# HyperFX

HyperFX (hypermedia functions) is a simple library for DOM manipulation by using functions.
Right now it's JSX based. And it is not production ready.   

## Use case

Absolutely none, it is just a fun project.
`;function $s(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var mt,cn;function Bs(){if(cn)return mt;cn=1;function t(o){return o instanceof Map?o.clear=o.delete=o.set=function(){throw new Error("map is read-only")}:o instanceof Set&&(o.add=o.clear=o.delete=function(){throw new Error("set is read-only")}),Object.freeze(o),Object.getOwnPropertyNames(o).forEach(u=>{const p=o[u],_=typeof p;(_==="object"||_==="function")&&!Object.isFrozen(p)&&t(p)}),o}class e{constructor(u){u.data===void 0&&(u.data={}),this.data=u.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(o,...u){const p=Object.create(null);for(const _ in o)p[_]=o[_];return u.forEach(function(_){for(const H in _)p[H]=_[H]}),p}const r="</span>",i=o=>!!o.scope,a=(o,{prefix:u})=>{if(o.startsWith("language:"))return o.replace("language:","language-");if(o.includes(".")){const p=o.split(".");return[`${u}${p.shift()}`,...p.map((_,H)=>`${_}${"_".repeat(H+1)}`)].join(" ")}return`${u}${o}`};class c{constructor(u,p){this.buffer="",this.classPrefix=p.classPrefix,u.walk(this)}addText(u){this.buffer+=n(u)}openNode(u){if(!i(u))return;const p=a(u.scope,{prefix:this.classPrefix});this.span(p)}closeNode(u){i(u)&&(this.buffer+=r)}value(){return this.buffer}span(u){this.buffer+=`<span class="${u}">`}}const d=(o={})=>{const u={children:[]};return Object.assign(u,o),u};class l{constructor(){this.rootNode=d(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(u){this.top.children.push(u)}openNode(u){const p=d({scope:u});this.add(p),this.stack.push(p)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(u){return this.constructor._walk(u,this.rootNode)}static _walk(u,p){return typeof p=="string"?u.addText(p):p.children&&(u.openNode(p),p.children.forEach(_=>this._walk(u,_)),u.closeNode(p)),u}static _collapse(u){typeof u!="string"&&u.children&&(u.children.every(p=>typeof p=="string")?u.children=[u.children.join("")]:u.children.forEach(p=>{l._collapse(p)}))}}class m extends l{constructor(u){super(),this.options=u}addText(u){u!==""&&this.add(u)}startScope(u){this.openNode(u)}endScope(){this.closeNode()}__addSublanguage(u,p){const _=u.root;p&&(_.scope=`language:${p}`),this.add(_)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function k(o){return o?typeof o=="string"?o:o.source:null}function b(o){return S("(?=",o,")")}function C(o){return S("(?:",o,")*")}function E(o){return S("(?:",o,")?")}function S(...o){return o.map(p=>k(p)).join("")}function D(o){const u=o[o.length-1];return typeof u=="object"&&u.constructor===Object?(o.splice(o.length-1,1),u):{}}function F(...o){return"("+(D(o).capture?"":"?:")+o.map(_=>k(_)).join("|")+")"}function L(o){return new RegExp(o.toString()+"|").exec("").length-1}function Y(o,u){const p=o&&o.exec(u);return p&&p.index===0}const W=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function J(o,{joinWith:u}){let p=0;return o.map(_=>{p+=1;const H=p;let z=k(_),x="";for(;z.length>0;){const g=W.exec(z);if(!g){x+=z;break}x+=z.substring(0,g.index),z=z.substring(g.index+g[0].length),g[0][0]==="\\"&&g[1]?x+="\\"+String(Number(g[1])+H):(x+=g[0],g[0]==="("&&p++)}return x}).map(_=>`(${_})`).join(u)}const V=/\b\B/,te="[a-zA-Z]\\w*",Se="[a-zA-Z_]\\w*",Be="\\b\\d+(\\.\\d+)?",De="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",He="\\b(0b[01]+)",st="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",it=(o={})=>{const u=/^#![ ]*\//;return o.binary&&(o.begin=S(u,/.*\b/,o.binary,/\b.*/)),s({scope:"meta",begin:u,end:/$/,relevance:0,"on:begin":(p,_)=>{p.index!==0&&_.ignoreMatch()}},o)},me={begin:"\\\\[\\s\\S]",relevance:0},ot={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[me]},ze={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[me]},at={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},j=function(o,u,p={}){const _=s({scope:"comment",begin:o,end:u,contains:[]},p);_.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const H=F("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return _.contains.push({begin:S(/[ ]+/,"(",H,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),_},ue=j("//","$"),be=j("/\\*","\\*/"),ve=j("#","$"),Ce={scope:"number",begin:Be,relevance:0},Fe={scope:"number",begin:De,relevance:0},Dn={scope:"number",begin:He,relevance:0},Hn={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[me,{begin:/\[/,end:/\]/,relevance:0,contains:[me]}]},zn={scope:"title",begin:te,relevance:0},Fn={scope:"title",begin:Se,relevance:0},Un={begin:"\\.\\s*"+Se,relevance:0};var Ue=Object.freeze({__proto__:null,APOS_STRING_MODE:ot,BACKSLASH_ESCAPE:me,BINARY_NUMBER_MODE:Dn,BINARY_NUMBER_RE:He,COMMENT:j,C_BLOCK_COMMENT_MODE:be,C_LINE_COMMENT_MODE:ue,C_NUMBER_MODE:Fe,C_NUMBER_RE:De,END_SAME_AS_BEGIN:function(o){return Object.assign(o,{"on:begin":(u,p)=>{p.data._beginMatch=u[1]},"on:end":(u,p)=>{p.data._beginMatch!==u[1]&&p.ignoreMatch()}})},HASH_COMMENT_MODE:ve,IDENT_RE:te,MATCH_NOTHING_RE:V,METHOD_GUARD:Un,NUMBER_MODE:Ce,NUMBER_RE:Be,PHRASAL_WORDS_MODE:at,QUOTE_STRING_MODE:ze,REGEXP_MODE:Hn,RE_STARTERS_RE:st,SHEBANG:it,TITLE_MODE:zn,UNDERSCORE_IDENT_RE:Se,UNDERSCORE_TITLE_MODE:Fn});function Xn(o,u){o.input[o.index-1]==="."&&u.ignoreMatch()}function Gn(o,u){o.className!==void 0&&(o.scope=o.className,delete o.className)}function jn(o,u){u&&o.beginKeywords&&(o.begin="\\b("+o.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",o.__beforeBegin=Xn,o.keywords=o.keywords||o.beginKeywords,delete o.beginKeywords,o.relevance===void 0&&(o.relevance=0))}function qn(o,u){Array.isArray(o.illegal)&&(o.illegal=F(...o.illegal))}function Zn(o,u){if(o.match){if(o.begin||o.end)throw new Error("begin & end are not supported with match");o.begin=o.match,delete o.match}}function Wn(o,u){o.relevance===void 0&&(o.relevance=1)}const Kn=(o,u)=>{if(!o.beforeMatch)return;if(o.starts)throw new Error("beforeMatch cannot be used with starts");const p=Object.assign({},o);Object.keys(o).forEach(_=>{delete o[_]}),o.keywords=p.keywords,o.begin=S(p.beforeMatch,b(p.begin)),o.starts={relevance:0,contains:[Object.assign(p,{endsParent:!0})]},o.relevance=0,delete p.beforeMatch},Jn=["of","and","for","in","not","or","if","then","parent","list","value"],Qn="keyword";function Pt(o,u,p=Qn){const _=Object.create(null);return typeof o=="string"?H(p,o.split(" ")):Array.isArray(o)?H(p,o):Object.keys(o).forEach(function(z){Object.assign(_,Pt(o[z],u,z))}),_;function H(z,x){u&&(x=x.map(g=>g.toLowerCase())),x.forEach(function(g){const v=g.split("|");_[v[0]]=[z,Yn(v[0],v[1])]})}}function Yn(o,u){return u?Number(u):Vn(o)?0:1}function Vn(o){return Jn.includes(o.toLowerCase())}const $t={},xe=o=>{console.error(o)},Bt=(o,...u)=>{console.log(`WARN: ${o}`,...u)},_e=(o,u)=>{$t[`${o}/${u}`]||(console.log(`Deprecated as of ${o}. ${u}`),$t[`${o}/${u}`]=!0)},Xe=new Error;function Dt(o,u,{key:p}){let _=0;const H=o[p],z={},x={};for(let g=1;g<=u.length;g++)x[g+_]=H[g],z[g+_]=!0,_+=L(u[g-1]);o[p]=x,o[p]._emit=z,o[p]._multi=!0}function er(o){if(Array.isArray(o.begin)){if(o.skip||o.excludeBegin||o.returnBegin)throw xe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Xe;if(typeof o.beginScope!="object"||o.beginScope===null)throw xe("beginScope must be object"),Xe;Dt(o,o.begin,{key:"beginScope"}),o.begin=J(o.begin,{joinWith:""})}}function tr(o){if(Array.isArray(o.end)){if(o.skip||o.excludeEnd||o.returnEnd)throw xe("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Xe;if(typeof o.endScope!="object"||o.endScope===null)throw xe("endScope must be object"),Xe;Dt(o,o.end,{key:"endScope"}),o.end=J(o.end,{joinWith:""})}}function nr(o){o.scope&&typeof o.scope=="object"&&o.scope!==null&&(o.beginScope=o.scope,delete o.scope)}function rr(o){nr(o),typeof o.beginScope=="string"&&(o.beginScope={_wrap:o.beginScope}),typeof o.endScope=="string"&&(o.endScope={_wrap:o.endScope}),er(o),tr(o)}function sr(o){function u(x,g){return new RegExp(k(x),"m"+(o.case_insensitive?"i":"")+(o.unicodeRegex?"u":"")+(g?"g":""))}class p{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(g,v){v.position=this.position++,this.matchIndexes[this.matchAt]=v,this.regexes.push([v,g]),this.matchAt+=L(g)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const g=this.regexes.map(v=>v[1]);this.matcherRe=u(J(g,{joinWith:"|"}),!0),this.lastIndex=0}exec(g){this.matcherRe.lastIndex=this.lastIndex;const v=this.matcherRe.exec(g);if(!v)return null;const G=v.findIndex((Ne,lt)=>lt>0&&Ne!==void 0),U=this.matchIndexes[G];return v.splice(0,G),Object.assign(v,U)}}class _{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(g){if(this.multiRegexes[g])return this.multiRegexes[g];const v=new p;return this.rules.slice(g).forEach(([G,U])=>v.addRule(G,U)),v.compile(),this.multiRegexes[g]=v,v}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(g,v){this.rules.push([g,v]),v.type==="begin"&&this.count++}exec(g){const v=this.getMatcher(this.regexIndex);v.lastIndex=this.lastIndex;let G=v.exec(g);if(this.resumingScanAtSamePosition()&&!(G&&G.index===this.lastIndex)){const U=this.getMatcher(0);U.lastIndex=this.lastIndex+1,G=U.exec(g)}return G&&(this.regexIndex+=G.position+1,this.regexIndex===this.count&&this.considerAll()),G}}function H(x){const g=new _;return x.contains.forEach(v=>g.addRule(v.begin,{rule:v,type:"begin"})),x.terminatorEnd&&g.addRule(x.terminatorEnd,{type:"end"}),x.illegal&&g.addRule(x.illegal,{type:"illegal"}),g}function z(x,g){const v=x;if(x.isCompiled)return v;[Gn,Zn,rr,Kn].forEach(U=>U(x,g)),o.compilerExtensions.forEach(U=>U(x,g)),x.__beforeBegin=null,[jn,qn,Wn].forEach(U=>U(x,g)),x.isCompiled=!0;let G=null;return typeof x.keywords=="object"&&x.keywords.$pattern&&(x.keywords=Object.assign({},x.keywords),G=x.keywords.$pattern,delete x.keywords.$pattern),G=G||/\w+/,x.keywords&&(x.keywords=Pt(x.keywords,o.case_insensitive)),v.keywordPatternRe=u(G,!0),g&&(x.begin||(x.begin=/\B|\b/),v.beginRe=u(v.begin),!x.end&&!x.endsWithParent&&(x.end=/\B|\b/),x.end&&(v.endRe=u(v.end)),v.terminatorEnd=k(v.end)||"",x.endsWithParent&&g.terminatorEnd&&(v.terminatorEnd+=(x.end?"|":"")+g.terminatorEnd)),x.illegal&&(v.illegalRe=u(x.illegal)),x.contains||(x.contains=[]),x.contains=[].concat(...x.contains.map(function(U){return ir(U==="self"?x:U)})),x.contains.forEach(function(U){z(U,v)}),x.starts&&z(x.starts,g),v.matcher=H(v),v}if(o.compilerExtensions||(o.compilerExtensions=[]),o.contains&&o.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return o.classNameAliases=s(o.classNameAliases||{}),z(o)}function Ht(o){return o?o.endsWithParent||Ht(o.starts):!1}function ir(o){return o.variants&&!o.cachedVariants&&(o.cachedVariants=o.variants.map(function(u){return s(o,{variants:null},u)})),o.cachedVariants?o.cachedVariants:Ht(o)?s(o,{starts:o.starts?s(o.starts):null}):Object.isFrozen(o)?s(o):o}var or="11.11.1";class ar extends Error{constructor(u,p){super(u),this.name="HTMLInjectionError",this.html=p}}const ct=n,zt=s,Ft=Symbol("nomatch"),cr=7,Ut=function(o){const u=Object.create(null),p=Object.create(null),_=[];let H=!0;const z="Could not find the language '{}', did you forget to load/include a language module?",x={disableAutodetect:!0,name:"Plain text",contains:[]};let g={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:m};function v(h){return g.noHighlightRe.test(h)}function G(h){let w=h.className+" ";w+=h.parentNode?h.parentNode.className:"";const N=g.languageDetectRe.exec(w);if(N){const P=de(N[1]);return P||(Bt(z.replace("{}",N[1])),Bt("Falling back to no-highlight mode for this block.",h)),P?N[1]:"no-highlight"}return w.split(/\s+/).find(P=>v(P)||de(P))}function U(h,w,N){let P="",X="";typeof w=="object"?(P=h,N=w.ignoreIllegals,X=w.language):(_e("10.7.0","highlight(lang, code, ...args) has been deprecated."),_e("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),X=h,P=w),N===void 0&&(N=!0);const ee={code:P,language:X};je("before:highlight",ee);const he=ee.result?ee.result:Ne(ee.language,ee.code,N);return he.code=ee.code,je("after:highlight",he),he}function Ne(h,w,N,P){const X=Object.create(null);function ee(f,y){return f.keywords[y]}function he(){if(!T.keywords){q.addText($);return}let f=0;T.keywordPatternRe.lastIndex=0;let y=T.keywordPatternRe.exec($),R="";for(;y;){R+=$.substring(f,y.index);const O=re.case_insensitive?y[0].toLowerCase():y[0],Z=ee(T,O);if(Z){const[oe,_r]=Z;if(q.addText(R),R="",X[O]=(X[O]||0)+1,X[O]<=cr&&(We+=_r),oe.startsWith("_"))R+=y[0];else{const Tr=re.classNameAliases[oe]||oe;ne(y[0],Tr)}}else R+=y[0];f=T.keywordPatternRe.lastIndex,y=T.keywordPatternRe.exec($)}R+=$.substring(f),q.addText(R)}function qe(){if($==="")return;let f=null;if(typeof T.subLanguage=="string"){if(!u[T.subLanguage]){q.addText($);return}f=Ne(T.subLanguage,$,!0,Jt[T.subLanguage]),Jt[T.subLanguage]=f._top}else f=ut($,T.subLanguage.length?T.subLanguage:null);T.relevance>0&&(We+=f.relevance),q.__addSublanguage(f._emitter,f.language)}function Q(){T.subLanguage!=null?qe():he(),$=""}function ne(f,y){f!==""&&(q.startScope(y),q.addText(f),q.endScope())}function qt(f,y){let R=1;const O=y.length-1;for(;R<=O;){if(!f._emit[R]){R++;continue}const Z=re.classNameAliases[f[R]]||f[R],oe=y[R];Z?ne(oe,Z):($=oe,he(),$=""),R++}}function Zt(f,y){return f.scope&&typeof f.scope=="string"&&q.openNode(re.classNameAliases[f.scope]||f.scope),f.beginScope&&(f.beginScope._wrap?(ne($,re.classNameAliases[f.beginScope._wrap]||f.beginScope._wrap),$=""):f.beginScope._multi&&(qt(f.beginScope,y),$="")),T=Object.create(f,{parent:{value:T}}),T}function Wt(f,y,R){let O=Y(f.endRe,R);if(O){if(f["on:end"]){const Z=new e(f);f["on:end"](y,Z),Z.isMatchIgnored&&(O=!1)}if(O){for(;f.endsParent&&f.parent;)f=f.parent;return f}}if(f.endsWithParent)return Wt(f.parent,y,R)}function wr(f){return T.matcher.regexIndex===0?($+=f[0],1):(ft=!0,0)}function kr(f){const y=f[0],R=f.rule,O=new e(R),Z=[R.__beforeBegin,R["on:begin"]];for(const oe of Z)if(oe&&(oe(f,O),O.isMatchIgnored))return wr(y);return R.skip?$+=y:(R.excludeBegin&&($+=y),Q(),!R.returnBegin&&!R.excludeBegin&&($=y)),Zt(R,f),R.returnBegin?0:y.length}function Er(f){const y=f[0],R=w.substring(f.index),O=Wt(T,f,R);if(!O)return Ft;const Z=T;T.endScope&&T.endScope._wrap?(Q(),ne(y,T.endScope._wrap)):T.endScope&&T.endScope._multi?(Q(),qt(T.endScope,f)):Z.skip?$+=y:(Z.returnEnd||Z.excludeEnd||($+=y),Q(),Z.excludeEnd&&($=y));do T.scope&&q.closeNode(),!T.skip&&!T.subLanguage&&(We+=T.relevance),T=T.parent;while(T!==O.parent);return O.starts&&Zt(O.starts,f),Z.returnEnd?0:y.length}function Sr(){const f=[];for(let y=T;y!==re;y=y.parent)y.scope&&f.unshift(y.scope);f.forEach(y=>q.openNode(y))}let Ze={};function Kt(f,y){const R=y&&y[0];if($+=f,R==null)return Q(),0;if(Ze.type==="begin"&&y.type==="end"&&Ze.index===y.index&&R===""){if($+=w.slice(y.index,y.index+1),!H){const O=new Error(`0 width match regex (${h})`);throw O.languageName=h,O.badRule=Ze.rule,O}return 1}if(Ze=y,y.type==="begin")return kr(y);if(y.type==="illegal"&&!N){const O=new Error('Illegal lexeme "'+R+'" for mode "'+(T.scope||"<unnamed>")+'"');throw O.mode=T,O}else if(y.type==="end"){const O=Er(y);if(O!==Ft)return O}if(y.type==="illegal"&&R==="")return $+=`
`,1;if(pt>1e5&&pt>y.index*3)throw new Error("potential infinite loop, way more iterations than matches");return $+=R,R.length}const re=de(h);if(!re)throw xe(z.replace("{}",h)),new Error('Unknown language: "'+h+'"');const vr=sr(re);let ht="",T=P||vr;const Jt={},q=new g.__emitter(g);Sr();let $="",We=0,ye=0,pt=0,ft=!1;try{if(re.__emitTokens)re.__emitTokens(w,q);else{for(T.matcher.considerAll();;){pt++,ft?ft=!1:T.matcher.considerAll(),T.matcher.lastIndex=ye;const f=T.matcher.exec(w);if(!f)break;const y=w.substring(ye,f.index),R=Kt(y,f);ye=f.index+R}Kt(w.substring(ye))}return q.finalize(),ht=q.toHTML(),{language:h,value:ht,relevance:We,illegal:!1,_emitter:q,_top:T}}catch(f){if(f.message&&f.message.includes("Illegal"))return{language:h,value:ct(w),illegal:!0,relevance:0,_illegalBy:{message:f.message,index:ye,context:w.slice(ye-100,ye+100),mode:f.mode,resultSoFar:ht},_emitter:q};if(H)return{language:h,value:ct(w),illegal:!1,relevance:0,errorRaised:f,_emitter:q,_top:T};throw f}}function lt(h){const w={value:ct(h),illegal:!1,relevance:0,_top:x,_emitter:new g.__emitter(g)};return w._emitter.addText(h),w}function ut(h,w){w=w||g.languages||Object.keys(u);const N=lt(h),P=w.filter(de).filter(jt).map(Q=>Ne(Q,h,!1));P.unshift(N);const X=P.sort((Q,ne)=>{if(Q.relevance!==ne.relevance)return ne.relevance-Q.relevance;if(Q.language&&ne.language){if(de(Q.language).supersetOf===ne.language)return 1;if(de(ne.language).supersetOf===Q.language)return-1}return 0}),[ee,he]=X,qe=ee;return qe.secondBest=he,qe}function lr(h,w,N){const P=w&&p[w]||N;h.classList.add("hljs"),h.classList.add(`language-${P}`)}function dt(h){let w=null;const N=G(h);if(v(N))return;if(je("before:highlightElement",{el:h,language:N}),h.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",h);return}if(h.children.length>0&&(g.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(h)),g.throwUnescapedHTML))throw new ar("One of your code blocks includes unescaped HTML.",h.innerHTML);w=h;const P=w.textContent,X=N?U(P,{language:N,ignoreIllegals:!0}):ut(P);h.innerHTML=X.value,h.dataset.highlighted="yes",lr(h,N,X.language),h.result={language:X.language,re:X.relevance,relevance:X.relevance},X.secondBest&&(h.secondBest={language:X.secondBest.language,relevance:X.secondBest.relevance}),je("after:highlightElement",{el:h,result:X,text:P})}function ur(h){g=zt(g,h)}const dr=()=>{Ge(),_e("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function hr(){Ge(),_e("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Xt=!1;function Ge(){function h(){Ge()}if(document.readyState==="loading"){Xt||window.addEventListener("DOMContentLoaded",h,!1),Xt=!0;return}document.querySelectorAll(g.cssSelector).forEach(dt)}function pr(h,w){let N=null;try{N=w(o)}catch(P){if(xe("Language definition for '{}' could not be registered.".replace("{}",h)),H)xe(P);else throw P;N=x}N.name||(N.name=h),u[h]=N,N.rawDefinition=w.bind(null,o),N.aliases&&Gt(N.aliases,{languageName:h})}function fr(h){delete u[h];for(const w of Object.keys(p))p[w]===h&&delete p[w]}function gr(){return Object.keys(u)}function de(h){return h=(h||"").toLowerCase(),u[h]||u[p[h]]}function Gt(h,{languageName:w}){typeof h=="string"&&(h=[h]),h.forEach(N=>{p[N.toLowerCase()]=w})}function jt(h){const w=de(h);return w&&!w.disableAutodetect}function mr(h){h["before:highlightBlock"]&&!h["before:highlightElement"]&&(h["before:highlightElement"]=w=>{h["before:highlightBlock"](Object.assign({block:w.el},w))}),h["after:highlightBlock"]&&!h["after:highlightElement"]&&(h["after:highlightElement"]=w=>{h["after:highlightBlock"](Object.assign({block:w.el},w))})}function br(h){mr(h),_.push(h)}function xr(h){const w=_.indexOf(h);w!==-1&&_.splice(w,1)}function je(h,w){const N=h;_.forEach(function(P){P[N]&&P[N](w)})}function yr(h){return _e("10.7.0","highlightBlock will be removed entirely in v12.0"),_e("10.7.0","Please use highlightElement now."),dt(h)}Object.assign(o,{highlight:U,highlightAuto:ut,highlightAll:Ge,highlightElement:dt,highlightBlock:yr,configure:ur,initHighlighting:dr,initHighlightingOnLoad:hr,registerLanguage:pr,unregisterLanguage:fr,listLanguages:gr,getLanguage:de,registerAliases:Gt,autoDetection:jt,inherit:zt,addPlugin:br,removePlugin:xr}),o.debugMode=function(){H=!1},o.safeMode=function(){H=!0},o.versionString=or,o.regex={concat:S,lookahead:b,either:F,optional:E,anyNumberOfTimes:C};for(const h in Ue)typeof Ue[h]=="object"&&t(Ue[h]);return Object.assign(o,Ue),o},Te=Ut({});return Te.newInstance=()=>Ut({}),mt=Te,Te.HighlightJS=Te,Te.default=Te,mt}var Ds=Bs();const $e=$s(Ds);function Hs(t){const e=t.regex,n={},s={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:e.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},s]});const r={className:"subst",begin:/\$\(/,end:/\)/,contains:[t.BACKSLASH_ESCAPE]},i=t.inherit(t.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),a={begin:/<<-?\s*(?=\w+)/,starts:{contains:[t.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},c={className:"string",begin:/"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,n,r]};r.contains.push(c);const d={match:/\\"/},l={className:"string",begin:/'/,end:/'/},m={match:/\\'/},k={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},t.NUMBER_MODE,n]},b=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],C=t.SHEBANG({binary:`(${b.join("|")})`,relevance:10}),E={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[t.inherit(t.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},S=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],D=["true","false"],F={match:/(\/[a-z._-]+)+/},L=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],Y=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],W=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],J=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:S,literal:D,built_in:[...L,...Y,"set","shopt",...W,...J]},contains:[C,t.SHEBANG(),E,k,i,a,F,c,d,l,m,n]}}const tt="[A-Za-z$_][0-9A-Za-z$_]*",Nn=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Mn=["true","false","null","undefined","NaN","Infinity"],On=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],In=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Ln=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Pn=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],$n=[].concat(Ln,On,In);function zs(t){const e=t.regex,n=(j,{after:ue})=>{const be="</"+j[0].slice(1);return j.input.indexOf(be,ue)!==-1},s=tt,r={begin:"<>",end:"</>"},i=/<[A-Za-z0-9\\._:-]+\s*\/>/,a={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(j,ue)=>{const be=j[0].length+j.index,ve=j.input[be];if(ve==="<"||ve===","){ue.ignoreMatch();return}ve===">"&&(n(j,{after:be})||ue.ignoreMatch());let Ce;const Fe=j.input.substring(be);if(Ce=Fe.match(/^\s*=/)){ue.ignoreMatch();return}if((Ce=Fe.match(/^\s+extends\s+/))&&Ce.index===0){ue.ignoreMatch();return}}},c={$pattern:tt,keyword:Nn,literal:Mn,built_in:$n,"variable.language":Pn},d="[0-9](_?[0-9])*",l=`\\.(${d})`,m="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",k={className:"number",variants:[{begin:`(\\b(${m})((${l})|\\.)?|(${l}))[eE][+-]?(${d})\\b`},{begin:`\\b(${m})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},b={className:"subst",begin:"\\$\\{",end:"\\}",keywords:c,contains:[]},C={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,b],subLanguage:"xml"}},E={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,b],subLanguage:"css"}},S={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,b],subLanguage:"graphql"}},D={className:"string",begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,b]},L={className:"comment",variants:[t.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:s+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]},Y=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,C,E,S,D,{match:/\$\d+/},k];b.contains=Y.concat({begin:/\{/,end:/\}/,keywords:c,contains:["self"].concat(Y)});const W=[].concat(L,b.contains),J=W.concat([{begin:/(\s*)\(/,end:/\)/,keywords:c,contains:["self"].concat(W)}]),V={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:c,contains:J},te={variants:[{match:[/class/,/\s+/,s,/\s+/,/extends/,/\s+/,e.concat(s,"(",e.concat(/\./,s),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,s],scope:{1:"keyword",3:"title.class"}}]},Se={relevance:0,match:e.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...On,...In]}},Be={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},De={variants:[{match:[/function/,/\s+/,s,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[V],illegal:/%/},He={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function st(j){return e.concat("(?!",j.join("|"),")")}const it={match:e.concat(/\b/,st([...Ln,"super","import"].map(j=>`${j}\\s*\\(`)),s,e.lookahead(/\s*\(/)),className:"title.function",relevance:0},me={begin:e.concat(/\./,e.lookahead(e.concat(s,/(?![0-9A-Za-z$_(])/))),end:s,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},ot={match:[/get|set/,/\s+/,s,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},V]},ze="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",at={match:[/const|var|let/,/\s+/,s,/\s*/,/=\s*/,/(async\s*)?/,e.lookahead(ze)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[V]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:c,exports:{PARAMS_CONTAINS:J,CLASS_REFERENCE:Se},illegal:/#(?![$_A-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",relevance:5}),Be,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,C,E,S,D,L,{match:/\$\d+/},k,Se,{scope:"attr",match:s+e.lookahead(":"),relevance:0},at,{begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[L,t.REGEXP_MODE,{className:"function",begin:ze,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:c,contains:J}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:r.begin,end:r.end},{match:i},{begin:a.begin,"on:begin":a.isTrulyOpeningTag,end:a.end}],subLanguage:"xml",contains:[{begin:a.begin,end:a.end,skip:!0,contains:["self"]}]}]},De,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[V,t.inherit(t.TITLE_MODE,{begin:s,className:"title.function"})]},{match:/\.\.\./,relevance:0},me,{match:"\\$"+s,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[V]},it,He,te,ot,{match:/\$[(.]/}]}}function Fs(t){const e=t.regex,n=zs(t),s=tt,r=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],i={begin:[/namespace/,/\s+/,t.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},a={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:r},contains:[n.exports.CLASS_REFERENCE]},c={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},d=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],l={$pattern:tt,keyword:Nn.concat(d),literal:Mn,built_in:$n.concat(r),"variable.language":Pn},m={className:"meta",begin:"@"+s},k=(S,D,F)=>{const L=S.contains.findIndex(Y=>Y.label===D);if(L===-1)throw new Error("can not find mode to replace");S.contains.splice(L,1,F)};Object.assign(n.keywords,l),n.exports.PARAMS_CONTAINS.push(m);const b=n.contains.find(S=>S.scope==="attr"),C=Object.assign({},b,{match:e.concat(s,e.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,b,C]),n.contains=n.contains.concat([m,i,a,C]),k(n,"shebang",t.SHEBANG()),k(n,"use_strict",c);const E=n.contains.find(S=>S.label==="func.def");return E.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}function Us(t){const e=t.regex,n=e.concat(/[\p{L}_]/u,e.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),s=/[\p{L}0-9._:-]+/u,r={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},i={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},a=t.inherit(i,{begin:/\(/,end:/\)/}),c=t.inherit(t.APOS_STRING_MODE,{className:"string"}),d=t.inherit(t.QUOTE_STRING_MODE,{className:"string"}),l={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:s,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[r]},{begin:/'/,end:/'/,contains:[r]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[i,d,c,a,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[i,a,d,c]}]}]},t.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},r,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[d]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[l],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[l],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:e.concat(/</,e.lookahead(e.concat(n,e.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:l}]},{className:"tag",begin:e.concat(/<\//,e.lookahead(e.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}const _t=pe("todo"),Xs=Le(()=>{const t=_t();if(typeof t=="string"||!t)return'<p class="border rounded-md p-2">Start editing to get a preview!</p>';const e=mn(t);return e instanceof Text?'<p class="border rounded-md p-2">Start editing to get a preview!</p>':(console.log("Preview HTML:",e.outerHTML),Bn(e),e.outerHTML)}),bt="editor_content";function Gs(){const t=s=>{s.preventDefault();const r=document.getSelection();if(!r||r.rangeCount===0)return;const i=r.getRangeAt(0);if(i.collapsed)return;const a=document.createElement("strong");try{i.surroundContents(a),r.removeAllRanges(),e()}catch{try{const d=i.extractContents();a.appendChild(d),i.insertNode(a),r.removeAllRanges(),e()}catch(d){console.warn("Could not apply bold formatting:",d)}}},e=()=>{const s=document.getElementById(bt);s&&_t(gn(s))};return B("div",{class:"p-2 w-full flex flex-auto gap-4 flex-col",children:[B("div",{id:"article_editor",children:[B("div",{id:"edit_buttons",class:"p-2 flex gap-2",children:[A("span",{children:"Formatting:"}),A("button",{class:"p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700",onmousedown:t,title:"Bold selected text",children:A("strong",{children:"B"})})]}),A("div",{class:"border-2 rounded-md p-2 bg-white text-black",children:A("div",{id:bt,class:"",children:A("article",{contenteditable:"true",oninput:s=>{e()},children:B("p",{children:["Edit me! Select some text and click the ",A("strong",{children:"B"})," button to make it bold."]})})})})]}),B("div",{children:[A("p",{class:"text-xl font-semibold",children:"Preview:"}),A("div",{class:"p-2 border-2 bg-white text-black",children:A("div",{innerHTML:Xs})})]}),B("div",{class:"p-2 bg-purple-950 rounded-md",children:[A("p",{class:"text-xl font-semibold",children:"JSON:"}),A("div",{class:"bg-black/20 p-2 border-2 border-gray-500 rounded-md",children:A("output",{class:"",name:"json_output",for:bt,children:A("pre",{class:"overflow-x-scroll",children:()=>JSON.stringify(_t(),null,"  ")})})})]})]})}function Bn(t){t.removeAttribute("contenteditable");for(const e of t.children)Bn(e)}const js=`import {
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
            <article contenteditable="true" oninput={handleInput}>
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
}`;$e.registerLanguage("typescript",Fs);$e.registerLanguage("html",Us);$e.registerLanguage("bash",Hs);const qs=Cn(Ps);function ln(t){document.title=t}function un(t){const e=document.querySelector('meta[name="description"]');e&&e.setAttribute("content",t)}function Zs(){const t=fn(),e=Le(()=>{const s=Hr("doc")()||"main";console.log("docname:",s);const r=bn.find(i=>i.route_name==s);return r?(ln(`${r.title} | HyperFX`),un(`HyperFX docs about ${r.title}.`)):(ln("HyperFX"),un("HyperFX docs")),r}),n=Le(()=>{const s=e();if(s){const r=Cn(s.data);return console.log(r.slice(0,100)),r}return""});return ge(()=>{t(),setTimeout(()=>{const s=document.querySelectorAll("pre code");for(const r of s)$e.highlightElement(r)},1)}),B(pn,{children:[A(tn,{when:()=>n,children:B("div",{class:"flex flex-auto",children:[A(Yr,{}),A("article",{class:"p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl",children:A("div",{class:"markdown-body",innerHTML:n})})]})}),A(tn,{when:()=>e()===void 0||e().route_name==="main",children:B("div",{class:"grow flex flex-col",children:[A("article",{class:"p-4 mx-auto w-full max-w-4xl",children:A("div",{class:"markdown-body-main",innerHTML:qs})}),B("div",{class:"p-2 bg-red-950 text-white mt-4 mx-auto",children:[A("p",{class:"text-xl",children:"This is a work in progress!"}),A("p",{class:"text-xl",children:"The docs are not finished yet!"})]})]})})]})}function Ws(){const t=Gs(),e=A("pre",{class:"mx-auto max-w-[70vw]! max-h-[50vw]",children:A("code",{class:"language-tsx",children:js})});return ge(()=>{setTimeout(()=>{const n=document.querySelector("pre code");n&&n.attributes.getNamedItem("data-highlighted")?.value!="yes"&&$e.highlightElement(n)},0)}),B("div",{class:"flex flex-col p-4 max-w-[80vw] mx-auto",children:[B("div",{class:"p-2",children:[B("p",{class:"mx-auto",children:["This is the code used to create the editor.",B("span",{class:"text-purple-500/80",children:[" ","(The editor is far from done but it is still cool IMO.)"]})]}),A("div",{class:"w-full",children:e})]}),t]})}function Ks(){const t=Dr(),e=fn();return ge(()=>{e()==="/"&&t("/hyperfx")}),B("div",{class:"flex flex-auto flex-col min-h-screen",children:[A(Jr,{}),B("main",{class:"flex flex-auto flex-col",id:"main-content",children:[A("p",{class:"p-2 bg-red-800 text-white text-center w-full! max-w-full!",children:"A LOT OF CHANGES. DOCS ARE NOT UP TO DATE."}),A(en,{path:"/hyperfx/editor",component:Ws}),A(en,{path:"/hyperfx",component:Zs,exact:!0})]}),B("footer",{class:"bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto",children:[A("a",{href:"https://github.com/ArnoudK/hyperfx",target:"_blank",class:"underline",children:"Github"}),B("span",{class:"w-full ",children:[" - © ",new Date().getFullYear()," Arnoud Kerkhof"]})]})]})}function Js(){return A(Br,{initialPath:"/hyperfx",children:()=>A(Ks,{})})}const Qs=document.getElementById("app");Qs.replaceChildren(Js());
