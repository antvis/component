import { Group } from '@antv/g';
import { LineCrosshair } from '../../../../src/ui/crosshair';
import { createGrid } from '../../utils/grid';

export const CrosshairLine = () => {
  const group = new Group({});
  createGrid(group);
  const line = group.appendChild(
    new LineCrosshair({
      style: {
        style: {
          startPos: [50, 50],
          endPos: [50, 400],
          tagText: 'tag',
        },
      },
    })
  );
  group.addEventListener('mousemove', (e: MouseEvent) => {
    line.setPointer([e.offsetX, e.offsetY]);
  });
  return group;
};
