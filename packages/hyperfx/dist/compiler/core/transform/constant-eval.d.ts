import * as t from '@babel/types';
export interface ConstantEvalOptions {
    optimizeConstants: boolean;
}
export declare function tryEvaluateConstant(node: t.Node, options: ConstantEvalOptions): string | null;
