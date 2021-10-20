import { getTemplateLocals } from '@glimmer/syntax';
import { precompileTemplate } from '@ember/template-compilation';

import makePlugin from 'babel-plugin-ember-template-compilation';

// import HTMLBars, { preprocessEmbeddedTemplates } from 'babel-plugin-htmlbars-inline-precompile';
import { nameFor } from '../utils';
import { evalSnippet } from './eval';

import type { ExtraModules } from './eval';
import type { Babel } from './types';

export interface Info {
  code: string;
  name: string;
}

/**
 * @public
 * Transpiles GlimmerJS (*.gjs) formatted text into and evaluates as a JS Module.
 * The returned component can be invoked explicitly in the consuming project.
 *
 * SEE: README for example usage
 *
 * @param {string} code: the code to be compiled
 * @param {Object} extraModules: map of import paths to modules. This isn't needed
 *  for classic ember projects, but for strict static ember projects, extraModules
 *  will need to be pasesd if compileJS is intended to be used in a styleguide or
 *  if there are additional modules that could be imported in the passed `code`.
 *
 *  Later on, imports that are not present by default (ember/glimmer) or that
 *  are not provided by extraModules will be searched on npm to see if a package
 *  needs to be downloaded before running the `code` / invoking the component
 */
export async function compileJS(code: string, extraModules?: ExtraModules) {
  let name = nameFor(code);
  let component: undefined | unknown;
  let error: undefined | Error;

  try {
    let compiled = await compileGJS({ code: code, name });

    if (!compiled) {
      throw new Error(`Compiled output is missing`);
    }

    component = evalSnippet(compiled, extraModules).default;
  } catch (e) {
    error = e;
  }

  return { name, component, error };
}

let babel: Babel;

async function compileGJS({ code: input, name }: Info) {
  if (!babel) {
    babel = await import('@babel/standalone');
  }

  let preprocessed = preprocessEmbeddedTemplates(input, {
    getTemplateLocals,
    relativePath: `${name}.js`,
    includeSourceMaps: false,
    includeTemplateTokens: true,
    templateTag: 'template',
    templateTagReplacement: 'GLIMMER_TEMPLATE',
    getTemplateLocalsExportPath: 'getTemplateLocals',
  });

  let result = babel.transform(preprocessed.output, {
    filename: `${name}.js`,
    plugins: [
      [
        makePlugin({
          precompile: precompileTemplate,
        }),

        // HTMLBars,
        // {
        //   precompile: precompileTemplate,
        //   // this needs to be true until Ember 3.27+
        //   ensureModuleApiPolyfill: false,
        //   modules: {
        //     'ember-template-imports': {
        //       export: 'hbs',
        //       useTemplateLiteralProposalSemantics: 1,
        //     },

        //     'TEMPLATE-TAG-MODULE': {
        //       export: 'GLIMMER_TEMPLATE',
        //       debugName: '<template>',
        //       useTemplateTagProposalSemantics: 1,
        //     },
        //   },
        // },
      ],
      [babel.availablePlugins['proposal-decorators'], { legacy: true }],
      [babel.availablePlugins['proposal-class-properties']],
    ],
    presets: [
      [
        babel.availablePresets['env'],
        {
          // false -- keeps ES Modules
          modules: 'cjs',
          targets: { esmodules: true },
          loose: true,
          forceAllTransforms: false,
        },
      ],
    ],
  });

  if (!result) {
    return;
  }

  let { code } = result;

  return code;
}
