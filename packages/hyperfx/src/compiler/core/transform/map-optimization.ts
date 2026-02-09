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

export function tryOptimizeMapCall(
  node: t.Node,
  options: MapOptimizationOptions
): MapOptimizationResult | null {
  if (!t.isCallExpression(node)) {
    return null;
  }

  if (!t.isMemberExpression(node.callee) ||
    !t.isIdentifier(node.callee.property) ||
    node.callee.property.name !== 'map') {
    return null;
  }

  const arrayExpr = options.codeFromNode(node.callee.object);

  if (node.arguments.length === 0) {
    return null;
  }

  const mapFn = node.arguments[0];
  let mapFnCode: string;
  let keyFn: string | undefined;

  if (t.isArrowFunctionExpression(mapFn) || t.isFunctionExpression(mapFn)) {
    const params: string[] = [];
    for (const param of mapFn.params) {
      params.push(options.codeFromNode(param as t.Node));
    }
    const paramsStr = params.join(', ');

    if (t.isBlockStatement(mapFn.body)) {
      const body = '{ /* complex body */ }';
      mapFnCode = `(${paramsStr}) => ${body}`;
    } else if (t.isJSXElement(mapFn.body)) {
      const keyProp = extractKeyProp(mapFn.body, options.codeFromNode);
      if (keyProp) {
        const paramName = mapFn.params[0] ? options.codeFromNode(mapFn.params[0] as t.Node) : 'item';
        const indexParam = mapFn.params[1] ? options.codeFromNode(mapFn.params[1] as t.Node) : 'i';
        keyFn = `(${paramName}, ${indexParam}) => ${keyProp}`;
      }

      if (options.isStaticElement(mapFn.body)) {
        const html = options.generateTemplateHTML(mapFn.body);
        const templateId = options.getOrCreateTemplate(html);
        const body = `${templateId}.cloneNode(true)`;
        mapFnCode = `(${paramsStr}) => ${body}`;
      } else {
        const analysis = options.analyzeDynamicElement(mapFn.body);
        if (analysis) {
          const templateId = options.getOrCreateTemplate(analysis.templateHTML);
          const inlineCode = options.generateElementCodeInline(templateId, analysis.dynamics, mapFn.body);
          mapFnCode = `(${paramsStr}) => {\n  ${inlineCode.split('\n').join('\n  ')}\n}`;
        } else {
          mapFnCode = `(${paramsStr}) => null`;
        }
      }
    } else {
      const body = options.codeFromNode(mapFn.body as t.Node);
      mapFnCode = `(${paramsStr}) => ${body}`;
    }
  } else {
    return null;
  }

  return {
    arrayExpr,
    mapFn: mapFnCode,
    keyFn,
  };
}

function extractKeyProp(node: t.JSXElement, codeFromNode: CodeFromNode): string | null {
  for (const attr of node.openingElement.attributes) {
    if (t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name) &&
      attr.name.name === 'key') {
      if (t.isJSXExpressionContainer(attr.value)) {
        return codeFromNode(attr.value.expression);
      }
      if (t.isStringLiteral(attr.value)) {
        return `"${attr.value.value}"`;
      }
    }
  }
  return null;
}
