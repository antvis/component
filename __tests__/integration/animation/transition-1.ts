import { Group, Rect } from '@antv/g';
import { transition } from '../../../src/animation';

export function Transition1() {
  const group = new Group();

  const rect = group.appendChild(
    new Rect({
      style: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: 'red',
      },
    })
  );

  setTimeout(() => {
    transition(rect, { x: 100, y: 100, fill: 'green', width: 50, height: 50 }, { duration: 1000, fill: 'both' });
  });

  return group;
}
