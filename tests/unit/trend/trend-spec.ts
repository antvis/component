import { Canvas } from '@antv/g-canvas';
import { Trend } from '../../../src/trend/trend';
import { TrendData } from './constant';

describe('gui trend', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.id = 'canvas';

  const canvas = new Canvas({
    container: 'canvas',
    width: 600,
    height: 400,
  });

  it('line', () => {
    const trend = new Trend({
      id: 't1',
      container: canvas.addGroup(),
      x: 100,
      y: 50,
      data: TrendData,
    });
    trend.render();

    expect(trend.getElementById('t1-trend-area')).toBeUndefined();
  });

  it('area', () => {
    const trend = new Trend({
      id: 't2',
      container: canvas.addGroup(),
      x: 100,
      y: 150,
      isArea: true,
      data: TrendData,
    });

    trend.render();

    expect(trend.getElementById('t2-trend-area')).not.toBeUndefined();
  });

  it('style', () => {
    const trend = new Trend({
      id: 't3',
      container: canvas.addGroup(),
      x: 100,
      y: 250,
      isArea: true,
      data: TrendData,
      smooth: false,
      backgroundStyle: {
        fill: 'grey',
        opacity: 0.1,
      },
      lineStyle: {
        stroke: 'blue',
      },
      areaStyle: {
        fill: 'green',
      },
    });

    trend.render();

    expect(trend.getElementById('t3-trend-area').attr('fill')).toBe('green');
  });
});
