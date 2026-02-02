/**
 * Component Call Generator
 * Generates function call code for component elements (uppercase JSX)
 */
import * as t from '@babel/types';
import type { CodeContext } from './types.js';
export declare class ComponentGenerator {
    private readonly generateChildren;
    private readonly codeFromNode;
    constructor(generateChildren: (children: Array<t.JSXText | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXElement | t.JSXFragment>) => string, codeFromNode: (node: t.Node, context?: CodeContext) => string);
    /**
     * Check if a JSX element is a component (vs HTML element)
     * Components start with uppercase letter
     */
    isComponentElement(node: t.JSXElement): boolean;
    /**
     * Generate code for a component call (not a template)
     */
    generateComponentCall(node: t.JSXElement): string;
    /**
     * Get the component name from JSX element
     */
    private getComponentName;
    /**
     * Check if element has spread attributes
     */
    private hasSpreadAttributes;
    /**
     * Generate component call with spread attributes
     */
    private generateComponentCallWithSpread;
    /**
     * Generate simple component call without spread
     */
    private generateSimpleComponentCall;
    /**
     * Get the value code for an attribute
     */
    getAttributeValue(attr: t.JSXAttribute): string;
}
