import { Group } from '@antv/g';
import { data } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationUpdate12 = () => {
  const group = new Group({
    style: {
      width: 250,
      height: 250,
    },
  });

  const g1 = group.appendChild(
    new Group({
      style: {
        transform: 'translate(100, 100)',
      },
    })
  );

  const g2 = group.appendChild(
    new Group({
      style: {
        transform: 'translate(50, 50)',
      },
    })
  );

  const axis = g2.appendChild(
    new Axis({
      style: {
        animate: { duration: process.env.NODE_ENV === 'test' ? 100 : 1000 },
        data: data(12),
        showGrid: true,
        endPos: [150, 50],
        gridAreaFill: 'lightgreen',
        gridLength: 40,
        gridStroke: 'red',
        labelDirection: 'negative',
        labelAlign: 'horizontal',
        labelSpacing: 10,
        labelFormatter: (d: any, i: number) => `label-${i}`,
        lineExtension: [10, 10],
        startPos: [150, 500],
        tickLength: 5,
        // titleText: 'title',
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
    axis.update({ startPos: [150, 550], labelFormatter: () => 'label.label.label' });
  }

  function reset() {
    axis.update({ startPos: [150, 500], labelFormatter: (d: any, i: number) => `label-${i}` });
  }

  group.appendChild(
    new Button({
      style: {
        text: 'update',
        onClick: update,
      },
    })
  );

  group.appendChild(
    new Button({
      style: {
        x: 80,
        y: 0,
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

AxisAnimationUpdate12.tags = ['坐标轴', '动画', '更新', '标题'];

AxisAnimationUpdate12.wait = 500;
