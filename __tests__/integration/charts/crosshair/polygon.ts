import { Group } from '@antv/g';
import { PolygonCrosshair } from '../../../../src/ui/crosshair';
import { createGrid } from '../../utils/grid';

export const CrosshairPolygon = () => {
  const group = new Group();
  createGrid(group);
  const polygon = group.appendChild(
    new PolygonCrosshair({
      style: {
        center: [200, 200],
        sides: 8,
        defaultRadius: 50,
      },
    })
  );
  group.addEventListener('mousemove', (e: MouseEvent) => {
    polygon.setPointer([e.offsetX, e.offsetY]);
  });
  return group;
};
