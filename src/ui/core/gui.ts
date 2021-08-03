import { CustomElement } from '@antv/g';

export abstract class GUI<CustomAttr> extends CustomElement<CustomAttr> {
  public static tag: string = 'gui';

  connectedCallback(): void {}

  disconnectedCallback(): void {}

  attributeChangedCallback<Key extends keyof CustomAttr>(
    name: Key,
    oldValue: CustomAttr[Key],
    value: CustomAttr[Key]
  ): void {}

  /**
   * 组件初始化
   */
  public abstract init(): void;

  /**
   * 组件的更新
   */
  public abstract update(cfg: CustomAttr): void;

  /**
   * 组件的清除
   */
  public abstract clear(): void;
}
