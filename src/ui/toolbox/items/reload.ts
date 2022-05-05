import { DisplayObject, Path, Rect } from '@antv/g';

export const reload = ({ size = 24, stroke = '#363636' }): DisplayObject => {
  const rect = new Rect({ style: { x: 0, y: 0, width: size, height: size } });
  const r = 8;
  const path = new Path({
    style: {
      x: 0,
      y: 0,
      lineWidth: 1,
      stroke,
      transformOrigin: 'center',
      path: [
        ['M', 3, 10.5],
        ['A', r, r - 1, 0, 0, 1, 21, 9.5],
        ['M', 22, 7],
        ['L', 21, 9.5],
        ['L', 19, 8],
        ['M', 4, 13.5],
        ['A', r, r - 1, 0, 0, 0, 21, 13.5],
        ['M', 2.5, 15],
        ['L', 4, 13.5],
        ['L', 5.5, 15.5],
      ],
    },
  });
  // path 按照 24px 的进行绘制，然后进行缩放
  // @ts-ignore
  path.scale(size / 24);

  rect.appendChild(path);

  return rect;
};
