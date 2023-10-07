import { Group } from '@antv/g';
import { Handle } from '../../../../src/ui/slider/handle';

export const Handle2 = () => {
  const group = new Group();

  group.appendChild(
    new Handle({
      style: {
        x: 150,
        y: 150,
        orientation: 'vertical',
        labelText: 'LabelText',
      },
    })
  );

  return group;
};

Handle2.tags = ['手柄', '垂直'];
