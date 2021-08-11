import { deepMix, get } from '@antv/util';
import { Rect, Text } from '@antv/g';
import { GUI } from '../core/gui';
import { getStateStyle, normalPadding, getShapeSpace } from '../../util';
import { LEGEND_BASE_DEFAULT_OPTIONS } from './constant';
import type { Pair } from '../slider/types';
import type { StyleState, RectProps } from '../../types';
import type { LegendBaseCfg, LegendBaseOptions } from './types';

export abstract class LegendBase<T extends LegendBaseCfg> extends GUI<Required<T>> {
  public static tag = 'legendBase';

  // background
  protected backgroundShape!: Rect;

  protected titleShape!: Text;

  protected static defaultOptions = {
    type: LegendBase.tag,
    ...LEGEND_BASE_DEFAULT_OPTIONS,
  };

  constructor(options: LegendBaseOptions) {
    super(deepMix({}, LegendBase.defaultOptions, options));
  }

  public init() {
    this.createTitle();
  }

  public update(cfg?: Partial<LegendBaseCfg>) {
    this.titleShape.attr(this.getTitleShapeCfg());
    this.adjustTitle();
  }

  /**
   * 背景属性
   */
  protected abstract getBackgroundShapeCfg(): RectProps;

  // 获取对应状态的样式
  protected getStyle(name: string | string[], state?: StyleState) {
    const style = get(this.attributes, name);
    return getStateStyle(style, state);
  }

  /**
   * 根据方向取值
   */
  protected getOrientVal<T>([x, y]: Pair<T>) {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? x : y;
  }

  // 获取padding
  protected getPadding(padding = this.attributes.padding) {
    return normalPadding(padding);
  }

  // 获取容器内可用空间, 排除掉title的空间
  protected getAvailableSpace() {
    // 连续图例不固定外部大小
    // 容器大小 - padding - title
    const spacing = get(this.attributes, ['title', 'spacing']);
    const [top, , , left] = this.getPadding();
    const { height: titleHeight } = getShapeSpace(this.titleShape);

    return {
      x: left,
      y: top + titleHeight + spacing,
    };
  }

  // 绘制背景
  protected createBackground() {
    this.backgroundShape = new Rect({
      name: 'background',
      style: this.getBackgroundShapeCfg(),
    });
    this.appendChild(this.backgroundShape);
    this.backgroundShape.toBack();
  }

  /**
   * 创建图例标题配置
   */
  protected getTitleShapeCfg() {
    const { title } = this.attributes;
    const { content, style, formatter } = title!;

    return {
      ...style,
      text: formatter!(content!),
    };
  }

  /**
   * 创建图例标题
   */
  protected createTitle() {
    this.titleShape = new Text({
      name: 'title',
      style: this.getTitleShapeCfg(),
    });

    this.appendChild(this.titleShape);
  }

  protected adjustTitle() {
    const { title } = this.attributes;
    const { width } = getShapeSpace(this);
    const { align } = title!;
    const [top, right, , left] = this.getPadding();

    let layout!: Object;
    switch (align) {
      case 'left':
        layout = { x: left, y: top, textAlign: 'left' };
        break;
      case 'right':
        layout = { x: width - left - right, y: top, textAlign: 'end' };
        break;
      case 'center':
        layout = { x: (width - left - right) / 2, y: top, textAlign: 'center' };
        break;
      default:
        break;
    }
    this.titleShape.attr(layout);
  }
}
