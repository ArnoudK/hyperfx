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

export class HyperFXCompilerError extends Error {
  public readonly code: string;
  public readonly id: string;
  public readonly loc?: CompilerErrorLocation;
  public readonly cause?: unknown;

  constructor(options: CompilerErrorOptions) {
    super(`[HyperFX Compiler] ${options.message}`);
    this.name = 'HyperFXCompilerError';
    this.code = options.code;
    this.id = options.id;
    this.loc = options.loc;
    this.cause = options.cause;
  }
}

export function toCompilerError(error: unknown, id: string): HyperFXCompilerError {
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

function extractBabelLocation(error: unknown): CompilerErrorLocation | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  const locValue = (error as { loc?: { line?: number; column?: number } }).loc;
  if (!locValue || typeof locValue.line !== 'number' || typeof locValue.column !== 'number') {
    return undefined;
  }

  return {
    line: locValue.line,
    column: locValue.column,
  };
}
