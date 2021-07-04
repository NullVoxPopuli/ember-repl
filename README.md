ember-play
==============================================================================

Tools for easily creating your own Ember Playground / REPL and/or Interactive
StyleGuide for your design system.

_This package will include all available dev-time dependencies provided by
ember + glimmer as well as `@babel/standalone`._
Your payload will be affected and Embroider is recommended
with maximum strictness enabled so automatic bundle splitting occurs to help
your app's initial time-to-interactive/etc stats.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.27 or above
* Ember CLI v3.27 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-play
```


Usage
------------------------------------------------------------------------------

This library currently uses a CommonJS technique for modules, but as browser-support
permits, this library will eventually switch to using a web-worker with an import-map
for lightning fast, eval-free REPLing.

```js
import { compile } from 'ember-play';

compile({ code: 'gjs code', name: 'component-name' });

```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
