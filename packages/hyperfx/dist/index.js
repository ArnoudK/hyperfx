'use strict';

const Div = (attributes, ...children) => createE("div", attributes, children);
/** Render text (the text content inside a tag): */
const t = (t) => document.createTextNode(t);
const RenderToBody = (el) => document.body.appendChild(el);
function addAttr(el, attributes) {
    const attrs = Object.keys(attributes);
    for (const attr of attrs) {
        el.setAttribute(attr, attributes[attr]);
    }
}
function createS(name, attributes) {
    const el = document.createElement(name);
    const attrs = Object.keys(attributes);
    for (const attr of attrs) {
        el.setAttribute(attr, attributes[attr]);
    }
    return el;
}
function createE(name, attributes, children) {
    const el = document.createElement(name);
    const attrs = Object.keys(attributes);
    for (const attr of attrs) {
        el.setAttribute(attr, attributes[attr]);
    }
    for (const c of children) {
        el.appendChild(c);
    }
    return el;
}

/**
 * Navigate to a url by pushing it and popstate this allows for soft navigation using HyperFX
 * The URL must be registered in the PageRegister!!!
 */
function navigateTo(href) {
    history.pushState({}, "", href);
    window.dispatchEvent(new Event("popstate"));
}

/**
    * this file is for Elements with phrasing content that should have text as children
    * Phrasing context:  https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
    But only the ones that are not just semantic divs
    */
function Span(attributes, text) {
    const res = document.createElement("span");
    addAttr(res, attributes);
    res.appendChild(t(text));
    return res;
}
const P = (attributes, ...children) => createE("p", attributes, children);
const Abbr = (attributes, ...children) => createE("abbr", attributes, children);
function A(attributes, ...children) {
    const res = createE("a", attributes, children);
    if (attributes.href[0] == "/") {
        res.addEventListener("click", (ev) => {
            navigateTo(ev.target.href);
            ev.preventDefault();
            return false;
        });
    }
    return res;
}
const B = (attributes, ...children) => createE("b", attributes, children);
const Bdi = (attributes, ...children) => createE("bdi", attributes, children);
const Bdo = (attributes, ...children) => createE("bdo", attributes, children);
const I = (attributes, ...children) => createE("i", attributes, children);
const Cite = (attributes, ...children) => createE("cite", attributes, children);

const Head = (t, attributes, ...children) => createE(t, attributes, children);
const H1 = (attributes, ...children) => Head("h1", attributes, ...children);
const H2 = (attributes, ...children) => Head("h2", attributes, ...children);
const H3 = (attributes, ...children) => Head("h3", attributes, ...children);
const H4 = (attributes, ...children) => Head("h4", attributes, ...children);
const H5 = (attributes, ...children) => Head("h5", attributes, ...children);
const H6 = (attributes, ...children) => Head("h6", attributes, ...children);

const Br = (attributes) => createS("br", attributes);
const Hr = (attributes) => createS("hr", attributes);

const Img = (attrs) => createS("img", attrs);

const Input = (attrs) => createS("input", attrs);
const Label = (attrs, ...children) => createE("label", attrs, children);

/* Elements that should be inside the head */
/**
 * Sets or updates the meta description in the head
 */
function MetaDescription(description) {
    const current = document.head.querySelector('meta[name="description"]');
    if (current) {
        current.setAttribute("content", description);
    }
    else {
        document.head.appendChild(createS("meta", { name: "description", content: description }));
    }
}
/**
 * Sets or updates the document title (this is a void function use it above the return in your render)
 */
function Title(title) {
    document.title = title;
}

const Table = (attributes, ...children) => createE("table", attributes, children);
const TableHead = (attributes, ...children) => createE("thead", attributes, children);
const Thead = TableHead;
const TableBody = (attributes, ...children) => createE("tbody", attributes, children);
const Tbody = TableBody;
const TableFoot = (attributes, ...children) => createE("tfoot", attributes, children);
const Tfoot = TableFoot;
const TableRow = (attributes, ...children) => createE("tr", attributes, children);
const Tr = TableRow;
const TableData = (attributes, ...children) => createE("td", attributes, children);
const Td = TableData;
const TableHeader = (attributes, ...children) => createE("th", attributes, children);
const Th = TableHeader;
/* Caption for tables */
const TableCaption = (attributes, ...children) => createE("caption", attributes, children);

const Address = (attributes, ...children) => createE("address", attributes, children);
const Nav = (attributes, ...children) => createE("nav", attributes, children);
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
const Article = (attributes, ...children) => createE("article", attributes, children);
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
const Aside = (attributes, ...children) => createE("aside", attributes, children);
const Main = (attributes, ...children) => createE("main", attributes, children);
const Button = (attributes, ...children) => createE("button", attributes, children);
const Footer = (attributes, ...children) => createE("footer", attributes, children);

/* TODO Strip all the unneccesary stuff out. And transform it into typescript
 *
 ******************FORKED FROM https://github.com/bigskysoftware/idiomorph *******************************************
 * BSD 2-Clause License
 *
 * Copyright (c) 2022, Big Sky Software
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
const EMPTY_SET = new Set();
// default configuration values, updatable by users now
const defaults = {
    morphStyle: "outerHTML",
    deadIds: new Set(),
    head: {
        block: false,
        ignore: false,
        style: "morph",
        shouldPreserve: (elt) => {
            return elt.getAttribute("im-preserve") === "true";
        },
        shouldReAppend: (elt) => {
            return elt.getAttribute("im-re-append") === "true";
        },
    },
};
//=============================================================================
// Core Morphing Algorithm - morph, morphNormalizedContent, morphOldNodeTo, morphChildren
//=============================================================================
function morph(oldNode, newContent, config = {}) {
    if (oldNode instanceof Document) {
        oldNode = oldNode.documentElement;
    }
    if (typeof newContent === "string") {
        newContent = parseContent(newContent);
    }
    const normalizedContent = normalizeContent(newContent);
    const ctx = createMorphContext(oldNode, normalizedContent, config);
    return morphNormalizedContent(oldNode, normalizedContent, ctx);
}
function morphNormalizedContent(oldNode, normalizedNewContent, ctx) {
    if (ctx.head.block) {
        const oldHead = oldNode.querySelector("head");
        const newHead = normalizedNewContent.querySelector("head");
        if (oldHead && newHead) {
            const promises = handleHeadElement(newHead, oldHead, ctx);
            // when head promises resolve, call morph again, ignoring the head tag
            Promise.all(promises).then(function () {
                morphNormalizedContent(oldNode, normalizedNewContent, Object.assign(ctx, {
                    head: {
                        block: false,
                        ignore: true,
                    },
                }));
            });
            return;
        }
    }
    if (ctx.morphStyle === "innerHTML") {
        // innerHTML, so we are only updating the children
        morphChildren(normalizedNewContent, oldNode, ctx);
        return oldNode.children;
    }
    else {
        // otherwise find the best element match in the new content, morph that, and merge its siblings
        // into either side of the best match
        const bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);
        // stash the siblings that will need to be inserted on either side of the best match
        const previousSibling = bestMatch === null || bestMatch === void 0 ? void 0 : bestMatch.previousSibling;
        const nextSibling = bestMatch === null || bestMatch === void 0 ? void 0 : bestMatch.nextSibling;
        // morph it
        const morphedNode = morphOldNodeTo(oldNode, bestMatch, ctx);
        if (bestMatch) {
            // if there was a best match, merge the siblings in too and return the
            // whole bunch
            return insertSiblings(previousSibling, morphedNode, nextSibling);
        }
        else {
            // otherwise nothing was added to the DOM
            return [];
        }
    }
}
function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
    return (ctx.ignoreActiveValue &&
        possibleActiveElement === document.activeElement &&
        possibleActiveElement !== document.body);
}
function morphOldNodeTo(oldNode, newContent, ctx) {
    if (ctx.ignoreActive && oldNode === document.activeElement) ;
    else if (newContent == null) {
        oldNode.remove();
        return null;
    }
    else if (!isSoftMatch(oldNode, newContent)) {
        oldNode.parentElement.replaceChild(newContent, oldNode);
        return newContent;
    }
    else {
        if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ;
        else if (oldNode instanceof HTMLHeadElement &&
            ctx.head.style !== "morph") {
            handleHeadElement(newContent, oldNode, ctx);
        }
        else {
            syncNodeFrom(newContent, oldNode, ctx);
            if (!ignoreValueOfActiveElement(oldNode, ctx)) {
                morphChildren(newContent, oldNode, ctx);
            }
        }
        return oldNode;
    }
}
/**
 * This is the core algorithm for matching up children.  The idea is to use id sets to try to match up
 * nodes as faithfully as possible.  We greedily match, which allows us to keep the algorithm fast, but
 * by using id sets, we are able to better match up with content deeper in the DOM.
 *
 * Basic algorithm is, for each node in the new content:
 *
 * - if we have reached the end of the old parent, append the new content
 * - if the new content has an id set match with the current insertion point, morph
 * - search for an id set match
 * - if id set match found, morph
 * - otherwise search for a "soft" match
 * - if a soft match is found, morph
 * - otherwise, prepend the new node before the current insertion point
 *
 * The two search algorithms terminate if competing node matches appear to outweigh what can be achieved
 * with the current node.  See findIdSetMatch() and findSoftMatch() for details.
 *
 */
function morphChildren(newParent, oldParent, ctx) {
    let nextNewChild = newParent.firstChild;
    let insertionPoint = oldParent.firstChild;
    let newChild;
    // run through all the new content
    while (nextNewChild) {
        newChild = nextNewChild;
        nextNewChild = newChild.nextSibling;
        // if we are at the end of the exiting parent's children, just append
        if (insertionPoint == null) {
            oldParent.appendChild(newChild);
            removeIdsFromConsideration(ctx, newChild);
            continue;
        }
        // if the current node has an id set match then morph
        if (isIdSetMatch(newChild, insertionPoint, ctx)) {
            morphOldNodeTo(insertionPoint, newChild, ctx);
            insertionPoint = insertionPoint.nextSibling;
            removeIdsFromConsideration(ctx, newChild);
            continue;
        }
        // otherwise search forward in the existing old children for an id set match
        let idSetMatch = findIdSetMatch(newParent, oldParent, newChild, insertionPoint, ctx);
        // if we found a potential match, remove the nodes until that point and morph
        if (idSetMatch) {
            insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
            morphOldNodeTo(idSetMatch, newChild, ctx);
            removeIdsFromConsideration(ctx, newChild);
            continue;
        }
        // no id set match found, so scan forward for a soft match for the current node
        let softMatch = findSoftMatch(newParent, newChild, insertionPoint, ctx);
        // if we found a soft match for the current node, morph
        if (softMatch) {
            insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
            morphOldNodeTo(softMatch, newChild, ctx);
            removeIdsFromConsideration(ctx, newChild);
            continue;
        }
        // abandon all hope of morphing, just insert the new child before the insertion point
        // and move on
        oldParent.insertBefore(newChild, insertionPoint);
        removeIdsFromConsideration(ctx, newChild);
    }
    // remove any remaining old nodes that didn't match up with new content
    while (insertionPoint !== null) {
        let tempNode = insertionPoint;
        insertionPoint = insertionPoint.nextSibling;
        removeNode(tempNode, ctx);
    }
}
//=============================================================================
// Attribute Syncing Code
//=============================================================================
function ignoreAttribute(attr, to, updateType, ctx) {
    if (attr === "value" &&
        ctx.ignoreActiveValue &&
        to === document.activeElement) {
        return true;
    }
    return false;
}
function syncNodeFrom(from, to, ctx) {
    const type = from.nodeType;
    // if is an element type, sync the attributes from the
    // new node into the new node
    if (type === 1 /* element type */) {
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
        // iterate backwards to avoid skipping over items when a delete occurs
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
    // sync text nodes
    if (type === 8 /* comment */ || type === 3 /* text */) {
        if (to.nodeValue !== from.nodeValue) {
            to.nodeValue = from.nodeValue;
        }
    }
    if (!ignoreValueOfActiveElement(to, ctx)) {
        // sync input values
        syncInputValue(from, to, ctx);
    }
}
function syncBooleanAttribute(from, to, attributeName, ctx) {
    if (from[attributeName] !== to[attributeName]) {
        const ignoreUpdate = ignoreAttribute(attributeName, to, "update", ctx);
        if (!ignoreUpdate) {
            to = from[attributeName];
        }
        if (from[attributeName]) {
            if (!ignoreUpdate) {
                to.setAttribute(attributeName, from[attributeName]);
            }
        }
        else {
            if (!ignoreAttribute(attributeName, to, "remove", ctx)) {
                to.removeAttribute(attributeName);
            }
        }
    }
}
function syncInputValue(from, to, ctx) {
    if (from instanceof HTMLInputElement &&
        to instanceof HTMLInputElement &&
        from.type !== "file") {
        const fromValue = from.value;
        const toValue = to.value;
        // sync boolean attributes
        syncBooleanAttribute(from, to, "checked", ctx);
        syncBooleanAttribute(from, to, "disabled", ctx);
        if (!from.hasAttribute("value")) {
            if (!ignoreAttribute("value", to, "remove", ctx)) {
                to.value = "";
                to.removeAttribute("value");
            }
        }
        else if (fromValue !== toValue) {
            if (!ignoreAttribute("value", to, "update", ctx)) {
                to.setAttribute("value", fromValue);
                to.value = fromValue;
            }
        }
    }
    else if (from instanceof HTMLOptionElement) {
        syncBooleanAttribute(from, to, "selected", ctx);
    }
    else if (from instanceof HTMLTextAreaElement &&
        to instanceof HTMLTextAreaElement) {
        const fromValue = from.value;
        const toValue = to.value;
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
//=============================================================================
// the HEAD tag can be handled specially, either w/ a 'merge' or 'append' style
//=============================================================================
function handleHeadElement(newHeadTag, currentHead, ctx) {
    const nodesToAppend = [];
    const headMergeStyle = ctx.head.style;
    // put all new head elements into a Map, by their outerHTML
    const srcToNewHeadNodes = new Map();
    for (const newHeadChild of newHeadTag.children) {
        srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
    }
    // for each elt in the current head
    for (const currentHeadElt of currentHead.children) {
        // If the current head element is in the map
        const inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
        const isReAppended = ctx.head.shouldReAppend(currentHeadElt);
        const isPreserved = ctx.head.shouldPreserve(currentHeadElt);
        if (inNewContent || isPreserved) {
            if (isReAppended) ;
            else {
                // this element already exists and should not be re-appended, so remove it from
                // the new content map, preserving it in the DOM
                srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
            }
        }
        else {
            if (headMergeStyle === "append") {
                // we are appending and this existing element is not new content
                // so if and only if it is marked for re-append do we do anything
                if (isReAppended) {
                    nodesToAppend.push(currentHeadElt);
                }
            }
        }
    }
    // Push the remaining new head elements in the Map into the
    // nodes to append to the head tag
    nodesToAppend.push(...srcToNewHeadNodes.values());
    for (const newNode of nodesToAppend) {
        document
            .createRange()
            .createContextualFragment(newNode.outerHTML).firstChild;
    }
    return [];
}
//=============================================================================
// Misc
//=============================================================================
/*
      Deep merges the config object and the Idiomoroph.defaults object to
      produce a final configuration object
     */
function mergeDefaults(config) {
    const finalConfig = {};
    // copy top level stuff into final config
    Object.assign(finalConfig, defaults);
    Object.assign(finalConfig, config);
    // copy head config into final config  (do this to deep merge the head)
    finalConfig.head = {};
    Object.assign(finalConfig.head, defaults.head);
    Object.assign(finalConfig.head, config.head);
    return finalConfig;
}
function createMorphContext(oldNode, newContent, config) {
    config = mergeDefaults(config);
    return {
        target: oldNode,
        newContent: newContent,
        config: config,
        morphStyle: config.morphStyle,
        ignoreActive: config.ignoreActive,
        ignoreActiveValue: config.ignoreActiveValue,
        idMap: createIdMap(oldNode, newContent),
        deadIds: new Set(),
        head: config.head,
    };
}
function isIdSetMatch(node1, node2, ctx) {
    if (node1 == null || node2 == null) {
        return false;
    }
    if (node1.nodeType === node2.nodeType && node1.tagName === node2.tagName) {
        if (node1.id !== "" && node1.id === node2.id) {
            return true;
        }
        else {
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
        const tempNode = startInclusive;
        startInclusive = startInclusive.nextSibling;
        removeNode(tempNode, ctx);
    }
    removeIdsFromConsideration(ctx, endExclusive);
    return endExclusive.nextSibling;
}
//=============================================================================
// Scans forward from the insertionPoint in the old parent looking for a potential id match
// for the newChild.  We stop if we find a potential id match for the new child OR
// if the number of potential id matches we are discarding is greater than the
// potential id matches for the new child
//=============================================================================
function findIdSetMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
    // max id matches we are willing to discard in our search
    const newChildPotentialIdCount = getIdIntersectionCount(ctx, newChild, oldParent);
    const potentialMatch = null;
    // only search forward if there is a possibility of an id match
    if (newChildPotentialIdCount > 0) {
        let potentialMatch = insertionPoint;
        // if there is a possibility of an id match, scan forward
        // keep track of the potential id match count we are discarding (the
        // newChildPotentialIdCount must be greater than this to make it likely
        // worth it)
        let otherMatchCount = 0;
        while (potentialMatch != null) {
            // If we have an id match, return the current potential match
            if (isIdSetMatch(newChild, potentialMatch, ctx)) {
                return potentialMatch;
            }
            // computer the other potential matches of this new content
            otherMatchCount += getIdIntersectionCount(ctx, potentialMatch, newContent);
            if (otherMatchCount > newChildPotentialIdCount) {
                // if we have more potential id matches in _other_ content, we
                // do not have a good candidate for an id match, so return null
                return null;
            }
            // advanced to the next old content child
            potentialMatch = potentialMatch.nextSibling;
        }
    }
    return potentialMatch;
}
//=============================================================================
// Scans forward from the insertionPoint in the old parent looking for a potential soft match
// for the newChild.  We stop if we find a potential soft match for the new child OR
// if we find a potential id match in the old parents children OR if we find two
// potential soft matches for the next two pieces of new content
//=============================================================================
function findSoftMatch(newContent, newChild, insertionPoint, ctx) {
    let potentialSoftMatch = insertionPoint;
    let nextSibling = newChild.nextSibling;
    let siblingSoftMatchCount = 0;
    while (potentialSoftMatch != null) {
        if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
            // the current potential soft match has a potential id set match with the remaining new
            // content so bail out of looking
            return null;
        }
        // if we have a soft match with the current node, return it
        if (isSoftMatch(newChild, potentialSoftMatch)) {
            return potentialSoftMatch;
        }
        if (isSoftMatch(nextSibling, potentialSoftMatch)) {
            // the next new node has a soft match with this node, so
            // increment the count of future soft matches
            siblingSoftMatchCount++;
            nextSibling = nextSibling.nextSibling;
            // If there are two future soft matches, bail to allow the siblings to soft match
            // so that we don't consume future soft matches for the sake of the current node
            if (siblingSoftMatchCount >= 2) {
                return null;
            }
        }
        // advanced to the next old content child
        potentialSoftMatch = potentialSoftMatch.nextSibling;
    }
    return potentialSoftMatch;
}
function parseContent(newContent) {
    const parser = new DOMParser();
    // remove svgs to avoid false-positive matches on head, etc.
    const contentWithSvgsRemoved = newContent.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim, "");
    // if the newContent contains a html, head or body tag, we can simply parse it w/o wrapping
    if (contentWithSvgsRemoved.match(/<\/html>/) ||
        contentWithSvgsRemoved.match(/<\/head>/) ||
        contentWithSvgsRemoved.match(/<\/body>/)) {
        const content = parser.parseFromString(newContent, "text/html");
        // if it is a full HTML document, return the document itself as the parent container
        if (contentWithSvgsRemoved.match(/<\/html>/)) {
            content.generatedByIdiomorph = true;
            return content;
        }
        else {
            // otherwise return the html element as the parent container
            const htmlElement = content.firstChild;
            if (htmlElement) {
                htmlElement.generatedByIdiomorph = true;
                return htmlElement;
            }
            else {
                return null;
            }
        }
    }
    else {
        // if it is partial HTML, wrap it in a template tag to provide a parent element and also to help
        // deal with touchy tags like tr, tbody, etc.
        const responseDoc = parser.parseFromString("<body><template>" + newContent + "</template></body>", "text/html");
        const content = responseDoc.body.querySelector("template").content;
        content.generatedByIdiomorph = true;
        return content;
    }
}
function normalizeContent(newContent) {
    if (newContent == null) {
        // noinspection UnnecessaryLocalVariableJS
        const dummyParent = document.createElement("div");
        return dummyParent;
    }
    else if (newContent.generatedByIdiomorph) {
        // the template tag created by idiomorph parsing can serve as a dummy parent
        return newContent;
    }
    else if (newContent instanceof Node) {
        // a single node is added as a child to a dummy parent
        const dummyParent = document.createElement("div");
        dummyParent.append(newContent);
        return dummyParent;
    }
    else {
        // all nodes in the array or HTMLElement collection are consolidated under
        // a single dummy parent element
        const dummyParent = document.createElement("div");
        for (const elt of [...newContent]) {
            dummyParent.append(elt);
        }
        return dummyParent;
    }
}
function insertSiblings(previousSibling, morphedNode, nextSibling) {
    const stack = [];
    const added = [];
    while (previousSibling != null) {
        stack.push(previousSibling);
        previousSibling = previousSibling.previousSibling;
    }
    while (stack.length > 0) {
        const node = stack.pop();
        added.push(node); // push added preceding siblings on in order and insert
        morphedNode.parentElement.insertBefore(node, morphedNode);
    }
    added.push(morphedNode);
    while (nextSibling != null) {
        stack.push(nextSibling);
        added.push(nextSibling); // here we are going in order, so push on as we scan, rather than add
        nextSibling = nextSibling.nextSibling;
    }
    while (stack.length > 0) {
        morphedNode.parentElement.insertBefore(stack.pop(), morphedNode.nextSibling);
    }
    return added;
}
function findBestNodeMatch(newContent, oldNode, ctx) {
    let currentElement;
    currentElement = newContent.firstChild;
    let bestElement = currentElement;
    let score = 0;
    while (currentElement) {
        const newScore = scoreElement(currentElement, oldNode, ctx);
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
    tempNode.remove();
}
//=============================================================================
// ID Set Functions
//=============================================================================
function isIdInConsideration(ctx, id) {
    return !ctx.deadIds.has(id);
}
function idIsWithinNode(ctx, id, targetNode) {
    const idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
    return idSet.has(id);
}
function removeIdsFromConsideration(ctx, node) {
    const idSet = ctx.idMap.get(node) || EMPTY_SET;
    for (const id of idSet) {
        // @ts-ignore
        ctx.deadIds.add(id);
    }
}
function getIdIntersectionCount(ctx, node1, node2) {
    const sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
    let matchCount = 0;
    for (const id of sourceSet) {
        // a potential match is an id in the source and potentialIdsSet, but
        // that has not already been merged into the DOM
        if (isIdInConsideration(ctx, id) && idIsWithinNode(ctx, id, node2)) {
            ++matchCount;
        }
    }
    return matchCount;
}
function populateIdMapForNode(node, idMap) {
    const nodeParent = node.parentElement;
    // find all elements with an id property
    const idElements = node.querySelectorAll("[id]");
    for (const elt of idElements) {
        let current = elt;
        // walk up the parent hierarchy of that element, adding the id
        // of element to the parent's id set
        while (current !== nodeParent && current != null) {
            let idSet = idMap.get(current);
            // if the id set doesn't exist, create it and insert it in the  map
            if (idSet == null) {
                idSet = new Set();
                idMap.set(current, idSet);
            }
            idSet.add(elt.id);
            current = current.parentElement;
        }
    }
}
function createIdMap(oldContent, newContent) {
    const idMap = new Map();
    populateIdMapForNode(oldContent, idMap);
    populateIdMapForNode(newContent, idMap);
    return idMap;
}
/// END OF MORPHING ////

class Comp {
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
        //@ts-ignore
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
    constructor(parent, data, render) {
        this.childComps = [];
        this.changed = true;
        this.render = render;
        this.data = data;
        this.parent = parent;
        this.currentRender = this.render(data, this);
    }
}
let rc = undefined;
function RootComponent() {
    if (rc)
        return rc;
    rc = new RootComp();
    return rc;
}
class RootComp extends Comp {
    constructor() {
        super(undefined, undefined, () => {
            // hacky method that works because the Root render does nothing and is equal the the previous render
            return document.body;
        });
        this.parent = this;
    }
}
/** A component can be used to Bind a Value to a Render */
function Component(parent, data, render) {
    const comp = new Comp(parent, data, render);
    return comp;
}
/**
 *
 * @param OnPageLoad Function is called when the route-path and matches the route this registered with in the 'pagehandler'. NOTE WHEN USING .Update ON COMPONENT IT WILL RENDER!!! (if you do so use no render)
 */
class PageComp extends Comp {
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
}
function PageComponent(parent, data, render, onPageLoad) {
    return new PageComp(parent, data, render, onPageLoad);
}

function WithEventListener(el, eventtype, listener) {
    el.addEventListener(eventtype, listener);
    return el;
}

class PageRegister {
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
        }
        else {
            for (let i = 0; i < splitLen; i++) {
                const s = routesplit[i];
                if (!s || s.length == 0) {
                    continue;
                }
                if (s[0] == "[" && s[s.length - 1] == "]") {
                    const name = s.split("[")[1].split("]")[0];
                    const nparam = {
                        name: name,
                        pos: i,
                    };
                    params.push(nparam);
                    resultStr += `\/[A-Za-z1-9_\\-]+`;
                    continue;
                }
                resultStr += "/" + s;
            }
        }
        const routeI = {
            comp: comp,
            params: params,
            path: route,
            route: new RegExp(resultStr),
        };
        if (this.routes.find((a) => a.route == routeI.route)) {
            throw new Error(`Route already exist '${route}'.\nRegex: '${routeI.route.source}'\nRouteData: ${JSON.stringify(routeI)}`);
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
        // TODO not populate the window space (with this prefix it should really matter)
        window.__$HFX__Register = this;
        window.addEventListener("popstate", onPageChange);
        onPageChange();
        return this;
    }
    constructor(anchor) {
        this.Anchor = anchor;
        this.routes = [];
        this.queryParams = new URLSearchParams(window.location.search);
    }
}
/**
 * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
 * params can be added with [name] e.g.: '/mypage/[myparam]/info'
 */
function RouteRegister(el) {
    return new PageRegister(el);
}
function onPageChange() {
    const reg = window.__$HFX__Register;
    // reset the current values
    reg.currentPage = undefined;
    if (reg.currentRoute) {
        reg.currentRoute.comp.removeAllChildren();
        for (const p of reg.currentRoute.params) {
            p.value = undefined;
        }
    }
    reg.currentRoute = undefined;
    reg.queryParams = new URLSearchParams(window.location.search);
    let url = window.location.pathname;
    // take care of trailing /
    if (url.length > 1 && url.at(-1) == "/") {
        url = url.slice(0, url.length - 1);
    }
    // load the current page
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
    // nothing found => 404 page
    if (url.startsWith("/404") || url.startsWith("404")) {
        return;
    }
    navigateTo(`/404?page=${url}`);
}
/* Get a param value from the current Route */
function GetParamValue(name) {
    const reg = window.__$HFX__Register;
    if (reg) {
        return reg.getParamValue(name);
    }
    return undefined;
}
/* Get a query param (?name=value) value from the current url */
function GetQueryValue(name) {
    const reg = window.__$HFX__Register;
    if (reg) {
        return reg.queryParams.get(name);
    }
    return null;
}
/* Get an array[] with all query params that match the name (?name=value&name=otherValue) from the current url*/
function GetQueryValues(name) {
    const reg = window.__$HFX__Register;
    if (reg) {
        return reg.queryParams.getAll(name);
    }
    return [];
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Fetch JSON
 */
const fetcher = {
    post,
    get,
};
/**
 *
 * @param url
 * @param headers
 * @param requestInit modify all the request init params. {method} will always be post. If {headers} is specified it will override the {requestInit})
 * @returns {result} is successful otherwise {{error}}
 */
function get(url, headers, requestInit) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!requestInit)
            requestInit = {};
        requestInit.method = "GET";
        if (headers) {
            requestInit.headers = headers;
        }
        try {
            const fetch_result = yield fetch(url, requestInit);
            if (fetch_result.ok &&
                fetch_result.status >= 200 &&
                fetch_result.status <= 299) {
                return {
                    succes: true,
                    err: undefined,
                    result: yield fetch_result.json(),
                };
            }
            else {
                return {
                    succes: false,
                    result: undefined,
                    err: {
                        name: `Status: ${fetch_result.status} => ${fetch_result.statusText}`,
                        cause: "Request did not succees!",
                        status: fetch_result.status,
                    },
                };
            }
        }
        catch (e) {
            const res = {
                err: e,
                succes: false,
                result: undefined,
            };
            res.err.status = 0;
            return res;
        }
    });
}
/**
 *
 * @param url
 * @param body
 * @param headers
 * @param requestInit modify all the request init params. {method} will always be post. If {body} or {headers} is specified it will override the {requestInit})
 * @returns {result} is successful otherwise {{error}}
 */
function post(url, body, headers, requestInit) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!requestInit)
            requestInit = {};
        requestInit.method = "POST";
        if (body) {
            requestInit.body = body;
        }
        if (headers) {
            requestInit.headers = headers;
        }
        try {
            const val = yield fetch(url, requestInit);
            if (val.ok && val.status >= 200 && val.status <= 299) {
                return {
                    succes: true,
                    err: undefined,
                    result: yield val.json(),
                };
            }
            else {
                return {
                    succes: false,
                    result: undefined,
                    err: {
                        name: `Status: ${val.status} => ${val.statusText}`,
                        cause: "Request did not succees!",
                        status: val.status,
                    },
                };
            }
        }
        catch (e) {
            const res = {
                err: e,
                succes: false,
                result: undefined,
            };
            res.err.status = 0;
            return res;
        }
    });
}

/* Extension methods */
Object.defineProperty(HTMLElement.prototype, "WithEvent$HFX", {
    value: function (eventtype, listener) {
        this.addEventListener(eventtype, listener);
        return this;
    },
});
Object.defineProperty(Object.prototype, "With$HFX", {
    value: function (func) {
        return func(this);
    },
});

exports.A = A;
exports.Abbr = Abbr;
exports.Address = Address;
exports.Article = Article;
exports.Aside = Aside;
exports.B = B;
exports.Bdi = Bdi;
exports.Bdo = Bdo;
exports.Br = Br;
exports.Button = Button;
exports.Cite = Cite;
exports.Component = Component;
exports.Div = Div;
exports.Footer = Footer;
exports.GetParamValue = GetParamValue;
exports.GetQueryValue = GetQueryValue;
exports.GetQueryValues = GetQueryValues;
exports.H1 = H1;
exports.H2 = H2;
exports.H3 = H3;
exports.H4 = H4;
exports.H5 = H5;
exports.H6 = H6;
exports.Hr = Hr;
exports.I = I;
exports.Img = Img;
exports.Input = Input;
exports.Label = Label;
exports.Main = Main;
exports.MetaDescription = MetaDescription;
exports.Nav = Nav;
exports.P = P;
exports.PageComponent = PageComponent;
exports.RenderToBody = RenderToBody;
exports.RootComponent = RootComponent;
exports.RouteRegister = RouteRegister;
exports.Span = Span;
exports.Table = Table;
exports.TableBody = TableBody;
exports.TableCaption = TableCaption;
exports.TableData = TableData;
exports.TableFoot = TableFoot;
exports.TableHead = TableHead;
exports.TableHeader = TableHeader;
exports.TableRow = TableRow;
exports.Tbody = Tbody;
exports.Td = Td;
exports.Tfoot = Tfoot;
exports.Th = Th;
exports.Thead = Thead;
exports.Title = Title;
exports.Tr = Tr;
exports.WithEventListener = WithEventListener;
exports.fetcher = fetcher;
exports.navigateTo = navigateTo;
exports.t = t;
//# sourceMappingURL=index.js.map
