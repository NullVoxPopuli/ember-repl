'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    'ember-cli-babel': {
      enableTypeScriptTransform: true
    },
  },

  included(app) {
    // Adds:
    //  - ember-template-compiler
    //  - @glimmer/syntax
    app.import('vendor/ember/ember-template-compiler.js');
  },
};
