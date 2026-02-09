import * as t from '@babel/types';
import type { DynamicPart, DynamicElementAnalysis } from '../types.js';
import type { CodeContext } from '../types.js';
import type { MapOptimizationOptions } from './map-optimization.js';
export type CodeFromNode = (node: t.Node, context?: CodeContext) => string;
export type GenerateElementCode = (node: t.JSXElement) => string;
export type GenerateElementAccess = (rootVar: string, path: string[]) => string;
export type IsReactiveExpression = (node: t.Node) => boolean;
export type TryEvaluateConstant = (node: t.Node) => string | null;
export interface DynamicElementOptions {
    codeFromNode: CodeFromNode;
    generateElementCode: GenerateElementCode;
    generateElementAccess: GenerateElementAccess;
    isReactiveExpression: IsReactiveExpression;
    tryEvaluateConstant: TryEvaluateConstant;
    mapOptimization: MapOptimizationOptions;
}
export declare function generateDynamicCode(templateId: string, dynamics: DynamicPart[], options: DynamicElementOptions): string;
export declare function generateElementCodeInline(templateId: string, dynamics: DynamicPart[], options: DynamicElementOptions): string;
export declare function createDynamicElementAnalysis(templateHTML: string, dynamics: DynamicPart[]): DynamicElementAnalysis;
