import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { compileHBS, compileJS } from 'ember-play';

module('Usage', function (hooks) {
  setupRenderingTest(hooks);

  test('template-only', async function (assert) {
    assert.expect(5);

    this.setProperties({
      compile: () => {
        let template = `
          {{#each (array 1 2) as |num|}}
            <output>{{num}}</output>
          {{/each}}
        `;

        let { factory, name, error } = compileHBS(template);

        assert.notOk(error);
        assert.ok(name);

        return factory;
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

  test('with JS', async function (assert) {
    assert.expect(6);

    this.setProperties({
      compile: () => {
        let template = `
          import Component from '@glimmer/component';
          import { tracked } from '@glimmer/tracking';
          import { on } from '@ember/modifier';

          export default class MyComponent extends Component {
            @tracked value = 0;

            increment = () => value++;

            <template>
              <output>{{this.value}}</output>
              <button {{on "click" this.increment}}>+1</button>
            </template>
          }
        `;

        let { factory, name, error } = compileJS(template);

        assert.notOk(error);
        assert.ok(name);

        return factory;
      },
    });

    await render(
      hbs`
        {{#let (this.compile) as |CustomComponent|}}
          <CustomComponent />
        {{/let}}
      `
    );

    assert.dom('output').exists();
    assert.dom('output').hasText('0');

    await click('button');
    assert.dom('output').hasText('1');

    await click('button');
    assert.dom('output').hasText('2');
  });
});
