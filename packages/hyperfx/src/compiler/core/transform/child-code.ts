import * as t from '@babel/types';
import type { CodeContext } from '../types.js';

export type CodeFromNode = (node: t.Node, context?: CodeContext) => string;
export type GenerateElementCode = (node: t.JSXElement) => string;

export interface GenerateChildrenOptions {
  codeFromNode: CodeFromNode;
  generateElementCode: GenerateElementCode;
}

export function generateChildrenCode(
  children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>,
  options: GenerateChildrenOptions
): string {
  if (children.length === 0) return '[]';

  const childCodes: Array<string | null> = [];

  for (const child of children) {
    if (t.isJSXText(child)) {
      const text = child.value;
      if (text && !/^\s*$/.test(text)) {
        childCodes.push(`"${text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`);
      } else if (text === ' ') {
        childCodes.push('" "');
      }
      continue;
    }

    if (t.isJSXExpressionContainer(child)) {
      if (t.isJSXEmptyExpression(child.expression)) {
        childCodes.push(null);
      } else if (t.isArrowFunctionExpression(child.expression) || t.isFunctionExpression(child.expression)) {
        childCodes.push(options.codeFromNode(child.expression, 'function'));
      } else {
        childCodes.push(options.codeFromNode(child.expression, 'reactive'));
      }
      continue;
    }

    if (t.isJSXElement(child)) {
      childCodes.push(options.generateElementCode(child));
      continue;
    }

    if (t.isJSXFragment(child)) {
      childCodes.push(generateChildrenCode(child.children, options));
      continue;
    }

    childCodes.push(null);
  }

  const filtered: string[] = [];
  for (const code of childCodes) {
    if (code) {
      filtered.push(code);
    }
  }

  return filtered.length === 1 ? filtered[0]! : `[${filtered.join(', ')}]`;
}
