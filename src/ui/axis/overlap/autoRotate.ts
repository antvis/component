import type { DisplayObject } from '@antv/g';
import { isArray, isNil } from 'lodash';
import { getTransform } from '../../../util';
import { AxisStyleProps, RotateOverlapCfg } from '../types';
import { boundTest } from '../utils/helper';

export type Utils = {
  rotate: (label: DisplayObject, rotate: number | string) => void;
};

type RotateType = Parameters<Utils['rotate']>[1];

export default function adjustAngle(
  labels: DisplayObject[],
  overlapCfg: RotateOverlapCfg,
  cfg: AxisStyleProps,
  utils: Utils
) {
  const { optionalAngles = [0, 45, 90], margin, recoverWhenFailed } = overlapCfg;
  const defaultAngles = labels.map((label) => +(getTransform(label, 'rotate') || 0));
  const runAndPassed = () => boundTest(labels, margin).length < 1;
  const setLabelsRotate = (angle: RotateType | RotateType[]) =>
    labels.forEach((label, index) => {
      const rotate = isArray(angle) ? angle[index] : angle;
      !isNil(rotate) && utils.rotate(label, rotate);
    });
  if (runAndPassed()) return;
  for (let i = 0; i < optionalAngles.length; i++) {
    setLabelsRotate(optionalAngles[i]);
    if (runAndPassed()) return;
  }
  recoverWhenFailed && setLabelsRotate(defaultAngles);
}
