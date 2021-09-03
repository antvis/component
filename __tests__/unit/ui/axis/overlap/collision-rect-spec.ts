import { CollisionRect } from '../../../../../src/ui/axis/overlap/is-overlap';

describe('CollisionRect', () => {
  test('collision', () => {
    let rect1 = new CollisionRect({ center: [0, 0], width: 84, height: 15, angle: 22 });
    let rect2 = new CollisionRect({ center: [40, 0], width: 48, height: 15, angle: 22 });
    expect(rect1.isCollision(rect2)).toBe(true);

    rect1 = new CollisionRect({ center: [0, 0], width: 84, height: 15, angle: 23 });
    rect2 = new CollisionRect({ center: [40, 0], width: 48, height: 15, angle: 23 });
    expect(rect1.isCollision(rect2)).toBe(false);
  });
});
