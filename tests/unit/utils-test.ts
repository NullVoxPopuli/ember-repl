import { module, test } from 'qunit';

import { nameFor, invocationOf } from 'ember-play';

module('nameFor()', function () {
  test('it works', function (assert) {
    assert.equal(nameFor('a'), nameFor('a'), 'is stable');
  });
});

module('invocationOf()', function () {
  test('it works', function (assert) {
    assert.equal(invocationOf(''), '< />');
  });
});
