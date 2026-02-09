export class HyperFXCompilerError extends Error {
    constructor(options) {
        super(`[HyperFX Compiler] ${options.message}`);
        this.name = 'HyperFXCompilerError';
        this.code = options.code;
        this.id = options.id;
        this.loc = options.loc;
        this.cause = options.cause;
    }
}
export function toCompilerError(error, id) {
    if (error instanceof HyperFXCompilerError) {
        return error;
    }
    const loc = extractBabelLocation(error);
    const message = error instanceof Error
        ? error.message
        : 'Unknown compiler error';
    return new HyperFXCompilerError({
        id,
        code: 'HFX_COMPILER_ERROR',
        message: `${message} (${id}${loc ? `:${loc.line}:${loc.column}` : ''})`,
        loc,
        cause: error,
    });
}
function extractBabelLocation(error) {
    if (typeof error !== 'object' || error === null) {
        return undefined;
    }
    const locValue = error.loc;
    if (!locValue || typeof locValue.line !== 'number' || typeof locValue.column !== 'number') {
        return undefined;
    }
    return {
        line: locValue.line,
        column: locValue.column,
    };
}
//# sourceMappingURL=errors.js.map