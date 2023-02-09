import { CustomElement, DisplayObjectConfig, Group } from '@antv/g';
import { deepAssign } from '../util';
import type { GenericAnimation, AnimationResult } from '../animation';

export abstract class GUI<T> extends CustomElement<T> {
  constructor(config: DisplayObjectConfig<T>) {
    super(config);
  }

  connectedCallback() {
    this.render(this.attributes as Required<T>, this);
    this.bindEvents(this.attributes, this);
  }

  public update(cfg: Partial<T> = {}, animate?: GenericAnimation) {
    this.attr(deepAssign({}, this.attributes, cfg));
    return this.render?.(this.attributes as Required<T>, this, animate);
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

  public abstract render(attributes: T, container: Group, animate?: GenericAnimation): any;

  public bindEvents(attributes: T, container: Group): void {}
}
