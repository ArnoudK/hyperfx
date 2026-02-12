(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const Ct=[];function ts(){return Ct.length===0?null:Ct[Ct.length-1]}function mn(t){const e=ts();e&&t&&(e.isEffect=!0)}let ue=!1;const ct=[];function Cn(){ct.push({dependencies:new Set})}function Mn(){return ct.pop()?.dependencies??new Set}function ns(){return ct[ct.length-1]}function rs(t){const e=ns();if(!e)return;const n=t.__deps;if(n&&n.size>0){n.forEach(r=>e.dependencies.add(r));return}e.dependencies.add(t)}let _e=null;class ss{constructor(e){this.subscribers=new Set,this._value=e}get(){return this._value}getSubscriberCount(){return this.subscribers.size}set(e){return Object.is(this._value,e)||(this._value=e,Array.from(this.subscribers).forEach(r=>{try{r(e)}catch(s){console.error("Signal subscriber error:",s)}})),e}subscribe(e){return this.subscribers.add(e),()=>{this.subscribers.delete(e)}}}function $n(t){return new ss(t)}function Ue(t,e){const n=$n(t),r=On(n),s=is(n);return[r,s]}function On(t){const e=()=>(ue&&rs(e),t.get());return e.subscribe=n=>{const r=t.subscribe(n);return e.subscriberCount=t.getSubscriberCount(),()=>{r(),e.subscriberCount=t.getSubscriberCount()}},e.subscriberCount=t.getSubscriberCount(),e}function is(t){return e=>{const n=t.get(),r=typeof e=="function"?e(n):e;return t.set(r),()=>{t.set(n)}}}function le(t){const e=ue;ue=!0,Cn();let n,r;try{n=t()}finally{r=Mn(),ue=e}const s=$n(n),i=On(s);i.__deps=r;let o=!1;const a=()=>{if(o)return;o=!0;const l=t();Object.is(l,s.get())||s.set(l),o=!1},u=Array.from(r).map(l=>l.subscribe(a));return i.destroy=()=>{for(let l=0;l<u.length;l++)u[l]();u.length=0,i.__deps=void 0},i}function Y(t){let e,n=[],r=!1,s=!1,i=!1;const o={children:new Set,dispose:()=>{}},a=()=>{r||(r=!0,o.children.forEach(l=>{l()}),o.children.clear(),n.forEach(l=>{l()}),n=[],typeof e=="function"&&e(),_e&&_e.children.delete(a))};o.dispose=a;const u=()=>{if(r)return;if(s){i=!0;return}s=!0;let l=0;const h=100;for(;l<h;){i=!1,o.children.forEach(y=>{y()}),o.children.clear();for(let y=0;y<n.length;y++)n[y]();n=[],typeof e=="function"&&(e(),e=void 0);const p=_e;_e=o;const f=ue;ue=!0,Cn(),mn(!0);try{e=t()}finally{ue=f,mn(!1),_e=p}if(n=Array.from(Mn()).map(y=>y.subscribe(()=>{u()})),!i)break;l++}l>=h&&(console.error("createEffect: Maximum iterations reached - possible infinite loop in effect"),i=!1),s=!1};return _e&&_e.children.add(a),u(),a}function bn(t){const e=ue;ue=!1;try{return t()}finally{ue=e}}function Ie(t){return typeof t=="function"&&"subscribe"in t&&typeof t.subscribe=="function"}function It(t){if(Array.isArray(t)&&t.length===2&&typeof t[0]=="function"&&typeof t[1]=="function")return t[0];if(Ie(t))return t}const Me=new WeakMap,$e=new WeakMap,Xe=new Set;let Be=null;function In(){Be||typeof window>"u"||typeof Element>"u"||(Be=setInterval(()=>{const t=Array.from(Xe);for(const e of t)e.isConnected||Lt(e);Xe.size===0&&Be&&(clearInterval(Be),Be=null)},10))}if(typeof window<"u"&&typeof MutationObserver<"u"){const t=new MutationObserver(n=>{try{n.forEach(r=>{r.removedNodes.forEach(s=>{typeof Element<"u"&&s instanceof Element&&((Me.has(s)||$e.has(s))&&Lt(s),s.querySelectorAll("*").forEach(i=>{(Me.has(i)||$e.has(i))&&Lt(i)}))})})}catch(r){if(typeof Element>"u")return;console.error("Error in mutation observer:",r)}});(()=>{if(typeof document>"u")return;if(document.body){t.observe(document.body,{childList:!0,subtree:!0});return}const n=()=>{if(!document.body){setTimeout(n,0);return}t.observe(document.body,{childList:!0,subtree:!0})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",n,{once:!0}):setTimeout(n,0)})()}function lt(t,e){const n=Me.get(t);n?n.add(e):Me.set(t,new Set([e])),Xe.add(t),In()}function Ln(t,e){const n=$e.get(t);n?n.add(e):$e.set(t,new Set([e])),Xe.add(t),In()}function Lt(t){const e=Me.get(t);e&&(e.forEach(r=>{try{r()}catch(s){console.error("Error during subscription cleanup:",s)}}),e.clear(),Me.delete(t));const n=$e.get(t);n&&(n.forEach(r=>{try{typeof r.destroy=="function"&&r.destroy()}catch(s){console.error("Error destroying computed signal:",s)}}),n.clear(),$e.delete(t)),Xe.delete(t)}const Dt="__HYPERFX_SSR_STATE_V2__",Ht=globalThis;Ht[Dt]||(Ht[Dt]={hydrationEnabled:!1,ssrMode:!1,clientNodeCounter:0,ssrNodeCounter:0,hydrationContainer:null,hydrationPointer:null,hydrationStack:[]});const os=Ht[Dt];function as(){return os.hydrationEnabled}function Xt(t){return Ie(t)}function re(t){return Xt(t)?()=>t():t}const yn=new Map;function $(t){if(typeof document>"u")return{t,__ssr:!0,cloneNode:function(){return{...this}}};let e=yn.get(t);if(!e){const n=document.createElement("template");n.innerHTML=t,e=n.content.firstChild,yn.set(t,e)}return e.cloneNode(!0)}function R(t,e,n,r){if(Xt(e)||typeof e!="function")return st(t,e,r,n);let s=t,i=r;const o=()=>{if(n&&n.parentNode)return n.parentNode;if(Array.isArray(i)){for(let u=0;u<i.length;u++){const l=i[u];if(l instanceof Node&&l.parentNode)return l.parentNode;if(l&&typeof l=="object"){const h=l._node;if(h&&h.parentNode)return h.parentNode}}return null}if(i instanceof Node&&i.parentNode)return i.parentNode;if(i&&typeof i=="object"){const u=i._node;if(u&&u.parentNode)return u.parentNode}return null},a=Y(()=>{if(typeof DocumentFragment<"u"&&s instanceof DocumentFragment){const u=o();u&&(s=u)}if(i=st(s,e(),i,n),typeof DocumentFragment<"u"&&s instanceof DocumentFragment){const u=o();u&&(s=u)}});return t instanceof Element&&lt(t,a),i}function cs(t,e="hfx:slot"){const n=document.createDocumentFragment(),r=document.createComment(e),s=document.createComment(`${e}:end`);n.appendChild(r),n.appendChild(s);const i=()=>Xt(t)||typeof t=="function"?t():t;return R(n,()=>{const a=s.parentNode;if(a){let u=r.nextSibling;for(;u&&u!==s;){const l=u.nextSibling;a.removeChild(u),u=l}}return i()},s),n}function st(t,e,n,r,s=!0){const i=as();if(i&&r&&r.nodeType===8&&r.textContent&&(r.textContent==="hfx:dyn"||r.textContent.startsWith("hfx:dyn:")||r.textContent.startsWith("#"))){const l=r.previousSibling,h=r.nextSibling,p=l&&l.nodeType===3?l:h&&h.nodeType===3?h:null;if(p&&n===void 0){const f=p,b=e==null?"":String(e);return f.data!==b&&(f.data=b),{_node:f,toString:()=>f.data}}}if(e==null)return n!=null&&Ce(t,n,r),null;if(Array.isArray(e)){if(s)return n!=null&&Ce(t,n,r),ls(t,e,n,r);e=String(e)}if(typeof DocumentFragment<"u"&&e instanceof DocumentFragment){n!=null&&Ce(t,n,r);const l=Array.from(e.childNodes),h=r&&r.parentNode===t?r:null;for(let p=0;p<l.length;p++)t.insertBefore(l[p],h);return l}if(e instanceof Node){if(n!==e){n!=null&&Ce(t,n,r);const l=r&&r.parentNode===t?r:null;t.insertBefore(e,l)}return e}if(Ie(e)){const l=document.createTextNode(String(e())),h=r&&r.parentNode===t?r:null;t.insertBefore(l,h);const p=Y(()=>{l.data=String(e())});return t instanceof Element&&lt(t,p),typeof e.destroy=="function"&&t instanceof Element&&Ln(t,e),{_node:l,toString:()=>l.data,_cleanup:p}}const o=String(e);if(n&&typeof n=="object"&&n._node instanceof Text){const l=n._node;return l.data=o,n}if(i){const l=r&&r.parentNode===t?r.previousSibling:t.lastChild;if(l instanceof Text&&(n===void 0||l.data===o))return l.data=o,{_node:l,toString:()=>o}}const a=document.createTextNode(o);n!=null&&Ce(t,n,r);const u=r&&r.parentNode===t?r:null;return t.insertBefore(a,u),{_node:a,toString:()=>o}}function ls(t,e,n,r){const s=[];for(let i=0;i<e.length;i++){const o=e[i];s.push(st(t,o,null,r,!1))}return s}function Ce(t,e,n){if(Array.isArray(e))for(let r=0;r<e.length;r++)Ce(t,e[r],n);else if(e&&typeof e=="object"&&e._node instanceof Text){const r=e._node;r.parentNode===t&&t.removeChild(r)}else if(e instanceof Node)e.parentNode===t&&t.removeChild(e);else{const r=n?n.previousSibling:t.lastChild;r&&r.parentNode===t&&t.removeChild(r)}}const Bt=new Map,Pt=new WeakMap,us=new Set(["blur","focus","load","unload","scroll","error","resize"]);function ds(t){if(Bt.has(t))return;const e=new Set;Bt.set(t,e),document.addEventListener(t,n=>{let r=n.target;for(;r&&r!==document.documentElement;){if(e.has(r)){const i=Pt.get(r)?.get(t);if(i&&(i.call(r,n),n.cancelBubble))break}r=r.parentElement}},{capture:!1})}function ut(t,e,n){if(us.has(e)){t.addEventListener(e,n);return}ds(e);let r=Pt.get(t);r||(r=new Map,Pt.set(t,r)),r.set(e,n),Bt.get(e).add(t)}function se(t){return new Proxy(t,{get(e,n,r){if(n==="children")return Reflect.get(e,n,r);const s=Reflect.get(e,n,r);return Ie(s)?s():s}})}function ye(t,e,n){try{if(!e.startsWith("on")){const s=It(n);if(s){typeof s.destroy=="function"&&Ln(t,s);const o=()=>{const u=s();Mt(t,e,u)};let a=null;try{a=s.subscribe?s.subscribe(()=>o()):null}catch(u){console.error(`Error setting up reactivity for ${e}:`,u);return}a&&lt(t,a);try{o()}catch(u){console.error(`Error during initial update for ${e}:`,u)}return}if(typeof n=="function"){const o=Y(()=>{Mt(t,e,n())});lt(t,o);return}}Mt(t,e,n)}catch(r){console.error(`Error setting up reactivity for ${e}:`,r)}}function Mt(t,e,n){const r=It?It(n):void 0;let s=r?r():n;if(e.startsWith("on"),s==null){e==="style"?t.removeAttribute("style"):(e in t&&!(t instanceof SVGElement)&&(t[e]=null),t.removeAttribute(e));return}if(e.startsWith("data-")||e.startsWith("aria-"))t.setAttribute(e,String(s));else if(e==="class")(t instanceof HTMLElement||t instanceof SVGElement)&&t.setAttribute("class",String(s));else if(e==="style")if(typeof s=="object"&&t instanceof HTMLElement){const o=s;for(const a in o){if(!Object.prototype.hasOwnProperty.call(o,a))continue;const u=o[a];if(u==null)continue;const l=a.includes("-")?a:a.replace(/[A-Z]/g,p=>`-${p.toLowerCase()}`);t.style.setProperty(l,String(u));const h=a.includes("-")?a.replace(/-([a-z])/g,(p,f)=>f.toUpperCase()):a;h!==l&&(t.style[h]=String(u))}}else t.setAttribute("style",String(s));else e==="value"&&t instanceof HTMLInputElement?t.value=String(s):e==="checked"&&t instanceof HTMLInputElement?(t.checked=!!s,t.toggleAttribute("checked",!!s)):e in t&&!(t instanceof SVGElement)&&!(e.startsWith("data-")||e.startsWith("aria-"))?t[e]=s:typeof s=="boolean"?s?t.setAttribute(e,""):t.removeAttribute(e):t.setAttribute(e,String(s))}function A(t,e){if(t.nodeType===8&&t.textContent===e)return t;const n=document.createTreeWalker(t,128,null);for(;n.nextNode();)if(n.currentNode.textContent===e)return n.currentNode;return null}class hs{constructor(){this._mounted=!1,this._effects=[]}mount(e,n){this._element=e,this._props=n,this._mounted=!0,this.componentDidMount()}unmount(){this._mounted=!1,this.cleanup(),this.componentWillUnmount()}update(e){const n=this._props;this._props=e,this._mounted&&this.componentDidUpdate(e,n)}componentDidMount(){}componentDidUpdate(e,n){}componentWillUnmount(){}addEffect(e){if(this._mounted){const n=Y(e);this._effects.push(n)}}cleanup(){this._effects.forEach(e=>{e()}),this._effects=[]}get element(){return this._element}get props(){return this._props}get mounted(){return this._mounted}}function ps(t,e,n,r=null){const s=t(e);typeof t=="function"&&t.onMount&&t.onMount?.(s,e),t instanceof hs&&t.mount(s,e);const i=s;return r?n.insertBefore(i,r):n.appendChild(i),s}function it(t){return typeof t!="string"?String(t):t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ne(){return typeof document>"u"}function Dn(){return ne()?{t:"",__ssr:!0,childNodes:[],appendChild(e){return this.childNodes.push(e),this.t+=e&&e.__ssr?e.t:it(String(e)),e},removeChild(e){const n=this.childNodes.indexOf(e);return n!==-1&&(this.childNodes.splice(n,1),this.t=this.childNodes.map(r=>r&&r.__ssr?r.t:it(String(r))).join("")),e},insertBefore(e,n){if(n){const r=this.childNodes.indexOf(n);r!==-1?this.childNodes.splice(r,0,e):this.childNodes.push(e)}else this.childNodes.push(e);return this.t=this.childNodes.map(r=>r&&r.__ssr?r.t:it(String(r))).join(""),e},cloneNode(){return{...this,childNodes:this.childNodes?[...this.childNodes]:[]}}}:document.createDocumentFragment()}function dt(t){return ne()?{t:`<!--${it(t)}-->`,__ssr:!0,textContent:t,nodeType:8,cloneNode(){return{...this}}}:document.createComment(t)}function fs(t){const e=Dn(),n=dt("For start"),r=dt("For end");e.appendChild(n),e.appendChild(r);const s=Array.isArray(t.children)?t.children[0]:t.children;if(typeof s!="function")throw new Error("For component children must be a function.");const i=new Map,o=()=>{let a=[];Ie(t.each)||typeof t.each=="function"?a=t.each():a=t.each,Array.isArray(a)||(a=[]);const u=ne()?e:n.parentNode||e,l=[],h=new Map;if(i.forEach((p,f)=>{h.set(f,[...p])}),a.forEach((p,f)=>{const b=h.get(p);if(b&&b.length>0){const y=b.shift();y.setIndex(f),l.push(y)}else{const[y,E]=Ue(f),M=s(p,y);let H=[];ne()?H=[M]:M instanceof DocumentFragment?H=Array.from(M.childNodes):M instanceof Node&&(H=[M]),l.push({nodes:H,indexSignal:y,setIndex:E})}}),h.forEach(p=>{p.forEach(f=>{ne()||f.nodes.forEach(b=>b.parentElement?.removeChild(b))})}),ne()){const p=u.childNodes||[],f=p.indexOf(n),b=p.indexOf(r);f>=0&&b>f&&p.slice(f+1,b).forEach(M=>u.removeChild(M)),l.flatMap(E=>E.nodes).forEach(E=>u.insertBefore(E,r))}else{let p=r;for(let f=l.length-1;f>=0;f--){const b=l[f];if(!b)continue;const y=b.nodes;for(let E=y.length-1;E>=0;E--){const M=y[E];M.nextSibling!==p&&u.insertBefore(M,p),p=M}}}i.clear(),l.forEach((p,f)=>{const b=a[f],y=i.get(b)||[];y.push(p),i.set(b,y)})};return ne()?o():Y(o),e}function xn(t){const e=Dn(),n=dt("Show start"),r=dt("Show end");e.appendChild(n),e.appendChild(r);let s=[];const i=()=>{const o=typeof t.when=="function"||Ie(t.when)?t.when():t.when,a=!!o,u=o,l=ne()?e:n.parentNode||e;ne()||s.forEach(p=>p.parentElement?.removeChild(p)),s=[];const h=a?t.children:t.fallback;if(h){const p=typeof h=="function"?h(u):h;if(ne()){const f=[p];f.forEach(b=>l.insertBefore(b,r)),s=f}else{const f=p instanceof DocumentFragment?Array.from(p.childNodes):[p];f.forEach(b=>l.insertBefore(b,r)),s=f}}};return ne()?i():Y(i),e}function gs(t){const e=t.tagName,n={},r=[],s=t.childNodes,i=t.attributes;for(const o of i){const a=o.name,u=o.value;n[a]=u}for(const o of s)r.push(Hn(o));return{tag:e,attrs:n,children:r}}function Hn(t){return t instanceof Text?t.textContent??"":gs(t)}function Bn(t){if(typeof t=="string")return document.createTextNode(t);const e=document.createElement(t.tag);for(const r of t.children)e.appendChild(Bn(r));const n=Object.keys(t.attrs);for(const r of n)e.setAttribute(r,t.attrs[r]);return e}const ms=`# The basics

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
`,bs=`# Routing & SPA

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
`,ys=`# Components

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
`,xs=`# Get started with HyperFX

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
`,Ss=`# State Management

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
`,ks=`# Rendering

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
`,ws=`# Server-Side Rendering (SSR)

HyperFX provides built-in support for Server-Side Rendering and client-side hydration. This allows you to generate HTML on the server for faster initial page loads and better SEO, while still maintaining full reactivity on the client.

## Key Concepts

### Structural Hydration

HyperFX uses **structural hydration** - the client validates that its component tree matches the server-rendered tree by walking both trees in parallel and comparing:
- Element tag names
- Tree structure and positions
- Child element counts

This approach is:
- **Order-independent**: Works regardless of JSX evaluation order
- **Clean**: No hydration IDs in the HTML output
- **Robust**: Validates structure and falls back to client-side render on mismatch

### State Restoration

Signal state is serialized on the server and restored on the client via \`window.__HYPERFX_HYDRATION_DATA__\`, ensuring your reactive state persists across the SSR boundary.

---

## Server-Side API

### \`renderToString(element, options?)\`

Converts a JSX element into an HTML string and extracts hydration data.

\`\`\`tsx
import { renderToString, enableSSRMode, disableSSRMode } from "hyperfx";

// Enable SSR mode before creating components
enableSSRMode();

const appElement = <App />;

const { html, hydrationData } = renderToString(appElement, { 
  ssrHydration: true  // Enable signal serialization
});

disableSSRMode();
\`\`\`

**Options:**
- \`ssrHydration\`: Enable/disable hydration data collection (default: \`false\`)
- \`initialState\`: Restore signals to specific values before rendering

### \`renderHydrationData(data)\`

Converts hydration data into a \`<script>\` tag that sets \`window.__HYPERFX_HYDRATION_DATA__\`.

\`\`\`tsx
import { renderHydrationData } from "hyperfx";

const hydrationScript = renderHydrationData(hydrationData);
// Returns: <script>window.__HYPERFX_HYDRATION_DATA__ = {...};<\/script>
\`\`\`

---

## Client-Side API

### \`hydrate(container, factory)\`

Hydrates server-rendered content by:
1. Building a fresh client DOM tree with event handlers
2. Validating it matches the server tree structurally
3. Replacing server DOM with client DOM
4. Restoring signal state

\`\`\`tsx
import { hydrate, isHydratable } from "hyperfx";

if (isHydratable(document.body)) {
  hydrate(document.body, () => <App />);
} else {
  // No SSR content, do client-side mount
  document.body.appendChild(<App />);
}
\`\`\`

### \`isHydratable(container)\`

Checks if a container has server-rendered content to hydrate.

\`\`\`tsx
import { isHydratable } from "hyperfx";

if (isHydratable(document.body)) {
  // Has SSR content
}
\`\`\`

---

## Complete SSR Example

### Server Setup

\`\`\`tsx
// server.tsx
import { 
  renderToString, 
  renderHydrationData,
  enableSSRMode,
  disableSSRMode 
} from "hyperfx";
import { App } from "./App";

export default async function handler(req: Request) {
  // Enable SSR mode
  enableSSRMode();

  // Create app element
  const appElement = <App />;
  
  // Render to HTML with hydration data
  const { html, hydrationData } = renderToString(appElement, { 
    ssrHydration: true
  });
  
  // Generate hydration script
  const hydrationScript = renderHydrationData(hydrationData);
  
  // Disable SSR mode
  disableSSRMode();

  // Return complete HTML document
  return new Response(\`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>HyperFX SSR App</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        \${html}
        \${hydrationScript}
        <script src="/client.js" type="module"><\/script>
      </body>
    </html>
  \`, {
    headers: { "Content-Type": "text/html" }
  });
}
\`\`\`

### Client Setup

\`\`\`tsx
// client.tsx
import { hydrate, isHydratable } from "hyperfx";
import { App } from "./App";

function initializeClient() {
  const ClientApp = () => <App />;

  if (isHydratable(document.body)) {
    // Hydrate server-rendered content
    hydrate(document.body, ClientApp);
  } else {
    // No SSR content, do client-side mount
    document.body.appendChild(<ClientApp />);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeClient);
} else {
  initializeClient();
}
\`\`\`

### Component with Signal

\`\`\`tsx
// App.tsx
import { createSignal } from "hyperfx";

export function App() {
  // Register signal with a unique key for SSR
  const [count, setCount] = createSignal(0, { key: 'app-counter' });

  return (
    <div id="app">
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

---

## Signal Serialization

To serialize a signal across the SSR boundary, provide a unique \`key\`:

\`\`\`tsx
// With key - will be serialized
const [count, setCount] = createSignal(0, { key: 'counter' });

// Without key - won't be serialized (local state only)
const [local, setLocal] = createSignal(0);
\`\`\`

The key must be:
- Unique across your application
- Consistent between server and client
- A valid object property name

---

## How It Works

### 1. Server Phase
- \`enableSSRMode()\` activates signal registry
- Components create and register signals with keys
- \`renderToString()\` serializes the DOM tree to HTML
- Signal values are collected from the registry
- \`renderHydrationData()\` creates a script tag with state

### 2. Transfer Phase
- Clean HTML (no hydration markers)
- Hydration data via \`window.__HYPERFX_HYDRATION_DATA__\`

### 3. Client Phase
- Client creates fresh component tree with event handlers
- \`hydrate()\` validates client tree matches server tree structurally
- Server DOM is replaced with client DOM
- Signal values are restored from hydration data
- Application is fully interactive

### 4. Fallback Behavior
- If structure doesn't match: full client-side render
- If hydration fails: automatic fallback to client-side render
- Graceful degradation ensures app always works

---

## Best Practices

### ✅ Do
- Always call \`enableSSRMode()\` before creating components
- Always call \`disableSSRMode()\` after rendering
- Use unique, descriptive keys for signals that need SSR
- Match component structure exactly between server and client
- Handle both hydration and non-hydration paths in client code

### ❌ Don't
- Don't render different content on server vs client (causes mismatch)
- Don't use randomness or timestamps in SSR content
- Don't forget to include the hydration script in your HTML
- Don't reuse signal keys across different components

---

## Troubleshooting

### Structure Mismatch Warning

If you see: \`[HyperFX] Structure mismatch detected\`

**Causes:**
- Server and client rendering different content
- Conditional logic that differs between environments
- Missing or extra elements on client vs server

**Solution:**
- Ensure component logic is consistent
- Use same data for initial render
- Check for \`window\`/\`document\` checks that change rendering

### Signals Not Restoring

**Causes:**
- Signal created without a \`key\` option
- Key mismatch between server and client
- Hydration script not included in HTML

**Solution:**
- Add \`key\` option to signal: \`createSignal(0, { key: 'my-signal' })\`
- Verify keys match exactly
- Check \`window.__HYPERFX_HYDRATION_DATA__\` exists

### Event Handlers Not Working

**Causes:**
- Hydration failed and fell back to server DOM
- Event handlers not attached in component

**Solution:**
- Check console for hydration errors
- Ensure client creates handlers same as initial render
- Verify component code runs on client
`,Pn=[{title:"Get Started",route_name:"get_started",data:xs},{title:"HyperFX basics",route_name:"basics",data:ms},{title:"State Management",route_name:"state-management",data:Ss},{title:"Rendering & Control Flow",route_name:"render",data:ks},{title:"HyperFX components",route_name:"components",data:ys},{title:"Single Page Application",route_name:"spa",data:bs},{title:"Server-Side Rendering",route_name:"ssr",data:ws}],_s=$('<nav class="flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg"><!--hfx:dyn:0:0--><!--hfx:dyn:0:1--><!--hfx:dyn:0:2--></nav>'),Es=$('<aside class="bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl"><!--hfx:dyn:1:0--><!--hfx:dyn:1:1--></aside>'),vs=$('<div class="flex items-center justify-between mb-6 sm:hidden"><!--hfx:dyn:2:0--></div>'),Ts=$('<button class="text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform" title="Toggle Navigation"><span class="text-lg">☰</span><span class="sr-only">Toggle Navigation</span></button>'),Ns=$(`<nav><p class="hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3">
          Fundamentals
        </p><!--hfx:dyn:4:0--></nav>`);function Rs(){return(()=>{const t=_s.cloneNode(!0),e=A(t,"hfx:dyn:0:0"),n=A(t,"hfx:dyn:0:1"),r=A(t,"hfx:dyn:0:2");return e&&R(e.parentNode,re(at(se({class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:mt,children:`
        Home
      `}))),e),n&&R(n.parentNode,re(at(se({class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:mt,search:{document:"get_started"},children:`
        Docs
      `}))),n),r&&R(r.parentNode,re(at(se({class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:ur,children:`
        Example
      `}))),r),t})()}const[As,Cs]=Ue(!1);function Ms(){Cs(t=>!t)}function $s(){const t=le(()=>`flex-col sm:flex gap-1 ${As()?"flex":"hidden"}`);return(()=>{const e=Es.cloneNode(!0),n=A(e,"hfx:dyn:1:0"),r=A(e,"hfx:dyn:1:1");return n&&R(n.parentNode,(()=>{const s=vs.cloneNode(!0),i=A(s,"hfx:dyn:2:0");return i&&R(i.parentNode,(()=>{const o=Ts.cloneNode(!0);return ut(o,"click",Ms),o})(),i),s})(),n),r&&R(r.parentNode,(()=>{const s=Ns.cloneNode(!0);ye(s,"class",t);const i=A(s,"hfx:dyn:4:0");return i&&R(i.parentNode,re(fs(se({each:Pn,children:o=>re(at(se({class:"px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block",to:mt,search:{document:o.route_name},children:o.title})))}))),i),s})(),r),e})()}function Gt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ve=Gt();function zn(t){ve=t}var Fe={exec:()=>null};function I(t,e=""){let n=typeof t=="string"?t:t.source;const r={replace:(s,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(K.caret,"$1"),n=n.replace(s,o),r},getRegex:()=>new RegExp(n,e)};return r}var K={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},Os=/^(?:[ \t]*(?:\n|$))+/,Is=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ls=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ge=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ds=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,jt=/(?:[*+-]|\d{1,9}[.)])/,Fn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Un=I(Fn).replace(/bull/g,jt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Hs=I(Fn).replace(/bull/g,jt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Wt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Bs=/^[^\n]+/,qt=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Ps=I(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",qt).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),zs=I(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,jt).getRegex(),bt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Zt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Fs=I("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Zt).replace("tag",bt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Xn=I(Wt).replace("hr",Ge).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",bt).getRegex(),Us=I(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Xn).getRegex(),Kt={blockquote:Us,code:Is,def:Ps,fences:Ls,heading:Ds,hr:Ge,html:Fs,lheading:Un,list:zs,newline:Os,paragraph:Xn,table:Fe,text:Bs},Sn=I("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ge).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",bt).getRegex(),Xs={...Kt,lheading:Hs,table:Sn,paragraph:I(Wt).replace("hr",Ge).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Sn).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",bt).getRegex()},Gs={...Kt,html:I(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Zt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Fe,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:I(Wt).replace("hr",Ge).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Un).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},js=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ws=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Gn=/^( {2,}|\\)\n(?!\s*$)/,qs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,yt=/[\p{P}\p{S}]/u,Jt=/[\s\p{P}\p{S}]/u,jn=/[^\s\p{P}\p{S}]/u,Zs=I(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Jt).getRegex(),Wn=/(?!~)[\p{P}\p{S}]/u,Ks=/(?!~)[\s\p{P}\p{S}]/u,Js=/(?:[^\s\p{P}\p{S}]|~)/u,Ys=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,qn=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Vs=I(qn,"u").replace(/punct/g,yt).getRegex(),Qs=I(qn,"u").replace(/punct/g,Wn).getRegex(),Zn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ei=I(Zn,"gu").replace(/notPunctSpace/g,jn).replace(/punctSpace/g,Jt).replace(/punct/g,yt).getRegex(),ti=I(Zn,"gu").replace(/notPunctSpace/g,Js).replace(/punctSpace/g,Ks).replace(/punct/g,Wn).getRegex(),ni=I("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,jn).replace(/punctSpace/g,Jt).replace(/punct/g,yt).getRegex(),ri=I(/\\(punct)/,"gu").replace(/punct/g,yt).getRegex(),si=I(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ii=I(Zt).replace("(?:-->|$)","-->").getRegex(),oi=I("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ii).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ht=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ai=I(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",ht).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Kn=I(/^!?\[(label)\]\[(ref)\]/).replace("label",ht).replace("ref",qt).getRegex(),Jn=I(/^!?\[(ref)\](?:\[\])?/).replace("ref",qt).getRegex(),ci=I("reflink|nolink(?!\\()","g").replace("reflink",Kn).replace("nolink",Jn).getRegex(),Yt={_backpedal:Fe,anyPunctuation:ri,autolink:si,blockSkip:Ys,br:Gn,code:Ws,del:Fe,emStrongLDelim:Vs,emStrongRDelimAst:ei,emStrongRDelimUnd:ni,escape:js,link:ai,nolink:Jn,punctuation:Zs,reflink:Kn,reflinkSearch:ci,tag:oi,text:qs,url:Fe},li={...Yt,link:I(/^!?\[(label)\]\((.*?)\)/).replace("label",ht).getRegex(),reflink:I(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ht).getRegex()},zt={...Yt,emStrongRDelimAst:ti,emStrongLDelim:Qs,url:I(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},ui={...zt,br:I(Gn).replace("{2,}","*").getRegex(),text:I(zt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},rt={normal:Kt,gfm:Xs,pedantic:Gs},Pe={normal:Yt,gfm:zt,breaks:ui,pedantic:li},di={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},kn=t=>di[t];function ce(t,e){if(e){if(K.escapeTest.test(t))return t.replace(K.escapeReplace,kn)}else if(K.escapeTestNoEncode.test(t))return t.replace(K.escapeReplaceNoEncode,kn);return t}function wn(t){try{t=encodeURI(t).replace(K.percentDecode,"%")}catch{return null}return t}function _n(t,e){const n=t.replace(K.findPipe,(i,o,a)=>{let u=!1,l=o;for(;--l>=0&&a[l]==="\\";)u=!u;return u?"|":" |"}),r=n.split(K.splitPipe);let s=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;s<r.length;s++)r[s]=r[s].trim().replace(K.slashPipe,"|");return r}function ze(t,e,n){const r=t.length;if(r===0)return"";let s=0;for(;s<r&&t.charAt(r-s-1)===e;)s++;return t.slice(0,r-s)}function hi(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function En(t,e,n,r,s){const i=e.href,o=e.title||null,a=t[1].replace(s.other.outputLinkReplace,"$1");r.state.inLink=!0;const u={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:a,tokens:r.inlineTokens(a)};return r.state.inLink=!1,u}function pi(t,e,n){const r=t.match(n.other.indentCodeCompensation);if(r===null)return e;const s=r[1];return e.split(`
`).map(i=>{const o=i.match(n.other.beginningSpace);if(o===null)return i;const[a]=o;return a.length>=s.length?i.slice(s.length):i}).join(`
`)}var pt=class{options;rules;lexer;constructor(t){this.options=t||ve}space(t){const e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){const e=this.rules.block.code.exec(t);if(e){const n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:ze(n,`
`)}}}fences(t){const e=this.rules.block.fences.exec(t);if(e){const n=e[0],r=pi(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){const e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){const r=ze(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){const e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:ze(e[0],`
`)}}blockquote(t){const e=this.rules.block.blockquote.exec(t);if(e){let n=ze(e[0],`
`).split(`
`),r="",s="";const i=[];for(;n.length>0;){let o=!1;const a=[];let u;for(u=0;u<n.length;u++)if(this.rules.other.blockquoteStart.test(n[u]))a.push(n[u]),o=!0;else if(!o)a.push(n[u]);else break;n=n.slice(u);const l=a.join(`
`),h=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${l}`:l,s=s?`${s}
${h}`:h;const p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,i,!0),this.lexer.state.top=p,n.length===0)break;const f=i.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){const b=f,y=b.raw+`
`+n.join(`
`),E=this.blockquote(y);i[i.length-1]=E,r=r.substring(0,r.length-b.raw.length)+E.raw,s=s.substring(0,s.length-b.text.length)+E.text;break}else if(f?.type==="list"){const b=f,y=b.raw+`
`+n.join(`
`),E=this.list(y);i[i.length-1]=E,r=r.substring(0,r.length-f.raw.length)+E.raw,s=s.substring(0,s.length-b.raw.length)+E.raw,n=y.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:i,text:s}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim();const r=n.length>1,s={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");const i=this.rules.other.listItemRegex(n);let o=!1;for(;t;){let u=!1,l="",h="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;l=e[0],t=t.substring(l.length);let p=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,H=>" ".repeat(3*H.length)),f=t.split(`
`,1)[0],b=!p.trim(),y=0;if(this.options.pedantic?(y=2,h=p.trimStart()):b?y=e[1].length+1:(y=e[2].search(this.rules.other.nonSpaceChar),y=y>4?1:y,h=p.slice(y),y+=e[1].length),b&&this.rules.other.blankLine.test(f)&&(l+=f+`
`,t=t.substring(f.length+1),u=!0),!u){const H=this.rules.other.nextBulletRegex(y),G=this.rules.other.hrRegex(y),V=this.rules.other.fencesBeginRegex(y),de=this.rules.other.headingBeginRegex(y),Q=this.rules.other.htmlBeginRegex(y);for(;t;){const ee=t.split(`
`,1)[0];let ie;if(f=ee,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),ie=f):ie=f.replace(this.rules.other.tabCharGlobal,"    "),V.test(f)||de.test(f)||Q.test(f)||H.test(f)||G.test(f))break;if(ie.search(this.rules.other.nonSpaceChar)>=y||!f.trim())h+=`
`+ie.slice(y);else{if(b||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||V.test(p)||de.test(p)||G.test(p))break;h+=`
`+f}!b&&!f.trim()&&(b=!0),l+=ee+`
`,t=t.substring(ee.length+1),p=ie.slice(y)}}s.loose||(o?s.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(o=!0));let E=null,M;this.options.gfm&&(E=this.rules.other.listIsTask.exec(h),E&&(M=E[0]!=="[ ] ",h=h.replace(this.rules.other.listReplaceTask,""))),s.items.push({type:"list_item",raw:l,task:!!E,checked:M,loose:!1,text:h,tokens:[]}),s.raw+=l}const a=s.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let u=0;u<s.items.length;u++)if(this.lexer.state.top=!1,s.items[u].tokens=this.lexer.blockTokens(s.items[u].text,[]),!s.loose){const l=s.items[u].tokens.filter(p=>p.type==="space"),h=l.length>0&&l.some(p=>this.rules.other.anyLine.test(p.raw));s.loose=h}if(s.loose)for(let u=0;u<s.items.length;u++)s.items[u].loose=!0;return s}}html(t){const e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){const e=this.rules.block.def.exec(t);if(e){const n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:r,title:s}}}table(t){const e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const n=_n(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===r.length){for(const o of r)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(const o of s)i.rows.push(_n(o,i.header.length).map((a,u)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:i.align[u]})));return i}}lheading(t){const e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){const e=this.rules.block.paragraph.exec(t);if(e){const n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){const e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){const e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){const e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){const e=this.rules.inline.link.exec(t);if(e){const n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const i=ze(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{const i=hi(e[2],"()");if(i===-2)return;if(i>-1){const a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let r=e[2],s="";if(this.options.pedantic){const i=this.rules.other.pedanticHrefTitle.exec(r);i&&(r=i[1],s=i[3])}else s=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),En(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){const r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=e[r.toLowerCase()];if(!s){const i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return En(n,s,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(r[1]||r[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const i=[...r[0]].length-1;let o,a,u=i,l=0;const h=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,e=e.slice(-1*t.length+i);(r=h.exec(e))!=null;){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o)continue;if(a=[...o].length,r[3]||r[4]){u+=a;continue}else if((r[5]||r[6])&&i%3&&!((i+a)%3)){l+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u+l);const p=[...r[0]][0].length,f=t.slice(0,i+r.index+p+a);if(Math.min(i,a)%2){const y=f.slice(1,-1);return{type:"em",raw:f,text:y,tokens:this.lexer.inlineTokens(y)}}const b=f.slice(2,-2);return{type:"strong",raw:f,text:b,tokens:this.lexer.inlineTokens(b)}}}}codespan(t){const e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," ");const r=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){const e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){const e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){const e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let s;do s=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(s!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){const e=this.rules.inline.text.exec(t);if(e){const n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},pe=class Ft{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ve,this.options.tokenizer=this.options.tokenizer||new pt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={other:K,block:rt.normal,inline:Pe.normal};this.options.pedantic?(n.block=rt.pedantic,n.inline=Pe.pedantic):this.options.gfm&&(n.block=rt.gfm,this.options.breaks?n.inline=Pe.breaks:n.inline=Pe.gfm),this.tokenizer.rules=n}static get rules(){return{block:rt,inline:Pe}}static lex(e,n){return new Ft(n).lex(e)}static lexInline(e,n){return new Ft(n).inlineTokens(e)}lex(e){e=e.replace(K.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){const r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){for(this.options.pedantic&&(e=e.replace(K.tabCharGlobal,"    ").replace(K.spaceLine,""));e;){let s;if(this.options.extensions?.block?.some(o=>(s=o.call({lexer:this},e,n))?(e=e.substring(s.raw.length),n.push(s),!0):!1))continue;if(s=this.tokenizer.space(e)){e=e.substring(s.raw.length);const o=n.at(-1);s.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(s);continue}if(s=this.tokenizer.code(e)){e=e.substring(s.raw.length);const o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue.at(-1).src=o.text):n.push(s);continue}if(s=this.tokenizer.fences(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.heading(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.hr(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.blockquote(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.list(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.html(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.def(e)){e=e.substring(s.raw.length);const o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=`
`+s.raw,o.text+=`
`+s.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[s.tag]||(this.tokens.links[s.tag]={href:s.href,title:s.title});continue}if(s=this.tokenizer.table(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.lheading(e)){e=e.substring(s.raw.length),n.push(s);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0;const a=e.slice(1);let u;this.options.extensions.startBlock.forEach(l=>{u=l.call({lexer:this},a),typeof u=="number"&&u>=0&&(o=Math.min(o,u))}),o<1/0&&o>=0&&(i=e.substring(0,o+1))}if(this.state.top&&(s=this.tokenizer.paragraph(i))){const o=n.at(-1);r&&o?.type==="paragraph"?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(s),r=i.length!==e.length,e=e.substring(s.raw.length);continue}if(s=this.tokenizer.text(e)){e=e.substring(s.raw.length);const o=n.at(-1);o?.type==="text"?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(s);continue}if(e){const o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let r=e,s=null;if(this.tokens.links){const a=Object.keys(this.tokens.links);if(a.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)a.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,s.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(s=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let i=!1,o="";for(;e;){i||(o=""),i=!1;let a;if(this.options.extensions?.inline?.some(l=>(a=l.call({lexer:this},e,n))?(e=e.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);const l=n.at(-1);a.type==="text"&&l?.type==="text"?(l.raw+=a.raw,l.text+=a.text):n.push(a);continue}if(a=this.tokenizer.emStrong(e,r,o)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.del(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),n.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),n.push(a);continue}let u=e;if(this.options.extensions?.startInline){let l=1/0;const h=e.slice(1);let p;this.options.extensions.startInline.forEach(f=>{p=f.call({lexer:this},h),typeof p=="number"&&p>=0&&(l=Math.min(l,p))}),l<1/0&&l>=0&&(u=e.substring(0,l+1))}if(a=this.tokenizer.inlineText(u)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(o=a.raw.slice(-1)),i=!0;const l=n.at(-1);l?.type==="text"?(l.raw+=a.raw,l.text+=a.text):n.push(a);continue}if(e){const l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return n}},ft=class{options;parser;constructor(t){this.options=t||ve}space(t){return""}code({text:t,lang:e,escaped:n}){const r=(e||"").match(K.notSpaceStart)?.[0],s=t.replace(K.endingNewline,"")+`
`;return r?'<pre><code class="language-'+ce(r)+'">'+(n?s:ce(s,!0))+`</code></pre>
`:"<pre><code>"+(n?s:ce(s,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){const e=t.ordered,n=t.start;let r="";for(let o=0;o<t.items.length;o++){const a=t.items[o];r+=this.listitem(a)}const s=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+s+i+`>
`+r+"</"+s+`>
`}listitem(t){let e="";if(t.task){const n=this.checkbox({checked:!!t.checked});t.loose?t.tokens[0]?.type==="paragraph"?(t.tokens[0].text=n+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=n+" "+ce(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:!0}):e+=n+" "}return e+=this.parser.parse(t.tokens,!!t.loose),`<li>${e}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let s=0;s<t.header.length;s++)n+=this.tablecell(t.header[s]);e+=this.tablerow({text:n});let r="";for(let s=0;s<t.rows.length;s++){const i=t.rows[s];n="";for(let o=0;o<i.length;o++)n+=this.tablecell(i[o]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${ce(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){const r=this.parser.parseInline(n),s=wn(t);if(s===null)return r;t=s;let i='<a href="'+t+'"';return e&&(i+=' title="'+ce(e)+'"'),i+=">"+r+"</a>",i}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));const s=wn(t);if(s===null)return ce(n);t=s;let i=`<img src="${t}" alt="${n}"`;return e&&(i+=` title="${ce(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:ce(t.text)}},Vt=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},fe=class Ut{options;renderer;textRenderer;constructor(e){this.options=e||ve,this.options.renderer=this.options.renderer||new ft,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Vt}static parse(e,n){return new Ut(n).parse(e)}static parseInline(e,n){return new Ut(n).parseInline(e)}parse(e,n=!0){let r="";for(let s=0;s<e.length;s++){const i=e[s];if(this.options.extensions?.renderers?.[i.type]){const a=i,u=this.options.extensions.renderers[a.type].call({parser:this},a);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(a.type)){r+=u||"";continue}}const o=i;switch(o.type){case"space":{r+=this.renderer.space(o);continue}case"hr":{r+=this.renderer.hr(o);continue}case"heading":{r+=this.renderer.heading(o);continue}case"code":{r+=this.renderer.code(o);continue}case"table":{r+=this.renderer.table(o);continue}case"blockquote":{r+=this.renderer.blockquote(o);continue}case"list":{r+=this.renderer.list(o);continue}case"html":{r+=this.renderer.html(o);continue}case"paragraph":{r+=this.renderer.paragraph(o);continue}case"text":{let a=o,u=this.renderer.text(a);for(;s+1<e.length&&e[s+1].type==="text";)a=e[++s],u+=`
`+this.renderer.text(a);n?r+=this.renderer.paragraph({type:"paragraph",raw:u,text:u,tokens:[{type:"text",raw:u,text:u,escaped:!0}]}):r+=u;continue}default:{const a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}parseInline(e,n=this.renderer){let r="";for(let s=0;s<e.length;s++){const i=e[s];if(this.options.extensions?.renderers?.[i.type]){const a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){r+=a||"";continue}}const o=i;switch(o.type){case"escape":{r+=n.text(o);break}case"html":{r+=n.html(o);break}case"link":{r+=n.link(o);break}case"image":{r+=n.image(o);break}case"strong":{r+=n.strong(o);break}case"em":{r+=n.em(o);break}case"codespan":{r+=n.codespan(o);break}case"br":{r+=n.br(o);break}case"del":{r+=n.del(o);break}case"text":{r+=n.text(o);break}default:{const a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}},ot=class{options;block;constructor(t){this.options=t||ve}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?pe.lex:pe.lexInline}provideParser(){return this.block?fe.parse:fe.parseInline}},fi=class{defaults=Gt();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=fe;Renderer=ft;TextRenderer=Vt;Lexer=pe;Tokenizer=pt;Hooks=ot;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(const r of t)switch(n=n.concat(e.call(this,r)),r.type){case"table":{const s=r;for(const i of s.header)n=n.concat(this.walkTokens(i.tokens,e));for(const i of s.rows)for(const o of i)n=n.concat(this.walkTokens(o.tokens,e));break}case"list":{const s=r;n=n.concat(this.walkTokens(s.items,e));break}default:{const s=r;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(i=>{const o=s[i].flat(1/0);n=n.concat(this.walkTokens(o,e))}):s.tokens&&(n=n.concat(this.walkTokens(s.tokens,e)))}}return n}use(...t){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{const r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){const i=e.renderers[s.name];i?e.renderers[s.name]=function(...o){let a=s.renderer.apply(this,o);return a===!1&&(a=i.apply(this,o)),a}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const i=e[s.level];i?i.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),r.extensions=e),n.renderer){const s=this.defaults.renderer||new ft(this.defaults);for(const i in n.renderer){if(!(i in s))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;const o=i,a=n.renderer[o],u=s[o];s[o]=(...l)=>{let h=a.apply(s,l);return h===!1&&(h=u.apply(s,l)),h||""}}r.renderer=s}if(n.tokenizer){const s=this.defaults.tokenizer||new pt(this.defaults);for(const i in n.tokenizer){if(!(i in s))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;const o=i,a=n.tokenizer[o],u=s[o];s[o]=(...l)=>{let h=a.apply(s,l);return h===!1&&(h=u.apply(s,l)),h}}r.tokenizer=s}if(n.hooks){const s=this.defaults.hooks||new ot;for(const i in n.hooks){if(!(i in s))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;const o=i,a=n.hooks[o],u=s[o];ot.passThroughHooks.has(i)?s[o]=l=>{if(this.defaults.async)return Promise.resolve(a.call(s,l)).then(p=>u.call(s,p));const h=a.call(s,l);return u.call(s,h)}:s[o]=(...l)=>{let h=a.apply(s,l);return h===!1&&(h=u.apply(s,l)),h}}r.hooks=s}if(n.walkTokens){const s=this.defaults.walkTokens,i=n.walkTokens;r.walkTokens=function(o){let a=[];return a.push(i.call(this,o)),s&&(a=a.concat(s.call(this,o))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return pe.lex(t,e??this.defaults)}parser(t,e){return fe.parse(t,e??this.defaults)}parseMarkdown(t){return(n,r)=>{const s={...r},i={...this.defaults,...s},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&s.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));i.hooks&&(i.hooks.options=i,i.hooks.block=t);const a=i.hooks?i.hooks.provideLexer():t?pe.lex:pe.lexInline,u=i.hooks?i.hooks.provideParser():t?fe.parse:fe.parseInline;if(i.async)return Promise.resolve(i.hooks?i.hooks.preprocess(n):n).then(l=>a(l,i)).then(l=>i.hooks?i.hooks.processAllTokens(l):l).then(l=>i.walkTokens?Promise.all(this.walkTokens(l,i.walkTokens)).then(()=>l):l).then(l=>u(l,i)).then(l=>i.hooks?i.hooks.postprocess(l):l).catch(o);try{i.hooks&&(n=i.hooks.preprocess(n));let l=a(n,i);i.hooks&&(l=i.hooks.processAllTokens(l)),i.walkTokens&&this.walkTokens(l,i.walkTokens);let h=u(l,i);return i.hooks&&(h=i.hooks.postprocess(h)),h}catch(l){return o(l)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const r="<p>An error occurred:</p><pre>"+ce(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},Ee=new fi;function D(t,e){return Ee.parse(t,e)}D.options=D.setOptions=function(t){return Ee.setOptions(t),D.defaults=Ee.defaults,zn(D.defaults),D};D.getDefaults=Gt;D.defaults=ve;D.use=function(...t){return Ee.use(...t),D.defaults=Ee.defaults,zn(D.defaults),D};D.walkTokens=function(t,e){return Ee.walkTokens(t,e)};D.parseInline=Ee.parseInline;D.Parser=fe;D.parser=fe.parse;D.Renderer=ft;D.TextRenderer=Vt;D.Lexer=pe;D.lexer=pe.lex;D.Tokenizer=pt;D.Hooks=ot;D.parse=D;D.options;D.setOptions;D.use;D.walkTokens;D.parseInline;var Yn=D;fe.parse;pe.lex;const gi=`# HyperFX

HyperFX (hypermedia functions) is a simple library for DOM manipulation by using functions.
Right now it's JSX based. And it is not production ready.   

## Use case

Absolutely none, it is just a fun project.
`;function mi(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var $t,vn;function bi(){if(vn)return $t;vn=1;function t(c){return c instanceof Map?c.clear=c.delete=c.set=function(){throw new Error("map is read-only")}:c instanceof Set&&(c.add=c.clear=c.delete=function(){throw new Error("set is read-only")}),Object.freeze(c),Object.getOwnPropertyNames(c).forEach(d=>{const m=c[d],T=typeof m;(T==="object"||T==="function")&&!Object.isFrozen(m)&&t(m)}),c}class e{constructor(d){d.data===void 0&&(d.data={}),this.data=d.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(c){return c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function r(c,...d){const m=Object.create(null);for(const T in c)m[T]=c[T];return d.forEach(function(T){for(const z in T)m[z]=T[z]}),m}const s="</span>",i=c=>!!c.scope,o=(c,{prefix:d})=>{if(c.startsWith("language:"))return c.replace("language:","language-");if(c.includes(".")){const m=c.split(".");return[`${d}${m.shift()}`,...m.map((T,z)=>`${T}${"_".repeat(z+1)}`)].join(" ")}return`${d}${c}`};class a{constructor(d,m){this.buffer="",this.classPrefix=m.classPrefix,d.walk(this)}addText(d){this.buffer+=n(d)}openNode(d){if(!i(d))return;const m=o(d.scope,{prefix:this.classPrefix});this.span(m)}closeNode(d){i(d)&&(this.buffer+=s)}value(){return this.buffer}span(d){this.buffer+=`<span class="${d}">`}}const u=(c={})=>{const d={children:[]};return Object.assign(d,c),d};class l{constructor(){this.rootNode=u(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(d){this.top.children.push(d)}openNode(d){const m=u({scope:d});this.add(m),this.stack.push(m)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(d){return this.constructor._walk(d,this.rootNode)}static _walk(d,m){return typeof m=="string"?d.addText(m):m.children&&(d.openNode(m),m.children.forEach(T=>this._walk(d,T)),d.closeNode(m)),d}static _collapse(d){typeof d!="string"&&d.children&&(d.children.every(m=>typeof m=="string")?d.children=[d.children.join("")]:d.children.forEach(m=>{l._collapse(m)}))}}class h extends l{constructor(d){super(),this.options=d}addText(d){d!==""&&this.add(d)}startScope(d){this.openNode(d)}endScope(){this.closeNode()}__addSublanguage(d,m){const T=d.root;m&&(T.scope=`language:${m}`),this.add(T)}toHTML(){return new a(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function p(c){return c?typeof c=="string"?c:c.source:null}function f(c){return E("(?=",c,")")}function b(c){return E("(?:",c,")*")}function y(c){return E("(?:",c,")?")}function E(...c){return c.map(m=>p(m)).join("")}function M(c){const d=c[c.length-1];return typeof d=="object"&&d.constructor===Object?(c.splice(c.length-1,1),d):{}}function H(...c){return"("+(M(c).capture?"":"?:")+c.map(T=>p(T)).join("|")+")"}function G(c){return new RegExp(c.toString()+"|").exec("").length-1}function V(c,d){const m=c&&c.exec(d);return m&&m.index===0}const de=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function Q(c,{joinWith:d}){let m=0;return c.map(T=>{m+=1;const z=m;let F=p(T),k="";for(;F.length>0;){const S=de.exec(F);if(!S){k+=F;break}k+=F.substring(0,S.index),F=F.substring(S.index+S[0].length),S[0][0]==="\\"&&S[1]?k+="\\"+String(Number(S[1])+z):(k+=S[0],S[0]==="("&&m++)}return k}).map(T=>`(${T})`).join(d)}const ee=/\b\B/,ie="[a-zA-Z]\\w*",Te="[a-zA-Z_]\\w*",je="\\b\\d+(\\.\\d+)?",We="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",qe="\\b(0b[01]+)",xt="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",St=(c={})=>{const d=/^#![ ]*\//;return c.binary&&(c.begin=E(d,/.*\b/,c.binary,/\b.*/)),r({scope:"meta",begin:d,end:/$/,relevance:0,"on:begin":(m,T)=>{m.index!==0&&T.ignoreMatch()}},c)},xe={begin:"\\\\[\\s\\S]",relevance:0},kt={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[xe]},Ze={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[xe]},wt={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},W=function(c,d,m={}){const T=r({scope:"comment",begin:c,end:d,contains:[]},m);T.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const z=H("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return T.contains.push({begin:E(/[ ]+/,"(",z,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),T},ge=W("//","$"),Se=W("/\\*","\\*/"),Ne=W("#","$"),De={scope:"number",begin:je,relevance:0},Ke={scope:"number",begin:We,relevance:0},hr={scope:"number",begin:qe,relevance:0},pr={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[xe,{begin:/\[/,end:/\]/,relevance:0,contains:[xe]}]},fr={scope:"title",begin:ie,relevance:0},gr={scope:"title",begin:Te,relevance:0},mr={begin:"\\.\\s*"+Te,relevance:0};var Je=Object.freeze({__proto__:null,APOS_STRING_MODE:kt,BACKSLASH_ESCAPE:xe,BINARY_NUMBER_MODE:hr,BINARY_NUMBER_RE:qe,COMMENT:W,C_BLOCK_COMMENT_MODE:Se,C_LINE_COMMENT_MODE:ge,C_NUMBER_MODE:Ke,C_NUMBER_RE:We,END_SAME_AS_BEGIN:function(c){return Object.assign(c,{"on:begin":(d,m)=>{m.data._beginMatch=d[1]},"on:end":(d,m)=>{m.data._beginMatch!==d[1]&&m.ignoreMatch()}})},HASH_COMMENT_MODE:Ne,IDENT_RE:ie,MATCH_NOTHING_RE:ee,METHOD_GUARD:mr,NUMBER_MODE:De,NUMBER_RE:je,PHRASAL_WORDS_MODE:wt,QUOTE_STRING_MODE:Ze,REGEXP_MODE:pr,RE_STARTERS_RE:xt,SHEBANG:St,TITLE_MODE:fr,UNDERSCORE_IDENT_RE:Te,UNDERSCORE_TITLE_MODE:gr});function br(c,d){c.input[c.index-1]==="."&&d.ignoreMatch()}function yr(c,d){c.className!==void 0&&(c.scope=c.className,delete c.className)}function xr(c,d){d&&c.beginKeywords&&(c.begin="\\b("+c.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",c.__beforeBegin=br,c.keywords=c.keywords||c.beginKeywords,delete c.beginKeywords,c.relevance===void 0&&(c.relevance=0))}function Sr(c,d){Array.isArray(c.illegal)&&(c.illegal=H(...c.illegal))}function kr(c,d){if(c.match){if(c.begin||c.end)throw new Error("begin & end are not supported with match");c.begin=c.match,delete c.match}}function wr(c,d){c.relevance===void 0&&(c.relevance=1)}const _r=(c,d)=>{if(!c.beforeMatch)return;if(c.starts)throw new Error("beforeMatch cannot be used with starts");const m=Object.assign({},c);Object.keys(c).forEach(T=>{delete c[T]}),c.keywords=m.keywords,c.begin=E(m.beforeMatch,f(m.begin)),c.starts={relevance:0,contains:[Object.assign(m,{endsParent:!0})]},c.relevance=0,delete m.beforeMatch},Er=["of","and","for","in","not","or","if","then","parent","list","value"],vr="keyword";function Qt(c,d,m=vr){const T=Object.create(null);return typeof c=="string"?z(m,c.split(" ")):Array.isArray(c)?z(m,c):Object.keys(c).forEach(function(F){Object.assign(T,Qt(c[F],d,F))}),T;function z(F,k){d&&(k=k.map(S=>S.toLowerCase())),k.forEach(function(S){const v=S.split("|");T[v[0]]=[F,Tr(v[0],v[1])]})}}function Tr(c,d){return d?Number(d):Nr(c)?0:1}function Nr(c){return Er.includes(c.toLowerCase())}const en={},ke=c=>{console.error(c)},tn=(c,...d)=>{console.log(`WARN: ${c}`,...d)},Re=(c,d)=>{en[`${c}/${d}`]||(console.log(`Deprecated as of ${c}. ${d}`),en[`${c}/${d}`]=!0)},Ye=new Error;function nn(c,d,{key:m}){let T=0;const z=c[m],F={},k={};for(let S=1;S<=d.length;S++)k[S+T]=z[S],F[S+T]=!0,T+=G(d[S-1]);c[m]=k,c[m]._emit=F,c[m]._multi=!0}function Rr(c){if(Array.isArray(c.begin)){if(c.skip||c.excludeBegin||c.returnBegin)throw ke("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Ye;if(typeof c.beginScope!="object"||c.beginScope===null)throw ke("beginScope must be object"),Ye;nn(c,c.begin,{key:"beginScope"}),c.begin=Q(c.begin,{joinWith:""})}}function Ar(c){if(Array.isArray(c.end)){if(c.skip||c.excludeEnd||c.returnEnd)throw ke("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Ye;if(typeof c.endScope!="object"||c.endScope===null)throw ke("endScope must be object"),Ye;nn(c,c.end,{key:"endScope"}),c.end=Q(c.end,{joinWith:""})}}function Cr(c){c.scope&&typeof c.scope=="object"&&c.scope!==null&&(c.beginScope=c.scope,delete c.scope)}function Mr(c){Cr(c),typeof c.beginScope=="string"&&(c.beginScope={_wrap:c.beginScope}),typeof c.endScope=="string"&&(c.endScope={_wrap:c.endScope}),Rr(c),Ar(c)}function $r(c){function d(k,S){return new RegExp(p(k),"m"+(c.case_insensitive?"i":"")+(c.unicodeRegex?"u":"")+(S?"g":""))}class m{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(S,v){v.position=this.position++,this.matchIndexes[this.matchAt]=v,this.regexes.push([v,S]),this.matchAt+=G(S)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const S=this.regexes.map(v=>v[1]);this.matcherRe=d(Q(S,{joinWith:"|"}),!0),this.lastIndex=0}exec(S){this.matcherRe.lastIndex=this.lastIndex;const v=this.matcherRe.exec(S);if(!v)return null;const j=v.findIndex((He,Et)=>Et>0&&He!==void 0),U=this.matchIndexes[j];return v.splice(0,j),Object.assign(v,U)}}class T{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(S){if(this.multiRegexes[S])return this.multiRegexes[S];const v=new m;return this.rules.slice(S).forEach(([j,U])=>v.addRule(j,U)),v.compile(),this.multiRegexes[S]=v,v}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(S,v){this.rules.push([S,v]),v.type==="begin"&&this.count++}exec(S){const v=this.getMatcher(this.regexIndex);v.lastIndex=this.lastIndex;let j=v.exec(S);if(this.resumingScanAtSamePosition()&&!(j&&j.index===this.lastIndex)){const U=this.getMatcher(0);U.lastIndex=this.lastIndex+1,j=U.exec(S)}return j&&(this.regexIndex+=j.position+1,this.regexIndex===this.count&&this.considerAll()),j}}function z(k){const S=new T;return k.contains.forEach(v=>S.addRule(v.begin,{rule:v,type:"begin"})),k.terminatorEnd&&S.addRule(k.terminatorEnd,{type:"end"}),k.illegal&&S.addRule(k.illegal,{type:"illegal"}),S}function F(k,S){const v=k;if(k.isCompiled)return v;[yr,kr,Mr,_r].forEach(U=>U(k,S)),c.compilerExtensions.forEach(U=>U(k,S)),k.__beforeBegin=null,[xr,Sr,wr].forEach(U=>U(k,S)),k.isCompiled=!0;let j=null;return typeof k.keywords=="object"&&k.keywords.$pattern&&(k.keywords=Object.assign({},k.keywords),j=k.keywords.$pattern,delete k.keywords.$pattern),j=j||/\w+/,k.keywords&&(k.keywords=Qt(k.keywords,c.case_insensitive)),v.keywordPatternRe=d(j,!0),S&&(k.begin||(k.begin=/\B|\b/),v.beginRe=d(v.begin),!k.end&&!k.endsWithParent&&(k.end=/\B|\b/),k.end&&(v.endRe=d(v.end)),v.terminatorEnd=p(v.end)||"",k.endsWithParent&&S.terminatorEnd&&(v.terminatorEnd+=(k.end?"|":"")+S.terminatorEnd)),k.illegal&&(v.illegalRe=d(k.illegal)),k.contains||(k.contains=[]),k.contains=[].concat(...k.contains.map(function(U){return Or(U==="self"?k:U)})),k.contains.forEach(function(U){F(U,v)}),k.starts&&F(k.starts,S),v.matcher=z(v),v}if(c.compilerExtensions||(c.compilerExtensions=[]),c.contains&&c.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return c.classNameAliases=r(c.classNameAliases||{}),F(c)}function rn(c){return c?c.endsWithParent||rn(c.starts):!1}function Or(c){return c.variants&&!c.cachedVariants&&(c.cachedVariants=c.variants.map(function(d){return r(c,{variants:null},d)})),c.cachedVariants?c.cachedVariants:rn(c)?r(c,{starts:c.starts?r(c.starts):null}):Object.isFrozen(c)?r(c):c}var Ir="11.11.1";class Lr extends Error{constructor(d,m){super(d),this.name="HTMLInjectionError",this.html=m}}const _t=n,sn=r,on=Symbol("nomatch"),Dr=7,an=function(c){const d=Object.create(null),m=Object.create(null),T=[];let z=!0;const F="Could not find the language '{}', did you forget to load/include a language module?",k={disableAutodetect:!0,name:"Plain text",contains:[]};let S={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:h};function v(g){return S.noHighlightRe.test(g)}function j(g){let _=g.className+" ";_+=g.parentNode?g.parentNode.className:"";const O=S.languageDetectRe.exec(_);if(O){const B=me(O[1]);return B||(tn(F.replace("{}",O[1])),tn("Falling back to no-highlight mode for this block.",g)),B?O[1]:"no-highlight"}return _.split(/\s+/).find(B=>v(B)||me(B))}function U(g,_,O){let B="",X="";typeof _=="object"?(B=g,O=_.ignoreIllegals,X=_.language):(Re("10.7.0","highlight(lang, code, ...args) has been deprecated."),Re("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),X=g,B=_),O===void 0&&(O=!0);const te={code:B,language:X};Qe("before:highlight",te);const be=te.result?te.result:He(te.language,te.code,O);return be.code=te.code,Qe("after:highlight",be),be}function He(g,_,O,B){const X=Object.create(null);function te(x,w){return x.keywords[w]}function be(){if(!N.keywords){q.addText(P);return}let x=0;N.keywordPatternRe.lastIndex=0;let w=N.keywordPatternRe.exec(P),C="";for(;w;){C+=P.substring(x,w.index);const L=ae.case_insensitive?w[0].toLowerCase():w[0],Z=te(N,L);if(Z){const[he,Qr]=Z;if(q.addText(C),C="",X[L]=(X[L]||0)+1,X[L]<=Dr&&(nt+=Qr),he.startsWith("_"))C+=w[0];else{const es=ae.classNameAliases[he]||he;oe(w[0],es)}}else C+=w[0];x=N.keywordPatternRe.lastIndex,w=N.keywordPatternRe.exec(P)}C+=P.substring(x),q.addText(C)}function et(){if(P==="")return;let x=null;if(typeof N.subLanguage=="string"){if(!d[N.subLanguage]){q.addText(P);return}x=He(N.subLanguage,P,!0,gn[N.subLanguage]),gn[N.subLanguage]=x._top}else x=vt(P,N.subLanguage.length?N.subLanguage:null);N.relevance>0&&(nt+=x.relevance),q.__addSublanguage(x._emitter,x.language)}function J(){N.subLanguage!=null?et():be(),P=""}function oe(x,w){x!==""&&(q.startScope(w),q.addText(x),q.endScope())}function dn(x,w){let C=1;const L=w.length-1;for(;C<=L;){if(!x._emit[C]){C++;continue}const Z=ae.classNameAliases[x[C]]||x[C],he=w[C];Z?oe(he,Z):(P=he,be(),P=""),C++}}function hn(x,w){return x.scope&&typeof x.scope=="string"&&q.openNode(ae.classNameAliases[x.scope]||x.scope),x.beginScope&&(x.beginScope._wrap?(oe(P,ae.classNameAliases[x.beginScope._wrap]||x.beginScope._wrap),P=""):x.beginScope._multi&&(dn(x.beginScope,w),P="")),N=Object.create(x,{parent:{value:N}}),N}function pn(x,w,C){let L=V(x.endRe,C);if(L){if(x["on:end"]){const Z=new e(x);x["on:end"](w,Z),Z.isMatchIgnored&&(L=!1)}if(L){for(;x.endsParent&&x.parent;)x=x.parent;return x}}if(x.endsWithParent)return pn(x.parent,w,C)}function Zr(x){return N.matcher.regexIndex===0?(P+=x[0],1):(At=!0,0)}function Kr(x){const w=x[0],C=x.rule,L=new e(C),Z=[C.__beforeBegin,C["on:begin"]];for(const he of Z)if(he&&(he(x,L),L.isMatchIgnored))return Zr(w);return C.skip?P+=w:(C.excludeBegin&&(P+=w),J(),!C.returnBegin&&!C.excludeBegin&&(P=w)),hn(C,x),C.returnBegin?0:w.length}function Jr(x){const w=x[0],C=_.substring(x.index),L=pn(N,x,C);if(!L)return on;const Z=N;N.endScope&&N.endScope._wrap?(J(),oe(w,N.endScope._wrap)):N.endScope&&N.endScope._multi?(J(),dn(N.endScope,x)):Z.skip?P+=w:(Z.returnEnd||Z.excludeEnd||(P+=w),J(),Z.excludeEnd&&(P=w));do N.scope&&q.closeNode(),!N.skip&&!N.subLanguage&&(nt+=N.relevance),N=N.parent;while(N!==L.parent);return L.starts&&hn(L.starts,x),Z.returnEnd?0:w.length}function Yr(){const x=[];for(let w=N;w!==ae;w=w.parent)w.scope&&x.unshift(w.scope);x.forEach(w=>q.openNode(w))}let tt={};function fn(x,w){const C=w&&w[0];if(P+=x,C==null)return J(),0;if(tt.type==="begin"&&w.type==="end"&&tt.index===w.index&&C===""){if(P+=_.slice(w.index,w.index+1),!z){const L=new Error(`0 width match regex (${g})`);throw L.languageName=g,L.badRule=tt.rule,L}return 1}if(tt=w,w.type==="begin")return Kr(w);if(w.type==="illegal"&&!O){const L=new Error('Illegal lexeme "'+C+'" for mode "'+(N.scope||"<unnamed>")+'"');throw L.mode=N,L}else if(w.type==="end"){const L=Jr(w);if(L!==on)return L}if(w.type==="illegal"&&C==="")return P+=`
`,1;if(Rt>1e5&&Rt>w.index*3)throw new Error("potential infinite loop, way more iterations than matches");return P+=C,C.length}const ae=me(g);if(!ae)throw ke(F.replace("{}",g)),new Error('Unknown language: "'+g+'"');const Vr=$r(ae);let Nt="",N=B||Vr;const gn={},q=new S.__emitter(S);Yr();let P="",nt=0,we=0,Rt=0,At=!1;try{if(ae.__emitTokens)ae.__emitTokens(_,q);else{for(N.matcher.considerAll();;){Rt++,At?At=!1:N.matcher.considerAll(),N.matcher.lastIndex=we;const x=N.matcher.exec(_);if(!x)break;const w=_.substring(we,x.index),C=fn(w,x);we=x.index+C}fn(_.substring(we))}return q.finalize(),Nt=q.toHTML(),{language:g,value:Nt,relevance:nt,illegal:!1,_emitter:q,_top:N}}catch(x){if(x.message&&x.message.includes("Illegal"))return{language:g,value:_t(_),illegal:!0,relevance:0,_illegalBy:{message:x.message,index:we,context:_.slice(we-100,we+100),mode:x.mode,resultSoFar:Nt},_emitter:q};if(z)return{language:g,value:_t(_),illegal:!1,relevance:0,errorRaised:x,_emitter:q,_top:N};throw x}}function Et(g){const _={value:_t(g),illegal:!1,relevance:0,_top:k,_emitter:new S.__emitter(S)};return _._emitter.addText(g),_}function vt(g,_){_=_||S.languages||Object.keys(d);const O=Et(g),B=_.filter(me).filter(un).map(J=>He(J,g,!1));B.unshift(O);const X=B.sort((J,oe)=>{if(J.relevance!==oe.relevance)return oe.relevance-J.relevance;if(J.language&&oe.language){if(me(J.language).supersetOf===oe.language)return 1;if(me(oe.language).supersetOf===J.language)return-1}return 0}),[te,be]=X,et=te;return et.secondBest=be,et}function Hr(g,_,O){const B=_&&m[_]||O;g.classList.add("hljs"),g.classList.add(`language-${B}`)}function Tt(g){let _=null;const O=j(g);if(v(O))return;if(Qe("before:highlightElement",{el:g,language:O}),g.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",g);return}if(g.children.length>0&&(S.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(g)),S.throwUnescapedHTML))throw new Lr("One of your code blocks includes unescaped HTML.",g.innerHTML);_=g;const B=_.textContent,X=O?U(B,{language:O,ignoreIllegals:!0}):vt(B);g.innerHTML=X.value,g.dataset.highlighted="yes",Hr(g,O,X.language),g.result={language:X.language,re:X.relevance,relevance:X.relevance},X.secondBest&&(g.secondBest={language:X.secondBest.language,relevance:X.secondBest.relevance}),Qe("after:highlightElement",{el:g,result:X,text:B})}function Br(g){S=sn(S,g)}const Pr=()=>{Ve(),Re("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function zr(){Ve(),Re("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let cn=!1;function Ve(){function g(){Ve()}if(document.readyState==="loading"){cn||window.addEventListener("DOMContentLoaded",g,!1),cn=!0;return}document.querySelectorAll(S.cssSelector).forEach(Tt)}function Fr(g,_){let O=null;try{O=_(c)}catch(B){if(ke("Language definition for '{}' could not be registered.".replace("{}",g)),z)ke(B);else throw B;O=k}O.name||(O.name=g),d[g]=O,O.rawDefinition=_.bind(null,c),O.aliases&&ln(O.aliases,{languageName:g})}function Ur(g){delete d[g];for(const _ of Object.keys(m))m[_]===g&&delete m[_]}function Xr(){return Object.keys(d)}function me(g){return g=(g||"").toLowerCase(),d[g]||d[m[g]]}function ln(g,{languageName:_}){typeof g=="string"&&(g=[g]),g.forEach(O=>{m[O.toLowerCase()]=_})}function un(g){const _=me(g);return _&&!_.disableAutodetect}function Gr(g){g["before:highlightBlock"]&&!g["before:highlightElement"]&&(g["before:highlightElement"]=_=>{g["before:highlightBlock"](Object.assign({block:_.el},_))}),g["after:highlightBlock"]&&!g["after:highlightElement"]&&(g["after:highlightElement"]=_=>{g["after:highlightBlock"](Object.assign({block:_.el},_))})}function jr(g){Gr(g),T.push(g)}function Wr(g){const _=T.indexOf(g);_!==-1&&T.splice(_,1)}function Qe(g,_){const O=g;T.forEach(function(B){B[O]&&B[O](_)})}function qr(g){return Re("10.7.0","highlightBlock will be removed entirely in v12.0"),Re("10.7.0","Please use highlightElement now."),Tt(g)}Object.assign(c,{highlight:U,highlightAuto:vt,highlightAll:Ve,highlightElement:Tt,highlightBlock:qr,configure:Br,initHighlighting:Pr,initHighlightingOnLoad:zr,registerLanguage:Fr,unregisterLanguage:Ur,listLanguages:Xr,getLanguage:me,registerAliases:ln,autoDetection:un,inherit:sn,addPlugin:jr,removePlugin:Wr}),c.debugMode=function(){z=!1},c.safeMode=function(){z=!0},c.versionString=Ir,c.regex={concat:E,lookahead:f,either:H,optional:y,anyNumberOfTimes:b};for(const g in Je)typeof Je[g]=="object"&&t(Je[g]);return Object.assign(c,Je),c},Ae=an({});return Ae.newInstance=()=>an({}),$t=Ae,Ae.HighlightJS=Ae,Ae.default=Ae,$t}var yi=bi();const Le=mi(yi);function xi(t){const e=t.regex,n={},r={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:e.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},r]});const s={className:"subst",begin:/\$\(/,end:/\)/,contains:[t.BACKSLASH_ESCAPE]},i=t.inherit(t.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),o={begin:/<<-?\s*(?=\w+)/,starts:{contains:[t.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},a={className:"string",begin:/"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,n,s]};s.contains.push(a);const u={match:/\\"/},l={className:"string",begin:/'/,end:/'/},h={match:/\\'/},p={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},t.NUMBER_MODE,n]},f=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],b=t.SHEBANG({binary:`(${f.join("|")})`,relevance:10}),y={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[t.inherit(t.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},E=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],M=["true","false"],H={match:/(\/[a-z._-]+)+/},G=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],V=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],de=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],Q=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:E,literal:M,built_in:[...G,...V,"set","shopt",...de,...Q]},contains:[b,t.SHEBANG(),y,p,i,o,H,a,u,l,h,n]}}const gt="[A-Za-z$_][0-9A-Za-z$_]*",Vn=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Qn=["true","false","null","undefined","NaN","Infinity"],er=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],tr=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],nr=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],rr=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],sr=[].concat(nr,er,tr);function Si(t){const e=t.regex,n=(W,{after:ge})=>{const Se="</"+W[0].slice(1);return W.input.indexOf(Se,ge)!==-1},r=gt,s={begin:"<>",end:"</>"},i=/<[A-Za-z0-9\\._:-]+\s*\/>/,o={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(W,ge)=>{const Se=W[0].length+W.index,Ne=W.input[Se];if(Ne==="<"||Ne===","){ge.ignoreMatch();return}Ne===">"&&(n(W,{after:Se})||ge.ignoreMatch());let De;const Ke=W.input.substring(Se);if(De=Ke.match(/^\s*=/)){ge.ignoreMatch();return}if((De=Ke.match(/^\s+extends\s+/))&&De.index===0){ge.ignoreMatch();return}}},a={$pattern:gt,keyword:Vn,literal:Qn,built_in:sr,"variable.language":rr},u="[0-9](_?[0-9])*",l=`\\.(${u})`,h="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",p={className:"number",variants:[{begin:`(\\b(${h})((${l})|\\.)?|(${l}))[eE][+-]?(${u})\\b`},{begin:`\\b(${h})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},f={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},b={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,f],subLanguage:"xml"}},y={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,f],subLanguage:"css"}},E={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,f],subLanguage:"graphql"}},M={className:"string",begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,f]},G={className:"comment",variants:[t.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]},V=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,b,y,E,M,{match:/\$\d+/},p];f.contains=V.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(V)});const de=[].concat(G,f.contains),Q=de.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(de)}]),ee={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:Q},ie={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,e.concat(r,"(",e.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},Te={relevance:0,match:e.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...er,...tr]}},je={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},We={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[ee],illegal:/%/},qe={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function xt(W){return e.concat("(?!",W.join("|"),")")}const St={match:e.concat(/\b/,xt([...nr,"super","import"].map(W=>`${W}\\s*\\(`)),r,e.lookahead(/\s*\(/)),className:"title.function",relevance:0},xe={begin:e.concat(/\./,e.lookahead(e.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},kt={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},ee]},Ze="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",wt={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,e.lookahead(Ze)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[ee]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:Q,CLASS_REFERENCE:Te},illegal:/#(?![$_A-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",relevance:5}),je,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,b,y,E,M,G,{match:/\$\d+/},p,Te,{scope:"attr",match:r+e.lookahead(":"),relevance:0},wt,{begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[G,t.REGEXP_MODE,{className:"function",begin:Ze,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:Q}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:s.begin,end:s.end},{match:i},{begin:o.begin,"on:begin":o.isTrulyOpeningTag,end:o.end}],subLanguage:"xml",contains:[{begin:o.begin,end:o.end,skip:!0,contains:["self"]}]}]},We,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[ee,t.inherit(t.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},xe,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[ee]},St,qe,ie,kt,{match:/\$[(.]/}]}}function ki(t){const e=t.regex,n=Si(t),r=gt,s=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],i={begin:[/namespace/,/\s+/,t.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},o={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:s},contains:[n.exports.CLASS_REFERENCE]},a={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},u=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],l={$pattern:gt,keyword:Vn.concat(u),literal:Qn,built_in:sr.concat(s),"variable.language":rr},h={className:"meta",begin:"@"+r},p=(E,M,H)=>{const G=E.contains.findIndex(V=>V.label===M);if(G===-1)throw new Error("can not find mode to replace");E.contains.splice(G,1,H)};Object.assign(n.keywords,l),n.exports.PARAMS_CONTAINS.push(h);const f=n.contains.find(E=>E.scope==="attr"),b=Object.assign({},f,{match:e.concat(r,e.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,f,b]),n.contains=n.contains.concat([h,i,o,b]),p(n,"shebang",t.SHEBANG()),p(n,"use_strict",a);const y=n.contains.find(E=>E.label==="func.def");return y.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}function wi(t){const e=t.regex,n=e.concat(/[\p{L}_]/u,e.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,s={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},i={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},o=t.inherit(i,{begin:/\(/,end:/\)/}),a=t.inherit(t.APOS_STRING_MODE,{className:"string"}),u=t.inherit(t.QUOTE_STRING_MODE,{className:"string"}),l={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[s]},{begin:/'/,end:/'/,contains:[s]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[i,u,a,o,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[i,o,u,a]}]}]},t.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},s,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[u]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[l],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[l],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:e.concat(/</,e.lookahead(e.concat(n,e.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:l}]},{className:"tag",begin:e.concat(/<\//,e.lookahead(e.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}function _i(t){const e={className:"attr",begin:/"(\\.|[^\\"\r\n])*"(?=\s*:)/,relevance:1.01},n={match:/[{}[\],:]/,className:"punctuation",relevance:0},r=["true","false","null"],s={scope:"literal",beginKeywords:r.join(" ")};return{name:"JSON",aliases:["jsonc"],keywords:{literal:r},contains:[e,n,t.QUOTE_STRING_MODE,s,t.C_NUMBER_MODE,t.C_LINE_COMMENT_MODE,t.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}const Ei=$('<div class="p-2 w-full flex flex-auto gap-4 flex-col"><!--hfx:dyn:0:0--><!--hfx:dyn:0:1--><!--hfx:dyn:0:2--></div>'),vi=$('<div id="article_editor"><!--hfx:dyn:1:0--><!--hfx:dyn:1:1--></div>'),Ti=$('<div id="edit_buttons" class="p-2 flex gap-2"><span>Formatting:</span><!--hfx:dyn:2:0--></div>'),Ni=$('<button class="p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700" title="Bold selected text"><strong>B</strong></button>'),Ri=$('<div class="border-2 rounded-md p-2 bg-white text-black"><!--hfx:dyn:4:0--></div>'),Ai=$('<div class=""><!--hfx:dyn:5:0--></div>'),Ci=$('<article contenteditable="true"><p>Edit me! Select some text and click the <strong>B</strong> button to make it bold.</p></article>'),Mi=$('<div><p class="text-xl font-semibold">Preview:</p><!--hfx:dyn:7:0--></div>'),$i=$('<div class="p-2 border-2 bg-white text-black"><!--hfx:dyn:8:0--></div>'),Oi=$("<div></div>"),Ii=$('<div class="p-2 bg-purple-950 rounded-md"><p class="text-xl font-semibold">JSON:</p><!--hfx:dyn:10:0--></div>'),Li=$('<div class="bg-black/20 p-2 border-2 border-gray-500 rounded-md"><!--hfx:dyn:11:0--></div>'),Di=$('<output class="" name="json_output"><!--hfx:dyn:12:0--></output>'),Hi=$('<pre class="overflow-x-scroll"><!--hfx:dyn:13:0--></pre>'),[ir,Bi]=Ue("todo"),Pi=le(()=>{const t=ir();if(typeof t=="string"||!t)return'<p class="border rounded-md p-2">Start editing to get a preview!</p>';const e=Bn(t);return e instanceof Text?'<p class="border rounded-md p-2">Start editing to get a preview!</p>':(console.log("Preview HTML:",e.outerHTML),or(e),e.outerHTML)}),Ot="editor_content";function zi(){const t=r=>{r.preventDefault();const s=document.getSelection();if(!s||s.rangeCount===0)return;const i=s.getRangeAt(0);if(i.collapsed)return;const o=document.createElement("strong");try{i.surroundContents(o),s.removeAllRanges(),e()}catch{try{const u=i.extractContents();o.appendChild(u),i.insertNode(o),s.removeAllRanges(),e()}catch(u){console.warn("Could not apply bold formatting:",u)}}},e=()=>{const r=document.getElementById(Ot);r&&Bi(Hn(r))},n=r=>{e()};return(()=>{const r=Ei.cloneNode(!0),s=A(r,"hfx:dyn:0:0"),i=A(r,"hfx:dyn:0:1"),o=A(r,"hfx:dyn:0:2");return s&&R(s.parentNode,(()=>{const a=vi.cloneNode(!0),u=A(a,"hfx:dyn:1:0"),l=A(a,"hfx:dyn:1:1");return u&&R(u.parentNode,(()=>{const h=Ti.cloneNode(!0),p=A(h,"hfx:dyn:2:0");return p&&R(p.parentNode,(()=>{const f=Ni.cloneNode(!0);return ut(f,"mousedown",t),f})(),p),h})(),u),l&&R(l.parentNode,(()=>{const h=Ri.cloneNode(!0),p=A(h,"hfx:dyn:4:0");return p&&R(p.parentNode,(()=>{const f=Ai.cloneNode(!0);ye(f,"id",Ot);const b=A(f,"hfx:dyn:5:0");return b&&R(b.parentNode,(()=>{const y=Ci.cloneNode(!0);return ut(y,"input",n),y})(),b),f})(),p),h})(),l),a})(),s),i&&R(i.parentNode,(()=>{const a=Mi.cloneNode(!0),u=A(a,"hfx:dyn:7:0");return u&&R(u.parentNode,(()=>{const l=$i.cloneNode(!0),h=A(l,"hfx:dyn:8:0");return h&&R(h.parentNode,(()=>{const p=Oi.cloneNode(!0);return ye(p,"innerHTML",Pi),p})(),h),l})(),u),a})(),i),o&&R(o.parentNode,(()=>{const a=Ii.cloneNode(!0),u=A(a,"hfx:dyn:10:0");return u&&R(u.parentNode,(()=>{const l=Li.cloneNode(!0),h=A(l,"hfx:dyn:11:0");return h&&R(h.parentNode,(()=>{const p=Di.cloneNode(!0);ye(p,"for",Ot);const f=A(p,"hfx:dyn:12:0");return f&&R(f.parentNode,(()=>{const b=Hi.cloneNode(!0),y=A(b,"hfx:dyn:13:0");return y&&R(y.parentNode,()=>JSON.stringify(ir(),null,"  "),y),b})(),f),p})(),h),l})(),u),a})(),o),r})()}function or(t){t.removeAttribute("contenteditable");for(const e of t.children)or(e)}const Fi=`import {
  HFXObjectToElement,
  nodeToHFXObject,
  JSX,
  createSignal,
  createComputed,
} from "hyperfx";
import type { HFXObject } from "hyperfx";

// Create reactive signals for state management
const [articleSignal, setArticleSignal] = createSignal<HFXObject>("todo" as HFXObject);

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
      setArticleSignal(nodeToHFXObject(editorEl));
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
}`;function Ui(t){const e=[];let n=!1,r;const s=t.split("/").filter(Boolean);for(const i of s){if(i.startsWith("...[")&&(i.endsWith("]")||i.endsWith("]?"))){const o=i.endsWith("]?"),a=o?i.slice(4,-2):i.slice(4,-1);e.push({type:"catchAll",name:a,optional:o}),n=!0,r=a;continue}if(i.startsWith(":")&&i.endsWith("?")){const o=i.slice(1,-1);e.push({type:"param",name:o,optional:!0});continue}if(i.startsWith(":")){const o=i.slice(1);e.push({type:"param",name:o,optional:!1});continue}e.push({type:"static",value:i})}return{segments:e,hasCatchAll:n,catchAllParam:r}}function ar(t){const e=t.indexOf("?");if(e===-1)return{};const n=t.slice(e+1),r={},s=n.split("&");for(const i of s){const o=i.split("="),a=decodeURIComponent(o[0]||""),u=decodeURIComponent(o.slice(1).join("="));if(a in r){const l=r[a];Array.isArray(l)?l.push(u):r[a]=[l,u]}else r[a]=u}return r}function Tn(t){const e=t.indexOf("#"),n=e>=0?t.slice(0,e):t,r=n.indexOf("?");if(r<0)return{path:n||"/",search:{},raw:t};const s=n.slice(0,r),i=n.slice(r);return{path:s||"/",search:ar(i),raw:t}}function cr(t,e){return{path:t,view:e.view,_parsed:Ui(t)}}function Xi(t,e,n){const r=t._parsed.hasCatchAll?ji(e,t.path):lr(e,t.path);if(!r||!r.match)return null;const{params:s,matchedPath:i}=r;return{route:t,params:s,search:{},matchedPath:i}}function Gi(t,e,n){for(const r of t){const s=Xi(r,e);if(s)return s}return null}function lr(t,e){if(t.includes("//"))return null;const n=t.split("/").filter(Boolean),r=e.split("/").filter(Boolean);if(r.length===0)return n.length===0?{match:!0,params:{},matchedPath:"/"}:null;let s=0;for(const a of r)a.endsWith("?")||s++;if(n.length<s)return null;const i={};for(let a=0;a<r.length;a++){const u=r[a],l=n[a];if(!u.startsWith(":")){if(u!==l)return null;continue}if(u.startsWith(":")){const h=u.slice(1).replace("?",""),p=u.endsWith("?");if(l!==void 0)i[h]=l;else if(p)i[h]=void 0;else return null}}const o=Math.min(n.length,r.length);return{match:!0,params:i,matchedPath:o===0?"/":"/"+n.slice(0,o).join("/")}}function ji(t,e){if(t.includes("//"))return null;const n=e.indexOf("...[");if(n===-1)return lr(t,e);const s=e.slice(0,n).split("/").filter(Boolean),i=t.split("/").filter(Boolean);if(i.length<s.length)return null;for(let b=0;b<s.length;b++){const y=s[b],E=i[b];if(y.startsWith(":"))s[b]=E;else if(y!==E)return null}const o=e.indexOf("]",n),a=e.slice(n+4,o),u=e.slice(o+1)==="?",l=i.slice(s.length),h=l.join("/"),p={};p[a]=h||(u?void 0:"");const f=e.split("/").filter(Boolean);for(let b=0;b<s.length;b++){const y=f[b];if(y&&y.startsWith(":")){const E=y.slice(1).replace("?","");p[E]=i[b]}}return{match:!0,params:p,matchedPath:"/"+i.slice(0,s.length+l.length).join("/")}}const Wi=$("<a><!--hfx:dyn:0:0--></a>");function Nn(){return typeof window<"u"}function qi(t){const[e,n]=Ue("/"),[r,s]=Ue({}),i=le(()=>{const l=e(),h=r();return Gi(t,l,h)}),o=(l,h)=>{const p=h?.replace??!1,f=h?.scroll??!0,{path:b,search:y}=Tn(l);n(b),s(y),Nn()&&(p?window.history.replaceState({},"",l):window.history.pushState({},"",l),window.dispatchEvent(new CustomEvent("hfx:navigate")),f&&window.scrollTo(0,0))},a=function(h){const p=le(()=>h.to.path.match(/:(\w+)/g)||[]),f=le(()=>p().reduce((M,H)=>{const G=H.slice(1);return M.replace(H,String(h.params?.[G]??""))},h.to.path)),b=le(()=>Object.entries(h.search??{}).filter(([,M])=>M!=null)),y=le(()=>b().map(([M,H])=>`${M}=${H}`).join("&")),E=le(()=>y()?`${f()}?${y()}`:f());return(()=>{const M=Wi.cloneNode(!0);ye(M,"href",E),ye(M,"class",h.class),ut(M,"click",G=>{G.preventDefault(),o(E())});const H=A(M,"hfx:dyn:0:0");return H&&(R(H.parentNode,h.children,H),H.remove()),M})()};function u(l){let h=!1;Y(()=>{if(!h){if(h=!0,l.initialPath){const{path:f,search:b}=Tn(l.initialPath);n(f),s(b);return}l.initialSearch&&s(l.initialSearch)}}),Y(()=>{if(Nn()){const f=()=>{const b=window.location.pathname,y=window.location.search;n(b),s(ar(y))};return window.addEventListener("popstate",f),window.addEventListener("hfx:navigate",f),()=>{window.removeEventListener("hfx:navigate",f),window.removeEventListener("popstate",f)}}}),Y(()=>{l.onRouteChange&&l.onRouteChange(i())});const p=()=>{const f=i();return f?bn(()=>f.route.view(f.params)):l.notFound?bn(()=>l.notFound({path:e()})):null};return typeof document>"u"?p():cs(p,"hfx:router")}return{Router:u,Link:a,currentPath:e,currentSearch:r,currentMatch:i,navigate:o,routes:t}}const Zi=$('<div class="flex flex-auto"><!--hfx:dyn:0:0--><!--hfx:dyn:0:1--></div>'),Ki=$('<article class="p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl"><!--hfx:dyn:1:0--></article>'),Ji=$('<div class="markdown-body" />'),Yi=$('<div class="grow flex flex-col"><!--hfx:dyn:3:0--><div class="p-2 bg-red-950 text-white mt-4 mx-auto"><p class="text-xl">This is a work in progress!</p><p class="text-xl">The docs are not finished yet!</p></div></div>'),Vi=$('<article class="p-4 mx-auto w-full max-w-4xl"><!--hfx:dyn:4:0--></article>'),Qi=$('<div class="markdown-body-main" />'),eo=$('<pre class="mx-auto max-w-[70vw]! max-h-[50vw]"><!--hfx:dyn:6:0--></pre>'),to=$('<code class="language-tsx"><!--hfx:dyn:7:0--></code>'),no=$('<div class="flex flex-col p-4 max-w-[80vw] mx-auto"><!--hfx:dyn:8:0--><!--hfx:dyn:8:1--></div>'),ro=$('<div class="p-2"><!--hfx:dyn:9:0--><!--hfx:dyn:9:1--></div>'),so=$(`<p class="mx-auto">
          This is the code used to create the editor.
          <!--hfx:dyn:10:0--></p>`),io=$(`<span class="text-purple-500/80"><!--hfx:dyn:11:0-->(The editor is far from done but it is still cool IMO.)
          </span>`),oo=$('<div class="w-full"><!--hfx:dyn:12:0--></div>'),ao=$(`<div class="flex flex-auto flex-col min-h-screen"><!--hfx:dyn:13:0--><!--hfx:dyn:13:1--><footer class="bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto"><a href="https://github.com/ArnoudK/hyperfx" target="_blank" class="underline">
          Github
        </a></footer></div>`),co=$(`<main class="flex flex-auto flex-col" id="main-content"><p class="p-2 bg-red-800 text-white text-center w-full! max-w-full!">
          A LOT OF CHANGES. DOCS ARE NOT UP TO DATE.
        </p><!--hfx:dyn:14:0--></main>`),lo=$("<div><!--hfx:dyn:15:0--></div>");Le.registerLanguage("typescript",ki);Le.registerLanguage("html",wi);Le.registerLanguage("bash",xi);Le.registerLanguage("json",_i);const uo=Yn(gi);function Rn(t){document.title=t}function An(t){const e=document.querySelector('meta[name="description"]');e&&e.setAttribute("content",t)}const mt=cr("/hyperfx",{view:po}),ur=cr("/hyperfx/editor",{view:fo}),Oe=qi([mt,ur]),ho=Oe.Router,at=Oe.Link;function po(t){const e=le(()=>{const r=Oe.currentSearch().document||"main";console.log("docname:",r);const s=Pn.find(i=>i.route_name==r);return s?(Rn(`${s.title} | HyperFX`),An(`HyperFX docs about ${s.title}.`)):(Rn("HyperFX"),An("HyperFX docs")),s}),n=le(()=>{const r=e();if(r){const s=Yn(r.data);return console.log(s.slice(0,100)),s}return""});return Y(()=>{Oe.currentPath(),setTimeout(()=>{const r=document.querySelectorAll("pre code");for(const s of r)Le.highlightElement(s)},1)}),(()=>{const r=document.createDocumentFragment();return R(r,[re(xn(se({when:()=>n,children:()=>(()=>{const s=Zi.cloneNode(!0),i=A(s,"hfx:dyn:0:0"),o=A(s,"hfx:dyn:0:1");return i&&R(i.parentNode,re($s(se({}))),i),o&&R(o.parentNode,(()=>{const a=Ki.cloneNode(!0),u=A(a,"hfx:dyn:1:0");return u&&R(u.parentNode,(()=>{const l=Ji.cloneNode(!0);return ye(l,"innerHTML",n),l})(),u),a})(),o),s})()}))),re(xn(se({when:()=>e()===void 0||e().route_name==="main",children:()=>(()=>{const s=Yi.cloneNode(!0),i=A(s,"hfx:dyn:3:0");return i&&R(i.parentNode,(()=>{const o=Vi.cloneNode(!0),a=A(o,"hfx:dyn:4:0");return a&&R(a.parentNode,(()=>{const u=Qi.cloneNode(!0);return ye(u,"innerHTML",uo),u})(),a),o})(),i),s})()})))]),r})()}function fo(){const t=zi(),e=(()=>{const n=eo.cloneNode(!0),r=A(n,"hfx:dyn:6:0");return r&&R(r.parentNode,(()=>{const s=to.cloneNode(!0),i=A(s,"hfx:dyn:7:0");return i&&R(i.parentNode,Fi,i),s})(),r),n})();return Y(()=>{setTimeout(()=>{const n=document.querySelector("pre code");n&&n.attributes.getNamedItem("data-highlighted")?.value!="yes"&&Le.highlightElement(n)},0)}),(()=>{const n=no.cloneNode(!0),r=A(n,"hfx:dyn:8:0"),s=A(n,"hfx:dyn:8:1");return r&&R(r.parentNode,(()=>{const i=ro.cloneNode(!0),o=A(i,"hfx:dyn:9:0"),a=A(i,"hfx:dyn:9:1");return o&&R(o.parentNode,(()=>{const u=so.cloneNode(!0),l=A(u,"hfx:dyn:10:0");return l&&R(l.parentNode,(()=>{const h=io.cloneNode(!0),p=A(h,"hfx:dyn:11:0");return p&&(R(p.parentNode," ",p),p.remove()),h})(),l),u})(),o),a&&R(a.parentNode,(()=>{const u=oo.cloneNode(!0),l=A(u,"hfx:dyn:12:0");return l&&R(l.parentNode,e,l),u})(),a),i})(),r),s&&R(s.parentNode,t,s),n})()}function go(){const t=Oe.navigate,e=Oe.currentPath;return Y(()=>{e()==="/"&&t("/hyperfx")}),(()=>{const n=ao.cloneNode(!0),r=A(n,"hfx:dyn:13:0"),s=A(n,"hfx:dyn:13:1");return r&&R(r.parentNode,re(Rs(se({}))),r),s&&R(s.parentNode,(()=>{const i=co.cloneNode(!0),o=A(i,"hfx:dyn:14:0");return o&&R(o.parentNode,(()=>{const a=lo.cloneNode(!0),u=A(a,"hfx:dyn:15:0");return u&&R(u.parentNode,re(ho(se({}))),u),a})(),o),i})(),s),n})()}function mo(){return re(go(se({})))}const dr=document.getElementById("app");dr.innerHTML="";ps(mo,void 0,dr);
