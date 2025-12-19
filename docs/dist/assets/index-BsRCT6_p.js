(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();let ie=!1;const ae=new Set;class br{constructor(e){this.subscribers=new Set,this._value=e}get(){return ie&&ae.add(this.callableSignal),this._value}set(e){return Object.is(this._value,e)||(this._value=e,this.subscribers.forEach(n=>{try{n(e)}catch(r){console.error("Signal subscriber error:",r)}})),e}subscribe(e){return this.subscribers.add(e),()=>{this.subscribers.delete(e)}}peek(){return this._value}update(e){return this.set(e(this._value))}get subscriberCount(){return this.subscribers.size}}function fe(t){const e=new br(t),n=Object.assign(r=>r!==void 0?e.set(r):e.get(),{get:()=>e.get(),set:r=>e.set(r),subscribe:r=>e.subscribe(r),peek:()=>e.peek(),update:r=>e.update(r),get subscriberCount(){return e.subscriberCount}});return e.callableSignal=n,n}function xr(t){const e=ie;ie=!0,ae.clear();let n;try{n=t()}finally{ie=e}const r=fe(n),i=Array.from(ae);ae.clear();const s=r.set;r.set=()=>{throw new Error("Cannot set computed signal directly. Computed signals are read-only.")};const a=i.map(l=>l.subscribe(()=>{const d=t();s(d)}));return r._unsubscribers=a,r}function yr(t){const e=ie;ie=!0,ae.clear();let n;n=t();const i=Array.from(ae).map(s=>s.subscribe(()=>{const a=ie;ie=!0,ae.clear(),typeof n=="function"&&n(),n=t(),ie=a,ae.clear()}));return ie=e,ae.clear(),()=>{i.forEach(s=>{s()}),typeof n=="function"&&n()}}function ge(t){return typeof t=="function"&&"subscribe"in t&&"get"in t&&"set"in t}let kr=0;function wr(){return typeof window>"u"||typeof document>"u"}function Er(){return String(++kr).padStart(6,"0")}const Sr=Symbol("HyperFX.Fragment");function vr(t,e){const n=document.createElement(t);if(wr()||n.setAttribute("data-hfxh",Er()),e){for(const[r,i]of Object.entries(e))if(r!=="children"&&r!=="key")if(r==="innerHTML"||r==="textContent"){const s=()=>{const a=ge(i)?i():i;n[r]=a};ge(i)&&i.subscribe(s),s()}else if(r.startsWith("on")&&typeof i=="function"){const s=r.slice(2).toLowerCase();n.addEventListener(s,i)}else if(ge(i)){const s=()=>{const a=i();a==null?r==="value"&&n instanceof HTMLInputElement?n.value="":r==="checked"&&n instanceof HTMLInputElement?n.checked=!1:n.removeAttribute(r):r==="value"&&n instanceof HTMLInputElement?n.value=String(a):r==="checked"&&n instanceof HTMLInputElement?n.checked=!!a:r==="disabled"&&typeof a=="boolean"?a?(n.setAttribute("disabled",""),n.disabled=!0):(n.removeAttribute("disabled"),n.disabled=!1):r==="class"||r==="className"?n.className=String(a):n.setAttribute(r,String(a))};s(),i.subscribe(s)}else i!=null&&(r==="value"&&n instanceof HTMLInputElement?n.value=String(i):r==="checked"&&n instanceof HTMLInputElement?n.checked=!!i:r==="disabled"&&typeof i=="boolean"?i?(n.setAttribute("disabled",""),n.disabled=!0):(n.removeAttribute("disabled"),n.disabled=!1):n.setAttribute(r,String(i)))}return n}function Tr(t){const e=document.createTextNode(""),n=()=>{let r="";ge(t)?r=String(t()):r=String(t),e.textContent=r};return n(),ge(t)&&t.subscribe(n),e}function Ke(t,e){if(!e)return;const n=Array.isArray(e)?e:[e];for(const r of n)if(!(r==null||r===!1||r===!0))if(ge(r)){const i=r();if(i instanceof Node)t.appendChild(i);else{const s=Tr(r);t.appendChild(s)}}else if(typeof r=="function")try{const i=r();if(i instanceof Node)t.appendChild(i);else if(Array.isArray(i))Ke(t,i);else{const s=document.createTextNode(String(i));t.appendChild(s)}}catch(i){console.warn("Error rendering function child:",i)}else if(typeof r=="object"&&r instanceof Node)t.appendChild(r);else{const i=document.createTextNode(String(r));t.appendChild(i)}}function _(t,e,n){if(t===Sr||t===nn){const i=e?.children,s=document.createDocumentFragment();return Ke(s,i),s}if(typeof t=="function")return t(e);const r=vr(t,e);return e?.children&&Ke(r,e.children),r}const B=_;function nn(t){const e=document.createDocumentFragment();return Ke(e,t.children),e}function Oe(t){return xr(t)}function ue(t){return yr(t)}const ke=fe(null);function _r(t){const e=fe(t.initialPath||window.location.pathname+window.location.search),n=fe([e()]),r=fe(0),i=()=>{const f=window.location.pathname+window.location.search||"/";e(f);const v=n();v[r()]=f,n(v)};ue(()=>(window.addEventListener("popstate",i),()=>window.removeEventListener("popstate",i))),ke({currentPath:e,navigate:(f,v={})=>{if(v.replace){window.history.replaceState({},"",f);const E=[...n()];E[r()]=f,n(E)}else{window.history.pushState({},"",f);const E=[...n().slice(0,r()+1),f];n(E),r(r()+1)}e(f)},back:()=>{if(r()>0){const f=r()-1;r(f);const v=n()[f]||"/";window.history.back(),e(v)}},forward:()=>{if(r()<n().length-1){const f=r()+1;r(f);const v=n()[f]||"/";window.history.forward(),e(v)}}});const u=document.createElement("div");u.className="router-container";let b;t.component?b=t.component({}):typeof t.children=="function"?b=t.children():b=t.children;const k=(f,v)=>{v==null||v===!1||(v instanceof Node?f.appendChild(v):Array.isArray(v)?v.forEach(E=>k(f,E)):f.appendChild(document.createTextNode(String(v))))};return k(u,b),u}function Zt(t){const e=document.createDocumentFragment(),n=document.createComment(`Route start: ${t.path}`),r=document.createComment(`Route end: ${t.path}`);e.appendChild(n),e.appendChild(r);let i=[];return ue(()=>{const a=ke();if(!a)return;const l=a.currentPath,d=l(),u=t.exact!==void 0&&t.exact?d===t.path:d.startsWith(t.path),k=n.parentNode||e;if(i.forEach(f=>{f.parentNode===k&&k.removeChild(f)}),i=[],u){let f;t.component?f=t.component({}):typeof t.children=="function"?f=t.children():f=t.children,f&&(Array.isArray(f)?f:[f]).forEach(E=>{if(E instanceof Node)k.insertBefore(E,r),i.push(E);else if(E!=null){const C=document.createTextNode(String(E));k.insertBefore(C,r),i.push(C)}})}}),e}function We(t){const e=document.createElement("a");e.href=t.to,e.className=t.class!==void 0?t.class:"";const n=r=>{r.preventDefault(),t.onClick&&t.onClick(r);const i=ke();i?i.navigate(t.to,{replace:t.replace!==void 0?t.replace:!1}):window.history.pushState({},"",t.to)};return e.addEventListener("click",n),ue(()=>{const r=ke();if(!r)return;const i=r.currentPath,s=i(),a=t.exact!==void 0&&t.exact?s===t.to:s.startsWith(t.to),l=t.activeClass!==void 0?t.activeClass:"active";a?e.classList.add(l):e.classList.remove(l)}),typeof t.children=="string"?e.textContent=t.children:Array.isArray(t.children)?t.children.forEach(r=>{e.appendChild(r)}):t.children&&e.appendChild(t.children),e}function rn(){const t=ke();return t?t.currentPath:fe(window.location.pathname)}function Rr(){return(t,e)=>{const n=ke();n?n.navigate(t,e):e?.replace?window.history.replaceState({},"",t):window.history.pushState({},"",t)}}function Ar(t){const e=ke();return Oe(()=>(e&&e.currentPath(),new URLSearchParams(window.location.search).get(t)))}function Cr(t){const e=document.createDocumentFragment(),n=document.createComment("For start"),r=document.createComment("For end");e.appendChild(n),e.appendChild(r);const i=Array.isArray(t.children)?t.children[0]:t.children;if(typeof i!="function")throw typeof i=="object"&&console.error("Received object:",i),new Error(`For component children must be a function that renders each item.
Expected (item, index) => JSXElement. Got ${typeof i}`);let s=[];const a=()=>{let l;Array.isArray(t.each)?l=t.each:ge(t.each)||typeof t.each=="function"?l=t.each():l=t.each;const d=n.parentNode;d?(s.forEach(u=>{u.parentNode&&u.parentNode.removeChild(u)}),s=[],l.length>0?l.forEach((u,b)=>{const k=i(u,()=>b);k&&(d.insertBefore(k,r),s.push(k))}):t.fallback&&(d.insertBefore(t.fallback,r),s.push(t.fallback))):(s.forEach(u=>{u.parentNode===e&&e.removeChild(u)}),s=[],l.length>0?l.forEach((u,b)=>{const k=i(u,()=>b);k&&(e.insertBefore(k,r),s.push(k))}):t.fallback&&(e.insertBefore(t.fallback,r),s.push(t.fallback)))};return ge(t.each)?ue(a):a(),e}function qt(t){const e=document.createDocumentFragment(),n=document.createComment("Show start"),r=document.createComment("Show end");e.appendChild(n),e.appendChild(r);let i=[];return ue(()=>{const a=typeof t.when=="function"?t.when():t.when,l=n.parentNode;let d=null;a?d=typeof t.children=="function"?t.children():t.children:t.fallback&&(d=typeof t.fallback=="function"?t.fallback():t.fallback);const u=l||e;i.forEach(b=>{b.parentNode===u&&u.removeChild(b)}),i=[],d&&(Array.isArray(d)?d:[d]).forEach(k=>{u.insertBefore(k,r),i.push(k)})}),e}function Nr(t){const e=t.tagName,n={},r=[],i=t.childNodes,s=t.attributes;for(const a of s){const l=a.name,d=a.value;n[l]=d}for(const a of i)r.push(sn(a));return{tag:e,attrs:n,children:r}}function sn(t){return t instanceof Text?t.textContent??"":Nr(t)}function on(t){if(typeof t=="string")return document.createTextNode(t);const e=document.createElement(t.tag);for(const r of t.children)e.appendChild(on(r));const n=Object.keys(t.attrs);for(const r of n)e.setAttribute(r,t.attrs[r]);return e}class Mr{constructor(){this.metrics={renderCount:0,lastRenderTime:0,averageRenderTime:0,totalRenderTime:0,componentCount:0},this.renderStartTime=0,this.enabled=!1}enable(){this.enabled=!0}disable(){this.enabled=!1}startRender(){this.enabled&&(this.renderStartTime=performance.now())}endRender(){if(!this.enabled||this.renderStartTime===0)return;const e=performance.now()-this.renderStartTime;this.metrics.renderCount++,this.metrics.lastRenderTime=e,this.metrics.totalRenderTime+=e,this.metrics.averageRenderTime=this.metrics.totalRenderTime/this.metrics.renderCount,"memory"in performance&&(this.metrics.memoryUsage=performance.memory.usedJSHeapSize),this.renderStartTime=0}incrementComponentCount(){this.enabled&&this.metrics.componentCount++}decrementComponentCount(){this.enabled&&(this.metrics.componentCount=Math.max(0,this.metrics.componentCount-1))}getMetrics(){return{...this.metrics}}reset(){this.metrics={renderCount:0,lastRenderTime:0,averageRenderTime:0,totalRenderTime:0,componentCount:0}}logMetrics(){console.group("🚀 HyperFX Performance Metrics"),console.log("Render Count:",this.metrics.renderCount),console.log("Last Render Time:",`${this.metrics.lastRenderTime.toFixed(2)}ms`),console.log("Average Render Time:",`${this.metrics.averageRenderTime.toFixed(2)}ms`),console.log("Total Render Time:",`${this.metrics.totalRenderTime.toFixed(2)}ms`),console.log("Active Components:",this.metrics.componentCount),this.metrics.memoryUsage&&console.log("Memory Usage:",`${(this.metrics.memoryUsage/1024/1024).toFixed(2)}MB`),console.groupEnd()}}const Or=new Mr,Ir=()=>typeof window<"u"&&window.__HYPERFX_DEV__;class Lr{constructor(){this.componentTree=null,this.componentMap=new Map,this.renderCounts=new Map,this.enabled=!1}enable(){this.enabled=!0,typeof window<"u"&&(window.__HYPERFX_DEVTOOLS__=this,this.createDevToolsUI())}disable(){this.enabled=!1,typeof window<"u"&&(delete window.__HYPERFX_DEVTOOLS__,this.removeDevToolsUI())}trackComponent(e,n,r,i,s){if(!this.enabled)return;const a=this.renderCounts.get(e)||0;this.renderCounts.set(e,a+1);const l={id:e,type:n,props:this.sanitizeProps(r),children:this.analyzeChildren(i),renderTime:s,updateCount:a+1};this.componentMap.set(e,l),this.updateComponentTree(),this.refreshDevToolsUI()}sanitizeProps(e){const n={};for(const[r,i]of Object.entries(e))if(typeof i=="function")n[r]="[Function]";else if(i instanceof HTMLElement)n[r]=`[HTMLElement: ${i.tagName}]`;else if(i&&typeof i=="object")try{JSON.stringify(i),n[r]=i}catch{n[r]="[Object]"}else n[r]=i;return n}analyzeChildren(e){const n=[];for(const r of e)r instanceof HTMLElement?n.push({id:`dom-${r.tagName.toLowerCase()}-${Date.now()}-${Math.random()}`,type:r.tagName.toLowerCase(),props:this.getElementAttributes(r),children:this.analyzeDOMChildren(r)}):r instanceof DocumentFragment?n.push({id:`fragment-${Date.now()}-${Math.random()}`,type:"DocumentFragment",props:{},children:this.analyzeDOMChildren(r)}):r instanceof Text&&n.push({id:`text-${Date.now()}-${Math.random()}`,type:"Text",props:{content:r.textContent},children:[]});return n}getElementAttributes(e){const n={};for(const r of e.attributes)n[r.name]=r.value;return n}analyzeDOMChildren(e){const n=[];for(const r of e.children)n.push(r);return this.analyzeChildren(n)}updateComponentTree(){const e=Array.from(this.componentMap.values()),n=new Set;e.forEach(i=>{i.children.forEach(s=>n.add(s.id))});const r=e.filter(i=>!n.has(i.id));this.componentTree={id:"root",type:"Application",props:{},children:r}}createDevToolsUI(){if(document.getElementById("hyperfx-devtools"))return;const e=document.createElement("div");e.id="hyperfx-devtools",e.style.cssText=`
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 300px;
      background: #1e1e1e;
      color: #fff;
      font-family: monospace;
      font-size: 12px;
      border-left: 1px solid #444;
      border-bottom: 1px solid #444;
      z-index: 10000;
      display: none;
      overflow: auto;
    `;const n=document.createElement("div");n.style.cssText=`
      background: #333;
      padding: 8px;
      border-bottom: 1px solid #444;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,n.innerHTML="<span>HyperFX DevTools</span>";const r=document.createElement("button");r.textContent="×",r.style.cssText=`
      background: none;
      border: none;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    `,r.onclick=()=>{e.style.display="none"},n.appendChild(r);const i=document.createElement("div");i.id="hyperfx-devtools-content",i.style.cssText=`
      padding: 10px;
    `,e.appendChild(n),e.appendChild(i),document.body.appendChild(e);const s=document.createElement("button");s.id="hyperfx-devtools-toggle",s.textContent="DevTools",s.style.cssText=`
      position: fixed;
      top: 10px;
      right: 410px;
      background: #1e1e1e;
      color: #fff;
      border: 1px solid #444;
      padding: 5px 10px;
      cursor: pointer;
      z-index: 10000;
      font-family: monospace;
      font-size: 12px;
    `,s.onclick=()=>{const a=e.style.display!=="none";e.style.display=a?"none":"block",s.style.right=a?"410px":"10px"},document.body.appendChild(s)}removeDevToolsUI(){const e=document.getElementById("hyperfx-devtools"),n=document.getElementById("hyperfx-devtools-toggle");e&&e.remove(),n&&n.remove()}refreshDevToolsUI(){const e=document.getElementById("hyperfx-devtools-content");if(!e||!this.componentTree)return;const n=Or.getMetrics();let r=`
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; color: #4CAF50;">Performance Metrics</h4>
        <pre style="margin: 0; font-size: 11px;">${JSON.stringify(n,null,2)}</pre>
      </div>
    `;r+=`
      <div>
        <h4 style="margin: 0 0 5px 0; color: #2196F3;">Component Tree</h4>
        <pre style="margin: 0; font-size: 11px;">${JSON.stringify(this.componentTree,null,2)}</pre>
      </div>
    `,e.innerHTML=r}getComponentInfo(e){return this.componentMap.get(e)||null}getAllComponents(){return Array.from(this.componentMap.values())}clearTracking(){this.componentMap.clear(),this.renderCounts.clear(),this.componentTree=null,this.refreshDevToolsUI()}}const Dr=new Lr;Ir()&&typeof window<"u"&&setTimeout(()=>{Dr.enable()},100);const Pr=`# The basics

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
`,$r=`# Routing & SPA

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
`,Br=`# Components

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
`,Hr=`# Get started with HyperFX

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
`,zr=`# State Management

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
`,Fr=`# Rendering

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
`,Ur=`# Server-Side Rendering (SSR)

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
`,Xr="/hyperfx?doc=",an=[{title:"Get Started",route_name:"get_started",data:Hr},{title:"HyperFX basics",route_name:"basics",data:Pr},{title:"State Management",route_name:"state-management",data:zr},{title:"Rendering & Control Flow",route_name:"render",data:Fr},{title:"HyperFX components",route_name:"components",data:Br},{title:"Single Page Application",route_name:"spa",data:$r},{title:"Server-Side Rendering",route_name:"ssr",data:Ur}];function Gr(){return B("nav",{class:"flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg",children:[_(We,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx",children:"Home"}),_(We,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx?doc=get_started",children:"Docs"}),_(We,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx/editor",children:"Example"})]})}const mt=fe(!1);function jr(){console.log(mt(!mt()))}function Zr(){const t=Oe(()=>`flex-col sm:flex gap-1 ${mt()?"flex":"hidden"}`);return B("aside",{class:"bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl",children:[_("div",{class:"flex items-center justify-between mb-6 sm:hidden",children:B("button",{class:"text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform",title:"Toggle Navigation",onclick:jr,children:[_("span",{class:"text-lg",children:"☰"}),_("span",{class:"sr-only",children:"Toggle Navigation"})]})}),B("nav",{class:t,children:[_("p",{class:"hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3",children:"Fundamentals"}),_(Cr,{each:an,children:e=>_(We,{class:"px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block",to:`${Xr}${e.route_name}`,children:e.title})})]})]})}function wt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ee=wt();function ln(t){Ee=t}var Me={exec:()=>null};function M(t,e=""){let n=typeof t=="string"?t:t.source;const r={replace:(i,s)=>{let a=typeof s=="string"?s:s.source;return a=a.replace(j.caret,"$1"),n=n.replace(i,a),r},getRegex:()=>new RegExp(n,e)};return r}var j={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},qr=/^(?:[ \t]*(?:\n|$))+/,Wr=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Jr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ie=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Kr=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Et=/(?:[*+-]|\d{1,9}[.)])/,cn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,un=M(cn).replace(/bull/g,Et).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Qr=M(cn).replace(/bull/g,Et).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),St=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Yr=/^[^\n]+/,vt=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Vr=M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",vt).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ei=M(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Et).getRegex(),tt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Tt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ti=M("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Tt).replace("tag",tt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),dn=M(St).replace("hr",Ie).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex(),ni=M(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",dn).getRegex(),_t={blockquote:ni,code:Wr,def:Vr,fences:Jr,heading:Kr,hr:Ie,html:ti,lheading:un,list:ei,newline:qr,paragraph:dn,table:Me,text:Yr},Wt=M("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ie).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex(),ri={..._t,lheading:Qr,table:Wt,paragraph:M(St).replace("hr",Ie).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Wt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex()},ii={..._t,html:M(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Tt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Me,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:M(St).replace("hr",Ie).replace("heading",` *#{1,6} *[^
]`).replace("lheading",un).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},si=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,oi=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,hn=/^( {2,}|\\)\n(?!\s*$)/,ai=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,nt=/[\p{P}\p{S}]/u,Rt=/[\s\p{P}\p{S}]/u,pn=/[^\s\p{P}\p{S}]/u,li=M(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Rt).getRegex(),fn=/(?!~)[\p{P}\p{S}]/u,ci=/(?!~)[\s\p{P}\p{S}]/u,ui=/(?:[^\s\p{P}\p{S}]|~)/u,di=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,gn=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,hi=M(gn,"u").replace(/punct/g,nt).getRegex(),pi=M(gn,"u").replace(/punct/g,fn).getRegex(),mn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",fi=M(mn,"gu").replace(/notPunctSpace/g,pn).replace(/punctSpace/g,Rt).replace(/punct/g,nt).getRegex(),gi=M(mn,"gu").replace(/notPunctSpace/g,ui).replace(/punctSpace/g,ci).replace(/punct/g,fn).getRegex(),mi=M("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,pn).replace(/punctSpace/g,Rt).replace(/punct/g,nt).getRegex(),bi=M(/\\(punct)/,"gu").replace(/punct/g,nt).getRegex(),xi=M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),yi=M(Tt).replace("(?:-->|$)","-->").getRegex(),ki=M("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",yi).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Qe=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,wi=M(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Qe).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),bn=M(/^!?\[(label)\]\[(ref)\]/).replace("label",Qe).replace("ref",vt).getRegex(),xn=M(/^!?\[(ref)\](?:\[\])?/).replace("ref",vt).getRegex(),Ei=M("reflink|nolink(?!\\()","g").replace("reflink",bn).replace("nolink",xn).getRegex(),At={_backpedal:Me,anyPunctuation:bi,autolink:xi,blockSkip:di,br:hn,code:oi,del:Me,emStrongLDelim:hi,emStrongRDelimAst:fi,emStrongRDelimUnd:mi,escape:si,link:wi,nolink:xn,punctuation:li,reflink:bn,reflinkSearch:Ei,tag:ki,text:ai,url:Me},Si={...At,link:M(/^!?\[(label)\]\((.*?)\)/).replace("label",Qe).getRegex(),reflink:M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Qe).getRegex()},bt={...At,emStrongRDelimAst:gi,emStrongLDelim:pi,url:M(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},vi={...bt,br:M(hn).replace("{2,}","*").getRegex(),text:M(bt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},qe={normal:_t,gfm:ri,pedantic:ii},Ce={normal:At,gfm:bt,breaks:vi,pedantic:Si},Ti={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Jt=t=>Ti[t];function re(t,e){if(e){if(j.escapeTest.test(t))return t.replace(j.escapeReplace,Jt)}else if(j.escapeTestNoEncode.test(t))return t.replace(j.escapeReplaceNoEncode,Jt);return t}function Kt(t){try{t=encodeURI(t).replace(j.percentDecode,"%")}catch{return null}return t}function Qt(t,e){const n=t.replace(j.findPipe,(s,a,l)=>{let d=!1,u=a;for(;--u>=0&&l[u]==="\\";)d=!d;return d?"|":" |"}),r=n.split(j.splitPipe);let i=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(j.slashPipe,"|");return r}function Ne(t,e,n){const r=t.length;if(r===0)return"";let i=0;for(;i<r&&t.charAt(r-i-1)===e;)i++;return t.slice(0,r-i)}function _i(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function Yt(t,e,n,r,i){const s=e.href,a=e.title||null,l=t[1].replace(i.other.outputLinkReplace,"$1");r.state.inLink=!0;const d={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:s,title:a,text:l,tokens:r.inlineTokens(l)};return r.state.inLink=!1,d}function Ri(t,e,n){const r=t.match(n.other.indentCodeCompensation);if(r===null)return e;const i=r[1];return e.split(`
`).map(s=>{const a=s.match(n.other.beginningSpace);if(a===null)return s;const[l]=a;return l.length>=i.length?s.slice(i.length):s}).join(`
`)}var Ye=class{options;rules;lexer;constructor(t){this.options=t||Ee}space(t){const e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){const e=this.rules.block.code.exec(t);if(e){const n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Ne(n,`
`)}}}fences(t){const e=this.rules.block.fences.exec(t);if(e){const n=e[0],r=Ri(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){const e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){const r=Ne(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){const e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Ne(e[0],`
`)}}blockquote(t){const e=this.rules.block.blockquote.exec(t);if(e){let n=Ne(e[0],`
`).split(`
`),r="",i="";const s=[];for(;n.length>0;){let a=!1;const l=[];let d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))l.push(n[d]),a=!0;else if(!a)l.push(n[d]);else break;n=n.slice(d);const u=l.join(`
`),b=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${u}`:u,i=i?`${i}
${b}`:b;const k=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(b,s,!0),this.lexer.state.top=k,n.length===0)break;const f=s.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){const v=f,E=v.raw+`
`+n.join(`
`),C=this.blockquote(E);s[s.length-1]=C,r=r.substring(0,r.length-v.raw.length)+C.raw,i=i.substring(0,i.length-v.text.length)+C.text;break}else if(f?.type==="list"){const v=f,E=v.raw+`
`+n.join(`
`),C=this.list(E);s[s.length-1]=C,r=r.substring(0,r.length-f.raw.length)+C.raw,i=i.substring(0,i.length-v.raw.length)+C.raw,n=E.substring(s.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:s,text:i}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim();const r=n.length>1,i={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");const s=this.rules.other.listItemRegex(n);let a=!1;for(;t;){let d=!1,u="",b="";if(!(e=s.exec(t))||this.rules.block.hr.test(t))break;u=e[0],t=t.substring(u.length);let k=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,W=>" ".repeat(3*W.length)),f=t.split(`
`,1)[0],v=!k.trim(),E=0;if(this.options.pedantic?(E=2,b=k.trimStart()):v?E=e[1].length+1:(E=e[2].search(this.rules.other.nonSpaceChar),E=E>4?1:E,b=k.slice(E),E+=e[1].length),v&&this.rules.other.blankLine.test(f)&&(u+=f+`
`,t=t.substring(f.length+1),d=!0),!d){const W=this.rules.other.nextBulletRegex(E),Z=this.rules.other.hrRegex(E),K=this.rules.other.fencesBeginRegex(E),se=this.rules.other.headingBeginRegex(E),Q=this.rules.other.htmlBeginRegex(E);for(;t;){const Y=t.split(`
`,1)[0];let ee;if(f=Y,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),ee=f):ee=f.replace(this.rules.other.tabCharGlobal,"    "),K.test(f)||se.test(f)||Q.test(f)||W.test(f)||Z.test(f))break;if(ee.search(this.rules.other.nonSpaceChar)>=E||!f.trim())b+=`
`+ee.slice(E);else{if(v||k.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||K.test(k)||se.test(k)||Z.test(k))break;b+=`
`+f}!v&&!f.trim()&&(v=!0),u+=Y+`
`,t=t.substring(Y.length+1),k=ee.slice(E)}}i.loose||(a?i.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(a=!0));let C=null,J;this.options.gfm&&(C=this.rules.other.listIsTask.exec(b),C&&(J=C[0]!=="[ ] ",b=b.replace(this.rules.other.listReplaceTask,""))),i.items.push({type:"list_item",raw:u,task:!!C,checked:J,loose:!1,text:b,tokens:[]}),i.raw+=u}const l=i.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let d=0;d<i.items.length;d++)if(this.lexer.state.top=!1,i.items[d].tokens=this.lexer.blockTokens(i.items[d].text,[]),!i.loose){const u=i.items[d].tokens.filter(k=>k.type==="space"),b=u.length>0&&u.some(k=>this.rules.other.anyLine.test(k.raw));i.loose=b}if(i.loose)for(let d=0;d<i.items.length;d++)i.items[d].loose=!0;return i}}html(t){const e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){const e=this.rules.block.def.exec(t);if(e){const n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:r,title:i}}}table(t){const e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const n=Qt(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===r.length){for(const a of r)this.rules.other.tableAlignRight.test(a)?s.align.push("right"):this.rules.other.tableAlignCenter.test(a)?s.align.push("center"):this.rules.other.tableAlignLeft.test(a)?s.align.push("left"):s.align.push(null);for(let a=0;a<n.length;a++)s.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:s.align[a]});for(const a of i)s.rows.push(Qt(a,s.header.length).map((l,d)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:s.align[d]})));return s}}lheading(t){const e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){const e=this.rules.block.paragraph.exec(t);if(e){const n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){const e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){const e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){const e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){const e=this.rules.inline.link.exec(t);if(e){const n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const s=Ne(n.slice(0,-1),"\\");if((n.length-s.length)%2===0)return}else{const s=_i(e[2],"()");if(s===-2)return;if(s>-1){const l=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,l).trim(),e[3]=""}}let r=e[2],i="";if(this.options.pedantic){const s=this.rules.other.pedanticHrefTitle.exec(r);s&&(r=s[1],i=s[3])}else i=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),Yt(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){const r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=e[r.toLowerCase()];if(!i){const s=n[0].charAt(0);return{type:"text",raw:s,text:s}}return Yt(n,i,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(r[1]||r[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const s=[...r[0]].length-1;let a,l,d=s,u=0;const b=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(b.lastIndex=0,e=e.slice(-1*t.length+s);(r=b.exec(e))!=null;){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a)continue;if(l=[...a].length,r[3]||r[4]){d+=l;continue}else if((r[5]||r[6])&&s%3&&!((s+l)%3)){u+=l;continue}if(d-=l,d>0)continue;l=Math.min(l,l+d+u);const k=[...r[0]][0].length,f=t.slice(0,s+r.index+k+l);if(Math.min(s,l)%2){const E=f.slice(1,-1);return{type:"em",raw:f,text:E,tokens:this.lexer.inlineTokens(E)}}const v=f.slice(2,-2);return{type:"strong",raw:f,text:v,tokens:this.lexer.inlineTokens(v)}}}}codespan(t){const e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," ");const r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){const e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){const e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){const e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let i;do i=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(i!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){const e=this.rules.inline.text.exec(t);if(e){const n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},le=class xt{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ee,this.options.tokenizer=this.options.tokenizer||new Ye,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={other:j,block:qe.normal,inline:Ce.normal};this.options.pedantic?(n.block=qe.pedantic,n.inline=Ce.pedantic):this.options.gfm&&(n.block=qe.gfm,this.options.breaks?n.inline=Ce.breaks:n.inline=Ce.gfm),this.tokenizer.rules=n}static get rules(){return{block:qe,inline:Ce}}static lex(e,n){return new xt(n).lex(e)}static lexInline(e,n){return new xt(n).inlineTokens(e)}lex(e){e=e.replace(j.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){const r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){for(this.options.pedantic&&(e=e.replace(j.tabCharGlobal,"    ").replace(j.spaceLine,""));e;){let i;if(this.options.extensions?.block?.some(a=>(i=a.call({lexer:this},e,n))?(e=e.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);const a=n.at(-1);i.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);const a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+i.raw,a.text+=`
`+i.text,this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);const a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+i.raw,a.text+=`
`+i.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title});continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),n.push(i);continue}let s=e;if(this.options.extensions?.startBlock){let a=1/0;const l=e.slice(1);let d;this.options.extensions.startBlock.forEach(u=>{d=u.call({lexer:this},l),typeof d=="number"&&d>=0&&(a=Math.min(a,d))}),a<1/0&&a>=0&&(s=e.substring(0,a+1))}if(this.state.top&&(i=this.tokenizer.paragraph(s))){const a=n.at(-1);r&&a?.type==="paragraph"?(a.raw+=`
`+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i),r=s.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);const a=n.at(-1);a?.type==="text"?(a.raw+=`
`+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(e){const a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let r=e,i=null;if(this.tokens.links){const l=Object.keys(this.tokens.links);if(l.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)l.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,i.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(i=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let s=!1,a="";for(;e;){s||(a=""),s=!1;let l;if(this.options.extensions?.inline?.some(u=>(l=u.call({lexer:this},e,n))?(e=e.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);const u=n.at(-1);l.type==="text"&&u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(e,r,a)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),n.push(l);continue}let d=e;if(this.options.extensions?.startInline){let u=1/0;const b=e.slice(1);let k;this.options.extensions.startInline.forEach(f=>{k=f.call({lexer:this},b),typeof k=="number"&&k>=0&&(u=Math.min(u,k))}),u<1/0&&u>=0&&(d=e.substring(0,u+1))}if(l=this.tokenizer.inlineText(d)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(a=l.raw.slice(-1)),s=!0;const u=n.at(-1);u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):n.push(l);continue}if(e){const u="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},Ve=class{options;parser;constructor(t){this.options=t||Ee}space(t){return""}code({text:t,lang:e,escaped:n}){const r=(e||"").match(j.notSpaceStart)?.[0],i=t.replace(j.endingNewline,"")+`
`;return r?'<pre><code class="language-'+re(r)+'">'+(n?i:re(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:re(i,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){const e=t.ordered,n=t.start;let r="";for(let a=0;a<t.items.length;a++){const l=t.items[a];r+=this.listitem(l)}const i=e?"ol":"ul",s=e&&n!==1?' start="'+n+'"':"";return"<"+i+s+`>
`+r+"</"+i+`>
`}listitem(t){let e="";if(t.task){const n=this.checkbox({checked:!!t.checked});t.loose?t.tokens[0]?.type==="paragraph"?(t.tokens[0].text=n+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=n+" "+re(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:!0}):e+=n+" "}return e+=this.parser.parse(t.tokens,!!t.loose),`<li>${e}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let i=0;i<t.header.length;i++)n+=this.tablecell(t.header[i]);e+=this.tablerow({text:n});let r="";for(let i=0;i<t.rows.length;i++){const s=t.rows[i];n="";for(let a=0;a<s.length;a++)n+=this.tablecell(s[a]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${re(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){const r=this.parser.parseInline(n),i=Kt(t);if(i===null)return r;t=i;let s='<a href="'+t+'"';return e&&(s+=' title="'+re(e)+'"'),s+=">"+r+"</a>",s}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));const i=Kt(t);if(i===null)return re(n);t=i;let s=`<img src="${t}" alt="${n}"`;return e&&(s+=` title="${re(e)}"`),s+=">",s}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:re(t.text)}},Ct=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},ce=class yt{options;renderer;textRenderer;constructor(e){this.options=e||Ee,this.options.renderer=this.options.renderer||new Ve,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ct}static parse(e,n){return new yt(n).parse(e)}static parseInline(e,n){return new yt(n).parseInline(e)}parse(e,n=!0){let r="";for(let i=0;i<e.length;i++){const s=e[i];if(this.options.extensions?.renderers?.[s.type]){const l=s,d=this.options.extensions.renderers[l.type].call({parser:this},l);if(d!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){r+=d||"";continue}}const a=s;switch(a.type){case"space":{r+=this.renderer.space(a);continue}case"hr":{r+=this.renderer.hr(a);continue}case"heading":{r+=this.renderer.heading(a);continue}case"code":{r+=this.renderer.code(a);continue}case"table":{r+=this.renderer.table(a);continue}case"blockquote":{r+=this.renderer.blockquote(a);continue}case"list":{r+=this.renderer.list(a);continue}case"html":{r+=this.renderer.html(a);continue}case"paragraph":{r+=this.renderer.paragraph(a);continue}case"text":{let l=a,d=this.renderer.text(l);for(;i+1<e.length&&e[i+1].type==="text";)l=e[++i],d+=`
`+this.renderer.text(l);n?r+=this.renderer.paragraph({type:"paragraph",raw:d,text:d,tokens:[{type:"text",raw:d,text:d,escaped:!0}]}):r+=d;continue}default:{const l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return r}parseInline(e,n=this.renderer){let r="";for(let i=0;i<e.length;i++){const s=e[i];if(this.options.extensions?.renderers?.[s.type]){const l=this.options.extensions.renderers[s.type].call({parser:this},s);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){r+=l||"";continue}}const a=s;switch(a.type){case"escape":{r+=n.text(a);break}case"html":{r+=n.html(a);break}case"link":{r+=n.link(a);break}case"image":{r+=n.image(a);break}case"strong":{r+=n.strong(a);break}case"em":{r+=n.em(a);break}case"codespan":{r+=n.codespan(a);break}case"br":{r+=n.br(a);break}case"del":{r+=n.del(a);break}case"text":{r+=n.text(a);break}default:{const l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return r}},Je=class{options;block;constructor(t){this.options=t||Ee}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?le.lex:le.lexInline}provideParser(){return this.block?ce.parse:ce.parseInline}},Ai=class{defaults=wt();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ce;Renderer=Ve;TextRenderer=Ct;Lexer=le;Tokenizer=Ye;Hooks=Je;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(const r of t)switch(n=n.concat(e.call(this,r)),r.type){case"table":{const i=r;for(const s of i.header)n=n.concat(this.walkTokens(s.tokens,e));for(const s of i.rows)for(const a of s)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{const i=r;n=n.concat(this.walkTokens(i.items,e));break}default:{const i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(s=>{const a=i[s].flat(1/0);n=n.concat(this.walkTokens(a,e))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,e)))}}return n}use(...t){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{const r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){const s=e.renderers[i.name];s?e.renderers[i.name]=function(...a){let l=i.renderer.apply(this,a);return l===!1&&(l=s.apply(this,a)),l}:e.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const s=e[i.level];s?s.unshift(i.tokenizer):e[i.level]=[i.tokenizer],i.start&&(i.level==="block"?e.startBlock?e.startBlock.push(i.start):e.startBlock=[i.start]:i.level==="inline"&&(e.startInline?e.startInline.push(i.start):e.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(e.childTokens[i.name]=i.childTokens)}),r.extensions=e),n.renderer){const i=this.defaults.renderer||new Ve(this.defaults);for(const s in n.renderer){if(!(s in i))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;const a=s,l=n.renderer[a],d=i[a];i[a]=(...u)=>{let b=l.apply(i,u);return b===!1&&(b=d.apply(i,u)),b||""}}r.renderer=i}if(n.tokenizer){const i=this.defaults.tokenizer||new Ye(this.defaults);for(const s in n.tokenizer){if(!(s in i))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;const a=s,l=n.tokenizer[a],d=i[a];i[a]=(...u)=>{let b=l.apply(i,u);return b===!1&&(b=d.apply(i,u)),b}}r.tokenizer=i}if(n.hooks){const i=this.defaults.hooks||new Je;for(const s in n.hooks){if(!(s in i))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;const a=s,l=n.hooks[a],d=i[a];Je.passThroughHooks.has(s)?i[a]=u=>{if(this.defaults.async)return Promise.resolve(l.call(i,u)).then(k=>d.call(i,k));const b=l.call(i,u);return d.call(i,b)}:i[a]=(...u)=>{let b=l.apply(i,u);return b===!1&&(b=d.apply(i,u)),b}}r.hooks=i}if(n.walkTokens){const i=this.defaults.walkTokens,s=n.walkTokens;r.walkTokens=function(a){let l=[];return l.push(s.call(this,a)),i&&(l=l.concat(i.call(this,a))),l}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return le.lex(t,e??this.defaults)}parser(t,e){return ce.parse(t,e??this.defaults)}parseMarkdown(t){return(n,r)=>{const i={...r},s={...this.defaults,...i},a=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&i.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));s.hooks&&(s.hooks.options=s,s.hooks.block=t);const l=s.hooks?s.hooks.provideLexer():t?le.lex:le.lexInline,d=s.hooks?s.hooks.provideParser():t?ce.parse:ce.parseInline;if(s.async)return Promise.resolve(s.hooks?s.hooks.preprocess(n):n).then(u=>l(u,s)).then(u=>s.hooks?s.hooks.processAllTokens(u):u).then(u=>s.walkTokens?Promise.all(this.walkTokens(u,s.walkTokens)).then(()=>u):u).then(u=>d(u,s)).then(u=>s.hooks?s.hooks.postprocess(u):u).catch(a);try{s.hooks&&(n=s.hooks.preprocess(n));let u=l(n,s);s.hooks&&(u=s.hooks.processAllTokens(u)),s.walkTokens&&this.walkTokens(u,s.walkTokens);let b=d(u,s);return s.hooks&&(b=s.hooks.postprocess(b)),b}catch(u){return a(u)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const r="<p>An error occurred:</p><pre>"+re(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},we=new Ai;function I(t,e){return we.parse(t,e)}I.options=I.setOptions=function(t){return we.setOptions(t),I.defaults=we.defaults,ln(I.defaults),I};I.getDefaults=wt;I.defaults=Ee;I.use=function(...t){return we.use(...t),I.defaults=we.defaults,ln(I.defaults),I};I.walkTokens=function(t,e){return we.walkTokens(t,e)};I.parseInline=we.parseInline;I.Parser=ce;I.parser=ce.parse;I.Renderer=Ve;I.TextRenderer=Ct;I.Lexer=le;I.lexer=le.lex;I.Tokenizer=Ye;I.Hooks=Je;I.parse=I;I.options;I.setOptions;I.use;I.walkTokens;I.parseInline;var yn=I;ce.parse;le.lex;const Ci=`# HyperFX

HyperFX (hypermedia functions) is a simple library for DOM manipulation by using functions.
Right now it's JSX based. And it is not production ready.   

## Use case

Absolutely none, it is just a fun project.
`;function Ni(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ft,Vt;function Mi(){if(Vt)return ft;Vt=1;function t(o){return o instanceof Map?o.clear=o.delete=o.set=function(){throw new Error("map is read-only")}:o instanceof Set&&(o.add=o.clear=o.delete=function(){throw new Error("set is read-only")}),Object.freeze(o),Object.getOwnPropertyNames(o).forEach(c=>{const p=o[c],T=typeof p;(T==="object"||T==="function")&&!Object.isFrozen(p)&&t(p)}),o}class e{constructor(c){c.data===void 0&&(c.data={}),this.data=c.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function r(o,...c){const p=Object.create(null);for(const T in o)p[T]=o[T];return c.forEach(function(T){for(const P in T)p[P]=T[P]}),p}const i="</span>",s=o=>!!o.scope,a=(o,{prefix:c})=>{if(o.startsWith("language:"))return o.replace("language:","language-");if(o.includes(".")){const p=o.split(".");return[`${c}${p.shift()}`,...p.map((T,P)=>`${T}${"_".repeat(P+1)}`)].join(" ")}return`${c}${o}`};class l{constructor(c,p){this.buffer="",this.classPrefix=p.classPrefix,c.walk(this)}addText(c){this.buffer+=n(c)}openNode(c){if(!s(c))return;const p=a(c.scope,{prefix:this.classPrefix});this.span(p)}closeNode(c){s(c)&&(this.buffer+=i)}value(){return this.buffer}span(c){this.buffer+=`<span class="${c}">`}}const d=(o={})=>{const c={children:[]};return Object.assign(c,o),c};class u{constructor(){this.rootNode=d(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(c){this.top.children.push(c)}openNode(c){const p=d({scope:c});this.add(p),this.stack.push(p)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(c){return this.constructor._walk(c,this.rootNode)}static _walk(c,p){return typeof p=="string"?c.addText(p):p.children&&(c.openNode(p),p.children.forEach(T=>this._walk(c,T)),c.closeNode(p)),c}static _collapse(c){typeof c!="string"&&c.children&&(c.children.every(p=>typeof p=="string")?c.children=[c.children.join("")]:c.children.forEach(p=>{u._collapse(p)}))}}class b extends u{constructor(c){super(),this.options=c}addText(c){c!==""&&this.add(c)}startScope(c){this.openNode(c)}endScope(){this.closeNode()}__addSublanguage(c,p){const T=c.root;p&&(T.scope=`language:${p}`),this.add(T)}toHTML(){return new l(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function k(o){return o?typeof o=="string"?o:o.source:null}function f(o){return C("(?=",o,")")}function v(o){return C("(?:",o,")*")}function E(o){return C("(?:",o,")?")}function C(...o){return o.map(p=>k(p)).join("")}function J(o){const c=o[o.length-1];return typeof c=="object"&&c.constructor===Object?(o.splice(o.length-1,1),c):{}}function W(...o){return"("+(J(o).capture?"":"?:")+o.map(T=>k(T)).join("|")+")"}function Z(o){return new RegExp(o.toString()+"|").exec("").length-1}function K(o,c){const p=o&&o.exec(c);return p&&p.index===0}const se=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function Q(o,{joinWith:c}){let p=0;return o.map(T=>{p+=1;const P=p;let $=k(T),x="";for(;$.length>0;){const m=se.exec($);if(!m){x+=$;break}x+=$.substring(0,m.index),$=$.substring(m.index+m[0].length),m[0][0]==="\\"&&m[1]?x+="\\"+String(Number(m[1])+P):(x+=m[0],m[0]==="("&&p++)}return x}).map(T=>`(${T})`).join(c)}const Y=/\b\B/,ee="[a-zA-Z]\\w*",Se="[a-zA-Z_]\\w*",De="\\b\\d+(\\.\\d+)?",Pe="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",$e="\\b(0b[01]+)",rt="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",it=(o={})=>{const c=/^#![ ]*\//;return o.binary&&(o.begin=C(c,/.*\b/,o.binary,/\b.*/)),r({scope:"meta",begin:c,end:/$/,relevance:0,"on:begin":(p,T)=>{p.index!==0&&T.ignoreMatch()}},o)},me={begin:"\\\\[\\s\\S]",relevance:0},st={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[me]},Be={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[me]},ot={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},U=function(o,c,p={}){const T=r({scope:"comment",begin:o,end:c,contains:[]},p);T.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const P=W("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return T.contains.push({begin:C(/[ ]+/,"(",P,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),T},de=U("//","$"),be=U("/\\*","\\*/"),ve=U("#","$"),Re={scope:"number",begin:De,relevance:0},He={scope:"number",begin:Pe,relevance:0},An={scope:"number",begin:$e,relevance:0},Cn={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[me,{begin:/\[/,end:/\]/,relevance:0,contains:[me]}]},Nn={scope:"title",begin:ee,relevance:0},Mn={scope:"title",begin:Se,relevance:0},On={begin:"\\.\\s*"+Se,relevance:0};var ze=Object.freeze({__proto__:null,APOS_STRING_MODE:st,BACKSLASH_ESCAPE:me,BINARY_NUMBER_MODE:An,BINARY_NUMBER_RE:$e,COMMENT:U,C_BLOCK_COMMENT_MODE:be,C_LINE_COMMENT_MODE:de,C_NUMBER_MODE:He,C_NUMBER_RE:Pe,END_SAME_AS_BEGIN:function(o){return Object.assign(o,{"on:begin":(c,p)=>{p.data._beginMatch=c[1]},"on:end":(c,p)=>{p.data._beginMatch!==c[1]&&p.ignoreMatch()}})},HASH_COMMENT_MODE:ve,IDENT_RE:ee,MATCH_NOTHING_RE:Y,METHOD_GUARD:On,NUMBER_MODE:Re,NUMBER_RE:De,PHRASAL_WORDS_MODE:ot,QUOTE_STRING_MODE:Be,REGEXP_MODE:Cn,RE_STARTERS_RE:rt,SHEBANG:it,TITLE_MODE:Nn,UNDERSCORE_IDENT_RE:Se,UNDERSCORE_TITLE_MODE:Mn});function In(o,c){o.input[o.index-1]==="."&&c.ignoreMatch()}function Ln(o,c){o.className!==void 0&&(o.scope=o.className,delete o.className)}function Dn(o,c){c&&o.beginKeywords&&(o.begin="\\b("+o.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",o.__beforeBegin=In,o.keywords=o.keywords||o.beginKeywords,delete o.beginKeywords,o.relevance===void 0&&(o.relevance=0))}function Pn(o,c){Array.isArray(o.illegal)&&(o.illegal=W(...o.illegal))}function $n(o,c){if(o.match){if(o.begin||o.end)throw new Error("begin & end are not supported with match");o.begin=o.match,delete o.match}}function Bn(o,c){o.relevance===void 0&&(o.relevance=1)}const Hn=(o,c)=>{if(!o.beforeMatch)return;if(o.starts)throw new Error("beforeMatch cannot be used with starts");const p=Object.assign({},o);Object.keys(o).forEach(T=>{delete o[T]}),o.keywords=p.keywords,o.begin=C(p.beforeMatch,f(p.begin)),o.starts={relevance:0,contains:[Object.assign(p,{endsParent:!0})]},o.relevance=0,delete p.beforeMatch},zn=["of","and","for","in","not","or","if","then","parent","list","value"],Fn="keyword";function Nt(o,c,p=Fn){const T=Object.create(null);return typeof o=="string"?P(p,o.split(" ")):Array.isArray(o)?P(p,o):Object.keys(o).forEach(function($){Object.assign(T,Nt(o[$],c,$))}),T;function P($,x){c&&(x=x.map(m=>m.toLowerCase())),x.forEach(function(m){const S=m.split("|");T[S[0]]=[$,Un(S[0],S[1])]})}}function Un(o,c){return c?Number(c):Xn(o)?0:1}function Xn(o){return zn.includes(o.toLowerCase())}const Mt={},xe=o=>{console.error(o)},Ot=(o,...c)=>{console.log(`WARN: ${o}`,...c)},Te=(o,c)=>{Mt[`${o}/${c}`]||(console.log(`Deprecated as of ${o}. ${c}`),Mt[`${o}/${c}`]=!0)},Fe=new Error;function It(o,c,{key:p}){let T=0;const P=o[p],$={},x={};for(let m=1;m<=c.length;m++)x[m+T]=P[m],$[m+T]=!0,T+=Z(c[m-1]);o[p]=x,o[p]._emit=$,o[p]._multi=!0}function Gn(o){if(Array.isArray(o.begin)){if(o.skip||o.excludeBegin||o.returnBegin)throw xe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Fe;if(typeof o.beginScope!="object"||o.beginScope===null)throw xe("beginScope must be object"),Fe;It(o,o.begin,{key:"beginScope"}),o.begin=Q(o.begin,{joinWith:""})}}function jn(o){if(Array.isArray(o.end)){if(o.skip||o.excludeEnd||o.returnEnd)throw xe("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Fe;if(typeof o.endScope!="object"||o.endScope===null)throw xe("endScope must be object"),Fe;It(o,o.end,{key:"endScope"}),o.end=Q(o.end,{joinWith:""})}}function Zn(o){o.scope&&typeof o.scope=="object"&&o.scope!==null&&(o.beginScope=o.scope,delete o.scope)}function qn(o){Zn(o),typeof o.beginScope=="string"&&(o.beginScope={_wrap:o.beginScope}),typeof o.endScope=="string"&&(o.endScope={_wrap:o.endScope}),Gn(o),jn(o)}function Wn(o){function c(x,m){return new RegExp(k(x),"m"+(o.case_insensitive?"i":"")+(o.unicodeRegex?"u":"")+(m?"g":""))}class p{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(m,S){S.position=this.position++,this.matchIndexes[this.matchAt]=S,this.regexes.push([S,m]),this.matchAt+=Z(m)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const m=this.regexes.map(S=>S[1]);this.matcherRe=c(Q(m,{joinWith:"|"}),!0),this.lastIndex=0}exec(m){this.matcherRe.lastIndex=this.lastIndex;const S=this.matcherRe.exec(m);if(!S)return null;const F=S.findIndex((Ae,lt)=>lt>0&&Ae!==void 0),H=this.matchIndexes[F];return S.splice(0,F),Object.assign(S,H)}}class T{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(m){if(this.multiRegexes[m])return this.multiRegexes[m];const S=new p;return this.rules.slice(m).forEach(([F,H])=>S.addRule(F,H)),S.compile(),this.multiRegexes[m]=S,S}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(m,S){this.rules.push([m,S]),S.type==="begin"&&this.count++}exec(m){const S=this.getMatcher(this.regexIndex);S.lastIndex=this.lastIndex;let F=S.exec(m);if(this.resumingScanAtSamePosition()&&!(F&&F.index===this.lastIndex)){const H=this.getMatcher(0);H.lastIndex=this.lastIndex+1,F=H.exec(m)}return F&&(this.regexIndex+=F.position+1,this.regexIndex===this.count&&this.considerAll()),F}}function P(x){const m=new T;return x.contains.forEach(S=>m.addRule(S.begin,{rule:S,type:"begin"})),x.terminatorEnd&&m.addRule(x.terminatorEnd,{type:"end"}),x.illegal&&m.addRule(x.illegal,{type:"illegal"}),m}function $(x,m){const S=x;if(x.isCompiled)return S;[Ln,$n,qn,Hn].forEach(H=>H(x,m)),o.compilerExtensions.forEach(H=>H(x,m)),x.__beforeBegin=null,[Dn,Pn,Bn].forEach(H=>H(x,m)),x.isCompiled=!0;let F=null;return typeof x.keywords=="object"&&x.keywords.$pattern&&(x.keywords=Object.assign({},x.keywords),F=x.keywords.$pattern,delete x.keywords.$pattern),F=F||/\w+/,x.keywords&&(x.keywords=Nt(x.keywords,o.case_insensitive)),S.keywordPatternRe=c(F,!0),m&&(x.begin||(x.begin=/\B|\b/),S.beginRe=c(S.begin),!x.end&&!x.endsWithParent&&(x.end=/\B|\b/),x.end&&(S.endRe=c(S.end)),S.terminatorEnd=k(S.end)||"",x.endsWithParent&&m.terminatorEnd&&(S.terminatorEnd+=(x.end?"|":"")+m.terminatorEnd)),x.illegal&&(S.illegalRe=c(x.illegal)),x.contains||(x.contains=[]),x.contains=[].concat(...x.contains.map(function(H){return Jn(H==="self"?x:H)})),x.contains.forEach(function(H){$(H,S)}),x.starts&&$(x.starts,m),S.matcher=P(S),S}if(o.compilerExtensions||(o.compilerExtensions=[]),o.contains&&o.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return o.classNameAliases=r(o.classNameAliases||{}),$(o)}function Lt(o){return o?o.endsWithParent||Lt(o.starts):!1}function Jn(o){return o.variants&&!o.cachedVariants&&(o.cachedVariants=o.variants.map(function(c){return r(o,{variants:null},c)})),o.cachedVariants?o.cachedVariants:Lt(o)?r(o,{starts:o.starts?r(o.starts):null}):Object.isFrozen(o)?r(o):o}var Kn="11.11.1";class Qn extends Error{constructor(c,p){super(c),this.name="HTMLInjectionError",this.html=p}}const at=n,Dt=r,Pt=Symbol("nomatch"),Yn=7,$t=function(o){const c=Object.create(null),p=Object.create(null),T=[];let P=!0;const $="Could not find the language '{}', did you forget to load/include a language module?",x={disableAutodetect:!0,name:"Plain text",contains:[]};let m={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:b};function S(h){return m.noHighlightRe.test(h)}function F(h){let w=h.className+" ";w+=h.parentNode?h.parentNode.className:"";const N=m.languageDetectRe.exec(w);if(N){const L=he(N[1]);return L||(Ot($.replace("{}",N[1])),Ot("Falling back to no-highlight mode for this block.",h)),L?N[1]:"no-highlight"}return w.split(/\s+/).find(L=>S(L)||he(L))}function H(h,w,N){let L="",z="";typeof w=="object"?(L=h,N=w.ignoreIllegals,z=w.language):(Te("10.7.0","highlight(lang, code, ...args) has been deprecated."),Te("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),z=h,L=w),N===void 0&&(N=!0);const V={code:L,language:z};Xe("before:highlight",V);const pe=V.result?V.result:Ae(V.language,V.code,N);return pe.code=V.code,Xe("after:highlight",pe),pe}function Ae(h,w,N,L){const z=Object.create(null);function V(g,y){return g.keywords[y]}function pe(){if(!R.keywords){X.addText(D);return}let g=0;R.keywordPatternRe.lastIndex=0;let y=R.keywordPatternRe.exec(D),A="";for(;y;){A+=D.substring(g,y.index);const O=ne.case_insensitive?y[0].toLowerCase():y[0],G=V(R,O);if(G){const[oe,gr]=G;if(X.addText(A),A="",z[O]=(z[O]||0)+1,z[O]<=Yn&&(Ze+=gr),oe.startsWith("_"))A+=y[0];else{const mr=ne.classNameAliases[oe]||oe;te(y[0],mr)}}else A+=y[0];g=R.keywordPatternRe.lastIndex,y=R.keywordPatternRe.exec(D)}A+=D.substring(g),X.addText(A)}function Ge(){if(D==="")return;let g=null;if(typeof R.subLanguage=="string"){if(!c[R.subLanguage]){X.addText(D);return}g=Ae(R.subLanguage,D,!0,jt[R.subLanguage]),jt[R.subLanguage]=g._top}else g=ct(D,R.subLanguage.length?R.subLanguage:null);R.relevance>0&&(Ze+=g.relevance),X.__addSublanguage(g._emitter,g.language)}function q(){R.subLanguage!=null?Ge():pe(),D=""}function te(g,y){g!==""&&(X.startScope(y),X.addText(g),X.endScope())}function Ft(g,y){let A=1;const O=y.length-1;for(;A<=O;){if(!g._emit[A]){A++;continue}const G=ne.classNameAliases[g[A]]||g[A],oe=y[A];G?te(oe,G):(D=oe,pe(),D=""),A++}}function Ut(g,y){return g.scope&&typeof g.scope=="string"&&X.openNode(ne.classNameAliases[g.scope]||g.scope),g.beginScope&&(g.beginScope._wrap?(te(D,ne.classNameAliases[g.beginScope._wrap]||g.beginScope._wrap),D=""):g.beginScope._multi&&(Ft(g.beginScope,y),D="")),R=Object.create(g,{parent:{value:R}}),R}function Xt(g,y,A){let O=K(g.endRe,A);if(O){if(g["on:end"]){const G=new e(g);g["on:end"](y,G),G.isMatchIgnored&&(O=!1)}if(O){for(;g.endsParent&&g.parent;)g=g.parent;return g}}if(g.endsWithParent)return Xt(g.parent,y,A)}function ur(g){return R.matcher.regexIndex===0?(D+=g[0],1):(pt=!0,0)}function dr(g){const y=g[0],A=g.rule,O=new e(A),G=[A.__beforeBegin,A["on:begin"]];for(const oe of G)if(oe&&(oe(g,O),O.isMatchIgnored))return ur(y);return A.skip?D+=y:(A.excludeBegin&&(D+=y),q(),!A.returnBegin&&!A.excludeBegin&&(D=y)),Ut(A,g),A.returnBegin?0:y.length}function hr(g){const y=g[0],A=w.substring(g.index),O=Xt(R,g,A);if(!O)return Pt;const G=R;R.endScope&&R.endScope._wrap?(q(),te(y,R.endScope._wrap)):R.endScope&&R.endScope._multi?(q(),Ft(R.endScope,g)):G.skip?D+=y:(G.returnEnd||G.excludeEnd||(D+=y),q(),G.excludeEnd&&(D=y));do R.scope&&X.closeNode(),!R.skip&&!R.subLanguage&&(Ze+=R.relevance),R=R.parent;while(R!==O.parent);return O.starts&&Ut(O.starts,g),G.returnEnd?0:y.length}function pr(){const g=[];for(let y=R;y!==ne;y=y.parent)y.scope&&g.unshift(y.scope);g.forEach(y=>X.openNode(y))}let je={};function Gt(g,y){const A=y&&y[0];if(D+=g,A==null)return q(),0;if(je.type==="begin"&&y.type==="end"&&je.index===y.index&&A===""){if(D+=w.slice(y.index,y.index+1),!P){const O=new Error(`0 width match regex (${h})`);throw O.languageName=h,O.badRule=je.rule,O}return 1}if(je=y,y.type==="begin")return dr(y);if(y.type==="illegal"&&!N){const O=new Error('Illegal lexeme "'+A+'" for mode "'+(R.scope||"<unnamed>")+'"');throw O.mode=R,O}else if(y.type==="end"){const O=hr(y);if(O!==Pt)return O}if(y.type==="illegal"&&A==="")return D+=`
`,1;if(ht>1e5&&ht>y.index*3)throw new Error("potential infinite loop, way more iterations than matches");return D+=A,A.length}const ne=he(h);if(!ne)throw xe($.replace("{}",h)),new Error('Unknown language: "'+h+'"');const fr=Wn(ne);let dt="",R=L||fr;const jt={},X=new m.__emitter(m);pr();let D="",Ze=0,ye=0,ht=0,pt=!1;try{if(ne.__emitTokens)ne.__emitTokens(w,X);else{for(R.matcher.considerAll();;){ht++,pt?pt=!1:R.matcher.considerAll(),R.matcher.lastIndex=ye;const g=R.matcher.exec(w);if(!g)break;const y=w.substring(ye,g.index),A=Gt(y,g);ye=g.index+A}Gt(w.substring(ye))}return X.finalize(),dt=X.toHTML(),{language:h,value:dt,relevance:Ze,illegal:!1,_emitter:X,_top:R}}catch(g){if(g.message&&g.message.includes("Illegal"))return{language:h,value:at(w),illegal:!0,relevance:0,_illegalBy:{message:g.message,index:ye,context:w.slice(ye-100,ye+100),mode:g.mode,resultSoFar:dt},_emitter:X};if(P)return{language:h,value:at(w),illegal:!1,relevance:0,errorRaised:g,_emitter:X,_top:R};throw g}}function lt(h){const w={value:at(h),illegal:!1,relevance:0,_top:x,_emitter:new m.__emitter(m)};return w._emitter.addText(h),w}function ct(h,w){w=w||m.languages||Object.keys(c);const N=lt(h),L=w.filter(he).filter(zt).map(q=>Ae(q,h,!1));L.unshift(N);const z=L.sort((q,te)=>{if(q.relevance!==te.relevance)return te.relevance-q.relevance;if(q.language&&te.language){if(he(q.language).supersetOf===te.language)return 1;if(he(te.language).supersetOf===q.language)return-1}return 0}),[V,pe]=z,Ge=V;return Ge.secondBest=pe,Ge}function Vn(h,w,N){const L=w&&p[w]||N;h.classList.add("hljs"),h.classList.add(`language-${L}`)}function ut(h){let w=null;const N=F(h);if(S(N))return;if(Xe("before:highlightElement",{el:h,language:N}),h.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",h);return}if(h.children.length>0&&(m.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(h)),m.throwUnescapedHTML))throw new Qn("One of your code blocks includes unescaped HTML.",h.innerHTML);w=h;const L=w.textContent,z=N?H(L,{language:N,ignoreIllegals:!0}):ct(L);h.innerHTML=z.value,h.dataset.highlighted="yes",Vn(h,N,z.language),h.result={language:z.language,re:z.relevance,relevance:z.relevance},z.secondBest&&(h.secondBest={language:z.secondBest.language,relevance:z.secondBest.relevance}),Xe("after:highlightElement",{el:h,result:z,text:L})}function er(h){m=Dt(m,h)}const tr=()=>{Ue(),Te("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function nr(){Ue(),Te("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Bt=!1;function Ue(){function h(){Ue()}if(document.readyState==="loading"){Bt||window.addEventListener("DOMContentLoaded",h,!1),Bt=!0;return}document.querySelectorAll(m.cssSelector).forEach(ut)}function rr(h,w){let N=null;try{N=w(o)}catch(L){if(xe("Language definition for '{}' could not be registered.".replace("{}",h)),P)xe(L);else throw L;N=x}N.name||(N.name=h),c[h]=N,N.rawDefinition=w.bind(null,o),N.aliases&&Ht(N.aliases,{languageName:h})}function ir(h){delete c[h];for(const w of Object.keys(p))p[w]===h&&delete p[w]}function sr(){return Object.keys(c)}function he(h){return h=(h||"").toLowerCase(),c[h]||c[p[h]]}function Ht(h,{languageName:w}){typeof h=="string"&&(h=[h]),h.forEach(N=>{p[N.toLowerCase()]=w})}function zt(h){const w=he(h);return w&&!w.disableAutodetect}function or(h){h["before:highlightBlock"]&&!h["before:highlightElement"]&&(h["before:highlightElement"]=w=>{h["before:highlightBlock"](Object.assign({block:w.el},w))}),h["after:highlightBlock"]&&!h["after:highlightElement"]&&(h["after:highlightElement"]=w=>{h["after:highlightBlock"](Object.assign({block:w.el},w))})}function ar(h){or(h),T.push(h)}function lr(h){const w=T.indexOf(h);w!==-1&&T.splice(w,1)}function Xe(h,w){const N=h;T.forEach(function(L){L[N]&&L[N](w)})}function cr(h){return Te("10.7.0","highlightBlock will be removed entirely in v12.0"),Te("10.7.0","Please use highlightElement now."),ut(h)}Object.assign(o,{highlight:H,highlightAuto:ct,highlightAll:Ue,highlightElement:ut,highlightBlock:cr,configure:er,initHighlighting:tr,initHighlightingOnLoad:nr,registerLanguage:rr,unregisterLanguage:ir,listLanguages:sr,getLanguage:he,registerAliases:Ht,autoDetection:zt,inherit:Dt,addPlugin:ar,removePlugin:lr}),o.debugMode=function(){P=!1},o.safeMode=function(){P=!0},o.versionString=Kn,o.regex={concat:C,lookahead:f,either:W,optional:E,anyNumberOfTimes:v};for(const h in ze)typeof ze[h]=="object"&&t(ze[h]);return Object.assign(o,ze),o},_e=$t({});return _e.newInstance=()=>$t({}),ft=_e,_e.HighlightJS=_e,_e.default=_e,ft}var Oi=Mi();const Le=Ni(Oi);function Ii(t){const e=t.regex,n={},r={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:e.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},r]});const i={className:"subst",begin:/\$\(/,end:/\)/,contains:[t.BACKSLASH_ESCAPE]},s=t.inherit(t.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),a={begin:/<<-?\s*(?=\w+)/,starts:{contains:[t.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},l={className:"string",begin:/"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,n,i]};i.contains.push(l);const d={match:/\\"/},u={className:"string",begin:/'/,end:/'/},b={match:/\\'/},k={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},t.NUMBER_MODE,n]},f=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],v=t.SHEBANG({binary:`(${f.join("|")})`,relevance:10}),E={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[t.inherit(t.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},C=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],J=["true","false"],W={match:/(\/[a-z._-]+)+/},Z=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],K=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],se=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],Q=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:C,literal:J,built_in:[...Z,...K,"set","shopt",...se,...Q]},contains:[v,t.SHEBANG(),E,k,s,a,W,l,d,u,b,n]}}const et="[A-Za-z$_][0-9A-Za-z$_]*",kn=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],wn=["true","false","null","undefined","NaN","Infinity"],En=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Sn=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],vn=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Tn=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],_n=[].concat(vn,En,Sn);function Li(t){const e=t.regex,n=(U,{after:de})=>{const be="</"+U[0].slice(1);return U.input.indexOf(be,de)!==-1},r=et,i={begin:"<>",end:"</>"},s=/<[A-Za-z0-9\\._:-]+\s*\/>/,a={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(U,de)=>{const be=U[0].length+U.index,ve=U.input[be];if(ve==="<"||ve===","){de.ignoreMatch();return}ve===">"&&(n(U,{after:be})||de.ignoreMatch());let Re;const He=U.input.substring(be);if(Re=He.match(/^\s*=/)){de.ignoreMatch();return}if((Re=He.match(/^\s+extends\s+/))&&Re.index===0){de.ignoreMatch();return}}},l={$pattern:et,keyword:kn,literal:wn,built_in:_n,"variable.language":Tn},d="[0-9](_?[0-9])*",u=`\\.(${d})`,b="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",k={className:"number",variants:[{begin:`(\\b(${b})((${u})|\\.)?|(${u}))[eE][+-]?(${d})\\b`},{begin:`\\b(${b})\\b((${u})\\b|\\.)?|(${u})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},f={className:"subst",begin:"\\$\\{",end:"\\}",keywords:l,contains:[]},v={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,f],subLanguage:"xml"}},E={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,f],subLanguage:"css"}},C={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,f],subLanguage:"graphql"}},J={className:"string",begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,f]},Z={className:"comment",variants:[t.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]},K=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,v,E,C,J,{match:/\$\d+/},k];f.contains=K.concat({begin:/\{/,end:/\}/,keywords:l,contains:["self"].concat(K)});const se=[].concat(Z,f.contains),Q=se.concat([{begin:/(\s*)\(/,end:/\)/,keywords:l,contains:["self"].concat(se)}]),Y={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:l,contains:Q},ee={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,e.concat(r,"(",e.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},Se={relevance:0,match:e.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...En,...Sn]}},De={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},Pe={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[Y],illegal:/%/},$e={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function rt(U){return e.concat("(?!",U.join("|"),")")}const it={match:e.concat(/\b/,rt([...vn,"super","import"].map(U=>`${U}\\s*\\(`)),r,e.lookahead(/\s*\(/)),className:"title.function",relevance:0},me={begin:e.concat(/\./,e.lookahead(e.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},st={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},Y]},Be="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",ot={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,e.lookahead(Be)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[Y]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:l,exports:{PARAMS_CONTAINS:Q,CLASS_REFERENCE:Se},illegal:/#(?![$_A-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",relevance:5}),De,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,v,E,C,J,Z,{match:/\$\d+/},k,Se,{scope:"attr",match:r+e.lookahead(":"),relevance:0},ot,{begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[Z,t.REGEXP_MODE,{className:"function",begin:Be,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:l,contains:Q}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:i.begin,end:i.end},{match:s},{begin:a.begin,"on:begin":a.isTrulyOpeningTag,end:a.end}],subLanguage:"xml",contains:[{begin:a.begin,end:a.end,skip:!0,contains:["self"]}]}]},Pe,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[Y,t.inherit(t.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},me,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[Y]},it,$e,ee,st,{match:/\$[(.]/}]}}function Di(t){const e=t.regex,n=Li(t),r=et,i=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],s={begin:[/namespace/,/\s+/,t.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},a={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:i},contains:[n.exports.CLASS_REFERENCE]},l={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},d=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],u={$pattern:et,keyword:kn.concat(d),literal:wn,built_in:_n.concat(i),"variable.language":Tn},b={className:"meta",begin:"@"+r},k=(C,J,W)=>{const Z=C.contains.findIndex(K=>K.label===J);if(Z===-1)throw new Error("can not find mode to replace");C.contains.splice(Z,1,W)};Object.assign(n.keywords,u),n.exports.PARAMS_CONTAINS.push(b);const f=n.contains.find(C=>C.scope==="attr"),v=Object.assign({},f,{match:e.concat(r,e.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,f,v]),n.contains=n.contains.concat([b,s,a,v]),k(n,"shebang",t.SHEBANG()),k(n,"use_strict",l);const E=n.contains.find(C=>C.label==="func.def");return E.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}function Pi(t){const e=t.regex,n=e.concat(/[\p{L}_]/u,e.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,i={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},s={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},a=t.inherit(s,{begin:/\(/,end:/\)/}),l=t.inherit(t.APOS_STRING_MODE,{className:"string"}),d=t.inherit(t.QUOTE_STRING_MODE,{className:"string"}),u={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[i]},{begin:/'/,end:/'/,contains:[i]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[s,d,l,a,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[s,a,d,l]}]}]},t.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},i,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[d]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[u],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[u],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:e.concat(/</,e.lookahead(e.concat(n,e.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:u}]},{className:"tag",begin:e.concat(/<\//,e.lookahead(e.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}const kt=fe("todo"),$i=Oe(()=>{const t=kt();if(typeof t=="string"||!t)return'<p class="border rounded-md p-2">Start editing to get a preview!</p>';const e=on(t);return e instanceof Text?'<p class="border rounded-md p-2">Start editing to get a preview!</p>':(console.log("Preview HTML:",e.outerHTML),Rn(e),e.outerHTML)}),gt="editor_content";function Bi(){const t=r=>{r.preventDefault();const i=document.getSelection();if(!i||i.rangeCount===0)return;const s=i.getRangeAt(0);if(s.collapsed)return;const a=document.createElement("strong");try{s.surroundContents(a),i.removeAllRanges(),e()}catch{try{const d=s.extractContents();a.appendChild(d),s.insertNode(a),i.removeAllRanges(),e()}catch(d){console.warn("Could not apply bold formatting:",d)}}},e=()=>{const r=document.getElementById(gt);r&&kt(sn(r))};return B("div",{class:"p-2 w-full flex flex-auto gap-4 flex-col",children:[B("div",{id:"article_editor",children:[B("div",{id:"edit_buttons",class:"p-2 flex gap-2",children:[_("span",{children:"Formatting:"}),_("button",{class:"p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700",onMouseDown:t,title:"Bold selected text",children:_("strong",{children:"B"})})]}),_("div",{class:"border-2 rounded-md p-2 bg-white text-black",children:_("div",{id:gt,class:"",children:_("article",{contenteditable:"true",onInput:r=>{e()},children:B("p",{children:["Edit me! Select some text and click the ",_("strong",{children:"B"})," button to make it bold."]})})})})]}),B("div",{children:[_("p",{class:"text-xl font-semibold",children:"Preview:"}),_("div",{class:"p-2 border-2 bg-white text-black",children:_("div",{innerHTML:$i})})]}),B("div",{class:"p-2 bg-purple-950 rounded-md",children:[_("p",{class:"text-xl font-semibold",children:"JSON:"}),_("div",{class:"bg-black/20 p-2 border-2 border-gray-500 rounded-md",children:_("output",{class:"",name:"json_output",htmlFor:gt,children:_("pre",{class:"overflow-x-scroll",children:()=>JSON.stringify(kt(),null,"  ")})})})]})]})}function Rn(t){t.removeAttribute("contenteditable");for(const e of t.children)Rn(e)}const Hi=`import {
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
}`;Le.registerLanguage("typescript",Di);Le.registerLanguage("html",Pi);Le.registerLanguage("bash",Ii);const zi=yn(Ci);function en(t){document.title=t}function tn(t){const e=document.querySelector('meta[name="description"]');e&&e.setAttribute("content",t)}function Fi(){const t=rn(),e=Oe(()=>{const r=Ar("doc")()||"main";return an.find(s=>s.route_name==r)}),n=Oe(()=>{const r=e();if(r){const i=yn(r.data);return console.log("parsedMarkdown",i),i}return""});return ue(()=>{const r=e();console.log("createEffect MD_DOC",r),r?(en(`${r.title} | HyperFX`),tn(`HyperFX docs about ${r.title}.`)):(en("HyperFX"),tn("HyperFX docs"))}),ue(()=>{t(),setTimeout(()=>{const r=document.querySelectorAll("pre code");for(const i of r)Le.highlightElement(i)},0)}),B(nn,{children:[_(qt,{when:()=>e()!==void 0&&e().route_name!=="main",children:B("div",{class:"flex flex-auto",children:[_(Zr,{}),_("article",{class:"p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl",children:_("div",{class:"markdown-body",innerHTML:n})})]})}),_(qt,{when:()=>e()===void 0||e().route_name==="main",children:B("div",{class:"grow flex flex-col",children:[_("article",{class:"p-4 mx-auto w-full max-w-4xl",children:_("div",{class:"markdown-body-main",innerHTML:zi})}),B("div",{class:"p-2 bg-red-950 text-white mt-4 mx-auto",children:[_("p",{class:"text-xl",children:"This is a work in progress!"}),_("p",{class:"text-xl",children:"The docs are not finished yet!"})]})]})})]})}function Ui(){const t=Bi(),e=_("pre",{class:"mx-auto max-w-[70vw]! max-h-[50vw]",children:_("code",{class:"language-tsx",children:Hi})});return ue(()=>{setTimeout(()=>{const n=document.querySelector("pre code");n&&Le.highlightElement(n)},0)}),B("div",{class:"flex flex-col p-4 max-w-[80vw] mx-auto",children:[B("div",{class:"p-2",children:[B("p",{class:"mx-auto",children:["This is the code used to create the editor.",B("span",{class:"text-purple-500/80",children:[" ","(The editor is far from done but it is still cool IMO.)"]})]}),_("div",{class:"w-full",children:e})]}),t]})}function Xi(){const t=Rr(),e=rn();return ue(()=>{e()==="/"&&t("/hyperfx")}),B("div",{class:"flex flex-auto flex-col min-h-screen",children:[_(Gr,{}),B("main",{class:"flex flex-auto flex-col",id:"main-content",children:[_("p",{class:"p-2 bg-red-800 text-white text-center w-full! max-w-full!",children:"A LOT OF CHANGES. DOCS ARE NOT UP TO DATE."}),_(Zt,{path:"/hyperfx",component:Fi}),_(Zt,{path:"/hyperfx/editor",component:Ui})]}),B("footer",{class:"bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto",children:[_("a",{href:"https://github.com/ArnoudK/hyperfx",target:"_blank",class:"underline",children:"Github"}),_("span",{class:"w-full ",children:" - © Arnoud Kerkhof"})]})]})}function Gi(){return _(_r,{initialPath:"/hyperfx",children:_(Xi,{})})}const ji=document.getElementById("app");ji.replaceChildren(Gi());
