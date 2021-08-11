import { Rect, Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../core/gui';
import { Marker, MarkerCfg } from '../marker';
import { getStateStyle as getStyle, normalPadding, getShapeSpace } from '../../util';
import type { RectProps, TextProps } from '../../types';
import type { TagCfg, TagOptions } from './types';

export type { TagOptions };

/**
 * 带文本的 图标组件，支持 iconfont 组件
 */
export class Tag extends GUI<Required<TagCfg>> {
  /**
   * 标签类型
   */
  public static tag = 'tag';

  private markerShape!: Marker;

  private textShape!: Text;

  private backgroundShape!: Rect;

  /**
   * 默认参数
   */
  public static defaultOptions = {
    type: Tag.tag,
    style: {
      text: '',
      radius: 2,
      padding: 4,
      textStyle: {
        default: {
          fontSize: 12,
          textAlign: 'left',
          textBaseline: 'middle',
          fill: '#000',
        },
        active: {},
      },
      marker: {
        symbol: 'circle',
        size: 0,
      },
      spacing: 4,
      backgroundStyle: {
        default: {
          fill: '#fafafa',
          stroke: '#d9d9d9',
          lineWidth: 1,
        },
      },
    },
  };

  constructor(options: TagOptions) {
    super(deepMix({}, Tag.defaultOptions, options));
    this.init();
  }

  /**
   * 根据 type 获取 maker shape
   */
  public init(): void {
    this.initShape();
    this.updateBackground();
    this.updateMarker();
    this.updateText();
    this.autoFit();
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<TagCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.updateBackground();
    this.updateMarker();
    this.updateText();
    this.autoFit();
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.markerShape.destroy();
    this.textShape.destroy();
    this.backgroundShape.destroy();
  }

  private initShape() {
    this.markerShape = new Marker({
      name: 'marker',
      style: Tag.defaultOptions.style.marker,
    });
    this.textShape = new Text({
      name: 'text',
      style: {
        text: Tag.defaultOptions.style.text,
      },
    });
    this.backgroundShape = new Rect({ name: 'background' });
    this.backgroundShape.appendChild(this.markerShape);
    this.backgroundShape.appendChild(this.textShape);
    this.appendChild(this.backgroundShape);
    this.backgroundShape.toBack();
  }

  /**
   * 创建 background
   */
  private updateBackground() {
    this.backgroundShape.attr(this.getBackgroundShapeCfg());
  }

  private getBackgroundShapeCfg(): RectProps {
    const { backgroundStyle, radius = 0 } = this.attributes;
    return {
      radius,
      ...(getStyle<Partial<RectProps>>(backgroundStyle) as RectProps),
    };
  }

  /**
   * 创建 marker
   */
  private updateMarker() {
    this.markerShape.update(this.getMarkerShapeCfg());
  }

  private getMarkerShapeCfg(): MarkerCfg {
    const { marker } = this.attributes;
    return marker;
  }

  /**
   * 创建 text
   */
  private updateText() {
    this.textShape.attr(this.getTextShapeCfg());
  }

  private getTextShapeCfg(): TextProps {
    const { text, textStyle } = this.attributes;
    return {
      ...getStyle(textStyle),
      x: 0,
      y: 0,
      text,
    };
  }

  private autoFit() {
    const { padding, spacing, marker, text } = this.attributes;
    const [top, right, bottom, left] = normalPadding(padding);
    const { size = 0 } = marker;

    const { width: markerWidth, height: markerHeight } = getShapeSpace(this.markerShape);
    const { width: textWidth, height: textHeight } = this.textShape.getBoundingClientRect();
    let width = left + right;
    let height = 0;
    if (size > 0) {
      width += markerWidth + spacing;
      height = Math.max(height, markerHeight);
    }
    if (text !== '') {
      width += textWidth;
      height = Math.max(height, textHeight);
    }

    height += top + bottom;

    // background
    this.backgroundShape.attr({ width, height });
    // marker
    this.markerShape.attr({
      x: left + markerWidth / 2,
      y: height / 2,
    });
    // text
    let textX = left;
    if (size) textX += markerWidth + spacing;
    // 设置 局部坐标系 下的位置
    this.textShape.attr({
      x: textX,
      y: height / 2,
    });
  }

  private bindEvents() {
    this.on('mouseenter', () => {
      const { backgroundStyle, textStyle } = this.attributes;
      this.textShape.attr(getStyle(textStyle, 'active', true));
      this.backgroundShape.attr(getStyle(backgroundStyle, 'active', true));
      this.autoFit();
    });

    this.on('mouseleave', () => {
      this.textShape.attr(this.getTextShapeCfg());
      this.backgroundShape.attr(this.getBackgroundShapeCfg());
      this.autoFit();
    });
  }
}
