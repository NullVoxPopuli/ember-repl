'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    autoImport: {
      webpack: {
        node: {
          global: false,
          __filename: true,
          __dirname: true,
        },
        resolve: {
          fallback: {
            path: 'path-browserify',
          },
        },
      },
    },
  },

  included(app) {
    // Adds:
    //  - ember-template-compiler
    //  - @glimmer/syntax
    app.import('vendor/ember/ember-template-compiler.js');
  },
};
