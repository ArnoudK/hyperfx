import * as t from '@babel/types';

export function isStaticElement(node: t.JSXElement): boolean {
  const tagName = t.isJSXIdentifier(node.openingElement.name)
    ? node.openingElement.name.name
    : null;

  if (tagName && /^[A-Z]/.test(tagName)) {
    return false;
  }

  let hasDynamicAttrs = false;
  for (const attr of node.openingElement.attributes) {
    if (t.isJSXAttribute(attr)) {
      if (attr.value && t.isJSXExpressionContainer(attr.value)) {
        hasDynamicAttrs = true;
        break;
      }
    } else {
      hasDynamicAttrs = true;
      break;
    }
  }

  if (hasDynamicAttrs) return false;

  return hasOnlyStaticChildren(node.children);
}

export function hasOnlyStaticChildren(
  children: Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer | t.JSXFragment | t.JSXSpreadChild>
): boolean {
  for (const child of children) {
    if (t.isJSXExpressionContainer(child)) {
      return false;
    }
    if (t.isJSXElement(child) && !isStaticElement(child)) {
      return false;
    }
    if (t.isJSXFragment(child)) {
      return false;
    }
    if (t.isJSXSpreadChild(child)) {
      return false;
    }
  }
  return true;
}
