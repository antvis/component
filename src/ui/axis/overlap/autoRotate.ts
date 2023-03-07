import { isArray, isNil } from '@antv/util';
import type { DisplayObject } from '../../../shapes';
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
  const { optionalAngles = [0, 45, 90], margin, recoverWhenFailed = true } = overlapCfg;
  const defaultAngles = labels.map((label) => label.getLocalEulerAngles());
  const runAndPassed = () => {
    const res = boundTest(labels, margin).length < 1;
    return res;
  };
  const setLabelsRotate = (angle: RotateType | RotateType[]) =>
    labels.forEach((label, index) => {
      const rotate = isArray(angle) ? angle[index] : angle;
      utils.rotate(label, +rotate);
    });

  for (let i = 0; i < optionalAngles.length; i++) {
    setLabelsRotate(optionalAngles[i]);
    if (runAndPassed()) return;
  }
  recoverWhenFailed && setLabelsRotate(defaultAngles);
}
