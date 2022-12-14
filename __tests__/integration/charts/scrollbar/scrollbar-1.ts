import { Group } from '@antv/g';
import { Scrollbar } from '../../../../src/ui/scrollbar';

export const Scrollbar1 = () => {
  const group = new Group();

  group.appendChild(
    new Scrollbar({
      style: {
        x: 20,
        y: 20,
        value: 0.5,
        contentLength: 1000,
        viewportLength: 300,
      },
    })
  );

  return group;
};

Scrollbar1.tags = ['滚动条', '默认', '垂直'];
