import { IElement, Rect } from '@antv/g';
import { Axis } from '../../src';
import { onAnimatesFinished } from '../../src/animation';
import { createCanvas } from '../utils/render';
import { CLASS_NAMES } from '../../src/ui/axis/constant';

const isVisible = (item: IElement) => {
  return item.getAttribute('visibility') === 'visible';
};

const canvas = createCanvas(523, 'svg');

describe('G2 6373', () => {
  it('basic', async () => {
    const data1 = [
      { label: '2024-01', value: 0.2, id: '1' },
      { label: '2024-02', value: 0.4, id: '2' },
      { label: '2024-03', value: 0.8, id: '3' },
    ];

    const data2 = [
      { label: '2024-01', value: 0.4, id: '1' },
      { label: '2024-03', value: 0.7, id: '2' },
    ];

    const fontSize = 12;

    const axis = new Axis({
      style: {
        animate: { duration: 300 },
        labelOverlap: [{ type: 'hide' }],
        labelFormatter: (d) => {
          const rect = new Rect({
            style: {
              x: 0,
              y: 0,
              opacity: 1,
              width: ((d.label?.toString() ?? '').length * fontSize) / 2,
              height: fontSize,
            },
          });
          return rect;
        },
        showLabel: true,
        showGrid: false,
        showTick: true,
        showLine: true,
        data: data1,
        endPos: [300, 50],
        labelAlign: 'horizontal',
        labelDirection: 'positive',
        labelFill: '#000',
        labelFillOpacity: 0.65,
        labelFontSize: fontSize,
        labelFontWeight: 'lighter',
        labelSpacing: 12,
        labelTransform: 'translate(-50%, 0)',
        lineArrow: undefined,
        lineLineWidth: 0.5,
        lineOpacity: 0,
        lineStroke: '#000',
        lineStrokeOpacity: 0.45,
        startPos: [45, 50],
        tickDirection: 'positive',
        tickLength: 4,
        tickLineWidth: 1,
        tickStroke: '#000',
        tickStrokeOpacity: 0.25,
        type: 'linear',
      },
    });

    canvas.appendChild(axis);

    let items = axis.querySelectorAll(CLASS_NAMES.labelItem.class);

    expect(items.length).toBe(3);

    expect(items.every(isVisible)).toBe(true);

    const updateRes = axis.update({ data: data2 });

    if (updateRes) {
      await new Promise<void>((res) => {
        onAnimatesFinished(updateRes, res);
      });
    }

    items = axis.querySelectorAll(CLASS_NAMES.labelItem.class);

    expect(items.length).toBe(2);

    expect(items.every(isVisible)).toBe(true);
  });
});
