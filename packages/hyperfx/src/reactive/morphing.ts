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

const EMPTY_SET: Set<string> = new Set();

// default configuration values, updatable by users now
const defaults = {
  morphStyle: "outerHTML" as "innerHTML" | "outerHTML",
  deadIds: new Set<string>(),
  head: {
    block: false as boolean,
    ignore: false as boolean,
    style: "morph" as "morph" | "append",
    shouldPreserve: (elt: Element) => {
      return elt.getAttribute("im-preserve") === "true";
    },
    shouldReAppend: (elt: Element) => {
      return elt.getAttribute("im-re-append") === "true";
    },
  },
} as const;

type contextType = typeof defaults & {
  newContent: MorphEl;
  ignoreActive: boolean;
  ignoreActiveValue: boolean;
  target: MorphEl | null;
  config: contextType;
  idMap: Map<MorphEl, Set<string>>;
};

type MorphNode = Node & { generatedByIdiomorph?: boolean };
type MorphEl = Element & { generatedByIdiomorph?: boolean };

//=============================================================================
// Core Morphing Algorithm - morph, morphNormalizedContent, morphOldNodeTo, morphChildren
//=============================================================================
export function morph(
  oldNode: MorphNode | MorphEl,
  newContent: MorphNode | MorphEl | string | null,
  config: Partial<contextType> = {},
) {
  if (oldNode instanceof Document) {
    oldNode = oldNode.documentElement;
  }

  if (typeof newContent === "string") {
    newContent = parseContent(newContent) as MorphEl;
  }

  const normalizedContent = normalizeContent(newContent);

  const ctx = createMorphContext(
    oldNode as MorphEl,
    normalizedContent as MorphEl,
    config as contextType,
  );

  return morphNormalizedContent(
    oldNode as any,
    normalizedContent as MorphEl,
    ctx,
  );
}

function morphNormalizedContent(
  oldNode: MorphEl,
  normalizedNewContent: MorphEl,
  ctx: contextType,
) {
  if (ctx.head.block) {
    const oldHead = oldNode.querySelector("head");
    const newHead = normalizedNewContent.querySelector("head");
    if (oldHead && newHead) {
      const promises = handleHeadElement(newHead, oldHead, ctx);
      // when head promises resolve, call morph again, ignoring the head tag
      Promise.all(promises).then(function () {
        morphNormalizedContent(
          oldNode,
          normalizedNewContent,
          Object.assign(ctx, {
            head: {
              block: false,
              ignore: true,
            },
          }),
        );
      });
      return;
    }
  }

  if (ctx.morphStyle === "innerHTML") {
    // innerHTML, so we are only updating the children
    morphChildren(normalizedNewContent, oldNode, ctx);
    return oldNode.children;
  } else {
    // otherwise find the best element match in the new content, morph that, and merge its siblings
    // into either side of the best match
    const bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);

    // stash the siblings that will need to be inserted on either side of the best match
    const previousSibling = bestMatch?.previousSibling;
    const nextSibling = bestMatch?.nextSibling;

    // morph it
    const morphedNode = morphOldNodeTo(oldNode, bestMatch as MorphEl, ctx);

    if (bestMatch) {
      // if there was a best match, merge the siblings in too and return the
      // whole bunch
      return insertSiblings(
        previousSibling as MorphEl,
        morphedNode as MorphEl,
        nextSibling as MorphEl,
      );
    } else {
      // otherwise nothing was added to the DOM
      return [];
    }
  }
}

function ignoreValueOfActiveElement(
  possibleActiveElement: MorphEl,
  ctx: contextType,
) {
  return (
    ctx.ignoreActiveValue &&
    possibleActiveElement === document.activeElement &&
    possibleActiveElement !== document.body
  );
}

function morphOldNodeTo(
  oldNode: MorphEl,
  newContent: MorphEl,
  ctx: contextType,
) {
  if (ctx.ignoreActive && oldNode === document.activeElement) {
    // don't morph focused element
  } else if (newContent == null) {
    oldNode.remove();

    return null;
  } else if (!isSoftMatch(oldNode, newContent)) {
    oldNode.parentElement!.replaceChild(newContent, oldNode);

    return newContent;
  } else {
    if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) {
      // ignore the head element
    } else if (
      oldNode instanceof HTMLHeadElement &&
      ctx.head.style !== "morph"
    ) {
      handleHeadElement(newContent, oldNode, ctx);
    } else {
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
function morphChildren(
  newParent: MorphEl,
  oldParent: MorphEl,
  ctx: contextType,
) {
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
      removeIdsFromConsideration(ctx, newChild as MorphEl);
      continue;
    }

    // if the current node has an id set match then morph
    if (isIdSetMatch(newChild as MorphEl, insertionPoint as MorphEl, ctx)) {
      morphOldNodeTo(insertionPoint as MorphEl, newChild as MorphEl, ctx);
      insertionPoint = insertionPoint.nextSibling;
      removeIdsFromConsideration(ctx, newChild as MorphEl);
      continue;
    }

    // otherwise search forward in the existing old children for an id set match
    let idSetMatch = findIdSetMatch(
      newParent,
      oldParent,
      newChild as MorphEl,
      insertionPoint as MorphEl,
      ctx,
    );

    // if we found a potential match, remove the nodes until that point and morph
    if (idSetMatch) {
      insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
      morphOldNodeTo(idSetMatch, newChild as MorphEl, ctx);
      removeIdsFromConsideration(ctx, newChild as MorphEl);
      continue;
    }

    // no id set match found, so scan forward for a soft match for the current node
    let softMatch = findSoftMatch(
      newParent,
      newChild as MorphEl,
      insertionPoint as MorphEl,
      ctx,
    );

    // if we found a soft match for the current node, morph
    if (softMatch) {
      insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
      morphOldNodeTo(softMatch, newChild as MorphEl, ctx);
      removeIdsFromConsideration(ctx, newChild as MorphEl);
      continue;
    }

    // abandon all hope of morphing, just insert the new child before the insertion point
    // and move on

    oldParent.insertBefore(newChild, insertionPoint);
    removeIdsFromConsideration(ctx, newChild as MorphEl);
  }

  // remove any remaining old nodes that didn't match up with new content
  while (insertionPoint !== null) {
    let tempNode = insertionPoint;
    insertionPoint = insertionPoint.nextSibling;
    removeNode(tempNode as MorphEl, ctx);
  }
}

//=============================================================================
// Attribute Syncing Code
//=============================================================================

function ignoreAttribute(
  attr: string,
  to: MorphEl,
  updateType: "update" | "remove",
  ctx: contextType,
) {
  if (
    attr === "value" &&
    ctx.ignoreActiveValue &&
    to === document.activeElement
  ) {
    return true;
  }
  return false;
}

function syncNodeFrom(from: MorphEl, to: MorphEl, ctx: contextType) {
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
      const toAttribute = toAttributes[i]!;
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

function syncBooleanAttribute(
  from: MorphEl,
  to: MorphEl,
  attributeName: string,
  ctx: contextType,
) {
  if ((from as any)[attributeName] !== (to as any)[attributeName]) {
    const ignoreUpdate = ignoreAttribute(attributeName, to, "update", ctx);
    if (!ignoreUpdate) {
      (to as any) = (from as any)[attributeName];
    }
    if ((from as any)[attributeName]) {
      if (!ignoreUpdate) {
        to.setAttribute(attributeName, (from as any)[attributeName]);
      }
    } else {
      if (!ignoreAttribute(attributeName, to, "remove", ctx)) {
        to.removeAttribute(attributeName);
      }
    }
  }
}

function syncInputValue(from: MorphEl, to: MorphEl, ctx: contextType) {
  if (
    from instanceof HTMLInputElement &&
    to instanceof HTMLInputElement &&
    from.type !== "file"
  ) {
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
    } else if (fromValue !== toValue) {
      if (!ignoreAttribute("value", to, "update", ctx)) {
        to.setAttribute("value", fromValue);
        to.value = fromValue;
      }
    }
  } else if (from instanceof HTMLOptionElement) {
    syncBooleanAttribute(from, to, "selected", ctx);
  } else if (
    from instanceof HTMLTextAreaElement &&
    to instanceof HTMLTextAreaElement
  ) {
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
function handleHeadElement(
  newHeadTag: MorphEl,
  currentHead: MorphEl,
  ctx: contextType,
) {
  const removed = [];
  const preserved = [];
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
      if (isReAppended) {
        // remove the current version and let the new version replace it and re-execute
        removed.push(currentHeadElt);
      } else {
        // this element already exists and should not be re-appended, so remove it from
        // the new content map, preserving it in the DOM
        srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
        preserved.push(currentHeadElt);
      }
    } else {
      if (headMergeStyle === "append") {
        // we are appending and this existing element is not new content
        // so if and only if it is marked for re-append do we do anything
        if (isReAppended) {
          removed.push(currentHeadElt);
          nodesToAppend.push(currentHeadElt);
        }
      } else {
        // if this is a merge, we remove this content since it is not in the new head

        removed.push(currentHeadElt);
      }
    }
  }

  // Push the remaining new head elements in the Map into the
  // nodes to append to the head tag
  nodesToAppend.push(...srcToNewHeadNodes.values());

  for (const newNode of nodesToAppend) {
    const newElt = document
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
function mergeDefaults(config: Partial<contextType>) {
  const finalConfig: Partial<contextType> = {};
  // copy top level stuff into final config
  Object.assign(finalConfig, defaults);
  Object.assign(finalConfig, config);

  // copy head config into final config  (do this to deep merge the head)
  (finalConfig as any).head = {};
  Object.assign(finalConfig.head as any, defaults.head);
  Object.assign(finalConfig.head as any, config.head);
  return finalConfig;
}

function createMorphContext(
  oldNode: MorphEl,
  newContent: MorphEl,
  config: contextType,
): contextType {
  config = mergeDefaults(config) as any;
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

function isIdSetMatch(
  node1: null | MorphEl,
  node2: MorphEl | null,
  ctx: contextType,
) {
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

function isSoftMatch(node1: MorphEl | null, node2: MorphEl | null) {
  if (node1 == null || node2 == null) {
    return false;
  }
  return node1.nodeType === node2.nodeType && node1.tagName === node2.tagName;
}

function removeNodesBetween(
  startInclusive: MorphNode | null,
  endExclusive: MorphNode | null,
  ctx: contextType,
) {
  while (startInclusive !== endExclusive) {
    const tempNode = startInclusive;
    startInclusive = startInclusive!.nextSibling!;
    removeNode(tempNode as MorphEl, ctx);
  }
  removeIdsFromConsideration(ctx, endExclusive as MorphEl);
  return endExclusive!.nextSibling!;
}

//=============================================================================
// Scans forward from the insertionPoint in the old parent looking for a potential id match
// for the newChild.  We stop if we find a potential id match for the new child OR
// if the number of potential id matches we are discarding is greater than the
// potential id matches for the new child
//=============================================================================
function findIdSetMatch(
  newContent: MorphNode,
  oldParent: MorphNode,
  newChild: MorphEl,
  insertionPoint: MorphEl | null,
  ctx: contextType,
) {
  // max id matches we are willing to discard in our search
  const newChildPotentialIdCount = getIdIntersectionCount(
    ctx,
    newChild,
    oldParent as MorphEl,
  );

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
      otherMatchCount += getIdIntersectionCount(
        ctx,
        potentialMatch,
        newContent as MorphEl,
      );
      if (otherMatchCount > newChildPotentialIdCount) {
        // if we have more potential id matches in _other_ content, we
        // do not have a good candidate for an id match, so return null
        return null;
      }

      // advanced to the next old content child
      potentialMatch = potentialMatch.nextSibling as MorphEl;
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
function findSoftMatch(
  newContent: MorphNode,
  newChild: MorphEl,
  insertionPoint: MorphEl | null,
  ctx: contextType,
) {
  let potentialSoftMatch = insertionPoint;
  let nextSibling = newChild.nextSibling;
  let siblingSoftMatchCount = 0;

  while (potentialSoftMatch != null) {
    if (
      getIdIntersectionCount(ctx, potentialSoftMatch, newContent as MorphEl) > 0
    ) {
      // the current potential soft match has a potential id set match with the remaining new
      // content so bail out of looking
      return null;
    }

    // if we have a soft match with the current node, return it
    if (isSoftMatch(newChild, potentialSoftMatch)) {
      return potentialSoftMatch;
    }

    if (isSoftMatch(nextSibling as MorphEl, potentialSoftMatch)) {
      // the next new node has a soft match with this node, so
      // increment the count of future soft matches
      siblingSoftMatchCount++;
      nextSibling = nextSibling!.nextSibling;

      // If there are two future soft matches, bail to allow the siblings to soft match
      // so that we don't consume future soft matches for the sake of the current node
      if (siblingSoftMatchCount >= 2) {
        return null;
      }
    }

    // advanced to the next old content child
    potentialSoftMatch = potentialSoftMatch.nextSibling as null | MorphEl;
  }

  return potentialSoftMatch;
}

function parseContent(newContent: string) {
  const parser = new DOMParser();

  // remove svgs to avoid false-positive matches on head, etc.
  const contentWithSvgsRemoved = newContent.replace(
    /<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,
    "",
  );

  // if the newContent contains a html, head or body tag, we can simply parse it w/o wrapping
  if (
    contentWithSvgsRemoved.match(/<\/html>/) ||
    contentWithSvgsRemoved.match(/<\/head>/) ||
    contentWithSvgsRemoved.match(/<\/body>/)
  ) {
    const content = parser.parseFromString(newContent, "text/html");
    // if it is a full HTML document, return the document itself as the parent container
    if (contentWithSvgsRemoved.match(/<\/html>/)) {
      (content as MorphNode).generatedByIdiomorph = true;
      return content;
    } else {
      // otherwise return the html element as the parent container
      const htmlElement: MorphNode | null = content.firstChild;
      if (htmlElement) {
        htmlElement.generatedByIdiomorph = true;
        return htmlElement;
      } else {
        return null;
      }
    }
  } else {
    // if it is partial HTML, wrap it in a template tag to provide a parent element and also to help
    // deal with touchy tags like tr, tbody, etc.
    const responseDoc = parser.parseFromString(
      "<body><template>" + newContent + "</template></body>",
      "text/html",
    );
    const content = responseDoc.body.querySelector("template")!.content;
    (content as MorphNode).generatedByIdiomorph = true;
    return content;
  }
}

function normalizeContent(newContent: null | MorphEl | MorphNode) {
  if (newContent == null) {
    // noinspection UnnecessaryLocalVariableJS
    const dummyParent = document.createElement("div");
    return dummyParent;
  } else if (newContent.generatedByIdiomorph) {
    // the template tag created by idiomorph parsing can serve as a dummy parent
    return newContent;
  } else if (newContent instanceof Node) {
    // a single node is added as a child to a dummy parent
    const dummyParent = document.createElement("div");
    dummyParent.append(newContent);
    return dummyParent;
  } else {
    // all nodes in the array or HTMLElement collection are consolidated under
    // a single dummy parent element
    const dummyParent = document.createElement("div");
    for (const elt of [...newContent]) {
      dummyParent.append(elt);
    }
    return dummyParent;
  }
}

function insertSiblings(
  previousSibling: MorphEl | null,
  morphedNode: MorphEl,
  nextSibling: MorphEl | null,
) {
  const stack: MorphEl[] = [];
  const added = [];
  while (previousSibling != null) {
    stack.push(previousSibling);
    previousSibling = previousSibling.previousSibling as MorphEl | null;
  }
  while (stack.length > 0) {
    const node = stack.pop();
    added.push(node); // push added preceding siblings on in order and insert
    morphedNode.parentElement!.insertBefore(node as MorphEl, morphedNode);
  }
  added.push(morphedNode);
  while (nextSibling != null) {
    stack.push(nextSibling);
    added.push(nextSibling); // here we are going in order, so push on as we scan, rather than add
    nextSibling = nextSibling.nextSibling as MorphEl;
  }
  while (stack.length > 0) {
    morphedNode.parentElement!.insertBefore(
      stack.pop() as MorphEl,
      morphedNode.nextSibling,
    );
  }
  return added;
}

function findBestNodeMatch(
  newContent: MorphEl,
  oldNode: MorphEl,
  ctx: contextType,
) {
  let currentElement;
  currentElement = newContent.firstChild;
  let bestElement = currentElement;
  let score = 0;
  while (currentElement) {
    const newScore = scoreElement(currentElement as MorphEl, oldNode, ctx);
    if (newScore > score) {
      bestElement = currentElement;
      score = newScore;
    }
    currentElement = currentElement.nextSibling;
  }
  return bestElement;
}

function scoreElement(node1: MorphEl, node2: MorphEl, ctx: contextType) {
  if (isSoftMatch(node1, node2)) {
    return 0.5 + getIdIntersectionCount(ctx, node1, node2);
  }
  return 0;
}

function removeNode(tempNode: MorphEl, ctx: contextType) {
  removeIdsFromConsideration(ctx, tempNode);

  tempNode.remove();
}

//=============================================================================
// ID Set Functions
//=============================================================================

function isIdInConsideration(ctx: contextType, id: string) {
  return !ctx.deadIds.has(id);
}

function idIsWithinNode(ctx: contextType, id: string, targetNode: MorphEl) {
  const idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
  return idSet.has(id);
}

function removeIdsFromConsideration(ctx: contextType, node: MorphEl) {
  const idSet = ctx.idMap.get(node) || EMPTY_SET;
  for (const id of idSet) {
    // @ts-ignore
    ctx.deadIds.add(id);
  }
}

function getIdIntersectionCount(
  ctx: contextType,
  node1: MorphEl,
  node2: MorphEl,
) {
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

function populateIdMapForNode(node: MorphEl, idMap: Map<Node, Set<string>>) {
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
      current = current.parentElement!;
    }
  }
}

function createIdMap(oldContent: MorphEl, newContent: MorphEl) {
  const idMap: Map<MorphEl, Set<string>> = new Map();
  populateIdMapForNode(oldContent, idMap);
  populateIdMapForNode(newContent, idMap);
  return idMap;
}

/// END OF MORPHING ////
