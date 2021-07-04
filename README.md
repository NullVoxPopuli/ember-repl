# ember-play

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
ember install ember-play
```


## Usage

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { compileJS } from 'ember-play';

export class Renderer extends Component {
  @tracked myComponent;

  constructor(...args) {
    super(...args);

    compileJS('...').then(Component => this.myComponent = Component);
  }
}
```
```hbs
{{#if this.myComponent}}
  <this.myComponent />
{{/if}}
```


**A Note on Capabilities**
This library currently uses a CommonJS technique for modules, but as browser-support
permits, this library will eventually switch to using a web-worker with an import-map
for lightning fast, `eval`-free REPLing. (But the same security caution below would
still apply)

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
