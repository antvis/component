import { Text, type DisplayObject } from '@antv/g';
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

export function canProcessOverlap(labels: DisplayObject[], cfg: AxisStyleProps, type: LabelOverlapCfg['type']) {
  if (!cfg.labelTransforms) return false;
  // if (type === 'rotate') return !labels.some((label) => hasSetRotate(label.attr('transform')));
  if (type === 'ellipsis') return labels.map((item) => item.querySelector('text')).length > 1;
  return true;
}

export function processOverlap(labels: DisplayObject[], cfg: AxisStyleProps, utils: OverlapUtilsType) {
  const { labelTransforms: overlapOrder = [] } = cfg;
  if (!overlapOrder.length) return;
  overlapOrder.forEach((overlapCfg) => {
    const { type } = overlapCfg;
    const util = OverlapUtils.get(type);
    if (canProcessOverlap(labels, cfg, type)) util?.(labels as any[], overlapCfg, cfg, utils);
  });
}
