import { Rect, Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../core/gui';
import { Marker } from '../marker';
import type { DisplayObject } from '../../types';
import type { IconAttrs, IconOptions } from './types';

export type { IconOptions };

/**
 * 带文本的 图标组件，支持 iconfont 组件
 */
export class Icon extends GUI<IconAttrs> {
  /**
   * 标签类型
   */
  public static tag = 'icon';

  private markerShape: GUI;

  private textShape: DisplayObject;

  private backgroundShape: DisplayObject;

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Icon.tag,
    attrs: {
      size: 16,
      fill: '#1890ff',
      spacing: 8,
      markerStyle: {
        fill: '#1890ff',
      },
      textStyle: {
        fontSize: 12,
        textAlign: 'left',
        textBaseline: 'middle',
        fill: '#000',
      },
    },
  };

  constructor(options: IconOptions) {
    super(deepMix({}, Icon.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {}

  /**
   * 根据 type 获取 maker shape
   */
  public init(): void {
    // marker
    this.markerShape = new Marker({
      name: 'tag-marker',
      attrs: this.getMarkerAttrs(),
    });
    this.appendChild(this.markerShape);

    // text
    this.textShape = new Text({
      name: 'tag-text',
      attrs: this.getTextAttrs(),
    });
    this.appendChild(this.textShape);

    // background
    this.backgroundShape = new Rect({
      name: 'tag-background',
      attrs: this.getBackgroundAttrs(),
    });
    this.appendChild(this.backgroundShape);
    this.backgroundShape.toBack();
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: IconAttrs) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.markerShape.update(this.getMarkerAttrs());
    this.textShape.attr(this.getTextAttrs());
    this.backgroundShape.attr(this.getBackgroundAttrs());
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.markerShape.destroy();
    this.textShape.destroy();
    this.backgroundShape.destroy();
  }

  private bindEvents() {
    this.on('mouseenter', () => {
      this.backgroundShape.attr('fill', '#F5F5F5');
    });

    this.on('mouseleave', () => {
      this.backgroundShape.attr('fill', '#fff');
    });
  }

  private getMarkerAttrs() {
    const { symbol, size, fill, markerStyle } = this.attributes;
    return {
      symbol,
      ...markerStyle,
      fill,
      r: size / 2,
    };
  }

  private getTextAttrs() {
    const { size, spacing, text, textStyle } = this.attributes;
    return {
      x: size / 2 + spacing,
      y: 0,
      ...textStyle,
      text,
    };
  }

  private getBackgroundAttrs() {
    const { size } = this.attributes;
    const bbox = this.getBounds();
    return {
      x: -size / 2 - 1,
      y: -size / 2 - 1,
      width: bbox.getMax()[0] - bbox.getMin()[0],
      height: bbox.getMax()[1] - bbox.getMin()[1],
      radius: 2,
      fill: '#fff',
    };
  }
}
