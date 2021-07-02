ember-play
==============================================================================

Tools for easily creating your own Ember Playground / REPL and/or Interactive
StyleGuide for your design system.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.16 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


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
