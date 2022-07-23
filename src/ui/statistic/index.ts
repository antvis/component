import { deepMix } from '@antv/util';
import { Rect } from '@antv/g';
import { assign } from 'fecha';
import { GUI } from '../../core/gui';
import { Tag } from '../tag';
import { getStateStyle as getStyle } from '../../util';
import type { RectProps, GUIOption } from '../../types';
import type { TagStyleProps } from '../tag/types';
import type { StatisticCfg, StatisticOptions } from './types';

export type { StatisticCfg, StatisticOptions };

export class Statistic<T extends StatisticCfg = StatisticCfg> extends GUI<Required<T>> {
  /**
   * 组件 tag
   */
  public static tag = 'statistic';

  /** 标题  */
  protected titleShape!: Tag;

  /** 内容 */
  protected valueShape!: Tag;

  /** 背景 */
  private backgroundShape!: Rect;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<StatisticCfg> = {
    type: Statistic.tag,
    style: {
      x: 0,
      y: 0,
      title: {
        // 标题
        text: '',
        textStyle: {
          fontSize: 14,
          fill: 'rgba(0, 0, 0, 0.45)',
        },
      },
      value: {
        text: '',
        textStyle: {
          fontSize: 24,
          fill: 'rgba(0, 0, 0, 0.85)',
        },
      },
      spacing: 5,
    },
  };

  constructor(options: StatisticOptions) {
    super(deepMix({}, Statistic.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.initShape();
    this.update({});
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<T>) {
    this.attr(deepMix({}, this.attributes, cfg));

    // 更新背景
    this.backgroundShape.attr(this.getBackgroundShapeCfg());
    // 更新 title shape
    this.titleShape.update(this.getTitleShapeCfg());
    // 更新 value shape
    this.valueShape.update(this.getValueShapeCfg());
    // this.autoFit();
  }

  private initShape() {
    this.titleShape = new Tag({
      name: 'title',
      style: this.getTitleShapeCfg(),
    });
    this.valueShape = new Tag({
      name: 'value',
      style: this.getValueShapeCfg(),
    });
    this.backgroundShape = new Rect({ name: 'background' });
    this.backgroundShape.appendChild(this.titleShape);
    this.backgroundShape.appendChild(this.valueShape);
    this.appendChild(this.backgroundShape);
    this.backgroundShape.toBack();
  }

  /**
   * 获取背景配置
   */
  private getBackgroundShapeCfg(): RectProps {
    const { backgroundStyle } = this.attributes;
    return getStyle<Partial<RectProps>>(backgroundStyle) as RectProps;
  }

  /**
   * 获取标题配置
   */
  public getTitleShapeCfg(): TagStyleProps {
    const { title } = this.attributes;

    return {
      text: '',
      ...title,
      textStyle: title?.textStyle,
      /** 默认不要背景 */
      backgroundStyle: {
        fill: 'transparent',
        lineWidth: 0,
      },
      padding: 0,
      x: 0,
      y: 0,
    };
  }

  /**
   * 获取内容配置
   */
  public getValueShapeCfg(): TagStyleProps {
    const { value, spacing } = this.attributes;

    let titleHeight = 0;
    if (this.titleShape) {
      const bounds = this.titleShape.getBounds()!;
      titleHeight = bounds.getMax()[1] - bounds.getMin()[1];
    }
    const valueX = 0;
    const valueY = ((spacing as number) + titleHeight) as number;

    return {
      text: '',
      ...value,
      textStyle: value?.textStyle,
      /** 默认不要背景 */
      backgroundStyle: {
        fill: 'transparent',
        lineWidth: 0,
      },
      padding: 0,
      x: valueX,
      y: valueY, // title 文本高度 + spacing 上下间距
    };
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.valueShape.destroy();
    this.titleShape.destroy();
    this.backgroundShape.destroy();
  }
}
