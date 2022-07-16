import { Arc } from '../../../../../src/ui/axis/arc';
import { createCanvas } from '../../../../utils/render';
import { BAND_SCALE_DATA_8, LINEAR_SCALE_DATA } from './data';

const size = 500;
const canvas = createCanvas(size, undefined, true);

describe('Arc axis', () => {
  it('Should renders a linear axis with axisLine.', () => {
    const axis = new Arc({
      style: {
        radius: 60,
        center: [150, 150],
        title: { content: 'Axis' },
        ticks: LINEAR_SCALE_DATA,
      },
    });

    canvas.appendChild(axis);
  });

  it('Should renders a linear axis with axisLine.', () => {
    const axis = new Arc({
      style: {
        startAngle: 0,
        endAngle: 270,
        radius: 60,
        center: [350, 150],
        title: { content: 'Axis' },
        ticks: LINEAR_SCALE_DATA,
        subTickLine: { count: 2 },
        label: { formatter: (d) => `${d.text} ____ hello,`, maxLength: 30 },
      },
    });

    canvas.appendChild(axis);

    // axis.update({ label: { style: { fill: 'red' } } });
  });
});
