import { CustomElement, DisplayObjectConfig } from '@antv/g';
import { deepMix } from '@antv/util';
import { deepAssign } from './deep-assign';

type Descriptor<T> = {
  render?: (attributes: T, container: CustomElement<T>) => void;
  bindEvents?: (attributes: T, container: CustomElement<T>) => void;
};

export abstract class GUI<T> extends CustomElement<T> {
  abstract update(cfg?: Partial<T>): void;
}

export function createComponent<T>(
  descriptor: Descriptor<T>,
  defaultStyle?: Partial<T>
): new (c: DisplayObjectConfig<T>) => GUI<T> {
  return class extends CustomElement<T> {
    public descriptor: Descriptor<T>;

    constructor(config: DisplayObjectConfig<T>) {
      super(deepAssign({}, { style: defaultStyle }, config));
      this.descriptor = descriptor;
    }

    connectedCallback() {
      this.descriptor.render?.(this.attributes, this);
      this.descriptor.bindEvents?.(this.attributes, this);
    }

    public update(cfg: Partial<T> = {}) {
      this.attr(deepMix({}, this.attributes, cfg));
      this.descriptor.render?.(this.attributes, this);
    }

    attributeChangedCallback() {
      this.descriptor.render?.(this.attributes, this);
    }
  };
}
