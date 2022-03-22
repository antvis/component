import { Text as GText, Rect, Group } from '@antv/g';
import { pick, max, isNumber } from '@antv/util';
import { Decoration } from './decoration';
import { deepAssign, transform, getEllipsisText, getShapeSpace, measureTextWidth } from '../../util';
import { GUI } from '../../core/gui';
import type { TextCfg, TextOptions, DecorationCfg } from './types';
import type { TextProps } from '../../types';

export type { TextCfg, TextOptions };

/**
 * 渲染流程
 * 1. transform
 * 2. create text shape
 * 3. overflow
 * 4. layout
 * 5. create decoration
 * 6. create background
 * 7. set anchor
 */

export class Text extends GUI<Required<TextCfg>> {
  public static tag = 'paragraph';

  private static defaultOptions = {
    type: Text.tag,
    style: {
      text: '',

      fontColor: '#000',
      fontFamily: 'sans-serif',
      fontSize: 12,
      fontWeight: 'normal',
      fontVariant: 'normal',
      letterSpacing: 0,
      leading: 0,
      fontStyle: 'normal',

      decoration: {
        type: 'none',
        style: {},
      },

      overflow: 'none',
      backgroundStyle: {},
      transform: 'none',
      tooltip: false,
      tooltipWait: 300,
    },
  };

  /**
   * 文字行宽
   * 如果多行则取最长宽度
   * 在文字渲染之前也可获得
   */
  public get textWidth(): number {
    return max(this.renderText.split('\n').map((text) => measureTextWidth(text, this.font))) || 0;
  }

  public get textHeight(): number {
    return getShapeSpace(this.textShape).height;
  }

  /**
   * 文本包围盒宽度
   */
  public get width(): number {
    const { width } = this.attributes;
    // 度量文字长度
    if (width === 'auto' || width === undefined || width === 0) return this.textWidth;
    return width;
  }

  /**
   * 文本包围盒高度
   */
  public get height(): number {
    const { height } = this.attributes;
    if (isNumber(height) && height !== 0) return height;
    return getShapeSpace(this.textShape).height;
  }

  private get lineHeight(): number {
    const { lineHeight, fontSize } = this.attributes;
    if (!lineHeight || lineHeight === 0) return fontSize as number;
    return lineHeight;
  }

  /**
   * 单词字母首大写
   */
  private get capitalizeWord() {
    const { text } = this.attributes;
    // 对每个词、每行进行 transform
    return text
      .split('\n')
      .map((line) => {
        return line
          .split(' ')
          .map((word) => {
            return transform(word, 'capitalize');
          })
          .join(' ');
      })
      .join('\n');
  }

  /**
   * transform 后的文本
   */
  private get text() {
    const { transform: tf, text } = this.attributes;
    if (tf === 'capitalize') return this.capitalizeWord;
    return transform(text, tf);
  }

  private get ellipsisText() {
    const { text } = this;
    const { width, overflow } = this.attributes;
    const placeholder = (overflow === 'ellipsis' ? '...' : overflow) as string;
    return text
      .split('\n')
      .map((line) => {
        return getEllipsisText(line, isNumber(width) ? width : Infinity, this.font, placeholder);
      })
      .join('\n');
  }

  /**
   * 最终渲染的文本
   */
  private get renderText() {
    const { width } = this.attributes;
    const { overflow } = this.attributes;
    if (overflow && !['none', 'clip', 'wrap'].includes(overflow) && isNumber(width)) return this.ellipsisText;
    return this.text;
  }

  private get verticalAlign() {
    const { verticalAlign } = this.attributes;
    return verticalAlign;
  }

  private get font() {
    return pick(this.attributes, [
      'fontSize',
      'fontFamily',
      'fontWeight',
      'fontStyle',
      'fontVariant',
      'letterSpacing',
      'leading',
    ]);
  }

  private get fontColor() {
    const { fontColor } = this.attributes;
    return fontColor;
  }

  private get wordWrap(): boolean {
    const { overflow } = this.attributes;
    return overflow === 'wrap';
  }

  private get wordWrapWidth(): number {
    const { width, wordWrap } = this;
    if (!wordWrap) return Infinity;
    return width;
  }

  private get textCfg(): TextProps {
    const { renderText, lineHeight, wordWrap, wordWrapWidth, fontColor: fill } = this;
    return {
      ...this.font,
      fill,
      wordWrap,
      lineHeight,
      wordWrapWidth,
      text: renderText,
      textAlign: 'start',
      textBaseline: 'middle',
    };
  }

  private get backgroundCfg() {
    const { width, height } = this;
    const { backgroundStyle } = this.attributes;
    return {
      x: 0,
      y: 0,
      width,
      height,
      ...backgroundStyle,
    };
  }

  private get decorationLineWidth() {
    const { fontSize } = this.attributes;
    return Math.floor(Math.log10(fontSize as number) * 2);
  }

  private get decorationCfg(): DecorationCfg[] {
    const { decoration, fontSize } = this.attributes;
    const { decorationLineWidth: lineWidth, fontColor: stroke } = this;
    return this.textShape.getLineBoundingRects().map((bbox) => {
      return deepAssign({}, { fontSize, style: { stroke, lineWidth } }, decoration, bbox);
    });
  }

  private get clipRectCfg() {
    const { height } = this;
    // 此时width一定存在
    const { width } = this.attributes;
    return { width, height } as { width: number; height: number };
  }

  private textShape!: GText;

  private decorationGroup!: Group;

  /** 装饰线条 */
  private decorationShape!: Decoration;

  private backgroundShape!: Rect;

  /** 裁切矩形 */
  private clipRect!: Rect;

  constructor(options: TextOptions) {
    super(deepAssign({}, Text.defaultOptions, options));
    this.init();
  }

  public init() {
    this.initShape();
    this.update({});
  }

  public update(cfg: Partial<TextCfg>) {
    this.attr(deepAssign({}, this.attributes, cfg));
    this.clear();
    this.backgroundShape.attr(this.backgroundCfg);
    this.textShape.attr(this.textCfg);
    this.layout();
    this.decorationGroup.removeChildren(true);
    this.decorationCfg.forEach((cfg) => {
      this.decorationGroup.appendChild(new Decoration({ style: cfg }));
    });
  }

  public clear() {
    // 移除clipPath
    this.backgroundShape.style.clipPath = null;
    this.clipRect?.destroy();
  }

  private initShape() {
    this.backgroundShape = new Rect({ name: 'background', style: { width: 0, height: 0 } });
    // this.decorationShape = new Decoration({ name: 'decoration' });
    this.decorationGroup = new Group({ name: 'decoration-group' });
    this.textShape = new GText({ name: 'text', style: this.textCfg });
    this.textShape.appendChild(this.decorationGroup);
    this.backgroundShape.appendChild(this.textShape);
    this.appendChild(this.backgroundShape);
  }

  private overflow() {
    const { wordWrap } = this;
    const { width, overflow } = this.attributes;
    // 为false\开启换行\未width数值, 则不进行操作
    if (!overflow || overflow === 'none' || wordWrap || !isNumber(width)) return;
    if (overflow === 'clip') {
      // 裁切
      this.clipRect = new Rect({ name: 'clip-rect', style: this.clipRectCfg });
      this.backgroundShape.style.clipPath = this.clipRect;
    }
  }

  private adjustTextAlign() {
    const { textWidth } = this;
    const { width, textAlign } = this.attributes;
    if (!isNumber(width)) return;
    let xOffset = 0;
    if (textAlign === 'start') xOffset = 0;
    else if (textAlign === 'center') xOffset = (this.width - textWidth) / 2;
    else xOffset = this.width - textWidth;
    this.textShape.attr({ x: xOffset });
  }

  private adjustVerticalAlign() {
    const { verticalAlign, textHeight } = this;
    let yOffset = 0;
    if (verticalAlign === 'top') yOffset = textHeight / 2;
    else if (verticalAlign === 'middle') yOffset = this.height / 2;
    else yOffset = this.height - textHeight / 2;
    this.textShape.attr({ y: yOffset });
  }

  private layout() {
    this.adjustTextAlign();
    this.adjustVerticalAlign();
    this.overflow();
  }
}
