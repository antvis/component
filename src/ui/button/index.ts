import { Rect, Text } from '@antv/g';
import { deepMix, get } from '@antv/util';
import { GUI } from '../core/gui';
import { SIZE_STYLE, TYPE_STYLE, DISABLED_STYLE } from './constant';
import { getEllipsisText, measureTextWidth, getFont, getStateStyle } from '../../util';
import type { ButtonCfg, ButtonOptions } from './types';
import type { TextProps, RectProps } from '../../types';

export type { ButtonCfg, ButtonOptions };

export class Button extends GUI<Required<ButtonCfg>> {
  /**
   * 标签类型
   */
  public static tag = 'button';

  /**
   * 文本
   */
  private textShape!: Text;

  /**
   * 按钮容器
   */
  private backgroundShape!: Rect;

  constructor(options: ButtonOptions) {
    super(deepMix({}, Button.defaultOptions, options));
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
    },
  };

  /**
   * 根据size、type属性生成实际渲染的属性
   */
  private getStyle(name: 'textStyle' | 'buttonStyle', state: 'default' | 'active' = 'default'): TextProps & RectProps {
    const { size, type, disabled } = this.attributes;
    const mixedStyle = deepMix(
      {},
      get(SIZE_STYLE, [size, name]),
      getStateStyle(get(TYPE_STYLE, [type, name]), state),
      getStateStyle(this.attributes[name], state)
    );

    if (disabled && state !== 'active') {
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
    this.initShape();
    this.createText();
    this.createButton();
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<ButtonCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
  }

  /**
   * 组件的清除
   */
  public clear() {}

  private initShape() {
    // 初始化成员变量
    this.textShape = new Text({ name: 'text', style: this.getStyle('textStyle') as TextProps });
    this.backgroundShape = new Rect({ name: 'background', style: this.getStyle('buttonStyle') as RectProps });
    this.backgroundShape.appendChild(this.textShape);
    this.appendChild(this.backgroundShape);
  }

  private getButtonWidth() {
    const { ellipsis, text, padding } = this.attributes;
    const { width } = this.getStyle('buttonStyle');
    const textAvailableWidth = width - padding * 2;
    const textWidth = measureTextWidth(text, getFont(this.textShape));
    if (ellipsis && textAvailableWidth < textWidth) {
      return width;
    }
    return textWidth + padding * 2;
  }

  private createText() {
    const { text, padding, disabled } = this.attributes;
    const { height } = this.getStyle('buttonStyle');
    this.textShape.attr({
      x: padding + measureTextWidth(text, getFont(this.textShape)) / 2,
      y: height / 2,
      cursor: disabled ? 'not-allowed' : 'default',
      text,
    });
  }

  private createButton() {
    const { text, padding, ellipsis } = this.attributes;
    const buttonStyle = this.getStyle('buttonStyle');
    /**
     * 文本超长
     *
     * 1. 按钮边长
     * 计算文本实际长度
     * canvas 需要调用ctx.measureText(text).width 方法
     *
     * 2. 省略文本
     */
    const buttonWidth = this.getButtonWidth();
    if (ellipsis) {
      // 需要缩略文本
      const ellipsisText = getEllipsisText(text, buttonWidth - padding * 2, getFont(this.textShape));
      this.textShape.attr({ text: ellipsisText, x: buttonWidth / 2 });
    }

    this.backgroundShape.attr({
      ...buttonStyle,
      width: buttonWidth,
    });
  }

  private bindEvents(): void {
    const { disabled, onClick } = this.attributes;

    if (!disabled && onClick) {
      this.addEventListener('click', () => {
        // 点击事件
        onClick.call(this, this);
      });
    }

    this.addEventListener('mouseenter', () => {
      if (!disabled) {
        // 鼠标悬浮事件
        this.textShape.attr(this.getStyle('textStyle', 'active'));
        this.backgroundShape.attr({ ...this.getStyle('buttonStyle', 'active'), width: this.getButtonWidth() });
      }
    });

    this.addEventListener('mouseleave', () => {
      // 恢复默认状态
      this.textShape.attr(this.getStyle('textStyle'));
      this.backgroundShape.attr({ ...this.getStyle('buttonStyle'), width: this.getButtonWidth() });
    });
  }
}
