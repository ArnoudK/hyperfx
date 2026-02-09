import * as t from '@babel/types';
import type { DynamicElementAnalysis } from '../types.js';
import type { CodeContext } from '../types.js';
export type CodeFromNode = (node: t.Node, context?: CodeContext) => string;
export type GenerateTemplateHTML = (node: t.JSXElement) => string;
export type GetOrCreateTemplate = (html: string) => string;
export type IsStaticElement = (node: t.JSXElement) => boolean;
export type AnalyzeDynamicElement = (node: t.JSXElement) => DynamicElementAnalysis | null;
export type GenerateElementCodeInline = (templateId: string, dynamics: DynamicElementAnalysis['dynamics'], node: t.JSXElement) => string;
export interface MapOptimizationOptions {
    codeFromNode: CodeFromNode;
    generateTemplateHTML: GenerateTemplateHTML;
    getOrCreateTemplate: GetOrCreateTemplate;
    isStaticElement: IsStaticElement;
    analyzeDynamicElement: AnalyzeDynamicElement;
    generateElementCodeInline: GenerateElementCodeInline;
}
export interface MapOptimizationResult {
    arrayExpr: string;
    mapFn: string;
    keyFn?: string;
}
export declare function tryOptimizeMapCall(node: t.Node, options: MapOptimizationOptions): MapOptimizationResult | null;
