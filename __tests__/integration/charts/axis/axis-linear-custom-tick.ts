import { Circle, Group, Line, Rect } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { mockData } from '../../utils';

export const AxisLinearCustomTick = () => {
  const group = new Group({
    name: '笛卡尔坐标系-刻度线-自定义',
    style: {
      width: 550,
      height: 150,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        labelFormatter: () => '',
        tickFormatter: (datum: any, index: number, data: any, [cx, cy]: any) => {
          if (index === 3) return new Rect({ style: { width: 20, height: 20, fill: 'green', anchor: '0.5 0.5' } });
          return index % 5 === 0
            ? new Circle({ style: { r: index % 10 === 0 ? 10 : 5 } })
            : new Line({ style: { x1: 0, x2: 0, y1: 50 * cx, y2: 10 * cy } });
        },
        style: {
          type: 'linear',
          startPos: [50, 50],
          endPos: [500, 50],
          lineLineWidth: 5,
          tickStroke: (datum: any, index: number) => (index % 2 === 0 ? 'blue' : 'green'),
          tickLength: (datum: any, index: number) => index * 5,
          tickFill: (datum: any, index: number) => (index % 5 === 0 ? 'pink' : 'white'),
          tickLineWidth: (datum: any, index: number) => (index % 5 === 0 ? 5 : 3),
          labelSpacing: 10,
        },
      },
    })
  );

  return group;
};
