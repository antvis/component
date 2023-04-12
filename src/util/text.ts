import { isString, memoize } from '@antv/util';
import type { Text } from '../shapes';

let ctx: CanvasRenderingContext2D;

/**
 * 计算文本在画布中的宽度
 */
export const measureTextWidth = memoize(
  (text: string | Text, font?: any): number => {
    const content = isString(text) ? text : text.style.text.toString();
    const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } = font || getFont(text as Text);
    if (!ctx) {
      ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
    }
    ctx!.font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
    return ctx!.measureText(content).width;
  },
  (text: any, font?: any) =>
    [isString(text) ? text : text.style.text.toString(), Object.values(font || getFont(text as Text)).join()].join('')
);

export const getFont = (textShape: Text) => {
  const fontFamily = textShape.style.fontFamily || 'sans-serif';
  const fontWeight = textShape.style.fontWeight || 'normal';
  const fontStyle = textShape.style.fontStyle || 'normal';
  const fontVariant = textShape.style.fontVariant;
  let fontSize = textShape.style.fontSize as any;
  fontSize = typeof fontSize === 'object' ? fontSize.value : fontSize;
  return { fontSize: fontSize as number, fontFamily, fontWeight, fontStyle, fontVariant };
};
