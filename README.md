# ember-repl

[![npm version](https://badge.fury.io/js/ember-repl.svg)](https://badge.fury.io/js/ember-repl)
[![CI](https://github.com/NullVoxPopuli/ember-repl/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/NullVoxPopuli/ember-repl/actions/workflows/ci.yml)

Tools for easily creating your own Ember Playground / REPL and/or Interactive
StyleGuide for your design system.

_This package will include all available dev-time dependencies provided by
ember + glimmer as well as `@babel/standalone`._
Your payload will be affected and Embroider is recommended
with maximum strictness enabled so automatic bundle splitting occurs to help
your app's initial time-to-interactive/etc stats.


## Compatibility

* Ember.js v3.27 or above
* Ember CLI v3.27 or above
* Webpack v5 or above
* ember-auto-import v2 or above
* Node.js v12 or above


## Installation

```
ember install ember-repl
```

## Usage

**`compileJS`**

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { compileJS } from 'ember-repl';

export class Renderer extends Component {
  @tracked myComponent;

  constructor(...args) {
    super(...args);

    compileJS('...').then(({ component }) => this.myComponent = component);
  }
}
```
```hbs
{{#if this.myComponent}}
  <this.myComponent />
{{/if}}
```

**`compileHBS`**

```js
import Component from '@glimmer/component';
import { compileHBS } from 'ember-repl';

export class Renderer extends Component {
  myComponent = compileHBS(this.args.input).component;
}
```
```hbs
<this.myComponent />
```

### Modifiers and Helpers

When writing components / demos / examples using this library, you must use
template-strict mode. Strict mode isn't available by default in proper ember
apps yet. The main difference in strict mode is that all globals must be imported.

Example of a template-only component that only provides a button:

<!-- If you're reading the source for this README, JSX is incorrect, but we
haven't yet PR'd to github for support for this style of writing ember -->
```jsx
import { on } from '@ember/modifier';
import { fn, hash } from '@ember/helper';

<template>
  <button {{on 'click' (fn @callback (hash a=1 b=2))}}>...</button>
</template>
```

For a list of all the imports for things that are global in loose mode, view
the [Strict Mode RFC](https://github.com/emberjs/rfcs/blob/master/text/0496-handlebars-strict-mode.md#keywords)

### Expecting Errors

`compileJS` and `compileHBS` may result an an error.

To handle this, you'll want to make sure that rendering the `component` output is
guarded by either:
 - the truthiness of `component` (which is undefined if `error` is present)
 - the falsiness of `error` (which is undefined if compilation was successful)


Depending on your desired UI/UX, how the async build of updates to input is conveyed
may vary and is not provided by this library.
Here is an example of a way that someone could handle rendering with `compileJS`:

```js
export default class AwaitBuild extends Component {
  @tracked component;
  @tracked error;

  constructor(...args) {
    super(...args);

    compileJS(args.inputText)
      .then(({ component, error }) => {
        this.component = component;
        this.error = error;
      })
      .catch(error => this.error = error);
  }

  get isPending() {
    return !this.component';
  }
}
```
```hbs
{{#if this.error}}
  Error: {{this.error}}
{{else if this.isPending}}
  Building...
{{else}}
  <this.component />
{{/if}}
```


**A Note on Capabilities**
This library currently uses a CommonJS technique for modules, but as browser-support
permits, this library will eventually switch to using a web-worker with an import-map
for lightning fast, `eval`-free REPLing. (But the same security caution below would
still apply)

### API

- `compileJS`: async `{ component, error, name }` - compiles a single JS file
   uses the syntax from [ember-template-imports](https://github.com/ember-template-imports/ember-template-imports)
- `compileHBS`: `{ component, error, name }` - compiles a template-only component with no dependencies
- `invocationOf`: `string` - converts hyphenated text to an `<AngleBracketInvocation />`
- `nameFor`: `string` - generates a component-safe GUID-like derivation from code

_`component`_: invokable from templates
_`error`_: if there is a compilation error, this will be non-falsey
_`name`_: the name assigned to the input text via UUIDv5

### Using in an app that uses Embroider

If you are using the `Webpack` packager, you will need these settings:

```js
packagerOptions: {
  webpackConfig: {
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
```

## Security

Many developers know that evaluating runnable user input is a huge security risk.
To mitigate risk, this library should not be used in an environment that has access to
sensitive data. Additionally, end-users of this library (users of the consuming app) should
be made aware of the risk so that they themselves do not paste foreign / unrecognized /
untrusted code into the REPL.

This library itself will stay as up to date as possible, and if there are any security concerns,
please email security [at] nullvoxpopuli.com

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
