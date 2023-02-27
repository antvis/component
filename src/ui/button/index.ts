import { Group } from '@antv/g';
import { deepMix, isUndefined } from '@antv/util';
import { GUI, PartialStyleProps, RequiredStyleProps } from '../../core';
import type { RectProps } from '../../types';
import { maybeAppend, parseSeriesAttr, select, subObject } from '../../util';
import { Marker } from '../marker';
import { Text } from '../text';
import { DISABLED_STYLE, SIZE_STYLE, TYPE_STYLE } from './constant';
import type { ButtonOptions, ButtonStyleProps } from './types';

export type { ButtonStyleProps, ButtonOptions };

export class Button extends GUI<RequiredStyleProps<ButtonStyleProps>> {
  /**
   * 组件类型
   */
  public static tag = 'button';

  /**
   * 文本
   */
  private textShape!: Text;

  private state: 'default' | 'active' | 'disabled' = 'default';

  private get markerSize(): number {
    const {
      style: { markerSymbol },
    } = this.attributes;
    const markerStyle = this.getStyle('marker');
    const markerSize = !markerSymbol ? 0 : markerStyle?.size || 2;
    return markerSize;
  }

  /* 获得文本可用宽度 */
  private get textAvailableWidth(): number {
    const {
      style: { markerSymbol, padding, ellipsis, width: bWidth, markerSpacing: spacing },
    } = this.attributes;
    if (!ellipsis) return Infinity;
    /* 按钮总宽度 */
    const width = (isUndefined(bWidth) ? (this.getStyle('button') as RectProps).width : bWidth) as number;
    if (markerSymbol) return width - padding! * 2 - spacing! - this.markerSize;
    return width - padding! * 2;
  }

  private get buttonHeight(): number {
    const {
      style: { height },
    } = this.attributes;
    if (height) return +height;
    return +this.getStyle('button').height;
  }

  constructor(options: ButtonOptions) {
    super(options, {
      style: {
        cursor: 'pointer',
        padding: 10,
        size: 'middle',
        type: 'default',
        text: '',
        state: 'default',
        markerAlign: 'left',
        markerSpacing: 5,
        default: {
          buttonLineWidth: 1,
          buttonRadius: 5,
        },
        active: {},
      },
    });
  }

  /**
   * 根据size、type属性生成实际渲染的属性
   */
  private getStyle(name: string) {
    const {
      style: { size, type },
    } = this.attributes;
    const { state } = this;
    const mixedStyle = deepMix(
      {},
      SIZE_STYLE[size],
      TYPE_STYLE[type][state],
      this.attributes.style!.default,
      this.attributes.style![state]
    );

    if (state === 'disabled') {
      // 从DISABLED_STYLE中pick中pick mixedStyle里已有的style
      Object.keys(mixedStyle).forEach((key) => {
        if (key in DISABLED_STYLE) {
          // @ts-ignore
          mixedStyle[key] = DISABLED_STYLE[key];
        }
      });
      Object.keys(DISABLED_STYLE.strict).forEach((key) => {
        // @ts-ignore
        mixedStyle[key] = DISABLED_STYLE.strict[key];
      });
      deepMix(mixedStyle, this.attributes.style!.disabled || {});
    }
    return subObject(mixedStyle, name);
  }

  // @todo 处理 markerAlign='right' 的场景. 方案: left marker & right marker 处理为两个 shape, 互相不干扰
  public render(attributes: RequiredStyleProps<ButtonStyleProps>, container: Group) {
    const {
      style: { text = '', padding = 0, markerSymbol, markerSpacing = 0 },
    } = attributes;
    container.attr('cursor', this.state === 'disabled' ? 'not-allowed' : 'pointer');
    const [pt, pr, pb, pl] = parseSeriesAttr(padding);
    const height = this.buttonHeight;

    const markerStyle = this.getStyle('marker');

    const { markerSize } = this;
    const style = {
      style: { ...markerStyle, symbol: markerSymbol, x: pl + markerSize / 2, y: height / 2, size: markerSize },
    };
    const markerShape = maybeAppend(container, '.marker', () => new Marker({ className: 'marker', style }))
      .update({ style })
      .node() as Marker;

    const bounds = markerShape.getLocalBounds();

    const textStyle = this.getStyle('text');
    this.textShape = maybeAppend(container, '.text', 'text')
      .attr('className', 'text')
      .styles({
        x: markerSize ? bounds.max[0] + markerSpacing : pl,
        y: height / 2,
        ...textStyle,
        text,
        textAlign: 'left',
        textBaseline: 'middle',
        wordWrap: true,
        wordWrapWidth: this.textAvailableWidth,
        maxLines: 1,
        textOverflow: '...',
      })
      .node() as Text;

    const textBounds = this.textShape.getLocalBounds();
    const buttonStyle = this.getStyle('button') as RectProps;

    select(container)
      .maybeAppendByClassName('.background', 'rect')
      .styles({
        zIndex: -1,
        ...buttonStyle,
        height,
        width: pl + (markerSize ? markerSize + markerSpacing : 0) + textBounds.halfExtents[0] * 2 + pr,
      });
  }

  /**
   * 组件的更新
   */
  public update(attr: PartialStyleProps<ButtonStyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, attr));
    const {
      style: { state },
    } = this.attributes;
    // 更新状态
    this.state = state;
    this.render(this.attributes, this);
  }

  /** 更新状态 (不需要走 update) */
  public setState(state: 'disabled' | 'active' | 'default') {
    this.update({ style: { state } });
  }

  public hide() {
    // @ts-ignore
    this.style.visibility = 'hidden';
  }

  public show() {
    // @ts-ignore
    this.style.visibility = 'visible';
  }

  private clickEvents = () => {
    const {
      style: { onClick, state },
    } = this.attributes;
    // 点击事件
    if (state !== 'disabled') onClick?.call(this, this);
  };

  private mouseenterEvent = () => {
    const {
      style: { state },
    } = this.attributes;
    if (state !== 'disabled') {
      this.state = 'active';
      this.render(this.attributes, this);
    }
  };

  private mouseleaveEvent = () => {
    const {
      style: { state },
    } = this.attributes;
    this.state = state;
    this.render(this.attributes, this);
  };

  public bindEvents(): void {
    this.addEventListener('click', this.clickEvents);
    this.addEventListener('mouseenter', this.mouseenterEvent);
    this.addEventListener('mouseleave', this.mouseleaveEvent);
  }
}
