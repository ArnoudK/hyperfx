export interface CompilerErrorLocation {
    line: number;
    column: number;
}
export interface CompilerErrorOptions {
    id: string;
    code: string;
    message: string;
    loc?: CompilerErrorLocation;
    cause?: unknown;
}
export declare class HyperFXCompilerError extends Error {
    readonly code: string;
    readonly id: string;
    readonly loc?: CompilerErrorLocation;
    readonly cause?: unknown;
    constructor(options: CompilerErrorOptions);
}
export declare function toCompilerError(error: unknown, id: string): HyperFXCompilerError;
