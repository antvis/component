import { Text } from '@antv/g';
import { ifNegative, ifPositive, multi } from '../../../util';
import { ifLeft, ifRight, getSign, boundTest } from '../utils';

function rotateLabel(orient: string, label: Text, angle: number) {
  label.setEulerAngles(angle);

  if (angle) {
    const sign = getSign(orient, -1, 1);
    const textAlign: any = ifLeft(
      orient,
      'end',
      ifRight(orient, 'start', ifPositive(multi(sign, angle), 'left', ifNegative(multi(sign, angle), 'right')))
    )!;
    label.style.textAlign = textAlign;
  }
}

export function fixedAngle(orient: string, labels: Text[], labelCfg: any) {
  const { optionalAngles = [0, 45, 90], margin } = labelCfg;
  for (let i = 0; i < optionalAngles.length; i++) {
    labels.forEach((label) => rotateLabel(orient, label, optionalAngles[i]));
    if (boundTest(labels, margin).length < 1) break;
  }
}

export default {
  getDefault: () => fixedAngle,
};
