import { Group } from '@antv/g';
import { data } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationUpdate6 = () => {
  const group = new Group({
    style: {
      width: 260,
      height: 260,
    },
  });

  const axis = group.appendChild(
    new Axis({
      style: {
        animate: { duration: process.env.NODE_ENV === 'test' ? 100 : 1000 },
        data: data(12),
        labelFormatter: (d: any, i: number) => `${i}`,
        center: [150, 150],
        endAngle: 360,
        labelSpacing: 10,
        radius: 80,
        startAngle: 0,
        tickLength: 10,
        type: 'arc',
      },
    })
  );

  function update() {
    axis.update({ radius: 100 });
  }

  function reset() {
    axis.update({ radius: 80 });
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
        transform: 'translate(80, 0)',
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

AxisAnimationUpdate6.tags = ['坐标轴', '动画', '更新'];

AxisAnimationUpdate6.wait = 500;
