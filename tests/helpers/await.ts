import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { setComponentTemplate } from '@ember/component';
import { isDestroyed, isDestroying } from '@ember/destroyable';
import { hbs } from 'ember-cli-htmlbars';

interface Args {
  promise: Promise<unknown>;
}

export class Await extends Component<Args> {
  @tracked resolved: unknown;
  @tracked error?: Error;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    args.promise
      .then((resolved) => {
        if (isDestroying(this) || isDestroyed(this)) return;

        this.resolved = resolved;
      })
      .catch((error) => {
        if (isDestroying(this) || isDestroyed(this)) return;

        this.error = error;
      });
  }

  get isPending() {
    return !this.resolved;
  }
}

setComponentTemplate(
  hbs`
  {{#if this.error}}
    Error: {{this.error}}
  {{else if this.isPending}}
    Building...
  {{else}}
    <this.resolved />
  {{/if}}
  `,
  Await
);
