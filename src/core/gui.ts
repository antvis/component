import { CustomElement, DisplayObjectConfig, Group } from '@antv/g';
import { deepAssign } from '../util';

export abstract class GUI<T> extends CustomElement<T> {
  constructor(config: DisplayObjectConfig<T>) {
    super(config);
  }

  connectedCallback() {
    // 临时修复初始化 x, y 设置不生效
    const { x = 0, y = 0 } = this.style;
    this.setLocalPosition([+x, +y]);

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
