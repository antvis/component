import { Group } from '@antv/g';
import { Button } from '../../../../src';

export function Button1() {
  const group = new Group();

  group.appendChild(
    new Button({
      style: {
        style: {
          x: 100,
          y: 100,
          text: 'Hello',
        },
      },
    })
  );

  return group;
}
