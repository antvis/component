import { CustomElement } from '@antv/g';

export abstract class GUI<O = unknown> extends CustomElement {
  public static tag: string = 'gui';

  /**
   * 组件初始化
   */
  public abstract init(): void;

  /**
   * 组件的更新
   */
  public abstract update(cfg: O): void;

  /**
   * 组件的清除
   */
  public abstract clear(): void;
}
