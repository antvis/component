import { DisplayObject, Text, Path, Group } from '@antv/g';
import {
  Band as BandScale,
  Point as PointScale,
  Pow as PowScale,
  Linear as LinearScale,
  Log as LogScale,
} from '@antv/scale';
import { Axis } from '../../../../src/ui/axis';
import { createCanvas } from '../../../utils/render';
import { BAND_SCALE_DATA_8, LINEAR_SCALE_DATA } from './data';

const size = 500;
const canvas = createCanvas(size, 'svg', true);

const _data = ['ABC', 'BCED', 'DEFGH', 'GHIJKM', 'KMLNOPQ', 'PQRSTVVW', 'VWXYZABC'];
const data = _data.map((d, idx) => {
  const step = 1 / (_data.length - 1);
  return {
    value: step * idx,
    text: String(d),
    id: String(idx),
  };
});

describe('Linear axis with custom axis label', () => {
  const domain = [
    '蚂蚁技术研究院',
    '智能资金',
    '蚂蚁消金',
    '合规线',
    '战略线',
    '商业智能线',
    'CFO线',
    'CTO线',
    '投资线',
    'GR线',
    '社会公益及绿色发展事业群',
    '阿里妈妈事业群',
    'CMO线',
    '大安全',
    '天猫事业线',
    '影业',
    'OceanBase',
    '投资基金线',
    '阿里体育',
    '智能科技事业群',
  ];
  const scale = new BandScale({ domain });
  const bandWidth = scale.getBandWidth();
  const ticks = domain.map((d) => ({ value: scale.map(d) + bandWidth / 2, text: d }));

  it('Overlap utils: auto-hide. Support config `showLast` and `showFirst`', () => {
    const data = ['2020-12-28', '2020-12-29', '2020-12-30', '2020-12-31', '2021-01-01', '2021-01-02'];
    const scale = new PointScale({ domain: data });
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [30, 50],
        endPos: [270, 50],
        data: data.map((d) => ({ value: scale.map(d), text: d })),
        labelTransforms: [{ type: 'hide' }],
      },
    });
    canvas.appendChild(axis);

    const labels = axis.querySelectorAll('.axis-label');
    expect(labels[0].style.visibility).toBe('visible');
    expect(labels[2].style.visibility).toBe('visible');
    expect(labels[4].style.visibility).toBe('visible');
    // todo
    // expect(labels[1].style.visibility).toBe('hidden');
    // expect(labels[3].style.visibility).toBe('hidden');
    expect(labels[5].style.visibility).toBe('hidden');

    // const count = 17;
    // const ticks = Array(count)
    //   .fill(null)
    //   .map((_, d) => ({ text: `2020-12-${d}`, value: (0.95 / (count - 1)) * d + 0.025 }));
    // axis.update({ ticks });
    // const labels2 = axis.querySelectorAll('.axis-label');
    // expect(labels2[count - 1].style.visibility).toBe('hidden');

    // expect(axis.querySelectorAll('.axis-tick').length).toBe(ticks.length);
    // axis.update({ label: { showLast: true } });
    // expect(labels2[count - 1].style.visibility).toBe('visible');
    // expect(labels2[0].style.visibility).not.toBe('visible');

    // axis.update({ label: { showFirst: true } });
    // expect(labels2[0].style.visibility).toBe('visible');

    // axis.update({
    //   ticks: [
    //     { text: 'long long long long', value: 0.4 },
    //     { text: 'long long long', value: 0.6 },
    //   ],
    //   label: { showFirst: undefined, showLast: undefined },
    // });
    // const labels3 = axis.querySelectorAll('.axis-label');
    // expect(labels3[0].style.visibility).toBe('visible');
    // expect(labels3[1].style.visibility).not.toBe('visible');
    // axis.update({ label: { showLast: true } });
    // expect(labels3[0].style.visibility).not.toBe('visible');
    // expect(labels3[1].style.visibility).toBe('visible');
    // axis.update({ label: { showFirst: true } });
    // expect(labels3[0].style.visibility).toBe('visible');
    // expect(labels3[1].style.visibility).toBe('visible');

    // axis.destroy();
  });

  it('AutoEllipsis', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [30, 60],
        endPos: [400, 60],
        data,
        labelTransforms: [{ type: 'hide' }],
      },
    });
    canvas.appendChild(axis);

    const maxLength = (400 - 50) / ticks.length;
    axis.update({ labelTransforms: [{ type: 'ellipsis', maxLength, minLength: 40 }, { type: 'hide' }] });
    // const labels = axis.getElementsByClassName('axis-label');
    // expect(labels.filter((d) => d.style.visibility === 'visible').length).toBe(ticks.length);
    // expect(labels.filter((d) => d.style.text.endsWith('...')).length).toBeGreaterThan(0);

    axis.destroy();
    axis.remove();
  });

  it('AutoHide and AutoEllipsis', async () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [30, 60],
        endPos: [400, 60],
        data,
        labelTransforms: [
          {
            type: 'ellipsis',
            minLength: 14,
            maxLength: 80,
            suffix: '',
          },
        ],
        labelFontSize: 12,
        labelTextAlign: (d, i, arr) => {
          if (i === 0) return 'start';
          if (i === arr.length - 1) return 'end';
          return 'center';
        },
      },
    });

    canvas.appendChild(axis);
    axis.destroy();
    axis.remove();
  });

  afterAll(() => {
    canvas.removeChildren();
  });
});

const domain = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const scale = new BandScale({ domain, paddingOuter: 0.1 });
const bandWidth = scale.getBandWidth();
const ticks = domain.map((d) => ({ value: scale.map(d), text: d }));
ticks.push({ value: ticks[domain.length - 1].value + bandWidth, text: '' });

const common = {
  title: 'Ordinal axis',
  titlePadding: 4,
  titleFill: 'red',
  titleAnchor: 'center',
  data,
};

describe('Cartesian axis orientation is bottom', () => {
  const axis = new Axis({ style: { type: 'linear', startPos: [30, 80], endPos: [350, 80], ...common } });
  canvas.appendChild(axis);
  let axisTitle: any;
  let axisLabelsGroup: any;
  let axisLine: any;

  it('Cartesian axis Title in left orientation. Defaults to: { textAlign: "center", textBaseline: "top" }', async () => {
    await canvas.ready;
    axisTitle = axis.querySelector('.axis-title') as Text;
    expect(axisTitle.style.textAlign).toBe('center');
    expect(axisTitle.style.textBaseline).toBe('top');
  });

  it('Text align of title is determined relative to the titleAnchor', async () => {
    await canvas.ready;
    axisTitle = axis.querySelector('.axis-title') as Text;
    axis.update({ titleAnchor: 'start' });
    expect(axisTitle.style.textAlign).toBe('start');

    axis.update({ titleAnchor: 'end' });
    expect(axisTitle.style.textAlign).toBe('end');

    axis.update({ titleTextAlign: 'left' });
    expect(axisTitle.style.textAlign).toBe('left');
  });

  it(`Offset acts on the direction of axis-line`, () => {
    axis.update({ titleAnchor: 'start', titleTextAlign: 'start', titleDx: 10 });
    axisTitle = axis.querySelector('.axis-title') as Text;
    expect(axisTitle.getBounds().min[0]).toBe(30 + 10);
  });

  it('Custom x-position', () => {
    axis.update({ titleTextBaseline: 'top', titleDx: 0, titleX: 0 });
    axisLine = axis.querySelector('.axis-line') as Path;
    expect(axisTitle.getBounds().min[0]).toBe(axisLine.getBounds().min[0]);
  });

  afterAll(() => {
    canvas.removeChildren();
  });
});

describe('Linear axis', () => {
  it('new Linear({}) renders a linear axis with axisLine.', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [40, 0],
        endPos: [240, 0],
        title: '轴标题',
        data: LINEAR_SCALE_DATA,
        labelTransforms: [{ type: 'hide' }],
        showTick: false,
      },
    });

    canvas.appendChild(axis);
    const axisLine = axis.querySelector('.axis-line') as any;
    expect(axisLine.style.path).toEqual('M40,0 L240,0');
    axis.update({ lineLineWidth: 0.5 });
    expect(axis.querySelector('.axis-line')!.style.lineWidth).toBe(0.5);
  });

  it('new Linear({}) renders a linear axis with titlePadding config.', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [40, 50],
        endPos: [240, 50],
        title: '轴标题',
        titleSpacing: 6,
        data: LINEAR_SCALE_DATA,
        labelTransforms: [{ type: 'hide' }],
        showTick: false,
      },
    });

    canvas.appendChild(axis);
    expect(axis.querySelector('.axis-title')!.style.text).toBe('轴标题');

    axis.update({ showLabel: false });
    const {
      max: [, y0],
    } = (axis.querySelector('.axis-tick-group') as any).getBounds();
    const {
      min: [, y1],
    } = (axis.querySelector('.axis-title') as any).getBounds();
    expect(y1 - y0).toBe(6);
  });

  it('new Linear({...}) renders a linear axis with custom style.', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [280, 40],
        endPos: [480, 40],
        title: 'Title',
        titleAnchor: 'center',
        data: LINEAR_SCALE_DATA,
        labelTransforms: [{ type: 'hide' }],
        tickDirection: 'negative',
      },
    });

    canvas.appendChild(axis);

    axis.update({ tickLength: 6 });
    const { y1, y2 } = axis.querySelector('.axis-tick')!.style;
    expect(y2 - y1).toBe(-6);
  });

  it('new Linear({...}) should render a vertical linear axis with label hidden.', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [80, 120],
        endPos: [80, 220],
        title: 'Label is null.',
        data: LINEAR_SCALE_DATA,
        showLabel: false,
        tickDirection: 'negative',
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a vertical linear axis', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [80, 330],
        endPos: [80, 250],
        title: 'Title',
        titleAnchor: 'end',
        data: LINEAR_SCALE_DATA,
        labelFontSize: 10,
        labelTransforms: [{ type: 'hide' }],
        tickDirection: 'negative',
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a vertical linear axis', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [120, 330],
        endPos: [120, 250],
        title: 'Title',
        titleAnchor: 'end',
        titleSpacing: 8,
        data: LINEAR_SCALE_DATA,
        labelFontSize: 10,
        labelTransforms: [{ type: 'hide' }],
      },
    });

    canvas.appendChild(axis);
  });

  it('new Linear({...}) should render a vertical linear axis, with band scale data', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [220, 120],
        endPos: [220, 240],
        titleX: 0,
        titleY: 0,
        titleTransform: 'rotate(-90)',
        titleFontSize: 10,
        titleTextAlign: 'center',
        data: BAND_SCALE_DATA_8,
        labelTransforms: [{ type: 'hide' }],
        labelFontSize: 10,
        labelFill: 'black',
        tickDirection: 'negative',
      },
    });

    canvas.appendChild(axis);
  });

  it('renders() a vertical axis with title align start (titleAnchor=start).', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [380, 120],
        endPos: [380, 240],
        title: 'variety',
        titleAnchor: 'start',
        titleTransform: 'rotate(-90)',
        titleFontSize: 10,
        titleDy: -8,
        titleTextAlign: 'end',
        data: BAND_SCALE_DATA_8,
        labelTransforms: [{ type: 'hide' }],
        labelFontSize: 10,
        labelFill: 'black',
        tickDirection: 'negative',
        lineFill: 'red',
        lineStroke: 'red',
        showTick: false,
      },
    });

    canvas.appendChild(axis);
  });

  it('renders() a horizontal axis with label in the top direction', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [120, 380],
        endPos: [480, 380],
        title: 'variety →',
        titleAnchor: 'end',
        titleFontSize: 10,
        titleDy: -4,
        data: BAND_SCALE_DATA_8,
        labelTransforms: [{ type: 'hide' }],
        labelFontSize: 10,
        labelFill: 'black',
        tickDirection: 'negative',
        lineFill: 'red',
        lineStroke: 'red',
        showTick: false,
      },
    });

    canvas.appendChild(axis);
  });

  it('renders() a horizontal axis with label in the bottom direction', () => {
    const axis = new Axis({
      style: {
        type: 'linear',
        startPos: [120, 420],
        endPos: [480, 420],
        title: 'variety →',
        titleAnchor: 'end',
        titleFontSize: 10,
        titleDy: -4,
        data: BAND_SCALE_DATA_8,
        labelTransforms: [{ type: 'hide' }],
        labelFontSize: 10,
        labelFill: 'black',
        tickDirection: 'negative',
        lineFill: 'red',
        lineStroke: 'red',
        showTick: false,
      },
    });

    canvas.appendChild(axis);
  });
});

describe('axis examples', () => {
  describe('Continuous Scales', () => {
    const rect = canvas.appendChild(new Group({ style: { x: 0, y: 0 } }));
    it('Linear scale', () => {
      const scale = new LinearScale({ domain: [-1000, 1000], range: [0, 1], tickCount: 10 });
      const data = scale.getTicks().map((d) => ({ text: `${d}`, value: scale.map(d) as any }));

      const axis = new Axis({
        style: { type: 'linear', startPos: [40, 50], endPos: [400, 50], data, title: 'Linear scale' },
      });
      rect.appendChild(axis);
    });

    it('Log scale', () => {
      const scale = new LogScale({ domain: [100, 1000], range: [0, 1], base: 10 });
      const data = scale.getTicks().map((d) => ({ text: `${d}`, value: scale.map(d) as any }));
      const axis = new Axis({
        style: { type: 'linear', startPos: [40, 120], endPos: [400, 120], data, title: 'Log scale' },
      });
      rect.appendChild(axis);
    });

    it('Pow scale', () => {
      const scale = new PowScale({ domain: [0, 1], range: [0, 1] });
      const data = scale.getTicks().map((d) => ({ text: `${d}`, value: scale.map(d) as any }));
      const axis = new Axis({
        style: { type: 'linear', startPos: [40, 190], endPos: [400, 190], data, title: 'Pow scale' },
      });
      rect.appendChild(axis);
    });
  });

  describe('Categorical Scales', () => {
    const rect = canvas.appendChild(new Group({ style: { x: 0, y: 240 } }));
    it('Point scale', () => {
      const scale = new PointScale({ domain: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], range: [0, 1] });
      const data = (scale.getDomain() || []).map((d) => ({ text: `${d}`, value: scale.map(d) as any }));
      const axis = new Axis({
        style: { type: 'linear', startPos: [40, 50], endPos: [400, 50], data, title: 'Point scale' },
      });
      rect.appendChild(axis);
    });

    it('Band scale', () => {
      const scale = new BandScale({ domain: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], range: [0, 1] });
      const data = (scale.getDomain() || []).map((d) => ({
        text: `${d}`,
        value: (scale.map(d) + scale.getBandWidth() / 2) as any,
      }));
      const axis = new Axis({
        style: { type: 'linear', startPos: [40, 120], endPos: [400, 120], data, title: 'Band scale' },
      });
      rect.appendChild(axis);

      // Append a axis end arrow.
      axis.update({ lineArrowSize: 1.5 });
    });

    it('Band scale with flex options', () => {
      const axis = new Axis({
        style: {
          type: 'linear',
          startPos: [40, 260],
          endPos: [400, 260],
          data,
          title: 'Band scale',
        },
      });
      rect.appendChild(axis);
    });
  });
});
