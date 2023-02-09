import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationUpdate1 = () => {
  const group = new Group({
    style: {
      width: 650,
      height: 150,
    },
  });

  const axis = group.appendChild(
    new Axis({
      style: {
        startPos: [50, 50],
        endPos: [600, 50],
        data: mockData,
        lineExtension: [10, 10],
        tickLength: 5,
        type: 'linear',
        labelFormatter: (d, i) => `${i}`,
        labelSpacing: 5,
        showGrid: true,
        gridStroke: 'red',
        gridLength: 40,
        gridAreaFill: 'lightgreen',
        animate: { duration: process.env.NODE_ENV === 'test' ? 100 : 1000 },
      },
    })
  );

  function update() {
    axis.update({ startPos: [200, 50], endPos: [500, 50] });
  }

  function reset() {
    axis.update({ startPos: [50, 50], endPos: [600, 50] });
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

AxisAnimationUpdate1.tags = ['坐标轴', '动画', '更新'];
