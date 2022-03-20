import { RectStyleProps } from '@antv/g';
import { LabelProps } from '../../types';

// 默认文本样式
export const LABEL_TEXT_STYLE = {
  stroke: 'rgba(0,0,0,0.45)',
  fontSize: 10,
  lineHeight: 16,
  textAlign: 'start',
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
  active: {
    width: 12,
    height: 12,
    radius: 2,
    stroke: '#3471F9',
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
  disabled: {
    width: 12,
    height: 12,
    radius: 2,
    stroke: '#d9d9d9',
    lineWidth: 1,
    fill: '#f5f5f5',
    cursor: 'no-drop',
  } as RectStyleProps,
};
