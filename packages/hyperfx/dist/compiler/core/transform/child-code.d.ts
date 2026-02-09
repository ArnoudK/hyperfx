import * as t from '@babel/types';
import type { CodeContext } from '../types.js';
export type CodeFromNode = (node: t.Node, context?: CodeContext) => string;
export type GenerateElementCode = (node: t.JSXElement) => string;
export interface GenerateChildrenOptions {
    codeFromNode: CodeFromNode;
    generateElementCode: GenerateElementCode;
}
export declare function generateChildrenCode(children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>, options: GenerateChildrenOptions): string;
