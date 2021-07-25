import { CustomElement, SceneGraphNode } from '@antv/g';

export abstract class GUI<O = unknown> extends CustomElement {
  public static tag: string = 'gui';

  /**
   * fixme 暂时复写下，为了类型定义 后续移除
   * @override
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes
   */
  get attributes(): O {
    return this.entity.getComponent(SceneGraphNode).attributes as any;
  }

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
