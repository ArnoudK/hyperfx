import * as t from '@babel/types';
export declare function isStaticElement(node: t.JSXElement): boolean;
export declare function hasOnlyStaticChildren(children: Array<t.JSXText | t.JSXElement | t.JSXExpressionContainer | t.JSXFragment | t.JSXSpreadChild>): boolean;
