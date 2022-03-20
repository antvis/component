import { DisplayObject, Path, Rect } from '@antv/g';

export const reset = ({ size = 24, stroke = '#363636' }): DisplayObject => {
  const rect = new Rect({ style: { x: 0, y: 0, width: size, height: size } });
  const c = Math.sqrt(9);
  const path = new Path({
    style: {
      x: 0,
      y: 0,
      lineWidth: 1,
      stroke,
      path: [
        ['M', 3, 3],
        ['L', 21, 3],
        ['L', 21, 21],
        ['L', 3, 21],
        ['L', 3, 12],
        ['M', 3 + c, 3 - c],
        ['L', 3, 3],
        ['L', 3 + c, 3 + c],
      ],
    },
  });
  // path 按照 24px 的进行绘制，然后进行缩放
  path.setAttribute('origin', [0.5, 0.5]);
  path.scale(size / 24);

  rect.appendChild(path);

  return rect;
};
