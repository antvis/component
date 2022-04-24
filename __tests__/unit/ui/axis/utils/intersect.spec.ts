import { Rect } from '@antv/g';
import { Bounds, intersect } from '../../../../../src/ui/axis/utils/intersect';
import { createCanvas } from '../../../../utils/render';

const canvas = createCanvas();

function drawRect(box: Bounds, fill = '#1890FF') {
  const rect = canvas.appendChild(
    new Rect({
      style: { x: box.x1, y: box.y1, width: box.x2 - box.x1, height: box.y2 - box.y1, fill },
    })
  );
  rect.rotate(box.rotation || 0);
  return rect;
}

describe('Intersect', () => {
  it('intersect(box1, box2) without rotation', () => {
    const a = { x1: 0, y1: 1, x2: 30, y2: 50, rotation: 0 };
    const b = { x1: 30, y1: 0, x2: 60, y2: 50, rotation: 0 };
    expect(intersect(a, b)).toBe(false);

    const a1 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b1 = { x1: 20, y1: 0, x2: 60, y2: 50, rotation: 0 };
    expect(intersect(a1, b1)).toBe(true);

    const a2 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b2 = { x1: 20, y1: 50, x2: 60, y2: 80, rotation: 0 };
    expect(intersect(a2, b2)).toBe(false);
  });

  it('intersect(box1, box2) with rotation', () => {
    const a = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b = { x1: 30, y1: 0, x2: 60, y2: 50, rotation: 40 };
    drawRect(a).translate(30, 90);
    expect(intersect(a, b)).toBe(true);
    canvas.removeChildren();

    const a1 = { x1: 0, y1: 1, x2: 30, y2: 50, rotation: 0 };
    const b1 = { x1: 20, y1: 0, x2: 60, y2: 50, rotation: -90 };
    drawRect(a1).translate(30, 90);
    drawRect(b1, 'red').translate(30, 90);
    expect(intersect(a1, b1)).toBe(false);
    canvas.removeChildren();

    const a2 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b2 = { x1: 20, y1: 52, x2: 60, y2: 80, rotation: -20 };
    drawRect(a2).translate(30, 0);
    drawRect(b2).translate(30, 0);
    expect(intersect(a2, b2)).toBe(true);
    canvas.removeChildren();

    const a3 = { x1: 0, y1: 0, x2: 30, y2: 50, rotation: 0 };
    const b3 = { x1: 20, y1: 52, x2: 60, y2: 80, rotation: 20 };
    expect(intersect(a3, b3)).toBe(false);

    const a4 = { rotation: 28.000000209988553, x1: 4, y1: 52.5, x2: 88, y2: 67.5 };
    const b4 = { rotation: 28.000000209988553, x1: 44, y1: 52.5, x2: 92, y2: 67.5 };
    drawRect(a4).translate(30, 60);

    expect(intersect(a4, b4)).toBe(false);
  });
});
