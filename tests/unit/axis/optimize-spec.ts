import { Canvas } from '@antv/g-canvas';
import LineAxis from '../../../src/axis/line';
import { AxisBaseCfg } from '../../../src/types';

describe('axis optimize', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const canvas = new Canvas({
    container: dom,
    width: 500,
    height: 400,
  });
  let axisCnt = 0;
  const container = canvas.addGroup();
  const generateTicks = (count: number) => {
    return new Array(count).fill(0).map((v, idx) => {
      return {
        name: `${idx}`,
        value: (1 / count) * idx,
      };
    });
  };
  const generateAxis = (count: number, cfg: Partial<AxisBaseCfg> = {}) => {
    return new LineAxis({
      container,
      animate: false,
      id: `axis${axisCnt}`,
      start: {
        x: 50,
        y: 400,
      },
      end: {
        x: 50,
        y: 50,
      },
      title: {
        text: 'title',
      },
      ticks: generateTicks(count),
      ...cfg,
    });
  };

  it('optimize off', () => {
    const axis = generateAxis(2000, { optimize: { enable: false } });
    axis.init();
    axis.render();

    expect(axis.get('ticks')).toHaveLength(2000);
    expect(container.findAllByName('axis-label')).toHaveLength(2000);
    expect(axis.get('originalTicks')).toBeUndefined();

    axis.destroy();
  });

  it('optimize on /w small data', () => {
    const axis = generateAxis(200);
    axis.init();
    axis.render();

    expect(axis.get('ticks')).toHaveLength(200);
    expect(container.findAllByName('axis-label')).toHaveLength(200);
    expect(axis.get('originalTicks')).toBeUndefined();

    axis.destroy();
  });

  it('optimize on /w large data', () => {
    const axis = generateAxis(4000);
    axis.init();
    axis.render();

    expect(axis.get('ticks')).toHaveLength(400);
    expect(container.findAllByName('axis-label')).toHaveLength(400);
    expect(axis.get('originalTicks')).toHaveLength(4000);

    axis.destroy();
  });

  it('optimize on /w large data & threshold', () => {
    const axis = generateAxis(6000, { optimize: { enable: true, threshold: 600 } });
    axis.init();
    axis.render();

    expect(axis.get('ticks')).toHaveLength(600);
    expect(container.findAllByName('axis-label')).toHaveLength(600);
    expect(axis.get('originalTicks')).toHaveLength(6000);

    axis.destroy();
  });
});
