import { CustomElement, DisplayObjectConfig, Group } from '@antv/g';
import { deepMix } from '@antv/util';

export abstract class GUI<T> extends CustomElement<T> {
  constructor(config: DisplayObjectConfig<T>) {
    super(config);
  }

  connectedCallback() {
    // 临时修复初始化 x, y 设置不生效
    // @ts-ignore
    const { x, y } = this.style;
    this.setLocalPosition([x || 0, y || 0]);

    this.update();
    this.bindEvents(this.attributes, this);
  }

  public update(cfg: Partial<T> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render?.(this.attributes, this);
  }

  public clear() {
    this.removeChildren(true);
  }

  public destroy() {
    this.removeAllEventListeners();
    this.removeChildren(true);
    this.remove();
  }

  public abstract render(attributes: T, container: Group): void;

  public bindEvents(attributes: T, container: Group): void {}
}
