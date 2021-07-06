/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTemplateLocals } from '@glimmer/syntax';
import { setComponentTemplate } from '@ember/component';
import templateOnlyComponent from '@ember/component/template-only';
import { array, concat, fn, get, hash } from '@ember/helper';
import { on } from '@ember/modifier';
// import { compileTemplate as _compileTemplate } from '@ember/template-compilation';
import { createTemplateFactory } from '@ember/template-factory';

import { precompile as precompileTemplate } from 'ember-template-compiler';

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
  let localScope = { array, concat, fn, get, hash, on, ...scope } as any;
  let locals = getTemplateLocals(text);

  // https://github.com/emberjs/rfcs/pull/731/files
  let compiled = precompileTemplate(text, {
    strictMode: true,
    moduleName,
    scope: () => localScope,
    locals,
    isProduction: false,
    meta: {
      moduleName,
    },
  });

  let block: any;

  // Yikes! :(
  eval(`block = ${compiled}`);

  // precompileTemplate and compileTemplate lose the reference to our local
  // scope...
  block.scope = () => locals.map((key) => localScope[key]);
  let factory = createTemplateFactory(block);

  return factory;
}
