import { CustomElement } from '@antv/g';

export abstract class GUI<CustomElementStyleProps> extends CustomElement<CustomElementStyleProps> {
  public static tag: string = 'gui';

  connectedCallback(): void {}

  disconnectedCallback(): void {}

  /**
   * 组件初始化
   */
  public abstract init(): void;

  /**
   * 属性发生修改时触发
   */
  attributeChangedCallback?<Key extends keyof CustomElementStyleProps>(
    name: Key,
    oldValue: CustomElementStyleProps[Key],
    newValue: CustomElementStyleProps[Key]
  ): void;

  // 下面的部分是 GUI 自定义的

  /**
   * 组件的更新
   */
  public abstract update(cfg: Partial<CustomElementStyleProps>): void;

  /**
   * 组件的清除
   */
  public clear(): void {}

  public destroy(): void {
    this.removeChildren(true);
    super.destroy();
  }
}
