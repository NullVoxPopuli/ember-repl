// import { template } from '@ember/-internals/glimmer';
import { getTemplateLocals } from '@glimmer/syntax';
import { setComponentTemplate } from '@ember/component';
import templateOnlyComponent from '@ember/component/template-only';
import { array, concat, fn, get, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { compileTemplate as _compileTemplate } from '@ember/template-compilation';

// import { precompile as precompileTemplate } from 'ember-template-compiler';
import { nameFor } from './utils';

/**
 * compile a template with an empty scope
 * to use components, helpers, etc, you will need to compile with JS
 *
 * (templates alone do not have a way to import / define complex structures)
 */
export function compileHBS(
  template: string,
  options: Omit<CompileTemplateOptions, 'moduleName'> = {}
) {
  let name = nameFor(template);
  let component: undefined | unknown;
  let error: undefined | Error;

  try {
    component = setComponentTemplate(
      compileTemplate(template, { moduleName: name, ...options }),
      templateOnlyComponent(name)
    );
  } catch (e) {
    error = e;
  }

  return { name, component, error };
}

interface CompileTemplateOptions {
  moduleName: string;
  scope?: Record<string, unknown>;
}

/**
 * Same API as in ember -- but with defaults for easier consumption.
 *
 * Maybe at some point in the future the api could be expanded to allow
 * locals to be passed, but for the most part, it seems easier as a low-level
 * thing that library-authors mess with.
 */
function compileTemplate(text: string, { moduleName, scope = {} }: CompileTemplateOptions) {
  let localScope = { array, concat, fn, get, hash, on, ...scope };
  let locals = getTemplateLocals(text) as unknown[];

  console.log({ locals });
  // https://github.com/emberjs/rfcs/pull/731/files
  // let compiled = precompileTemplate(text, {
  let compiled = _compileTemplate(text, {
    strictMode: true,
    moduleName,
    scope: () => localScope,
    locals,
    isProduction: false,
  });

  // let result = template(evaluate(compiled));

  // return result;
  return compiled;
}

// function evaluate(precompiled: string) {
//   return new Function('return ' + precompiled);
// }
