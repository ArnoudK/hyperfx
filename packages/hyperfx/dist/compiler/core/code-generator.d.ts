/**
 * Code Generator
 * Converts Babel AST nodes to code strings
 */
import * as t from '@babel/types';
import type { CodeContext } from './types.js';
export declare class CodeGenerator {
    private readonly isSSR;
    private readonly generateElementCode;
    private readonly generateSSRJSXCode;
    private readonly generateChildrenCode;
    private currentContext;
    constructor(isSSR: () => boolean, generateElementCode: (node: t.JSXElement) => string, generateSSRJSXCode: (node: t.JSXElement | t.JSXFragment) => string, generateChildrenCode: (children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>) => string);
    /**
     * Convert a Babel node to code string
     */
    codeFromNode(node: t.Node, context?: CodeContext): string;
    /**
     * Generate arrow function code
     */
    private generateArrowFunction;
    /**
     * Generate call expression code
     */
    private generateCallExpression;
    /**
     * Generate optional call expression code
     */
    private generateOptionalCallExpression;
    /**
     * Generate object expression code
     */
    private generateObjectExpression;
    /**
     * Check if an identifier is a known global that shouldn't be optimized
     */
    isKnownGlobal(name: string): boolean;
    /**
     * Check if a member expression is a known non-signal pattern
     */
    isKnownNonSignal(memberCode: string): boolean;
}
