import { Group } from '@antv/g';
import { Handle } from '../../../../src/ui/slider/handle';

export const Handle1 = () => {
  const group = new Group();

  group.appendChild(
    new Handle({
      style: {
        transform: 'translate(150, 150)',
        labelText: 'LabelText',
      },
    })
  );

  return group;
};

Handle1.tags = ['手柄', '默认', '水平'];
