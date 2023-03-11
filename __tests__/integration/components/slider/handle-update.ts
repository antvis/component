import { Group } from '@antv/g';
import { Handle } from '../../../../src/ui/slider/handle';
import { timeout } from '../../utils';

export const HandleUpdate = () => {
  const group = new Group({ style: { width: 200, height: 200 } });

  const handle = group.appendChild(
    new Handle({
      style: {
        x: 150,
        y: 150,
        orientation: 'vertical',
        labelText: 'LabelText',
      },
    })
  );

  timeout(() => {
    handle.update();
  }, 100);

  return group;
};

HandleUpdate.tags = ['手柄', '垂直'];
