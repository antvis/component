import fecha from 'fecha';
import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Countdown } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('countdown', () => {
  const div = createDiv();

  const canvas = new Canvas({
    container: div,
    width: 400,
    height: 300,
    renderer,
  });

  const countdown = new Countdown({
    attrs: {
      x: 50,
      y: 50,
      value: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  });

  canvas.appendChild(countdown);

  test('now countdown', async () => {
    const {
      value: { format },
    } = countdown.attributes;

    expect(format).toBe('YYYY-MM-DD HH:mm:ss');
    expect(countdown.getNewText('value')).toBe(fecha.format(new Date(), 'YYYY-MM-DD HH:mm:ss'));
  });

  test('timer countdown', async () => {
    countdown.update({
      value: {
        text: 1000 * 60 * 60 * 24 + 1000 * 60 * 60 + 1000 * 60 + 1000 + 599,
        format: 'D 天 HH 小时 mm 分钟 ss 秒',
      },
    });

    expect(countdown.timeAdapter()).toBe('1 天 01 小时 01 分钟 01 秒');
  });

  test('dynamicTime countdown', async () => {
    countdown.update({
      value: {
        text: 1000 * 60 * 60 * 24,
        dynamicTime: true,
      },
    });

    setTimeout(() => {
      let time: string[] = countdown.timeAdapter().split(' 天 ');
      const D = time[0];
      time = time[1].split(' 小时 ');
      const HH = time[0];
      time = time[1].split(' 分钟 ');
      const mm = time[0];
      time = time[1].split(' 秒 ');
      const ss = time[0];

      expect(D).toBe('0');
      expect(HH).toBe('23');
      expect(mm).toBe('59');
      expect(ss).toBe('59');
    }, 1000);
  });
});
