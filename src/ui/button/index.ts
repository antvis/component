import { Rect, Text } from '@antv/g';
import { deepMix, get, isUndefined } from '@antv/util';
import { GUI } from '../core/gui';
import { SIZE_STYLE, TYPE_STYLE, DISABLED_STYLE } from './constant';
import { getEllipsisText, measureTextWidth, getFont, getStateStyle, getShapeSpace } from '../../util';
import { Marker } from '../marker';
import type { ButtonCfg, ButtonOptions, IMarkerCfg } from './types';
import type { TextProps, RectProps } from '../../types';

export type { ButtonCfg, ButtonOptions };

export class Button extends GUI<ButtonCfg> {
  /**
   * 标签类型
   */
  public static tag = 'button';

  private markerShape!: Marker;

  /**
   * 文本
   */
  private textShape!: Text;

  /**
   * 按钮容器
   */
  private backgroundShape!: Rect;

  private get disabled() {
    return this.attributes.disabled;
  }

  private get markerWidth(): number {
    if (this.markerShape.isVisible()) {
      const { size } = this.getStyle('markerStyle') as IMarkerCfg;
      return size!;
    }
    return 0;
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

  private get textWidth(): number {
    if (this.textShape.attr('text') === '') {
      return 0;
    }
    return measureTextWidth(this.text, getFont(this.textShape));
  }

  /* 获得文本可用宽度 */
  private get textAvailableWidth(): number {
    const { marker, padding, ellipsis, width: bWidth, markerSpacing: spacing } = this.attributes;
    if (!ellipsis) return Infinity;
    /* 按钮总宽度 */
    const width = isUndefined(bWidth) ? (this.getStyle('buttonStyle') as RectProps).width : bWidth;
    if (marker) return width - padding! * 2 - spacing! - this.markerWidth;
    return width - padding! * 2;
  }

  /**
   * 根据文本和marker来计算按钮宽度
   */
  private get buttonWidth() {
    const { marker, padding, width: bWidth, ellipsis, markerSpacing: spacing } = this.attributes;
    if (!isUndefined(bWidth)) return bWidth;
    if (ellipsis) return (this.getStyle('buttonStyle') as RectProps).width;
    const text = this.textShape.attr('text');
    const { markerWidth } = this;
    const { textWidth } = this;
    let width = padding! * 2;

    if (marker) {
      if (text !== '') width += markerWidth + textWidth + spacing!;
      else width += markerWidth;
    } else if (text !== '') width += textWidth;
    return width;
  }

  private get buttonHeight() {
    const { height } = this.attributes;
    if (height) return height;
    return (this.getStyle('buttonStyle') as RectProps).height;
  }

  constructor(options: ButtonOptions) {
    super(deepMix({}, Button.defaultOptions, options));
    this.initShape();
    this.init();
  }

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Button.tag,
    style: {
      disabled: false,
      padding: 10,
      size: 'middle',
      type: 'default',
      text: '',
      markerAlign: 'left',
      markerSpacing: 5,
      textStyle: {
        default: {
          textAlign: 'center',
          textBaseline: 'middle',
        },
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
   * 根据size、type属性生成实际渲染的属性
   */
  private getStyle(
    name: 'textStyle' | 'buttonStyle' | 'markerStyle',
    state: 'default' | 'active' = 'default'
  ): TextProps | RectProps | IMarkerCfg {
    const { size, type, disabled } = this.attributes;
    const mixedStyle = deepMix(
      {},
      get(SIZE_STYLE, [size, name]),
      getStateStyle(get(TYPE_STYLE, [type, name]), state),
      getStateStyle(get(this.attributes, name), state, true)
    );

    if (disabled) {
      // 从DISABLED_STYLE中pick中pick mixedStyle里已有的style
      Object.keys(mixedStyle).forEach((key) => {
        if (key in DISABLED_STYLE[name]) {
          mixedStyle[key] = get(DISABLED_STYLE, [name, key]);
        }
      });
      Object.keys(DISABLED_STYLE.strict[name]).forEach((key) => {
        mixedStyle[key] = get(DISABLED_STYLE, ['strict', name, key]);
      });
    }
    return mixedStyle;
  }

  /**
   * 初始化button
   */
  public init(): void {
    this.updateMarker();
    this.updateText();
    this.updateButton();
    this.adjustLayout();
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<ButtonCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.updateMarker();
    this.updateText();
    this.updateButton();
    this.adjustLayout();
  }

  /**
   * 组件的清除
   */
  public clear() {}

  private initShape() {
    this.markerShape = new Marker({
      name: 'marker',
      style: { symbol: 'circle', ...this.getStyle('markerStyle') },
    });
    this.textShape = new Text({ name: 'text', style: { text: '' } });
    this.backgroundShape = new Rect({ name: 'background', style: { width: 0, height: 0 } });
    this.backgroundShape.appendChild(this.markerShape);
    this.backgroundShape.appendChild(this.textShape);
    this.appendChild(this.backgroundShape);
  }

  private updateMarker() {
    const { marker } = this.attributes;
    if (isUndefined(marker)) this.markerShape.hide();
    else {
      this.markerShape.update({
        symbol: marker,
        ...this.getStyle('markerStyle'),
      });
      this.markerShape.show();
    }
  }

  /**
   * 更新文本内容和样式
   */
  private updateText() {
    const { disabled } = this.attributes;
    const { text } = this;
    if (text === '') this.textShape.hide();
    else {
      this.textShape.attr({ text, cursor: disabled ? 'not-allowed' : 'default', ...this.getStyle('textStyle') });
      this.textShape.show();
    }
  }

  private updateButton() {
    const height = this.buttonHeight;
    const buttonStyle = this.getStyle('buttonStyle') as RectProps;
    this.backgroundShape.attr({ ...buttonStyle, height });
  }

  private bindEvents(): void {
    const { disabled, onClick } = this.attributes;

    this.addEventListener('click', () => {
      // 点击事件
      !this.disabled && onClick?.call(this, this);
    });

    this.addEventListener('mouseenter', () => {
      if (!disabled) {
        // 鼠标悬浮事件
        this.markerShape.update(this.getStyle('markerStyle', 'active'));
        this.textShape.attr(this.getStyle('textStyle', 'active'));
        this.backgroundShape.attr({
          ...this.getStyle('buttonStyle', 'active'),
          width: this.buttonWidth,
          height: this.buttonHeight,
        });
      }
    });
    this.addEventListener('mouseleave', () => {
      // 恢复默认状态
      this.markerShape.update(this.getStyle('markerStyle'));
      this.textShape.attr(this.getStyle('textStyle'));
      this.backgroundShape.attr({
        ...this.getStyle('buttonStyle'),
        width: this.buttonWidth,
        height: this.buttonHeight,
      });
    });
  }

  private adjustLayout() {
    const { padding, marker, markerAlign: align, markerSpacing: spacing } = this.attributes;
    const width = this.buttonWidth;
    const height = this.buttonHeight;
    const halfButtonWidth = width / 2;
    const halfTextWidth = this.textWidth / 2;
    const text = this.textShape.attr('text');
    let textX = 0;
    let markerX = 0;
    const markerY = height / 2;
    const textY = height / 2;

    if (marker) {
      const { markerWidth } = this;
      const halfMarkerWidth = markerWidth / 2;
      if (text === '') markerX = halfButtonWidth;
      else if (align === 'left') {
        markerX = halfMarkerWidth + padding!;
        textX = padding! + markerWidth + spacing! + halfTextWidth;
      } else {
        markerX = this.buttonWidth - padding! - halfMarkerWidth;
        textX = padding! + halfTextWidth;
      }
    } else if (text !== '') textX = halfButtonWidth;

    this.markerShape.attr({ x: markerX, y: markerY });
    this.textShape.attr({ x: textX, y: textY });

    // 设置button宽度
    this.backgroundShape.attr({ width: this.buttonWidth });
  }
}
