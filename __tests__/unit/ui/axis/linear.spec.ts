import { DisplayObject, Text, Path, Group } from '@antv/g';
import {
  Band as BandScale,
  Point as PointScale,
  Pow as PowScale,
  Linear as LinearScale,
  Log as LogScale,
} from '@antv/scale';
import { Linear } from '../../../../src/ui/axis/linear';
import { createCanvas } from '../../../utils/render';
import { BAND_SCALE_DATA_8, LINEAR_SCALE_DATA } from './data';

const size = 500;
const canvas = createCanvas(size, 'svg', true);

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
    const axis = new Linear({
      style: {
        startPos: [30, 50],
        endPos: [270, 50],
        ticks: data.map((d) => ({ value: scale.map(d), text: d })),
        label: {
          type: 'text',
          rotate: 0,
          maxLength: 80,
          minLength: 20,
          autoHide: true,
          autoEllipsis: false,
          alignTick: true,
          autoHideTickLine: false,
          showLast: false,
          showFirst: false,
        },
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
    const data = ['ABC', 'BCED', 'DEFGH', 'GHIJKM', 'KMLNOPQ', 'PQRSTVVW', 'VWXYZABC'];
    const ticks = data.map((d, idx) => {
      const step = 1 / (data.length - 1);
      return {
        value: step * idx,
        text: String(d),
        id: String(idx),
      };
    });

    const axis = new Linear({
      style: {
        startPos: [30, 60],
        endPos: [400, 60],
        ticks,
        label: { autoRotate: false, autoEllipsis: false, autoHide: true },
      },
    });
    canvas.appendChild(axis);

    const maxLength = (400 - 50) / ticks.length;
    axis.update({ label: { autoHideTickLine: false, autoHide: true, autoEllipsis: true, maxLength, minLength: 40 } });
    // const labels = axis.getElementsByClassName('axis-label');
    // expect(labels.filter((d) => d.style.visibility === 'visible').length).toBe(ticks.length);
    // expect(labels.filter((d) => d.style.text.endsWith('...')).length).toBeGreaterThan(0);

    axis.destroy();
    axis.remove();
  });

  it('AutoHide and AutoEllipsis', async () => {
    const data = [
      'ABC',
      'BCED',
      'DEFGH',
      'GHIJKM',
      'KMLN',
      'OPQ',
      'PQRST',
      'VVW',
      'VWXYZABC',
      'AXS',
      'SFAF',
      'AFAFAGA',
      'FAFA',
      'AFAF',
    ];
    const ticks = data.map((d, idx) => {
      const step = 1 / (data.length - 1);
      return {
        value: step * idx,
        text: String(d),
        id: String(idx),
      };
    });

    const axis = new Linear({
      style: {
        startPos: [30, 60],
        endPos: [400, 60],
        ticks,
        label: {
          autoRotate: false,
          autoEllipsis: true,
          autoHide: false,
          autoHideTickLine: false,
          // 不展示 '...'
          minLength: 14,
          style: (d, i) => {
            let textAlign = 'center';
            if (i === 0) textAlign = 'start';
            if (i === ticks.length - 1) textAlign = 'end';
            return {
              fontSize: 12,
              textAlign: textAlign as any,
            };
          },
        },
      },
    });

    canvas.appendChild(axis);

    axis.update({ label: { autoHide: true } });
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
  title: { content: 'Ordinal axis', titlePadding: 4, titleAnchor: 'center' as any, style: { fill: 'red' } },
  ticks,
  label: { alignTick: false },
};

describe('Cartesian axis orientation is bottom', () => {
  const axis = new Linear({ style: { startPos: [30, 80], endPos: [350, 80], ...common } });
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
    axis.update({ title: { titleAnchor: 'start' } });
    expect(axisTitle.style.textAlign).toBe('start');

    axis.update({ title: { titleAnchor: 'end' } });
    expect(axisTitle.style.textAlign).toBe('end');

    axis.update({ title: { style: { textAlign: 'left' } } });
    expect(axisTitle.style.textAlign).toBe('left');
  });

  it(`Offset acts on the direction of axis-line`, () => {
    axis.update({ title: { titleAnchor: 'start', style: { textAlign: 'start', dx: 10 } } });
    axisTitle = axis.querySelector('.axis-title') as Text;
    expect(axisTitle.getBounds().min[0]).toBe(30 + 10);
  });

  it('Custom x-position', () => {
    axis.update({ title: { positionX: 0, style: { textBaseline: 'top', dx: 0 } } });
    axisLine = axis.querySelector('.axis-line') as Path;
    expect(axisTitle.getBounds().min[0]).toBe(axisLine.getBounds().min[0]);
  });

  afterAll(() => {
    canvas.removeChildren();
  });
});

describe('Linear axis', () => {
  it('new Linear({}) renders a linear axis with axisLine.', () => {
    const axis = new Linear({
      style: {
        startPos: [40, 0],
        endPos: [240, 0],
        title: { content: '轴标题' },
        ticks: LINEAR_SCALE_DATA,
        label: { autoHide: true },
        tickLine: {},
      },
    });

    canvas.appendChild(axis);
    const axisLine = axis.querySelector('.axis-line') as any;
    expect(axisLine.style.path).toEqual('M40,0 L240,0');
    axis.update({ axisLine: { style: { lineWidth: 0.5 } } });
    expect(axis.querySelector('.axis-line')!.style.lineWidth).toBe(0.5);
  });

  it('new Linear({}) renders a linear axis with titlePadding config.', () => {
    const axis = new Linear({
      style: {
        startPos: [40, 50],
        endPos: [240, 50],
        title: { content: '轴标题', titlePadding: 6 },
        ticks: LINEAR_SCALE_DATA,
        label: { autoHide: true },
        tickLine: {},
      },
    });

    canvas.appendChild(axis);
    expect(axis.querySelector('.axis-title')!.style.text).toBe('轴标题');

    axis.update({ label: null });
    const {
      max: [, y0],
    } = (axis.querySelector('.axis-tick-group') as any).getBounds();
    const {
      min: [, y1],
    } = (axis.querySelector('.axis-title') as any).getBounds();
    expect(y1 - y0).toBe(6);
  });

  it('new Linear({...}) renders a linear axis with custom style.', () => {
    const verticalFactor = -1;
    const axis = new Linear({
      style: {
        startPos: [280, 40],
        endPos: [480, 40],
        title: { content: 'Title', titleAnchor: 'center' },
        ticks: LINEAR_SCALE_DATA,
        label: { autoHide: true },
        verticalFactor,
      },
    });

    canvas.appendChild(axis);

    axis.update({ axisLine: { arrow: { start: {}, end: {} } } });
    let axisArrows = axis.querySelectorAll('.axis-arrow$$') as DisplayObject[];
    expect(axisArrows.length).toBe(2);
    expect(axisArrows[0].getEulerAngles()).toBeCloseTo(90);

    axis.update({ axisLine: { arrow: { end: null } } });
    axisArrows = axis.querySelectorAll('.axis-arrow$$') as DisplayObject[];
    expect(axisArrows[0].style.visibility).toBe('visible');
    expect(axisArrows[1].style.visibility).toBe('hidden');

    axis.update({ tickLine: { len: 6 } });
    const { y1, y2 } = axis.querySelector('.axis-tick')!.style;
    expect(y2 - y1).toBe(6 * verticalFactor);
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

describe('axis examples', () => {
  describe('Continuous Scales', () => {
    const rect = canvas.appendChild(new Group({ style: { x: 0, y: 0 } }));
    it('Linear scale', () => {
      const scale = new LinearScale({ domain: [-1000, 1000], range: [0, 1], tickCount: 10 });
      const ticks = scale.getTicks().map((d) => ({ text: `${d}`, value: scale.map(d) as any }));

      const axis = new Linear({
        style: { startPos: [40, 50], endPos: [400, 50], ticks, title: { content: 'Linear scale' } },
      });
      rect.appendChild(axis);
    });

    it('Log scale', () => {
      const scale = new LogScale({ domain: [100, 1000], range: [0, 1], base: 10 });
      const ticks = scale.getTicks().map((d) => ({ text: `${d}`, value: scale.map(d) as any }));
      const axis = new Linear({
        style: { startPos: [40, 120], endPos: [400, 120], ticks, title: { content: 'Log scale' } },
      });
      rect.appendChild(axis);
    });

    it('Pow scale', () => {
      const scale = new PowScale({ domain: [0, 1], range: [0, 1] });
      const ticks = scale.getTicks().map((d) => ({ text: `${d}`, value: scale.map(d) as any }));
      const axis = new Linear({
        style: { startPos: [40, 190], endPos: [400, 190], ticks, title: { content: 'Pow scale' } },
      });
      rect.appendChild(axis);
    });
  });

  describe('Categorical Scales', () => {
    const rect = canvas.appendChild(new Group({ style: { x: 0, y: 240 } }));
    it('Point scale', () => {
      const scale = new PointScale({ domain: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], range: [0, 1] });
      const ticks = (scale.getDomain() || []).map((d) => ({ text: `${d}`, value: scale.map(d) as any }));
      const axis = new Linear({
        style: { startPos: [40, 50], endPos: [400, 50], ticks, title: { content: 'Point scale' } },
      });
      rect.appendChild(axis);
    });

    it('Band scale', () => {
      const scale = new BandScale({ domain: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], range: [0, 1] });
      const ticks = (scale.getDomain() || []).map((d) => ({
        text: `${d}`,
        value: (scale.map(d) + scale.getBandWidth() / 2) as any,
      }));
      const axis = new Linear({
        style: { startPos: [40, 120], endPos: [400, 120], ticks, title: { content: 'Band scale' } },
      });
      rect.appendChild(axis);

      // Append a axis end arrow.
      axis.update({ axisLine: { arrow: { end: { size: 8 } } } });
    });

    it('Band scale, label not alignTick and appendTick', () => {
      const scale = new BandScale({ domain: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], range: [0, 1] });
      const ticks = (scale.getDomain() || []).map((d) => ({
        text: `${d}`,
        value: scale.map(d) as any,
      }));
      const axis = new Linear({
        style: {
          startPos: [40, 190],
          endPos: [400, 190],
          ticks,
          title: { content: 'Band scale' },
          label: { alignTick: false },
          subTickLine: {},
          appendTick: true,
        },
      });
      rect.appendChild(axis);
    });

    it('Band scale with flex options', () => {
      const scale = new BandScale({
        domain: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        range: [0, 1],
        flex: [1, 2, 3],
      });
      const ticks = (scale.getDomain() || []).map((d) => ({
        text: `${d}`,
        value: scale.map(d) as any,
      }));
      const axis = new Linear({
        style: {
          startPos: [40, 260],
          endPos: [400, 260],
          ticks,
          title: { content: 'Band scale' },
          label: { alignTick: false },
          subTickLine: { count: 2 },
          appendTick: true,
        },
      });
      rect.appendChild(axis);
    });
  });
});
