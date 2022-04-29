import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { SpeedControl } from '../../../../src/ui/timeline/speedcontrol';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer();
const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 500,
  height: 500,
  renderer,
});

describe('speedcontrol', () => {
  test('basic', () => {
    const speedcontrol = new SpeedControl({
      style: {
        x: 50,
        y: 50,
        speeds: [1.0, 2.0, 3.0, 4.0, 5.0],
        width: 35,
      },
    });
    speedcontrol.update({ currentSpeedIdx: 4 });
    canvas.appendChild(speedcontrol);
    expect(speedcontrol.getBounds()!.max[0]).toBe(50 + 35);
  });
});
