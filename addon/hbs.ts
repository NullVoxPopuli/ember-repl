import { setComponentTemplate } from '@ember/component';
import templateOnlyComponent from '@ember/component/template-only';
import { compileTemplate as _compile } from '@ember/template-compilation';

import { nameFor } from './utils';

/**
 * compile a template with an empty scope
 * to use components, helpers, etc, you will need to compile with JS
 *
 * (templates alone do not have a way to import / define complex structures)
 */
export function compileHBS(template: string) {
  let name = nameFor(template);
  let component: undefined | unknown;
  let error: undefined | Error;

  try {
    component = setComponentTemplate(
      compileTemplate(template, { moduleName: name }),
      templateOnlyComponent(name)
    );
  } catch (e) {
    error = e;
  }

  return { name, component, error };
}

/**
 * Same API as in ember -- but with defaults for easier consumption.
 *
 * Maybe at some point in the future the api could be expanded to allow
 * locals to be passed, but for the most part, it seems easier as a low-level
 * thing that library-authors mess with.
 */
function compileTemplate(text: string, { moduleName }: { moduleName: string }) {
  // https://github.com/emberjs/rfcs/pull/731/files
  let compiled = _compile(text, {
    // with strictMode, we'd need to import array, hash, and all that
    strictMode: false,
    moduleName,
    locals: [],
    isProduction: false,
    meta: {},
    plugins: {
      ast: [],
    },
  });

  return compiled;
}
