import { CustomElement, DisplayObjectConfig, Group } from '@antv/g';
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
  defaultStyle?: T
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
  };
}

export abstract class BaseComponent<T> extends CustomElement<T> {
  constructor(config: DisplayObjectConfig<T>) {
    super(config);
  }

  connectedCallback() {
    this.update();
    this.bindEvents(this.attributes, this);
  }

  public update(cfg: Partial<T> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    // 临时修复 x, y 设置不生效
    // @ts-ignore
    const { x = 0, y = 0 } = this.style;
    this.setLocalPosition([x, y]);
    this.render?.(this.attributes, this);
  }

  public clear() {
    this.removeChildren(true);
  }

  public destroy() {
    this.removeChildren(true);
    this.remove();
  }

  public abstract render(attributes: T, container: Group): void;

  public bindEvents(attributes: T, container: Group): void {}
}
