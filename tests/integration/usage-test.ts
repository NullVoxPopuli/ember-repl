import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@ember/test-helpers';

import { compileJS, compileHBS } from 'ember-play';

module('Usage', function (hooks) {
  setupRenderingTest(hooks);

  test('template-only', async function (assert) {
    this.setProperties({
      compile: () => {
        let template = `
          {{#each (array 1 2) as |num|}}
            <output>{{num}}</output>
          {{/each}}
        `;

        let { factory, name, error } = compileHBS(template);


      },
    });

    await render(
      hbs`
        {{#let (this.compile) as |CustomComponent|}}
          <CustomComponent />
        {{/let}}
      `
    );

  });

  test('with JS', async function (assert) {
    assert.expect(0);
  });
});
