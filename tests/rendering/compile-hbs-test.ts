import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { compileHBS } from 'ember-play';

import { Await } from '../helpers/await';

module('compileHBS()', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    assert.expect(5);

    this.setProperties({
      compile: () => {
        let template = `
          {{#each (array 1 2) as |num|}}
            <output>{{num}}</output>
          {{/each}}
        `;

        let { component, name, error } = compileHBS(template);

        assert.notOk(error);
        assert.ok(name);

        return component;
      },
    });

    await render(
      hbs`
        {{#let (this.compile) as |CustomComponent|}}
          <CustomComponent />
        {{/let}}
      `
    );

    assert.dom('output').exists({ count: 2 });
    assert.dom().containsText('1');
    assert.dom().containsText('2');
  });

  module('deliberate errors', function () {
    test('syntax', async function (assert) {
      assert.expect(5);

      this.setProperties({
        await: Await,
        compile: async () => {
          let template = `
          {{#each array 1 2) as |num|}}
            <output>{{num}}</output>
          {{/each}}
        `;

          let { component, name, error } = await compileHBS(template);

          assert.notOk(error);
          assert.ok(name);

          return component;
        },
      });

      await render(
        hbs`
        {{#let (this.compile) as |CustomComponent|}}
          <this.await @promise={{CustomComponent}} />
        {{/let}}
      `
      );

      assert.dom('output').exists({ count: 0 });
      assert.dom().containsText('Error:');
    });
  });
});
