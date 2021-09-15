import type { TextProps, ShapeAttrs, DisplayObjectConfig } from '../../types';

export const decorationType = ['overline', 'line-through', 'underline'] as const;
export const decorationShape = ['solid', 'wavy', 'double', 'dashed', 'dotted'] as const;

export type DecorationLine = typeof decorationType[number];
export type DecorationShape = typeof decorationShape[number];

export interface DecorationCfg extends ShapeAttrs {
  width: number;
  height: number;
  fontSize: number;
  // 上中下三种线的悬挂位置
  hangingRate?: [number, number, number];
  type?: 'none' | Array<DecorationLine | [DecorationLine, DecorationShape]>;
  // 线条默认颜色使用文字颜色
  style?: ShapeAttrs;
}

export type DecorationOptions = DisplayObjectConfig<DecorationCfg>;

export interface TextCfg
  extends Omit<ShapeAttrs, 'transform'>,
    Pick<
      TextProps,
      'fontStyle' | 'fontSize' | 'fontFamily' | 'fontWeight' | 'fontVariant' | 'letterSpacing' | 'leading'
    > {
  x?: number;
  y?: number;
  text?: string;
  // 容器宽度，为auto时根据文字实际宽度自动设置
  width?: number | 'auto';
  // 容器高度，为auto时根据文字实际高度自动设置
  height?: number | 'auto';
  // 行高
  lineHeight?: number;
  // 指定宽度可用
  textAlign?: 'start' | 'center' | 'end';
  // 指定行高可用
  verticalAlign?: 'top' | 'middle' | 'bottom' /** | 'sub' | 'sup' */;
  // 文字颜色
  fontColor: string;
  decoration?: Pick<DecorationCfg, 'type' | 'style'>;
  // 指定宽度可用
  // 超出宽度处理：none-不做任何处理 clip-裁切 ellipsis-使用...省略 string-使用 给定string 省略
  overflow?: 'none' | 'clip' | 'ellipsis' | string;
  // 转换 none-不做任何处理 capitalize-单词首字母大写 uppercase-大写 lowercase-小写
  transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  backgroundStyle?: ShapeAttrs;
}

export type TextOptions = DisplayObjectConfig<TextCfg>;
