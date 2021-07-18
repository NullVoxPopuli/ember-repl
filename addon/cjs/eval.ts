/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * We need to import and hang on to these references so that they
 * don't get optimized away during deploy
 */
import _GlimmerComponent from '@glimmer/component';
import * as _tracking from '@glimmer/tracking';
import * as _application from '@ember/application';
import * as _array from '@ember/array';
import * as _EmberComponent from '@ember/component';
import _TO from '@ember/component/template-only';
import * as _debug from '@ember/debug';
import * as _destroyable from '@ember/destroyable';
import * as _helpers from '@ember/helper';
import * as _modifier from '@ember/modifier';
import * as _object from '@ember/object';
import * as _runloop from '@ember/runloop';
import * as _service from '@ember/service';
import * as _string from '@ember/string';
import { createTemplateFactory } from '@ember/template-factory';
import * as _utils from '@ember/utils';

import type Component from '@glimmer/component';

const modules = {
  '@ember/application': _application,
  '@ember/array': _array,
  '@ember/component': _EmberComponent,
  '@ember/component/template-only': _TO,
  '@ember/debug': _debug,
  '@ember/destroyable': _destroyable,
  '@ember/helper': _helpers,
  '@ember/modifier': _modifier,
  '@ember/object': _object,
  '@ember/runloop': _runloop,
  '@ember/service': _service,
  '@ember/string': _string,
  '@ember/template-factory': { createTemplateFactory },
  '@ember/utils': _utils,

  '@glimmer/component': _GlimmerComponent,
  '@glimmer/tracking': _tracking,
} as Record<string, unknown>;

export type ExtraModules = Record<string, unknown>;

export function evalSnippet(
  compiled: string,
  extraModules: ExtraModules = {}
): {
  default: Component;
  services?: { [key: string]: unknown };
} {
  const exports = {};

  // https://github.com/glimmerjs/glimmer-experimental/blob/master/packages/examples/playground/src/utils/eval-snippet.ts
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  function require(moduleName: keyof typeof modules): unknown {
    let preConfigured = modules[moduleName] || extraModules[moduleName];

    return preConfigured || window.require(moduleName);
  }

  eval(compiled);

  return exports as { default: Component; services?: { [key: string]: unknown } };
}

/**
 * TODO: if/when we compile to native modules instead of CJS, we will need to uncomment
 *       out the bottom bit, and let the browser resolve those imports normally.
 *
 */
export async function swapUnknownForJSDelivr(text: string, extraModules: ExtraModules = {}) {
  let known = [
    ...Object.keys(extraModules),
    ...Object.keys(modules),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...Object.keys((window.require as any)?.entries || {}),
  ];

  let unknown = extractModulesNotMatching(text, known);

  if (unknown.length === 0) {
    return text;
  }

  let replacementMap = unknown.reduce((map, moduleName) => {
    map[moduleName] = moduleToJSDelivr(moduleName);

    return map;
  }, {} as Record<string, string>);

  await Promise.all(
    Object.entries(replacementMap).map(async ([key, url]) => {
      let protocolLess = url.replace(/https?:\/\//, '');

      try {
        // Favor ESM builds
        /* webpackIgnore: true */
        modules[key] = await import(`https://${protocolLess}/+esm`);
      } catch (e) {
        if (e instanceof TypeError) {
          /* webpackIgnore: true */
          modules[key] = await import(`https://${protocolLess}`);

          return;
        }

        throw e;
      }
    })
  );

  // let withExternalModules = text.replaceAll(
  //   new RegExp(unknown.map((name) => `(${name})`).join('|'), 'g'),
  //   (match) => {
  //     return replacementMap[match];
  //   }
  // );

  return text;
}

// https://www.jsdelivr.com/esm
function moduleToJSDelivr(moduleName: string) {
  return `https://cdn.jsdelivr.net/npm/${moduleName}`;
}

const IMPORT_EXTRACTOR = /(from '([^']+)')|(from "([^"]+)")/;

function extractModulesNotMatching(text: string, moduleNames: string[]): string[] {
  let matches = text.matchAll(new RegExp(IMPORT_EXTRACTOR, 'g'));

  let notMatching = [];

  for (let [, , singleQuoteMatch, doubleQuoteMatch] of matches) {
    let match = singleQuoteMatch || doubleQuoteMatch;

    if (!match) continue;

    if (moduleNames.includes(match)) continue;

    notMatching.push(match);
  }

  return notMatching;
}
