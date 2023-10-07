import { Group } from '@antv/g';
import { CircleCrosshair } from '../../../../src/ui/crosshair';
import { createGrid } from '../../utils/grid';

export const CrosshairCircle = () => {
  const group = new Group({});
  createGrid(group);
  const circle = group.appendChild(
    new CircleCrosshair({
      style: {
        center: [200, 200],
        defaultRadius: 50,
      },
    })
  );
  group.addEventListener('mousemove', (e: MouseEvent) => {
    circle.setPointer([e.offsetX, e.offsetY]);
  });
  return group;
};
