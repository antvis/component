import { Rect, Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { getStateStyle, normalPadding } from '../../util';
import { GUI } from '../core/gui';
import { Marker } from '../marker';
import type { DisplayObject } from '../../types';
import type { TagAttrs, TagOptions } from './types';

export type { TagOptions };

/**
 * 带文本的 图标组件，支持 iconfont 组件
 */
export class Tag extends GUI<TagAttrs> {
  /**
   * 标签类型
   */
  public static tag = 'tag';

  private markerShape: GUI;

  private textShape: DisplayObject;

  private backgroundShape: DisplayObject;

  /**
   * 默认参数
   */
  public static defaultOptions = {
    type: Tag.tag,
    attrs: {
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
    } as TagAttrs,
  };

  constructor(options: TagOptions) {
    super(deepMix({}, Tag.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {}

  /**
   * 根据 type 获取 maker shape
   */
  public init(): void {
    this.createBackground();
    this.createMarker();
    this.createText();
    this.autoFit();
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<TagAttrs>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.markerShape.attr(this.getMarkerAttrs());
    this.textShape.attr(this.getTextAttrs());
    this.backgroundShape.attr(this.getBackgroundAttrs());
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

  /**
   * 创建 background
   */
  private createBackground() {
    this.backgroundShape = new Rect({
      name: 'tag-background',
      attrs: this.getBackgroundAttrs(),
    });
    this.appendChild(this.backgroundShape);
    this.backgroundShape.toBack();
  }

  private getBackgroundAttrs() {
    const { backgroundStyle, radius = 0 } = this.attributes;
    return {
      ...backgroundStyle?.default,
      x: 0,
      y: 0,
      radius,
    };
  }

  /**
   * 创建 marker
   */
  private createMarker() {
    this.markerShape = new Marker({
      name: 'tag-marker',
      attrs: this.getMarkerAttrs(),
    });
    this.backgroundShape.appendChild(this.markerShape);
  }

  private getMarkerAttrs() {
    const { marker } = this.attributes;
    return marker;
  }

  /**
   * 创建 text
   */
  private createText() {
    this.textShape = new Text({
      name: 'tag-text',
      attrs: this.getTextAttrs(),
    });
    this.backgroundShape.appendChild(this.textShape);
  }

  private getTextAttrs() {
    const { text, textStyle } = this.attributes;

    return {
      ...textStyle.default,
      x: 0,
      y: 0,
      text,
    };
  }

  private autoFit() {
    const { padding, spacing } = this.attributes;

    const [p0, p1, p2, p3] = normalPadding(padding);
    let width = p1 + p3;
    let height = 0;

    if (this.markerShape?.attr('size')) {
      const markerRect = this.markerShape.getBoundingClientRect();
      width += markerRect.width + spacing;
      height = Math.max(height, markerRect.height);
    }
    if (this.textShape) {
      const { width: tWidth, height: tHeight } = this.textShape.getBoundingClientRect();
      width += tWidth;
      height = Math.max(height, tHeight);
    }

    height += p0 + p2;

    // background
    this.backgroundShape.attr({ width, height });
    // marker
    this.markerShape.setLocalPosition(p3 + this.markerShape.getBoundingClientRect().width / 2, height / 2);
    // text
    let textX = p3;
    if (this.markerShape?.attr('size')) {
      textX += this.markerShape.getBoundingClientRect().width + spacing;
    }
    // 设置 局部坐标系 下的位置
    this.textShape.setLocalPosition(textX, height / 2);
  }

  private bindEvents() {
    this.on('mouseenter', () => {
      const { backgroundStyle, textStyle } = this.attributes;
      this.textShape.attr(getStateStyle(textStyle, 'active', true));
      this.backgroundShape.attr(getStateStyle(backgroundStyle, 'active', true));
      this.autoFit();
    });

    this.on('mouseleave', () => {
      this.textShape.attr(this.getTextAttrs());
      this.backgroundShape.attr(this.getBackgroundAttrs());
      this.autoFit();
    });
  }
}
