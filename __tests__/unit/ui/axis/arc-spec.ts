import { Path, Group } from '@antv/g';
import { Band as BandScale } from '@antv/scale';
import { Arc, ArcAxisStyleProps } from '../../../../src';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(600);
const domain = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const scale = new BandScale({ domain });
const ticks = domain.map((d) => ({ value: scale.map(d), text: d }));

const createAxis = (style: ArcAxisStyleProps = { radius: 10, center: [50, 50] }) => {
  const axis = new Arc({ style });
  return axis;
};

describe('Arc axis', () => {
  describe('new Arc({}) should create a arc axis', () => {
    const arc = createAxis({ center: [400, 400], radius: 60 });
    canvas.appendChild(arc);

    let tickLines = arc.querySelectorAll('.axis-tick') as Path[];

    it('Arc axis radius', async () => {
      expect(arc).toBeDefined();
      arc.update({
        startAngle: 0,
        endAngle: 270,
        radius: 100,
        center: [150, 100],
        axisLine: { style: { lineWidth: 1, stroke: 'red' } },
      });
      await canvas.ready;
      const axisLine = arc.querySelector('.axis-line') as Path;
      const { min, max } = axisLine.getBounds();
      expect(max[0] - min[0]).toBe(100 * 2);
      expect((max[0] + min[0]) / 2).toBe(150);
      expect((max[1] + min[1]) / 2).toBe(100);
    });

    it('Arc axis line, ({ axisLine: {} })', async () => {
      await canvas.ready;
      const axisLine = arc.querySelector('.axis-line') as Path;
      expect(axisLine).toBeDefined();
      arc.update({ startAngle: -90, axisLine: { style: { stroke: 'red', lineWidth: 3 } } });
      expect(axisLine.style.stroke).toBe('red');
      expect(axisLine.style.lineWidth).toBe(3);
    });

    it('Arc axis line arrow', () => {
      // @ts-ignore
      // expect(arc.axisEndArrow.getEulerAngles()).toBeCloseTo(-90);
    });

    it('Arc axis label, support ({ label: { formatter, style: { ... } }})', () => {
      const formatter = (d: any) => `hello_${d.text}`;
      arc.update({ ticks, label: { formatter, style: { fill: 'red', textAlign: 'center' }, autoHide: false } });

      const axisLabels = arc.querySelectorAll('.axis-label');
      expect(axisLabels.length).toBe(ticks.length);
      expect(axisLabels.map((d) => d.style.text)).toEqual(ticks.map((d) => formatter(d)));

      const label0 = axisLabels[0];
      expect(label0.style.fill).toBe('red');

      arc.update({
        label: {
          style: (d: any, idx: number) => {
            return idx === 0 ? { textAlign: 'start' } : { textAlign: 'end' };
          },
        },
      });
      // Keep previous settings
      expect(label0.style.fill).toBe('red');
      expect(label0.style.textAlign).toBe('start');
      // set undefined, so that could use inferStyle
      arc.update({ label: { style: { textAlign: undefined } } });
    });

    it('Arc axis tickLine, support ({ tickLine: { len, style: { ... } }})', () => {
      arc.update({ ticks, tickLine: { len: 6, style: { lineWidth: 2, stroke: 'black' } } });

      tickLines = arc.querySelectorAll('.axis-tick') as Path[];
      expect(tickLines.length).toBe(ticks.length);
      const tickLine0 = tickLines[0];

      const { x1, y1, x2, y2 } = tickLine0.attr() as any;
      expect(+x2 - +x1).toBeCloseTo(0);
      expect(Math.abs(+y2 - +y1)).toBe(6);
      expect(tickLine0.style.stroke).toBe('black');
      expect(tickLine0.style.lineWidth).toBe(2);
    });

    it('Arc axis subTickLine, support ({ subTickLine: { len, count, style: { ... } }})', () => {
      arc.update({ ticks, subTickLine: { len: 4, count: 2, style: { stroke: 'blue', lineWidth: 3 } } });
      const subTickLines = arc.querySelectorAll('.axis-subtick') as Path[];

      expect(subTickLines.length).toBe(ticks.length * 2);
      const subTickLine0 = subTickLines[0];
      const { x1, y1, x2, y2 } = subTickLine0.attr() as any;
      expect(Math.abs(+y2 - +y1)).toBeCloseTo(4, 0);
      expect(subTickLine0.style.stroke).toBe('blue');
      expect(subTickLine0.style.lineWidth).toBe(3);
    });

    afterAll(() => {
      arc.destroy();
      canvas.removeChild(arc);
    });
  });

  describe('Axis label layout', () => {
    const filter = (labels: any[]) => labels.filter((d) => d.style.visibility === 'visible');

    it('autoHide in `normal` align label', () => {
      const arc1 = createAxis({
        ticks,
        radius: 60,
        label: { formatter: (d: any) => `hello_${d.text}` },
        center: [200, 140],
      });
      canvas.appendChild(arc1);
      const arc = createAxis({
        ticks,
        radius: 60,
        center: [460, 140],
        label: {
          formatter: (d: any) => `hello_${d.text}`,
          autoHideTickLine: true,
          autoHide: 'greedy',
          autoEllipsis: false,
          autoRotate: false,
          style: {
            // fontSize: 10,
          },
        },
      });
      canvas.appendChild(arc);

      const labels = arc.querySelectorAll('.axis-label');
      let visibleLabels = filter(labels);
      let visibleTickLines = filter(arc.querySelectorAll('.axis-tick'));
      // todo
      // expect(visibleLabels.length).toBeLessThan(arc1.querySelectorAll('.axis-label').length);
      expect(visibleTickLines.length).toBe(visibleLabels.length + 1);

      expect(labels[0].style.visibility).toBe('visible');
      // todo
      // expect(labels[1].style.visibility).toBe('hidden');
      expect(labels[2].style.visibility).toBe('visible');

      arc.update({ label: { autoHideTickLine: false } });

      visibleLabels = filter(arc.querySelectorAll('.axis-label'));
      visibleTickLines = filter(arc.querySelectorAll('.axis-tick'));
      expect(visibleTickLines.length).toBe(arc.style!.ticks!.length);
      arc.remove();
      arc1.remove();
      canvas.removeChild(arc);
      canvas.removeChild(arc1);
    });

    it('autoHide in radial align', () => {
      const arc = createAxis({
        ticks,
        radius: 60,
        center: [460, 400],
        label: {
          formatter: (d: any) => `hello_${d.text}`,
          align: 'radial',
          autoHide: { type: 'greedy' },
        },
      });
      canvas.appendChild(arc);
      // todo
      // expect(filter(arc.querySelectorAll('.axis-label')).length).toBe(ticks.length);
      arc.remove();
      canvas.removeChild(arc);
    });

    it('autoEllipsis in tangential align', () => {
      const arc = canvas.appendChild(
        new Arc({
          style: {
            ticks,
            radius: 96,
            center: [300, 300],
            label: {
              align: 'tangential',
              autoEllipsis: true,
              style: { fontSize: 10 },
            },
          },
        })
      );
      const labels = arc.querySelectorAll('.axis-label');
      expect(filter(labels).length).toBe(ticks.length);
      expect(labels.some((d) => d.style.text.endsWith('...'))).toBe(false);

      arc.update({ label: { style: { fontSize: 13 } } });
      expect(labels.some((d) => d.style.text.endsWith('...'))).toBe(true);
    });
  });
});
