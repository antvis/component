import { DisplayObject, Path, Rect } from '@antv/g';

export const download = ({ size = 24, stroke = '#363636' }): DisplayObject => {
  const rect = new Rect({ style: { x: 0, y: 0, width: size, height: size } });
  const c = 8.5;
  const path = new Path({
    style: {
      x: 0,
      y: 0,
      lineWidth: 1,
      stroke,
      transformOrigin: 'center',
      path: [
        ['M', 11.5, 2],
        ['L', 11.5, 17],
        ['M', 11.5 - c, 9],
        ['L', 11.5, 17],
        ['L', 11.5 + c, 9],
        ['M', 11.5 - c, 17],
        ['L', 11.5 - c, 20.5],
        ['L', 11.5 + c, 20.5],
        ['L', 11.5 + c, 17],
      ],
    },
  });
  // path 按照 24px 的进行绘制，然后进行缩放
  path.scale(size / 24);

  rect.appendChild(path);

  // @ts-ignore 复写掉（todo 用其他方式注入修改）
  rect.setAttribute = (k, v) => path.setAttribute(k, v);

  return rect;
};
