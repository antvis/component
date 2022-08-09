import { Group, Rect, Text } from '@antv/g';
import { deepMix, get, isUndefined } from '@antv/util';
import { GUI } from '../../core/gui';
import { SIZE_STYLE, TYPE_STYLE, DISABLED_STYLE } from './constant';
import { deepAssign, getEllipsisText, getStateStyle, maybeAppend, applyStyle, normalPadding } from '../../util';
import { Marker } from '../marker';
import type { ButtonCfg, ButtonOptions, IMarkerCfg } from './types';
import type { TextProps, RectProps } from '../../types';

export type { ButtonCfg, ButtonOptions };

export class Button extends GUI<ButtonCfg> {
  /**
   * 组件类型
   */
  public static tag = 'button';

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Button.tag,
    style: {
      cursor: 'pointer',
      padding: 10,
      size: 'middle',
      type: 'default',
      text: '',
      markerAlign: 'left',
      markerSpacing: 5,
      textStyle: {
        default: {},
        active: {},
      },
      buttonStyle: {
        default: {
          lineWidth: 1,
          radius: 5,
        },
        active: {},
      },
      markerStyle: {
        default: {},
      },
    },
  };

  /**
   * 文本
   */
  private textShape!: Text;

  private state: 'default' | 'active' | 'disabled' = 'default';

  private get markerSize(): number {
    const { marker: markerSymbol } = this.attributes;
    const markerStyle = this.getStyle('markerStyle');
    const markerSize = !markerSymbol ? 0 : markerStyle?.size || 2;
    return markerSize;
  }

  /**
   * 获得 button 文本
   */
  private get text(): string {
    const { text } = this.attributes;
    if (text === '') {
      return text;
    }
    /* 可用宽度 */
    const width = this.textAvailableWidth;
    return getEllipsisText(text, width);
  }

  /* 获得文本可用宽度 */
  private get textAvailableWidth(): number {
    const { marker, padding, ellipsis, width: bWidth, markerSpacing: spacing } = this.attributes;
    if (!ellipsis) return Infinity;
    /* 按钮总宽度 */
    const width = (isUndefined(bWidth) ? (this.getStyle('buttonStyle') as RectProps).width : bWidth) as number;
    if (marker) return width - padding! * 2 - spacing! - this.markerSize;
    return width - padding! * 2;
  }

  private get buttonHeight(): number {
    const { height } = this.attributes;
    if (height) return height;
    return (this.getStyle('buttonStyle') as RectProps).height as number;
  }

  constructor(options: ButtonOptions) {
    super(deepAssign({}, Button.defaultOptions, options));
  }

  /**
   * 根据size、type属性生成实际渲染的属性
   */
  private getStyle(name: 'textStyle', state?: 'default' | 'active'): TextProps;

  private getStyle(name: 'buttonStyle', state?: 'default' | 'active'): RectProps;

  private getStyle(name: 'markerStyle', state?: 'default' | 'active'): IMarkerCfg;

  private getStyle(name: 'textStyle' | 'buttonStyle' | 'markerStyle'): TextProps | RectProps | IMarkerCfg {
    const { size, type } = this.attributes;
    const state = this.state;
    const mixedStyle = deepMix(
      {},
      get(SIZE_STYLE, [size, name]),
      getStateStyle(get(TYPE_STYLE, [type, name]), state),
      getStateStyle(get(this.attributes, name), state, true)
    );

    if (state === 'disabled') {
      // 从DISABLED_STYLE中pick中pick mixedStyle里已有的style
      Object.keys(mixedStyle).forEach((key) => {
        if (key in DISABLED_STYLE[name]) {
          mixedStyle[key] = get(DISABLED_STYLE, [name, key]);
        }
      });
      Object.keys(DISABLED_STYLE.strict[name]).forEach((key) => {
        mixedStyle[key] = get(DISABLED_STYLE, ['strict', name, key]);
      });
      deepMix(mixedStyle, getStateStyle(get(this.attributes, name), 'disabled'));
    }
    return mixedStyle;
  }

  // @todo 处理 markerAlign='right' 的场景. 方案: left marker & right marker 处理为两个 shape, 互相不干扰
  public render(attributes: ButtonCfg, container: Group) {
    const { padding, marker: markerSymbol, markerSpacing = 0 } = attributes;
    container.attr('cursor', this.state === 'disabled' ? 'not-allowed' : 'pointer');
    const [pt, pr, pb, pl] = normalPadding(padding);
    const height = this.buttonHeight;

    const markerStyle = this.getStyle('markerStyle');
    const { markerSize } = this;
    const markerShape = maybeAppend(
      container,
      '.marker',
      () => new Marker({ className: 'marker', style: { symbol: 'circle' } })
    )
      .call((selection) => {
        (selection.node() as Marker).update({
          ...markerStyle,
          symbol: markerSymbol,
          x: pl + markerSize / 2,
          y: height / 2,
          size: markerSize,
        });
      })
      .node() as Marker;

    const bounds = markerShape.getLocalBounds();

    const { text = '' } = this;
    const textStyle = this.getStyle('textStyle');
    this.textShape = maybeAppend(container, '.text', 'text')
      .attr('className', 'text')
      .style('x', markerSize ? bounds.max[0] + markerSpacing : pl)
      .style('y', height / 2)
      .style('text', text)
      .style('textAlign', 'left')
      .style('textBaseline', 'middle')
      .call(applyStyle, textStyle)
      .node() as Text;

    const textBounds = this.textShape.getLocalBounds();
    const buttonStyle = this.getStyle('buttonStyle') as RectProps;

    maybeAppend(container, '.background', 'rect')
      .attr('className', 'background')
      .style('zIndex', -1)
      .call(applyStyle, buttonStyle)
      .style('height', height)
      .style('width', pl + (markerSize ? markerSize + markerSpacing : 0) + textBounds.halfExtents[0] * 2 + pr)
      .node();
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<ButtonCfg> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    const { state = 'default' } = this.attributes;
    // 更新状态
    this.state = state;
    this.render(this.attributes, this);
  }

  /** 更新状态 (不需要走 update) */
  public setState(state: 'disabled' | 'active' | 'default') {
    this.update({ state });
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
    const { onClick, state } = this.attributes;
    // 点击事件
    state !== 'disabled' && onClick?.call(this, this);
  };

  private mouseenterEvent = () => {
    const { state } = this.attributes;
    if (state !== 'disabled') {
      this.state = 'active';
      this.render(this.attributes, this);
    }
  };

  private mouseleaveEvent = () => {
    const { state = 'default' } = this.attributes;
    this.state = state;
    this.render(this.attributes, this);
  };

  public bindEvents(): void {
    this.addEventListener('click', this.clickEvents);
    this.addEventListener('mouseenter', this.mouseenterEvent);
    this.addEventListener('mouseleave', this.mouseleaveEvent);
  }
}
