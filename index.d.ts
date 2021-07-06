interface CompileResult {
  component?: unknown;
  error?: Error;
  name: string;
}
export function compileJS(code: string): Promise<CompileResult>;
export function compileHBS(code: string, options?: { scope?: Record<string, unknown> }): CompileResult;
export function invocationOf(name: string): string;
export function invocationName(name: string): string;
export function nameFor(text: string): string;
