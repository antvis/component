import { RectStyleProps } from '@antv/g';
import { TEXT_INHERITABLE_PROPS } from '../../util';
import { LabelProps } from '../../types';

// 默认文本样式
export const LABEL_TEXT_STYLE = {
  ...TEXT_INHERITABLE_PROPS,
  fill: 'rgba(0,0,0,0.45)',
  fontSize: 10,
  textAlign: 'start',
  textBaseline: 'middle',
  overflow: 'clip',
} as LabelProps['textStyle'];

export const CHECKBOX_RECT_STYLE = {
  default: {
    width: 12,
    height: 12,
    radius: 2,
    stroke: '#dadada',
    lineWidth: 1,
    fill: '#ffffff',
    cursor: 'pointer',
  } as RectStyleProps,
  selected: {
    width: 12,
    height: 12,
    radius: 2,
    stroke: '#3471F9',
    lineWidth: 1,
    fill: '#3471F9',
    cursor: 'pointer',
  } as RectStyleProps,
};

const CHECKED_SHAPE_PATH = [
  ['M', 3, 6],
  ['L', '5', '8.5'],
  ['L', '8.5', '4'],
] as any;

export const CHECKED_SHAPE_STYLE = {
  path: CHECKED_SHAPE_PATH,
  lineWidth: 1,
  cursor: 'pointer',
};
