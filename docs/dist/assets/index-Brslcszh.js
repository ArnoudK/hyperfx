(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();let zt=null;try{zt=require("async_hooks").AsyncLocalStorage}catch{}const Dt=zt?new zt:null;function ds(){return{trackingStack:[],ownerStack:[],currentOwner:null,globalSignalRegistry:new Map,ownerIdCounter:0,templateCounter:0,isTracking:!1,insideEffect:!1}}function oe(){if(Dt){let t=Dt.getStore();return t||(t=_n,Dt.enterWith(t)),t}return _n}const _n=ds();function wt(){return oe().isTracking}function $e(t){oe().isTracking=t}function En(t){oe().insideEffect=t}function Pn(){oe().trackingStack.push({dependencies:new Set})}function zn(){return oe().trackingStack.pop()?.dependencies??new Set}function hs(){const t=oe().trackingStack;return t[t.length-1]}function ps(t){const e=hs();if(!e)return;const n=t.__deps;if(n&&n.size>0){n.forEach(r=>e.dependencies.add(r));return}e.dependencies.add(t)}function ut(){return oe().ownerStack}function fe(){return oe().currentOwner}function dt(t){oe().currentOwner=t}function fs(){return oe().ownerIdCounter++}function Fn(t=null,e=!1){return{id:fs(),parent:t,children:new Set,effects:new Set,signals:new Set,cleanups:new Set,mountCallbacks:new Set,mountCleanups:new Set,mounted:!1,disposed:!1,isRoot:e}}function Jt(t){if(t.disposed)return;t.disposed=!0;const e=o=>{try{o()}catch(a){console.error("Cleanup error:",a)}},n=Array.from(t.children).reverse();for(const o of n)Jt(o);t.children.clear();const r=Array.from(t.effects).reverse();for(const o of r)e(o);t.effects.clear();const s=Array.from(t.signals).reverse();for(const o of s)e(o);if(t.signals.clear(),t.mountCleanups.size>0){const o=Array.from(t.mountCleanups).reverse();for(const a of o)e(a);t.mountCleanups.clear()}const i=Array.from(t.cleanups).reverse();for(const o of i)e(o);t.cleanups.clear(),t.parent&&t.parent.children.delete(t)}function gs(t,e){const n=fe(),r=Fn(n,!0);dt(r),ut().push(r);let s=!1,i;const o=()=>{s||(s=!0,typeof i=="function"&&i(),i=void 0,Jt(r),ut().pop(),dt(n))};let a;try{a=t(o),typeof a=="function"&&(i=a)}catch(u){throw o(),u}return typeof a!="function"&&a!==null&&o(),{result:a,dispose:o}}function ms(){return oe().globalSignalRegistry}class bs{constructor(e){this.subscribers=new Set,this._value=e}get(){return this._value}getSubscriberCount(){return this.subscribers.size}clearSubscribers(){this.subscribers.clear()}set(e){if(Object.is(this._value,e))return e;this._value=e;const n=Array.from(this.subscribers);let r=null;for(const s of n)try{s(e)}catch(i){r=i;break}if(r)throw this.subscribers.clear(),r;return e}subscribe(e){return this.subscribers.add(e),()=>{this.subscribers.delete(e)}}}function Un(t){return new bs(t)}function Ue(t,e){const n=ms(),r=Un(t),s=Xn(r),i=ys(r),o=[s,i],a=()=>{r.clearSubscribers(),n.delete("")};return s.destroy=a,fe()&&fe().signals.add(a),o}function Xn(t){const e=()=>(wt()&&ps(e),t.get());return e.subscribe=n=>{const r=t.subscribe(n);return e.subscriberCount=t.getSubscriberCount(),()=>{r(),e.subscriberCount=t.getSubscriberCount()}},e.subscriberCount=t.getSubscriberCount(),e}function ys(t){return e=>{const n=t.get(),r=typeof e=="function"?e(n):e;return t.set(r),()=>{t.set(n)}}}function de(t){const e=wt();$e(!0),Pn();let n,r;try{n=t()}finally{r=zn(),$e(e)}const s=Un(n),i=Xn(s);i.__deps=r;let o=!1;const a=()=>{if(o)return;o=!0;const l=t();Object.is(l,s.get())||s.set(l),o=!1},u=Array.from(r).map(l=>l.subscribe(a));return i.destroy=()=>{for(let l=0;l<u.length;l++)u[l]();u.length=0,i.__deps=void 0},i}function V(t){let e=!1,n=!1,r=!1;const s=Fn(fe(),!1);let i,o=[];const a=()=>{e||(e=!0,fe()&&fe().effects.delete(a),typeof i=="function"&&i(),i=void 0,Jt(s))};fe()&&fe().effects.add(a);const u=()=>{if(e)return;if(n){r=!0;return}n=!0;let l=0;const h=100;for(;l<h;){r=!1,typeof i=="function"&&i(),i=void 0,o.forEach(g=>g()),o=[];const d=fe();dt(s),ut().push(s);const p=wt();$e(!0),Pn(),En(!0);try{i=t()}finally{$e(p),En(!1),ut().pop(),dt(d)}if(o=Array.from(zn()).map(g=>g.subscribe(()=>{u()})),!r)break;l++}if(l>=h)throw new Error("createEffect: Maximum iterations reached - possible infinite loop in effect");n=!1};return u(),a}function st(t){const e=wt();$e(!1);try{return t()}finally{$e(e)}}function Ie(t){return typeof t=="function"&&"subscribe"in t&&typeof t.subscribe=="function"}function Ft(t){if(Array.isArray(t)&&t.length>=2&&typeof t[0]=="function"&&typeof t[1]=="function")return t[0];if(Ie(t))return t}const ht=new WeakMap,pt=new WeakMap,Xe=new Set;let Be=null;function Gn(){Be||typeof window>"u"||typeof Element>"u"||(Be=setInterval(()=>{const t=Array.from(Xe);for(const e of t)e.isConnected||xs(e);Xe.size===0&&Be&&(clearInterval(Be),Be=null)},10))}function Ge(t,e){const n=ht.get(t);n?n.add(e):ht.set(t,new Set([e])),Xe.add(t),Gn()}function Ut(t,e){const n=pt.get(t);n?n.add(e):pt.set(t,new Set([e])),Xe.add(t),Gn()}function xs(t){const e=ht.get(t);e&&(e.forEach(r=>{try{r()}catch(s){console.error("Error during subscription cleanup:",s)}}),e.clear(),ht.delete(t));const n=pt.get(t);n&&(n.forEach(r=>{try{typeof r.destroy=="function"&&r.destroy()}catch(s){console.error("Error destroying computed signal:",s)}}),n.clear(),pt.delete(t)),Xe.delete(t)}const Xt="__HYPERFX_SSR_STATE_V2__",Gt=globalThis;Gt[Xt]||(Gt[Xt]={hydrationEnabled:!1,ssrMode:!1,clientNodeCounter:0,ssrNodeCounter:0,hydrationContainer:null,hydrationPointer:null,hydrationStack:[]});const Ss=Gt[Xt];function ws(){return Ss.hydrationEnabled}function kt(t){return Ie(t)}function re(t){if(kt(t)){const e=t,n=()=>e();return e.subscribe&&(n.subscribe=e.subscribe.bind(e)),n.__isComponentResult=!0,n}return t}const vn=new WeakMap;function se(t,e){const n=t(e);if(typeof Node<"u"&&n instanceof Node||kt(n))return n;let r=vn.get(t);r||(r=new Map,vn.set(t,r));const s=JSON.stringify(Object.keys(e).sort().map(o=>{const a=e[o];return typeof a=="function"?[o,"function"]:[o,a]})),i=r.get(s);if(i){let o=!1;for(const a in e)if(e[a]!==i.props[a]){o=!0;break}if(!o)return i.result;i.dispose&&i.dispose()}return r.set(s,{props:{...e},result:n,dispose:null}),n}const ks=1e3;class _s{constructor(e){this.maxSize=e,this.cache=new Map,this.currentSize=0}get(e){const n=this.cache.get(e);if(n)return this.moveToFront(n),n.value}set(e,n){const r=this.cache.get(e);if(r){r.value=n,this.moveToFront(r);return}const s={value:n};this.cache.set(e,s),this.addToFront(s),this.currentSize++,this.currentSize>this.maxSize&&this.removeLast()}addToFront(e){e.next=this.head,e.prev=void 0,this.head&&(this.head.prev=e),this.head=e,this.tail||(this.tail=e)}moveToFront(e){e!==this.head&&(e.prev&&(e.prev.next=e.next),e.next&&(e.next.prev=e.prev),e===this.tail&&(this.tail=e.prev),this.addToFront(e))}removeLast(){this.tail&&(this.cache.delete(this.tail.value),this.tail.prev&&(this.tail.prev.next=void 0),this.tail=this.tail.prev,this.currentSize--)}clear(){this.cache.clear(),this.head=void 0,this.tail=void 0,this.currentSize=0}get size(){return this.currentSize}}const Tn=new _s(ks);function O(t){if(typeof document>"u")return{t,__ssr:!0,cloneNode:function(){return{...this}}};let e=Tn.get(t);if(!e){const n=document.createElement("template");n.innerHTML=t,e=n.content.firstChild,Tn.set(t,e)}return e.cloneNode(!0)}function A(t,e,n,r){if(kt(e)||typeof e!="function")return ot(t,e,r,n);let s=t,i=r;const o=()=>{if(n&&n.parentNode)return n.parentNode;if(Array.isArray(i)){for(let u=0;u<i.length;u++){const l=i[u];if(l instanceof Node&&l.parentNode)return l.parentNode;if(l&&typeof l=="object"){const h=l._node;if(h&&h.parentNode)return h.parentNode}}return null}if(i instanceof Node&&i.parentNode)return i.parentNode;if(i&&typeof i=="object"){const u=i._node;if(u&&u.parentNode)return u.parentNode}return null},a=V(()=>{if(typeof DocumentFragment<"u"&&s instanceof DocumentFragment){const u=o();u&&(s=u)}if(i=ot(s,e(),i,n),typeof DocumentFragment<"u"&&s instanceof DocumentFragment){const u=o();u&&(s=u)}});return t instanceof Element&&Ge(t,a),i}function Es(t,e="hfx:slot"){const n=document.createDocumentFragment(),r=document.createComment(e),s=document.createComment(`${e}:end`);n.appendChild(r),n.appendChild(s);const i=()=>kt(t)||typeof t=="function"?t():t;return A(n,()=>{const a=s.parentNode;if(a){let u=r.nextSibling;for(;u&&u!==s;){const l=u.nextSibling;a.removeChild(u),u=l}}return i()},s),n}function ot(t,e,n,r,s=!0){const i=ws();if(i&&r&&r.nodeType===8&&r.textContent&&(r.textContent==="hfx:dyn"||r.textContent.startsWith("hfx:dyn:")||r.textContent.startsWith("#"))){const l=r.previousSibling,h=r.nextSibling,d=l&&l.nodeType===3?l:h&&h.nodeType===3?h:null;if(d&&n===void 0){const p=d,b=e==null?"":String(e);return p.data!==b&&(p.data=b),{_node:p,toString:()=>p.data}}}if(e==null)return n!=null&&Me(t,n,r),null;if(Array.isArray(e)){if(s)return n!=null&&Me(t,n,r),vs(t,e,n,r);e=String(e)}if(typeof DocumentFragment<"u"&&e instanceof DocumentFragment){n!=null&&Me(t,n,r);const l=Array.from(e.childNodes),h=r&&r.parentNode===t?r:null;for(let d=0;d<l.length;d++)t.insertBefore(l[d],h);return l}if(e instanceof Node){if(n!==e){n!=null&&Me(t,n,r);const l=r&&r.parentNode===t?r:null;t.insertBefore(e,l)}return e}if(Ie(e)){const l=e();if(l instanceof Node){const h=r&&r.parentNode===t?r:null;t.insertBefore(l,h);let d=l;const p=V(()=>{const g=e();if(g!==d)if(g instanceof Node)d.parentNode===t?t.replaceChild(g,d):t.insertBefore(g,h),d=g;else{const S=document.createTextNode(String(g));d.parentNode===t?t.replaceChild(S,d):t.insertBefore(S,h),d=S}});return t instanceof Element&&Ge(t,p),typeof e.destroy=="function"&&t instanceof Element&&Ut(t,e),d}else{const h=document.createTextNode(String(l)),d=r&&r.parentNode===t?r:null;t.insertBefore(h,d);const p=V(()=>{h.data=String(e())});return t instanceof Element&&Ge(t,p),typeof e.destroy=="function"&&t instanceof Element&&Ut(t,e),{_node:h,toString:()=>h.data,_cleanup:p}}}const o=String(e);if(n&&typeof n=="object"&&n._node instanceof Text){const l=n._node;return l.data=o,n}if(i){const l=r&&r.parentNode===t?r.previousSibling:t.lastChild;if(l instanceof Text&&(n===void 0||l.data===o))return l.data=o,{_node:l,toString:()=>o}}const a=document.createTextNode(o);n!=null&&Me(t,n,r);const u=r&&r.parentNode===t?r:null;return t.insertBefore(a,u),{_node:a,toString:()=>o}}function vs(t,e,n,r){const s=[];for(let i=0;i<e.length;i++){const o=e[i];s.push(ot(t,o,null,r,!1))}return s}function Me(t,e,n){if(Array.isArray(e))for(let r=0;r<e.length;r++)Me(t,e[r],n);else if(e&&typeof e=="object"&&e._node instanceof Text){const r=e._node;r.parentNode===t&&t.removeChild(r)}else if(e instanceof Node)e.parentNode===t&&t.removeChild(e);else{const r=n?n.previousSibling:t.lastChild;r&&r.parentNode===t&&t.removeChild(r)}}const jt=new Map,Wt=new WeakMap,Ts=new Set(["blur","focus","load","unload","scroll","error","resize"]);function Ns(t){if(jt.has(t))return;const e=new Set;jt.set(t,e),document.addEventListener(t,n=>{let r=n.target;for(;r&&r!==document.documentElement;){if(e.has(r)){const i=Wt.get(r)?.get(t);if(i&&(i.call(r,n),n.cancelBubble))break}r=r.parentElement}},{capture:!1})}function ft(t,e,n){if(Ts.has(e)){t.addEventListener(e,n);return}Ns(e);let r=Wt.get(t);r||(r=new Map,Wt.set(t,r)),r.set(e,n),jt.get(e).add(t)}function ie(t){return new Proxy(t,{get(e,n,r){if(n==="children")return Reflect.get(e,n,r);const s=Reflect.get(e,n,r);return Ie(s)?s():s}})}function be(t,e,n){try{if(!e.startsWith("on")){const s=Ft(n);if(s){typeof s.destroy=="function"&&Ut(t,s);const o=()=>{const u=s();Ht(t,e,u)};let a=null;try{a=s.subscribe?s.subscribe(()=>o()):null}catch(u){console.error(`Error setting up reactivity for ${e}:`,u);return}a&&Ge(t,a);try{o()}catch(u){console.error(`Error during initial update for ${e}:`,u)}return}if(typeof n=="function"){const o=V(()=>{Ht(t,e,n())});Ge(t,o);return}}Ht(t,e,n)}catch(r){console.error(`Error setting up reactivity for ${e}:`,r)}}function Ht(t,e,n){const r=Ft?Ft(n):void 0;let s=r?r():n;if(e.startsWith("on"),s==null){e==="style"?t.removeAttribute("style"):(e in t&&!(t instanceof SVGElement)&&(t[e]=null),t.removeAttribute(e));return}if(e.startsWith("data-")||e.startsWith("aria-"))t.setAttribute(e,String(s));else if(e==="class")(t instanceof HTMLElement||t instanceof SVGElement)&&t.setAttribute("class",String(s));else if(e==="style")if(typeof s=="object"&&t instanceof HTMLElement){const o=s;for(const a in o){if(!Object.prototype.hasOwnProperty.call(o,a))continue;const u=o[a];if(u==null)continue;const l=a.includes("-")?a:a.replace(/[A-Z]/g,d=>`-${d.toLowerCase()}`);t.style.setProperty(l,String(u));const h=a.includes("-")?a.replace(/-([a-z])/g,(d,p)=>p.toUpperCase()):a;h!==l&&(t.style[h]=String(u))}}else t.setAttribute("style",String(s));else e==="value"&&t instanceof HTMLInputElement?t.value=String(s):e==="checked"&&t instanceof HTMLInputElement?(t.checked=!!s,t.toggleAttribute("checked",!!s)):e in t&&!(t instanceof SVGElement)&&!(e.startsWith("data-")||e.startsWith("aria-"))?t[e]=s:typeof s=="boolean"?s?t.setAttribute(e,""):t.removeAttribute(e):t.setAttribute(e,String(s))}function C(t,e){if(t.nodeType===8&&t.textContent===e)return t;const n=document.createTreeWalker(t,128,null);for(;n.nextNode();)if(n.currentNode.textContent===e)return n.currentNode;return null}function jn(t,e){const n=t(e);typeof t=="function"&&t.onMount&&t.onMount?.(n,e),t instanceof Wn&&t.mount(n,e);const r=n;return r instanceof HTMLElement&&(r.__componentRef=t,r.__componentProps=e),n}class Wn{constructor(){this._mounted=!1,this._effects=[]}mount(e,n){this._element=e,this._props=n,this._mounted=!0,this.componentDidMount()}unmount(){this._mounted=!1,this.cleanup(),this.componentWillUnmount()}update(e){const n=this._props;this._props=e,this._mounted&&this.componentDidUpdate(e,n)}componentDidMount(){}componentDidUpdate(e,n){}componentWillUnmount(){}addEffect(e){if(this._mounted){const n=V(e);this._effects.push(n)}}cleanup(){this._effects.forEach(e=>{e()}),this._effects=[]}get element(){return this._element}get props(){return this._props}get mounted(){return this._mounted}}function Rs(t,e,n,r=null){const s=jn(t,e),i=s;return r?n.insertBefore(i,r):n.appendChild(i),s}function As(t,e,n,r){let s=null,i,o,a;if(e instanceof HTMLElement?(o=e,a=n):(s=t,i=e,o=n,a=r),!(o instanceof HTMLElement))throw new Error("mount: container must be an HTMLElement");const u=a?.mode??"replace",l=a?.anchor??null;if(u==="replace"&&l)throw new Error('mount: anchor is not supported with mode "replace"');let h;return gs(d=>{if(h=d,s){let S;return u==="replace"?(S=jn(s,i),o.replaceChildren(S)):S=Rs(s,i,o,l),()=>{Cs(s,S,o)}}const g=t();return u==="replace"?o.replaceChildren(g):l?o.insertBefore(g,l):o.appendChild(g),()=>{g.parentNode===o&&o.removeChild(g)}}),()=>{h()}}function Cs(t,e,n){if(typeof t=="function"&&t.onUnmount){const s=e.__componentProps;t.onUnmount?.(e,s)}t instanceof Wn&&t.unmount();const r=e;r&&r.parentNode===n&&n.removeChild(r)}function at(t){return typeof t!="string"?String(t):t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ne(){return typeof document>"u"}function qn(){return ne()?{t:"",__ssr:!0,childNodes:[],appendChild(e){return this.childNodes.push(e),this.t+=e&&e.__ssr?e.t:at(String(e)),e},removeChild(e){const n=this.childNodes.indexOf(e);return n!==-1&&(this.childNodes.splice(n,1),this.t=this.childNodes.map(r=>r&&r.__ssr?r.t:at(String(r))).join("")),e},insertBefore(e,n){if(n){const r=this.childNodes.indexOf(n);r!==-1?this.childNodes.splice(r,0,e):this.childNodes.push(e)}else this.childNodes.push(e);return this.t=this.childNodes.map(r=>r&&r.__ssr?r.t:at(String(r))).join(""),e},cloneNode(){return{...this,childNodes:this.childNodes?[...this.childNodes]:[]}}}:document.createDocumentFragment()}function gt(t){return ne()?{t:`<!--${at(t)}-->`,__ssr:!0,textContent:t,nodeType:8,cloneNode(){return{...this}}}:document.createComment(t)}function Ms(t){const e=qn(),n=gt("For start"),r=gt("For end");e.appendChild(n),e.appendChild(r);const s=Array.isArray(t.children)?t.children[0]:t.children;if(typeof s!="function")throw new Error("For component children must be a function.");const i=new Map,o=()=>{let a=[];Ie(t.each)||typeof t.each=="function"?a=t.each():a=t.each,Array.isArray(a)||(a=[]);const u=ne()?e:n.parentNode||e,l=[],h=new Map;if(i.forEach((d,p)=>{h.set(p,[...d])}),a.forEach((d,p)=>{const b=h.get(d);if(b&&b.length>0){const g=b.shift();g.setIndex(p),l.push(g)}else{const[g,S]=Ue(p),v=s(d,g);let $=[];ne()?$=[v]:v instanceof DocumentFragment?$=Array.from(v.childNodes):v instanceof Node&&($=[v]),l.push({nodes:$,indexSignal:g,setIndex:S})}}),h.forEach(d=>{d.forEach(p=>{ne()||p.nodes.forEach(b=>b.parentElement?.removeChild(b))})}),ne()){const d=u.childNodes||[],p=d.indexOf(n),b=d.indexOf(r);p>=0&&b>p&&d.slice(p+1,b).forEach(v=>u.removeChild(v)),l.flatMap(S=>S.nodes).forEach(S=>u.insertBefore(S,r))}else{let d=r;for(let p=l.length-1;p>=0;p--){const b=l[p];if(!b)continue;const g=b.nodes;for(let S=g.length-1;S>=0;S--){const v=g[S];v.nextSibling!==d&&u.insertBefore(v,d),d=v}}}i.clear(),l.forEach((d,p)=>{const b=a[p],g=i.get(b)||[];g.push(d),i.set(b,g)})};return ne()?o():V(o),e}function Nn(t){const e=qn(),n=gt("Show start"),r=gt("Show end");e.appendChild(n),e.appendChild(r);let s=[];const i=()=>{const o=typeof t.when=="function"||Ie(t.when)?t.when():t.when,a=!!o,u=o,l=ne()?e:n.parentNode||e;ne()||s.forEach(d=>d.parentElement?.removeChild(d)),s=[];const h=a?t.children:t.fallback;if(h){const d=typeof h=="function"?h(u):h;if(ne()){const p=[d];p.forEach(b=>l.insertBefore(b,r)),s=p}else{const p=d instanceof DocumentFragment?Array.from(d.childNodes):[d];p.forEach(b=>l.insertBefore(b,r)),s=p}}};return ne()?i():V(i),e}function $s(t){const e=t.tagName,n={},r=[],s=t.childNodes,i=t.attributes;for(const o of i){const a=o.name,u=o.value;n[a]=u}for(const o of s)r.push(Zn(o));return{tag:e,attrs:n,children:r}}function Zn(t){return t instanceof Text?t.textContent??"":$s(t)}function Kn(t){if(typeof t=="string")return document.createTextNode(t);const e=document.createElement(t.tag);for(const r of t.children)e.appendChild(Kn(r));const n=Object.keys(t.attrs);for(const r of n)e.setAttribute(r,t.attrs[r]);return e}const Os=`# The basics

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
import { mount } from "hyperfx";

const app = document.getElementById("app")!;
const myElement = <MyComponent />;

// It's just a div!
console.log(myElement instanceof HTMLDivElement); // true

mount(() => myElement, app, { mode: "append" });
\`\`\`

## Reactive Text and Attributes

You can embed logic directly in your JSX. When you use a signal, HyperFX automatically tracks the dependency and updates only that specific part of the DOM.

\`\`\`tsx
import { createSignal } from "hyperfx";

function Greeting() {
  const [name, setName] = createSignal("World");

  return (
    <div>
      <input 
        value={name()} 
        oninput={(e) => setName(e.target.value)} 
      />
      <h1>Hello, {name}!</h1>
    </div>
  );
}
\`\`\`

## Styling

Styles can be strings or reactive values:

\`\`\`tsx
const [color, setColor] = createSignal("red");

<div style={{ color: color(), fontWeight: "bold" }}>
  Reactive styles!
</div>
\`\`\`
`,Is=`# Routing & SPA

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
`,Ls=`# Components

Components in HyperFX are just functions that return JSX elements. They can use signals for reactive state management.

\`\`\`tsx
import { createSignal, mount } from "hyperfx";

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
mount(() => myComponent, document.body, { mode: "append" });
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
`,Ds=`# Get started with HyperFX

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
import { mount } from 'hyperfx'

function App() {
  return (
    <div>
      <p style="font-size: 120%;">This is rendered from HyperFX with JSX!</p>
    </div>
  );
}

const appRoot = document.getElementById("app")!;
mount(App, undefined, appRoot, { mode: 'replace' });
\`\`\`

Run it with realtime updates with:

\`\`\`bash
  pnpm dev
\`\`\`
`,Hs=`# State Management

HyperFX includes a powerful reactive state management system inspired by signals. It provides fine-grained reactivity with automatic dependency tracking, meaning only the parts of the DOM that actually change will be updated.

## Core Primitives

### Signals

Signals are the basic unit of state. In HyperFX, \`createSignal\` returns a **tuple** \`[get, set]\` where:

- \`get\` is a callable accessor function: call it to read the value
- \`set\` is a setter function: pass a value to update, returns an \`undo()\` function

\`\`\`tsx
import { createSignal } from 'hyperfx';

// Create a signal with an initial value
const [count, setCount] = createSignal(0);

// Get the current value by calling the accessor
console.log(count()); // 0

// Set a new value by calling the setter
setCount(5);
console.log(count()); // 5

// Set using a function (receives previous value)
setCount(prev => prev + 1);
console.log(count()); // 6

// The setter returns an undo function
const undo = setCount(10);
undo(); // count is back to 6

// Use it directly in JSX
function Counter() {
  return (
    <button onclick={() => setCount(count() + 1)}>
      Count is: {count}
    </button>
  );
}
\`\`\`

#### Signal Accessor Methods

The accessor (\`count\` in the example above) has a \`.subscribe()\` method for manual subscription:

\`\`\`tsx
const [name, setName] = createSignal('Alice');

const unsubscribe = name.subscribe((value) => {
  console.log('Name changed to:', value);
});

setName('Bob'); // Logs: "Name changed to: Bob"
unsubscribe(); // Stop receiving updates
\`\`\`

### Computed Values

Computed values are signals derived from other signals. They automatically update when their dependencies change.

\`\`\`tsx
import { createSignal, createComputed } from 'hyperfx';

const [firstName, setFirstName] = createSignal('John');
const [lastName, setLastName] = createSignal('Doe');

// Automatically tracks dependencies
const fullName = createComputed(() => \`\${firstName()} \${lastName()}\`);

console.log(fullName()); // "John Doe"

setFirstName("Jane");
console.log(fullName()); // "Jane Doe"
\`\`\`

### Effects

Effects are used for side effects that should run when signals change (e.g., logging, fetching data, manual DOM updates).

\`\`\`tsx
import { createSignal, createEffect } from 'hyperfx';

const [count, setCount] = createSignal(0);

createEffect(() => {
  console.log(\`The count is now: \${count()}\`);
  
  // Optional cleanup function returned by effect
  return () => {
    console.log("Cleaning up...");
  };
});

setCount(1); // Logs: "The count is now: 1"
\`\`\`

---

## React-like Hooks

If you prefer the \`[value, setValue]\` pattern from React, you can use destructuring with \`createSignal\`:

\`\`\`tsx
import { createSignal } from 'hyperfx';

function HookExample() {
  const [count, setCount] = createSignal(0);

  return (
    <button onclick={() => setCount(count() + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

---

## Global State

Because signals are just functions/tuples, they can be defined anywhere and shared across components easily.

\`\`\`tsx
// store.ts
import { createSignal } from 'hyperfx';
export const [theme, setTheme] = createSignal('light');

// ComponentA.tsx
import { theme, setTheme } from './store';
const toggleTheme = () => setTheme(theme() === 'light' ? 'dark' : 'light');

// ComponentB.tsx
import { theme } from './store';
function Display() {
  return <div class={theme}>Current theme: {theme}</div>;
}
\`\`\`

---

## Advanced Usage

### Untracked Access

If you need to read a signal's value inside a computed or effect without creating a dependency, use \`untrack()\`.

\`\`\`tsx
const [count, setCount] = createSignal(0);
const [other, setOther] = createSignal(0);

createComputed(() => {
  console.log(count()); // Creates dependency
  console.log(untrack(() => other())); // Reads value without creating dependency
});
\`\`\`

### SSR Signal Registration

For server-side rendering with hydration, you can register signals with a unique key:

\`\`\`tsx
import { createSignal } from 'hyperfx';

// Signals with the same key will return the same instance
export const [user, setUser] = createSignal(null, { key: 'user-session' });
\`\`\`

This allows the server to serialize signal state and restore it on the client during hydration.

---

## API Reference

| Function | Description |
| --- | --- |
| \`createSignal(value, options?)\` | Returns \`[get, set]\` tuple. \`get()\` reads, \`set(val)\` sets and returns \`undo()\`. |
| \`createComputed(fn)\` | Returns a read-only accessor that updates based on dependencies. |
| \`createEffect(fn)\` | Runs side effects on dependency changes. Returns a stop function. |
| \`untrack(fn)\` | Runs function without tracking signal accesses. |
| \`isAccessor(value)\` | Type guard to check if value is a signal accessor. |
| \`getAccessor(value)\` | Extract accessor from signal tuple or return as-is. |
| \`getSetter(value)\` | Extract setter from signal tuple. |
| \`batch(fn)\` | Groups multiple signal updates into one notification cycle. |
| \`derive(signal, fn)\` | Creates a derived signal that transforms another signal's value. |
| \`combine(...signals)\` | Combines multiple signals into an array accessor. |

---

## Hooks API

HyperFX provides React-like hooks for component state management.

### useState

Returns a signal accessor and setter for local component state.

\`\`\`tsx
import { useState } from 'hyperfx';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onclick={() => setCount(count() + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

### useComputed / useMemo

Returns a memoized computed value that only re-computes when dependencies change.

\`\`\`tsx
import { useComputed, useState } from 'hyperfx';

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  
  const filteredTodos = useComputed(() => {
    if (filter() === 'all') return todos();
    return todos().filter(t => t.status === filter());
  });
  
  return (
    <ul>
      {filteredTodos().map(t => <li key={t.id}>{t.text}</li>)}
    </ul>
  );
}
\`\`\`

### useEffect

Runs side effects with optional dependency tracking. Returns a cleanup function.

\`\`\`tsx
import { useEffect, useState } from 'hyperfx';

function DataFetcher() {
  const [data, setData] = useState<unknown>(null);
  const [id, setId] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    
    fetch(\`/api/\${id()}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (!controller.signal.aborted) {
          setData(data);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          console.error('Fetch error:', err);
        }
      });

    return () => controller.abort();
  }, [id]); // Re-runs when id changes

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
\`\`\`

---

## Utility Functions

### batch

Groups multiple signal updates into a single notification cycle, preventing intermediate re-renders.

\`\`\`tsx
import { batch, createSignal } from 'hyperfx';

const [x, setX] = createSignal(0);
const [y, setY] = createSignal(0);

batch(() => {
  setX(10);
  setY(20);
}); // Both updates processed, single notification to subscribers
\`\`\`

### derive

Creates a derived signal that transforms an existing signal's value.

\`\`\`tsx
import { derive, createSignal } from 'hyperfx';

const [count, setCount] = createSignal(0);
const double = derive(count, v => v * 2);

console.log(double()); // 0
setCount(5);
console.log(double()); // 10
\`\`\`

### combine

Combines multiple signals into a single computed signal that returns an array of values.

\`\`\`tsx
import { combine, createSignal } from 'hyperfx';

const [firstName, setFirstName] = createSignal('John');
const [lastName, setLastName] = createSignal('Doe');

const fullName = combine(firstName, lastName);
console.log(fullName()); // ['John', 'Doe']

setFirstName('Jane');
console.log(fullName()); // ['Jane', 'Doe']
\`\`\`
`,Bs=`# Rendering

Learn how to render HyperFX components and elements to the DOM.

## Basic Rendering

With JSX, rendering is straightforward. Create your component and append it to the DOM:

\`\`\`tsx
import { createSignal, mount } from "hyperfx";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <h1>My App</h1>
      <p>Count: {count}</p>
      <button onclick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}

// Render to DOM (returns an unmount function)
const appRoot = document.getElementById('app')!;
mount(App, undefined, appRoot, { mode: 'replace' });
\`\`\`

## Replacing Content

Use \`mount()\` with \`mode: "replace"\` to replace all content in a container:

\`\`\`tsx
function updatePage() {
  const container = document.getElementById('page-content')!;

  mount(() => (
    <div>
      <h2>Updated Content</h2>
      <p>This content replaced everything in the container.</p>
    </div>
  ), container, { mode: 'replace' });
}

## Appending Content

Use \`mode: "append"\` to add content without clearing the container:

\`\`\`tsx
import { mount } from "hyperfx";

const container = document.getElementById("list")!;
mount(() => <li>New item</li>, container, { mode: "append" });
\`\`\`
\`\`\`

---

## Control Flow Components

HyperFX provides specialized components for common rendering patterns. These are more efficient than standard JavaScript expressions because they can optimize DOM updates.

### \`<Show>\`

Use \`<Show>\` for conditional rendering.

\`\`\`tsx
import { Show, createSignal } from "hyperfx";

function Profile() {
  const [loggedIn, setLoggedIn] = createSignal(false);

  return (
    <div>
      <Show when={loggedIn}>
        <button onclick={() => setLoggedIn(false)}>Logout</button>
      </Show>
      
      <Show when={() => !loggedIn()}>
        <button onclick={() => setLoggedIn(true)}>Login</button>
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
  const [todos, setTodos] = createSignal([
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

const [status, setStatus] = createSignal("loading");

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
`,Ps=`# Server-Side Rendering (SSR)

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
import { hydrate, isHydratable, mount } from "hyperfx";

if (isHydratable(document.body)) {
  hydrate(document.body, () => <App />);
} else {
  // No SSR content, do client-side mount
  mount(() => <App />, document.body, { mode: "replace" });
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
import { hydrate, isHydratable, mount } from "hyperfx";
import { App } from "./App";

function initializeClient() {
  const ClientApp = () => <App />;

  if (isHydratable(document.body)) {
    // Hydrate server-rendered content
    hydrate(document.body, ClientApp);
  } else {
    // No SSR content, do client-side mount
    mount(() => <ClientApp />, document.body, { mode: "replace" });
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
`,Jn=[{title:"Get Started",route_name:"get_started",data:Ds},{title:"HyperFX basics",route_name:"basics",data:Os},{title:"State Management",route_name:"state-management",data:Hs},{title:"Rendering & Control Flow",route_name:"render",data:Bs},{title:"HyperFX components",route_name:"components",data:Ls},{title:"Single Page Application",route_name:"spa",data:Is},{title:"Server-Side Rendering",route_name:"ssr",data:Ps}],zs=O('<nav class="flex text-xl p-3 bg-slate-950 text-gray-200 border-b border-indigo-950/50 shadow-lg"><!--hfx:dyn:0:0--><!--hfx:dyn:0:1--><!--hfx:dyn:0:2--></nav>'),Fs=O('<aside class="bg-slate-900 text-gray-100  border-r border-indigo-950/50 p-2 sm:p-4 shadow-xl"><!--hfx:dyn:1:0--><!--hfx:dyn:1:1--></aside>'),Us=O('<div class="flex items-center justify-between mb-6 sm:hidden"><!--hfx:dyn:2:0--></div>'),Xs=O('<button class="text-indigo-300 border border-indigo-800/50 p-2 rounded-xl active:scale-95 transition-transform" title="Toggle Navigation"><span class="text-lg">☰</span><span class="sr-only">Toggle Navigation</span></button>'),Gs=O(`<nav><p class="hidden sm:block text-xs font-bold uppercase min-w-64 tracking-widest text-indigo-400/40 mb-3 px-3">
          Fundamentals
        </p><!--hfx:dyn:4:0--></nav>`);function js(){return(()=>{const t=zs.cloneNode(!0),e=C(t,"hfx:dyn:0:0"),n=C(t,"hfx:dyn:0:1"),r=C(t,"hfx:dyn:0:2");return e&&A(e.parentNode,re(se(lt,ie({class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:St,children:`
        Home
      `}))),e),n&&A(n.parentNode,re(se(lt,ie({class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:St,search:{document:"get_started"},children:`
        Docs
      `}))),n),r&&A(r.parentNode,re(se(lt,ie({class:"px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800 text-gray-400",to:wr,children:`
        Example
      `}))),r),t})()}const[Ws,qs]=Ue(!1);function Zs(){qs(t=>!t)}function Ks(){const t=de(()=>`flex-col sm:flex gap-1 ${Ws()?"flex":"hidden"}`);return(()=>{const e=Fs.cloneNode(!0),n=C(e,"hfx:dyn:1:0"),r=C(e,"hfx:dyn:1:1");return n&&A(n.parentNode,(()=>{const s=Us.cloneNode(!0),i=C(s,"hfx:dyn:2:0");return i&&A(i.parentNode,(()=>{const o=Xs.cloneNode(!0);return ft(o,"click",Zs),o})(),i),s})(),n),r&&A(r.parentNode,(()=>{const s=Gs.cloneNode(!0);be(s,"class",t);const i=C(s,"hfx:dyn:4:0");return i&&A(i.parentNode,re(se(Ms,ie({each:Jn,children:o=>re(se(lt,ie({class:"px-3 py-2 rounded-lg text-base transition-all duration-200 no-underline block",to:St,search:{document:o.route_name},children:o.title})))}))),i),s})(),r),e})()}function Yt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Te=Yt();function Yn(t){Te=t}var Fe={exec:()=>null};function L(t,e=""){let n=typeof t=="string"?t:t.source;const r={replace:(s,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(J.caret,"$1"),n=n.replace(s,o),r},getRegex:()=>new RegExp(n,e)};return r}var J={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i")},Js=/^(?:[ \t]*(?:\n|$))+/,Ys=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Vs=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,je=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Qs=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Vt=/(?:[*+-]|\d{1,9}[.)])/,Vn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Qn=L(Vn).replace(/bull/g,Vt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ei=L(Vn).replace(/bull/g,Vt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Qt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ti=/^[^\n]+/,en=/(?!\s*\])(?:\\.|[^\[\]\\])+/,ni=L(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",en).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ri=L(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Vt).getRegex(),_t="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",tn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,si=L("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",tn).replace("tag",_t).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),er=L(Qt).replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_t).getRegex(),ii=L(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",er).getRegex(),nn={blockquote:ii,code:Ys,def:ni,fences:Vs,heading:Qs,hr:je,html:si,lheading:Qn,list:ri,newline:Js,paragraph:er,table:Fe,text:ti},Rn=L("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_t).getRegex(),oi={...nn,lheading:ei,table:Rn,paragraph:L(Qt).replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Rn).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",_t).getRegex()},ai={...nn,html:L(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",tn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Fe,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:L(Qt).replace("hr",je).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Qn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ci=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,li=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,tr=/^( {2,}|\\)\n(?!\s*$)/,ui=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Et=/[\p{P}\p{S}]/u,rn=/[\s\p{P}\p{S}]/u,nr=/[^\s\p{P}\p{S}]/u,di=L(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,rn).getRegex(),rr=/(?!~)[\p{P}\p{S}]/u,hi=/(?!~)[\s\p{P}\p{S}]/u,pi=/(?:[^\s\p{P}\p{S}]|~)/u,fi=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,sr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,gi=L(sr,"u").replace(/punct/g,Et).getRegex(),mi=L(sr,"u").replace(/punct/g,rr).getRegex(),ir="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",bi=L(ir,"gu").replace(/notPunctSpace/g,nr).replace(/punctSpace/g,rn).replace(/punct/g,Et).getRegex(),yi=L(ir,"gu").replace(/notPunctSpace/g,pi).replace(/punctSpace/g,hi).replace(/punct/g,rr).getRegex(),xi=L("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,nr).replace(/punctSpace/g,rn).replace(/punct/g,Et).getRegex(),Si=L(/\\(punct)/,"gu").replace(/punct/g,Et).getRegex(),wi=L(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ki=L(tn).replace("(?:-->|$)","-->").getRegex(),_i=L("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ki).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),mt=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Ei=L(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",mt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),or=L(/^!?\[(label)\]\[(ref)\]/).replace("label",mt).replace("ref",en).getRegex(),ar=L(/^!?\[(ref)\](?:\[\])?/).replace("ref",en).getRegex(),vi=L("reflink|nolink(?!\\()","g").replace("reflink",or).replace("nolink",ar).getRegex(),sn={_backpedal:Fe,anyPunctuation:Si,autolink:wi,blockSkip:fi,br:tr,code:li,del:Fe,emStrongLDelim:gi,emStrongRDelimAst:bi,emStrongRDelimUnd:xi,escape:ci,link:Ei,nolink:ar,punctuation:di,reflink:or,reflinkSearch:vi,tag:_i,text:ui,url:Fe},Ti={...sn,link:L(/^!?\[(label)\]\((.*?)\)/).replace("label",mt).getRegex(),reflink:L(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",mt).getRegex()},qt={...sn,emStrongRDelimAst:yi,emStrongLDelim:mi,url:L(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Ni={...qt,br:L(tr).replace("{2,}","*").getRegex(),text:L(qt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},it={normal:nn,gfm:oi,pedantic:ai},Pe={normal:sn,gfm:qt,breaks:Ni,pedantic:Ti},Ri={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},An=t=>Ri[t];function ue(t,e){if(e){if(J.escapeTest.test(t))return t.replace(J.escapeReplace,An)}else if(J.escapeTestNoEncode.test(t))return t.replace(J.escapeReplaceNoEncode,An);return t}function Cn(t){try{t=encodeURI(t).replace(J.percentDecode,"%")}catch{return null}return t}function Mn(t,e){const n=t.replace(J.findPipe,(i,o,a)=>{let u=!1,l=o;for(;--l>=0&&a[l]==="\\";)u=!u;return u?"|":" |"}),r=n.split(J.splitPipe);let s=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;s<r.length;s++)r[s]=r[s].trim().replace(J.slashPipe,"|");return r}function ze(t,e,n){const r=t.length;if(r===0)return"";let s=0;for(;s<r&&t.charAt(r-s-1)===e;)s++;return t.slice(0,r-s)}function Ai(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function $n(t,e,n,r,s){const i=e.href,o=e.title||null,a=t[1].replace(s.other.outputLinkReplace,"$1");r.state.inLink=!0;const u={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:a,tokens:r.inlineTokens(a)};return r.state.inLink=!1,u}function Ci(t,e,n){const r=t.match(n.other.indentCodeCompensation);if(r===null)return e;const s=r[1];return e.split(`
`).map(i=>{const o=i.match(n.other.beginningSpace);if(o===null)return i;const[a]=o;return a.length>=s.length?i.slice(s.length):i}).join(`
`)}var bt=class{options;rules;lexer;constructor(t){this.options=t||Te}space(t){const e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){const e=this.rules.block.code.exec(t);if(e){const n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:ze(n,`
`)}}}fences(t){const e=this.rules.block.fences.exec(t);if(e){const n=e[0],r=Ci(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){const e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){const r=ze(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){const e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:ze(e[0],`
`)}}blockquote(t){const e=this.rules.block.blockquote.exec(t);if(e){let n=ze(e[0],`
`).split(`
`),r="",s="";const i=[];for(;n.length>0;){let o=!1;const a=[];let u;for(u=0;u<n.length;u++)if(this.rules.other.blockquoteStart.test(n[u]))a.push(n[u]),o=!0;else if(!o)a.push(n[u]);else break;n=n.slice(u);const l=a.join(`
`),h=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${l}`:l,s=s?`${s}
${h}`:h;const d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,i,!0),this.lexer.state.top=d,n.length===0)break;const p=i.at(-1);if(p?.type==="code")break;if(p?.type==="blockquote"){const b=p,g=b.raw+`
`+n.join(`
`),S=this.blockquote(g);i[i.length-1]=S,r=r.substring(0,r.length-b.raw.length)+S.raw,s=s.substring(0,s.length-b.text.length)+S.text;break}else if(p?.type==="list"){const b=p,g=b.raw+`
`+n.join(`
`),S=this.list(g);i[i.length-1]=S,r=r.substring(0,r.length-p.raw.length)+S.raw,s=s.substring(0,s.length-b.raw.length)+S.raw,n=g.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:i,text:s}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim();const r=n.length>1,s={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");const i=this.rules.other.listItemRegex(n);let o=!1;for(;t;){let u=!1,l="",h="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;l=e[0],t=t.substring(l.length);let d=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,$=>" ".repeat(3*$.length)),p=t.split(`
`,1)[0],b=!d.trim(),g=0;if(this.options.pedantic?(g=2,h=d.trimStart()):b?g=e[1].length+1:(g=e[2].search(this.rules.other.nonSpaceChar),g=g>4?1:g,h=d.slice(g),g+=e[1].length),b&&this.rules.other.blankLine.test(p)&&(l+=p+`
`,t=t.substring(p.length+1),u=!0),!u){const $=this.rules.other.nextBulletRegex(g),B=this.rules.other.hrRegex(g),Z=this.rules.other.fencesBeginRegex(g),he=this.rules.other.headingBeginRegex(g),Q=this.rules.other.htmlBeginRegex(g);for(;t;){const ee=t.split(`
`,1)[0];let ae;if(p=ee,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),ae=p):ae=p.replace(this.rules.other.tabCharGlobal,"    "),Z.test(p)||he.test(p)||Q.test(p)||$.test(p)||B.test(p))break;if(ae.search(this.rules.other.nonSpaceChar)>=g||!p.trim())h+=`
`+ae.slice(g);else{if(b||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Z.test(d)||he.test(d)||B.test(d))break;h+=`
`+p}!b&&!p.trim()&&(b=!0),l+=ee+`
`,t=t.substring(ee.length+1),d=ae.slice(g)}}s.loose||(o?s.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(o=!0));let S=null,v;this.options.gfm&&(S=this.rules.other.listIsTask.exec(h),S&&(v=S[0]!=="[ ] ",h=h.replace(this.rules.other.listReplaceTask,""))),s.items.push({type:"list_item",raw:l,task:!!S,checked:v,loose:!1,text:h,tokens:[]}),s.raw+=l}const a=s.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let u=0;u<s.items.length;u++)if(this.lexer.state.top=!1,s.items[u].tokens=this.lexer.blockTokens(s.items[u].text,[]),!s.loose){const l=s.items[u].tokens.filter(d=>d.type==="space"),h=l.length>0&&l.some(d=>this.rules.other.anyLine.test(d.raw));s.loose=h}if(s.loose)for(let u=0;u<s.items.length;u++)s.items[u].loose=!0;return s}}html(t){const e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){const e=this.rules.block.def.exec(t);if(e){const n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:r,title:s}}}table(t){const e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;const n=Mn(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===r.length){for(const o of r)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(const o of s)i.rows.push(Mn(o,i.header.length).map((a,u)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:i.align[u]})));return i}}lheading(t){const e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){const e=this.rules.block.paragraph.exec(t);if(e){const n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){const e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){const e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){const e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){const e=this.rules.inline.link.exec(t);if(e){const n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const i=ze(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{const i=Ai(e[2],"()");if(i===-2)return;if(i>-1){const a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let r=e[2],s="";if(this.options.pedantic){const i=this.rules.other.pedanticHrefTitle.exec(r);i&&(r=i[1],s=i[3])}else s=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),$n(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){const r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=e[r.toLowerCase()];if(!s){const i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return $n(n,s,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(r[1]||r[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const i=[...r[0]].length-1;let o,a,u=i,l=0;const h=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,e=e.slice(-1*t.length+i);(r=h.exec(e))!=null;){if(o=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!o)continue;if(a=[...o].length,r[3]||r[4]){u+=a;continue}else if((r[5]||r[6])&&i%3&&!((i+a)%3)){l+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u+l);const d=[...r[0]][0].length,p=t.slice(0,i+r.index+d+a);if(Math.min(i,a)%2){const g=p.slice(1,-1);return{type:"em",raw:p,text:g,tokens:this.lexer.inlineTokens(g)}}const b=p.slice(2,-2);return{type:"strong",raw:p,text:b,tokens:this.lexer.inlineTokens(b)}}}}codespan(t){const e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," ");const r=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){const e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){const e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){const e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let s;do s=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(s!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){const e=this.rules.inline.text.exec(t);if(e){const n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},ge=class Zt{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Te,this.options.tokenizer=this.options.tokenizer||new bt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const n={other:J,block:it.normal,inline:Pe.normal};this.options.pedantic?(n.block=it.pedantic,n.inline=Pe.pedantic):this.options.gfm&&(n.block=it.gfm,this.options.breaks?n.inline=Pe.breaks:n.inline=Pe.gfm),this.tokenizer.rules=n}static get rules(){return{block:it,inline:Pe}}static lex(e,n){return new Zt(n).lex(e)}static lexInline(e,n){return new Zt(n).inlineTokens(e)}lex(e){e=e.replace(J.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){const r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){for(this.options.pedantic&&(e=e.replace(J.tabCharGlobal,"    ").replace(J.spaceLine,""));e;){let s;if(this.options.extensions?.block?.some(o=>(s=o.call({lexer:this},e,n))?(e=e.substring(s.raw.length),n.push(s),!0):!1))continue;if(s=this.tokenizer.space(e)){e=e.substring(s.raw.length);const o=n.at(-1);s.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(s);continue}if(s=this.tokenizer.code(e)){e=e.substring(s.raw.length);const o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue.at(-1).src=o.text):n.push(s);continue}if(s=this.tokenizer.fences(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.heading(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.hr(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.blockquote(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.list(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.html(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.def(e)){e=e.substring(s.raw.length);const o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=`
`+s.raw,o.text+=`
`+s.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[s.tag]||(this.tokens.links[s.tag]={href:s.href,title:s.title});continue}if(s=this.tokenizer.table(e)){e=e.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.lheading(e)){e=e.substring(s.raw.length),n.push(s);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0;const a=e.slice(1);let u;this.options.extensions.startBlock.forEach(l=>{u=l.call({lexer:this},a),typeof u=="number"&&u>=0&&(o=Math.min(o,u))}),o<1/0&&o>=0&&(i=e.substring(0,o+1))}if(this.state.top&&(s=this.tokenizer.paragraph(i))){const o=n.at(-1);r&&o?.type==="paragraph"?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(s),r=i.length!==e.length,e=e.substring(s.raw.length);continue}if(s=this.tokenizer.text(e)){e=e.substring(s.raw.length);const o=n.at(-1);o?.type==="text"?(o.raw+=`
`+s.raw,o.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(s);continue}if(e){const o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let r=e,s=null;if(this.tokens.links){const a=Object.keys(this.tokens.links);if(a.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)a.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,s.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;(s=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);let i=!1,o="";for(;e;){i||(o=""),i=!1;let a;if(this.options.extensions?.inline?.some(l=>(a=l.call({lexer:this},e,n))?(e=e.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);const l=n.at(-1);a.type==="text"&&l?.type==="text"?(l.raw+=a.raw,l.text+=a.text):n.push(a);continue}if(a=this.tokenizer.emStrong(e,r,o)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.del(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),n.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),n.push(a);continue}let u=e;if(this.options.extensions?.startInline){let l=1/0;const h=e.slice(1);let d;this.options.extensions.startInline.forEach(p=>{d=p.call({lexer:this},h),typeof d=="number"&&d>=0&&(l=Math.min(l,d))}),l<1/0&&l>=0&&(u=e.substring(0,l+1))}if(a=this.tokenizer.inlineText(u)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(o=a.raw.slice(-1)),i=!0;const l=n.at(-1);l?.type==="text"?(l.raw+=a.raw,l.text+=a.text):n.push(a);continue}if(e){const l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return n}},yt=class{options;parser;constructor(t){this.options=t||Te}space(t){return""}code({text:t,lang:e,escaped:n}){const r=(e||"").match(J.notSpaceStart)?.[0],s=t.replace(J.endingNewline,"")+`
`;return r?'<pre><code class="language-'+ue(r)+'">'+(n?s:ue(s,!0))+`</code></pre>
`:"<pre><code>"+(n?s:ue(s,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){const e=t.ordered,n=t.start;let r="";for(let o=0;o<t.items.length;o++){const a=t.items[o];r+=this.listitem(a)}const s=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+s+i+`>
`+r+"</"+s+`>
`}listitem(t){let e="";if(t.task){const n=this.checkbox({checked:!!t.checked});t.loose?t.tokens[0]?.type==="paragraph"?(t.tokens[0].text=n+" "+t.tokens[0].text,t.tokens[0].tokens&&t.tokens[0].tokens.length>0&&t.tokens[0].tokens[0].type==="text"&&(t.tokens[0].tokens[0].text=n+" "+ue(t.tokens[0].tokens[0].text),t.tokens[0].tokens[0].escaped=!0)):t.tokens.unshift({type:"text",raw:n+" ",text:n+" ",escaped:!0}):e+=n+" "}return e+=this.parser.parse(t.tokens,!!t.loose),`<li>${e}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let s=0;s<t.header.length;s++)n+=this.tablecell(t.header[s]);e+=this.tablerow({text:n});let r="";for(let s=0;s<t.rows.length;s++){const i=t.rows[s];n="";for(let o=0;o<i.length;o++)n+=this.tablecell(i[o]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){const e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${ue(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){const r=this.parser.parseInline(n),s=Cn(t);if(s===null)return r;t=s;let i='<a href="'+t+'"';return e&&(i+=' title="'+ue(e)+'"'),i+=">"+r+"</a>",i}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));const s=Cn(t);if(s===null)return ue(n);t=s;let i=`<img src="${t}" alt="${n}"`;return e&&(i+=` title="${ue(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:ue(t.text)}},on=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}},me=class Kt{options;renderer;textRenderer;constructor(e){this.options=e||Te,this.options.renderer=this.options.renderer||new yt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new on}static parse(e,n){return new Kt(n).parse(e)}static parseInline(e,n){return new Kt(n).parseInline(e)}parse(e,n=!0){let r="";for(let s=0;s<e.length;s++){const i=e[s];if(this.options.extensions?.renderers?.[i.type]){const a=i,u=this.options.extensions.renderers[a.type].call({parser:this},a);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(a.type)){r+=u||"";continue}}const o=i;switch(o.type){case"space":{r+=this.renderer.space(o);continue}case"hr":{r+=this.renderer.hr(o);continue}case"heading":{r+=this.renderer.heading(o);continue}case"code":{r+=this.renderer.code(o);continue}case"table":{r+=this.renderer.table(o);continue}case"blockquote":{r+=this.renderer.blockquote(o);continue}case"list":{r+=this.renderer.list(o);continue}case"html":{r+=this.renderer.html(o);continue}case"paragraph":{r+=this.renderer.paragraph(o);continue}case"text":{let a=o,u=this.renderer.text(a);for(;s+1<e.length&&e[s+1].type==="text";)a=e[++s],u+=`
`+this.renderer.text(a);n?r+=this.renderer.paragraph({type:"paragraph",raw:u,text:u,tokens:[{type:"text",raw:u,text:u,escaped:!0}]}):r+=u;continue}default:{const a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}parseInline(e,n=this.renderer){let r="";for(let s=0;s<e.length;s++){const i=e[s];if(this.options.extensions?.renderers?.[i.type]){const a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){r+=a||"";continue}}const o=i;switch(o.type){case"escape":{r+=n.text(o);break}case"html":{r+=n.html(o);break}case"link":{r+=n.link(o);break}case"image":{r+=n.image(o);break}case"strong":{r+=n.strong(o);break}case"em":{r+=n.em(o);break}case"codespan":{r+=n.codespan(o);break}case"br":{r+=n.br(o);break}case"del":{r+=n.del(o);break}case"text":{r+=n.text(o);break}default:{const a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}},ct=class{options;block;constructor(t){this.options=t||Te}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}provideLexer(){return this.block?ge.lex:ge.lexInline}provideParser(){return this.block?me.parse:me.parseInline}},Mi=class{defaults=Yt();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=me;Renderer=yt;TextRenderer=on;Lexer=ge;Tokenizer=bt;Hooks=ct;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(const r of t)switch(n=n.concat(e.call(this,r)),r.type){case"table":{const s=r;for(const i of s.header)n=n.concat(this.walkTokens(i.tokens,e));for(const i of s.rows)for(const o of i)n=n.concat(this.walkTokens(o.tokens,e));break}case"list":{const s=r;n=n.concat(this.walkTokens(s.items,e));break}default:{const s=r;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(i=>{const o=s[i].flat(1/0);n=n.concat(this.walkTokens(o,e))}):s.tokens&&(n=n.concat(this.walkTokens(s.tokens,e)))}}return n}use(...t){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{const r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){const i=e.renderers[s.name];i?e.renderers[s.name]=function(...o){let a=s.renderer.apply(this,o);return a===!1&&(a=i.apply(this,o)),a}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const i=e[s.level];i?i.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),r.extensions=e),n.renderer){const s=this.defaults.renderer||new yt(this.defaults);for(const i in n.renderer){if(!(i in s))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;const o=i,a=n.renderer[o],u=s[o];s[o]=(...l)=>{let h=a.apply(s,l);return h===!1&&(h=u.apply(s,l)),h||""}}r.renderer=s}if(n.tokenizer){const s=this.defaults.tokenizer||new bt(this.defaults);for(const i in n.tokenizer){if(!(i in s))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;const o=i,a=n.tokenizer[o],u=s[o];s[o]=(...l)=>{let h=a.apply(s,l);return h===!1&&(h=u.apply(s,l)),h}}r.tokenizer=s}if(n.hooks){const s=this.defaults.hooks||new ct;for(const i in n.hooks){if(!(i in s))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;const o=i,a=n.hooks[o],u=s[o];ct.passThroughHooks.has(i)?s[o]=l=>{if(this.defaults.async)return Promise.resolve(a.call(s,l)).then(d=>u.call(s,d));const h=a.call(s,l);return u.call(s,h)}:s[o]=(...l)=>{let h=a.apply(s,l);return h===!1&&(h=u.apply(s,l)),h}}r.hooks=s}if(n.walkTokens){const s=this.defaults.walkTokens,i=n.walkTokens;r.walkTokens=function(o){let a=[];return a.push(i.call(this,o)),s&&(a=a.concat(s.call(this,o))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return ge.lex(t,e??this.defaults)}parser(t,e){return me.parse(t,e??this.defaults)}parseMarkdown(t){return(n,r)=>{const s={...r},i={...this.defaults,...s},o=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&s.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));i.hooks&&(i.hooks.options=i,i.hooks.block=t);const a=i.hooks?i.hooks.provideLexer():t?ge.lex:ge.lexInline,u=i.hooks?i.hooks.provideParser():t?me.parse:me.parseInline;if(i.async)return Promise.resolve(i.hooks?i.hooks.preprocess(n):n).then(l=>a(l,i)).then(l=>i.hooks?i.hooks.processAllTokens(l):l).then(l=>i.walkTokens?Promise.all(this.walkTokens(l,i.walkTokens)).then(()=>l):l).then(l=>u(l,i)).then(l=>i.hooks?i.hooks.postprocess(l):l).catch(o);try{i.hooks&&(n=i.hooks.preprocess(n));let l=a(n,i);i.hooks&&(l=i.hooks.processAllTokens(l)),i.walkTokens&&this.walkTokens(l,i.walkTokens);let h=u(l,i);return i.hooks&&(h=i.hooks.postprocess(h)),h}catch(l){return o(l)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){const r="<p>An error occurred:</p><pre>"+ue(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},ve=new Mi;function H(t,e){return ve.parse(t,e)}H.options=H.setOptions=function(t){return ve.setOptions(t),H.defaults=ve.defaults,Yn(H.defaults),H};H.getDefaults=Yt;H.defaults=Te;H.use=function(...t){return ve.use(...t),H.defaults=ve.defaults,Yn(H.defaults),H};H.walkTokens=function(t,e){return ve.walkTokens(t,e)};H.parseInline=ve.parseInline;H.Parser=me;H.parser=me.parse;H.Renderer=yt;H.TextRenderer=on;H.Lexer=ge;H.lexer=ge.lex;H.Tokenizer=bt;H.Hooks=ct;H.parse=H;H.options;H.setOptions;H.use;H.walkTokens;H.parseInline;var cr=H;me.parse;ge.lex;const $i=`# HyperFX

HyperFX (hypermedia functions) is a simple library for DOM manipulation by using functions.
Right now it's JSX based. And it is not production ready.   

## Use case

Absolutely none, it is just a fun project.
`;function Oi(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Bt,On;function Ii(){if(On)return Bt;On=1;function t(c){return c instanceof Map?c.clear=c.delete=c.set=function(){throw new Error("map is read-only")}:c instanceof Set&&(c.add=c.clear=c.delete=function(){throw new Error("set is read-only")}),Object.freeze(c),Object.getOwnPropertyNames(c).forEach(f=>{const y=c[f],N=typeof y;(N==="object"||N==="function")&&!Object.isFrozen(y)&&t(y)}),c}class e{constructor(f){f.data===void 0&&(f.data={}),this.data=f.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(c){return c.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function r(c,...f){const y=Object.create(null);for(const N in c)y[N]=c[N];return f.forEach(function(N){for(const F in N)y[F]=N[F]}),y}const s="</span>",i=c=>!!c.scope,o=(c,{prefix:f})=>{if(c.startsWith("language:"))return c.replace("language:","language-");if(c.includes(".")){const y=c.split(".");return[`${f}${y.shift()}`,...y.map((N,F)=>`${N}${"_".repeat(F+1)}`)].join(" ")}return`${f}${c}`};class a{constructor(f,y){this.buffer="",this.classPrefix=y.classPrefix,f.walk(this)}addText(f){this.buffer+=n(f)}openNode(f){if(!i(f))return;const y=o(f.scope,{prefix:this.classPrefix});this.span(y)}closeNode(f){i(f)&&(this.buffer+=s)}value(){return this.buffer}span(f){this.buffer+=`<span class="${f}">`}}const u=(c={})=>{const f={children:[]};return Object.assign(f,c),f};class l{constructor(){this.rootNode=u(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(f){this.top.children.push(f)}openNode(f){const y=u({scope:f});this.add(y),this.stack.push(y)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(f){return this.constructor._walk(f,this.rootNode)}static _walk(f,y){return typeof y=="string"?f.addText(y):y.children&&(f.openNode(y),y.children.forEach(N=>this._walk(f,N)),f.closeNode(y)),f}static _collapse(f){typeof f!="string"&&f.children&&(f.children.every(y=>typeof y=="string")?f.children=[f.children.join("")]:f.children.forEach(y=>{l._collapse(y)}))}}class h extends l{constructor(f){super(),this.options=f}addText(f){f!==""&&this.add(f)}startScope(f){this.openNode(f)}endScope(){this.closeNode()}__addSublanguage(f,y){const N=f.root;y&&(N.scope=`language:${y}`),this.add(N)}toHTML(){return new a(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(c){return c?typeof c=="string"?c:c.source:null}function p(c){return S("(?=",c,")")}function b(c){return S("(?:",c,")*")}function g(c){return S("(?:",c,")?")}function S(...c){return c.map(y=>d(y)).join("")}function v(c){const f=c[c.length-1];return typeof f=="object"&&f.constructor===Object?(c.splice(c.length-1,1),f):{}}function $(...c){return"("+(v(c).capture?"":"?:")+c.map(N=>d(N)).join("|")+")"}function B(c){return new RegExp(c.toString()+"|").exec("").length-1}function Z(c,f){const y=c&&c.exec(f);return y&&y.index===0}const he=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function Q(c,{joinWith:f}){let y=0;return c.map(N=>{y+=1;const F=y;let U=d(N),k="";for(;U.length>0;){const w=he.exec(U);if(!w){k+=U;break}k+=U.substring(0,w.index),U=U.substring(w.index+w[0].length),w[0][0]==="\\"&&w[1]?k+="\\"+String(Number(w[1])+F):(k+=w[0],w[0]==="("&&y++)}return k}).map(N=>`(${N})`).join(f)}const ee=/\b\B/,ae="[a-zA-Z]\\w*",Ne="[a-zA-Z_]\\w*",We="\\b\\d+(\\.\\d+)?",qe="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",Ze="\\b(0b[01]+)",vt="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",Tt=(c={})=>{const f=/^#![ ]*\//;return c.binary&&(c.begin=S(f,/.*\b/,c.binary,/\b.*/)),r({scope:"meta",begin:f,end:/$/,relevance:0,"on:begin":(y,N)=>{y.index!==0&&N.ignoreMatch()}},c)},we={begin:"\\\\[\\s\\S]",relevance:0},Nt={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[we]},Ke={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[we]},Rt={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},W=function(c,f,y={}){const N=r({scope:"comment",begin:c,end:f,contains:[]},y);N.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const F=$("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return N.contains.push({begin:S(/[ ]+/,"(",F,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),N},ye=W("//","$"),ke=W("/\\*","\\*/"),Re=W("#","$"),De={scope:"number",begin:We,relevance:0},Je={scope:"number",begin:qe,relevance:0},kr={scope:"number",begin:Ze,relevance:0},_r={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[we,{begin:/\[/,end:/\]/,relevance:0,contains:[we]}]},Er={scope:"title",begin:ae,relevance:0},vr={scope:"title",begin:Ne,relevance:0},Tr={begin:"\\.\\s*"+Ne,relevance:0};var Ye=Object.freeze({__proto__:null,APOS_STRING_MODE:Nt,BACKSLASH_ESCAPE:we,BINARY_NUMBER_MODE:kr,BINARY_NUMBER_RE:Ze,COMMENT:W,C_BLOCK_COMMENT_MODE:ke,C_LINE_COMMENT_MODE:ye,C_NUMBER_MODE:Je,C_NUMBER_RE:qe,END_SAME_AS_BEGIN:function(c){return Object.assign(c,{"on:begin":(f,y)=>{y.data._beginMatch=f[1]},"on:end":(f,y)=>{y.data._beginMatch!==f[1]&&y.ignoreMatch()}})},HASH_COMMENT_MODE:Re,IDENT_RE:ae,MATCH_NOTHING_RE:ee,METHOD_GUARD:Tr,NUMBER_MODE:De,NUMBER_RE:We,PHRASAL_WORDS_MODE:Rt,QUOTE_STRING_MODE:Ke,REGEXP_MODE:_r,RE_STARTERS_RE:vt,SHEBANG:Tt,TITLE_MODE:Er,UNDERSCORE_IDENT_RE:Ne,UNDERSCORE_TITLE_MODE:vr});function Nr(c,f){c.input[c.index-1]==="."&&f.ignoreMatch()}function Rr(c,f){c.className!==void 0&&(c.scope=c.className,delete c.className)}function Ar(c,f){f&&c.beginKeywords&&(c.begin="\\b("+c.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",c.__beforeBegin=Nr,c.keywords=c.keywords||c.beginKeywords,delete c.beginKeywords,c.relevance===void 0&&(c.relevance=0))}function Cr(c,f){Array.isArray(c.illegal)&&(c.illegal=$(...c.illegal))}function Mr(c,f){if(c.match){if(c.begin||c.end)throw new Error("begin & end are not supported with match");c.begin=c.match,delete c.match}}function $r(c,f){c.relevance===void 0&&(c.relevance=1)}const Or=(c,f)=>{if(!c.beforeMatch)return;if(c.starts)throw new Error("beforeMatch cannot be used with starts");const y=Object.assign({},c);Object.keys(c).forEach(N=>{delete c[N]}),c.keywords=y.keywords,c.begin=S(y.beforeMatch,p(y.begin)),c.starts={relevance:0,contains:[Object.assign(y,{endsParent:!0})]},c.relevance=0,delete y.beforeMatch},Ir=["of","and","for","in","not","or","if","then","parent","list","value"],Lr="keyword";function an(c,f,y=Lr){const N=Object.create(null);return typeof c=="string"?F(y,c.split(" ")):Array.isArray(c)?F(y,c):Object.keys(c).forEach(function(U){Object.assign(N,an(c[U],f,U))}),N;function F(U,k){f&&(k=k.map(w=>w.toLowerCase())),k.forEach(function(w){const T=w.split("|");N[T[0]]=[U,Dr(T[0],T[1])]})}}function Dr(c,f){return f?Number(f):Hr(c)?0:1}function Hr(c){return Ir.includes(c.toLowerCase())}const cn={},_e=c=>{console.error(c)},ln=(c,...f)=>{console.log(`WARN: ${c}`,...f)},Ae=(c,f)=>{cn[`${c}/${f}`]||(console.log(`Deprecated as of ${c}. ${f}`),cn[`${c}/${f}`]=!0)},Ve=new Error;function un(c,f,{key:y}){let N=0;const F=c[y],U={},k={};for(let w=1;w<=f.length;w++)k[w+N]=F[w],U[w+N]=!0,N+=B(f[w-1]);c[y]=k,c[y]._emit=U,c[y]._multi=!0}function Br(c){if(Array.isArray(c.begin)){if(c.skip||c.excludeBegin||c.returnBegin)throw _e("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Ve;if(typeof c.beginScope!="object"||c.beginScope===null)throw _e("beginScope must be object"),Ve;un(c,c.begin,{key:"beginScope"}),c.begin=Q(c.begin,{joinWith:""})}}function Pr(c){if(Array.isArray(c.end)){if(c.skip||c.excludeEnd||c.returnEnd)throw _e("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Ve;if(typeof c.endScope!="object"||c.endScope===null)throw _e("endScope must be object"),Ve;un(c,c.end,{key:"endScope"}),c.end=Q(c.end,{joinWith:""})}}function zr(c){c.scope&&typeof c.scope=="object"&&c.scope!==null&&(c.beginScope=c.scope,delete c.scope)}function Fr(c){zr(c),typeof c.beginScope=="string"&&(c.beginScope={_wrap:c.beginScope}),typeof c.endScope=="string"&&(c.endScope={_wrap:c.endScope}),Br(c),Pr(c)}function Ur(c){function f(k,w){return new RegExp(d(k),"m"+(c.case_insensitive?"i":"")+(c.unicodeRegex?"u":"")+(w?"g":""))}class y{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(w,T){T.position=this.position++,this.matchIndexes[this.matchAt]=T,this.regexes.push([T,w]),this.matchAt+=B(w)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const w=this.regexes.map(T=>T[1]);this.matcherRe=f(Q(w,{joinWith:"|"}),!0),this.lastIndex=0}exec(w){this.matcherRe.lastIndex=this.lastIndex;const T=this.matcherRe.exec(w);if(!T)return null;const j=T.findIndex((He,Ct)=>Ct>0&&He!==void 0),X=this.matchIndexes[j];return T.splice(0,j),Object.assign(T,X)}}class N{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(w){if(this.multiRegexes[w])return this.multiRegexes[w];const T=new y;return this.rules.slice(w).forEach(([j,X])=>T.addRule(j,X)),T.compile(),this.multiRegexes[w]=T,T}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(w,T){this.rules.push([w,T]),T.type==="begin"&&this.count++}exec(w){const T=this.getMatcher(this.regexIndex);T.lastIndex=this.lastIndex;let j=T.exec(w);if(this.resumingScanAtSamePosition()&&!(j&&j.index===this.lastIndex)){const X=this.getMatcher(0);X.lastIndex=this.lastIndex+1,j=X.exec(w)}return j&&(this.regexIndex+=j.position+1,this.regexIndex===this.count&&this.considerAll()),j}}function F(k){const w=new N;return k.contains.forEach(T=>w.addRule(T.begin,{rule:T,type:"begin"})),k.terminatorEnd&&w.addRule(k.terminatorEnd,{type:"end"}),k.illegal&&w.addRule(k.illegal,{type:"illegal"}),w}function U(k,w){const T=k;if(k.isCompiled)return T;[Rr,Mr,Fr,Or].forEach(X=>X(k,w)),c.compilerExtensions.forEach(X=>X(k,w)),k.__beforeBegin=null,[Ar,Cr,$r].forEach(X=>X(k,w)),k.isCompiled=!0;let j=null;return typeof k.keywords=="object"&&k.keywords.$pattern&&(k.keywords=Object.assign({},k.keywords),j=k.keywords.$pattern,delete k.keywords.$pattern),j=j||/\w+/,k.keywords&&(k.keywords=an(k.keywords,c.case_insensitive)),T.keywordPatternRe=f(j,!0),w&&(k.begin||(k.begin=/\B|\b/),T.beginRe=f(T.begin),!k.end&&!k.endsWithParent&&(k.end=/\B|\b/),k.end&&(T.endRe=f(T.end)),T.terminatorEnd=d(T.end)||"",k.endsWithParent&&w.terminatorEnd&&(T.terminatorEnd+=(k.end?"|":"")+w.terminatorEnd)),k.illegal&&(T.illegalRe=f(k.illegal)),k.contains||(k.contains=[]),k.contains=[].concat(...k.contains.map(function(X){return Xr(X==="self"?k:X)})),k.contains.forEach(function(X){U(X,T)}),k.starts&&U(k.starts,w),T.matcher=F(T),T}if(c.compilerExtensions||(c.compilerExtensions=[]),c.contains&&c.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return c.classNameAliases=r(c.classNameAliases||{}),U(c)}function dn(c){return c?c.endsWithParent||dn(c.starts):!1}function Xr(c){return c.variants&&!c.cachedVariants&&(c.cachedVariants=c.variants.map(function(f){return r(c,{variants:null},f)})),c.cachedVariants?c.cachedVariants:dn(c)?r(c,{starts:c.starts?r(c.starts):null}):Object.isFrozen(c)?r(c):c}var Gr="11.11.1";class jr extends Error{constructor(f,y){super(f),this.name="HTMLInjectionError",this.html=y}}const At=n,hn=r,pn=Symbol("nomatch"),Wr=7,fn=function(c){const f=Object.create(null),y=Object.create(null),N=[];let F=!0;const U="Could not find the language '{}', did you forget to load/include a language module?",k={disableAutodetect:!0,name:"Plain text",contains:[]};let w={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:h};function T(m){return w.noHighlightRe.test(m)}function j(m){let E=m.className+" ";E+=m.parentNode?m.parentNode.className:"";const I=w.languageDetectRe.exec(E);if(I){const P=xe(I[1]);return P||(ln(U.replace("{}",I[1])),ln("Falling back to no-highlight mode for this block.",m)),P?I[1]:"no-highlight"}return E.split(/\s+/).find(P=>T(P)||xe(P))}function X(m,E,I){let P="",G="";typeof E=="object"?(P=m,I=E.ignoreIllegals,G=E.language):(Ae("10.7.0","highlight(lang, code, ...args) has been deprecated."),Ae("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),G=m,P=E),I===void 0&&(I=!0);const te={code:P,language:G};et("before:highlight",te);const Se=te.result?te.result:He(te.language,te.code,I);return Se.code=te.code,et("after:highlight",Se),Se}function He(m,E,I,P){const G=Object.create(null);function te(x,_){return x.keywords[_]}function Se(){if(!R.keywords){q.addText(z);return}let x=0;R.keywordPatternRe.lastIndex=0;let _=R.keywordPatternRe.exec(z),M="";for(;_;){M+=z.substring(x,_.index);const D=le.case_insensitive?_[0].toLowerCase():_[0],K=te(R,D);if(K){const[pe,ls]=K;if(q.addText(M),M="",G[D]=(G[D]||0)+1,G[D]<=Wr&&(rt+=ls),pe.startsWith("_"))M+=_[0];else{const us=le.classNameAliases[pe]||pe;ce(_[0],us)}}else M+=_[0];x=R.keywordPatternRe.lastIndex,_=R.keywordPatternRe.exec(z)}M+=z.substring(x),q.addText(M)}function tt(){if(z==="")return;let x=null;if(typeof R.subLanguage=="string"){if(!f[R.subLanguage]){q.addText(z);return}x=He(R.subLanguage,z,!0,kn[R.subLanguage]),kn[R.subLanguage]=x._top}else x=Mt(z,R.subLanguage.length?R.subLanguage:null);R.relevance>0&&(rt+=x.relevance),q.__addSublanguage(x._emitter,x.language)}function Y(){R.subLanguage!=null?tt():Se(),z=""}function ce(x,_){x!==""&&(q.startScope(_),q.addText(x),q.endScope())}function yn(x,_){let M=1;const D=_.length-1;for(;M<=D;){if(!x._emit[M]){M++;continue}const K=le.classNameAliases[x[M]]||x[M],pe=_[M];K?ce(pe,K):(z=pe,Se(),z=""),M++}}function xn(x,_){return x.scope&&typeof x.scope=="string"&&q.openNode(le.classNameAliases[x.scope]||x.scope),x.beginScope&&(x.beginScope._wrap?(ce(z,le.classNameAliases[x.beginScope._wrap]||x.beginScope._wrap),z=""):x.beginScope._multi&&(yn(x.beginScope,_),z="")),R=Object.create(x,{parent:{value:R}}),R}function Sn(x,_,M){let D=Z(x.endRe,M);if(D){if(x["on:end"]){const K=new e(x);x["on:end"](_,K),K.isMatchIgnored&&(D=!1)}if(D){for(;x.endsParent&&x.parent;)x=x.parent;return x}}if(x.endsWithParent)return Sn(x.parent,_,M)}function ss(x){return R.matcher.regexIndex===0?(z+=x[0],1):(Lt=!0,0)}function is(x){const _=x[0],M=x.rule,D=new e(M),K=[M.__beforeBegin,M["on:begin"]];for(const pe of K)if(pe&&(pe(x,D),D.isMatchIgnored))return ss(_);return M.skip?z+=_:(M.excludeBegin&&(z+=_),Y(),!M.returnBegin&&!M.excludeBegin&&(z=_)),xn(M,x),M.returnBegin?0:_.length}function os(x){const _=x[0],M=E.substring(x.index),D=Sn(R,x,M);if(!D)return pn;const K=R;R.endScope&&R.endScope._wrap?(Y(),ce(_,R.endScope._wrap)):R.endScope&&R.endScope._multi?(Y(),yn(R.endScope,x)):K.skip?z+=_:(K.returnEnd||K.excludeEnd||(z+=_),Y(),K.excludeEnd&&(z=_));do R.scope&&q.closeNode(),!R.skip&&!R.subLanguage&&(rt+=R.relevance),R=R.parent;while(R!==D.parent);return D.starts&&xn(D.starts,x),K.returnEnd?0:_.length}function as(){const x=[];for(let _=R;_!==le;_=_.parent)_.scope&&x.unshift(_.scope);x.forEach(_=>q.openNode(_))}let nt={};function wn(x,_){const M=_&&_[0];if(z+=x,M==null)return Y(),0;if(nt.type==="begin"&&_.type==="end"&&nt.index===_.index&&M===""){if(z+=E.slice(_.index,_.index+1),!F){const D=new Error(`0 width match regex (${m})`);throw D.languageName=m,D.badRule=nt.rule,D}return 1}if(nt=_,_.type==="begin")return is(_);if(_.type==="illegal"&&!I){const D=new Error('Illegal lexeme "'+M+'" for mode "'+(R.scope||"<unnamed>")+'"');throw D.mode=R,D}else if(_.type==="end"){const D=os(_);if(D!==pn)return D}if(_.type==="illegal"&&M==="")return z+=`
`,1;if(It>1e5&&It>_.index*3)throw new Error("potential infinite loop, way more iterations than matches");return z+=M,M.length}const le=xe(m);if(!le)throw _e(U.replace("{}",m)),new Error('Unknown language: "'+m+'"');const cs=Ur(le);let Ot="",R=P||cs;const kn={},q=new w.__emitter(w);as();let z="",rt=0,Ee=0,It=0,Lt=!1;try{if(le.__emitTokens)le.__emitTokens(E,q);else{for(R.matcher.considerAll();;){It++,Lt?Lt=!1:R.matcher.considerAll(),R.matcher.lastIndex=Ee;const x=R.matcher.exec(E);if(!x)break;const _=E.substring(Ee,x.index),M=wn(_,x);Ee=x.index+M}wn(E.substring(Ee))}return q.finalize(),Ot=q.toHTML(),{language:m,value:Ot,relevance:rt,illegal:!1,_emitter:q,_top:R}}catch(x){if(x.message&&x.message.includes("Illegal"))return{language:m,value:At(E),illegal:!0,relevance:0,_illegalBy:{message:x.message,index:Ee,context:E.slice(Ee-100,Ee+100),mode:x.mode,resultSoFar:Ot},_emitter:q};if(F)return{language:m,value:At(E),illegal:!1,relevance:0,errorRaised:x,_emitter:q,_top:R};throw x}}function Ct(m){const E={value:At(m),illegal:!1,relevance:0,_top:k,_emitter:new w.__emitter(w)};return E._emitter.addText(m),E}function Mt(m,E){E=E||w.languages||Object.keys(f);const I=Ct(m),P=E.filter(xe).filter(bn).map(Y=>He(Y,m,!1));P.unshift(I);const G=P.sort((Y,ce)=>{if(Y.relevance!==ce.relevance)return ce.relevance-Y.relevance;if(Y.language&&ce.language){if(xe(Y.language).supersetOf===ce.language)return 1;if(xe(ce.language).supersetOf===Y.language)return-1}return 0}),[te,Se]=G,tt=te;return tt.secondBest=Se,tt}function qr(m,E,I){const P=E&&y[E]||I;m.classList.add("hljs"),m.classList.add(`language-${P}`)}function $t(m){let E=null;const I=j(m);if(T(I))return;if(et("before:highlightElement",{el:m,language:I}),m.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",m);return}if(m.children.length>0&&(w.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(m)),w.throwUnescapedHTML))throw new jr("One of your code blocks includes unescaped HTML.",m.innerHTML);E=m;const P=E.textContent,G=I?X(P,{language:I,ignoreIllegals:!0}):Mt(P);m.innerHTML=G.value,m.dataset.highlighted="yes",qr(m,I,G.language),m.result={language:G.language,re:G.relevance,relevance:G.relevance},G.secondBest&&(m.secondBest={language:G.secondBest.language,relevance:G.secondBest.relevance}),et("after:highlightElement",{el:m,result:G,text:P})}function Zr(m){w=hn(w,m)}const Kr=()=>{Qe(),Ae("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Jr(){Qe(),Ae("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let gn=!1;function Qe(){function m(){Qe()}if(document.readyState==="loading"){gn||window.addEventListener("DOMContentLoaded",m,!1),gn=!0;return}document.querySelectorAll(w.cssSelector).forEach($t)}function Yr(m,E){let I=null;try{I=E(c)}catch(P){if(_e("Language definition for '{}' could not be registered.".replace("{}",m)),F)_e(P);else throw P;I=k}I.name||(I.name=m),f[m]=I,I.rawDefinition=E.bind(null,c),I.aliases&&mn(I.aliases,{languageName:m})}function Vr(m){delete f[m];for(const E of Object.keys(y))y[E]===m&&delete y[E]}function Qr(){return Object.keys(f)}function xe(m){return m=(m||"").toLowerCase(),f[m]||f[y[m]]}function mn(m,{languageName:E}){typeof m=="string"&&(m=[m]),m.forEach(I=>{y[I.toLowerCase()]=E})}function bn(m){const E=xe(m);return E&&!E.disableAutodetect}function es(m){m["before:highlightBlock"]&&!m["before:highlightElement"]&&(m["before:highlightElement"]=E=>{m["before:highlightBlock"](Object.assign({block:E.el},E))}),m["after:highlightBlock"]&&!m["after:highlightElement"]&&(m["after:highlightElement"]=E=>{m["after:highlightBlock"](Object.assign({block:E.el},E))})}function ts(m){es(m),N.push(m)}function ns(m){const E=N.indexOf(m);E!==-1&&N.splice(E,1)}function et(m,E){const I=m;N.forEach(function(P){P[I]&&P[I](E)})}function rs(m){return Ae("10.7.0","highlightBlock will be removed entirely in v12.0"),Ae("10.7.0","Please use highlightElement now."),$t(m)}Object.assign(c,{highlight:X,highlightAuto:Mt,highlightAll:Qe,highlightElement:$t,highlightBlock:rs,configure:Zr,initHighlighting:Kr,initHighlightingOnLoad:Jr,registerLanguage:Yr,unregisterLanguage:Vr,listLanguages:Qr,getLanguage:xe,registerAliases:mn,autoDetection:bn,inherit:hn,addPlugin:ts,removePlugin:ns}),c.debugMode=function(){F=!1},c.safeMode=function(){F=!0},c.versionString=Gr,c.regex={concat:S,lookahead:p,either:$,optional:g,anyNumberOfTimes:b};for(const m in Ye)typeof Ye[m]=="object"&&t(Ye[m]);return Object.assign(c,Ye),c},Ce=fn({});return Ce.newInstance=()=>fn({}),Bt=Ce,Ce.HighlightJS=Ce,Ce.default=Ce,Bt}var Li=Ii();const Le=Oi(Li);function Di(t){const e=t.regex,n={},r={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:e.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},r]});const s={className:"subst",begin:/\$\(/,end:/\)/,contains:[t.BACKSLASH_ESCAPE]},i=t.inherit(t.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),o={begin:/<<-?\s*(?=\w+)/,starts:{contains:[t.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},a={className:"string",begin:/"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,n,s]};s.contains.push(a);const u={match:/\\"/},l={className:"string",begin:/'/,end:/'/},h={match:/\\'/},d={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},t.NUMBER_MODE,n]},p=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],b=t.SHEBANG({binary:`(${p.join("|")})`,relevance:10}),g={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[t.inherit(t.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},S=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],v=["true","false"],$={match:/(\/[a-z._-]+)+/},B=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],Z=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],he=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],Q=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:S,literal:v,built_in:[...B,...Z,"set","shopt",...he,...Q]},contains:[b,t.SHEBANG(),g,d,i,o,$,a,u,l,h,n]}}const xt="[A-Za-z$_][0-9A-Za-z$_]*",lr=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],ur=["true","false","null","undefined","NaN","Infinity"],dr=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],hr=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],pr=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],fr=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],gr=[].concat(pr,dr,hr);function Hi(t){const e=t.regex,n=(W,{after:ye})=>{const ke="</"+W[0].slice(1);return W.input.indexOf(ke,ye)!==-1},r=xt,s={begin:"<>",end:"</>"},i=/<[A-Za-z0-9\\._:-]+\s*\/>/,o={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(W,ye)=>{const ke=W[0].length+W.index,Re=W.input[ke];if(Re==="<"||Re===","){ye.ignoreMatch();return}Re===">"&&(n(W,{after:ke})||ye.ignoreMatch());let De;const Je=W.input.substring(ke);if(De=Je.match(/^\s*=/)){ye.ignoreMatch();return}if((De=Je.match(/^\s+extends\s+/))&&De.index===0){ye.ignoreMatch();return}}},a={$pattern:xt,keyword:lr,literal:ur,built_in:gr,"variable.language":fr},u="[0-9](_?[0-9])*",l=`\\.(${u})`,h="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",d={className:"number",variants:[{begin:`(\\b(${h})((${l})|\\.)?|(${l}))[eE][+-]?(${u})\\b`},{begin:`\\b(${h})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},p={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},b={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,p],subLanguage:"xml"}},g={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,p],subLanguage:"css"}},S={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,p],subLanguage:"graphql"}},v={className:"string",begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,p]},B={className:"comment",variants:[t.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]},Z=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,b,g,S,v,{match:/\$\d+/},d];p.contains=Z.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(Z)});const he=[].concat(B,p.contains),Q=he.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(he)}]),ee={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:Q},ae={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,e.concat(r,"(",e.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},Ne={relevance:0,match:e.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...dr,...hr]}},We={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},qe={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[ee],illegal:/%/},Ze={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function vt(W){return e.concat("(?!",W.join("|"),")")}const Tt={match:e.concat(/\b/,vt([...pr,"super","import"].map(W=>`${W}\\s*\\(`)),r,e.lookahead(/\s*\(/)),className:"title.function",relevance:0},we={begin:e.concat(/\./,e.lookahead(e.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},Nt={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},ee]},Ke="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",Rt={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,e.lookahead(Ke)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[ee]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:Q,CLASS_REFERENCE:Ne},illegal:/#(?![$_A-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",relevance:5}),We,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,b,g,S,v,B,{match:/\$\d+/},d,Ne,{scope:"attr",match:r+e.lookahead(":"),relevance:0},Rt,{begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[B,t.REGEXP_MODE,{className:"function",begin:Ke,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:Q}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:s.begin,end:s.end},{match:i},{begin:o.begin,"on:begin":o.isTrulyOpeningTag,end:o.end}],subLanguage:"xml",contains:[{begin:o.begin,end:o.end,skip:!0,contains:["self"]}]}]},qe,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[ee,t.inherit(t.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},we,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[ee]},Tt,Ze,ae,Nt,{match:/\$[(.]/}]}}function Bi(t){const e=t.regex,n=Hi(t),r=xt,s=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],i={begin:[/namespace/,/\s+/,t.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},o={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:s},contains:[n.exports.CLASS_REFERENCE]},a={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},u=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],l={$pattern:xt,keyword:lr.concat(u),literal:ur,built_in:gr.concat(s),"variable.language":fr},h={className:"meta",begin:"@"+r},d=(S,v,$)=>{const B=S.contains.findIndex(Z=>Z.label===v);if(B===-1)throw new Error("can not find mode to replace");S.contains.splice(B,1,$)};Object.assign(n.keywords,l),n.exports.PARAMS_CONTAINS.push(h);const p=n.contains.find(S=>S.scope==="attr"),b=Object.assign({},p,{match:e.concat(r,e.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,p,b]),n.contains=n.contains.concat([h,i,o,b]),d(n,"shebang",t.SHEBANG()),d(n,"use_strict",a);const g=n.contains.find(S=>S.label==="func.def");return g.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}function Pi(t){const e=t.regex,n=e.concat(/[\p{L}_]/u,e.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,s={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},i={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},o=t.inherit(i,{begin:/\(/,end:/\)/}),a=t.inherit(t.APOS_STRING_MODE,{className:"string"}),u=t.inherit(t.QUOTE_STRING_MODE,{className:"string"}),l={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[s]},{begin:/'/,end:/'/,contains:[s]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[i,u,a,o,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[i,o,u,a]}]}]},t.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},s,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[u]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[l],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[l],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:e.concat(/</,e.lookahead(e.concat(n,e.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:l}]},{className:"tag",begin:e.concat(/<\//,e.lookahead(e.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}function zi(t){const e={className:"attr",begin:/"(\\.|[^\\"\r\n])*"(?=\s*:)/,relevance:1.01},n={match:/[{}[\],:]/,className:"punctuation",relevance:0},r=["true","false","null"],s={scope:"literal",beginKeywords:r.join(" ")};return{name:"JSON",aliases:["jsonc"],keywords:{literal:r},contains:[e,n,t.QUOTE_STRING_MODE,s,t.C_NUMBER_MODE,t.C_LINE_COMMENT_MODE,t.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}const Fi=O('<div class="p-2 w-full flex flex-auto gap-4 flex-col"><!--hfx:dyn:0:0--><!--hfx:dyn:0:1--><!--hfx:dyn:0:2--></div>'),Ui=O('<div id="article_editor"><!--hfx:dyn:1:0--><!--hfx:dyn:1:1--></div>'),Xi=O('<div id="edit_buttons" class="p-2 flex gap-2"><span>Formatting:</span><!--hfx:dyn:2:0--></div>'),Gi=O('<button class="p-2 rounded-md bg-zinc-800 border-2 border-zinc-950 font-bold text-white hover:bg-zinc-700" title="Bold selected text"><strong>B</strong></button>'),ji=O('<div class="border-2 rounded-md p-2 bg-white text-black"><!--hfx:dyn:4:0--></div>'),Wi=O('<div class=""><!--hfx:dyn:5:0--></div>'),qi=O('<article contenteditable="true"><p>Edit me! Select some text and click the <strong>B</strong> button to make it bold.</p></article>'),Zi=O('<div><p class="text-xl font-semibold">Preview:</p><!--hfx:dyn:7:0--></div>'),Ki=O('<div class="p-2 border-2 bg-white text-black"><!--hfx:dyn:8:0--></div>'),Ji=O("<div></div>"),Yi=O('<div class="p-2 bg-purple-950 rounded-md"><p class="text-xl font-semibold">JSON:</p><!--hfx:dyn:10:0--></div>'),Vi=O('<div class="bg-black/20 p-2 border-2 border-gray-500 rounded-md"><!--hfx:dyn:11:0--></div>'),Qi=O('<output class="" name="json_output"><!--hfx:dyn:12:0--></output>'),eo=O('<pre class="overflow-x-scroll"><!--hfx:dyn:13:0--></pre>'),[mr,to]=Ue("todo"),no=de(()=>{const t=mr();if(typeof t=="string"||!t)return'<p class="border rounded-md p-2">Start editing to get a preview!</p>';const e=Kn(t);return e instanceof Text?'<p class="border rounded-md p-2">Start editing to get a preview!</p>':(console.log("Preview HTML:",e.outerHTML),br(e),e.outerHTML)}),Pt="editor_content";function ro(){const t=r=>{r.preventDefault();const s=document.getSelection();if(!s||s.rangeCount===0)return;const i=s.getRangeAt(0);if(i.collapsed)return;const o=document.createElement("strong");try{i.surroundContents(o),s.removeAllRanges(),e()}catch{try{const u=i.extractContents();o.appendChild(u),i.insertNode(o),s.removeAllRanges(),e()}catch(u){console.warn("Could not apply bold formatting:",u)}}},e=()=>{const r=document.getElementById(Pt);r&&to(Zn(r))},n=r=>{e()};return(()=>{const r=Fi.cloneNode(!0),s=C(r,"hfx:dyn:0:0"),i=C(r,"hfx:dyn:0:1"),o=C(r,"hfx:dyn:0:2");return s&&A(s.parentNode,(()=>{const a=Ui.cloneNode(!0),u=C(a,"hfx:dyn:1:0"),l=C(a,"hfx:dyn:1:1");return u&&A(u.parentNode,(()=>{const h=Xi.cloneNode(!0),d=C(h,"hfx:dyn:2:0");return d&&A(d.parentNode,(()=>{const p=Gi.cloneNode(!0);return ft(p,"mousedown",t),p})(),d),h})(),u),l&&A(l.parentNode,(()=>{const h=ji.cloneNode(!0),d=C(h,"hfx:dyn:4:0");return d&&A(d.parentNode,(()=>{const p=Wi.cloneNode(!0);be(p,"id",Pt);const b=C(p,"hfx:dyn:5:0");return b&&A(b.parentNode,(()=>{const g=qi.cloneNode(!0);return ft(g,"input",n),g})(),b),p})(),d),h})(),l),a})(),s),i&&A(i.parentNode,(()=>{const a=Zi.cloneNode(!0),u=C(a,"hfx:dyn:7:0");return u&&A(u.parentNode,(()=>{const l=Ki.cloneNode(!0),h=C(l,"hfx:dyn:8:0");return h&&A(h.parentNode,(()=>{const d=Ji.cloneNode(!0);return be(d,"innerHTML",no),d})(),h),l})(),u),a})(),i),o&&A(o.parentNode,(()=>{const a=Yi.cloneNode(!0),u=C(a,"hfx:dyn:10:0");return u&&A(u.parentNode,(()=>{const l=Vi.cloneNode(!0),h=C(l,"hfx:dyn:11:0");return h&&A(h.parentNode,(()=>{const d=Qi.cloneNode(!0);be(d,"for",Pt);const p=C(d,"hfx:dyn:12:0");return p&&A(p.parentNode,(()=>{const b=eo.cloneNode(!0),g=C(b,"hfx:dyn:13:0");return g&&A(g.parentNode,()=>JSON.stringify(mr(),null,"  "),g),b})(),p),d})(),h),l})(),u),a})(),o),r})()}function br(t){t.removeAttribute("contenteditable");for(const e of t.children)br(e)}const so=`import {
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
}`,io=/^\[([^\]]+)\]$/;function oo(t){const e=[];let n=!1,r;const s=t.split("/").filter(Boolean);for(const i of s){if(i.startsWith("...[")&&(i.endsWith("]")||i.endsWith("]?"))){const a=i.endsWith("]?"),u=a?i.slice(4,-2):i.slice(4,-1);e.push({type:"catchAll",name:u,optional:a}),n=!0,r=u;continue}const o=io.exec(i);if(o){const a=o[1];e.push({type:"paramArray",name:a});continue}if(i.startsWith(":")&&i.endsWith("?")){const a=i.slice(1,-1);e.push({type:"param",name:a,optional:!0});continue}if(i.startsWith(":")){const a=i.slice(1);e.push({type:"param",name:a,optional:!1});continue}e.push({type:"static",value:i})}return{segments:e,hasCatchAll:n,catchAllParam:r}}function yr(t){const e=t.indexOf("?");if(e===-1)return{};const n=t.slice(e+1),r={},s=n.split("&");for(const i of s){const o=i.split("="),a=decodeURIComponent(o[0]||""),u=decodeURIComponent(o.slice(1).join("="));if(a in r){const l=r[a];Array.isArray(l)?l.push(u):r[a]=[l,u]}else r[a]=u}return r}function In(t){const e=t.indexOf("#"),n=e>=0?t.slice(0,e):t,r=n.indexOf("?");if(r<0)return{path:n||"/",search:{},raw:t};const s=n.slice(0,r),i=n.slice(r);return{path:s||"/",search:yr(i),raw:t}}function xr(t,e){return{path:t,view:e.view,_parsed:oo(t),_paramsValidator:e.params,_searchValidator:e.search}}function Ln(t,e,n){const r=t._parsed.hasCatchAll?co(e,t.path):Sr(e,t.path);return!r||!r.match?{route:t,params:{},search:{},matchedPath:"/",error:{type:"params",message:"Route not matched"}}:{route:t,params:r.params,search:n,matchedPath:r.matchedPath}}function ao(t,e,n){for(const s of t){const i=Ln(s,e,n);if(i&&!i.error)return i}const r=t[t.length-1];return r?Ln(r,e,n):{route:void 0,params:{},search:{},matchedPath:"/",error:{type:"params",message:"No routes defined"}}}function Sr(t,e){if(t.includes("//"))return null;const n=t.split("/").filter(Boolean),r=e.split("/").filter(Boolean);if(r.length===0)return n.length===0?{match:!0,params:{},matchedPath:"/"}:null;let s=0;for(const a of r)a.endsWith("?")||s++;if(n.length<s)return null;const i={};for(let a=0;a<r.length;a++){const u=r[a],l=n[a];if(!u.startsWith(":")){if(u!==l)return null;continue}if(u.startsWith(":")){const h=u.slice(1).replace("?",""),d=u.endsWith("?");if(l!==void 0)i[h]=l;else if(d)i[h]=void 0;else return null}}const o=Math.min(n.length,r.length);return{match:!0,params:i,matchedPath:o===0?"/":"/"+n.slice(0,o).join("/")}}function co(t,e){if(t.includes("//"))return null;const n=e.indexOf("...[");if(n===-1)return Sr(t,e);const s=e.slice(0,n).split("/").filter(Boolean),i=t.split("/").filter(Boolean);if(i.length<s.length)return null;for(let b=0;b<s.length;b++){const g=s[b],S=i[b];if(g.startsWith(":"))s[b]=S;else if(g!==S)return null}const o=e.indexOf("]",n),a=e.slice(n+4,o),u=e.slice(o+1)==="?",l=i.slice(s.length),h=l.join("/"),d={};d[a]=h||(u?void 0:"");const p=e.split("/").filter(Boolean);for(let b=0;b<s.length;b++){const g=p[b];if(g&&g.startsWith(":")){const S=g.slice(1).replace("?","");d[S]=i[b]}}return{match:!0,params:d,matchedPath:"/"+i.slice(0,s.length+l.length).join("/")}}const lo=O("<a><!--hfx:dyn:0:0--></a>"),uo=O(`<div>
            Route Error: <!--hfx:dyn:1:0--></div>`);function Dn(){return typeof window<"u"}function ho(t){const[e,n]=Ue("/"),[r,s]=Ue({}),i=de(()=>{const l=e(),h=r(),d=ao(t,l,h);if(!d||d.error)return d;const p=d.route;let b=d.params,g=d.search,S;const v=p._paramsValidator;if(v)try{b=v(d.params)}catch(B){S={type:"params",message:B instanceof Error?B.message:"Invalid params",details:B}}const $=p._searchValidator;if($)try{g=$(d.search)}catch(B){S=S||{type:"search",message:B instanceof Error?B.message:"Invalid search params",details:B}}return S?{...d,error:S,params:b,search:g}:{...d,params:b,search:g}}),o=(l,h)=>{const d=h?.replace??!1,p=h?.scroll??!0,{path:b,search:g}=In(l);n(b),s(g),Dn()&&(d?window.history.replaceState({},"",l):window.history.pushState({},"",l),window.dispatchEvent(new CustomEvent("hfx:navigate")),p&&window.scrollTo(0,0))},a=function(h){const d=de(()=>{const v=h.to.path.match(/:(\w+)/g)||[],$=h.to.path.match(/\[(\w+)\]/g)||[];return[...v,...$]}),p=de(()=>{let v=h.to.path;for(const $ of d()){const B=$.replace(/[:\[\]]/g,""),Z=h.params?.[B];Array.isArray(Z)?v=v.replace($,Z.join("/")):Z!==void 0&&(v=v.replace($,String(Z)))}return v}),b=de(()=>Object.entries(h.search??{}).filter(([,v])=>v!=null)),g=de(()=>b().map(([v,$])=>`${v}=${$}`).join("&")),S=de(()=>g()?`${p()}?${g()}`:p());return(()=>{const v=lo.cloneNode(!0);be(v,"href",S),be(v,"class",h.class),ft(v,"click",B=>{B.preventDefault(),o(S())});const $=C(v,"hfx:dyn:0:0");return $&&(A($.parentNode,h.children,$),$.remove()),v})()};function u(l){let h=!1;V(()=>{if(!h){if(h=!0,l.initialPath){const{path:p,search:b}=In(l.initialPath);n(p),s(b);return}l.initialSearch&&s(l.initialSearch)}}),V(()=>{if(Dn()){const p=()=>{const b=window.location.pathname,g=window.location.search;n(b),s(yr(g))};return window.addEventListener("popstate",p),window.addEventListener("hfx:navigate",p),()=>{window.removeEventListener("hfx:navigate",p),window.removeEventListener("popstate",p)}}}),V(()=>{l.onRouteChange&&l.onRouteChange(i())});const d=()=>{const p=i();if(!p)return l.notFound?st(()=>l.notFound({path:e()})):null;const b=p.error;if(b){const S=l.onRouteError;return st(S?()=>S(b):()=>(()=>{const v=uo.cloneNode(!0);be(v,"style",()=>({color:"red",padding:"20px"}));const $=C(v,"hfx:dyn:1:0");return $&&(A($.parentNode,b.message,$),$.remove()),v})())}const g=p.route.view;return g?st(()=>g({params:p.params,search:p.search})):null};return typeof document>"u"?d():Es(d,"hfx:router")}return{Router:u,Link:a,currentPath:e,currentSearch:r,currentMatch:i,navigate:o,routes:t}}const po=O('<div class="flex flex-auto"><!--hfx:dyn:0:0--><!--hfx:dyn:0:1--></div>'),fo=O('<article class="p-4 flex flex-col overflow-auto mx-auto w-full max-w-4xl"><!--hfx:dyn:1:0--></article>'),go=O('<div class="markdown-body" />'),mo=O('<div class="grow flex flex-col"><!--hfx:dyn:3:0--><div class="p-2 bg-red-950 text-white mt-4 mx-auto"><p class="text-xl">This is a work in progress!</p><p class="text-xl">The docs are not finished yet!</p></div></div>'),bo=O('<article class="p-4 mx-auto w-full max-w-4xl"><!--hfx:dyn:4:0--></article>'),yo=O('<div class="markdown-body-main" />'),xo=O('<pre class="mx-auto max-w-[70vw]! max-h-[50vw]"><!--hfx:dyn:6:0--></pre>'),So=O('<code class="language-tsx"><!--hfx:dyn:7:0--></code>'),wo=O('<div class="flex flex-col p-4 max-w-[80vw] mx-auto"><!--hfx:dyn:8:0--><!--hfx:dyn:8:1--></div>'),ko=O('<div class="p-2"><!--hfx:dyn:9:0--><!--hfx:dyn:9:1--></div>'),_o=O(`<p class="mx-auto">
          This is the code used to create the editor.
          <!--hfx:dyn:10:0--></p>`),Eo=O(`<span class="text-purple-500/80"><!--hfx:dyn:11:0-->(The editor is far from done but it is still cool IMO.)
          </span>`),vo=O('<div class="w-full"><!--hfx:dyn:12:0--></div>'),To=O(`<div class="flex flex-auto flex-col min-h-screen"><!--hfx:dyn:13:0--><!--hfx:dyn:13:1--><footer class="bg-slate-900 mx-auto w-full min-h-12 p-4 text-center mt-auto"><a href="https://github.com/ArnoudK/hyperfx" target="_blank" class="underline">
          Github
        </a></footer></div>`),No=O(`<main class="flex flex-auto flex-col" id="main-content"><p class="p-2 bg-red-800 text-white text-center w-full! max-w-full!">
          A LOT OF CHANGES. DOCS ARE NOT UP TO DATE.
        </p><!--hfx:dyn:14:0--></main>`),Ro=O("<div><!--hfx:dyn:15:0--></div>");Le.registerLanguage("typescript",Bi);Le.registerLanguage("html",Pi);Le.registerLanguage("bash",Di);Le.registerLanguage("json",zi);const Ao=cr($i);function Hn(t){document.title=t}function Bn(t){const e=document.querySelector('meta[name="description"]');e&&e.setAttribute("content",t)}const St=xr("/hyperfx",{view:Mo}),wr=xr("/hyperfx/editor",{view:$o}),Oe=ho([St,wr]),Co=Oe.Router,lt=Oe.Link;function Mo(t){const e=de(()=>{const r=Oe.currentSearch().document||"main";console.log("docname:",r);const s=Jn.find(i=>i.route_name==r);return s?(Hn(`${s.title} | HyperFX`),Bn(`HyperFX docs about ${s.title}.`)):(Hn("HyperFX"),Bn("HyperFX docs")),s}),n=de(()=>{const r=e();if(r){const s=cr(r.data);return console.log(s.slice(0,100)),s}return""});return V(()=>{Oe.currentPath(),setTimeout(()=>{const r=document.querySelectorAll("pre code");for(const s of r)Le.highlightElement(s)},1)}),(()=>{const r=document.createDocumentFragment();return A(r,[re(se(Nn,ie({when:()=>n,children:()=>(()=>{const s=po.cloneNode(!0),i=C(s,"hfx:dyn:0:0"),o=C(s,"hfx:dyn:0:1");return i&&A(i.parentNode,re(se(Ks,ie({}))),i),o&&A(o.parentNode,(()=>{const a=fo.cloneNode(!0),u=C(a,"hfx:dyn:1:0");return u&&A(u.parentNode,(()=>{const l=go.cloneNode(!0);return be(l,"innerHTML",n),l})(),u),a})(),o),s})()}))),re(se(Nn,ie({when:()=>e()===void 0||e().route_name==="main",children:()=>(()=>{const s=mo.cloneNode(!0),i=C(s,"hfx:dyn:3:0");return i&&A(i.parentNode,(()=>{const o=bo.cloneNode(!0),a=C(o,"hfx:dyn:4:0");return a&&A(a.parentNode,(()=>{const u=yo.cloneNode(!0);return be(u,"innerHTML",Ao),u})(),a),o})(),i),s})()})))]),r})()}function $o(){const t=ro(),e=(()=>{const n=xo.cloneNode(!0),r=C(n,"hfx:dyn:6:0");return r&&A(r.parentNode,(()=>{const s=So.cloneNode(!0),i=C(s,"hfx:dyn:7:0");return i&&A(i.parentNode,so,i),s})(),r),n})();return V(()=>{setTimeout(()=>{const n=document.querySelector("pre code");n&&n.attributes.getNamedItem("data-highlighted")?.value!="yes"&&Le.highlightElement(n)},0)}),(()=>{const n=wo.cloneNode(!0),r=C(n,"hfx:dyn:8:0"),s=C(n,"hfx:dyn:8:1");return r&&A(r.parentNode,(()=>{const i=ko.cloneNode(!0),o=C(i,"hfx:dyn:9:0"),a=C(i,"hfx:dyn:9:1");return o&&A(o.parentNode,(()=>{const u=_o.cloneNode(!0),l=C(u,"hfx:dyn:10:0");return l&&A(l.parentNode,(()=>{const h=Eo.cloneNode(!0),d=C(h,"hfx:dyn:11:0");return d&&(A(d.parentNode," ",d),d.remove()),h})(),l),u})(),o),a&&A(a.parentNode,(()=>{const u=vo.cloneNode(!0),l=C(u,"hfx:dyn:12:0");return l&&A(l.parentNode,e,l),u})(),a),i})(),r),s&&A(s.parentNode,t,s),n})()}function Oo(){const t=Oe.navigate,e=Oe.currentPath;return V(()=>{e()==="/"&&t("/hyperfx")}),(()=>{const n=To.cloneNode(!0),r=C(n,"hfx:dyn:13:0"),s=C(n,"hfx:dyn:13:1");return r&&A(r.parentNode,re(se(js,ie({}))),r),s&&A(s.parentNode,(()=>{const i=No.cloneNode(!0),o=C(i,"hfx:dyn:14:0");return o&&A(o.parentNode,(()=>{const a=Ro.cloneNode(!0),u=C(a,"hfx:dyn:15:0");return u&&A(u.parentNode,re(se(Co,ie({}))),u),a})(),o),i})(),s),n})()}function Io(){return re(se(Oo,ie({})))}const Lo=document.getElementById("app");As(Io,void 0,Lo,{mode:"replace"});
