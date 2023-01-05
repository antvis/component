import { CustomElement, DisplayObjectConfig, Group } from '@antv/g';
import { deepAssign } from '../util';

export abstract class GUI<T> extends CustomElement<T> {
  constructor(config: DisplayObjectConfig<T>) {
    super(config);
  }

  connectedCallback() {
    this.render(this.attributes as Required<T>, this);
    this.bindEvents(this.attributes, this);
  }

  public update(cfg: Partial<T> = {}) {
    this.attr(deepAssign({}, this.attributes, cfg));
    this.render?.(this.attributes as Required<T>, this);
  }

  public clear() {
    this.removeChildren();
  }

  public destroy() {
    this.removeAllEventListeners();
    this.removeChildren();
    this.remove();
  }

  attributeChangedCallback() {}

  public abstract render(attributes: T, container: Group): void;

  public bindEvents(attributes: T, container: Group): void {}
}
