import { Band } from '@antv/scale';
import { Linear } from '../../../../../src/ui/axis/linear';
import { createCanvas } from '../../../../utils/render';
import { BAND_SCALE_DATA_8, LINEAR_SCALE_DATA } from './data';

const size = 500;
const canvas = createCanvas(size, 'svg', true);

describe('Linear axis', () => {
  it('renders a linear axis with axisLine.', () => {
    const axis = new Linear({
      style: {
        startPos: [40, 0],
        endPos: [240, 0],
        title: { content: 'Default' },
        ticks: LINEAR_SCALE_DATA,
        label: { autoHide: true },
        tickLine: {},
      },
    });

    canvas.appendChild(axis);
  });

  it('renders a linear axis with titlePadding config.', () => {
    const axis = new Linear({
      style: {
        startPos: [40, 50],
        endPos: [240, 50],
        title: { content: 'Default', titlePadding: 6 },
        ticks: LINEAR_SCALE_DATA,
        label: { autoHide: true },
        tickLine: {},
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a linear axis', () => {
    const axis = new Linear({
      style: {
        startPos: [280, 40],
        endPos: [480, 40],
        title: { content: 'Title', titleAnchor: 'center' },
        ticks: LINEAR_SCALE_DATA,
        label: { autoHide: true },
        verticalFactor: -1,
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a vertical linear axis with label hidden.', () => {
    const axis = new Linear({
      style: {
        startPos: [80, 120],
        endPos: [80, 220],
        title: { content: 'Label is null.' },
        ticks: LINEAR_SCALE_DATA,
        label: null,
        verticalFactor: -1,
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a vertical linear axis', () => {
    const axis = new Linear({
      style: {
        startPos: [80, 330],
        endPos: [80, 250],
        title: { content: 'Title', titleAnchor: 'end' },
        ticks: LINEAR_SCALE_DATA,
        label: { style: { fontSize: 10 }, autoHide: true },
        verticalFactor: -1,
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a vertical linear axis', () => {
    const axis = new Linear({
      style: {
        startPos: [120, 330],
        endPos: [120, 250],
        title: { content: 'Title', titleAnchor: 'end', titlePadding: 8 },
        ticks: LINEAR_SCALE_DATA,
        label: { style: { fontSize: 10 }, autoHide: true },
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
          titleAnchor: 'center',
          rotate: -90,
          style: { fontSize: 10, textAlign: 'center' },
          positionX: 0,
          positionY: 0,
        },
        ticks: BAND_SCALE_DATA_8,
        label: { autoHide: true, style: { fontSize: 10, fill: 'black' } },
        verticalFactor: -1,
      },
    });

    canvas.appendChild(axis);
  });

  it('renders() a vertical axis with title align start (titleAnchor=start).', () => {
    const axis = new Linear({
      style: {
        startPos: [380, 120],
        endPos: [380, 240],
        title: {
          content: 'variety',
          titleAnchor: 'start',
          rotate: -90,
          style: { fontSize: 10, dy: -8, textAlign: 'end' },
          positionX: 0,
          positionY: 0,
        },
        ticks: BAND_SCALE_DATA_8,
        label: { autoHide: true, style: { fontSize: 10, fill: 'black' } },
        verticalFactor: -1,
        axisLine: {
          arrow: { start: {}, end: { fill: 'red', stroke: 'red' } },
        },
        tickLine: {},
        subTickLine: { count: 2 },
      },
    });

    canvas.appendChild(axis);
  });

  it('renders() a horizontal axis with label in the top direction', () => {
    const axis = new Linear({
      style: {
        startPos: [120, 380],
        endPos: [480, 380],
        title: {
          content: 'variety →',
          titleAnchor: 'end',
          style: { fontSize: 10, dy: -4 },
          positionX: 0,
          positionY: 0,
        },
        ticks: BAND_SCALE_DATA_8,
        label: { autoHide: true, style: { fontSize: 10, fill: 'black' } },
        verticalFactor: -1,
        axisLine: {
          arrow: { start: {}, end: { fill: 'red', stroke: 'red' } },
        },
        tickLine: {},
        subTickLine: { count: 2 },
      },
    });

    canvas.appendChild(axis);
  });

  it('renders() a horizontal axis with label in the bottom direction', () => {
    const axis = new Linear({
      style: {
        startPos: [120, 420],
        endPos: [480, 420],
        title: {
          content: 'variety →',
          titleAnchor: 'end',
          style: { fontSize: 10, dy: 0 },
          positionX: 0,
          positionY: 0,
        },
        ticks: BAND_SCALE_DATA_8,
        label: { autoHide: true, style: { fontSize: 10, fill: 'black' } },
        axisLine: {
          arrow: { start: {}, end: { fill: 'red', stroke: 'red' } },
        },
        tickLine: {},
        subTickLine: { count: 2 },
      },
    });

    canvas.appendChild(axis);
  });
});
