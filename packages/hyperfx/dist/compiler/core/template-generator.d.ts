/**
 * Template Generator
 * Manages template creation, deduplication, and HTML generation
 */
import * as t from '@babel/types';
import type { DynamicElementAnalysis } from './types.js';
export declare class TemplateGenerator {
    private readonly getAttributeValue;
    private templateCounter;
    private templates;
    private templatesByHTML;
    constructor(getAttributeValue: (attr: t.JSXAttribute) => string | null);
    /**
     * Get or create a template (with deduplication)
     */
    getOrCreateTemplate(html: string): string;
    /**
     * Get all templates
     */
    getTemplates(): Map<string, string>;
    /**
     * Reset counter (used for testing and per-file transformations)
     */
    resetCounter(): void;
    /**
     * Generate static HTML template from JSX element
     */
    generateTemplateHTML(node: t.JSXElement): string;
    /**
     * Analyze dynamic element and build template with markers
     */
    analyzeDynamicElement(node: t.JSXElement): DynamicElementAnalysis | null;
    /**
     * Build template HTML with comment markers for dynamic insertions
     */
    private buildTemplateWithMarkers;
    /**
     * Build children HTML with markers for dynamic content
     */
    private buildChildrenWithMarkers;
    /**
     * Separate static and dynamic attributes
     */
    private separateAttributes;
    /**
     * Get tag name from JSX opening element
     */
    private getTagName;
    /**
     * Get static attributes as HTML string
     */
    private getAttributesHTML;
    /**
     * Get HTML children string (static only)
     */
    private getChildrenHTML;
    /**
     * Check if an attribute is a boolean attribute
     */
    isBooleanAttribute(name: string): boolean;
    /**
     * Check if a tag is a void element
     */
    isVoidElement(tag: string): boolean;
}
