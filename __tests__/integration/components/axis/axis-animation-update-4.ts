import { Group } from '@antv/g';
import { data } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationUpdate4 = () => {
  const group = new Group({
    style: {
      width: 650,
      height: 150,
    },
  });

  const axis = group.appendChild(
    new Axis({
      style: {
        animate: { duration: process.env.NODE_ENV === 'test' ? 100 : 1000 },
        data: data(12),
        labelFormatter: (d: any, i: number) => `${i}`,
        showGrid: true,
        endPos: [600, 50],
        gridAreaFill: 'lightgreen',
        gridLength: 40,
        gridStroke: 'red',
        labelSpacing: 5,
        lineExtension: [10, 10],
        startPos: [50, 50],
        tickLength: 5,
        type: 'linear',
      },
    })
  );

  function update() {
    axis.update({ startPos: [200, 50], endPos: [500, 50], data: data(6) });
  }

  function reset() {
    axis.update({ startPos: [50, 50], endPos: [600, 50], data: data(12) });
  }

  group.appendChild(
    new Button({
      style: {
        x: 50,
        y: 100,
        text: 'update',
        onClick: update,
      },
    })
  );

  group.appendChild(
    new Button({
      style: {
        x: 150,
        y: 100,
        text: 'reset',
        onClick: reset,
      },
    })
  );

  if (process.env.NODE_ENV === 'test') {
    update();
  }

  return group;
};

AxisAnimationUpdate4.tags = ['坐标轴', '动画', '更新'];

AxisAnimationUpdate4.wait = 500;
