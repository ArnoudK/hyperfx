(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();let ie=!1;const oe=new Set;class kr{constructor(e){this.subscribers=new Set,this._value=e}get(){return ie&&oe.add(this.callableSignal),this._value}set(e){return Object.is(this._value,e)||(this._value=e,this.subscribers.forEach(n=>{try{n(e)}catch(s){console.error("Signal subscriber error:",s)}})),e}subscribe(e){return this.subscribers.add(e),()=>{this.subscribers.delete(e)}}peek(){return this._value}update(e){return this.set(e(this._value))}get subscriberCount(){return this.subscribers.size}}function ge(t){const e=new kr(t),n=Object.assign(s=>s!==void 0?e.set(s):e.get(),{get:()=>e.get(),set:s=>e.set(s),subscribe:s=>e.subscribe(s),peek:()=>e.peek(),update:s=>e.update(s),get subscriberCount(){return e.subscriberCount}});return e.callableSignal=n,n}function wr(t){const e=ie;ie=!0,oe.clear();let n;try{n=t()}finally{ie=e}const s=ge(n),r=Array.from(oe);oe.clear();const i=s.set;s.set=()=>{throw new Error("Cannot set computed signal directly. Computed signals are read-only.")};const o=r.map(l=>l.subscribe(()=>{const d=t();i(d)}));return s._unsubscribers=o,s}function Sr(t){const e=ie;ie=!0,oe.clear();let n;n=t();const r=Array.from(oe).map(i=>i.subscribe(()=>{const o=ie;ie=!0,oe.clear(),typeof n=="function"&&n(),n=t(),ie=o,oe.clear()}));return ie=e,oe.clear(),()=>{r.forEach(i=>{i()}),typeof n=="function"&&n()}}function ue(t){return typeof t=="function"&&"subscribe"in t&&"get"in t&&"set"in t}let Er=0;function vr(){return typeof window>"u"||typeof document>"u"}function _r(){return String(++Er).padStart(6,"0")}const Tr=Symbol("HyperFX.Fragment");function Rr(t,e){let n;if(n=document.createElement(t),vr()||n.setAttribute("data-hfxh",_r()),e){for(const[s,r]of Object.entries(e))if(s!=="children"&&s!=="key")if(s==="innerHTML"||s==="textContent"){const i=()=>{const o=ue(r)?r():r;n[s]=o};ue(r)&&r.subscribe(i),i()}else if(s.startsWith("on")&&typeof r=="function"){const i=s.slice(2).toLowerCase();n.addEventListener(i,r)}else if(ue(r)){const i=()=>{const o=r();o==null?s==="value"&&n instanceof HTMLInputElement?n.value="":s==="checked"&&n instanceof HTMLInputElement?n.checked=!1:n.removeAttribute(s):s==="value"&&n instanceof HTMLInputElement?n.value=String(o):s==="checked"&&n instanceof HTMLInputElement?n.checked=!!o:s==="disabled"&&typeof o=="boolean"?o?(n.setAttribute("disabled",""),n.disabled=!0):(n.removeAttribute("disabled"),n.disabled=!1):s==="class"||s==="className"?n.className=String(o):n.setAttribute(s,String(o))};i(),r.subscribe(i)}else r!=null&&(s==="value"&&n instanceof HTMLInputElement?n.value=String(r):s==="checked"&&n instanceof HTMLInputElement?n.checked=!!r:s==="disabled"&&typeof r=="boolean"?r?(n.setAttribute("disabled",""),n.disabled=!0):(n.removeAttribute("disabled"),n.disabled=!1):n.setAttribute(s,String(r)))}return n}function Ar(t){const e=document.createTextNode(""),n=()=>{let s="";ue(t)?s=String(t()):s=String(t),e.textContent=s};return n(),ue(t)&&t.subscribe(n),e}function sn(t,e,n){const s=Array.isArray(e)?e:[e];for(const r of s)if(!(r==null||r===!1||r===!0))if(ue(r)){const i=r();if(i instanceof Node)t.appendChild(i);else{const o=Ar(r);t.appendChild(o)}}else if(typeof r=="function")try{const i=r();if(i instanceof Node)t.appendChild(i),n?.add(i);else if(Array.isArray(i))sn(t,i,n);else{const o=document.createTextNode(String(i));t.appendChild(o),n?.add(o)}}catch(i){console.warn("Error rendering function child:",i)}else if(typeof r=="object"&&r instanceof Node)t.appendChild(r);else{const i=document.createTextNode(String(r));t.appendChild(i)}}function mt(t,e){if(!e)return;sn(t,e,void 0)}function R(t,e,n){if(t===Tr||t===an){const r=e?.children,i=document.createDocumentFragment();return mt(i,r),i}if(typeof t=="function"){const r=new Proxy(e||{},{get(i,o,l){const d=Reflect.get(i,o,l);return ue(d)?d():d}});return t(r)}const s=Rr(t,e);return e?.children&&mt(s,e.children),s}const D=R;function an(t){const e=document.createDocumentFragment();return mt(e,t.children),e}function Oe(t){return wr(t)}function de(t){return Sr(t)}const bt=new Map;function Cr(t){const e=Symbol("Context");return{id:e,defaultValue:t,Provider:s=>{let r=bt.get(e);r||(r=[],bt.set(e,r)),r.push(s.value);let i;try{typeof s.children=="function"?i=s.children():(console.warn("Context.Provider: children should be a function to receive context value."),i=s.children)}finally{r.pop()}if(Array.isArray(i)){const o=document.createDocumentFragment();return i.forEach(l=>{l instanceof Node&&o.appendChild(l)}),o}return i}}}function Re(t){const e=bt.get(t.id);return e&&e.length>0?e[e.length-1]:t.defaultValue}const ke=Cr(null);function Nr(t){Re(ke)&&console.warn("Router: Nested routers are not fully supported yet");const n=ge(t.initialPath||window.location.pathname+window.location.search),s=ge([n()]),r=ge(0);de(()=>{const c=()=>{const m=window.location.pathname+window.location.search||"/";n(m);const w=[...s()];w[r()]=m,s(w)};return window.addEventListener("popstate",c),()=>{window.removeEventListener("popstate",c)}});const d={currentPath:n,navigate:(c,m={})=>{if(console.log("Router: navigate called",c),m.replace){window.history.replaceState({},"",c);const w=[...s()];w[r()]=c,s(w)}else{window.history.pushState({},"",c);const w=[...s().slice(0,r()+1),c];s(w),r(r()+1)}console.log("Router: updating currentPath signal",c),n(c)},back:()=>{if(r()>0){const c=r()-1;r(c);const m=s()[c]||"/";window.history.back(),n(m)}},forward:()=>{if(r()<s().length-1){const c=r()+1;r(c);const m=s()[c]||"/";window.history.forward(),n(m)}}};return ke.Provider({value:d,children:t.children})}function Wt(t){const e=document.createDocumentFragment(),n=document.createComment(`Route start: ${t.path}`),s=document.createComment(`Route end: ${t.path}`);e.appendChild(n),e.appendChild(s);let r=[],i=!1;const{path:o,component:l,children:d,exact:c,...m}=t,w=Re(ke);return de(()=>{if(!w)return;const b=w.currentPath,S=b().split("?")[0],E=c!==void 0&&c?S===o:S.startsWith(o);if(E===i)return;i=E;const F=n.parentNode||e;if(r.forEach(L=>{L.parentNode===F&&L.parentNode?.removeChild(L)}),r=[],E){let L;l?L=l({...m}):typeof d=="function"?L=d():L=d,L&&(Array.isArray(L)?L:[L]).forEach(W=>{if(W instanceof Node)F.insertBefore(W,s),r.push(W);else if(W!=null){const J=document.createTextNode(String(W));F.insertBefore(J,s),r.push(J)}})}}),e}function Ke(t){const e=document.createElement("a");e.href=t.to,e.className=t.class!==void 0?t.class:"";const n=Re(ke);console.log("Link: render",t.to,"context:",!!n);const s=r=>{console.log("Link: clicked",t.to),r.preventDefault(),t.onClick&&t.onClick(r),n?n.navigate(t.to,{replace:t.replace!==void 0?t.replace:!1}):(window.history.pushState({},"",t.to),window.dispatchEvent(new PopStateEvent("popstate")))};return e.addEventListener("click",s),de(()=>{if(!n)return;const r=n.currentPath,i=r(),o=t.exact!==void 0&&t.exact?i===t.to:i.startsWith(t.to),l=t.activeClass!==void 0?t.activeClass:"active";o?e.classList.add(l):e.classList.remove(l)}),typeof t.children=="string"?e.textContent=t.children:Array.isArray(t.children)?t.children.forEach(r=>{e.appendChild(r)}):t.children&&e.appendChild(t.children),e}function on(){const t=Re(ke);return t?t.currentPath:ge(window.location.pathname)}function Mr(){const t=Re(ke);return(e,n)=>{t?t.navigate(e,n):n?.replace?window.history.replaceState({},"",e):window.history.pushState({},"",e)}}function Ir(t){const e=Re(ke);return Oe(()=>(e&&e.currentPath(),new URLSearchParams(window.location.search).get(t)))}function Or(t){const e=document.createDocumentFragment(),n=document.createComment("For start"),s=document.createComment("For end");e.appendChild(n),e.appendChild(s);const r=Array.isArray(t.children)?t.children[0]:t.children;if(typeof r!="function")throw new Error("For component children must be a function.");const i=new Map;return de(()=>{let l=[];ue(t.each)||typeof t.each=="function"?l=t.each():l=t.each,Array.isArray(l)||(l=[]);const d=n.parentNode||e,c=[],m=new Map;i.forEach((b,C)=>{m.set(C,[...b])}),l.forEach((b,C)=>{const S=m.get(b);if(S&&S.length>0){const E=S.shift();E.indexSignal(C),c.push(E)}else{const E=ge(C),$=r(b,E);let F=[];$ instanceof DocumentFragment?F=Array.from($.childNodes):$ instanceof Node&&(F=[$]),c.push({nodes:F,indexSignal:E})}}),m.forEach(b=>{b.forEach(C=>{C.nodes.forEach(S=>S.parentElement?.removeChild(S))})});let w=s;for(let b=c.length-1;b>=0;b--){const C=c[b];if(!C)continue;const S=C.nodes;for(let E=S.length-1;E>=0;E--){const $=S[E];$.nextSibling!==w&&d.insertBefore($,w),w=$}}i.clear(),c.forEach((b,C)=>{const S=l[C],E=i.get(S)||[];E.push(b),i.set(S,E)})}),e}function Kt(t){const e=document.createDocumentFragment(),n=document.createComment("Show start"),s=document.createComment("Show end");e.appendChild(n),e.appendChild(s);let r=[];return de(()=>{const i=typeof t.when=="function"||ue(t.when)?t.when():t.when,o=n.parentNode||e;r.forEach(d=>d.parentElement?.removeChild(d)),r=[];const l=i?t.children:t.fallback;if(l){const d=typeof l=="function"?l():l,c=d instanceof DocumentFragment?Array.from(d.childNodes):[d];c.forEach(m=>o.insertBefore(m,s)),r=c}}),e}function Lr(t){const e=t.tagName,n={},s=[],r=t.childNodes,i=t.attributes;for(const o of i){const l=o.name,d=o.value;n[l]=d}for(const o of r)s.push(ln(o));return{tag:e,attrs:n,children:s}}function ln(t){return t instanceof Text?t.textContent??"":Lr(t)}function cn(t){if(typeof t=="string")return document.createTextNode(t);const e=document.createElement(t.tag);for(const s of t.children)e.appendChild(cn(s));const n=Object.keys(t.attrs);for(const s of n)e.setAttribute(s,t.attrs[s]);return e}const Pr=`# The basics

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
        onInput={(e) => name(e.target.value)} 
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
`,Br=`# Routing & SPA

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
  
  return <button onClick={handleLogout}>Logout</button>;
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
`,Dr=`# Components

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
        onInput={(e) => {
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
`,$r=`# Get started with HyperFX

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
`,Hr=`# State Management

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
    <button onClick={() => count(count() + 1)}>
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
    <button onClick={() => setCount(count() + 1)}>
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
`,zr=`# Rendering

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
      <button onClick={() => count(count() + 1)}>
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
        <button onClick={() => logout()}>Logout</button>
      </Show>
      
      <Show when={() => !loggedIn()}>
        <button onClick={() => login()}>Login</button>
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
`,Fr=`# Server-Side Rendering (SSR)

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
`,Ur="/hyperfx?doc=",un=[{title:"Get Started",route_name:"get_started",data:$r},{title:"HyperFX basics",route_name:"basics",data:Pr},{title:"State Management",route_name:"state-management",data:Hr},{title:"Rendering & Control Flow",route_name:"render",data:zr},{title:"HyperFX components",route_name:"components",data:Dr},{title:"Single Page Application",route_name:"spa",data:Br},{title:"Server-Side Rendering",route_name:"ssr",data:Fr}];function Xr(){return D("nav",{class:"flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg",children:[R(Ke,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx",children:"Home"}),R(Ke,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx?doc=get_started",children:"Docs"}),R(Ke,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx/editor",children:"Example"})]})}const xt=ge(!1);function Gr(){console.log(xt(!xt()))}function jr(){const t=Oe(()=>`flex-col sm:flex gap-1 ${xt()?"flex":"hidden"}`);return D("aside",{class:"bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl",children:[R("div",{class:"flex items-center justify-between mb-6 sm:hidden",children:D("button",{class:"text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform",title:"Toggle Navigation",onclick:Gr,children:[R("span",{class:"text-lg",children:"☰"}),R("span",{class:"sr-only",children:"Toggle Navigation"})]})}),D("nav",{class:t,children:[R("p",{class:"hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3",children:"Fundamentals"}),R(Or,{each:un,children:e=>R(Ke,{class:"px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block",to:`${Ur}${e.route_name}`,children:e.title})})]})]})}function Et(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Se=Et();function dn(t){Se=t}var Ie={exec:()=>null};function M(t,e=""){let n=typeof t=="string"?t:t.source;const s={replace:(r,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(K.caret,"$1"),n=n.replace(r,o),s},getRegex:()=>new RegExp(n,e)};return s}var K={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},Zr=/^(?:[ \t]*(?:\n|$))+/,qr=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Wr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Le=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Kr=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,vt=/(?:[*+-]|\d{1,9}[.)])/,hn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,pn=M(hn).replace(/bull/g,vt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Jr=M(hn).replace(/bull/g,vt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),_t=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Qr=/^[^\n]+/,Tt=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Yr=M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Tt).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Vr=M(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,vt).getRegex(),tt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Rt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,es=M("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Rt).replace("tag",tt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),fn=M(_t).replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex(),ts=M(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",fn).getRegex(),At={blockquote:ts,code:qr,def:Yr,fences:Wr,heading:Kr,hr:Le,html:es,lheading:pn,list:Vr,newline:Zr,paragraph:fn,table:Ie,text:Qr},Jt=M("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex(),ns={...At,lheading:Jr,table:Jt,paragraph:M(_t).replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Jt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex()},rs={...At,html:M(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Rt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ie,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:M(_t).replace("hr",Le).replace("heading",` *#{1,6} *[^
]`).replace("lheading",pn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ss=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,is=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,gn=/^( {2,}|\\)\n(?!\s*$)/,as=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,nt=/[\p{P}\p{S}]/u,Ct=/[\s\p{P}\p{S}]/u,mn=/[^\s\p{P}\p{S}]/u,os=M(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ct).getRegex(),bn=/(?!~)[\p{P}\p{S}]/u,ls=/(?!~)[\s\p{P}\p{S}]/u,cs=/(?:[^\s\p{P}\p{S}]|~)/u,us=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,xn=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,ds=M(xn,"u").replace(/punct/g,nt).getRegex(),hs=M(xn,"u").replace(/punct/g,bn).getRegex(),yn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ps=M(yn,"gu").replace(/notPunctSpace/g,mn).replace(/punctSpace/g,Ct).replace(/punct/g,nt).getRegex(),fs=M(yn,"gu").replace(/notPunctSpace/g,cs).replace(/punctSpace/g,ls).replace(/punct/g,bn).getRegex(),gs=M("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,mn).replace(/punctSpace/g,Ct).replace(/punct/g,nt).getRegex(),ms=M(/\\(punct)/,"gu").replace(/punct/g,nt).getRegex(),bs=M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),xs=M(Rt).replace("(?:-->|$)","-->").getRegex(),ys=M("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",xs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Qe=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ks=M(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Qe).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),kn=M(/^!?\[(label)\]\[(ref)\]/).replace("label",Qe).replace("ref",Tt).getRegex(),wn=M(/^!?\[(ref)\](?:\[\])?/).replace("ref",Tt).getRegex(),ws=M("reflink|nolink(?!\\()","g").replace("reflink",kn).replace("nolink",wn).getRegex(),Nt={_backpedal:Ie,anyPunctuation:ms,autolink:bs,blockSkip:us,br:gn,code:is,del:Ie,emStrongLDelim:ds,emStrongRDelimAst:ps,emStrongRDelimUnd:gs,escape:ss,link:ks,nolink:wn,punctuation:os,reflink:kn,reflinkSearch:ws,tag:ys,text:as,url:Ie},Ss={...Nt,link:M(/^!?\[(label)\]\((.*?)\)/).replace("label",Qe).getRegex(),reflink:M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Qe).getRegex()},yt={...Nt,emStrongRDelimAst:fs,emStrongLDelim:hs,url:M(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Es={...yt,br:M(gn).replace("{2,}","*").getRegex(),text:M(yt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},We={normal:At,gfm:ns,pedantic:rs},Ne={normal:Nt,gfm:yt,breaks:Es,pedantic:Ss},vs={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Qt=t=>vs[t];function se(t,e){if(e){if(K.escapeTest.test(t))return t.replace(K.escapeReplace,Qt)}else if(K.escapeTestNoEncode.test(t))return t.replace(K.escapeReplaceNoEncode,Qt);return t}function Yt(t){try{t=encodeURI(t).replace(K.percentDecode,"%")}catch{return null}return t}function Vt(t,e){const n=t.replace(K.findPipe,(i,o,l)=>{let d=!1,c=o;for(;--c>=0&&l[c]==="\\";)d=!d;return d?"|":" |"}),s=n.split(K.splitPipe);let r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(K.slashPipe,"|");return s}function Me(t,e,n){const s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function _s(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function en(t,e,n,s,r){const i=e.href,o=e.title||null,l=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;const d={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,d}function Ts(t,e,n){const s=t.match(n.other.indentCodeCompensation);if(s===null)return e;const r=s[1];return e.split(`
`).map(i=>{const o=i.match(n.other.beginningSpace);if(o===null)return i;const[l]=o;return l.length>=r.length?i.slice(r.length):i}).join(`
`)}var Ye=class{options;rules;lexer;constructor(t){this.options=t||Se}space(t){const e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){const e=this.rules.block.code.exec(t);if(e){const n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Me(n,`
`)}}}fences(t){const e=this.rules.block.fences.exec(t);if(e){const n=e[0],s=Ts(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){const e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){const s=Me(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){const e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Me(e[0],`
`)}}blockquote(t){const e=this.rules.block.blockquote.exec(t);if(e){let n=Me(e[0],`
`).split(`
`),s="",r="";const i=[];for(;n.length>0;){let o=!1;const l=[];let d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))l.push(n[d]),o=!0;else if(!o)l.push(n[d]);else break;n=n.slice(d);const c=l.join(`
`),m=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${c}`:c,r=r?`${r}
${m}`:m;const w=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(m,i,!0),this.lexer.state.top=w,n.length===0)break;const b=i.at(-1);if(b?.type==="code")break;if(b?.type==="blockquote"){const C=b,S=C.raw+`
`+n.join(`
`),E=this.blockquote(S);i[i.length-1]=E,s=s.substring(0,s.length-C.raw.length)+E.raw,r=r.substring(0,r.length-C.text.length)+E.text;break}else if(b?.type==="list"){const C=b,S=C.raw+`
`+n.join(`
`),E=this.list(S);i[i.length-1]=E,s=s.substring(0,s.length-b.raw.length)+E.raw,r=r.substring(0,r.length-C.raw.length)+E.raw,n=S.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim();const s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");const i=this.rules.other.listItemRegex(n);let o=!1;for(;t;){let d=!1,c="",m="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;c=e[0],t=t.substring(c.length);let w=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,F=>" ".repeat(3*F.length)),b=t.split(`
`,1)[0],C=!w.trim(),S=0;if(this.options.pedantic?(S=2,m=w.trimStart()):C?S=e[1].length+1:(S=e[2].search(this.rules.other.nonSpaceChar),S=S>4?1:S,m=w.slice(S),S+=e[1].length),C&&this.rules.other.blankLine.test(b)&&(c+=b+`
`,t=t.substring(b.length+1),d=!0),!d){const F=this.rules.other.nextBulletRegex(S),L=this.rules.other.hrRegex(S),Y=this.rules.other.fencesBeginRegex(S),W=this.rules.other.headingBeginRegex(S),J=this.rules.other.htmlBeginRegex(S);for(;t;){const V=t.split(`
`,1)[0];let te;if(b=V,this.options.pedantic?(b=b.replace(this.rules.other.listReplaceNesting,"  "),te=b):te=b.replace(this.rules.other.tabCharGlobal,"    "),Y.test(b)||W.test(b)||J.test(b)||F.test(b)||L.test(b))break;if(te.search(this.rules.other.nonSpaceChar)>=S||!b.trim())m+=`
`+te.slice(S);else{if(C||w.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Y.test(w)||W.test(w)||L.test(w))break;m+=`
`+b}!C&&!b.trim()&&(C=!0),c+=V+`
`,t=t.substring(V.length+1),w=te.slice(S)}}r.loose||(o?r.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(o=!0));let E=null,$;this.options.gfm&&(E=this.rules.other.listIsTask.exec(m),E&&($=E[0]!=="[ ] ",m=m.replace(this.rules.other.listReplaceTask,""))),r.items.push({type:"list_item",raw:c,task:!!E,checked:$,loose:!1,text:m,tokens:[]}),r.raw+=c}const l=r.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let d=0;d<r.items.length;d++)if(this.lexer.state.top=!1,r.items[d].tokens=this.lexer.blockTokens(r.items[d].text,[]),!r.loose){const c=r.items[d].tokens.filter(w=>w.type==="space"),m=c.length>0&&c.some(w=>this.rules.other.anyLine.test(w.raw));r.loose=m}if(r.loose)for(let d=0;d<r.items.length;d++)r.items[d].loose=!0;return r}}html(t){const e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){const e=this.rules.block.def.exec(t);if(e){const n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){const e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const n=Vt(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(const o of s)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(const o of r)i.rows.push(Vt(o,i.header.length).map((l,d)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[d]})));return i}}lheading(t){const e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){const e=this.rules.block.paragraph.exec(t);if(e){const n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){const e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){const e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){const e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){const e=this.rules.inline.link.exec(t);if(e){const n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const i=Me(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{const i=_s(e[2],"()");if(i===-2)return;if(i>-1){const l=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,l).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){const i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),en(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){const s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){const i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return en(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(s[1]||s[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const i=[...s[0]].length-1;let o,l,d=i,c=0;const m=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(m.lastIndex=0,e=e.slice(-1*t.length+i);(s=m.exec(e))!=null;){if(o=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!o)continue;if(l=[...o].length,s[3]||s[4]){d+=l;continue}else if((s[5]||s[6])&&i%3&&!((i+l)%3)){c+=l;continue}if(d-=l,d>0)continue;l=Math.min(l,l+d+c);const w=[...s[0]][0].length,b=t.slice(0,i+s.index+w+l);if(Math.min(i,l)%2){const S=b.slice(1,-1);return{type:"em",raw:b,text:S,tokens:this.lexer.inlineTokens(S)}}const C=b.slice(2,-2);return{type:"strong",raw:b,text:C,tokens:this.lexer.inlineTokens(C)}}}}codespan(t){const e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," ");const s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){const e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){const e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){const e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){const e=this.rules.inline.text.exec(t);if(e){const n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},le=class kt{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Se,this.options.tokenizer=this.options.tokenizer||new Ye,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={other:K,block:We.normal,inline:Ne.normal};this.options.pedantic?(n.block=We.pedantic,n.inline=Ne.pedantic):this.options.gfm&&(n.block=We.gfm,this.options.breaks?n.inline=Ne.breaks:n.inline=Ne.gfm),this.tokenizer.rules=n}static get rules(){return{block:We,inline:Ne}}static lex(e,n){return new kt(n).lex(e)}static lexInline(e,n){return new kt(n).inlineTokens(e)}lex(e){e=e.replace(K.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){const s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(K.tabCharGlobal,"    ").replace(K.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(o=>(r=o.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);const o=n.at(-1);r.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);const o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=`
`+r.raw,o.text+=`
`+r.text,this.inlineQueue.at(-1).src=o.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);const o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=`
`+r.raw,o.text+=`
`+r.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title});continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0;const l=e.slice(1);let d;this.options.extensions.startBlock.forEach(c=>{d=c.call({lexer:this},l),typeof d=="number"&&d>=0&&(o=Math.min(o,d))}),o<1/0&&o>=0&&(i=e.substring(0,o+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){const o=n.at(-1);s&&o?.type==="paragraph"?(o.raw+=`
`+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(r),s=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);const o=n.at(-1);o?.type==="text"?(o.raw+=`
`+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(r);continue}if(e){const o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){const l=Object.keys(this.tokens.links);if(l.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let i=!1,o="";for(;e;){i||(o=""),i=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},e,n))?(e=e.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);const c=n.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(e,s,o)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),n.push(l);continue}let d=e;if(this.options.extensions?.startInline){let c=1/0;const m=e.slice(1);let w;this.options.extensions.startInline.forEach(b=>{w=b.call({lexer:this},m),typeof w=="number"&&w>=0&&(c=Math.min(c,w))}),c<1/0&&c>=0&&(d=e.substring(0,c+1))}if(l=this.tokenizer.inlineText(d)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),i=!0;const c=n.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(e){const c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},Ve=class{options;parser;constructor(t){this.options=t||Se}space(t){return""}code({text:t,lang:e,escaped:n}){const s=(e||"").match(K.notSpaceStart)?.[0],r=t.replace(K.endingNewline,"")+`
`;return s?'<pre><code class="language-'+se(s)+'">'+(n?r:se(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:se(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){const e=t.ordered,n=t.start;let s="";for(let o=0;o<t.items.length;o++){const l=t.items[o];s+=this.listitem(l)}const r=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
`+s+"</"+r+`>
`}listitem(t){let e="";if(t.task){const n=this.checkbox({checked:!!t.checked});t.loose?t.tokens[0]?.type==="paragraph"?(t.tokens[0].text=n+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=n+" "+se(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:!0}):e+=n+" "}return e+=this.parser.parse(t.tokens,!!t.loose),`<li>${e}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let r=0;r<t.header.length;r++)n+=this.tablecell(t.header[r]);e+=this.tablerow({text:n});let s="";for(let r=0;r<t.rows.length;r++){const i=t.rows[r];n="";for(let o=0;o<i.length;o++)n+=this.tablecell(i[o]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${se(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){const s=this.parser.parseInline(n),r=Yt(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+se(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));const r=Yt(t);if(r===null)return se(n);t=r;let i=`<img src="${t}" alt="${n}"`;return e&&(i+=` title="${se(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:se(t.text)}},Mt=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},ce=class wt{options;renderer;textRenderer;constructor(e){this.options=e||Se,this.options.renderer=this.options.renderer||new Ve,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Mt}static parse(e,n){return new wt(n).parse(e)}static parseInline(e,n){return new wt(n).parseInline(e)}parse(e,n=!0){let s="";for(let r=0;r<e.length;r++){const i=e[r];if(this.options.extensions?.renderers?.[i.type]){const l=i,d=this.options.extensions.renderers[l.type].call({parser:this},l);if(d!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){s+=d||"";continue}}const o=i;switch(o.type){case"space":{s+=this.renderer.space(o);continue}case"hr":{s+=this.renderer.hr(o);continue}case"heading":{s+=this.renderer.heading(o);continue}case"code":{s+=this.renderer.code(o);continue}case"table":{s+=this.renderer.table(o);continue}case"blockquote":{s+=this.renderer.blockquote(o);continue}case"list":{s+=this.renderer.list(o);continue}case"html":{s+=this.renderer.html(o);continue}case"paragraph":{s+=this.renderer.paragraph(o);continue}case"text":{let l=o,d=this.renderer.text(l);for(;r+1<e.length&&e[r+1].type==="text";)l=e[++r],d+=`
`+this.renderer.text(l);n?s+=this.renderer.paragraph({type:"paragraph",raw:d,text:d,tokens:[{type:"text",raw:d,text:d,escaped:!0}]}):s+=d;continue}default:{const l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){const i=e[r];if(this.options.extensions?.renderers?.[i.type]){const l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=l||"";continue}}const o=i;switch(o.type){case"escape":{s+=n.text(o);break}case"html":{s+=n.html(o);break}case"link":{s+=n.link(o);break}case"image":{s+=n.image(o);break}case"strong":{s+=n.strong(o);break}case"em":{s+=n.em(o);break}case"codespan":{s+=n.codespan(o);break}case"br":{s+=n.br(o);break}case"del":{s+=n.del(o);break}case"text":{s+=n.text(o);break}default:{const l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},Je=class{options;block;constructor(t){this.options=t||Se}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?le.lex:le.lexInline}provideParser(){return this.block?ce.parse:ce.parseInline}},Rs=class{defaults=Et();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ce;Renderer=Ve;TextRenderer=Mt;Lexer=le;Tokenizer=Ye;Hooks=Je;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(const s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{const r=s;for(const i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(const i of r.rows)for(const o of i)n=n.concat(this.walkTokens(o.tokens,e));break}case"list":{const r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{const r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{const o=r[i].flat(1/0);n=n.concat(this.walkTokens(o,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{const s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){const i=e.renderers[r.name];i?e.renderers[r.name]=function(...o){let l=r.renderer.apply(this,o);return l===!1&&(l=i.apply(this,o)),l}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){const r=this.defaults.renderer||new Ve(this.defaults);for(const i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;const o=i,l=n.renderer[o],d=r[o];r[o]=(...c)=>{let m=l.apply(r,c);return m===!1&&(m=d.apply(r,c)),m||""}}s.renderer=r}if(n.tokenizer){const r=this.defaults.tokenizer||new Ye(this.defaults);for(const i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;const o=i,l=n.tokenizer[o],d=r[o];r[o]=(...c)=>{let m=l.apply(r,c);return m===!1&&(m=d.apply(r,c)),m}}s.tokenizer=r}if(n.hooks){const r=this.defaults.hooks||new Je;for(const i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;const o=i,l=n.hooks[o],d=r[o];Je.passThroughHooks.has(i)?r[o]=c=>{if(this.defaults.async)return Promise.resolve(l.call(r,c)).then(w=>d.call(r,w));const m=l.call(r,c);return d.call(r,m)}:r[o]=(...c)=>{let m=l.apply(r,c);return m===!1&&(m=d.apply(r,c)),m}}s.hooks=r}if(n.walkTokens){const r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(o){let l=[];return l.push(i.call(this,o)),r&&(l=l.concat(r.call(this,o))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return le.lex(t,e??this.defaults)}parser(t,e){return ce.parse(t,e??this.defaults)}parseMarkdown(t){return(n,s)=>{const r={...s},i={...this.defaults,...r},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));i.hooks&&(i.hooks.options=i,i.hooks.block=t);const l=i.hooks?i.hooks.provideLexer():t?le.lex:le.lexInline,d=i.hooks?i.hooks.provideParser():t?ce.parse:ce.parseInline;if(i.async)return Promise.resolve(i.hooks?i.hooks.preprocess(n):n).then(c=>l(c,i)).then(c=>i.hooks?i.hooks.processAllTokens(c):c).then(c=>i.walkTokens?Promise.all(this.walkTokens(c,i.walkTokens)).then(()=>c):c).then(c=>d(c,i)).then(c=>i.hooks?i.hooks.postprocess(c):c).catch(o);try{i.hooks&&(n=i.hooks.preprocess(n));let c=l(n,i);i.hooks&&(c=i.hooks.processAllTokens(c)),i.walkTokens&&this.walkTokens(c,i.walkTokens);let m=d(c,i);return i.hooks&&(m=i.hooks.postprocess(m)),m}catch(c){return o(c)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const s="<p>An error occurred:</p><pre>"+se(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},we=new Rs;function O(t,e){return we.parse(t,e)}O.options=O.setOptions=function(t){return we.setOptions(t),O.defaults=we.defaults,dn(O.defaults),O};O.getDefaults=Et;O.defaults=Se;O.use=function(...t){return we.use(...t),O.defaults=we.defaults,dn(O.defaults),O};O.walkTokens=function(t,e){return we.walkTokens(t,e)};O.parseInline=we.parseInline;O.Parser=ce;O.parser=ce.parse;O.Renderer=Ve;O.TextRenderer=Mt;O.Lexer=le;O.lexer=le.lex;O.Tokenizer=Ye;O.Hooks=Je;O.parse=O;O.options;O.setOptions;O.use;O.walkTokens;O.parseInline;var Sn=O;ce.parse;le.lex;const As=`# HyperFX

HyperFX (hypermedia functions) is a simple library for DOM manipulation by using functions.
Right now it's JSX based. And it is not production ready.   

## Use case

Absolutely none, it is just a fun project.
`;function Cs(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ft,tn;function Ns(){if(tn)return ft;tn=1;function t(a){return a instanceof Map?a.clear=a.delete=a.set=function(){throw new Error("map is read-only")}:a instanceof Set&&(a.add=a.clear=a.delete=function(){throw new Error("set is read-only")}),Object.freeze(a),Object.getOwnPropertyNames(a).forEach(u=>{const p=a[u],_=typeof p;(_==="object"||_==="function")&&!Object.isFrozen(p)&&t(p)}),a}class e{constructor(u){u.data===void 0&&(u.data={}),this.data=u.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(a,...u){const p=Object.create(null);for(const _ in a)p[_]=a[_];return u.forEach(function(_){for(const H in _)p[H]=_[H]}),p}const r="</span>",i=a=>!!a.scope,o=(a,{prefix:u})=>{if(a.startsWith("language:"))return a.replace("language:","language-");if(a.includes(".")){const p=a.split(".");return[`${u}${p.shift()}`,...p.map((_,H)=>`${_}${"_".repeat(H+1)}`)].join(" ")}return`${u}${a}`};class l{constructor(u,p){this.buffer="",this.classPrefix=p.classPrefix,u.walk(this)}addText(u){this.buffer+=n(u)}openNode(u){if(!i(u))return;const p=o(u.scope,{prefix:this.classPrefix});this.span(p)}closeNode(u){i(u)&&(this.buffer+=r)}value(){return this.buffer}span(u){this.buffer+=`<span class="${u}">`}}const d=(a={})=>{const u={children:[]};return Object.assign(u,a),u};class c{constructor(){this.rootNode=d(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(u){this.top.children.push(u)}openNode(u){const p=d({scope:u});this.add(p),this.stack.push(p)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(u){return this.constructor._walk(u,this.rootNode)}static _walk(u,p){return typeof p=="string"?u.addText(p):p.children&&(u.openNode(p),p.children.forEach(_=>this._walk(u,_)),u.closeNode(p)),u}static _collapse(u){typeof u!="string"&&u.children&&(u.children.every(p=>typeof p=="string")?u.children=[u.children.join("")]:u.children.forEach(p=>{c._collapse(p)}))}}class m extends c{constructor(u){super(),this.options=u}addText(u){u!==""&&this.add(u)}startScope(u){this.openNode(u)}endScope(){this.closeNode()}__addSublanguage(u,p){const _=u.root;p&&(_.scope=`language:${p}`),this.add(_)}toHTML(){return new l(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function w(a){return a?typeof a=="string"?a:a.source:null}function b(a){return E("(?=",a,")")}function C(a){return E("(?:",a,")*")}function S(a){return E("(?:",a,")?")}function E(...a){return a.map(p=>w(p)).join("")}function $(a){const u=a[a.length-1];return typeof u=="object"&&u.constructor===Object?(a.splice(a.length-1,1),u):{}}function F(...a){return"("+($(a).capture?"":"?:")+a.map(_=>w(_)).join("|")+")"}function L(a){return new RegExp(a.toString()+"|").exec("").length-1}function Y(a,u){const p=a&&a.exec(u);return p&&p.index===0}const W=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function J(a,{joinWith:u}){let p=0;return a.map(_=>{p+=1;const H=p;let z=w(_),x="";for(;z.length>0;){const g=W.exec(z);if(!g){x+=z;break}x+=z.substring(0,g.index),z=z.substring(g.index+g[0].length),g[0][0]==="\\"&&g[1]?x+="\\"+String(Number(g[1])+H):(x+=g[0],g[0]==="("&&p++)}return x}).map(_=>`(${_})`).join(u)}const V=/\b\B/,te="[a-zA-Z]\\w*",Ee="[a-zA-Z_]\\w*",Be="\\b\\d+(\\.\\d+)?",De="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",$e="\\b(0b[01]+)",rt="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",st=(a={})=>{const u=/^#![ ]*\//;return a.binary&&(a.begin=E(u,/.*\b/,a.binary,/\b.*/)),s({scope:"meta",begin:u,end:/$/,relevance:0,"on:begin":(p,_)=>{p.index!==0&&_.ignoreMatch()}},a)},me={begin:"\\\\[\\s\\S]",relevance:0},it={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[me]},He={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[me]},at={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},j=function(a,u,p={}){const _=s({scope:"comment",begin:a,end:u,contains:[]},p);_.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const H=F("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return _.contains.push({begin:E(/[ ]+/,"(",H,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),_},he=j("//","$"),be=j("/\\*","\\*/"),ve=j("#","$"),Ae={scope:"number",begin:Be,relevance:0},ze={scope:"number",begin:De,relevance:0},Mn={scope:"number",begin:$e,relevance:0},In={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[me,{begin:/\[/,end:/\]/,relevance:0,contains:[me]}]},On={scope:"title",begin:te,relevance:0},Ln={scope:"title",begin:Ee,relevance:0},Pn={begin:"\\.\\s*"+Ee,relevance:0};var Fe=Object.freeze({__proto__:null,APOS_STRING_MODE:it,BACKSLASH_ESCAPE:me,BINARY_NUMBER_MODE:Mn,BINARY_NUMBER_RE:$e,COMMENT:j,C_BLOCK_COMMENT_MODE:be,C_LINE_COMMENT_MODE:he,C_NUMBER_MODE:ze,C_NUMBER_RE:De,END_SAME_AS_BEGIN:function(a){return Object.assign(a,{"on:begin":(u,p)=>{p.data._beginMatch=u[1]},"on:end":(u,p)=>{p.data._beginMatch!==u[1]&&p.ignoreMatch()}})},HASH_COMMENT_MODE:ve,IDENT_RE:te,MATCH_NOTHING_RE:V,METHOD_GUARD:Pn,NUMBER_MODE:Ae,NUMBER_RE:Be,PHRASAL_WORDS_MODE:at,QUOTE_STRING_MODE:He,REGEXP_MODE:In,RE_STARTERS_RE:rt,SHEBANG:st,TITLE_MODE:On,UNDERSCORE_IDENT_RE:Ee,UNDERSCORE_TITLE_MODE:Ln});function Bn(a,u){a.input[a.index-1]==="."&&u.ignoreMatch()}function Dn(a,u){a.className!==void 0&&(a.scope=a.className,delete a.className)}function $n(a,u){u&&a.beginKeywords&&(a.begin="\\b("+a.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",a.__beforeBegin=Bn,a.keywords=a.keywords||a.beginKeywords,delete a.beginKeywords,a.relevance===void 0&&(a.relevance=0))}function Hn(a,u){Array.isArray(a.illegal)&&(a.illegal=F(...a.illegal))}function zn(a,u){if(a.match){if(a.begin||a.end)throw new Error("begin & end are not supported with match");a.begin=a.match,delete a.match}}function Fn(a,u){a.relevance===void 0&&(a.relevance=1)}const Un=(a,u)=>{if(!a.beforeMatch)return;if(a.starts)throw new Error("beforeMatch cannot be used with starts");const p=Object.assign({},a);Object.keys(a).forEach(_=>{delete a[_]}),a.keywords=p.keywords,a.begin=E(p.beforeMatch,b(p.begin)),a.starts={relevance:0,contains:[Object.assign(p,{endsParent:!0})]},a.relevance=0,delete p.beforeMatch},Xn=["of","and","for","in","not","or","if","then","parent","list","value"],Gn="keyword";function It(a,u,p=Gn){const _=Object.create(null);return typeof a=="string"?H(p,a.split(" ")):Array.isArray(a)?H(p,a):Object.keys(a).forEach(function(z){Object.assign(_,It(a[z],u,z))}),_;function H(z,x){u&&(x=x.map(g=>g.toLowerCase())),x.forEach(function(g){const v=g.split("|");_[v[0]]=[z,jn(v[0],v[1])]})}}function jn(a,u){return u?Number(u):Zn(a)?0:1}function Zn(a){return Xn.includes(a.toLowerCase())}const Ot={},xe=a=>{console.error(a)},Lt=(a,...u)=>{console.log(`WARN: ${a}`,...u)},_e=(a,u)=>{Ot[`${a}/${u}`]||(console.log(`Deprecated as of ${a}. ${u}`),Ot[`${a}/${u}`]=!0)},Ue=new Error;function Pt(a,u,{key:p}){let _=0;const H=a[p],z={},x={};for(let g=1;g<=u.length;g++)x[g+_]=H[g],z[g+_]=!0,_+=L(u[g-1]);a[p]=x,a[p]._emit=z,a[p]._multi=!0}function qn(a){if(Array.isArray(a.begin)){if(a.skip||a.excludeBegin||a.returnBegin)throw xe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Ue;if(typeof a.beginScope!="object"||a.beginScope===null)throw xe("beginScope must be object"),Ue;Pt(a,a.begin,{key:"beginScope"}),a.begin=J(a.begin,{joinWith:""})}}function Wn(a){if(Array.isArray(a.end)){if(a.skip||a.excludeEnd||a.returnEnd)throw xe("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Ue;if(typeof a.endScope!="object"||a.endScope===null)throw xe("endScope must be object"),Ue;Pt(a,a.end,{key:"endScope"}),a.end=J(a.end,{joinWith:""})}}function Kn(a){a.scope&&typeof a.scope=="object"&&a.scope!==null&&(a.beginScope=a.scope,delete a.scope)}function Jn(a){Kn(a),typeof a.beginScope=="string"&&(a.beginScope={_wrap:a.beginScope}),typeof a.endScope=="string"&&(a.endScope={_wrap:a.endScope}),qn(a),Wn(a)}function Qn(a){function u(x,g){return new RegExp(w(x),"m"+(a.case_insensitive?"i":"")+(a.unicodeRegex?"u":"")+(g?"g":""))}class p{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(g,v){v.position=this.position++,this.matchIndexes[this.matchAt]=v,this.regexes.push([v,g]),this.matchAt+=L(g)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const g=this.regexes.map(v=>v[1]);this.matcherRe=u(J(g,{joinWith:"|"}),!0),this.lastIndex=0}exec(g){this.matcherRe.lastIndex=this.lastIndex;const v=this.matcherRe.exec(g);if(!v)return null;const G=v.findIndex((Ce,lt)=>lt>0&&Ce!==void 0),U=this.matchIndexes[G];return v.splice(0,G),Object.assign(v,U)}}class _{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(g){if(this.multiRegexes[g])return this.multiRegexes[g];const v=new p;return this.rules.slice(g).forEach(([G,U])=>v.addRule(G,U)),v.compile(),this.multiRegexes[g]=v,v}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(g,v){this.rules.push([g,v]),v.type==="begin"&&this.count++}exec(g){const v=this.getMatcher(this.regexIndex);v.lastIndex=this.lastIndex;let G=v.exec(g);if(this.resumingScanAtSamePosition()&&!(G&&G.index===this.lastIndex)){const U=this.getMatcher(0);U.lastIndex=this.lastIndex+1,G=U.exec(g)}return G&&(this.regexIndex+=G.position+1,this.regexIndex===this.count&&this.considerAll()),G}}function H(x){const g=new _;return x.contains.forEach(v=>g.addRule(v.begin,{rule:v,type:"begin"})),x.terminatorEnd&&g.addRule(x.terminatorEnd,{type:"end"}),x.illegal&&g.addRule(x.illegal,{type:"illegal"}),g}function z(x,g){const v=x;if(x.isCompiled)return v;[Dn,zn,Jn,Un].forEach(U=>U(x,g)),a.compilerExtensions.forEach(U=>U(x,g)),x.__beforeBegin=null,[$n,Hn,Fn].forEach(U=>U(x,g)),x.isCompiled=!0;let G=null;return typeof x.keywords=="object"&&x.keywords.$pattern&&(x.keywords=Object.assign({},x.keywords),G=x.keywords.$pattern,delete x.keywords.$pattern),G=G||/\w+/,x.keywords&&(x.keywords=It(x.keywords,a.case_insensitive)),v.keywordPatternRe=u(G,!0),g&&(x.begin||(x.begin=/\B|\b/),v.beginRe=u(v.begin),!x.end&&!x.endsWithParent&&(x.end=/\B|\b/),x.end&&(v.endRe=u(v.end)),v.terminatorEnd=w(v.end)||"",x.endsWithParent&&g.terminatorEnd&&(v.terminatorEnd+=(x.end?"|":"")+g.terminatorEnd)),x.illegal&&(v.illegalRe=u(x.illegal)),x.contains||(x.contains=[]),x.contains=[].concat(...x.contains.map(function(U){return Yn(U==="self"?x:U)})),x.contains.forEach(function(U){z(U,v)}),x.starts&&z(x.starts,g),v.matcher=H(v),v}if(a.compilerExtensions||(a.compilerExtensions=[]),a.contains&&a.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return a.classNameAliases=s(a.classNameAliases||{}),z(a)}function Bt(a){return a?a.endsWithParent||Bt(a.starts):!1}function Yn(a){return a.variants&&!a.cachedVariants&&(a.cachedVariants=a.variants.map(function(u){return s(a,{variants:null},u)})),a.cachedVariants?a.cachedVariants:Bt(a)?s(a,{starts:a.starts?s(a.starts):null}):Object.isFrozen(a)?s(a):a}var Vn="11.11.1";class er extends Error{constructor(u,p){super(u),this.name="HTMLInjectionError",this.html=p}}const ot=n,Dt=s,$t=Symbol("nomatch"),tr=7,Ht=function(a){const u=Object.create(null),p=Object.create(null),_=[];let H=!0;const z="Could not find the language '{}', did you forget to load/include a language module?",x={disableAutodetect:!0,name:"Plain text",contains:[]};let g={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:m};function v(h){return g.noHighlightRe.test(h)}function G(h){let k=h.className+" ";k+=h.parentNode?h.parentNode.className:"";const N=g.languageDetectRe.exec(k);if(N){const P=pe(N[1]);return P||(Lt(z.replace("{}",N[1])),Lt("Falling back to no-highlight mode for this block.",h)),P?N[1]:"no-highlight"}return k.split(/\s+/).find(P=>v(P)||pe(P))}function U(h,k,N){let P="",X="";typeof k=="object"?(P=h,N=k.ignoreIllegals,X=k.language):(_e("10.7.0","highlight(lang, code, ...args) has been deprecated."),_e("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),X=h,P=k),N===void 0&&(N=!0);const ee={code:P,language:X};Ge("before:highlight",ee);const fe=ee.result?ee.result:Ce(ee.language,ee.code,N);return fe.code=ee.code,Ge("after:highlight",fe),fe}function Ce(h,k,N,P){const X=Object.create(null);function ee(f,y){return f.keywords[y]}function fe(){if(!T.keywords){Z.addText(B);return}let f=0;T.keywordPatternRe.lastIndex=0;let y=T.keywordPatternRe.exec(B),A="";for(;y;){A+=B.substring(f,y.index);const I=re.case_insensitive?y[0].toLowerCase():y[0],q=ee(T,I);if(q){const[ae,xr]=q;if(Z.addText(A),A="",X[I]=(X[I]||0)+1,X[I]<=tr&&(qe+=xr),ae.startsWith("_"))A+=y[0];else{const yr=re.classNameAliases[ae]||ae;ne(y[0],yr)}}else A+=y[0];f=T.keywordPatternRe.lastIndex,y=T.keywordPatternRe.exec(B)}A+=B.substring(f),Z.addText(A)}function je(){if(B==="")return;let f=null;if(typeof T.subLanguage=="string"){if(!u[T.subLanguage]){Z.addText(B);return}f=Ce(T.subLanguage,B,!0,qt[T.subLanguage]),qt[T.subLanguage]=f._top}else f=ct(B,T.subLanguage.length?T.subLanguage:null);T.relevance>0&&(qe+=f.relevance),Z.__addSublanguage(f._emitter,f.language)}function Q(){T.subLanguage!=null?je():fe(),B=""}function ne(f,y){f!==""&&(Z.startScope(y),Z.addText(f),Z.endScope())}function Xt(f,y){let A=1;const I=y.length-1;for(;A<=I;){if(!f._emit[A]){A++;continue}const q=re.classNameAliases[f[A]]||f[A],ae=y[A];q?ne(ae,q):(B=ae,fe(),B=""),A++}}function Gt(f,y){return f.scope&&typeof f.scope=="string"&&Z.openNode(re.classNameAliases[f.scope]||f.scope),f.beginScope&&(f.beginScope._wrap?(ne(B,re.classNameAliases[f.beginScope._wrap]||f.beginScope._wrap),B=""):f.beginScope._multi&&(Xt(f.beginScope,y),B="")),T=Object.create(f,{parent:{value:T}}),T}function jt(f,y,A){let I=Y(f.endRe,A);if(I){if(f["on:end"]){const q=new e(f);f["on:end"](y,q),q.isMatchIgnored&&(I=!1)}if(I){for(;f.endsParent&&f.parent;)f=f.parent;return f}}if(f.endsWithParent)return jt(f.parent,y,A)}function pr(f){return T.matcher.regexIndex===0?(B+=f[0],1):(pt=!0,0)}function fr(f){const y=f[0],A=f.rule,I=new e(A),q=[A.__beforeBegin,A["on:begin"]];for(const ae of q)if(ae&&(ae(f,I),I.isMatchIgnored))return pr(y);return A.skip?B+=y:(A.excludeBegin&&(B+=y),Q(),!A.returnBegin&&!A.excludeBegin&&(B=y)),Gt(A,f),A.returnBegin?0:y.length}function gr(f){const y=f[0],A=k.substring(f.index),I=jt(T,f,A);if(!I)return $t;const q=T;T.endScope&&T.endScope._wrap?(Q(),ne(y,T.endScope._wrap)):T.endScope&&T.endScope._multi?(Q(),Xt(T.endScope,f)):q.skip?B+=y:(q.returnEnd||q.excludeEnd||(B+=y),Q(),q.excludeEnd&&(B=y));do T.scope&&Z.closeNode(),!T.skip&&!T.subLanguage&&(qe+=T.relevance),T=T.parent;while(T!==I.parent);return I.starts&&Gt(I.starts,f),q.returnEnd?0:y.length}function mr(){const f=[];for(let y=T;y!==re;y=y.parent)y.scope&&f.unshift(y.scope);f.forEach(y=>Z.openNode(y))}let Ze={};function Zt(f,y){const A=y&&y[0];if(B+=f,A==null)return Q(),0;if(Ze.type==="begin"&&y.type==="end"&&Ze.index===y.index&&A===""){if(B+=k.slice(y.index,y.index+1),!H){const I=new Error(`0 width match regex (${h})`);throw I.languageName=h,I.badRule=Ze.rule,I}return 1}if(Ze=y,y.type==="begin")return fr(y);if(y.type==="illegal"&&!N){const I=new Error('Illegal lexeme "'+A+'" for mode "'+(T.scope||"<unnamed>")+'"');throw I.mode=T,I}else if(y.type==="end"){const I=gr(y);if(I!==$t)return I}if(y.type==="illegal"&&A==="")return B+=`
`,1;if(ht>1e5&&ht>y.index*3)throw new Error("potential infinite loop, way more iterations than matches");return B+=A,A.length}const re=pe(h);if(!re)throw xe(z.replace("{}",h)),new Error('Unknown language: "'+h+'"');const br=Qn(re);let dt="",T=P||br;const qt={},Z=new g.__emitter(g);mr();let B="",qe=0,ye=0,ht=0,pt=!1;try{if(re.__emitTokens)re.__emitTokens(k,Z);else{for(T.matcher.considerAll();;){ht++,pt?pt=!1:T.matcher.considerAll(),T.matcher.lastIndex=ye;const f=T.matcher.exec(k);if(!f)break;const y=k.substring(ye,f.index),A=Zt(y,f);ye=f.index+A}Zt(k.substring(ye))}return Z.finalize(),dt=Z.toHTML(),{language:h,value:dt,relevance:qe,illegal:!1,_emitter:Z,_top:T}}catch(f){if(f.message&&f.message.includes("Illegal"))return{language:h,value:ot(k),illegal:!0,relevance:0,_illegalBy:{message:f.message,index:ye,context:k.slice(ye-100,ye+100),mode:f.mode,resultSoFar:dt},_emitter:Z};if(H)return{language:h,value:ot(k),illegal:!1,relevance:0,errorRaised:f,_emitter:Z,_top:T};throw f}}function lt(h){const k={value:ot(h),illegal:!1,relevance:0,_top:x,_emitter:new g.__emitter(g)};return k._emitter.addText(h),k}function ct(h,k){k=k||g.languages||Object.keys(u);const N=lt(h),P=k.filter(pe).filter(Ut).map(Q=>Ce(Q,h,!1));P.unshift(N);const X=P.sort((Q,ne)=>{if(Q.relevance!==ne.relevance)return ne.relevance-Q.relevance;if(Q.language&&ne.language){if(pe(Q.language).supersetOf===ne.language)return 1;if(pe(ne.language).supersetOf===Q.language)return-1}return 0}),[ee,fe]=X,je=ee;return je.secondBest=fe,je}function nr(h,k,N){const P=k&&p[k]||N;h.classList.add("hljs"),h.classList.add(`language-${P}`)}function ut(h){let k=null;const N=G(h);if(v(N))return;if(Ge("before:highlightElement",{el:h,language:N}),h.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",h);return}if(h.children.length>0&&(g.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(h)),g.throwUnescapedHTML))throw new er("One of your code blocks includes unescaped HTML.",h.innerHTML);k=h;const P=k.textContent,X=N?U(P,{language:N,ignoreIllegals:!0}):ct(P);h.innerHTML=X.value,h.dataset.highlighted="yes",nr(h,N,X.language),h.result={language:X.language,re:X.relevance,relevance:X.relevance},X.secondBest&&(h.secondBest={language:X.secondBest.language,relevance:X.secondBest.relevance}),Ge("after:highlightElement",{el:h,result:X,text:P})}function rr(h){g=Dt(g,h)}const sr=()=>{Xe(),_e("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function ir(){Xe(),_e("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let zt=!1;function Xe(){function h(){Xe()}if(document.readyState==="loading"){zt||window.addEventListener("DOMContentLoaded",h,!1),zt=!0;return}document.querySelectorAll(g.cssSelector).forEach(ut)}function ar(h,k){let N=null;try{N=k(a)}catch(P){if(xe("Language definition for '{}' could not be registered.".replace("{}",h)),H)xe(P);else throw P;N=x}N.name||(N.name=h),u[h]=N,N.rawDefinition=k.bind(null,a),N.aliases&&Ft(N.aliases,{languageName:h})}function or(h){delete u[h];for(const k of Object.keys(p))p[k]===h&&delete p[k]}function lr(){return Object.keys(u)}function pe(h){return h=(h||"").toLowerCase(),u[h]||u[p[h]]}function Ft(h,{languageName:k}){typeof h=="string"&&(h=[h]),h.forEach(N=>{p[N.toLowerCase()]=k})}function Ut(h){const k=pe(h);return k&&!k.disableAutodetect}function cr(h){h["before:highlightBlock"]&&!h["before:highlightElement"]&&(h["before:highlightElement"]=k=>{h["before:highlightBlock"](Object.assign({block:k.el},k))}),h["after:highlightBlock"]&&!h["after:highlightElement"]&&(h["after:highlightElement"]=k=>{h["after:highlightBlock"](Object.assign({block:k.el},k))})}function ur(h){cr(h),_.push(h)}function dr(h){const k=_.indexOf(h);k!==-1&&_.splice(k,1)}function Ge(h,k){const N=h;_.forEach(function(P){P[N]&&P[N](k)})}function hr(h){return _e("10.7.0","highlightBlock will be removed entirely in v12.0"),_e("10.7.0","Please use highlightElement now."),ut(h)}Object.assign(a,{highlight:U,highlightAuto:ct,highlightAll:Xe,highlightElement:ut,highlightBlock:hr,configure:rr,initHighlighting:sr,initHighlightingOnLoad:ir,registerLanguage:ar,unregisterLanguage:or,listLanguages:lr,getLanguage:pe,registerAliases:Ft,autoDetection:Ut,inherit:Dt,addPlugin:ur,removePlugin:dr}),a.debugMode=function(){H=!1},a.safeMode=function(){H=!0},a.versionString=Vn,a.regex={concat:E,lookahead:b,either:F,optional:S,anyNumberOfTimes:C};for(const h in Fe)typeof Fe[h]=="object"&&t(Fe[h]);return Object.assign(a,Fe),a},Te=Ht({});return Te.newInstance=()=>Ht({}),ft=Te,Te.HighlightJS=Te,Te.default=Te,ft}var Ms=Ns();const Pe=Cs(Ms);function Is(t){const e=t.regex,n={},s={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:e.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},s]});const r={className:"subst",begin:/\$\(/,end:/\)/,contains:[t.BACKSLASH_ESCAPE]},i=t.inherit(t.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),o={begin:/<<-?\s*(?=\w+)/,starts:{contains:[t.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},l={className:"string",begin:/"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,n,r]};r.contains.push(l);const d={match:/\\"/},c={className:"string",begin:/'/,end:/'/},m={match:/\\'/},w={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},t.NUMBER_MODE,n]},b=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],C=t.SHEBANG({binary:`(${b.join("|")})`,relevance:10}),S={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[t.inherit(t.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},E=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],$=["true","false"],F={match:/(\/[a-z._-]+)+/},L=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],Y=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],W=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],J=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:E,literal:$,built_in:[...L,...Y,"set","shopt",...W,...J]},contains:[C,t.SHEBANG(),S,w,i,o,F,l,d,c,m,n]}}const et="[A-Za-z$_][0-9A-Za-z$_]*",En=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],vn=["true","false","null","undefined","NaN","Infinity"],_n=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Tn=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Rn=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],An=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],Cn=[].concat(Rn,_n,Tn);function Os(t){const e=t.regex,n=(j,{after:he})=>{const be="</"+j[0].slice(1);return j.input.indexOf(be,he)!==-1},s=et,r={begin:"<>",end:"</>"},i=/<[A-Za-z0-9\\._:-]+\s*\/>/,o={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(j,he)=>{const be=j[0].length+j.index,ve=j.input[be];if(ve==="<"||ve===","){he.ignoreMatch();return}ve===">"&&(n(j,{after:be})||he.ignoreMatch());let Ae;const ze=j.input.substring(be);if(Ae=ze.match(/^\s*=/)){he.ignoreMatch();return}if((Ae=ze.match(/^\s+extends\s+/))&&Ae.index===0){he.ignoreMatch();return}}},l={$pattern:et,keyword:En,literal:vn,built_in:Cn,"variable.language":An},d="[0-9](_?[0-9])*",c=`\\.(${d})`,m="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",w={className:"number",variants:[{begin:`(\\b(${m})((${c})|\\.)?|(${c}))[eE][+-]?(${d})\\b`},{begin:`\\b(${m})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},b={className:"subst",begin:"\\$\\{",end:"\\}",keywords:l,contains:[]},C={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,b],subLanguage:"xml"}},S={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,b],subLanguage:"css"}},E={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,b],subLanguage:"graphql"}},$={className:"string",begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,b]},L={className:"comment",variants:[t.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:s+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]},Y=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,C,S,E,$,{match:/\$\d+/},w];b.contains=Y.concat({begin:/\{/,end:/\}/,keywords:l,contains:["self"].concat(Y)});const W=[].concat(L,b.contains),J=W.concat([{begin:/(\s*)\(/,end:/\)/,keywords:l,contains:["self"].concat(W)}]),V={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:l,contains:J},te={variants:[{match:[/class/,/\s+/,s,/\s+/,/extends/,/\s+/,e.concat(s,"(",e.concat(/\./,s),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,s],scope:{1:"keyword",3:"title.class"}}]},Ee={relevance:0,match:e.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[..._n,...Tn]}},Be={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},De={variants:[{match:[/function/,/\s+/,s,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[V],illegal:/%/},$e={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function rt(j){return e.concat("(?!",j.join("|"),")")}const st={match:e.concat(/\b/,rt([...Rn,"super","import"].map(j=>`${j}\\s*\\(`)),s,e.lookahead(/\s*\(/)),className:"title.function",relevance:0},me={begin:e.concat(/\./,e.lookahead(e.concat(s,/(?![0-9A-Za-z$_(])/))),end:s,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},it={match:[/get|set/,/\s+/,s,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},V]},He="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",at={match:[/const|var|let/,/\s+/,s,/\s*/,/=\s*/,/(async\s*)?/,e.lookahead(He)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[V]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:l,exports:{PARAMS_CONTAINS:J,CLASS_REFERENCE:Ee},illegal:/#(?![$_A-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",relevance:5}),Be,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,C,S,E,$,L,{match:/\$\d+/},w,Ee,{scope:"attr",match:s+e.lookahead(":"),relevance:0},at,{begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[L,t.REGEXP_MODE,{className:"function",begin:He,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:l,contains:J}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:r.begin,end:r.end},{match:i},{begin:o.begin,"on:begin":o.isTrulyOpeningTag,end:o.end}],subLanguage:"xml",contains:[{begin:o.begin,end:o.end,skip:!0,contains:["self"]}]}]},De,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[V,t.inherit(t.TITLE_MODE,{begin:s,className:"title.function"})]},{match:/\.\.\./,relevance:0},me,{match:"\\$"+s,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[V]},st,$e,te,it,{match:/\$[(.]/}]}}function Ls(t){const e=t.regex,n=Os(t),s=et,r=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],i={begin:[/namespace/,/\s+/,t.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},o={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:r},contains:[n.exports.CLASS_REFERENCE]},l={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},d=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],c={$pattern:et,keyword:En.concat(d),literal:vn,built_in:Cn.concat(r),"variable.language":An},m={className:"meta",begin:"@"+s},w=(E,$,F)=>{const L=E.contains.findIndex(Y=>Y.label===$);if(L===-1)throw new Error("can not find mode to replace");E.contains.splice(L,1,F)};Object.assign(n.keywords,c),n.exports.PARAMS_CONTAINS.push(m);const b=n.contains.find(E=>E.scope==="attr"),C=Object.assign({},b,{match:e.concat(s,e.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,b,C]),n.contains=n.contains.concat([m,i,o,C]),w(n,"shebang",t.SHEBANG()),w(n,"use_strict",l);const S=n.contains.find(E=>E.label==="func.def");return S.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}function Ps(t){const e=t.regex,n=e.concat(/[\p{L}_]/u,e.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),s=/[\p{L}0-9._:-]+/u,r={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},i={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},o=t.inherit(i,{begin:/\(/,end:/\)/}),l=t.inherit(t.APOS_STRING_MODE,{className:"string"}),d=t.inherit(t.QUOTE_STRING_MODE,{className:"string"}),c={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:s,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[r]},{begin:/'/,end:/'/,contains:[r]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[i,d,l,o,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[i,o,d,l]}]}]},t.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},r,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[d]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[c],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[c],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:e.concat(/</,e.lookahead(e.concat(n,e.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:c}]},{className:"tag",begin:e.concat(/<\//,e.lookahead(e.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}const St=ge("todo"),Bs=Oe(()=>{const t=St();if(typeof t=="string"||!t)return'<p class="border rounded-md p-2">Start editing to get a preview!</p>';const e=cn(t);return e instanceof Text?'<p class="border rounded-md p-2">Start editing to get a preview!</p>':(console.log("Preview HTML:",e.outerHTML),Nn(e),e.outerHTML)}),gt="editor_content";function Ds(){const t=s=>{s.preventDefault();const r=document.getSelection();if(!r||r.rangeCount===0)return;const i=r.getRangeAt(0);if(i.collapsed)return;const o=document.createElement("strong");try{i.surroundContents(o),r.removeAllRanges(),e()}catch{try{const d=i.extractContents();o.appendChild(d),i.insertNode(o),r.removeAllRanges(),e()}catch(d){console.warn("Could not apply bold formatting:",d)}}},e=()=>{const s=document.getElementById(gt);s&&St(ln(s))};return D("div",{class:"p-2 w-full flex flex-auto gap-4 flex-col",children:[D("div",{id:"article_editor",children:[D("div",{id:"edit_buttons",class:"p-2 flex gap-2",children:[R("span",{children:"Formatting:"}),R("button",{class:"p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700",onMouseDown:t,title:"Bold selected text",children:R("strong",{children:"B"})})]}),R("div",{class:"border-2 rounded-md p-2 bg-white text-black",children:R("div",{id:gt,class:"",children:R("article",{contenteditable:"true",onInput:s=>{e()},children:D("p",{children:["Edit me! Select some text and click the ",R("strong",{children:"B"})," button to make it bold."]})})})})]}),D("div",{children:[R("p",{class:"text-xl font-semibold",children:"Preview:"}),R("div",{class:"p-2 border-2 bg-white text-black",children:R("div",{innerHTML:Bs})})]}),D("div",{class:"p-2 bg-purple-950 rounded-md",children:[R("p",{class:"text-xl font-semibold",children:"JSON:"}),R("div",{class:"bg-black/20 p-2 border-2 border-gray-500 rounded-md",children:R("output",{class:"",name:"json_output",htmlFor:gt,children:R("pre",{class:"overflow-x-scroll",children:()=>JSON.stringify(St(),null,"  ")})})})]})]})}function Nn(t){t.removeAttribute("contenteditable");for(const e of t.children)Nn(e)}const $s=`import {
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
            onMouseDown={handleBoldClick}
            title="Bold selected text"
          >
            <strong>B</strong>
          </button>
        </div>
        <div class="border-2 rounded-md p-2 bg-white text-black">
          <div id={editor_content_id} class="">
            <article contenteditable="true" onInput={handleInput}>
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
          <output class="" name="json_output" htmlFor={editor_content_id}>
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
}`;Pe.registerLanguage("typescript",Ls);Pe.registerLanguage("html",Ps);Pe.registerLanguage("bash",Is);const Hs=Sn(As);function nn(t){document.title=t}function rn(t){const e=document.querySelector('meta[name="description"]');e&&e.setAttribute("content",t)}function zs(){const t=on(),e=Oe(()=>{const s=Ir("doc")()||"main";return un.find(i=>i.route_name==s)}),n=Oe(()=>{const s=e();return s?Sn(s.data):""});return de(()=>{const s=e();s?(nn(`${s.title} | HyperFX`),rn(`HyperFX docs about ${s.title}.`)):(nn("HyperFX"),rn("HyperFX docs"))}),de(()=>{t(),setTimeout(()=>{const s=document.querySelectorAll("pre code");for(const r of s)Pe.highlightElement(r)},0)}),D(an,{children:[R(Kt,{when:()=>e()!==void 0&&e().route_name!=="main",children:D("div",{class:"flex flex-auto",children:[R(jr,{}),R("article",{class:"p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl",children:R("div",{class:"markdown-body",innerHTML:n})})]})}),R(Kt,{when:()=>e()===void 0||e().route_name==="main",children:D("div",{class:"grow flex flex-col",children:[R("article",{class:"p-4 mx-auto w-full max-w-4xl",children:R("div",{class:"markdown-body-main",innerHTML:Hs})}),D("div",{class:"p-2 bg-red-950 text-white mt-4 mx-auto",children:[R("p",{class:"text-xl",children:"This is a work in progress!"}),R("p",{class:"text-xl",children:"The docs are not finished yet!"})]})]})})]})}function Fs(){const t=Ds(),e=R("pre",{class:"mx-auto max-w-[70vw]! max-h-[50vw]",children:R("code",{class:"language-tsx",children:$s})});return de(()=>{setTimeout(()=>{const n=document.querySelector("pre code");n&&n.attributes.getNamedItem("data-highlighted")?.value!="yes"&&Pe.highlightElement(n)},0)}),D("div",{class:"flex flex-col p-4 max-w-[80vw] mx-auto",children:[D("div",{class:"p-2",children:[D("p",{class:"mx-auto",children:["This is the code used to create the editor.",D("span",{class:"text-purple-500/80",children:[" ","(The editor is far from done but it is still cool IMO.)"]})]}),R("div",{class:"w-full",children:e})]}),t]})}function Us(){const t=Mr(),e=on();return de(()=>{e()==="/"&&t("/hyperfx")}),D("div",{class:"flex flex-auto flex-col min-h-screen",children:[R(Xr,{}),D("main",{class:"flex flex-auto flex-col",id:"main-content",children:[R("p",{class:"p-2 bg-red-800 text-white text-center w-full! max-w-full!",children:"A LOT OF CHANGES. DOCS ARE NOT UP TO DATE."}),R(Wt,{path:"/hyperfx/editor",component:Fs}),R(Wt,{path:"/hyperfx",component:zs,exact:!0})]}),D("footer",{class:"bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto",children:[R("a",{href:"https://github.com/ArnoudK/hyperfx",target:"_blank",class:"underline",children:"Github"}),D("span",{class:"w-full ",children:[" - © ",new Date().getFullYear()," Arnoud Kerkhof"]})]})]})}function Xs(){return R(Nr,{initialPath:"/hyperfx",children:()=>R(Us,{})})}const Gs=document.getElementById("app");Gs.replaceChildren(Xs());
