var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/elem/elem.ts
function Div(attributes, ...children) {
  const res = document.createElement("div");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
var t = (t2) => document.createTextNode(t2);
var RenderToBody = (el) => document.body.appendChild(el);

// src/pages/navigate.ts
function navigateTo(href) {
  history.pushState({}, "", href);
  window.dispatchEvent(new Event("popstate"));
}

// src/elem/text.ts
function Span(attributes, text) {
  const res = document.createElement("span");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  res.appendChild(t(text));
  return res;
}
function P(attributes, ...children) {
  const res = document.createElement("p");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Abbr(attributes, ...children) {
  const res = document.createElement("abbr");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function A(attributes, ...children) {
  const res = document.createElement("a");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  if (attributes.href[0] == "/") {
    res.addEventListener("click", (ev) => {
      navigateTo(ev.target.href);
      ev.preventDefault();
      return false;
    });
  }
  return res;
}
function B(attributes, ...children) {
  const res = document.createElement("b");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Bdi(attributes, ...children) {
  const res = document.createElement("bdi");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Bdo(attributes, ...children) {
  const res = document.createElement("bdo");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function I(attributes, ...children) {
  const res = document.createElement("bdo");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Cite(attributes, ...children) {
  const res = document.createElement("bdo");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}

// src/elem/headings.ts
function Head(t2, attributes, ...children) {
  const res = document.createElement(t2);
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
var H1 = (attributes, ...children) => Head("h1", attributes, ...children);
var H2 = (attributes, ...children) => Head("h2", attributes, ...children);
var H3 = (attributes, ...children) => Head("h3", attributes, ...children);
var H4 = (attributes, ...children) => Head("h4", attributes, ...children);
var H5 = (attributes, ...children) => Head("h5", attributes, ...children);
var H6 = (attributes, ...children) => Head("h6", attributes, ...children);

// src/elem/style.ts
function Br(attributes) {
  const res = document.createElement("br");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  return res;
}
function Hr(attributes) {
  const res = document.createElement("hr");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  return res;
}

// src/elem/img.ts
function Img(attrs) {
  const img = document.createElement("img");
  const attributes = Object.keys(attrs);
  for (const attr of attributes) {
    img.setAttribute(attr, attrs[attr]);
  }
  return img;
}

// src/elem/input.ts
function Input(attrs) {
  const input = document.createElement("input");
  const attributes = Object.keys(attrs);
  for (const attr of attributes) {
    input.setAttribute(attr, attrs[attr]);
  }
  return input;
}
function Label(attrs, ...children) {
  const label = document.createElement("label");
  const attributes = Object.keys(attrs);
  for (const attr of attributes) {
    label.setAttribute(attr, attrs[attr]);
  }
  for (const c of children) {
    label.appendChild(c);
  }
  return label;
}

// src/elem/head.ts
function Title(title) {
  document.title = title;
}

// src/elem/semantic.ts
function Address(attributes, ...children) {
  const res = document.createElement("address");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Nav(attributes, ...children) {
  const res = document.createElement("nav");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Article(attributes, ...children) {
  const res = document.createElement("article");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Aside(attributes, ...children) {
  const res = document.createElement("aside");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Main(attributes, ...children) {
  const res = document.createElement("main");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}
function Button(attributes, ...children) {
}
function Footer(attributes, ...children) {
  const res = document.createElement("footer");
  const attrs = Object.keys(attributes);
  for (const attr of attrs) {
    res.setAttribute(attr, attributes[attr]);
  }
  for (const child of children) {
    res.appendChild(child);
  }
  return res;
}

// src/reactive/morphing.ts
var EMPTY_SET = /* @__PURE__ */ new Set();
var defaults = {
  morphStyle: "outerHTML",
  callbacks: {
    beforeNodeAdded: noOp,
    afterNodeAdded: noOp,
    beforeNodeMorphed: noOp,
    afterNodeMorphed: noOp,
    beforeNodeRemoved: noOp,
    afterNodeRemoved: noOp,
    beforeAttributeUpdated: noOp
  },
  head: {
    style: "merge",
    shouldPreserve: function(elt) {
      return elt.getAttribute("im-preserve") === "true";
    },
    shouldReAppend: function(elt) {
      return elt.getAttribute("im-re-append") === "true";
    },
    shouldRemove: noOp,
    afterHeadMorphed: noOp
  }
};
function morph(oldNode, newContent, config = {}) {
  if (oldNode instanceof Document) {
    oldNode = oldNode.documentElement;
  }
  if (typeof newContent === "string") {
    newContent = parseContent(newContent);
  }
  let normalizedContent = normalizeContent(newContent);
  let ctx = createMorphContext(oldNode, normalizedContent, config);
  return morphNormalizedContent(oldNode, normalizedContent, ctx);
}
function morphNormalizedContent(oldNode, normalizedNewContent, ctx) {
  if (ctx.head.block) {
    let oldHead = oldNode.querySelector("head");
    let newHead = normalizedNewContent.querySelector("head");
    if (oldHead && newHead) {
      let promises = handleHeadElement(newHead, oldHead, ctx);
      Promise.all(promises).then(function() {
        morphNormalizedContent(
          oldNode,
          normalizedNewContent,
          Object.assign(ctx, {
            head: {
              block: false,
              ignore: true
            }
          })
        );
      });
      return;
    }
  }
  if (ctx.morphStyle === "innerHTML") {
    morphChildren(normalizedNewContent, oldNode, ctx);
    return oldNode.children;
  } else if (ctx.morphStyle === "outerHTML" || ctx.morphStyle == null) {
    let bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);
    let previousSibling = bestMatch == null ? void 0 : bestMatch.previousSibling;
    let nextSibling = bestMatch == null ? void 0 : bestMatch.nextSibling;
    let morphedNode = morphOldNodeTo(oldNode, bestMatch, ctx);
    if (bestMatch) {
      return insertSiblings(previousSibling, morphedNode, nextSibling);
    } else {
      return [];
    }
  } else {
    throw "Do not understand how to morph style " + ctx.morphStyle;
  }
}
function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
  return ctx.ignoreActiveValue && possibleActiveElement === document.activeElement && possibleActiveElement !== document.body;
}
function morphOldNodeTo(oldNode, newContent, ctx) {
  if (ctx.ignoreActive && oldNode === document.activeElement) {
  } else if (newContent == null) {
    if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
    oldNode.remove();
    ctx.callbacks.afterNodeRemoved(oldNode);
    return null;
  } else if (!isSoftMatch(oldNode, newContent)) {
    if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
    if (ctx.callbacks.beforeNodeAdded(newContent) === false) return oldNode;
    oldNode.parentElement.replaceChild(newContent, oldNode);
    ctx.callbacks.afterNodeAdded(newContent);
    ctx.callbacks.afterNodeRemoved(oldNode);
    return newContent;
  } else {
    if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false)
      return oldNode;
    if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) {
    } else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
      handleHeadElement(newContent, oldNode, ctx);
    } else {
      syncNodeFrom(newContent, oldNode, ctx);
      if (!ignoreValueOfActiveElement(oldNode, ctx)) {
        morphChildren(newContent, oldNode, ctx);
      }
    }
    ctx.callbacks.afterNodeMorphed(oldNode, newContent);
    return oldNode;
  }
}
function morphChildren(newParent, oldParent, ctx) {
  let nextNewChild = newParent.firstChild;
  let insertionPoint = oldParent.firstChild;
  let newChild;
  while (nextNewChild) {
    newChild = nextNewChild;
    nextNewChild = newChild.nextSibling;
    if (insertionPoint == null) {
      if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;
      oldParent.appendChild(newChild);
      ctx.callbacks.afterNodeAdded(newChild);
      removeIdsFromConsideration(ctx, newChild);
      continue;
    }
    if (isIdSetMatch(newChild, insertionPoint, ctx)) {
      morphOldNodeTo(insertionPoint, newChild, ctx);
      insertionPoint = insertionPoint.nextSibling;
      removeIdsFromConsideration(ctx, newChild);
      continue;
    }
    let idSetMatch = findIdSetMatch(
      newParent,
      oldParent,
      newChild,
      insertionPoint,
      ctx
    );
    if (idSetMatch) {
      insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
      morphOldNodeTo(idSetMatch, newChild, ctx);
      removeIdsFromConsideration(ctx, newChild);
      continue;
    }
    let softMatch = findSoftMatch(
      newParent,
      oldParent,
      newChild,
      insertionPoint,
      ctx
    );
    if (softMatch) {
      insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
      morphOldNodeTo(softMatch, newChild, ctx);
      removeIdsFromConsideration(ctx, newChild);
      continue;
    }
    if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;
    oldParent.insertBefore(newChild, insertionPoint);
    ctx.callbacks.afterNodeAdded(newChild);
    removeIdsFromConsideration(ctx, newChild);
  }
  while (insertionPoint !== null) {
    let tempNode = insertionPoint;
    insertionPoint = insertionPoint.nextSibling;
    removeNode(tempNode, ctx);
  }
}
function ignoreAttribute(attr, to, updateType, ctx) {
  if (attr === "value" && ctx.ignoreActiveValue && to === document.activeElement) {
    return true;
  }
  return ctx.callbacks.beforeAttributeUpdated(attr, to, updateType) === false;
}
function syncNodeFrom(from, to, ctx) {
  let type = from.nodeType;
  if (type === 1) {
    const fromAttributes = from.attributes;
    const toAttributes = to.attributes;
    for (const fromAttribute of fromAttributes) {
      if (ignoreAttribute(fromAttribute.name, to, "update", ctx)) {
        continue;
      }
      if (to.getAttribute(fromAttribute.name) !== fromAttribute.value) {
        to.setAttribute(fromAttribute.name, fromAttribute.value);
      }
    }
    for (let i = toAttributes.length - 1; 0 <= i; i--) {
      const toAttribute = toAttributes[i];
      if (ignoreAttribute(toAttribute.name, to, "remove", ctx)) {
        continue;
      }
      if (!from.hasAttribute(toAttribute.name)) {
        to.removeAttribute(toAttribute.name);
      }
    }
  }
  if (type === 8 || type === 3) {
    if (to.nodeValue !== from.nodeValue) {
      to.nodeValue = from.nodeValue;
    }
  }
  if (!ignoreValueOfActiveElement(to, ctx)) {
    syncInputValue(from, to, ctx);
  }
}
function syncBooleanAttribute(from, to, attributeName, ctx) {
  if (from[attributeName] !== to[attributeName]) {
    let ignoreUpdate = ignoreAttribute(attributeName, to, "update", ctx);
    if (!ignoreUpdate) {
      to[attributeName] = from[attributeName];
    }
    if (from[attributeName]) {
      if (!ignoreUpdate) {
        to.setAttribute(attributeName, from[attributeName]);
      }
    } else {
      if (!ignoreAttribute(attributeName, to, "remove", ctx)) {
        to.removeAttribute(attributeName);
      }
    }
  }
}
function syncInputValue(from, to, ctx) {
  if (from instanceof HTMLInputElement && to instanceof HTMLInputElement && from.type !== "file") {
    let fromValue = from.value;
    let toValue = to.value;
    syncBooleanAttribute(from, to, "checked", ctx);
    syncBooleanAttribute(from, to, "disabled", ctx);
    if (!from.hasAttribute("value")) {
      if (!ignoreAttribute("value", to, "remove", ctx)) {
        to.value = "";
        to.removeAttribute("value");
      }
    } else if (fromValue !== toValue) {
      if (!ignoreAttribute("value", to, "update", ctx)) {
        to.setAttribute("value", fromValue);
        to.value = fromValue;
      }
    }
  } else if (from instanceof HTMLOptionElement) {
    syncBooleanAttribute(from, to, "selected", ctx);
  } else if (from instanceof HTMLTextAreaElement && to instanceof HTMLTextAreaElement) {
    let fromValue = from.value;
    let toValue = to.value;
    if (ignoreAttribute("value", to, "update", ctx)) {
      return;
    }
    if (fromValue !== toValue) {
      to.value = fromValue;
    }
    if (to.firstChild && to.firstChild.nodeValue !== fromValue) {
      to.firstChild.nodeValue = fromValue;
    }
  }
}
function handleHeadElement(newHeadTag, currentHead, ctx) {
  let added = [];
  let removed = [];
  let preserved = [];
  let nodesToAppend = [];
  let headMergeStyle = ctx.head.style;
  let srcToNewHeadNodes = /* @__PURE__ */ new Map();
  for (const newHeadChild of newHeadTag.children) {
    srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
  }
  for (const currentHeadElt of currentHead.children) {
    let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
    let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
    let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
    if (inNewContent || isPreserved) {
      if (isReAppended) {
        removed.push(currentHeadElt);
      } else {
        srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
        preserved.push(currentHeadElt);
      }
    } else {
      if (headMergeStyle === "append") {
        if (isReAppended) {
          removed.push(currentHeadElt);
          nodesToAppend.push(currentHeadElt);
        }
      } else {
        if (ctx.head.shouldRemove(currentHeadElt) !== false) {
          removed.push(currentHeadElt);
        }
      }
    }
  }
  nodesToAppend.push(...srcToNewHeadNodes.values());
  log("to append: ", nodesToAppend);
  let promises = [];
  for (const newNode of nodesToAppend) {
    log("adding: ", newNode);
    let newElt = document.createRange().createContextualFragment(newNode.outerHTML).firstChild;
    log(newElt);
    if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
      if (newElt.href || newElt.src) {
        let resolve = null;
        let promise = new Promise(function(_resolve) {
          resolve = _resolve;
        });
        newElt.addEventListener("load", function() {
          resolve();
        });
        promises.push(promise);
      }
      currentHead.appendChild(newElt);
      ctx.callbacks.afterNodeAdded(newElt);
      added.push(newElt);
    }
  }
  for (const removedElement of removed) {
    if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
      currentHead.removeChild(removedElement);
      ctx.callbacks.afterNodeRemoved(removedElement);
    }
  }
  ctx.head.afterHeadMorphed(currentHead, {
    added,
    kept: preserved,
    removed
  });
  return promises;
}
function log() {
}
function noOp() {
}
function mergeDefaults(config) {
  let finalConfig = {};
  Object.assign(finalConfig, defaults);
  Object.assign(finalConfig, config);
  finalConfig.callbacks = {};
  Object.assign(finalConfig.callbacks, defaults.callbacks);
  Object.assign(finalConfig.callbacks, config.callbacks);
  finalConfig.head = {};
  Object.assign(finalConfig.head, defaults.head);
  Object.assign(finalConfig.head, config.head);
  return finalConfig;
}
function createMorphContext(oldNode, newContent, config) {
  config = mergeDefaults(config);
  return {
    target: oldNode,
    newContent,
    config,
    morphStyle: config.morphStyle,
    ignoreActive: config.ignoreActive,
    ignoreActiveValue: config.ignoreActiveValue,
    idMap: createIdMap(oldNode, newContent),
    deadIds: /* @__PURE__ */ new Set(),
    callbacks: config.callbacks,
    head: config.head
  };
}
function isIdSetMatch(node1, node2, ctx) {
  if (node1 == null || node2 == null) {
    return false;
  }
  if (node1.nodeType === node2.nodeType && node1.tagName === node2.tagName) {
    if (node1.id !== "" && node1.id === node2.id) {
      return true;
    } else {
      return getIdIntersectionCount(ctx, node1, node2) > 0;
    }
  }
  return false;
}
function isSoftMatch(node1, node2) {
  if (node1 == null || node2 == null) {
    return false;
  }
  return node1.nodeType === node2.nodeType && node1.tagName === node2.tagName;
}
function removeNodesBetween(startInclusive, endExclusive, ctx) {
  while (startInclusive !== endExclusive) {
    let tempNode = startInclusive;
    startInclusive = startInclusive.nextSibling;
    removeNode(tempNode, ctx);
  }
  removeIdsFromConsideration(ctx, endExclusive);
  return endExclusive.nextSibling;
}
function findIdSetMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
  let newChildPotentialIdCount = getIdIntersectionCount(
    ctx,
    newChild,
    oldParent
  );
  let potentialMatch = null;
  if (newChildPotentialIdCount > 0) {
    let potentialMatch2 = insertionPoint;
    let otherMatchCount = 0;
    while (potentialMatch2 != null) {
      if (isIdSetMatch(newChild, potentialMatch2, ctx)) {
        return potentialMatch2;
      }
      otherMatchCount += getIdIntersectionCount(
        ctx,
        potentialMatch2,
        newContent
      );
      if (otherMatchCount > newChildPotentialIdCount) {
        return null;
      }
      potentialMatch2 = potentialMatch2.nextSibling;
    }
  }
  return potentialMatch;
}
function findSoftMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
  let potentialSoftMatch = insertionPoint;
  let nextSibling = newChild.nextSibling;
  let siblingSoftMatchCount = 0;
  while (potentialSoftMatch != null) {
    if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
      return null;
    }
    if (isSoftMatch(newChild, potentialSoftMatch)) {
      return potentialSoftMatch;
    }
    if (isSoftMatch(nextSibling, potentialSoftMatch)) {
      siblingSoftMatchCount++;
      nextSibling = nextSibling.nextSibling;
      if (siblingSoftMatchCount >= 2) {
        return null;
      }
    }
    potentialSoftMatch = potentialSoftMatch.nextSibling;
  }
  return potentialSoftMatch;
}
function parseContent(newContent) {
  let parser = new DOMParser();
  let contentWithSvgsRemoved = newContent.replace(
    /<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,
    ""
  );
  if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
    let content = parser.parseFromString(newContent, "text/html");
    if (contentWithSvgsRemoved.match(/<\/html>/)) {
      content.generatedByIdiomorph = true;
      return content;
    } else {
      let htmlElement = content.firstChild;
      if (htmlElement) {
        htmlElement.generatedByIdiomorph = true;
        return htmlElement;
      } else {
        return null;
      }
    }
  } else {
    let responseDoc = parser.parseFromString(
      "<body><template>" + newContent + "</template></body>",
      "text/html"
    );
    let content = responseDoc.body.querySelector("template").content;
    content.generatedByIdiomorph = true;
    return content;
  }
}
function normalizeContent(newContent) {
  if (newContent == null) {
    const dummyParent = document.createElement("div");
    return dummyParent;
  } else if (newContent.generatedByIdiomorph) {
    return newContent;
  } else if (newContent instanceof Node) {
    const dummyParent = document.createElement("div");
    dummyParent.append(newContent);
    return dummyParent;
  } else {
    const dummyParent = document.createElement("div");
    for (const elt of [...newContent]) {
      dummyParent.append(elt);
    }
    return dummyParent;
  }
}
function insertSiblings(previousSibling, morphedNode, nextSibling) {
  let stack = [];
  let added = [];
  while (previousSibling != null) {
    stack.push(previousSibling);
    previousSibling = previousSibling.previousSibling;
  }
  while (stack.length > 0) {
    let node = stack.pop();
    added.push(node);
    morphedNode.parentElement.insertBefore(node, morphedNode);
  }
  added.push(morphedNode);
  while (nextSibling != null) {
    stack.push(nextSibling);
    added.push(nextSibling);
    nextSibling = nextSibling.nextSibling;
  }
  while (stack.length > 0) {
    morphedNode.parentElement.insertBefore(
      stack.pop(),
      morphedNode.nextSibling
    );
  }
  return added;
}
function findBestNodeMatch(newContent, oldNode, ctx) {
  let currentElement;
  currentElement = newContent.firstChild;
  let bestElement = currentElement;
  let score = 0;
  while (currentElement) {
    let newScore = scoreElement(currentElement, oldNode, ctx);
    if (newScore > score) {
      bestElement = currentElement;
      score = newScore;
    }
    currentElement = currentElement.nextSibling;
  }
  return bestElement;
}
function scoreElement(node1, node2, ctx) {
  if (isSoftMatch(node1, node2)) {
    return 0.5 + getIdIntersectionCount(ctx, node1, node2);
  }
  return 0;
}
function removeNode(tempNode, ctx) {
  removeIdsFromConsideration(ctx, tempNode);
  if (ctx.callbacks.beforeNodeRemoved(tempNode) === false) return;
  tempNode.remove();
  ctx.callbacks.afterNodeRemoved(tempNode);
}
function isIdInConsideration(ctx, id) {
  return !ctx.deadIds.has(id);
}
function idIsWithinNode(ctx, id, targetNode) {
  let idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
  return idSet.has(id);
}
function removeIdsFromConsideration(ctx, node) {
  let idSet = ctx.idMap.get(node) || EMPTY_SET;
  for (const id of idSet) {
    ctx.deadIds.add(id);
  }
}
function getIdIntersectionCount(ctx, node1, node2) {
  let sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
  let matchCount = 0;
  for (const id of sourceSet) {
    if (isIdInConsideration(ctx, id) && idIsWithinNode(ctx, id, node2)) {
      ++matchCount;
    }
  }
  return matchCount;
}
function populateIdMapForNode(node, idMap) {
  let nodeParent = node.parentElement;
  let idElements = node.querySelectorAll("[id]");
  for (const elt of idElements) {
    let current = elt;
    while (current !== nodeParent && current != null) {
      let idSet = idMap.get(current);
      if (idSet == null) {
        idSet = /* @__PURE__ */ new Set();
        idMap.set(current, idSet);
      }
      idSet.add(elt.id);
      current = current.parentElement;
    }
  }
}
function createIdMap(oldContent, newContent) {
  let idMap = /* @__PURE__ */ new Map();
  populateIdMapForNode(oldContent, idMap);
  populateIdMapForNode(newContent, idMap);
  return idMap;
}

// src/reactive/component.ts
var Comp = class {
  constructor(parent, data, render) {
    this.childComps = [];
    this.changed = true;
    this.render = render;
    this.data = data;
    this.parent = parent;
    this.currentRender = this.render(data, this);
  }
  getParent() {
    return this.parent;
  }
  /**
   * Usefull when updating before the component needs to be rendered!
   */
  UpdateNoRender(data) {
    this.data = data;
    this.changed = true;
  }
  Update(newData) {
    this.data = newData;
    this.changed = true;
    this.Render();
  }
  /** Get a (shallow) copy of the array of children */
  getChildren() {
    return [...this.childComps];
  }
  /** Returns the child */
  addChild(c) {
    if (c == this) {
      throw Error("Can't add yourself as a child!?");
    }
    this.childComps.push(c);
  }
  removeChild(c) {
    this.childComps = this.childComps.filter((ch) => c != ch);
  }
  Render(force = false) {
    if (!(this.changed || force)) {
      return this.currentRender;
    }
    const newR = this.render(this.data, this);
    for (const c of this.childComps) {
      c.Render(force);
    }
    morph(this.currentRender, newR, {});
    this.changed = false;
    return this.currentRender;
  }
};
var rc = void 0;
function RootComponent() {
  if (rc) return rc;
  rc = new RootComp();
  return rc;
}
var RootComp = class extends Comp {
  constructor() {
    super(void 0, void 0, () => {
      return document.body;
    });
    this.parent = this;
  }
};
function Component(parent, data, render) {
  const comp = new Comp(parent, data, render);
  return comp;
}
var PageComp = class extends Comp {
  removeAllChildren() {
    this.childComps = [];
  }
  OnPageLoad() {
    this.onPageLoad(this.data, this);
  }
  constructor(parent, data, render, onPageLoad) {
    super(parent, data, render);
    this.onPageLoad = onPageLoad;
  }
};
function PageComponent(parent, data, render, onPageLoad) {
  return new PageComp(parent, data, render, onPageLoad);
}

// src/reactive/event.ts
function WithEventListener(el, eventtype, listener) {
  el.addEventListener(eventtype, listener);
  return el;
}

// src/pages/register.ts
var PageRegister = class {
  /**
   * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
   * params can be added with [name] e.g.: '/mypage/[myparam]/info'
   */
  registerRoute(route, comp) {
    const routesplit = route.split("/");
    let resultStr = "";
    const params = [];
    const splitLen = routesplit.length;
    if (splitLen == 0 || route == "/") {
      resultStr = "/";
    } else {
      for (let i = 0; i < splitLen; i++) {
        const s = routesplit[i];
        if (!s || s.length == 0) {
          continue;
        }
        if (s[0] == "[" && s[s.length - 1] == "]") {
          const name = s.split("[")[1].split("]")[0];
          const nparam = {
            name,
            pos: i
          };
          params.push(nparam);
          resultStr += `/[A-Za-z1-9_\\-]+`;
          continue;
        }
        resultStr += `/${s}`;
      }
    }
    const routeI = {
      comp,
      params,
      path: route,
      route: new RegExp(resultStr)
    };
    if (this.routes.find((a) => a.route == routeI.route)) {
      throw new Error(
        `Route already exist '${route}'.
Regex: '${routeI.route.source}'
RouteData: ${JSON.stringify(routeI)}`
      );
    }
    this.routes.push(routeI);
    return this;
  }
  getParamValue(name) {
    if (this.currentRoute) {
      for (const p of this.currentRoute.params) {
        if (p.name == name) {
          return p.value;
        }
      }
    }
  }
  enable() {
    window.__$HFX__Register = this;
    window.addEventListener("popstate", onPageChange);
    onPageChange();
    return this;
  }
  constructor(anchor) {
    this.Anchor = anchor;
    this.routes = [];
  }
};
function RouteRegister(el) {
  return new PageRegister(el);
}
function onPageChange() {
  const reg = window.__$HFX__Register;
  reg.currentPage = void 0;
  if (reg.currentRoute) {
    reg.currentRoute.comp.removeAllChildren();
    for (const p of reg.currentRoute.params) {
      p.value = void 0;
    }
  }
  reg.currentRoute = void 0;
  const url = window.location.pathname;
  for (const r of reg.routes) {
    const match = url.match(r.route);
    reg.currentRoute = r;
    if (match && match[0].length >= url.length) {
      const splits = url.split("/");
      for (const p of r.params) {
        p.value = splits[p.pos];
      }
      r.comp.OnPageLoad();
      reg.Anchor.replaceChildren(r.comp.Render(true));
      reg.currentPage = r.comp;
      return;
    }
  }
  if (url.startsWith("/404") || url.startsWith("404")) {
    return;
  }
  navigateTo(`/404?page=${url}`);
}
function GetParamValue(name) {
  const reg = window.__$HFX__Register;
  if (reg) {
    return reg.getParamValue(name);
  }
  return void 0;
}

// src/fetcher.ts
var fetcher = {
  post
};
function post(url, body, headers, requestInit) {
  return __async(this, null, function* () {
    let res = { result: void 0, err: void 0 };
    if (!requestInit) requestInit = {};
    requestInit.method = "POST";
    if (body) {
      requestInit.body = body;
    }
    if (headers) {
      requestInit.headers = headers;
    }
    yield fetch(url, requestInit).then((val) => __async(this, null, function* () {
      if (val.ok && val.status >= 200 && val.status <= 299) {
        res.result = yield val.json();
      } else {
        res.err = {
          name: `Status: ${val.status} => ${val.statusText}`,
          cause: "Request did not succees!",
          status: val.status
        };
      }
    })).catch((e) => {
      res.err = e;
      res.err.status = 0;
    }).finally(() => {
    });
    return res;
  });
}

// src/index.ts
Object.defineProperty(HTMLElement.prototype, "WithEventListener$HFX", {
  value: function(eventtype, listener) {
    this.addEventListener(eventtype, listener);
    return this;
  }
});
Object.defineProperty(HTMLElement.prototype, "Modify$HFX", {
  value: function(modfn) {
    modfn(this);
    return this;
  }
});
export {
  A,
  Abbr,
  Address,
  Article,
  Aside,
  B,
  Bdi,
  Bdo,
  Br,
  Button,
  Cite,
  Component,
  Div,
  Footer,
  GetParamValue,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Hr,
  I,
  Img,
  Input,
  Label,
  Main,
  Nav,
  P,
  PageComponent,
  RenderToBody,
  RootComponent,
  RouteRegister,
  Span,
  Title,
  WithEventListener,
  fetcher,
  navigateTo,
  t
};
//# sourceMappingURL=index.mjs.map