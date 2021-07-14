import { Rect, Text } from '@antv/g';
import { deepMix, pick } from '@antv/util';
import { GUI } from '../core/gui';
import { getEllipsisText } from '../../util';
import type { ShapeAttrs, DisplayObject } from '../../types';
import { SIZE_STYLE, TYPE_STYLE, DISABLED_STYLE } from './constant';
import { ButtonAttrs, ButtonOptions } from './types';

export { ButtonAttrs, ButtonOptions };

export class Button extends GUI<ButtonAttrs> {
  /**
   * 标签类型
   */
  public static tag = 'button';

  /**
   * 文本
   */
  private textShape: DisplayObject;

  /**
   * 按钮容器
   */
  private background: DisplayObject;

  constructor(options: ButtonOptions) {
    super(deepMix({}, Button.defaultOptions, options));

    this.init();
  }

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Button.tag,
    attrs: {
      disabled: false,
      padding: 10,
      size: 'middle',
      type: 'default',
      textStyle: {
        textAlign: 'center',
        textBaseline: 'middle',
      },
      buttonStyle: {
        lineWidth: 1,
        radius: 5,
      },
      hoverStyle: {
        textStyle: {},
        buttonStyle: {},
      },
    },
  };

  attributeChangedCallback(name: string, value: any): void {}

  /**
   * 根据size、type属性生成实际渲染的属性
   */
  private getMixinStyle(name: 'textStyle' | 'buttonStyle' | 'hoverStyle') {
    const { size, type, disabled } = this.attributes;
    const mixedStyle = deepMix(
      {},
      TYPE_STYLE[type][name],
      name === 'hoverStyle' ? {} : SIZE_STYLE[size][name],
      this.attributes[name]
    );

    if (disabled && name !== 'hoverStyle') {
      // 从DISABLED_STYLE中pick中pick mixedStyle里已有的style
      Object.keys(mixedStyle).forEach((key) => {
        if (key in DISABLED_STYLE[name]) {
          mixedStyle[key] = DISABLED_STYLE[name][key];
        }
      });
      Object.keys(DISABLED_STYLE.strict[name]).forEach((key) => {
        mixedStyle[key] = DISABLED_STYLE.strict[name][key];
      });
    }

    return mixedStyle;
  }

  /**
   * 初始化button
   */
  public init(): void {
    const { x, y, text, padding, ellipsis, onClick } = this.attributes;
    const textStyle = this.getMixinStyle('textStyle');
    const buttonStyle = this.getMixinStyle('buttonStyle');

    const { height, width } = buttonStyle;
    const { fontSize } = textStyle;

    this.textShape = new Text({
      attrs: {
        x: 0,
        y: height - fontSize,
        lineHeight: fontSize,
        ...textStyle,
        text,
      },
    });

    /**
     * 文本超长
     *
     * 1. 按钮边长
     * 计算文本实际长度
     * canvas 需要调用ctx.measureText(text).width 方法
     *
     * 2. 省略文本
     */
    const textBbox = this.textShape.getBounds();
    const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0] + padding * 2;
    let newWidth = width;

    if (ellipsis && textWidth > width) {
      // 缩略文本
      const style = pick(this.textShape.attr(), ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'fontVariant']);
      const ellipsisText = getEllipsisText(text, width - padding * 2, style);
      this.textShape.attr('text', ellipsisText);
    } else if (textWidth > newWidth) {
      // 加宽button
      newWidth = textWidth;
      this.attr('buttonStyle', {
        ...buttonStyle,
        width: newWidth,
      });
    }

    this.background = new Rect({
      attrs: {
        x: -newWidth / 2,
        y: 0,
        ...this.getMixinStyle('buttonStyle'),
        // width: newWidth,
      },
    });

    this.appendChild(this.background);
    this.appendChild(this.textShape);

    // 设置位置
    this.translate(x, y);

    this.bindEvents(onClick);
  }

  /**
   * 组件的更新
   */
  public update(cfg: ButtonAttrs) {
    this.attr(deepMix({}, this.attributes, cfg));
  }

  /**
   * 组件的清除
   */
  public clear() {}

  /**
   * 应用多个属性
   */
  private applyAttrs(shape: 'textShape' | 'background', attrs: ShapeAttrs) {
    Object.entries(attrs).forEach((attr) => {
      this[shape].attr(attr[0], attr[1]);
    });
  }

  private bindEvents(onClick: Function): void {
    const { disabled } = this.attributes;

    if (!disabled && onClick) {
      this.on('click', () => {
        // 点击事件
        onClick.call(this, this);
      });
    }

    this.on('mouseenter', () => {
      if (!disabled) {
        // 鼠标悬浮事件
        const hoverStyle = this.getMixinStyle('hoverStyle');
        this.textShape.attr(hoverStyle.textStyle);
        this.background.attr(hoverStyle.buttonStyle);
        this.attr('cursor', 'pointer');
      } else {
        // 设置指针icon
        this.attr('cursor', 'not-allowed');
      }
    });

    this.on('mouseleave', () => {
      // 恢复默认状态
      this.textShape.attr(this.getMixinStyle('textStyle'));
      this.background.attr(this.getMixinStyle('buttonStyle'));
    });
  }
}
