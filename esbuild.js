'use strict';

const path = require('path');
const esbuild = require('esbuild');

const OUTPUT_DIR = path.join(__dirname, 'dist').toString();
const ENTRYPOINT = path.join(__dirname, 'src', 'index.ts');
const SUPPORTED_BROWSERS = [
  'chrome90',
  'firefox90',
];

module.exports = async function build() {
  let config = {
    loader: { '.ts': 'ts', '.js': 'js' },
    entryPoints: [ENTRYPOINT],
    bundle: false,
    outdir: OUTPUT_DIR,
    target: SUPPORTED_BROWSERS,
    minify: true,
    sourcemap: false,
  };
  let bundleConfig = {
    bundle: true,
    external: [
      '@ember/application',
      '@ember/array',
      '@ember/component',
      '@ember/component/template-only',
      '@ember/debug',
      '@ember/destroyable',
      '@ember/helper',
      '@ember/modifier',
      '@ember/object',
      '@ember/runloop',
      '@ember/service',
      '@ember/string',
      '@ember/template-factory',
      '@ember/utils',
      '@glimmer/component',
      '@glimmer/compiler',
      '@glimmer/tracking',
      '@glimmer/syntax',
      '@glimmer/validator',
    ]
  }


  await Promise.all([
    esbuild.build({ ...config, format: 'esm' }),
    esbuild.build({ ...config, ...bundleConfig, format: 'cjs' }),
  ]);

};

if (require.main === module) {
  module.exports();
}
