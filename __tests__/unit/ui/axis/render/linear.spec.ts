import { Linear } from '../../../../../src/ui/axis/linear';
import { createCanvas } from '../../../../utils/render';
import { BAND_SCALE_DATA_8, LINEAR_SCALE_DATA } from './data';

const size = 500;
const canvas = createCanvas(size, undefined, true);

describe('Linear axis', () => {
  it('new Linear({...}) should render a linear axis', () => {
    const axis = new Linear({
      style: {
        startPos: [40, 40],
        endPos: [240, 40],
        title: { content: 'Title', titleAnchor: 'start', style: { fill: 'black', fontWeight: 'bold' } },
        ticks: LINEAR_SCALE_DATA,
        label: { autoHide: true },
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a vertical linear axis', () => {
    const axis = new Linear({
      style: {
        startPos: [80, 120],
        endPos: [80, 320],
        // note: 是否取消 titlePadding 的设置.
        title: { content: 'Title', titleAnchor: 'center', style: { fill: 'black', fontWeight: 'bold', dy: -4 } },
        ticks: LINEAR_SCALE_DATA,
        label: { autoHide: true },
        verticalFactor: -1,
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a vertical linear axis, with band scale data', () => {
    const axis = new Linear({
      style: {
        startPos: [220, 120],
        endPos: [220, 240],
        title: {
          content: 'variety',
          titleAnchor: 'start',
          rotate: 0,
          style: { fontSize: 10, fill: 'black', fontWeight: 'bold', dy: -4, textAlign: 'right' },
          positionX: 0,
          positionY: 0,
        },
        ticks: BAND_SCALE_DATA_8,
        label: { autoHide: true, style: { fontSize: 10, fill: 'black' } },
        verticalFactor: -1,
      },
    });

    canvas.appendChild(axis);
    axis.update({ title: { titleAnchor: 'end' } });
  });
});
