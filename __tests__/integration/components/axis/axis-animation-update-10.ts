import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationUpdate10 = () => {
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
        data: mockData,
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
        titleText: 'title',
        titleFill: 'red',
        titleFontSize: 16,
        titleFontWeight: 'bold',
        titlePosition: 'l',
        titleSpacing: 10,
        type: 'linear',
      },
    })
  );

  function update() {
    axis.update({ startPos: [200, 50], endPos: [500, 50], titleText: '' });
  }

  function reset() {
    axis.update({ startPos: [50, 50], endPos: [600, 50], titleText: 'title' });
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

AxisAnimationUpdate10.tags = ['坐标轴', '动画', '更新', '标题'];

AxisAnimationUpdate10.wait = 500;
