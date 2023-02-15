import { BBox, IGroup, IShape, LooseObject, Point } from '@antv/g-base';

export function createMask(group: IGroup, maskType: string, maskAttrs: LooseObject) {
  const maskShape = group.addShape({
    type: maskType,
    name: 'component-mask',
    attrs: {
      fill: '#569CFF',
      opacity: 0.16,
      ...maskAttrs,
    },
  });
  return maskShape;
}

export function updateMask(shape: IShape, maskAttrs: LooseObject) {
  shape.attr(maskAttrs);
  return shape;
}

// export function overBBoxLimit(bbox: BBox, curPoint: Point) {
//   const { minX, maxX, minY, maxY } = bbox;
//   const { x, y } = curPoint;
//   if (Math.min(minX, maxX) > x || Math.max(minX, maxX) < x || Math.min(minY, maxY) > y || Math.max(minY, maxY) < y) {
//     return true;
//   }
//   return false;
// }

export function getRectMaskAttrs(start: Point, end: Point) {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  return {
    x,
    y,
    width,
    height,
  };
}
