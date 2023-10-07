import { Group } from '@antv/g';
import { Text } from '../../../../src/shapes';

export function Text1() {
  const group = new Group();

  group.appendChild(
    new Text({
      style: {
        x: 100,
        y: 100,
        text: 'Hello',
      },
    })
  );

  return group;
}
