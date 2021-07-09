import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('slider', () => {
  test('basic', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 800,
      height: 300,
      renderer,
    });

    const slider = new Slider({
      attrs: {
        x: 50,
        y: 50,
        width: 400,
        height: 40,
        values: [0.3, 0.7],
        names: ['leftVal', 'rightVal'],
      },
    });

    expect(slider.getValues()).toStrictEqual([0.3, 0.7]);
    expect(slider.getNames()).toStrictEqual(['leftVal', 'rightVal']);

    slider.setValues([0, 1]);
    expect(slider.getValues()).toStrictEqual([0, 1]);

    slider.setValues([-0.5, 1]);
    expect(slider.getValues()).toStrictEqual([0, 1]);

    slider.setValues([-0.5, 1.5]);
    expect(slider.getValues()).toStrictEqual([0, 1]);

    slider.setValues([-0.5, 0]);
    expect(slider.getValues()).toStrictEqual([0, 0.5]);

    slider.setValues([-2, -1]);
    expect(slider.getValues()).toStrictEqual([0, 1]);

    canvas.appendChild(slider);
    slider.destroy();
  });

  test('vertical', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 800,
      height: 300,
      renderer,
    });

    const slider = new Slider({
      attrs: {
        x: 50,
        y: 50,
        width: 40,
        height: 400,
        orient: 'vertical',
        values: [0.3, 0.7],
        names: ['aboveVal', 'belowVal'],
      },
    });

    canvas.appendChild(slider);
    slider.destroy();
  });

  test('custom icon', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 800,
      height: 300,
      renderer,
    });

    const slider = new Slider({
      attrs: {
        x: 50,
        y: 50,
        width: 400,
        height: 40,
        values: [0.3, 0.7],
        names: ['leftVal', 'rightVal'],
        handle: {
          start: {
            size: 15,
            formatter: (name, value) => {
              return `${name}: ${value * 100}%`;
            },
            handleIcon: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
          },
          end: {
            spacing: 20,
            handleIcon: 'diamond',
          },
        },
      },
    });

    canvas.appendChild(slider);
    slider.destroy();
  });

  test('vertical', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 800,
      height: 300,
      renderer,
    });

    const slider = new Slider({
      attrs: {
        x: 50,
        y: 50,
        width: 40,
        height: 400,
        orient: 'vertical',
        values: [0.3, 0.7],
        names: ['aboveVal', 'belowVal'],
      },
    });

    canvas.appendChild(slider);
    slider.destroy();
  });

  test('slider with sparkline', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 800,
      height: 300,
      renderer,
    });

    const slider = new Slider({
      attrs: {
        x: 50,
        y: 50,
        width: 400,
        height: 40,
        values: [0.3, 0.7],
        names: ['leftVal', 'rightVal'],
        sparklineCfg: {
          // type: 'column',
          data: [
            [1, 3, 2, -4, 1, 3, 2, -4],
            [5, 1, 5, -8, 5, 1, 5, -8],
          ],
        },
      },
    });

    canvas.appendChild(slider);
    slider.destroy();
    canvas.destroy();
  });
});
