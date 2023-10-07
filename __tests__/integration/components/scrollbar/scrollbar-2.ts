import { Group } from '@antv/g';
import { Scrollbar } from '../../../../src/ui/scrollbar';

export const Scrollbar2 = () => {
  const group = new Group();

  group.appendChild(
    new Scrollbar({
      style: { x: 20, y: 20, value: 0.5, orientation: 'horizontal', contentLength: 1000, viewportLength: 300 },
    })
  );

  return group;
};

Scrollbar2.tags = ['滚动条', '默认', '水平'];
