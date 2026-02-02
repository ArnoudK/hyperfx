/**
 * SSR Code Generator
 * Generates _$jsx() runtime calls for server-side rendering
 */
import * as t from '@babel/types';
export declare class SSRGenerator {
    private readonly codeFromNode;
    constructor(codeFromNode: (node: t.Node) => string);
    /**
     * Generate SSR JSX code for elements and fragments
     */
    generateSSRJSXCode(node: t.JSXElement | t.JSXFragment | t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild): string;
    /**
     * Get tag name or expression for JSX element
     */
    getTagNameOrExpr(opening: t.JSXOpeningElement): string;
    /**
     * Convert JSX member expression to code
     */
    private getJSXMemberExpression;
    /**
     * Generate props object for SSR
     */
    generatePropsObject(attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>, children: Array<t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXText | t.JSXSpreadChild>): string;
    /**
     * Generate children array code
     */
    generateChildrenArray(children: Array<t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXText | t.JSXSpreadChild>): string;
    /**
     * Get attribute value code
     */
    private getAttributeValue;
}
