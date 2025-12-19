var yr=Object.defineProperty;var wr=(t,e,n)=>e in t?yr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var L=(t,e,n)=>wr(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();let se=!1;const le=new Set;class kr{constructor(e){this.subscribers=new Set,this._value=e}get(){return se&&le.add(this.callableSignal),this._value}set(e){return Object.is(this._value,e)||(this._value=e,this.subscribers.forEach(n=>{try{n(e)}catch(r){console.error("Signal subscriber error:",r)}})),e}subscribe(e){return this.subscribers.add(e),()=>{this.subscribers.delete(e)}}peek(){return this._value}update(e){return this.set(e(this._value))}get subscriberCount(){return this.subscribers.size}}function ge(t){const e=new kr(t),n=Object.assign(r=>r!==void 0?e.set(r):e.get(),{get:()=>e.get(),set:r=>e.set(r),subscribe:r=>e.subscribe(r),peek:()=>e.peek(),update:r=>e.update(r),get subscriberCount(){return e.subscriberCount}});return e.callableSignal=n,n}function Er(t){const e=se;se=!0,le.clear();let n;try{n=t()}finally{se=e}const r=ge(n),i=Array.from(le);le.clear();const s=r.set;r.set=()=>{throw new Error("Cannot set computed signal directly. Computed signals are read-only.")};const c=i.map(a=>a.subscribe(()=>{const d=t();s(d)}));return r._unsubscribers=c,r}function Sr(t){const e=se;se=!0,le.clear();let n;n=t();const i=Array.from(le).map(s=>s.subscribe(()=>{const c=se;se=!0,le.clear(),typeof n=="function"&&n(),n=t(),se=c,le.clear()}));return se=e,le.clear(),()=>{i.forEach(s=>{s()}),typeof n=="function"&&n()}}function me(t){return typeof t=="function"&&"subscribe"in t&&"get"in t&&"set"in t}let vr=0;function _r(){return typeof window>"u"||typeof document>"u"}function Tr(){return String(++vr).padStart(6,"0")}const Rr=Symbol("HyperFX.Fragment");function Ar(t,e){const n=document.createElement(t);if(_r()||n.setAttribute("data-hfxh",Tr()),e){for(const[r,i]of Object.entries(e))if(r!=="children"&&r!=="key")if(r==="innerHTML"||r==="textContent"){const s=()=>{const c=me(i)?i():i;n[r]=c};me(i)&&i.subscribe(s),s()}else if(r.startsWith("on")&&typeof i=="function"){const s=r.slice(2).toLowerCase();n.addEventListener(s,i)}else if(me(i)){const s=()=>{const c=i();c==null?r==="value"&&n instanceof HTMLInputElement?n.value="":r==="checked"&&n instanceof HTMLInputElement?n.checked=!1:n.removeAttribute(r):r==="value"&&n instanceof HTMLInputElement?n.value=String(c):r==="checked"&&n instanceof HTMLInputElement?n.checked=!!c:r==="disabled"&&typeof c=="boolean"?c?(n.setAttribute("disabled",""),n.disabled=!0):(n.removeAttribute("disabled"),n.disabled=!1):r==="class"||r==="className"?n.className=String(c):n.setAttribute(r,String(c))};s(),i.subscribe(s)}else i!=null&&(r==="value"&&n instanceof HTMLInputElement?n.value=String(i):r==="checked"&&n instanceof HTMLInputElement?n.checked=!!i:r==="disabled"&&typeof i=="boolean"?i?(n.setAttribute("disabled",""),n.disabled=!0):(n.removeAttribute("disabled"),n.disabled=!1):n.setAttribute(r,String(i)))}return n}function Cr(t){const e=document.createTextNode(""),n=()=>{let r="";me(t)?r=String(t()):r=String(t),e.textContent=r};return n(),me(t)&&t.subscribe(n),e}function Qe(t,e){if(!e)return;const n=Array.isArray(e)?e:[e];for(const r of n)if(!(r==null||r===!1||r===!0))if(me(r)){const i=r();if(i instanceof Node)t.appendChild(i);else{const s=Cr(r);t.appendChild(s)}}else if(typeof r=="function")try{const i=r();if(i instanceof Node)t.appendChild(i);else if(Array.isArray(i))Qe(t,i);else{const s=document.createTextNode(String(i));t.appendChild(s)}}catch(i){console.warn("Error rendering function child:",i)}else if(typeof r=="object"&&r instanceof Node)t.appendChild(r);else{const i=document.createTextNode(String(r));t.appendChild(i)}}function T(t,e,n){if(t===Rr||t===sn){const i=e==null?void 0:e.children,s=document.createDocumentFragment();return Qe(s,i),s}if(typeof t=="function")return t(e);const r=Ar(t,e);return e!=null&&e.children&&Qe(r,e.children),r}const H=T;function sn(t){const e=document.createDocumentFragment();return Qe(e,t.children),e}function Ie(t){return Er(t)}function de(t){return Sr(t)}const ke=ge(null);function Nr(t){const e=ge(t.initialPath||window.location.pathname+window.location.search),n=ge([e()]),r=ge(0),i=()=>{const p=window.location.pathname+window.location.search||"/";e(p);const S=n();S[r()]=p,n(S)};de(()=>(window.addEventListener("popstate",i),()=>window.removeEventListener("popstate",i))),ke({currentPath:e,navigate:(p,S={})=>{if(S.replace){window.history.replaceState({},"",p);const E=[...n()];E[r()]=p,n(E)}else{window.history.pushState({},"",p);const E=[...n().slice(0,r()+1),p];n(E),r(r()+1)}e(p)},back:()=>{if(r()>0){const p=r()-1;r(p);const S=n()[p]||"/";window.history.back(),e(S)}},forward:()=>{if(r()<n().length-1){const p=r()+1;r(p);const S=n()[p]||"/";window.history.forward(),e(S)}}});const l=document.createElement("div");l.className="router-container";let u;t.component?u=t.component({}):typeof t.children=="function"?u=t.children():u=t.children;const y=(p,S)=>{S==null||S===!1||(S instanceof Node?p.appendChild(S):Array.isArray(S)?S.forEach(E=>y(p,E)):p.appendChild(document.createTextNode(String(S))))};return y(l,u),l}function Wt(t){const e=document.createDocumentFragment(),n=document.createComment(`Route start: ${t.path}`),r=document.createComment(`Route end: ${t.path}`);e.appendChild(n),e.appendChild(r);let i=[];return de(()=>{const c=ke();if(!c)return;const a=c.currentPath,d=a(),l=t.exact!==void 0&&t.exact?d===t.path:d.startsWith(t.path),y=n.parentNode||e;if(i.forEach(p=>{p.parentNode===y&&y.removeChild(p)}),i=[],l){let p;t.component?p=t.component({}):typeof t.children=="function"?p=t.children():p=t.children,p&&(Array.isArray(p)?p:[p]).forEach(E=>{if(E instanceof Node)y.insertBefore(E,r),i.push(E);else if(E!=null){const C=document.createTextNode(String(E));y.insertBefore(C,r),i.push(C)}})}}),e}function Je(t){const e=document.createElement("a");e.href=t.to,e.className=t.class!==void 0?t.class:"";const n=r=>{r.preventDefault(),t.onClick&&t.onClick(r);const i=ke();i?i.navigate(t.to,{replace:t.replace!==void 0?t.replace:!1}):window.history.pushState({},"",t.to)};return e.addEventListener("click",n),de(()=>{const r=ke();if(!r)return;const i=r.currentPath,s=i(),c=t.exact!==void 0&&t.exact?s===t.to:s.startsWith(t.to),a=t.activeClass!==void 0?t.activeClass:"active";c?e.classList.add(a):e.classList.remove(a)}),typeof t.children=="string"?e.textContent=t.children:Array.isArray(t.children)?t.children.forEach(r=>{e.appendChild(r)}):t.children&&e.appendChild(t.children),e}function on(){const t=ke();return t?t.currentPath:ge(window.location.pathname)}function Mr(){return(t,e)=>{const n=ke();n?n.navigate(t,e):e!=null&&e.replace?window.history.replaceState({},"",t):window.history.pushState({},"",t)}}function Or(t){const e=ke();return Ie(()=>(e&&e.currentPath(),new URLSearchParams(window.location.search).get(t)))}function Ir(t){const e=document.createDocumentFragment(),n=document.createComment("For start"),r=document.createComment("For end");e.appendChild(n),e.appendChild(r);const i=Array.isArray(t.children)?t.children[0]:t.children;if(typeof i!="function")throw typeof i=="object"&&console.error("Received object:",i),new Error(`For component children must be a function that renders each item.
Expected (item, index) => JSXElement. Got ${typeof i}`);let s=[];const c=()=>{let a;Array.isArray(t.each)?a=t.each:me(t.each)||typeof t.each=="function"?a=t.each():a=t.each;const d=n.parentNode;d?(s.forEach(l=>{l.parentNode&&l.parentNode.removeChild(l)}),s=[],a.length>0?a.forEach((l,u)=>{const y=i(l,()=>u);y&&(d.insertBefore(y,r),s.push(y))}):t.fallback&&(d.insertBefore(t.fallback,r),s.push(t.fallback))):(s.forEach(l=>{l.parentNode===e&&e.removeChild(l)}),s=[],a.length>0?a.forEach((l,u)=>{const y=i(l,()=>u);y&&(e.insertBefore(y,r),s.push(y))}):t.fallback&&(e.insertBefore(t.fallback,r),s.push(t.fallback)))};return me(t.each)?de(c):c(),e}function Jt(t){const e=document.createDocumentFragment(),n=document.createComment("Show start"),r=document.createComment("Show end");e.appendChild(n),e.appendChild(r);let i=[];return de(()=>{const c=typeof t.when=="function"?t.when():t.when,a=n.parentNode;let d=null;c?d=typeof t.children=="function"?t.children():t.children:t.fallback&&(d=typeof t.fallback=="function"?t.fallback():t.fallback);const l=a||e;i.forEach(u=>{u.parentNode===l&&l.removeChild(u)}),i=[],d&&(Array.isArray(d)?d:[d]).forEach(y=>{l.insertBefore(y,r),i.push(y)})}),e}function Lr(t){const e=t.tagName,n={},r=[],i=t.childNodes,s=t.attributes;for(const c of s){const a=c.name,d=c.value;n[a]=d}for(const c of i)r.push(an(c));return{tag:e,attrs:n,children:r}}function an(t){return t instanceof Text?t.textContent??"":Lr(t)}function ln(t){if(typeof t=="string")return document.createTextNode(t);const e=document.createElement(t.tag);for(const r of t.children)e.appendChild(ln(r));const n=Object.keys(t.attrs);for(const r of n)e.setAttribute(r,t.attrs[r]);return e}class Dr{constructor(){this.metrics={renderCount:0,lastRenderTime:0,averageRenderTime:0,totalRenderTime:0,componentCount:0},this.renderStartTime=0,this.enabled=!1}enable(){this.enabled=!0}disable(){this.enabled=!1}startRender(){this.enabled&&(this.renderStartTime=performance.now())}endRender(){if(!this.enabled||this.renderStartTime===0)return;const e=performance.now()-this.renderStartTime;this.metrics.renderCount++,this.metrics.lastRenderTime=e,this.metrics.totalRenderTime+=e,this.metrics.averageRenderTime=this.metrics.totalRenderTime/this.metrics.renderCount,"memory"in performance&&(this.metrics.memoryUsage=performance.memory.usedJSHeapSize),this.renderStartTime=0}incrementComponentCount(){this.enabled&&this.metrics.componentCount++}decrementComponentCount(){this.enabled&&(this.metrics.componentCount=Math.max(0,this.metrics.componentCount-1))}getMetrics(){return{...this.metrics}}reset(){this.metrics={renderCount:0,lastRenderTime:0,averageRenderTime:0,totalRenderTime:0,componentCount:0}}logMetrics(){console.group("🚀 HyperFX Performance Metrics"),console.log("Render Count:",this.metrics.renderCount),console.log("Last Render Time:",`${this.metrics.lastRenderTime.toFixed(2)}ms`),console.log("Average Render Time:",`${this.metrics.averageRenderTime.toFixed(2)}ms`),console.log("Total Render Time:",`${this.metrics.totalRenderTime.toFixed(2)}ms`),console.log("Active Components:",this.metrics.componentCount),this.metrics.memoryUsage&&console.log("Memory Usage:",`${(this.metrics.memoryUsage/1024/1024).toFixed(2)}MB`),console.groupEnd()}}const Pr=new Dr,$r=()=>typeof window<"u"&&window.__HYPERFX_DEV__;class Br{constructor(){this.componentTree=null,this.componentMap=new Map,this.renderCounts=new Map,this.enabled=!1}enable(){this.enabled=!0,typeof window<"u"&&(window.__HYPERFX_DEVTOOLS__=this,this.createDevToolsUI())}disable(){this.enabled=!1,typeof window<"u"&&(delete window.__HYPERFX_DEVTOOLS__,this.removeDevToolsUI())}trackComponent(e,n,r,i,s){if(!this.enabled)return;const c=this.renderCounts.get(e)||0;this.renderCounts.set(e,c+1);const a={id:e,type:n,props:this.sanitizeProps(r),children:this.analyzeChildren(i),renderTime:s,updateCount:c+1};this.componentMap.set(e,a),this.updateComponentTree(),this.refreshDevToolsUI()}sanitizeProps(e){const n={};for(const[r,i]of Object.entries(e))if(typeof i=="function")n[r]="[Function]";else if(i instanceof HTMLElement)n[r]=`[HTMLElement: ${i.tagName}]`;else if(i&&typeof i=="object")try{JSON.stringify(i),n[r]=i}catch{n[r]="[Object]"}else n[r]=i;return n}analyzeChildren(e){const n=[];for(const r of e)r instanceof HTMLElement?n.push({id:`dom-${r.tagName.toLowerCase()}-${Date.now()}-${Math.random()}`,type:r.tagName.toLowerCase(),props:this.getElementAttributes(r),children:this.analyzeDOMChildren(r)}):r instanceof DocumentFragment?n.push({id:`fragment-${Date.now()}-${Math.random()}`,type:"DocumentFragment",props:{},children:this.analyzeDOMChildren(r)}):r instanceof Text&&n.push({id:`text-${Date.now()}-${Math.random()}`,type:"Text",props:{content:r.textContent},children:[]});return n}getElementAttributes(e){const n={};for(const r of e.attributes)n[r.name]=r.value;return n}analyzeDOMChildren(e){const n=[];for(const r of e.children)n.push(r);return this.analyzeChildren(n)}updateComponentTree(){const e=Array.from(this.componentMap.values()),n=new Set;e.forEach(i=>{i.children.forEach(s=>n.add(s.id))});const r=e.filter(i=>!n.has(i.id));this.componentTree={id:"root",type:"Application",props:{},children:r}}createDevToolsUI(){if(document.getElementById("hyperfx-devtools"))return;const e=document.createElement("div");e.id="hyperfx-devtools",e.style.cssText=`
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
    `,s.onclick=()=>{const c=e.style.display!=="none";e.style.display=c?"none":"block",s.style.right=c?"410px":"10px"},document.body.appendChild(s)}removeDevToolsUI(){const e=document.getElementById("hyperfx-devtools"),n=document.getElementById("hyperfx-devtools-toggle");e&&e.remove(),n&&n.remove()}refreshDevToolsUI(){const e=document.getElementById("hyperfx-devtools-content");if(!e||!this.componentTree)return;const n=Pr.getMetrics();let r=`
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; color: #4CAF50;">Performance Metrics</h4>
        <pre style="margin: 0; font-size: 11px;">${JSON.stringify(n,null,2)}</pre>
      </div>
    `;r+=`
      <div>
        <h4 style="margin: 0 0 5px 0; color: #2196F3;">Component Tree</h4>
        <pre style="margin: 0; font-size: 11px;">${JSON.stringify(this.componentTree,null,2)}</pre>
      </div>
    `,e.innerHTML=r}getComponentInfo(e){return this.componentMap.get(e)||null}getAllComponents(){return Array.from(this.componentMap.values())}clearTracking(){this.componentMap.clear(),this.renderCounts.clear(),this.componentTree=null,this.refreshDevToolsUI()}}const Hr=new Br;$r()&&typeof window<"u"&&setTimeout(()=>{Hr.enable()},100);const zr=`# The basics

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
`,Fr=`# Routing & SPA

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
`,Ur=`# Components

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
`,Xr=`# Get started with HyperFX

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
`,Gr=`# State Management

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
`,jr=`# Rendering

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
`,Zr=`# Server-Side Rendering (SSR)

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
`,qr="/hyperfx?doc=",cn=[{title:"Get Started",route_name:"get_started",data:Xr},{title:"HyperFX basics",route_name:"basics",data:zr},{title:"State Management",route_name:"state-management",data:Gr},{title:"Rendering & Control Flow",route_name:"render",data:jr},{title:"HyperFX components",route_name:"components",data:Ur},{title:"Single Page Application",route_name:"spa",data:Fr},{title:"Server-Side Rendering",route_name:"ssr",data:Zr}];function Wr(){return H("nav",{class:"flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg",children:[T(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx",children:"Home"}),T(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx?doc=get_started",children:"Docs"}),T(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx/editor",children:"Example"})]})}const xt=ge(!1);function Jr(){console.log(xt(!xt()))}function Kr(){const t=Ie(()=>`flex-col sm:flex gap-1 ${xt()?"flex":"hidden"}`);return H("aside",{class:"bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl",children:[T("div",{class:"flex items-center justify-between mb-6 sm:hidden",children:H("button",{class:"text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform",title:"Toggle Navigation",onclick:Jr,children:[T("span",{class:"text-lg",children:"☰"}),T("span",{class:"sr-only",children:"Toggle Navigation"})]})}),H("nav",{class:t,children:[T("p",{class:"hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3",children:"Fundamentals"}),T(Ir,{each:cn,children:e=>T(Je,{class:"px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block",to:`${qr}${e.route_name}`,children:e.title})})]})]})}function St(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Se=St();function un(t){Se=t}var Oe={exec:()=>null};function M(t,e=""){let n=typeof t=="string"?t:t.source;const r={replace:(i,s)=>{let c=typeof s=="string"?s:s.source;return c=c.replace(Z.caret,"$1"),n=n.replace(i,c),r},getRegex:()=>new RegExp(n,e)};return r}var Z={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},Qr=/^(?:[ \t]*(?:\n|$))+/,Yr=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Vr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Le=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ei=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,vt=/(?:[*+-]|\d{1,9}[.)])/,dn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,hn=M(dn).replace(/bull/g,vt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ti=M(dn).replace(/bull/g,vt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),_t=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ni=/^[^\n]+/,Tt=/(?!\s*\])(?:\\.|[^\[\]\\])+/,ri=M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Tt).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ii=M(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,vt).getRegex(),nt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Rt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,si=M("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Rt).replace("tag",nt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),pn=M(_t).replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",nt).getRegex(),oi=M(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",pn).getRegex(),At={blockquote:oi,code:Yr,def:ri,fences:Vr,heading:ei,hr:Le,html:si,lheading:hn,list:ii,newline:Qr,paragraph:pn,table:Oe,text:ni},Kt=M("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",nt).getRegex(),ai={...At,lheading:ti,table:Kt,paragraph:M(_t).replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Kt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",nt).getRegex()},li={...At,html:M(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Rt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Oe,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:M(_t).replace("hr",Le).replace("heading",` *#{1,6} *[^
]`).replace("lheading",hn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ci=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ui=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,fn=/^( {2,}|\\)\n(?!\s*$)/,di=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,rt=/[\p{P}\p{S}]/u,Ct=/[\s\p{P}\p{S}]/u,gn=/[^\s\p{P}\p{S}]/u,hi=M(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ct).getRegex(),mn=/(?!~)[\p{P}\p{S}]/u,pi=/(?!~)[\s\p{P}\p{S}]/u,fi=/(?:[^\s\p{P}\p{S}]|~)/u,gi=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,bn=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,mi=M(bn,"u").replace(/punct/g,rt).getRegex(),bi=M(bn,"u").replace(/punct/g,mn).getRegex(),xn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",xi=M(xn,"gu").replace(/notPunctSpace/g,gn).replace(/punctSpace/g,Ct).replace(/punct/g,rt).getRegex(),yi=M(xn,"gu").replace(/notPunctSpace/g,fi).replace(/punctSpace/g,pi).replace(/punct/g,mn).getRegex(),wi=M("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,gn).replace(/punctSpace/g,Ct).replace(/punct/g,rt).getRegex(),ki=M(/\\(punct)/,"gu").replace(/punct/g,rt).getRegex(),Ei=M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Si=M(Rt).replace("(?:-->|$)","-->").getRegex(),vi=M("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Si).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ye=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,_i=M(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Ye).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),yn=M(/^!?\[(label)\]\[(ref)\]/).replace("label",Ye).replace("ref",Tt).getRegex(),wn=M(/^!?\[(ref)\](?:\[\])?/).replace("ref",Tt).getRegex(),Ti=M("reflink|nolink(?!\\()","g").replace("reflink",yn).replace("nolink",wn).getRegex(),Nt={_backpedal:Oe,anyPunctuation:ki,autolink:Ei,blockSkip:gi,br:fn,code:ui,del:Oe,emStrongLDelim:mi,emStrongRDelimAst:xi,emStrongRDelimUnd:wi,escape:ci,link:_i,nolink:wn,punctuation:hi,reflink:yn,reflinkSearch:Ti,tag:vi,text:di,url:Oe},Ri={...Nt,link:M(/^!?\[(label)\]\((.*?)\)/).replace("label",Ye).getRegex(),reflink:M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ye).getRegex()},yt={...Nt,emStrongRDelimAst:yi,emStrongLDelim:bi,url:M(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Ai={...yt,br:M(fn).replace("{2,}","*").getRegex(),text:M(yt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},We={normal:At,gfm:ai,pedantic:li},Ne={normal:Nt,gfm:yt,breaks:Ai,pedantic:Ri},Ci={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Qt=t=>Ci[t];function ie(t,e){if(e){if(Z.escapeTest.test(t))return t.replace(Z.escapeReplace,Qt)}else if(Z.escapeTestNoEncode.test(t))return t.replace(Z.escapeReplaceNoEncode,Qt);return t}function Yt(t){try{t=encodeURI(t).replace(Z.percentDecode,"%")}catch{return null}return t}function Vt(t,e){var s;const n=t.replace(Z.findPipe,(c,a,d)=>{let l=!1,u=a;for(;--u>=0&&d[u]==="\\";)l=!l;return l?"|":" |"}),r=n.split(Z.splitPipe);let i=0;if(r[0].trim()||r.shift(),r.length>0&&!((s=r.at(-1))!=null&&s.trim())&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;i<r.length;i++)r[i]=r[i].trim().replace(Z.slashPipe,"|");return r}function Me(t,e,n){const r=t.length;if(r===0)return"";let i=0;for(;i<r&&t.charAt(r-i-1)===e;)i++;return t.slice(0,r-i)}function Ni(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function en(t,e,n,r,i){const s=e.href,c=e.title||null,a=t[1].replace(i.other.outputLinkReplace,"$1");r.state.inLink=!0;const d={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:s,title:c,text:a,tokens:r.inlineTokens(a)};return r.state.inLink=!1,d}function Mi(t,e,n){const r=t.match(n.other.indentCodeCompensation);if(r===null)return e;const i=r[1];return e.split(`
`).map(s=>{const c=s.match(n.other.beginningSpace);if(c===null)return s;const[a]=c;return a.length>=i.length?s.slice(i.length):s}).join(`
`)}var Ve=class{constructor(t){L(this,"options");L(this,"rules");L(this,"lexer");this.options=t||Se}space(t){const e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){const e=this.rules.block.code.exec(t);if(e){const n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Me(n,`
`)}}}fences(t){const e=this.rules.block.fences.exec(t);if(e){const n=e[0],r=Mi(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){const e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){const r=Me(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){const e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Me(e[0],`
`)}}blockquote(t){const e=this.rules.block.blockquote.exec(t);if(e){let n=Me(e[0],`
`).split(`
`),r="",i="";const s=[];for(;n.length>0;){let c=!1;const a=[];let d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))a.push(n[d]),c=!0;else if(!c)a.push(n[d]);else break;n=n.slice(d);const l=a.join(`
`),u=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${l}`:l,i=i?`${i}
${u}`:u;const y=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,s,!0),this.lexer.state.top=y,n.length===0)break;const p=s.at(-1);if((p==null?void 0:p.type)==="code")break;if((p==null?void 0:p.type)==="blockquote"){const S=p,E=S.raw+`
`+n.join(`
`),C=this.blockquote(E);s[s.length-1]=C,r=r.substring(0,r.length-S.raw.length)+C.raw,i=i.substring(0,i.length-S.text.length)+C.text;break}else if((p==null?void 0:p.type)==="list"){const S=p,E=S.raw+`
`+n.join(`
`),C=this.list(E);s[s.length-1]=C,r=r.substring(0,r.length-p.raw.length)+C.raw,i=i.substring(0,i.length-S.raw.length)+C.raw,n=E.substring(s.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:s,text:i}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim();const r=n.length>1,i={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");const s=this.rules.other.listItemRegex(n);let c=!1;for(;t;){let d=!1,l="",u="";if(!(e=s.exec(t))||this.rules.block.hr.test(t))break;l=e[0],t=t.substring(l.length);let y=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,J=>" ".repeat(3*J.length)),p=t.split(`
`,1)[0],S=!y.trim(),E=0;if(this.options.pedantic?(E=2,u=y.trimStart()):S?E=e[1].length+1:(E=e[2].search(this.rules.other.nonSpaceChar),E=E>4?1:E,u=y.slice(E),E+=e[1].length),S&&this.rules.other.blankLine.test(p)&&(l+=p+`
`,t=t.substring(p.length+1),d=!0),!d){const J=this.rules.other.nextBulletRegex(E),q=this.rules.other.hrRegex(E),Q=this.rules.other.fencesBeginRegex(E),oe=this.rules.other.headingBeginRegex(E),Y=this.rules.other.htmlBeginRegex(E);for(;t;){const V=t.split(`
`,1)[0];let te;if(p=V,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),te=p):te=p.replace(this.rules.other.tabCharGlobal,"    "),Q.test(p)||oe.test(p)||Y.test(p)||J.test(p)||q.test(p))break;if(te.search(this.rules.other.nonSpaceChar)>=E||!p.trim())u+=`
`+te.slice(E);else{if(S||y.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Q.test(y)||oe.test(y)||q.test(y))break;u+=`
`+p}!S&&!p.trim()&&(S=!0),l+=V+`
`,t=t.substring(V.length+1),y=te.slice(E)}}i.loose||(c?i.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(c=!0));let C=null,K;this.options.gfm&&(C=this.rules.other.listIsTask.exec(u),C&&(K=C[0]!=="[ ] ",u=u.replace(this.rules.other.listReplaceTask,""))),i.items.push({type:"list_item",raw:l,task:!!C,checked:K,loose:!1,text:u,tokens:[]}),i.raw+=l}const a=i.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let d=0;d<i.items.length;d++)if(this.lexer.state.top=!1,i.items[d].tokens=this.lexer.blockTokens(i.items[d].text,[]),!i.loose){const l=i.items[d].tokens.filter(y=>y.type==="space"),u=l.length>0&&l.some(y=>this.rules.other.anyLine.test(y.raw));i.loose=u}if(i.loose)for(let d=0;d<i.items.length;d++)i.items[d].loose=!0;return i}}html(t){const e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){const e=this.rules.block.def.exec(t);if(e){const n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:r,title:i}}}table(t){var c;const e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const n=Vt(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=(c=e[3])!=null&&c.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===r.length){for(const a of r)this.rules.other.tableAlignRight.test(a)?s.align.push("right"):this.rules.other.tableAlignCenter.test(a)?s.align.push("center"):this.rules.other.tableAlignLeft.test(a)?s.align.push("left"):s.align.push(null);for(let a=0;a<n.length;a++)s.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:s.align[a]});for(const a of i)s.rows.push(Vt(a,s.header.length).map((d,l)=>({text:d,tokens:this.lexer.inline(d),header:!1,align:s.align[l]})));return s}}lheading(t){const e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){const e=this.rules.block.paragraph.exec(t);if(e){const n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){const e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){const e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){const e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){const e=this.rules.inline.link.exec(t);if(e){const n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const s=Me(n.slice(0,-1),"\\");if((n.length-s.length)%2===0)return}else{const s=Ni(e[2],"()");if(s===-2)return;if(s>-1){const a=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let r=e[2],i="";if(this.options.pedantic){const s=this.rules.other.pedanticHrefTitle.exec(r);s&&(r=s[1],i=s[3])}else i=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),en(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){const r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=e[r.toLowerCase()];if(!i){const s=n[0].charAt(0);return{type:"text",raw:s,text:s}}return en(n,i,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(r[1]||r[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const s=[...r[0]].length-1;let c,a,d=s,l=0;const u=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,e=e.slice(-1*t.length+s);(r=u.exec(e))!=null;){if(c=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!c)continue;if(a=[...c].length,r[3]||r[4]){d+=a;continue}else if((r[5]||r[6])&&s%3&&!((s+a)%3)){l+=a;continue}if(d-=a,d>0)continue;a=Math.min(a,a+d+l);const y=[...r[0]][0].length,p=t.slice(0,s+r.index+y+a);if(Math.min(s,a)%2){const E=p.slice(1,-1);return{type:"em",raw:p,text:E,tokens:this.lexer.inlineTokens(E)}}const S=p.slice(2,-2);return{type:"strong",raw:p,text:S,tokens:this.lexer.inlineTokens(S)}}}}codespan(t){const e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," ");const r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){const e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){const e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){const e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(t){var n;let e;if(e=this.rules.inline.url.exec(t)){let r,i;if(e[2]==="@")r=e[0],i="mailto:"+r;else{let s;do s=e[0],e[0]=((n=this.rules.inline._backpedal.exec(e[0]))==null?void 0:n[0])??"";while(s!==e[0]);r=e[0],e[1]==="www."?i="http://"+e[0]:i=e[0]}return{type:"link",raw:e[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){const e=this.rules.inline.text.exec(t);if(e){const n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},ce=class wt{constructor(e){L(this,"tokens");L(this,"options");L(this,"state");L(this,"tokenizer");L(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Se,this.options.tokenizer=this.options.tokenizer||new Ve,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={other:Z,block:We.normal,inline:Ne.normal};this.options.pedantic?(n.block=We.pedantic,n.inline=Ne.pedantic):this.options.gfm&&(n.block=We.gfm,this.options.breaks?n.inline=Ne.breaks:n.inline=Ne.gfm),this.tokenizer.rules=n}static get rules(){return{block:We,inline:Ne}}static lex(e,n){return new wt(n).lex(e)}static lexInline(e,n){return new wt(n).inlineTokens(e)}lex(e){e=e.replace(Z.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){const r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){var i,s,c;for(this.options.pedantic&&(e=e.replace(Z.tabCharGlobal,"    ").replace(Z.spaceLine,""));e;){let a;if((s=(i=this.options.extensions)==null?void 0:i.block)!=null&&s.some(l=>(a=l.call({lexer:this},e,n))?(e=e.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.space(e)){e=e.substring(a.raw.length);const l=n.at(-1);a.raw.length===1&&l!==void 0?l.raw+=`
`:n.push(a);continue}if(a=this.tokenizer.code(e)){e=e.substring(a.raw.length);const l=n.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=`
`+a.raw,l.text+=`
`+a.text,this.inlineQueue.at(-1).src=l.text):n.push(a);continue}if(a=this.tokenizer.fences(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.heading(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.hr(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.blockquote(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.list(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.html(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.def(e)){e=e.substring(a.raw.length);const l=n.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=`
`+a.raw,l.text+=`
`+a.raw,this.inlineQueue.at(-1).src=l.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title});continue}if(a=this.tokenizer.table(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.lheading(e)){e=e.substring(a.raw.length),n.push(a);continue}let d=e;if((c=this.options.extensions)!=null&&c.startBlock){let l=1/0;const u=e.slice(1);let y;this.options.extensions.startBlock.forEach(p=>{y=p.call({lexer:this},u),typeof y=="number"&&y>=0&&(l=Math.min(l,y))}),l<1/0&&l>=0&&(d=e.substring(0,l+1))}if(this.state.top&&(a=this.tokenizer.paragraph(d))){const l=n.at(-1);r&&(l==null?void 0:l.type)==="paragraph"?(l.raw+=`
`+a.raw,l.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):n.push(a),r=d.length!==e.length,e=e.substring(a.raw.length);continue}if(a=this.tokenizer.text(e)){e=e.substring(a.raw.length);const l=n.at(-1);(l==null?void 0:l.type)==="text"?(l.raw+=`
`+a.raw,l.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):n.push(a);continue}if(e){const l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){var a,d,l;let r=e,i=null;if(this.tokens.links){const u=Object.keys(this.tokens.links);if(u.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)u.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,i.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(i=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let s=!1,c="";for(;e;){s||(c=""),s=!1;let u;if((d=(a=this.options.extensions)==null?void 0:a.inline)!=null&&d.some(p=>(u=p.call({lexer:this},e,n))?(e=e.substring(u.raw.length),n.push(u),!0):!1))continue;if(u=this.tokenizer.escape(e)){e=e.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.tag(e)){e=e.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.link(e)){e=e.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(u.raw.length);const p=n.at(-1);u.type==="text"&&(p==null?void 0:p.type)==="text"?(p.raw+=u.raw,p.text+=u.text):n.push(u);continue}if(u=this.tokenizer.emStrong(e,r,c)){e=e.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.codespan(e)){e=e.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.br(e)){e=e.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.del(e)){e=e.substring(u.raw.length),n.push(u);continue}if(u=this.tokenizer.autolink(e)){e=e.substring(u.raw.length),n.push(u);continue}if(!this.state.inLink&&(u=this.tokenizer.url(e))){e=e.substring(u.raw.length),n.push(u);continue}let y=e;if((l=this.options.extensions)!=null&&l.startInline){let p=1/0;const S=e.slice(1);let E;this.options.extensions.startInline.forEach(C=>{E=C.call({lexer:this},S),typeof E=="number"&&E>=0&&(p=Math.min(p,E))}),p<1/0&&p>=0&&(y=e.substring(0,p+1))}if(u=this.tokenizer.inlineText(y)){e=e.substring(u.raw.length),u.raw.slice(-1)!=="_"&&(c=u.raw.slice(-1)),s=!0;const p=n.at(-1);(p==null?void 0:p.type)==="text"?(p.raw+=u.raw,p.text+=u.text):n.push(u);continue}if(e){const p="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(p);break}else throw new Error(p)}}return n}},et=class{constructor(t){L(this,"options");L(this,"parser");this.options=t||Se}space(t){return""}code({text:t,lang:e,escaped:n}){var s;const r=(s=(e||"").match(Z.notSpaceStart))==null?void 0:s[0],i=t.replace(Z.endingNewline,"")+`
`;return r?'<pre><code class="language-'+ie(r)+'">'+(n?i:ie(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:ie(i,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){const e=t.ordered,n=t.start;let r="";for(let c=0;c<t.items.length;c++){const a=t.items[c];r+=this.listitem(a)}const i=e?"ol":"ul",s=e&&n!==1?' start="'+n+'"':"";return"<"+i+s+`>
`+r+"</"+i+`>
`}listitem(t){var n;let e="";if(t.task){const r=this.checkbox({checked:!!t.checked});t.loose?((n=t.tokens[0])==null?void 0:n.type)==="paragraph"?(t.tokens[0].text=r+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=r+" "+ie(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:r+" ",text:r+" ",escaped:!0}):e+=r+" "}return e+=this.parser.parse(t.tokens,!!t.loose),`<li>${e}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let i=0;i<t.header.length;i++)n+=this.tablecell(t.header[i]);e+=this.tablerow({text:n});let r="";for(let i=0;i<t.rows.length;i++){const s=t.rows[i];n="";for(let c=0;c<s.length;c++)n+=this.tablecell(s[c]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${ie(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){const r=this.parser.parseInline(n),i=Yt(t);if(i===null)return r;t=i;let s='<a href="'+t+'"';return e&&(s+=' title="'+ie(e)+'"'),s+=">"+r+"</a>",s}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));const i=Yt(t);if(i===null)return ie(n);t=i;let s=`<img src="${t}" alt="${n}"`;return e&&(s+=` title="${ie(e)}"`),s+=">",s}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:ie(t.text)}},Mt=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},ue=class kt{constructor(e){L(this,"options");L(this,"renderer");L(this,"textRenderer");this.options=e||Se,this.options.renderer=this.options.renderer||new et,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Mt}static parse(e,n){return new kt(n).parse(e)}static parseInline(e,n){return new kt(n).parseInline(e)}parse(e,n=!0){var i,s;let r="";for(let c=0;c<e.length;c++){const a=e[c];if((s=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&s[a.type]){const l=a,u=this.options.extensions.renderers[l.type].call({parser:this},l);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){r+=u||"";continue}}const d=a;switch(d.type){case"space":{r+=this.renderer.space(d);continue}case"hr":{r+=this.renderer.hr(d);continue}case"heading":{r+=this.renderer.heading(d);continue}case"code":{r+=this.renderer.code(d);continue}case"table":{r+=this.renderer.table(d);continue}case"blockquote":{r+=this.renderer.blockquote(d);continue}case"list":{r+=this.renderer.list(d);continue}case"html":{r+=this.renderer.html(d);continue}case"paragraph":{r+=this.renderer.paragraph(d);continue}case"text":{let l=d,u=this.renderer.text(l);for(;c+1<e.length&&e[c+1].type==="text";)l=e[++c],u+=`
`+this.renderer.text(l);n?r+=this.renderer.paragraph({type:"paragraph",raw:u,text:u,tokens:[{type:"text",raw:u,text:u,escaped:!0}]}):r+=u;continue}default:{const l='Token with "'+d.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return r}parseInline(e,n=this.renderer){var i,s;let r="";for(let c=0;c<e.length;c++){const a=e[c];if((s=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&s[a.type]){const l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){r+=l||"";continue}}const d=a;switch(d.type){case"escape":{r+=n.text(d);break}case"html":{r+=n.html(d);break}case"link":{r+=n.link(d);break}case"image":{r+=n.image(d);break}case"strong":{r+=n.strong(d);break}case"em":{r+=n.em(d);break}case"codespan":{r+=n.codespan(d);break}case"br":{r+=n.br(d);break}case"del":{r+=n.del(d);break}case"text":{r+=n.text(d);break}default:{const l='Token with "'+d.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return r}},bt,Ke=(bt=class{constructor(t){L(this,"options");L(this,"block");this.options=t||Se}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?ce.lex:ce.lexInline}provideParser(){return this.block?ue.parse:ue.parseInline}},L(bt,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"])),bt),Oi=class{constructor(...t){L(this,"defaults",St());L(this,"options",this.setOptions);L(this,"parse",this.parseMarkdown(!0));L(this,"parseInline",this.parseMarkdown(!1));L(this,"Parser",ue);L(this,"Renderer",et);L(this,"TextRenderer",Mt);L(this,"Lexer",ce);L(this,"Tokenizer",Ve);L(this,"Hooks",Ke);this.use(...t)}walkTokens(t,e){var r,i;let n=[];for(const s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{const c=s;for(const a of c.header)n=n.concat(this.walkTokens(a.tokens,e));for(const a of c.rows)for(const d of a)n=n.concat(this.walkTokens(d.tokens,e));break}case"list":{const c=s;n=n.concat(this.walkTokens(c.items,e));break}default:{const c=s;(i=(r=this.defaults.extensions)==null?void 0:r.childTokens)!=null&&i[c.type]?this.defaults.extensions.childTokens[c.type].forEach(a=>{const d=c[a].flat(1/0);n=n.concat(this.walkTokens(d,e))}):c.tokens&&(n=n.concat(this.walkTokens(c.tokens,e)))}}return n}use(...t){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{const r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){const s=e.renderers[i.name];s?e.renderers[i.name]=function(...c){let a=i.renderer.apply(this,c);return a===!1&&(a=s.apply(this,c)),a}:e.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const s=e[i.level];s?s.unshift(i.tokenizer):e[i.level]=[i.tokenizer],i.start&&(i.level==="block"?e.startBlock?e.startBlock.push(i.start):e.startBlock=[i.start]:i.level==="inline"&&(e.startInline?e.startInline.push(i.start):e.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(e.childTokens[i.name]=i.childTokens)}),r.extensions=e),n.renderer){const i=this.defaults.renderer||new et(this.defaults);for(const s in n.renderer){if(!(s in i))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;const c=s,a=n.renderer[c],d=i[c];i[c]=(...l)=>{let u=a.apply(i,l);return u===!1&&(u=d.apply(i,l)),u||""}}r.renderer=i}if(n.tokenizer){const i=this.defaults.tokenizer||new Ve(this.defaults);for(const s in n.tokenizer){if(!(s in i))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;const c=s,a=n.tokenizer[c],d=i[c];i[c]=(...l)=>{let u=a.apply(i,l);return u===!1&&(u=d.apply(i,l)),u}}r.tokenizer=i}if(n.hooks){const i=this.defaults.hooks||new Ke;for(const s in n.hooks){if(!(s in i))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;const c=s,a=n.hooks[c],d=i[c];Ke.passThroughHooks.has(s)?i[c]=l=>{if(this.defaults.async)return Promise.resolve(a.call(i,l)).then(y=>d.call(i,y));const u=a.call(i,l);return d.call(i,u)}:i[c]=(...l)=>{let u=a.apply(i,l);return u===!1&&(u=d.apply(i,l)),u}}r.hooks=i}if(n.walkTokens){const i=this.defaults.walkTokens,s=n.walkTokens;r.walkTokens=function(c){let a=[];return a.push(s.call(this,c)),i&&(a=a.concat(i.call(this,c))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return ce.lex(t,e??this.defaults)}parser(t,e){return ue.parse(t,e??this.defaults)}parseMarkdown(t){return(n,r)=>{const i={...r},s={...this.defaults,...i},c=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&i.async===!1)return c(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return c(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return c(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));s.hooks&&(s.hooks.options=s,s.hooks.block=t);const a=s.hooks?s.hooks.provideLexer():t?ce.lex:ce.lexInline,d=s.hooks?s.hooks.provideParser():t?ue.parse:ue.parseInline;if(s.async)return Promise.resolve(s.hooks?s.hooks.preprocess(n):n).then(l=>a(l,s)).then(l=>s.hooks?s.hooks.processAllTokens(l):l).then(l=>s.walkTokens?Promise.all(this.walkTokens(l,s.walkTokens)).then(()=>l):l).then(l=>d(l,s)).then(l=>s.hooks?s.hooks.postprocess(l):l).catch(c);try{s.hooks&&(n=s.hooks.preprocess(n));let l=a(n,s);s.hooks&&(l=s.hooks.processAllTokens(l)),s.walkTokens&&this.walkTokens(l,s.walkTokens);let u=d(l,s);return s.hooks&&(u=s.hooks.postprocess(u)),u}catch(l){return c(l)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const r="<p>An error occurred:</p><pre>"+ie(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},Ee=new Oi;function I(t,e){return Ee.parse(t,e)}I.options=I.setOptions=function(t){return Ee.setOptions(t),I.defaults=Ee.defaults,un(I.defaults),I};I.getDefaults=St;I.defaults=Se;I.use=function(...t){return Ee.use(...t),I.defaults=Ee.defaults,un(I.defaults),I};I.walkTokens=function(t,e){return Ee.walkTokens(t,e)};I.parseInline=Ee.parseInline;I.Parser=ue;I.parser=ue.parse;I.Renderer=et;I.TextRenderer=Mt;I.Lexer=ce;I.lexer=ce.lex;I.Tokenizer=Ve;I.Hooks=Ke;I.parse=I;I.options;I.setOptions;I.use;I.walkTokens;I.parseInline;var kn=I;ue.parse;ce.lex;const Ii=`# HyperFX

HyperFX (hypermedia functions) is a simple library for DOM manipulation by using functions.
Right now it's JSX based. And it is not production ready.   

## Use case

Absolutely none, it is just a fun project.
`;function Li(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var gt,tn;function Di(){if(tn)return gt;tn=1;function t(o){return o instanceof Map?o.clear=o.delete=o.set=function(){throw new Error("map is read-only")}:o instanceof Set&&(o.add=o.clear=o.delete=function(){throw new Error("set is read-only")}),Object.freeze(o),Object.getOwnPropertyNames(o).forEach(h=>{const g=o[h],_=typeof g;(_==="object"||_==="function")&&!Object.isFrozen(g)&&t(g)}),o}class e{constructor(h){h.data===void 0&&(h.data={}),this.data=h.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function r(o,...h){const g=Object.create(null);for(const _ in o)g[_]=o[_];return h.forEach(function(_){for(const $ in _)g[$]=_[$]}),g}const i="</span>",s=o=>!!o.scope,c=(o,{prefix:h})=>{if(o.startsWith("language:"))return o.replace("language:","language-");if(o.includes(".")){const g=o.split(".");return[`${h}${g.shift()}`,...g.map((_,$)=>`${_}${"_".repeat($+1)}`)].join(" ")}return`${h}${o}`};class a{constructor(h,g){this.buffer="",this.classPrefix=g.classPrefix,h.walk(this)}addText(h){this.buffer+=n(h)}openNode(h){if(!s(h))return;const g=c(h.scope,{prefix:this.classPrefix});this.span(g)}closeNode(h){s(h)&&(this.buffer+=i)}value(){return this.buffer}span(h){this.buffer+=`<span class="${h}">`}}const d=(o={})=>{const h={children:[]};return Object.assign(h,o),h};class l{constructor(){this.rootNode=d(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(h){this.top.children.push(h)}openNode(h){const g=d({scope:h});this.add(g),this.stack.push(g)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(h){return this.constructor._walk(h,this.rootNode)}static _walk(h,g){return typeof g=="string"?h.addText(g):g.children&&(h.openNode(g),g.children.forEach(_=>this._walk(h,_)),h.closeNode(g)),h}static _collapse(h){typeof h!="string"&&h.children&&(h.children.every(g=>typeof g=="string")?h.children=[h.children.join("")]:h.children.forEach(g=>{l._collapse(g)}))}}class u extends l{constructor(h){super(),this.options=h}addText(h){h!==""&&this.add(h)}startScope(h){this.openNode(h)}endScope(){this.closeNode()}__addSublanguage(h,g){const _=h.root;g&&(_.scope=`language:${g}`),this.add(_)}toHTML(){return new a(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function y(o){return o?typeof o=="string"?o:o.source:null}function p(o){return C("(?=",o,")")}function S(o){return C("(?:",o,")*")}function E(o){return C("(?:",o,")?")}function C(...o){return o.map(g=>y(g)).join("")}function K(o){const h=o[o.length-1];return typeof h=="object"&&h.constructor===Object?(o.splice(o.length-1,1),h):{}}function J(...o){return"("+(K(o).capture?"":"?:")+o.map(_=>y(_)).join("|")+")"}function q(o){return new RegExp(o.toString()+"|").exec("").length-1}function Q(o,h){const g=o&&o.exec(h);return g&&g.index===0}const oe=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function Y(o,{joinWith:h}){let g=0;return o.map(_=>{g+=1;const $=g;let B=y(_),x="";for(;B.length>0;){const b=oe.exec(B);if(!b){x+=B;break}x+=B.substring(0,b.index),B=B.substring(b.index+b[0].length),b[0][0]==="\\"&&b[1]?x+="\\"+String(Number(b[1])+$):(x+=b[0],b[0]==="("&&g++)}return x}).map(_=>`(${_})`).join(h)}const V=/\b\B/,te="[a-zA-Z]\\w*",ve="[a-zA-Z_]\\w*",Pe="\\b\\d+(\\.\\d+)?",$e="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",Be="\\b(0b[01]+)",it="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",st=(o={})=>{const h=/^#![ ]*\//;return o.binary&&(o.begin=C(h,/.*\b/,o.binary,/\b.*/)),r({scope:"meta",begin:h,end:/$/,relevance:0,"on:begin":(g,_)=>{g.index!==0&&_.ignoreMatch()}},o)},be={begin:"\\\\[\\s\\S]",relevance:0},ot={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[be]},He={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[be]},at={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},X=function(o,h,g={}){const _=r({scope:"comment",begin:o,end:h,contains:[]},g);_.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const $=J("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return _.contains.push({begin:C(/[ ]+/,"(",$,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),_},he=X("//","$"),xe=X("/\\*","\\*/"),_e=X("#","$"),Ae={scope:"number",begin:Pe,relevance:0},ze={scope:"number",begin:$e,relevance:0},Nn={scope:"number",begin:Be,relevance:0},Mn={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[be,{begin:/\[/,end:/\]/,relevance:0,contains:[be]}]},On={scope:"title",begin:te,relevance:0},In={scope:"title",begin:ve,relevance:0},Ln={begin:"\\.\\s*"+ve,relevance:0};var Fe=Object.freeze({__proto__:null,APOS_STRING_MODE:ot,BACKSLASH_ESCAPE:be,BINARY_NUMBER_MODE:Nn,BINARY_NUMBER_RE:Be,COMMENT:X,C_BLOCK_COMMENT_MODE:xe,C_LINE_COMMENT_MODE:he,C_NUMBER_MODE:ze,C_NUMBER_RE:$e,END_SAME_AS_BEGIN:function(o){return Object.assign(o,{"on:begin":(h,g)=>{g.data._beginMatch=h[1]},"on:end":(h,g)=>{g.data._beginMatch!==h[1]&&g.ignoreMatch()}})},HASH_COMMENT_MODE:_e,IDENT_RE:te,MATCH_NOTHING_RE:V,METHOD_GUARD:Ln,NUMBER_MODE:Ae,NUMBER_RE:Pe,PHRASAL_WORDS_MODE:at,QUOTE_STRING_MODE:He,REGEXP_MODE:Mn,RE_STARTERS_RE:it,SHEBANG:st,TITLE_MODE:On,UNDERSCORE_IDENT_RE:ve,UNDERSCORE_TITLE_MODE:In});function Dn(o,h){o.input[o.index-1]==="."&&h.ignoreMatch()}function Pn(o,h){o.className!==void 0&&(o.scope=o.className,delete o.className)}function $n(o,h){h&&o.beginKeywords&&(o.begin="\\b("+o.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",o.__beforeBegin=Dn,o.keywords=o.keywords||o.beginKeywords,delete o.beginKeywords,o.relevance===void 0&&(o.relevance=0))}function Bn(o,h){Array.isArray(o.illegal)&&(o.illegal=J(...o.illegal))}function Hn(o,h){if(o.match){if(o.begin||o.end)throw new Error("begin & end are not supported with match");o.begin=o.match,delete o.match}}function zn(o,h){o.relevance===void 0&&(o.relevance=1)}const Fn=(o,h)=>{if(!o.beforeMatch)return;if(o.starts)throw new Error("beforeMatch cannot be used with starts");const g=Object.assign({},o);Object.keys(o).forEach(_=>{delete o[_]}),o.keywords=g.keywords,o.begin=C(g.beforeMatch,p(g.begin)),o.starts={relevance:0,contains:[Object.assign(g,{endsParent:!0})]},o.relevance=0,delete g.beforeMatch},Un=["of","and","for","in","not","or","if","then","parent","list","value"],Xn="keyword";function Ot(o,h,g=Xn){const _=Object.create(null);return typeof o=="string"?$(g,o.split(" ")):Array.isArray(o)?$(g,o):Object.keys(o).forEach(function(B){Object.assign(_,Ot(o[B],h,B))}),_;function $(B,x){h&&(x=x.map(b=>b.toLowerCase())),x.forEach(function(b){const v=b.split("|");_[v[0]]=[B,Gn(v[0],v[1])]})}}function Gn(o,h){return h?Number(h):jn(o)?0:1}function jn(o){return Un.includes(o.toLowerCase())}const It={},ye=o=>{console.error(o)},Lt=(o,...h)=>{console.log(`WARN: ${o}`,...h)},Te=(o,h)=>{It[`${o}/${h}`]||(console.log(`Deprecated as of ${o}. ${h}`),It[`${o}/${h}`]=!0)},Ue=new Error;function Dt(o,h,{key:g}){let _=0;const $=o[g],B={},x={};for(let b=1;b<=h.length;b++)x[b+_]=$[b],B[b+_]=!0,_+=q(h[b-1]);o[g]=x,o[g]._emit=B,o[g]._multi=!0}function Zn(o){if(Array.isArray(o.begin)){if(o.skip||o.excludeBegin||o.returnBegin)throw ye("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Ue;if(typeof o.beginScope!="object"||o.beginScope===null)throw ye("beginScope must be object"),Ue;Dt(o,o.begin,{key:"beginScope"}),o.begin=Y(o.begin,{joinWith:""})}}function qn(o){if(Array.isArray(o.end)){if(o.skip||o.excludeEnd||o.returnEnd)throw ye("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Ue;if(typeof o.endScope!="object"||o.endScope===null)throw ye("endScope must be object"),Ue;Dt(o,o.end,{key:"endScope"}),o.end=Y(o.end,{joinWith:""})}}function Wn(o){o.scope&&typeof o.scope=="object"&&o.scope!==null&&(o.beginScope=o.scope,delete o.scope)}function Jn(o){Wn(o),typeof o.beginScope=="string"&&(o.beginScope={_wrap:o.beginScope}),typeof o.endScope=="string"&&(o.endScope={_wrap:o.endScope}),Zn(o),qn(o)}function Kn(o){function h(x,b){return new RegExp(y(x),"m"+(o.case_insensitive?"i":"")+(o.unicodeRegex?"u":"")+(b?"g":""))}class g{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(b,v){v.position=this.position++,this.matchIndexes[this.matchAt]=v,this.regexes.push([v,b]),this.matchAt+=q(b)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const b=this.regexes.map(v=>v[1]);this.matcherRe=h(Y(b,{joinWith:"|"}),!0),this.lastIndex=0}exec(b){this.matcherRe.lastIndex=this.lastIndex;const v=this.matcherRe.exec(b);if(!v)return null;const U=v.findIndex((Ce,ct)=>ct>0&&Ce!==void 0),z=this.matchIndexes[U];return v.splice(0,U),Object.assign(v,z)}}class _{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(b){if(this.multiRegexes[b])return this.multiRegexes[b];const v=new g;return this.rules.slice(b).forEach(([U,z])=>v.addRule(U,z)),v.compile(),this.multiRegexes[b]=v,v}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(b,v){this.rules.push([b,v]),v.type==="begin"&&this.count++}exec(b){const v=this.getMatcher(this.regexIndex);v.lastIndex=this.lastIndex;let U=v.exec(b);if(this.resumingScanAtSamePosition()&&!(U&&U.index===this.lastIndex)){const z=this.getMatcher(0);z.lastIndex=this.lastIndex+1,U=z.exec(b)}return U&&(this.regexIndex+=U.position+1,this.regexIndex===this.count&&this.considerAll()),U}}function $(x){const b=new _;return x.contains.forEach(v=>b.addRule(v.begin,{rule:v,type:"begin"})),x.terminatorEnd&&b.addRule(x.terminatorEnd,{type:"end"}),x.illegal&&b.addRule(x.illegal,{type:"illegal"}),b}function B(x,b){const v=x;if(x.isCompiled)return v;[Pn,Hn,Jn,Fn].forEach(z=>z(x,b)),o.compilerExtensions.forEach(z=>z(x,b)),x.__beforeBegin=null,[$n,Bn,zn].forEach(z=>z(x,b)),x.isCompiled=!0;let U=null;return typeof x.keywords=="object"&&x.keywords.$pattern&&(x.keywords=Object.assign({},x.keywords),U=x.keywords.$pattern,delete x.keywords.$pattern),U=U||/\w+/,x.keywords&&(x.keywords=Ot(x.keywords,o.case_insensitive)),v.keywordPatternRe=h(U,!0),b&&(x.begin||(x.begin=/\B|\b/),v.beginRe=h(v.begin),!x.end&&!x.endsWithParent&&(x.end=/\B|\b/),x.end&&(v.endRe=h(v.end)),v.terminatorEnd=y(v.end)||"",x.endsWithParent&&b.terminatorEnd&&(v.terminatorEnd+=(x.end?"|":"")+b.terminatorEnd)),x.illegal&&(v.illegalRe=h(x.illegal)),x.contains||(x.contains=[]),x.contains=[].concat(...x.contains.map(function(z){return Qn(z==="self"?x:z)})),x.contains.forEach(function(z){B(z,v)}),x.starts&&B(x.starts,b),v.matcher=$(v),v}if(o.compilerExtensions||(o.compilerExtensions=[]),o.contains&&o.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return o.classNameAliases=r(o.classNameAliases||{}),B(o)}function Pt(o){return o?o.endsWithParent||Pt(o.starts):!1}function Qn(o){return o.variants&&!o.cachedVariants&&(o.cachedVariants=o.variants.map(function(h){return r(o,{variants:null},h)})),o.cachedVariants?o.cachedVariants:Pt(o)?r(o,{starts:o.starts?r(o.starts):null}):Object.isFrozen(o)?r(o):o}var Yn="11.11.1";class Vn extends Error{constructor(h,g){super(h),this.name="HTMLInjectionError",this.html=g}}const lt=n,$t=r,Bt=Symbol("nomatch"),er=7,Ht=function(o){const h=Object.create(null),g=Object.create(null),_=[];let $=!0;const B="Could not find the language '{}', did you forget to load/include a language module?",x={disableAutodetect:!0,name:"Plain text",contains:[]};let b={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:u};function v(f){return b.noHighlightRe.test(f)}function U(f){let k=f.className+" ";k+=f.parentNode?f.parentNode.className:"";const N=b.languageDetectRe.exec(k);if(N){const D=pe(N[1]);return D||(Lt(B.replace("{}",N[1])),Lt("Falling back to no-highlight mode for this block.",f)),D?N[1]:"no-highlight"}return k.split(/\s+/).find(D=>v(D)||pe(D))}function z(f,k,N){let D="",F="";typeof k=="object"?(D=f,N=k.ignoreIllegals,F=k.language):(Te("10.7.0","highlight(lang, code, ...args) has been deprecated."),Te("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),F=f,D=k),N===void 0&&(N=!0);const ee={code:D,language:F};Ge("before:highlight",ee);const fe=ee.result?ee.result:Ce(ee.language,ee.code,N);return fe.code=ee.code,Ge("after:highlight",fe),fe}function Ce(f,k,N,D){const F=Object.create(null);function ee(m,w){return m.keywords[w]}function fe(){if(!R.keywords){G.addText(P);return}let m=0;R.keywordPatternRe.lastIndex=0;let w=R.keywordPatternRe.exec(P),A="";for(;w;){A+=P.substring(m,w.index);const O=re.case_insensitive?w[0].toLowerCase():w[0],j=ee(R,O);if(j){const[ae,br]=j;if(G.addText(A),A="",F[O]=(F[O]||0)+1,F[O]<=er&&(qe+=br),ae.startsWith("_"))A+=w[0];else{const xr=re.classNameAliases[ae]||ae;ne(w[0],xr)}}else A+=w[0];m=R.keywordPatternRe.lastIndex,w=R.keywordPatternRe.exec(P)}A+=P.substring(m),G.addText(A)}function je(){if(P==="")return;let m=null;if(typeof R.subLanguage=="string"){if(!h[R.subLanguage]){G.addText(P);return}m=Ce(R.subLanguage,P,!0,qt[R.subLanguage]),qt[R.subLanguage]=m._top}else m=ut(P,R.subLanguage.length?R.subLanguage:null);R.relevance>0&&(qe+=m.relevance),G.__addSublanguage(m._emitter,m.language)}function W(){R.subLanguage!=null?je():fe(),P=""}function ne(m,w){m!==""&&(G.startScope(w),G.addText(m),G.endScope())}function Xt(m,w){let A=1;const O=w.length-1;for(;A<=O;){if(!m._emit[A]){A++;continue}const j=re.classNameAliases[m[A]]||m[A],ae=w[A];j?ne(ae,j):(P=ae,fe(),P=""),A++}}function Gt(m,w){return m.scope&&typeof m.scope=="string"&&G.openNode(re.classNameAliases[m.scope]||m.scope),m.beginScope&&(m.beginScope._wrap?(ne(P,re.classNameAliases[m.beginScope._wrap]||m.beginScope._wrap),P=""):m.beginScope._multi&&(Xt(m.beginScope,w),P="")),R=Object.create(m,{parent:{value:R}}),R}function jt(m,w,A){let O=Q(m.endRe,A);if(O){if(m["on:end"]){const j=new e(m);m["on:end"](w,j),j.isMatchIgnored&&(O=!1)}if(O){for(;m.endsParent&&m.parent;)m=m.parent;return m}}if(m.endsWithParent)return jt(m.parent,w,A)}function hr(m){return R.matcher.regexIndex===0?(P+=m[0],1):(ft=!0,0)}function pr(m){const w=m[0],A=m.rule,O=new e(A),j=[A.__beforeBegin,A["on:begin"]];for(const ae of j)if(ae&&(ae(m,O),O.isMatchIgnored))return hr(w);return A.skip?P+=w:(A.excludeBegin&&(P+=w),W(),!A.returnBegin&&!A.excludeBegin&&(P=w)),Gt(A,m),A.returnBegin?0:w.length}function fr(m){const w=m[0],A=k.substring(m.index),O=jt(R,m,A);if(!O)return Bt;const j=R;R.endScope&&R.endScope._wrap?(W(),ne(w,R.endScope._wrap)):R.endScope&&R.endScope._multi?(W(),Xt(R.endScope,m)):j.skip?P+=w:(j.returnEnd||j.excludeEnd||(P+=w),W(),j.excludeEnd&&(P=w));do R.scope&&G.closeNode(),!R.skip&&!R.subLanguage&&(qe+=R.relevance),R=R.parent;while(R!==O.parent);return O.starts&&Gt(O.starts,m),j.returnEnd?0:w.length}function gr(){const m=[];for(let w=R;w!==re;w=w.parent)w.scope&&m.unshift(w.scope);m.forEach(w=>G.openNode(w))}let Ze={};function Zt(m,w){const A=w&&w[0];if(P+=m,A==null)return W(),0;if(Ze.type==="begin"&&w.type==="end"&&Ze.index===w.index&&A===""){if(P+=k.slice(w.index,w.index+1),!$){const O=new Error(`0 width match regex (${f})`);throw O.languageName=f,O.badRule=Ze.rule,O}return 1}if(Ze=w,w.type==="begin")return pr(w);if(w.type==="illegal"&&!N){const O=new Error('Illegal lexeme "'+A+'" for mode "'+(R.scope||"<unnamed>")+'"');throw O.mode=R,O}else if(w.type==="end"){const O=fr(w);if(O!==Bt)return O}if(w.type==="illegal"&&A==="")return P+=`
`,1;if(pt>1e5&&pt>w.index*3)throw new Error("potential infinite loop, way more iterations than matches");return P+=A,A.length}const re=pe(f);if(!re)throw ye(B.replace("{}",f)),new Error('Unknown language: "'+f+'"');const mr=Kn(re);let ht="",R=D||mr;const qt={},G=new b.__emitter(b);gr();let P="",qe=0,we=0,pt=0,ft=!1;try{if(re.__emitTokens)re.__emitTokens(k,G);else{for(R.matcher.considerAll();;){pt++,ft?ft=!1:R.matcher.considerAll(),R.matcher.lastIndex=we;const m=R.matcher.exec(k);if(!m)break;const w=k.substring(we,m.index),A=Zt(w,m);we=m.index+A}Zt(k.substring(we))}return G.finalize(),ht=G.toHTML(),{language:f,value:ht,relevance:qe,illegal:!1,_emitter:G,_top:R}}catch(m){if(m.message&&m.message.includes("Illegal"))return{language:f,value:lt(k),illegal:!0,relevance:0,_illegalBy:{message:m.message,index:we,context:k.slice(we-100,we+100),mode:m.mode,resultSoFar:ht},_emitter:G};if($)return{language:f,value:lt(k),illegal:!1,relevance:0,errorRaised:m,_emitter:G,_top:R};throw m}}function ct(f){const k={value:lt(f),illegal:!1,relevance:0,_top:x,_emitter:new b.__emitter(b)};return k._emitter.addText(f),k}function ut(f,k){k=k||b.languages||Object.keys(h);const N=ct(f),D=k.filter(pe).filter(Ut).map(W=>Ce(W,f,!1));D.unshift(N);const F=D.sort((W,ne)=>{if(W.relevance!==ne.relevance)return ne.relevance-W.relevance;if(W.language&&ne.language){if(pe(W.language).supersetOf===ne.language)return 1;if(pe(ne.language).supersetOf===W.language)return-1}return 0}),[ee,fe]=F,je=ee;return je.secondBest=fe,je}function tr(f,k,N){const D=k&&g[k]||N;f.classList.add("hljs"),f.classList.add(`language-${D}`)}function dt(f){let k=null;const N=U(f);if(v(N))return;if(Ge("before:highlightElement",{el:f,language:N}),f.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",f);return}if(f.children.length>0&&(b.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(f)),b.throwUnescapedHTML))throw new Vn("One of your code blocks includes unescaped HTML.",f.innerHTML);k=f;const D=k.textContent,F=N?z(D,{language:N,ignoreIllegals:!0}):ut(D);f.innerHTML=F.value,f.dataset.highlighted="yes",tr(f,N,F.language),f.result={language:F.language,re:F.relevance,relevance:F.relevance},F.secondBest&&(f.secondBest={language:F.secondBest.language,relevance:F.secondBest.relevance}),Ge("after:highlightElement",{el:f,result:F,text:D})}function nr(f){b=$t(b,f)}const rr=()=>{Xe(),Te("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function ir(){Xe(),Te("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let zt=!1;function Xe(){function f(){Xe()}if(document.readyState==="loading"){zt||window.addEventListener("DOMContentLoaded",f,!1),zt=!0;return}document.querySelectorAll(b.cssSelector).forEach(dt)}function sr(f,k){let N=null;try{N=k(o)}catch(D){if(ye("Language definition for '{}' could not be registered.".replace("{}",f)),$)ye(D);else throw D;N=x}N.name||(N.name=f),h[f]=N,N.rawDefinition=k.bind(null,o),N.aliases&&Ft(N.aliases,{languageName:f})}function or(f){delete h[f];for(const k of Object.keys(g))g[k]===f&&delete g[k]}function ar(){return Object.keys(h)}function pe(f){return f=(f||"").toLowerCase(),h[f]||h[g[f]]}function Ft(f,{languageName:k}){typeof f=="string"&&(f=[f]),f.forEach(N=>{g[N.toLowerCase()]=k})}function Ut(f){const k=pe(f);return k&&!k.disableAutodetect}function lr(f){f["before:highlightBlock"]&&!f["before:highlightElement"]&&(f["before:highlightElement"]=k=>{f["before:highlightBlock"](Object.assign({block:k.el},k))}),f["after:highlightBlock"]&&!f["after:highlightElement"]&&(f["after:highlightElement"]=k=>{f["after:highlightBlock"](Object.assign({block:k.el},k))})}function cr(f){lr(f),_.push(f)}function ur(f){const k=_.indexOf(f);k!==-1&&_.splice(k,1)}function Ge(f,k){const N=f;_.forEach(function(D){D[N]&&D[N](k)})}function dr(f){return Te("10.7.0","highlightBlock will be removed entirely in v12.0"),Te("10.7.0","Please use highlightElement now."),dt(f)}Object.assign(o,{highlight:z,highlightAuto:ut,highlightAll:Xe,highlightElement:dt,highlightBlock:dr,configure:nr,initHighlighting:rr,initHighlightingOnLoad:ir,registerLanguage:sr,unregisterLanguage:or,listLanguages:ar,getLanguage:pe,registerAliases:Ft,autoDetection:Ut,inherit:$t,addPlugin:cr,removePlugin:ur}),o.debugMode=function(){$=!1},o.safeMode=function(){$=!0},o.versionString=Yn,o.regex={concat:C,lookahead:p,either:J,optional:E,anyNumberOfTimes:S};for(const f in Fe)typeof Fe[f]=="object"&&t(Fe[f]);return Object.assign(o,Fe),o},Re=Ht({});return Re.newInstance=()=>Ht({}),gt=Re,Re.HighlightJS=Re,Re.default=Re,gt}var Pi=Di();const De=Li(Pi);function $i(t){const e=t.regex,n={},r={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:e.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},r]});const i={className:"subst",begin:/\$\(/,end:/\)/,contains:[t.BACKSLASH_ESCAPE]},s=t.inherit(t.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),c={begin:/<<-?\s*(?=\w+)/,starts:{contains:[t.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},a={className:"string",begin:/"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,n,i]};i.contains.push(a);const d={match:/\\"/},l={className:"string",begin:/'/,end:/'/},u={match:/\\'/},y={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},t.NUMBER_MODE,n]},p=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],S=t.SHEBANG({binary:`(${p.join("|")})`,relevance:10}),E={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[t.inherit(t.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},C=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],K=["true","false"],J={match:/(\/[a-z._-]+)+/},q=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],Q=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],oe=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],Y=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:C,literal:K,built_in:[...q,...Q,"set","shopt",...oe,...Y]},contains:[S,t.SHEBANG(),E,y,s,c,J,a,d,l,u,n]}}const tt="[A-Za-z$_][0-9A-Za-z$_]*",En=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Sn=["true","false","null","undefined","NaN","Infinity"],vn=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],_n=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Tn=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Rn=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],An=[].concat(Tn,vn,_n);function Bi(t){const e=t.regex,n=(X,{after:he})=>{const xe="</"+X[0].slice(1);return X.input.indexOf(xe,he)!==-1},r=tt,i={begin:"<>",end:"</>"},s=/<[A-Za-z0-9\\._:-]+\s*\/>/,c={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(X,he)=>{const xe=X[0].length+X.index,_e=X.input[xe];if(_e==="<"||_e===","){he.ignoreMatch();return}_e===">"&&(n(X,{after:xe})||he.ignoreMatch());let Ae;const ze=X.input.substring(xe);if(Ae=ze.match(/^\s*=/)){he.ignoreMatch();return}if((Ae=ze.match(/^\s+extends\s+/))&&Ae.index===0){he.ignoreMatch();return}}},a={$pattern:tt,keyword:En,literal:Sn,built_in:An,"variable.language":Rn},d="[0-9](_?[0-9])*",l=`\\.(${d})`,u="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",y={className:"number",variants:[{begin:`(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${d})\\b`},{begin:`\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},p={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},S={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,p],subLanguage:"xml"}},E={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,p],subLanguage:"css"}},C={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,p],subLanguage:"graphql"}},K={className:"string",begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,p]},q={className:"comment",variants:[t.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]},Q=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,S,E,C,K,{match:/\$\d+/},y];p.contains=Q.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(Q)});const oe=[].concat(q,p.contains),Y=oe.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(oe)}]),V={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:Y},te={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,e.concat(r,"(",e.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},ve={relevance:0,match:e.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...vn,..._n]}},Pe={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},$e={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[V],illegal:/%/},Be={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function it(X){return e.concat("(?!",X.join("|"),")")}const st={match:e.concat(/\b/,it([...Tn,"super","import"].map(X=>`${X}\\s*\\(`)),r,e.lookahead(/\s*\(/)),className:"title.function",relevance:0},be={begin:e.concat(/\./,e.lookahead(e.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},ot={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},V]},He="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",at={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,e.lookahead(He)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[V]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:Y,CLASS_REFERENCE:ve},illegal:/#(?![$_A-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",relevance:5}),Pe,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,S,E,C,K,q,{match:/\$\d+/},y,ve,{scope:"attr",match:r+e.lookahead(":"),relevance:0},at,{begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[q,t.REGEXP_MODE,{className:"function",begin:He,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:Y}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:i.begin,end:i.end},{match:s},{begin:c.begin,"on:begin":c.isTrulyOpeningTag,end:c.end}],subLanguage:"xml",contains:[{begin:c.begin,end:c.end,skip:!0,contains:["self"]}]}]},$e,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[V,t.inherit(t.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},be,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[V]},st,Be,te,ot,{match:/\$[(.]/}]}}function Hi(t){const e=t.regex,n=Bi(t),r=tt,i=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],s={begin:[/namespace/,/\s+/,t.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},c={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:i},contains:[n.exports.CLASS_REFERENCE]},a={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},d=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],l={$pattern:tt,keyword:En.concat(d),literal:Sn,built_in:An.concat(i),"variable.language":Rn},u={className:"meta",begin:"@"+r},y=(C,K,J)=>{const q=C.contains.findIndex(Q=>Q.label===K);if(q===-1)throw new Error("can not find mode to replace");C.contains.splice(q,1,J)};Object.assign(n.keywords,l),n.exports.PARAMS_CONTAINS.push(u);const p=n.contains.find(C=>C.scope==="attr"),S=Object.assign({},p,{match:e.concat(r,e.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,p,S]),n.contains=n.contains.concat([u,s,c,S]),y(n,"shebang",t.SHEBANG()),y(n,"use_strict",a);const E=n.contains.find(C=>C.label==="func.def");return E.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}function zi(t){const e=t.regex,n=e.concat(/[\p{L}_]/u,e.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,i={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},s={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},c=t.inherit(s,{begin:/\(/,end:/\)/}),a=t.inherit(t.APOS_STRING_MODE,{className:"string"}),d=t.inherit(t.QUOTE_STRING_MODE,{className:"string"}),l={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[i]},{begin:/'/,end:/'/,contains:[i]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[s,d,a,c,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[s,c,d,a]}]}]},t.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},i,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[d]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[l],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[l],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:e.concat(/</,e.lookahead(e.concat(n,e.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:l}]},{className:"tag",begin:e.concat(/<\//,e.lookahead(e.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}const Et=ge("todo"),Fi=Ie(()=>{const t=Et();if(typeof t=="string"||!t)return'<p class="border rounded-md p-2">Start editing to get a preview!</p>';const e=ln(t);return e instanceof Text?'<p class="border rounded-md p-2">Start editing to get a preview!</p>':(console.log("Preview HTML:",e.outerHTML),Cn(e),e.outerHTML)}),mt="editor_content";function Ui(){const t=r=>{r.preventDefault();const i=document.getSelection();if(!i||i.rangeCount===0)return;const s=i.getRangeAt(0);if(s.collapsed)return;const c=document.createElement("strong");try{s.surroundContents(c),i.removeAllRanges(),e()}catch{try{const d=s.extractContents();c.appendChild(d),s.insertNode(c),i.removeAllRanges(),e()}catch(d){console.warn("Could not apply bold formatting:",d)}}},e=()=>{const r=document.getElementById(mt);r&&Et(an(r))};return H("div",{class:"p-2 w-full flex flex-auto gap-4 flex-col",children:[H("div",{id:"article_editor",children:[H("div",{id:"edit_buttons",class:"p-2 flex gap-2",children:[T("span",{children:"Formatting:"}),T("button",{class:"p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700",onMouseDown:t,title:"Bold selected text",children:T("strong",{children:"B"})})]}),T("div",{class:"border-2 rounded-md p-2 bg-white text-black",children:T("div",{id:mt,class:"",children:T("article",{contenteditable:"true",onInput:r=>{e()},children:H("p",{children:["Edit me! Select some text and click the ",T("strong",{children:"B"})," button to make it bold."]})})})})]}),H("div",{children:[T("p",{class:"text-xl font-semibold",children:"Preview:"}),T("div",{class:"p-2 border-2 bg-white text-black",children:T("div",{innerHTML:Fi})})]}),H("div",{class:"p-2 bg-purple-950 rounded-md",children:[T("p",{class:"text-xl font-semibold",children:"JSON:"}),T("div",{class:"bg-black/20 p-2 border-2 border-gray-500 rounded-md",children:T("output",{class:"",name:"json_output",htmlFor:mt,children:T("pre",{class:"overflow-x-scroll",children:()=>JSON.stringify(Et(),null,"  ")})})})]})]})}function Cn(t){t.removeAttribute("contenteditable");for(const e of t.children)Cn(e)}const Xi=`import {
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
}`;De.registerLanguage("typescript",Hi);De.registerLanguage("html",zi);De.registerLanguage("bash",$i);const Gi=kn(Ii);function nn(t){document.title=t}function rn(t){const e=document.querySelector('meta[name="description"]');e&&e.setAttribute("content",t)}function ji(){const t=on(),e=Ie(()=>{const r=Or("doc")()||"main";return cn.find(s=>s.route_name==r)}),n=Ie(()=>{const r=e();if(r){const i=kn(r.data);return console.log("parsedMarkdown",i),i}return""});return de(()=>{const r=e();console.log("createEffect MD_DOC",r),r?(nn(`${r.title} | HyperFX`),rn(`HyperFX docs about ${r.title}.`)):(nn("HyperFX"),rn("HyperFX docs"))}),de(()=>{t(),setTimeout(()=>{const r=document.querySelectorAll("pre code");for(const i of r)De.highlightElement(i)},0)}),H(sn,{children:[T(Jt,{when:()=>e()!==void 0&&e().route_name!=="main",children:H("div",{class:"flex flex-auto",children:[T(Kr,{}),T("article",{class:"p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl",children:T("div",{class:"markdown-body",innerHTML:n})})]})}),T(Jt,{when:()=>e()===void 0||e().route_name==="main",children:H("div",{class:"flex-grow flex flex-col",children:[T("article",{class:"p-4 mx-auto w-full max-w-4xl",children:T("div",{class:"markdown-body-main",innerHTML:Gi})}),H("div",{class:"p-2 bg-red-950 text-white mt-4 mx-auto",children:[T("p",{class:"text-xl",children:"This is a work in progress!"}),T("p",{class:"text-xl",children:"The docs are not finished yet!"})]})]})})]})}function Zi(){const t=Ui(),e=T("pre",{class:"mx-auto !max-w-[70vw] max-h-[50vw]",children:T("code",{class:"language-tsx",children:Xi})});return de(()=>{setTimeout(()=>{const n=document.querySelector("pre code");n&&De.highlightElement(n)},0)}),H("div",{class:"flex flex-col p-4 max-w-[80vw] mx-auto",children:[H("div",{class:"p-2",children:[H("p",{class:"mx-auto",children:["This is the code used to create the editor.",H("span",{class:"text-purple-500/80",children:[" ","(The editor is far from done but it is still cool IMO.)"]})]}),T("div",{class:"w-full",children:e})]}),t]})}function qi(){const t=Mr(),e=on();return de(()=>{e()==="/"&&t("/hyperfx")}),H("div",{class:"flex flex-auto flex-col min-h-screen",children:[T(Wr,{}),H("main",{class:"flex flex-auto flex-col",id:"main-content",children:[T("p",{class:"p-2 bg-red-800 text-white text-center w-full! max-w-full!",children:"A LOT OF CHANGES. DOCS ARE NOT UP TO DATE."}),T(Wt,{path:"/hyperfx",component:ji}),T(Wt,{path:"/hyperfx/editor",component:Zi})]}),H("footer",{class:"bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto",children:[T("a",{href:"https://github.com/ArnoudK/hyperfx",target:"_blank",class:"underline",children:"Github"}),T("span",{class:"w-full ",children:" - © Arnoud Kerkhof"})]})]})}function Wi(){return T(Nr,{initialPath:"/hyperfx",children:()=>T(qi,{})})}const Ji=document.getElementById("app");Ji.replaceChildren(Wi());
