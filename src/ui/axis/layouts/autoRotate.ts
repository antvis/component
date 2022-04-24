import { AxisLabel } from '../types/shape';
import { boundTest } from '../utils/helper';

export function rotateLabel(label: AxisLabel, rotation: number) {
  label.setEulerAngles(rotation);

  const { orient } = label.style;
  const applyStyle = (key: 'textBaseline' | 'textAlign', value: any) => (label.style[key] = value);

  // Choose 8deg and -8deg as threshold.
  if (orient === 'top') {
    if (rotation > 8 || rotation <= -8) applyStyle('textAlign', 'end'), applyStyle('textBaseline', 'middle');
  } else if (orient === 'bottom') {
    if (rotation > 8) applyStyle('textAlign', 'start'), applyStyle('textBaseline', 'middle');
    if (rotation <= -8) applyStyle('textAlign', 'end'), applyStyle('textBaseline', 'middle');
  } else if (orient === 'left' || orient === 'right') {
    if (rotation > 8)
      applyStyle('textAlign', 'center'), applyStyle('textBaseline', orient === 'left' ? 'top' : 'bottom');
    if (rotation < -8)
      applyStyle('textAlign', 'center'), applyStyle('textBaseline', orient === 'right' ? 'top' : 'bottom');
  }
}

export function AutoRotate(labels: AxisLabel[], labelCfg: any) {
  const { optionalAngles = [0, 90] } = labelCfg;
  for (let i = 0; i < optionalAngles.length; i++) {
    labels.forEach((label) => rotateLabel(label, optionalAngles[i]));
    if (boundTest(labels).length < 1) break;
  }
}
