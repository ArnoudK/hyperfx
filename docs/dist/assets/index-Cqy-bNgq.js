(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();let ie=!1;const ae=new Set;class wr{constructor(e){this.subscribers=new Set,this._value=e}get(){return ie&&ae.add(this.callableSignal),this._value}set(e){return Object.is(this._value,e)||(this._value=e,this.subscribers.forEach(n=>{try{n(e)}catch(s){console.error("Signal subscriber error:",s)}})),e}subscribe(e){return this.subscribers.add(e),()=>{this.subscribers.delete(e)}}peek(){return this._value}update(e){return this.set(e(this._value))}get subscriberCount(){return this.subscribers.size}}function ge(t){const e=new wr(t),n=Object.assign(s=>s!==void 0?e.set(s):e.get(),{get:()=>e.get(),set:s=>e.set(s),subscribe:s=>e.subscribe(s),peek:()=>e.peek(),update:s=>e.update(s),get subscriberCount(){return e.subscriberCount}});return e.callableSignal=n,n}function kr(t){const e=ie;ie=!0,ae.clear();let n;try{n=t()}finally{ie=e}const s=ge(n),r=Array.from(ae);ae.clear();const i=s.set;s.set=()=>{throw new Error("Cannot set computed signal directly. Computed signals are read-only.")};const a=r.map(l=>l.subscribe(()=>{const d=t();i(d)}));return s._unsubscribers=a,s}function Er(t){const e=ie;ie=!0,ae.clear();let n;n=t();const r=Array.from(ae).map(i=>i.subscribe(()=>{const a=ie;ie=!0,ae.clear(),typeof n=="function"&&n(),n=t(),ie=a,ae.clear()}));return ie=e,ae.clear(),()=>{r.forEach(i=>{i()}),typeof n=="function"&&n()}}function ue(t){return typeof t=="function"&&"subscribe"in t&&"get"in t&&"set"in t}let Sr=0;function vr(){return typeof window>"u"||typeof document>"u"}function Tr(){return String(++Sr).padStart(6,"0")}const _r=Symbol("HyperFX.Fragment");function Rr(t,e){let n;if(n=document.createElement(t),vr()||n.setAttribute("data-hfxh",Tr()),e){for(const[s,r]of Object.entries(e))if(s!=="children"&&s!=="key")if(s==="innerHTML"||s==="textContent"){const i=()=>{const a=ue(r)?r():r;n[s]=a};ue(r)&&r.subscribe(i),i()}else if(s.startsWith("on")&&typeof r=="function"){const i=s.slice(2).toLowerCase();n.addEventListener(i,r)}else if(ue(r)){const i=()=>{const a=r();a==null?s==="value"&&n instanceof HTMLInputElement?n.value="":s==="checked"&&n instanceof HTMLInputElement?n.checked=!1:n.removeAttribute(s):s==="value"&&n instanceof HTMLInputElement?n.value=String(a):s==="checked"&&n instanceof HTMLInputElement?n.checked=!!a:s==="disabled"&&typeof a=="boolean"?a?(n.setAttribute("disabled",""),n.disabled=!0):(n.removeAttribute("disabled"),n.disabled=!1):s==="class"||s==="className"?n.className=String(a):n.setAttribute(s,String(a))};i(),r.subscribe(i)}else r!=null&&(s==="value"&&n instanceof HTMLInputElement?n.value=String(r):s==="checked"&&n instanceof HTMLInputElement?n.checked=!!r:s==="disabled"&&typeof r=="boolean"?r?(n.setAttribute("disabled",""),n.disabled=!0):(n.removeAttribute("disabled"),n.disabled=!1):n.setAttribute(s,String(r)))}return n}function Ar(t){const e=document.createTextNode(""),n=()=>{let s="";ue(t)?s=String(t()):s=String(t),e.textContent=s};return n(),ue(t)&&t.subscribe(n),e}function sn(t,e,n){const s=Array.isArray(e)?e:[e];for(const r of s)if(!(r==null||r===!1||r===!0))if(ue(r)){const i=r();if(i instanceof Node)t.appendChild(i);else{const a=Ar(r);t.appendChild(a)}}else if(typeof r=="function")try{const i=r();if(i instanceof Node)t.appendChild(i),n?.add(i);else if(Array.isArray(i))sn(t,i,n);else{const a=document.createTextNode(String(i));t.appendChild(a),n?.add(a)}}catch(i){console.warn("Error rendering function child:",i)}else if(typeof r=="object"&&r instanceof Node)t.appendChild(r);else{const i=document.createTextNode(String(r));t.appendChild(i)}}function mt(t,e){if(!e)return;sn(t,e,void 0)}function R(t,e,n){if(t===_r||t===on){const r=e?.children,i=document.createDocumentFragment();return mt(i,r),i}if(typeof t=="function"){const r=new Proxy(e||{},{get(i,a,l){const d=Reflect.get(i,a,l);return ue(d)?d():d}});return t(r)}const s=Rr(t,e);return e?.children&&mt(s,e.children),s}const $=R;function on(t){const e=document.createDocumentFragment();return mt(e,t.children),e}function Oe(t){return kr(t)}function de(t){return Er(t)}const bt=new Map;function Cr(t){const e=Symbol("Context");return{id:e,defaultValue:t,Provider:s=>{let r=bt.get(e);r||(r=[],bt.set(e,r)),r.push(s.value);let i;try{typeof s.children=="function"?i=s.children():(console.warn("Context.Provider: children should be a function to receive context value."),i=s.children)}finally{r.pop()}if(Array.isArray(i)){const a=document.createDocumentFragment();return i.forEach(l=>{l instanceof Node&&a.appendChild(l)}),a}return i}}}function Re(t){const e=bt.get(t.id);return e&&e.length>0?e[e.length-1]:t.defaultValue}const we=Cr(null);function Nr(t){Re(we)&&console.warn("Router: Nested routers are not fully supported yet");const n=ge(t.initialPath||window.location.pathname+window.location.search),s=ge([n()]),r=ge(0);de(()=>{const c=()=>{const g=window.location.pathname+window.location.search||"/";n(g);const w=[...s()];w[r()]=g,s(w)};return window.addEventListener("popstate",c),()=>{window.removeEventListener("popstate",c)}});const d={currentPath:n,navigate:(c,g={})=>{if(console.log("Router: navigate called",c),g.replace){window.history.replaceState({},"",c);const w=[...s()];w[r()]=c,s(w)}else{window.history.pushState({},"",c);const w=[...s().slice(0,r()+1),c];s(w),r(r()+1)}console.log("Router: updating currentPath signal",c),n(c)},back:()=>{if(r()>0){const c=r()-1;r(c);const g=s()[c]||"/";window.history.back(),n(g)}},forward:()=>{if(r()<s().length-1){const c=r()+1;r(c);const g=s()[c]||"/";window.history.forward(),n(g)}}};return we.Provider({value:d,children:t.children})}function Wt(t){const e=document.createDocumentFragment(),n=document.createComment(`Route start: ${t.path}`),s=document.createComment(`Route end: ${t.path}`);e.appendChild(n),e.appendChild(s);let r=[],i=!1;const{path:a,component:l,children:d,exact:c,...g}=t,w=Re(we);return de(()=>{if(!w)return;const x=w.currentPath,E=x().split("?")[0],S=c!==void 0&&c?E===a:E.startsWith(a);if(S===i)return;i=S;const B=n.parentNode||e;if(r.forEach(M=>{M.parentNode===B&&M.parentNode?.removeChild(M)}),r=[],S){let M;l?M=l({...g}):typeof d=="function"?M=d():M=d,M&&(Array.isArray(M)?M:[M]).forEach(W=>{if(W instanceof Node)B.insertBefore(W,s),r.push(W);else if(W!=null){const K=document.createTextNode(String(W));B.insertBefore(K,s),r.push(K)}})}}),e}function Je(t){const e=document.createElement("a");e.href=t.to,e.className=t.class!==void 0?t.class:"";const n=Re(we);console.log("Link: render",t.to,"context:",!!n);const s=r=>{console.log("Link: clicked",t.to),r.preventDefault(),t.onClick&&t.onClick(r),n?n.navigate(t.to,{replace:t.replace!==void 0?t.replace:!1}):(window.history.pushState({},"",t.to),window.dispatchEvent(new PopStateEvent("popstate")))};return e.addEventListener("click",s),de(()=>{if(!n)return;const r=n.currentPath,i=r(),a=t.exact!==void 0&&t.exact?i===t.to:i.startsWith(t.to),l=t.activeClass!==void 0?t.activeClass:"active";a?e.classList.add(l):e.classList.remove(l)}),typeof t.children=="string"?e.textContent=t.children:Array.isArray(t.children)?t.children.forEach(r=>{e.appendChild(r)}):t.children&&e.appendChild(t.children),e}function an(){const t=Re(we);return t?t.currentPath:ge(window.location.pathname)}function Mr(){const t=Re(we);return(e,n)=>{t?t.navigate(e,n):n?.replace?window.history.replaceState({},"",e):window.history.pushState({},"",e)}}function Ir(t){const e=Re(we);return Oe(()=>(e&&e.currentPath(),new URLSearchParams(window.location.search).get(t)))}function Or(t){const e=document.createDocumentFragment(),n=document.createComment("For start"),s=document.createComment("For end");e.appendChild(n),e.appendChild(s);const r=Array.isArray(t.children)?t.children[0]:t.children;if(typeof r!="function")throw typeof r=="object"&&console.error("Received object:",r),new Error(`For component children must be a function that renders each item.
Expected (item, index) => JSXElement. Got ${typeof r}`);const i=new Map,a=()=>{let l;Array.isArray(t.each)?l=t.each:ue(t.each)||typeof t.each=="function"?l=t.each():l=t.each,Array.isArray(l)||(l=[]);const d=n.parentNode||e,c=[],g=new Map;i.forEach((x,A)=>{g.set(A,[...x])}),l.forEach((x,A)=>{let E;const S=g.get(x);if(S&&S.length>0)E=S.shift(),E.indexSignal(A);else{const q=ge(A),B=r(x,q);let M=[];B instanceof DocumentFragment?M=Array.from(B.childNodes):B&&(M=[B]),E={nodes:M,indexSignal:q}}c.push(E)}),g.forEach(x=>{x.forEach(A=>{A.nodes.forEach(E=>{E.parentNode===d&&d.removeChild(E)})})});let w=n.nextSibling;c.forEach(x=>{const A=x.nodes;if(A.length===0)return;A[0]===w?w=A[A.length-1].nextSibling:A.forEach(S=>{d.insertBefore(S,w)})}),i.clear(),c.forEach((x,A)=>{const E=l[A],S=i.get(E)||[];S.push(x),i.set(E,S)})};return ue(t.each)?de(a):a(),e}function Jt(t){const e=document.createDocumentFragment(),n=document.createComment("Show start"),s=document.createComment("Show end");e.appendChild(n),e.appendChild(s);let r=[];return de(()=>{const a=typeof t.when=="function"?t.when():t.when,l=n.parentNode;let d=null;a?d=typeof t.children=="function"?t.children():t.children:t.fallback&&(d=typeof t.fallback=="function"?t.fallback():t.fallback);const c=l||e;r.forEach(g=>{g.parentNode===c&&c.removeChild(g)}),r=[],d&&(Array.isArray(d)?d:[d]).forEach(w=>{c.insertBefore(w,s),r.push(w)})}),e}function Lr(t){const e=t.tagName,n={},s=[],r=t.childNodes,i=t.attributes;for(const a of i){const l=a.name,d=a.value;n[l]=d}for(const a of r)s.push(ln(a));return{tag:e,attrs:n,children:s}}function ln(t){return t instanceof Text?t.textContent??"":Lr(t)}function cn(t){if(typeof t=="string")return document.createTextNode(t);const e=document.createElement(t.tag);for(const s of t.children)e.appendChild(cn(s));const n=Object.keys(t.attrs);for(const s of n)e.setAttribute(s,t.attrs[s]);return e}class Pr{constructor(){this.metrics={renderCount:0,lastRenderTime:0,averageRenderTime:0,totalRenderTime:0,componentCount:0},this.renderStartTime=0,this.enabled=!1}enable(){this.enabled=!0}disable(){this.enabled=!1}startRender(){this.enabled&&(this.renderStartTime=performance.now())}endRender(){if(!this.enabled||this.renderStartTime===0)return;const e=performance.now()-this.renderStartTime;this.metrics.renderCount++,this.metrics.lastRenderTime=e,this.metrics.totalRenderTime+=e,this.metrics.averageRenderTime=this.metrics.totalRenderTime/this.metrics.renderCount,"memory"in performance&&(this.metrics.memoryUsage=performance.memory.usedJSHeapSize),this.renderStartTime=0}incrementComponentCount(){this.enabled&&this.metrics.componentCount++}decrementComponentCount(){this.enabled&&(this.metrics.componentCount=Math.max(0,this.metrics.componentCount-1))}getMetrics(){return{...this.metrics}}reset(){this.metrics={renderCount:0,lastRenderTime:0,averageRenderTime:0,totalRenderTime:0,componentCount:0}}logMetrics(){console.group("🚀 HyperFX Performance Metrics"),console.log("Render Count:",this.metrics.renderCount),console.log("Last Render Time:",`${this.metrics.lastRenderTime.toFixed(2)}ms`),console.log("Average Render Time:",`${this.metrics.averageRenderTime.toFixed(2)}ms`),console.log("Total Render Time:",`${this.metrics.totalRenderTime.toFixed(2)}ms`),console.log("Active Components:",this.metrics.componentCount),this.metrics.memoryUsage&&console.log("Memory Usage:",`${(this.metrics.memoryUsage/1024/1024).toFixed(2)}MB`),console.groupEnd()}}const Dr=new Pr,$r=()=>typeof window<"u"&&window.__HYPERFX_DEV__;class Br{constructor(){this.componentTree=null,this.componentMap=new Map,this.renderCounts=new Map,this.enabled=!1}enable(){this.enabled=!0,typeof window<"u"&&(window.__HYPERFX_DEVTOOLS__=this,this.createDevToolsUI())}disable(){this.enabled=!1,typeof window<"u"&&(delete window.__HYPERFX_DEVTOOLS__,this.removeDevToolsUI())}trackComponent(e,n,s,r,i){if(!this.enabled)return;const a=this.renderCounts.get(e)||0;this.renderCounts.set(e,a+1);const l={id:e,type:n,props:this.sanitizeProps(s),children:this.analyzeChildren(r),renderTime:i,updateCount:a+1};this.componentMap.set(e,l),this.updateComponentTree(),this.refreshDevToolsUI()}sanitizeProps(e){const n={};for(const[s,r]of Object.entries(e))if(typeof r=="function")n[s]="[Function]";else if(r instanceof HTMLElement)n[s]=`[HTMLElement: ${r.tagName}]`;else if(r&&typeof r=="object")try{JSON.stringify(r),n[s]=r}catch{n[s]="[Object]"}else n[s]=r;return n}analyzeChildren(e){const n=[];for(const s of e)s instanceof HTMLElement?n.push({id:`dom-${s.tagName.toLowerCase()}-${Date.now()}-${Math.random()}`,type:s.tagName.toLowerCase(),props:this.getElementAttributes(s),children:this.analyzeDOMChildren(s)}):s instanceof DocumentFragment?n.push({id:`fragment-${Date.now()}-${Math.random()}`,type:"DocumentFragment",props:{},children:this.analyzeDOMChildren(s)}):s instanceof Text&&n.push({id:`text-${Date.now()}-${Math.random()}`,type:"Text",props:{content:s.textContent},children:[]});return n}getElementAttributes(e){const n={};for(const s of e.attributes)n[s.name]=s.value;return n}analyzeDOMChildren(e){const n=[];for(const s of e.children)n.push(s);return this.analyzeChildren(n)}updateComponentTree(){const e=Array.from(this.componentMap.values()),n=new Set;e.forEach(r=>{r.children.forEach(i=>n.add(i.id))});const s=e.filter(r=>!n.has(r.id));this.componentTree={id:"root",type:"Application",props:{},children:s}}createDevToolsUI(){if(document.getElementById("hyperfx-devtools"))return;const e=document.createElement("div");e.id="hyperfx-devtools",e.style.cssText=`
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
    `,n.innerHTML="<span>HyperFX DevTools</span>";const s=document.createElement("button");s.textContent="×",s.style.cssText=`
      background: none;
      border: none;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    `,s.onclick=()=>{e.style.display="none"},n.appendChild(s);const r=document.createElement("div");r.id="hyperfx-devtools-content",r.style.cssText=`
      padding: 10px;
    `,e.appendChild(n),e.appendChild(r),document.body.appendChild(e);const i=document.createElement("button");i.id="hyperfx-devtools-toggle",i.textContent="DevTools",i.style.cssText=`
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
    `,i.onclick=()=>{const a=e.style.display!=="none";e.style.display=a?"none":"block",i.style.right=a?"410px":"10px"},document.body.appendChild(i)}removeDevToolsUI(){const e=document.getElementById("hyperfx-devtools"),n=document.getElementById("hyperfx-devtools-toggle");e&&e.remove(),n&&n.remove()}refreshDevToolsUI(){const e=document.getElementById("hyperfx-devtools-content");if(!e||!this.componentTree)return;const n=Dr.getMetrics();let s=`
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; color: #4CAF50;">Performance Metrics</h4>
        <pre style="margin: 0; font-size: 11px;">${JSON.stringify(n,null,2)}</pre>
      </div>
    `;s+=`
      <div>
        <h4 style="margin: 0 0 5px 0; color: #2196F3;">Component Tree</h4>
        <pre style="margin: 0; font-size: 11px;">${JSON.stringify(this.componentTree,null,2)}</pre>
      </div>
    `,e.innerHTML=s}getComponentInfo(e){return this.componentMap.get(e)||null}getAllComponents(){return Array.from(this.componentMap.values())}clearTracking(){this.componentMap.clear(),this.renderCounts.clear(),this.componentTree=null,this.refreshDevToolsUI()}}const Hr=new Br;$r()&&typeof window<"u"&&setTimeout(()=>{Hr.enable()},100);const zr=`# The basics

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
`,qr="/hyperfx?doc=",un=[{title:"Get Started",route_name:"get_started",data:Xr},{title:"HyperFX basics",route_name:"basics",data:zr},{title:"State Management",route_name:"state-management",data:Gr},{title:"Rendering & Control Flow",route_name:"render",data:jr},{title:"HyperFX components",route_name:"components",data:Ur},{title:"Single Page Application",route_name:"spa",data:Fr},{title:"Server-Side Rendering",route_name:"ssr",data:Zr}];function Wr(){return $("nav",{class:"flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg",children:[R(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx",children:"Home"}),R(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx?doc=get_started",children:"Docs"}),R(Je,{class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:"/hyperfx/editor",children:"Example"})]})}const xt=ge(!1);function Jr(){console.log(xt(!xt()))}function Kr(){const t=Oe(()=>`flex-col sm:flex gap-1 ${xt()?"flex":"hidden"}`);return $("aside",{class:"bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl",children:[R("div",{class:"flex items-center justify-between mb-6 sm:hidden",children:$("button",{class:"text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform",title:"Toggle Navigation",onclick:Jr,children:[R("span",{class:"text-lg",children:"☰"}),R("span",{class:"sr-only",children:"Toggle Navigation"})]})}),$("nav",{class:t,children:[R("p",{class:"hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3",children:"Fundamentals"}),R(Or,{each:un,children:e=>R(Je,{class:"px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block",to:`${qr}${e.route_name}`,children:e.title})})]})]})}function St(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ee=St();function dn(t){Ee=t}var Ie={exec:()=>null};function I(t,e=""){let n=typeof t=="string"?t:t.source;const s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(J.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,e)};return s}var J={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},Qr=/^(?:[ \t]*(?:\n|$))+/,Vr=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Yr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Le=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,es=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,vt=/(?:[*+-]|\d{1,9}[.)])/,hn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,pn=I(hn).replace(/bull/g,vt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ts=I(hn).replace(/bull/g,vt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Tt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ns=/^[^\n]+/,_t=/(?!\s*\])(?:\\.|[^\[\]\\])+/,rs=I(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",_t).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ss=I(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,vt).getRegex(),tt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Rt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,is=I("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Rt).replace("tag",tt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),fn=I(Tt).replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex(),os=I(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",fn).getRegex(),At={blockquote:os,code:Vr,def:rs,fences:Yr,heading:es,hr:Le,html:is,lheading:pn,list:ss,newline:Qr,paragraph:fn,table:Ie,text:ns},Kt=I("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex(),as={...At,lheading:ts,table:Kt,paragraph:I(Tt).replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Kt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tt).getRegex()},ls={...At,html:I(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Rt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ie,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:I(Tt).replace("hr",Le).replace("heading",` *#{1,6} *[^
]`).replace("lheading",pn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},cs=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,us=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,gn=/^( {2,}|\\)\n(?!\s*$)/,ds=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,nt=/[\p{P}\p{S}]/u,Ct=/[\s\p{P}\p{S}]/u,mn=/[^\s\p{P}\p{S}]/u,hs=I(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ct).getRegex(),bn=/(?!~)[\p{P}\p{S}]/u,ps=/(?!~)[\s\p{P}\p{S}]/u,fs=/(?:[^\s\p{P}\p{S}]|~)/u,gs=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,xn=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,ms=I(xn,"u").replace(/punct/g,nt).getRegex(),bs=I(xn,"u").replace(/punct/g,bn).getRegex(),yn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",xs=I(yn,"gu").replace(/notPunctSpace/g,mn).replace(/punctSpace/g,Ct).replace(/punct/g,nt).getRegex(),ys=I(yn,"gu").replace(/notPunctSpace/g,fs).replace(/punctSpace/g,ps).replace(/punct/g,bn).getRegex(),ws=I("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,mn).replace(/punctSpace/g,Ct).replace(/punct/g,nt).getRegex(),ks=I(/\\(punct)/,"gu").replace(/punct/g,nt).getRegex(),Es=I(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ss=I(Rt).replace("(?:-->|$)","-->").getRegex(),vs=I("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ss).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Qe=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Ts=I(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",Qe).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),wn=I(/^!?\[(label)\]\[(ref)\]/).replace("label",Qe).replace("ref",_t).getRegex(),kn=I(/^!?\[(ref)\](?:\[\])?/).replace("ref",_t).getRegex(),_s=I("reflink|nolink(?!\\()","g").replace("reflink",wn).replace("nolink",kn).getRegex(),Nt={_backpedal:Ie,anyPunctuation:ks,autolink:Es,blockSkip:gs,br:gn,code:us,del:Ie,emStrongLDelim:ms,emStrongRDelimAst:xs,emStrongRDelimUnd:ws,escape:cs,link:Ts,nolink:kn,punctuation:hs,reflink:wn,reflinkSearch:_s,tag:vs,text:ds,url:Ie},Rs={...Nt,link:I(/^!?\[(label)\]\((.*?)\)/).replace("label",Qe).getRegex(),reflink:I(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Qe).getRegex()},yt={...Nt,emStrongRDelimAst:ys,emStrongLDelim:bs,url:I(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},As={...yt,br:I(gn).replace("{2,}","*").getRegex(),text:I(yt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},We={normal:At,gfm:as,pedantic:ls},Ne={normal:Nt,gfm:yt,breaks:As,pedantic:Rs},Cs={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Qt=t=>Cs[t];function se(t,e){if(e){if(J.escapeTest.test(t))return t.replace(J.escapeReplace,Qt)}else if(J.escapeTestNoEncode.test(t))return t.replace(J.escapeReplaceNoEncode,Qt);return t}function Vt(t){try{t=encodeURI(t).replace(J.percentDecode,"%")}catch{return null}return t}function Yt(t,e){const n=t.replace(J.findPipe,(i,a,l)=>{let d=!1,c=a;for(;--c>=0&&l[c]==="\\";)d=!d;return d?"|":" |"}),s=n.split(J.splitPipe);let r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(J.slashPipe,"|");return s}function Me(t,e,n){const s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function Ns(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function en(t,e,n,s,r){const i=e.href,a=e.title||null,l=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;const d={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,d}function Ms(t,e,n){const s=t.match(n.other.indentCodeCompensation);if(s===null)return e;const r=s[1];return e.split(`
`).map(i=>{const a=i.match(n.other.beginningSpace);if(a===null)return i;const[l]=a;return l.length>=r.length?i.slice(r.length):i}).join(`
`)}var Ve=class{options;rules;lexer;constructor(t){this.options=t||Ee}space(t){const e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){const e=this.rules.block.code.exec(t);if(e){const n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Me(n,`
`)}}}fences(t){const e=this.rules.block.fences.exec(t);if(e){const n=e[0],s=Ms(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){const e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){const s=Me(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){const e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Me(e[0],`
`)}}blockquote(t){const e=this.rules.block.blockquote.exec(t);if(e){let n=Me(e[0],`
`).split(`
`),s="",r="";const i=[];for(;n.length>0;){let a=!1;const l=[];let d;for(d=0;d<n.length;d++)if(this.rules.other.blockquoteStart.test(n[d]))l.push(n[d]),a=!0;else if(!a)l.push(n[d]);else break;n=n.slice(d);const c=l.join(`
`),g=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${c}`:c,r=r?`${r}
${g}`:g;const w=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(g,i,!0),this.lexer.state.top=w,n.length===0)break;const x=i.at(-1);if(x?.type==="code")break;if(x?.type==="blockquote"){const A=x,E=A.raw+`
`+n.join(`
`),S=this.blockquote(E);i[i.length-1]=S,s=s.substring(0,s.length-A.raw.length)+S.raw,r=r.substring(0,r.length-A.text.length)+S.text;break}else if(x?.type==="list"){const A=x,E=A.raw+`
`+n.join(`
`),S=this.list(E);i[i.length-1]=S,s=s.substring(0,s.length-x.raw.length)+S.raw,r=r.substring(0,r.length-A.raw.length)+S.raw,n=E.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim();const s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");const i=this.rules.other.listItemRegex(n);let a=!1;for(;t;){let d=!1,c="",g="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;c=e[0],t=t.substring(c.length);let w=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,B=>" ".repeat(3*B.length)),x=t.split(`
`,1)[0],A=!w.trim(),E=0;if(this.options.pedantic?(E=2,g=w.trimStart()):A?E=e[1].length+1:(E=e[2].search(this.rules.other.nonSpaceChar),E=E>4?1:E,g=w.slice(E),E+=e[1].length),A&&this.rules.other.blankLine.test(x)&&(c+=x+`
`,t=t.substring(x.length+1),d=!0),!d){const B=this.rules.other.nextBulletRegex(E),M=this.rules.other.hrRegex(E),V=this.rules.other.fencesBeginRegex(E),W=this.rules.other.headingBeginRegex(E),K=this.rules.other.htmlBeginRegex(E);for(;t;){const Y=t.split(`
`,1)[0];let te;if(x=Y,this.options.pedantic?(x=x.replace(this.rules.other.listReplaceNesting,"  "),te=x):te=x.replace(this.rules.other.tabCharGlobal,"    "),V.test(x)||W.test(x)||K.test(x)||B.test(x)||M.test(x))break;if(te.search(this.rules.other.nonSpaceChar)>=E||!x.trim())g+=`
`+te.slice(E);else{if(A||w.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||V.test(w)||W.test(w)||M.test(w))break;g+=`
`+x}!A&&!x.trim()&&(A=!0),c+=Y+`
`,t=t.substring(Y.length+1),w=te.slice(E)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(a=!0));let S=null,q;this.options.gfm&&(S=this.rules.other.listIsTask.exec(g),S&&(q=S[0]!=="[ ] ",g=g.replace(this.rules.other.listReplaceTask,""))),r.items.push({type:"list_item",raw:c,task:!!S,checked:q,loose:!1,text:g,tokens:[]}),r.raw+=c}const l=r.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let d=0;d<r.items.length;d++)if(this.lexer.state.top=!1,r.items[d].tokens=this.lexer.blockTokens(r.items[d].text,[]),!r.loose){const c=r.items[d].tokens.filter(w=>w.type==="space"),g=c.length>0&&c.some(w=>this.rules.other.anyLine.test(w.raw));r.loose=g}if(r.loose)for(let d=0;d<r.items.length;d++)r.items[d].loose=!0;return r}}html(t){const e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){const e=this.rules.block.def.exec(t);if(e){const n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){const e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const n=Yt(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(const a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(const a of r)i.rows.push(Yt(a,i.header.length).map((l,d)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[d]})));return i}}lheading(t){const e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){const e=this.rules.block.paragraph.exec(t);if(e){const n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){const e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){const e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){const e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){const e=this.rules.inline.link.exec(t);if(e){const n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const i=Me(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{const i=Ns(e[2],"()");if(i===-2)return;if(i>-1){const l=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,l).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){const i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),en(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){const s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){const i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return en(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(s[1]||s[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const i=[...s[0]].length-1;let a,l,d=i,c=0;const g=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(g.lastIndex=0,e=e.slice(-1*t.length+i);(s=g.exec(e))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(l=[...a].length,s[3]||s[4]){d+=l;continue}else if((s[5]||s[6])&&i%3&&!((i+l)%3)){c+=l;continue}if(d-=l,d>0)continue;l=Math.min(l,l+d+c);const w=[...s[0]][0].length,x=t.slice(0,i+s.index+w+l);if(Math.min(i,l)%2){const E=x.slice(1,-1);return{type:"em",raw:x,text:E,tokens:this.lexer.inlineTokens(E)}}const A=x.slice(2,-2);return{type:"strong",raw:x,text:A,tokens:this.lexer.inlineTokens(A)}}}}codespan(t){const e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," ");const s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){const e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){const e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){const e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){const e=this.rules.inline.text.exec(t);if(e){const n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},le=class wt{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ee,this.options.tokenizer=this.options.tokenizer||new Ve,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={other:J,block:We.normal,inline:Ne.normal};this.options.pedantic?(n.block=We.pedantic,n.inline=Ne.pedantic):this.options.gfm&&(n.block=We.gfm,this.options.breaks?n.inline=Ne.breaks:n.inline=Ne.gfm),this.tokenizer.rules=n}static get rules(){return{block:We,inline:Ne}}static lex(e,n){return new wt(n).lex(e)}static lexInline(e,n){return new wt(n).inlineTokens(e)}lex(e){e=e.replace(J.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){const s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(J.tabCharGlobal,"    ").replace(J.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);const a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);const a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);const a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=`
`+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title});continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0;const l=e.slice(1);let d;this.options.extensions.startBlock.forEach(c=>{d=c.call({lexer:this},l),typeof d=="number"&&d>=0&&(a=Math.min(a,d))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){const a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=`
`+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);const a=n.at(-1);a?.type==="text"?(a.raw+=`
`+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){const a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){const l=Object.keys(this.tokens.links);if(l.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let i=!1,a="";for(;e;){i||(a=""),i=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},e,n))?(e=e.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);const c=n.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(e,s,a)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),n.push(l);continue}let d=e;if(this.options.extensions?.startInline){let c=1/0;const g=e.slice(1);let w;this.options.extensions.startInline.forEach(x=>{w=x.call({lexer:this},g),typeof w=="number"&&w>=0&&(c=Math.min(c,w))}),c<1/0&&c>=0&&(d=e.substring(0,c+1))}if(l=this.tokenizer.inlineText(d)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(a=l.raw.slice(-1)),i=!0;const c=n.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(e){const c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},Ye=class{options;parser;constructor(t){this.options=t||Ee}space(t){return""}code({text:t,lang:e,escaped:n}){const s=(e||"").match(J.notSpaceStart)?.[0],r=t.replace(J.endingNewline,"")+`
`;return s?'<pre><code class="language-'+se(s)+'">'+(n?r:se(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:se(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){const e=t.ordered,n=t.start;let s="";for(let a=0;a<t.items.length;a++){const l=t.items[a];s+=this.listitem(l)}const r=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${se(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){const s=this.parser.parseInline(n),r=Vt(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+se(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));const r=Vt(t);if(r===null)return se(n);t=r;let i=`<img src="${t}" alt="${n}"`;return e&&(i+=` title="${se(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:se(t.text)}},Mt=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},ce=class kt{options;renderer;textRenderer;constructor(e){this.options=e||Ee,this.options.renderer=this.options.renderer||new Ye,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Mt}static parse(e,n){return new kt(n).parse(e)}static parseInline(e,n){return new kt(n).parseInline(e)}parse(e,n=!0){let s="";for(let r=0;r<e.length;r++){const i=e[r];if(this.options.extensions?.renderers?.[i.type]){const l=i,d=this.options.extensions.renderers[l.type].call({parser:this},l);if(d!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){s+=d||"";continue}}const a=i;switch(a.type){case"space":{s+=this.renderer.space(a);continue}case"hr":{s+=this.renderer.hr(a);continue}case"heading":{s+=this.renderer.heading(a);continue}case"code":{s+=this.renderer.code(a);continue}case"table":{s+=this.renderer.table(a);continue}case"blockquote":{s+=this.renderer.blockquote(a);continue}case"list":{s+=this.renderer.list(a);continue}case"html":{s+=this.renderer.html(a);continue}case"paragraph":{s+=this.renderer.paragraph(a);continue}case"text":{let l=a,d=this.renderer.text(l);for(;r+1<e.length&&e[r+1].type==="text";)l=e[++r],d+=`
`+this.renderer.text(l);n?s+=this.renderer.paragraph({type:"paragraph",raw:d,text:d,tokens:[{type:"text",raw:d,text:d,escaped:!0}]}):s+=d;continue}default:{const l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){const i=e[r];if(this.options.extensions?.renderers?.[i.type]){const l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=l||"";continue}}const a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{const l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},Ke=class{options;block;constructor(t){this.options=t||Ee}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?le.lex:le.lexInline}provideParser(){return this.block?ce.parse:ce.parseInline}},Is=class{defaults=St();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ce;Renderer=Ye;TextRenderer=Mt;Lexer=le;Tokenizer=Ve;Hooks=Ke;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(const s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{const r=s;for(const i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(const i of r.rows)for(const a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{const r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{const r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{const a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{const s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){const i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let l=r.renderer.apply(this,a);return l===!1&&(l=i.apply(this,a)),l}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){const r=this.defaults.renderer||new Ye(this.defaults);for(const i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;const a=i,l=n.renderer[a],d=r[a];r[a]=(...c)=>{let g=l.apply(r,c);return g===!1&&(g=d.apply(r,c)),g||""}}s.renderer=r}if(n.tokenizer){const r=this.defaults.tokenizer||new Ve(this.defaults);for(const i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;const a=i,l=n.tokenizer[a],d=r[a];r[a]=(...c)=>{let g=l.apply(r,c);return g===!1&&(g=d.apply(r,c)),g}}s.tokenizer=r}if(n.hooks){const r=this.defaults.hooks||new Ke;for(const i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;const a=i,l=n.hooks[a],d=r[a];Ke.passThroughHooks.has(i)?r[a]=c=>{if(this.defaults.async)return Promise.resolve(l.call(r,c)).then(w=>d.call(r,w));const g=l.call(r,c);return d.call(r,g)}:r[a]=(...c)=>{let g=l.apply(r,c);return g===!1&&(g=d.apply(r,c)),g}}s.hooks=r}if(n.walkTokens){const r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let l=[];return l.push(i.call(this,a)),r&&(l=l.concat(r.call(this,a))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return le.lex(t,e??this.defaults)}parser(t,e){return ce.parse(t,e??this.defaults)}parseMarkdown(t){return(n,s)=>{const r={...s},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));i.hooks&&(i.hooks.options=i,i.hooks.block=t);const l=i.hooks?i.hooks.provideLexer():t?le.lex:le.lexInline,d=i.hooks?i.hooks.provideParser():t?ce.parse:ce.parseInline;if(i.async)return Promise.resolve(i.hooks?i.hooks.preprocess(n):n).then(c=>l(c,i)).then(c=>i.hooks?i.hooks.processAllTokens(c):c).then(c=>i.walkTokens?Promise.all(this.walkTokens(c,i.walkTokens)).then(()=>c):c).then(c=>d(c,i)).then(c=>i.hooks?i.hooks.postprocess(c):c).catch(a);try{i.hooks&&(n=i.hooks.preprocess(n));let c=l(n,i);i.hooks&&(c=i.hooks.processAllTokens(c)),i.walkTokens&&this.walkTokens(c,i.walkTokens);let g=d(c,i);return i.hooks&&(g=i.hooks.postprocess(g)),g}catch(c){return a(c)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const s="<p>An error occurred:</p><pre>"+se(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},ke=new Is;function L(t,e){return ke.parse(t,e)}L.options=L.setOptions=function(t){return ke.setOptions(t),L.defaults=ke.defaults,dn(L.defaults),L};L.getDefaults=St;L.defaults=Ee;L.use=function(...t){return ke.use(...t),L.defaults=ke.defaults,dn(L.defaults),L};L.walkTokens=function(t,e){return ke.walkTokens(t,e)};L.parseInline=ke.parseInline;L.Parser=ce;L.parser=ce.parse;L.Renderer=Ye;L.TextRenderer=Mt;L.Lexer=le;L.lexer=le.lex;L.Tokenizer=Ve;L.Hooks=Ke;L.parse=L;L.options;L.setOptions;L.use;L.walkTokens;L.parseInline;var En=L;ce.parse;le.lex;const Os=`# HyperFX

HyperFX (hypermedia functions) is a simple library for DOM manipulation by using functions.
Right now it's JSX based. And it is not production ready.   

## Use case

Absolutely none, it is just a fun project.
`;function Ls(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ft,tn;function Ps(){if(tn)return ft;tn=1;function t(o){return o instanceof Map?o.clear=o.delete=o.set=function(){throw new Error("map is read-only")}:o instanceof Set&&(o.add=o.clear=o.delete=function(){throw new Error("set is read-only")}),Object.freeze(o),Object.getOwnPropertyNames(o).forEach(u=>{const p=o[u],T=typeof p;(T==="object"||T==="function")&&!Object.isFrozen(p)&&t(p)}),o}class e{constructor(u){u.data===void 0&&(u.data={}),this.data=u.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(o,...u){const p=Object.create(null);for(const T in o)p[T]=o[T];return u.forEach(function(T){for(const H in T)p[H]=T[H]}),p}const r="</span>",i=o=>!!o.scope,a=(o,{prefix:u})=>{if(o.startsWith("language:"))return o.replace("language:","language-");if(o.includes(".")){const p=o.split(".");return[`${u}${p.shift()}`,...p.map((T,H)=>`${T}${"_".repeat(H+1)}`)].join(" ")}return`${u}${o}`};class l{constructor(u,p){this.buffer="",this.classPrefix=p.classPrefix,u.walk(this)}addText(u){this.buffer+=n(u)}openNode(u){if(!i(u))return;const p=a(u.scope,{prefix:this.classPrefix});this.span(p)}closeNode(u){i(u)&&(this.buffer+=r)}value(){return this.buffer}span(u){this.buffer+=`<span class="${u}">`}}const d=(o={})=>{const u={children:[]};return Object.assign(u,o),u};class c{constructor(){this.rootNode=d(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(u){this.top.children.push(u)}openNode(u){const p=d({scope:u});this.add(p),this.stack.push(p)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(u){return this.constructor._walk(u,this.rootNode)}static _walk(u,p){return typeof p=="string"?u.addText(p):p.children&&(u.openNode(p),p.children.forEach(T=>this._walk(u,T)),u.closeNode(p)),u}static _collapse(u){typeof u!="string"&&u.children&&(u.children.every(p=>typeof p=="string")?u.children=[u.children.join("")]:u.children.forEach(p=>{c._collapse(p)}))}}class g extends c{constructor(u){super(),this.options=u}addText(u){u!==""&&this.add(u)}startScope(u){this.openNode(u)}endScope(){this.closeNode()}__addSublanguage(u,p){const T=u.root;p&&(T.scope=`language:${p}`),this.add(T)}toHTML(){return new l(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function w(o){return o?typeof o=="string"?o:o.source:null}function x(o){return S("(?=",o,")")}function A(o){return S("(?:",o,")*")}function E(o){return S("(?:",o,")?")}function S(...o){return o.map(p=>w(p)).join("")}function q(o){const u=o[o.length-1];return typeof u=="object"&&u.constructor===Object?(o.splice(o.length-1,1),u):{}}function B(...o){return"("+(q(o).capture?"":"?:")+o.map(T=>w(T)).join("|")+")"}function M(o){return new RegExp(o.toString()+"|").exec("").length-1}function V(o,u){const p=o&&o.exec(u);return p&&p.index===0}const W=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function K(o,{joinWith:u}){let p=0;return o.map(T=>{p+=1;const H=p;let z=w(T),b="";for(;z.length>0;){const m=W.exec(z);if(!m){b+=z;break}b+=z.substring(0,m.index),z=z.substring(m.index+m[0].length),m[0][0]==="\\"&&m[1]?b+="\\"+String(Number(m[1])+H):(b+=m[0],m[0]==="("&&p++)}return b}).map(T=>`(${T})`).join(u)}const Y=/\b\B/,te="[a-zA-Z]\\w*",Se="[a-zA-Z_]\\w*",De="\\b\\d+(\\.\\d+)?",$e="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",Be="\\b(0b[01]+)",rt="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",st=(o={})=>{const u=/^#![ ]*\//;return o.binary&&(o.begin=S(u,/.*\b/,o.binary,/\b.*/)),s({scope:"meta",begin:u,end:/$/,relevance:0,"on:begin":(p,T)=>{p.index!==0&&T.ignoreMatch()}},o)},me={begin:"\\\\[\\s\\S]",relevance:0},it={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[me]},He={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[me]},ot={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},G=function(o,u,p={}){const T=s({scope:"comment",begin:o,end:u,contains:[]},p);T.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const H=B("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return T.contains.push({begin:S(/[ ]+/,"(",H,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),T},he=G("//","$"),be=G("/\\*","\\*/"),ve=G("#","$"),Ae={scope:"number",begin:De,relevance:0},ze={scope:"number",begin:$e,relevance:0},Mn={scope:"number",begin:Be,relevance:0},In={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[me,{begin:/\[/,end:/\]/,relevance:0,contains:[me]}]},On={scope:"title",begin:te,relevance:0},Ln={scope:"title",begin:Se,relevance:0},Pn={begin:"\\.\\s*"+Se,relevance:0};var Fe=Object.freeze({__proto__:null,APOS_STRING_MODE:it,BACKSLASH_ESCAPE:me,BINARY_NUMBER_MODE:Mn,BINARY_NUMBER_RE:Be,COMMENT:G,C_BLOCK_COMMENT_MODE:be,C_LINE_COMMENT_MODE:he,C_NUMBER_MODE:ze,C_NUMBER_RE:$e,END_SAME_AS_BEGIN:function(o){return Object.assign(o,{"on:begin":(u,p)=>{p.data._beginMatch=u[1]},"on:end":(u,p)=>{p.data._beginMatch!==u[1]&&p.ignoreMatch()}})},HASH_COMMENT_MODE:ve,IDENT_RE:te,MATCH_NOTHING_RE:Y,METHOD_GUARD:Pn,NUMBER_MODE:Ae,NUMBER_RE:De,PHRASAL_WORDS_MODE:ot,QUOTE_STRING_MODE:He,REGEXP_MODE:In,RE_STARTERS_RE:rt,SHEBANG:st,TITLE_MODE:On,UNDERSCORE_IDENT_RE:Se,UNDERSCORE_TITLE_MODE:Ln});function Dn(o,u){o.input[o.index-1]==="."&&u.ignoreMatch()}function $n(o,u){o.className!==void 0&&(o.scope=o.className,delete o.className)}function Bn(o,u){u&&o.beginKeywords&&(o.begin="\\b("+o.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",o.__beforeBegin=Dn,o.keywords=o.keywords||o.beginKeywords,delete o.beginKeywords,o.relevance===void 0&&(o.relevance=0))}function Hn(o,u){Array.isArray(o.illegal)&&(o.illegal=B(...o.illegal))}function zn(o,u){if(o.match){if(o.begin||o.end)throw new Error("begin & end are not supported with match");o.begin=o.match,delete o.match}}function Fn(o,u){o.relevance===void 0&&(o.relevance=1)}const Un=(o,u)=>{if(!o.beforeMatch)return;if(o.starts)throw new Error("beforeMatch cannot be used with starts");const p=Object.assign({},o);Object.keys(o).forEach(T=>{delete o[T]}),o.keywords=p.keywords,o.begin=S(p.beforeMatch,x(p.begin)),o.starts={relevance:0,contains:[Object.assign(p,{endsParent:!0})]},o.relevance=0,delete p.beforeMatch},Xn=["of","and","for","in","not","or","if","then","parent","list","value"],Gn="keyword";function It(o,u,p=Gn){const T=Object.create(null);return typeof o=="string"?H(p,o.split(" ")):Array.isArray(o)?H(p,o):Object.keys(o).forEach(function(z){Object.assign(T,It(o[z],u,z))}),T;function H(z,b){u&&(b=b.map(m=>m.toLowerCase())),b.forEach(function(m){const v=m.split("|");T[v[0]]=[z,jn(v[0],v[1])]})}}function jn(o,u){return u?Number(u):Zn(o)?0:1}function Zn(o){return Xn.includes(o.toLowerCase())}const Ot={},xe=o=>{console.error(o)},Lt=(o,...u)=>{console.log(`WARN: ${o}`,...u)},Te=(o,u)=>{Ot[`${o}/${u}`]||(console.log(`Deprecated as of ${o}. ${u}`),Ot[`${o}/${u}`]=!0)},Ue=new Error;function Pt(o,u,{key:p}){let T=0;const H=o[p],z={},b={};for(let m=1;m<=u.length;m++)b[m+T]=H[m],z[m+T]=!0,T+=M(u[m-1]);o[p]=b,o[p]._emit=z,o[p]._multi=!0}function qn(o){if(Array.isArray(o.begin)){if(o.skip||o.excludeBegin||o.returnBegin)throw xe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Ue;if(typeof o.beginScope!="object"||o.beginScope===null)throw xe("beginScope must be object"),Ue;Pt(o,o.begin,{key:"beginScope"}),o.begin=K(o.begin,{joinWith:""})}}function Wn(o){if(Array.isArray(o.end)){if(o.skip||o.excludeEnd||o.returnEnd)throw xe("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Ue;if(typeof o.endScope!="object"||o.endScope===null)throw xe("endScope must be object"),Ue;Pt(o,o.end,{key:"endScope"}),o.end=K(o.end,{joinWith:""})}}function Jn(o){o.scope&&typeof o.scope=="object"&&o.scope!==null&&(o.beginScope=o.scope,delete o.scope)}function Kn(o){Jn(o),typeof o.beginScope=="string"&&(o.beginScope={_wrap:o.beginScope}),typeof o.endScope=="string"&&(o.endScope={_wrap:o.endScope}),qn(o),Wn(o)}function Qn(o){function u(b,m){return new RegExp(w(b),"m"+(o.case_insensitive?"i":"")+(o.unicodeRegex?"u":"")+(m?"g":""))}class p{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(m,v){v.position=this.position++,this.matchIndexes[this.matchAt]=v,this.regexes.push([v,m]),this.matchAt+=M(m)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const m=this.regexes.map(v=>v[1]);this.matcherRe=u(K(m,{joinWith:"|"}),!0),this.lastIndex=0}exec(m){this.matcherRe.lastIndex=this.lastIndex;const v=this.matcherRe.exec(m);if(!v)return null;const X=v.findIndex((Ce,lt)=>lt>0&&Ce!==void 0),F=this.matchIndexes[X];return v.splice(0,X),Object.assign(v,F)}}class T{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(m){if(this.multiRegexes[m])return this.multiRegexes[m];const v=new p;return this.rules.slice(m).forEach(([X,F])=>v.addRule(X,F)),v.compile(),this.multiRegexes[m]=v,v}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(m,v){this.rules.push([m,v]),v.type==="begin"&&this.count++}exec(m){const v=this.getMatcher(this.regexIndex);v.lastIndex=this.lastIndex;let X=v.exec(m);if(this.resumingScanAtSamePosition()&&!(X&&X.index===this.lastIndex)){const F=this.getMatcher(0);F.lastIndex=this.lastIndex+1,X=F.exec(m)}return X&&(this.regexIndex+=X.position+1,this.regexIndex===this.count&&this.considerAll()),X}}function H(b){const m=new T;return b.contains.forEach(v=>m.addRule(v.begin,{rule:v,type:"begin"})),b.terminatorEnd&&m.addRule(b.terminatorEnd,{type:"end"}),b.illegal&&m.addRule(b.illegal,{type:"illegal"}),m}function z(b,m){const v=b;if(b.isCompiled)return v;[$n,zn,Kn,Un].forEach(F=>F(b,m)),o.compilerExtensions.forEach(F=>F(b,m)),b.__beforeBegin=null,[Bn,Hn,Fn].forEach(F=>F(b,m)),b.isCompiled=!0;let X=null;return typeof b.keywords=="object"&&b.keywords.$pattern&&(b.keywords=Object.assign({},b.keywords),X=b.keywords.$pattern,delete b.keywords.$pattern),X=X||/\w+/,b.keywords&&(b.keywords=It(b.keywords,o.case_insensitive)),v.keywordPatternRe=u(X,!0),m&&(b.begin||(b.begin=/\B|\b/),v.beginRe=u(v.begin),!b.end&&!b.endsWithParent&&(b.end=/\B|\b/),b.end&&(v.endRe=u(v.end)),v.terminatorEnd=w(v.end)||"",b.endsWithParent&&m.terminatorEnd&&(v.terminatorEnd+=(b.end?"|":"")+m.terminatorEnd)),b.illegal&&(v.illegalRe=u(b.illegal)),b.contains||(b.contains=[]),b.contains=[].concat(...b.contains.map(function(F){return Vn(F==="self"?b:F)})),b.contains.forEach(function(F){z(F,v)}),b.starts&&z(b.starts,m),v.matcher=H(v),v}if(o.compilerExtensions||(o.compilerExtensions=[]),o.contains&&o.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return o.classNameAliases=s(o.classNameAliases||{}),z(o)}function Dt(o){return o?o.endsWithParent||Dt(o.starts):!1}function Vn(o){return o.variants&&!o.cachedVariants&&(o.cachedVariants=o.variants.map(function(u){return s(o,{variants:null},u)})),o.cachedVariants?o.cachedVariants:Dt(o)?s(o,{starts:o.starts?s(o.starts):null}):Object.isFrozen(o)?s(o):o}var Yn="11.11.1";class er extends Error{constructor(u,p){super(u),this.name="HTMLInjectionError",this.html=p}}const at=n,$t=s,Bt=Symbol("nomatch"),tr=7,Ht=function(o){const u=Object.create(null),p=Object.create(null),T=[];let H=!0;const z="Could not find the language '{}', did you forget to load/include a language module?",b={disableAutodetect:!0,name:"Plain text",contains:[]};let m={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:g};function v(h){return m.noHighlightRe.test(h)}function X(h){let k=h.className+" ";k+=h.parentNode?h.parentNode.className:"";const N=m.languageDetectRe.exec(k);if(N){const P=pe(N[1]);return P||(Lt(z.replace("{}",N[1])),Lt("Falling back to no-highlight mode for this block.",h)),P?N[1]:"no-highlight"}return k.split(/\s+/).find(P=>v(P)||pe(P))}function F(h,k,N){let P="",U="";typeof k=="object"?(P=h,N=k.ignoreIllegals,U=k.language):(Te("10.7.0","highlight(lang, code, ...args) has been deprecated."),Te("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),U=h,P=k),N===void 0&&(N=!0);const ee={code:P,language:U};Ge("before:highlight",ee);const fe=ee.result?ee.result:Ce(ee.language,ee.code,N);return fe.code=ee.code,Ge("after:highlight",fe),fe}function Ce(h,k,N,P){const U=Object.create(null);function ee(f,y){return f.keywords[y]}function fe(){if(!_.keywords){j.addText(D);return}let f=0;_.keywordPatternRe.lastIndex=0;let y=_.keywordPatternRe.exec(D),C="";for(;y;){C+=D.substring(f,y.index);const O=re.case_insensitive?y[0].toLowerCase():y[0],Z=ee(_,O);if(Z){const[oe,xr]=Z;if(j.addText(C),C="",U[O]=(U[O]||0)+1,U[O]<=tr&&(qe+=xr),oe.startsWith("_"))C+=y[0];else{const yr=re.classNameAliases[oe]||oe;ne(y[0],yr)}}else C+=y[0];f=_.keywordPatternRe.lastIndex,y=_.keywordPatternRe.exec(D)}C+=D.substring(f),j.addText(C)}function je(){if(D==="")return;let f=null;if(typeof _.subLanguage=="string"){if(!u[_.subLanguage]){j.addText(D);return}f=Ce(_.subLanguage,D,!0,qt[_.subLanguage]),qt[_.subLanguage]=f._top}else f=ct(D,_.subLanguage.length?_.subLanguage:null);_.relevance>0&&(qe+=f.relevance),j.__addSublanguage(f._emitter,f.language)}function Q(){_.subLanguage!=null?je():fe(),D=""}function ne(f,y){f!==""&&(j.startScope(y),j.addText(f),j.endScope())}function Xt(f,y){let C=1;const O=y.length-1;for(;C<=O;){if(!f._emit[C]){C++;continue}const Z=re.classNameAliases[f[C]]||f[C],oe=y[C];Z?ne(oe,Z):(D=oe,fe(),D=""),C++}}function Gt(f,y){return f.scope&&typeof f.scope=="string"&&j.openNode(re.classNameAliases[f.scope]||f.scope),f.beginScope&&(f.beginScope._wrap?(ne(D,re.classNameAliases[f.beginScope._wrap]||f.beginScope._wrap),D=""):f.beginScope._multi&&(Xt(f.beginScope,y),D="")),_=Object.create(f,{parent:{value:_}}),_}function jt(f,y,C){let O=V(f.endRe,C);if(O){if(f["on:end"]){const Z=new e(f);f["on:end"](y,Z),Z.isMatchIgnored&&(O=!1)}if(O){for(;f.endsParent&&f.parent;)f=f.parent;return f}}if(f.endsWithParent)return jt(f.parent,y,C)}function pr(f){return _.matcher.regexIndex===0?(D+=f[0],1):(pt=!0,0)}function fr(f){const y=f[0],C=f.rule,O=new e(C),Z=[C.__beforeBegin,C["on:begin"]];for(const oe of Z)if(oe&&(oe(f,O),O.isMatchIgnored))return pr(y);return C.skip?D+=y:(C.excludeBegin&&(D+=y),Q(),!C.returnBegin&&!C.excludeBegin&&(D=y)),Gt(C,f),C.returnBegin?0:y.length}function gr(f){const y=f[0],C=k.substring(f.index),O=jt(_,f,C);if(!O)return Bt;const Z=_;_.endScope&&_.endScope._wrap?(Q(),ne(y,_.endScope._wrap)):_.endScope&&_.endScope._multi?(Q(),Xt(_.endScope,f)):Z.skip?D+=y:(Z.returnEnd||Z.excludeEnd||(D+=y),Q(),Z.excludeEnd&&(D=y));do _.scope&&j.closeNode(),!_.skip&&!_.subLanguage&&(qe+=_.relevance),_=_.parent;while(_!==O.parent);return O.starts&&Gt(O.starts,f),Z.returnEnd?0:y.length}function mr(){const f=[];for(let y=_;y!==re;y=y.parent)y.scope&&f.unshift(y.scope);f.forEach(y=>j.openNode(y))}let Ze={};function Zt(f,y){const C=y&&y[0];if(D+=f,C==null)return Q(),0;if(Ze.type==="begin"&&y.type==="end"&&Ze.index===y.index&&C===""){if(D+=k.slice(y.index,y.index+1),!H){const O=new Error(`0 width match regex (${h})`);throw O.languageName=h,O.badRule=Ze.rule,O}return 1}if(Ze=y,y.type==="begin")return fr(y);if(y.type==="illegal"&&!N){const O=new Error('Illegal lexeme "'+C+'" for mode "'+(_.scope||"<unnamed>")+'"');throw O.mode=_,O}else if(y.type==="end"){const O=gr(y);if(O!==Bt)return O}if(y.type==="illegal"&&C==="")return D+=`
`,1;if(ht>1e5&&ht>y.index*3)throw new Error("potential infinite loop, way more iterations than matches");return D+=C,C.length}const re=pe(h);if(!re)throw xe(z.replace("{}",h)),new Error('Unknown language: "'+h+'"');const br=Qn(re);let dt="",_=P||br;const qt={},j=new m.__emitter(m);mr();let D="",qe=0,ye=0,ht=0,pt=!1;try{if(re.__emitTokens)re.__emitTokens(k,j);else{for(_.matcher.considerAll();;){ht++,pt?pt=!1:_.matcher.considerAll(),_.matcher.lastIndex=ye;const f=_.matcher.exec(k);if(!f)break;const y=k.substring(ye,f.index),C=Zt(y,f);ye=f.index+C}Zt(k.substring(ye))}return j.finalize(),dt=j.toHTML(),{language:h,value:dt,relevance:qe,illegal:!1,_emitter:j,_top:_}}catch(f){if(f.message&&f.message.includes("Illegal"))return{language:h,value:at(k),illegal:!0,relevance:0,_illegalBy:{message:f.message,index:ye,context:k.slice(ye-100,ye+100),mode:f.mode,resultSoFar:dt},_emitter:j};if(H)return{language:h,value:at(k),illegal:!1,relevance:0,errorRaised:f,_emitter:j,_top:_};throw f}}function lt(h){const k={value:at(h),illegal:!1,relevance:0,_top:b,_emitter:new m.__emitter(m)};return k._emitter.addText(h),k}function ct(h,k){k=k||m.languages||Object.keys(u);const N=lt(h),P=k.filter(pe).filter(Ut).map(Q=>Ce(Q,h,!1));P.unshift(N);const U=P.sort((Q,ne)=>{if(Q.relevance!==ne.relevance)return ne.relevance-Q.relevance;if(Q.language&&ne.language){if(pe(Q.language).supersetOf===ne.language)return 1;if(pe(ne.language).supersetOf===Q.language)return-1}return 0}),[ee,fe]=U,je=ee;return je.secondBest=fe,je}function nr(h,k,N){const P=k&&p[k]||N;h.classList.add("hljs"),h.classList.add(`language-${P}`)}function ut(h){let k=null;const N=X(h);if(v(N))return;if(Ge("before:highlightElement",{el:h,language:N}),h.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",h);return}if(h.children.length>0&&(m.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(h)),m.throwUnescapedHTML))throw new er("One of your code blocks includes unescaped HTML.",h.innerHTML);k=h;const P=k.textContent,U=N?F(P,{language:N,ignoreIllegals:!0}):ct(P);h.innerHTML=U.value,h.dataset.highlighted="yes",nr(h,N,U.language),h.result={language:U.language,re:U.relevance,relevance:U.relevance},U.secondBest&&(h.secondBest={language:U.secondBest.language,relevance:U.secondBest.relevance}),Ge("after:highlightElement",{el:h,result:U,text:P})}function rr(h){m=$t(m,h)}const sr=()=>{Xe(),Te("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function ir(){Xe(),Te("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let zt=!1;function Xe(){function h(){Xe()}if(document.readyState==="loading"){zt||window.addEventListener("DOMContentLoaded",h,!1),zt=!0;return}document.querySelectorAll(m.cssSelector).forEach(ut)}function or(h,k){let N=null;try{N=k(o)}catch(P){if(xe("Language definition for '{}' could not be registered.".replace("{}",h)),H)xe(P);else throw P;N=b}N.name||(N.name=h),u[h]=N,N.rawDefinition=k.bind(null,o),N.aliases&&Ft(N.aliases,{languageName:h})}function ar(h){delete u[h];for(const k of Object.keys(p))p[k]===h&&delete p[k]}function lr(){return Object.keys(u)}function pe(h){return h=(h||"").toLowerCase(),u[h]||u[p[h]]}function Ft(h,{languageName:k}){typeof h=="string"&&(h=[h]),h.forEach(N=>{p[N.toLowerCase()]=k})}function Ut(h){const k=pe(h);return k&&!k.disableAutodetect}function cr(h){h["before:highlightBlock"]&&!h["before:highlightElement"]&&(h["before:highlightElement"]=k=>{h["before:highlightBlock"](Object.assign({block:k.el},k))}),h["after:highlightBlock"]&&!h["after:highlightElement"]&&(h["after:highlightElement"]=k=>{h["after:highlightBlock"](Object.assign({block:k.el},k))})}function ur(h){cr(h),T.push(h)}function dr(h){const k=T.indexOf(h);k!==-1&&T.splice(k,1)}function Ge(h,k){const N=h;T.forEach(function(P){P[N]&&P[N](k)})}function hr(h){return Te("10.7.0","highlightBlock will be removed entirely in v12.0"),Te("10.7.0","Please use highlightElement now."),ut(h)}Object.assign(o,{highlight:F,highlightAuto:ct,highlightAll:Xe,highlightElement:ut,highlightBlock:hr,configure:rr,initHighlighting:sr,initHighlightingOnLoad:ir,registerLanguage:or,unregisterLanguage:ar,listLanguages:lr,getLanguage:pe,registerAliases:Ft,autoDetection:Ut,inherit:$t,addPlugin:ur,removePlugin:dr}),o.debugMode=function(){H=!1},o.safeMode=function(){H=!0},o.versionString=Yn,o.regex={concat:S,lookahead:x,either:B,optional:E,anyNumberOfTimes:A};for(const h in Fe)typeof Fe[h]=="object"&&t(Fe[h]);return Object.assign(o,Fe),o},_e=Ht({});return _e.newInstance=()=>Ht({}),ft=_e,_e.HighlightJS=_e,_e.default=_e,ft}var Ds=Ps();const Pe=Ls(Ds);function $s(t){const e=t.regex,n={},s={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:e.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},s]});const r={className:"subst",begin:/\$\(/,end:/\)/,contains:[t.BACKSLASH_ESCAPE]},i=t.inherit(t.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),a={begin:/<<-?\s*(?=\w+)/,starts:{contains:[t.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},l={className:"string",begin:/"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,n,r]};r.contains.push(l);const d={match:/\\"/},c={className:"string",begin:/'/,end:/'/},g={match:/\\'/},w={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},t.NUMBER_MODE,n]},x=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],A=t.SHEBANG({binary:`(${x.join("|")})`,relevance:10}),E={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[t.inherit(t.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},S=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],q=["true","false"],B={match:/(\/[a-z._-]+)+/},M=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],V=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],W=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],K=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:S,literal:q,built_in:[...M,...V,"set","shopt",...W,...K]},contains:[A,t.SHEBANG(),E,w,i,a,B,l,d,c,g,n]}}const et="[A-Za-z$_][0-9A-Za-z$_]*",Sn=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],vn=["true","false","null","undefined","NaN","Infinity"],Tn=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],_n=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Rn=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],An=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],Cn=[].concat(Rn,Tn,_n);function Bs(t){const e=t.regex,n=(G,{after:he})=>{const be="</"+G[0].slice(1);return G.input.indexOf(be,he)!==-1},s=et,r={begin:"<>",end:"</>"},i=/<[A-Za-z0-9\\._:-]+\s*\/>/,a={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(G,he)=>{const be=G[0].length+G.index,ve=G.input[be];if(ve==="<"||ve===","){he.ignoreMatch();return}ve===">"&&(n(G,{after:be})||he.ignoreMatch());let Ae;const ze=G.input.substring(be);if(Ae=ze.match(/^\s*=/)){he.ignoreMatch();return}if((Ae=ze.match(/^\s+extends\s+/))&&Ae.index===0){he.ignoreMatch();return}}},l={$pattern:et,keyword:Sn,literal:vn,built_in:Cn,"variable.language":An},d="[0-9](_?[0-9])*",c=`\\.(${d})`,g="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",w={className:"number",variants:[{begin:`(\\b(${g})((${c})|\\.)?|(${c}))[eE][+-]?(${d})\\b`},{begin:`\\b(${g})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},x={className:"subst",begin:"\\$\\{",end:"\\}",keywords:l,contains:[]},A={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,x],subLanguage:"xml"}},E={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,x],subLanguage:"css"}},S={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,x],subLanguage:"graphql"}},q={className:"string",begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,x]},M={className:"comment",variants:[t.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:s+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]},V=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,A,E,S,q,{match:/\$\d+/},w];x.contains=V.concat({begin:/\{/,end:/\}/,keywords:l,contains:["self"].concat(V)});const W=[].concat(M,x.contains),K=W.concat([{begin:/(\s*)\(/,end:/\)/,keywords:l,contains:["self"].concat(W)}]),Y={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:l,contains:K},te={variants:[{match:[/class/,/\s+/,s,/\s+/,/extends/,/\s+/,e.concat(s,"(",e.concat(/\./,s),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,s],scope:{1:"keyword",3:"title.class"}}]},Se={relevance:0,match:e.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Tn,..._n]}},De={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},$e={variants:[{match:[/function/,/\s+/,s,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[Y],illegal:/%/},Be={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function rt(G){return e.concat("(?!",G.join("|"),")")}const st={match:e.concat(/\b/,rt([...Rn,"super","import"].map(G=>`${G}\\s*\\(`)),s,e.lookahead(/\s*\(/)),className:"title.function",relevance:0},me={begin:e.concat(/\./,e.lookahead(e.concat(s,/(?![0-9A-Za-z$_(])/))),end:s,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},it={match:[/get|set/,/\s+/,s,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},Y]},He="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",ot={match:[/const|var|let/,/\s+/,s,/\s*/,/=\s*/,/(async\s*)?/,e.lookahead(He)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[Y]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:l,exports:{PARAMS_CONTAINS:K,CLASS_REFERENCE:Se},illegal:/#(?![$_A-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",relevance:5}),De,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,A,E,S,q,M,{match:/\$\d+/},w,Se,{scope:"attr",match:s+e.lookahead(":"),relevance:0},ot,{begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[M,t.REGEXP_MODE,{className:"function",begin:He,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:l,contains:K}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:r.begin,end:r.end},{match:i},{begin:a.begin,"on:begin":a.isTrulyOpeningTag,end:a.end}],subLanguage:"xml",contains:[{begin:a.begin,end:a.end,skip:!0,contains:["self"]}]}]},$e,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[Y,t.inherit(t.TITLE_MODE,{begin:s,className:"title.function"})]},{match:/\.\.\./,relevance:0},me,{match:"\\$"+s,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[Y]},st,Be,te,it,{match:/\$[(.]/}]}}function Hs(t){const e=t.regex,n=Bs(t),s=et,r=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],i={begin:[/namespace/,/\s+/,t.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},a={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:r},contains:[n.exports.CLASS_REFERENCE]},l={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},d=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],c={$pattern:et,keyword:Sn.concat(d),literal:vn,built_in:Cn.concat(r),"variable.language":An},g={className:"meta",begin:"@"+s},w=(S,q,B)=>{const M=S.contains.findIndex(V=>V.label===q);if(M===-1)throw new Error("can not find mode to replace");S.contains.splice(M,1,B)};Object.assign(n.keywords,c),n.exports.PARAMS_CONTAINS.push(g);const x=n.contains.find(S=>S.scope==="attr"),A=Object.assign({},x,{match:e.concat(s,e.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,x,A]),n.contains=n.contains.concat([g,i,a,A]),w(n,"shebang",t.SHEBANG()),w(n,"use_strict",l);const E=n.contains.find(S=>S.label==="func.def");return E.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}function zs(t){const e=t.regex,n=e.concat(/[\p{L}_]/u,e.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),s=/[\p{L}0-9._:-]+/u,r={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},i={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},a=t.inherit(i,{begin:/\(/,end:/\)/}),l=t.inherit(t.APOS_STRING_MODE,{className:"string"}),d=t.inherit(t.QUOTE_STRING_MODE,{className:"string"}),c={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:s,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[r]},{begin:/'/,end:/'/,contains:[r]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[i,d,l,a,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[i,a,d,l]}]}]},t.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},r,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[d]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[c],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[c],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:e.concat(/</,e.lookahead(e.concat(n,e.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:c}]},{className:"tag",begin:e.concat(/<\//,e.lookahead(e.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}const Et=ge("todo"),Fs=Oe(()=>{const t=Et();if(typeof t=="string"||!t)return'<p class="border rounded-md p-2">Start editing to get a preview!</p>';const e=cn(t);return e instanceof Text?'<p class="border rounded-md p-2">Start editing to get a preview!</p>':(console.log("Preview HTML:",e.outerHTML),Nn(e),e.outerHTML)}),gt="editor_content";function Us(){const t=s=>{s.preventDefault();const r=document.getSelection();if(!r||r.rangeCount===0)return;const i=r.getRangeAt(0);if(i.collapsed)return;const a=document.createElement("strong");try{i.surroundContents(a),r.removeAllRanges(),e()}catch{try{const d=i.extractContents();a.appendChild(d),i.insertNode(a),r.removeAllRanges(),e()}catch(d){console.warn("Could not apply bold formatting:",d)}}},e=()=>{const s=document.getElementById(gt);s&&Et(ln(s))};return $("div",{class:"p-2 w-full flex flex-auto gap-4 flex-col",children:[$("div",{id:"article_editor",children:[$("div",{id:"edit_buttons",class:"p-2 flex gap-2",children:[R("span",{children:"Formatting:"}),R("button",{class:"p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700",onMouseDown:t,title:"Bold selected text",children:R("strong",{children:"B"})})]}),R("div",{class:"border-2 rounded-md p-2 bg-white text-black",children:R("div",{id:gt,class:"",children:R("article",{contenteditable:"true",onInput:s=>{e()},children:$("p",{children:["Edit me! Select some text and click the ",R("strong",{children:"B"})," button to make it bold."]})})})})]}),$("div",{children:[R("p",{class:"text-xl font-semibold",children:"Preview:"}),R("div",{class:"p-2 border-2 bg-white text-black",children:R("div",{innerHTML:Fs})})]}),$("div",{class:"p-2 bg-purple-950 rounded-md",children:[R("p",{class:"text-xl font-semibold",children:"JSON:"}),R("div",{class:"bg-black/20 p-2 border-2 border-gray-500 rounded-md",children:R("output",{class:"",name:"json_output",htmlFor:gt,children:R("pre",{class:"overflow-x-scroll",children:()=>JSON.stringify(Et(),null,"  ")})})})]})]})}function Nn(t){t.removeAttribute("contenteditable");for(const e of t.children)Nn(e)}const Xs=`import {
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
}`;Pe.registerLanguage("typescript",Hs);Pe.registerLanguage("html",zs);Pe.registerLanguage("bash",$s);const Gs=En(Os);function nn(t){document.title=t}function rn(t){const e=document.querySelector('meta[name="description"]');e&&e.setAttribute("content",t)}function js(){const t=an(),e=Oe(()=>{const s=Ir("doc")()||"main";return un.find(i=>i.route_name==s)}),n=Oe(()=>{const s=e();return s?En(s.data):""});return de(()=>{const s=e();s?(nn(`${s.title} | HyperFX`),rn(`HyperFX docs about ${s.title}.`)):(nn("HyperFX"),rn("HyperFX docs"))}),de(()=>{t(),setTimeout(()=>{const s=document.querySelectorAll("pre code");for(const r of s)Pe.highlightElement(r)},0)}),$(on,{children:[R(Jt,{when:()=>e()!==void 0&&e().route_name!=="main",children:$("div",{class:"flex flex-auto",children:[R(Kr,{}),R("article",{class:"p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl",children:R("div",{class:"markdown-body",innerHTML:n})})]})}),R(Jt,{when:()=>e()===void 0||e().route_name==="main",children:$("div",{class:"grow flex flex-col",children:[R("article",{class:"p-4 mx-auto w-full max-w-4xl",children:R("div",{class:"markdown-body-main",innerHTML:Gs})}),$("div",{class:"p-2 bg-red-950 text-white mt-4 mx-auto",children:[R("p",{class:"text-xl",children:"This is a work in progress!"}),R("p",{class:"text-xl",children:"The docs are not finished yet!"})]})]})})]})}function Zs(){const t=Us(),e=R("pre",{class:"mx-auto max-w-[70vw]! max-h-[50vw]",children:R("code",{class:"language-tsx",children:Xs})});return de(()=>{setTimeout(()=>{const n=document.querySelector("pre code");n&&n.attributes.getNamedItem("data-highlighted")?.value!="yes"&&Pe.highlightElement(n)},0)}),$("div",{class:"flex flex-col p-4 max-w-[80vw] mx-auto",children:[$("div",{class:"p-2",children:[$("p",{class:"mx-auto",children:["This is the code used to create the editor.",$("span",{class:"text-purple-500/80",children:[" ","(The editor is far from done but it is still cool IMO.)"]})]}),R("div",{class:"w-full",children:e})]}),t]})}function qs(){const t=Mr(),e=an();return de(()=>{e()==="/"&&t("/hyperfx")}),$("div",{class:"flex flex-auto flex-col min-h-screen",children:[R(Wr,{}),$("main",{class:"flex flex-auto flex-col",id:"main-content",children:[R("p",{class:"p-2 bg-red-800 text-white text-center w-full! max-w-full!",children:"A LOT OF CHANGES. DOCS ARE NOT UP TO DATE."}),R(Wt,{path:"/hyperfx/editor",component:Zs}),R(Wt,{path:"/hyperfx",component:js,exact:!0})]}),$("footer",{class:"bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto",children:[R("a",{href:"https://github.com/ArnoudK/hyperfx",target:"_blank",class:"underline",children:"Github"}),$("span",{class:"w-full ",children:[" - © ",new Date().getFullYear()," Arnoud Kerkhof"]})]})]})}function Ws(){return R(Nr,{initialPath:"/hyperfx",children:()=>R(qs,{})})}const Js=document.getElementById("app");Js.replaceChildren(Ws());
