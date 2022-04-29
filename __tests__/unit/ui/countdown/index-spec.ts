import { Canvas } from '@antv/g';
import { get } from '@antv/util';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Countdown } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer();

const nowDate = Date.now();

describe('countdown', () => {
  const div = createDiv();

  const canvas = new Canvas({
    container: div,
    width: 400,
    height: 300,
    renderer,
  });

  const countdown = new Countdown({
    style: {
      x: 50,
      y: 50,
      value: {
        timestamp: nowDate,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  });

  canvas.appendChild(countdown);

  test('now countdown', async () => {
    const {
      // @ts-ignore
      value,
    } = countdown.attributes;

    expect(value.format).toBe('YYYY-MM-DD HH:mm:ss');
    expect(value.timestamp).toBe(nowDate);
    expect(value.timestamp).toBe(nowDate);
  });

  test('onFinish countdown', async () => {
    countdown.update({
      value: {
        timestamp: Date.now() + 1000 * 2,
        format: 'D 天 HH 小时 mm 分钟 ss 秒',
      },
      onFinish: () => {
        expect(get(countdown, 'valueShape.attributes.text')).toBe('');
        expect(!!countdown.countdownId).toBe(false);
      },
    });
    expect(!!countdown.countdownId).toBe(true);
  });

  test('formatCountdown countdown', async () => {
    countdown.update({
      value: {
        timestamp: Date.now() + 1000 * 5,
        format: 'HH 小时 mm 分钟 ss 秒',
      },
      onFinish: () => {
        expect(get(countdown, 'formatCountdown').call(countdown)).toBe('00 小时 00 分钟 00 秒');
      },
    });
    // expect(get(countdown, 'formatCountdown').call(countdown)).toBe('00 小时 00 分钟 00 秒');
  });
});
