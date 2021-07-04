import { compileTemplate as _compile } from '@ember/template-compilation';
import { setComponentTemplate, TemplateFactory } from '@ember/component';
import templateOnlyComponent from '@ember/component/template-only';

import { nameFor } from './utils';

/**
 * compile a template with an empty scope
 * to use components, helpers, etc, you will need to compile with JS
 *
 * (templates alone do not have a way to import / define complex structures)
 */
export function compileHBS(template: string) {
  let name = nameFor(template);
  let factory: undefined | TemplateFactory;
  let error: undefined | Error;

  try {
    factory = toComponent(
      compileTemplate(template, { moduleName: name }),
      name
    );
  } catch (e) {
    error = e;
  }

  return { name, factory, error };
}

function toComponent(template: unknown, name: string): TemplateFactory {
  // https://github.com/glimmerjs/glimmer-vm/blob/master/packages/%40glimmer/runtime/lib/component/template-only.ts#L83
  return setComponentTemplate(template, templateOnlyComponent(name));
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
