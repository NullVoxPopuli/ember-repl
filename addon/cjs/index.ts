import { getTemplateLocals } from '@glimmer/syntax';

import * as Babel from '@babel/standalone';
import HTMLBars, { preprocessEmbeddedTemplates } from 'babel-plugin-htmlbars-inline-precompile';
import { precompile as precompileTemplate } from 'ember-template-compiler';

import { nameFor } from '../utils';
import { evalSnippet } from './eval';

export interface Info {
  code: string;
  name: string;
}

export async function compileJS(code: string) {
  let name = nameFor(code);
  let component: undefined | unknown;
  let error: undefined | Error;

  try {
    let compiled = await compileGJS({ code: code, name });

    if (!compiled) {
      throw new Error(`Compiled output is missing`);
    }

    component = evalSnippet(compiled).default;
  } catch (e) {
    error = e;
  }

  return { name, component, error };
}

async function compileGJS({ code: input, name }: Info) {
  let preprocessed = preprocessEmbeddedTemplates(input, {
    getTemplateLocals,
    relativePath: `${name}.js`,
    includeSourceMaps: false,
    includeTemplateTokens: true,
    templateTag: 'template',
    templateTagReplacement: 'GLIMMER_TEMPLATE',
    getTemplateLocalsExportPath: 'getTemplateLocals',
  });

  let result = Babel.transform(preprocessed.output, {
    filename: `${name}.js`,
    plugins: [
      [
        HTMLBars,
        {
          precompile: precompileTemplate,
          // this needs to be true until Ember 3.27+
          ensureModuleApiPolyfill: false,
          modules: {
            'ember-template-imports': {
              export: 'hbs',
              useTemplateLiteralProposalSemantics: 1,
            },

            'TEMPLATE-TAG-MODULE': {
              export: 'GLIMMER_TEMPLATE',
              debugName: '<template>',
              useTemplateTagProposalSemantics: 1,
            },
          },
        },
      ],
      [Babel.availablePlugins['proposal-decorators'], { legacy: true }],
      [Babel.availablePlugins['proposal-class-properties']],
    ],
    presets: [
      [
        Babel.availablePresets['env'],
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
