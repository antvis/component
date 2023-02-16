import { Text, type DisplayObject } from '@antv/g';
import type { RequiredStyleProps } from '../../../core';
import type { AxisStyleProps, LabelOverlapCfg } from '../types';
import ellipsis, { type Utils as EllipsisUtils } from './autoEllipsis';
import hide, { type Utils as HideUtils } from './autoHide';
import rotate, { type Utils as RotateUtils } from './autoRotate';

export type OverlapCallback = (labels: Text[], overlapCfg: any, cfg: AxisStyleProps, utils: any) => any;

export type OverlapUtilsType = EllipsisUtils & HideUtils & RotateUtils;

export const OverlapUtils = new Map<string, any>([
  ['hide', hide],
  ['rotate', rotate],
  ['ellipsis', ellipsis],
]);

export function canProcessOverlap(
  labels: DisplayObject[],
  attr: RequiredStyleProps<AxisStyleProps>,
  type: LabelOverlapCfg['type']
) {
  if (!attr.labelTransform) return false;
  // if (type === 'rotate') return !labels.some((label) => hasSetRotate(label.attr('transform')));
  if (type === 'ellipsis') return labels.map((item) => item.querySelector('text')).length > 1;
  return true;
}

export function processOverlap(
  labels: DisplayObject[],
  attr: RequiredStyleProps<AxisStyleProps>,
  utils: OverlapUtilsType
) {
  const { labelTransform: overlapOrder = [] } = attr;
  if (!overlapOrder.length) return;
  overlapOrder.forEach((overlapCfg) => {
    const { type } = overlapCfg;
    const util = OverlapUtils.get(type);
    if (canProcessOverlap(labels, attr, type)) util?.(labels as any[], overlapCfg, attr, utils);
  });
}
