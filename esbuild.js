'use strict';

const path = require('path');
const esbuild = require('esbuild');

const OUTPUT_DIR = path.join(__dirname, 'dist').toString();
const ENTRYPOINT = path.join(__dirname, 'src', 'index.ts');

module.exports = async function build() {
  let config = {
    loader: { '.ts': 'ts', '.js': 'js' },
    entryPoints: [ENTRYPOINT],
    bundle: false,
    outdir: OUTPUT_DIR,
    target: esBuildBrowserTargets,
    minify: true,
    sourcemap: false,
  }


  await Promise.all([
    esbuild.build({ ...config, format: 'esm' }),
    esbuild.build({ ...config, bundle: true, format: 'cjs' }),
  ]);

};

if (require.main === module) {
  module.exports();
}
