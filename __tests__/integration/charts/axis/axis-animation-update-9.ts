import { Group } from '@antv/g';
import { data } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationUpdate9 = () => {
  const group = new Group({
    style: {
      width: 250,
      height: 550,
    },
  });

  const axis = group.appendChild(
    new Axis({
      style: {
        animate: { duration: process.env.NODE_ENV === 'test' ? 100 : 1000 },
        data: data(12),
        showGrid: true,
        style: {
          endPos: [150, 50],
          gridAreaFill: 'lightgreen',
          gridLength: 40,
          gridStroke: 'red',
          labelDirection: 'negative',
          labelSpacing: 10,
          labelTransform: 'rotate(0)',
          lineExtension: [10, 10],
          startPos: [150, 500],
          tickLength: 5,
          titleText: 'title',
          titleFill: 'red',
          titleFontSize: 16,
          titleFontWeight: 'bold',
          titlePosition: 'l',
          titleSpacing: 10,
          type: 'linear',
        },
      },
    })
  );

  function update() {
    return axis.update({ data: data(12).map((d) => ({ ...d, label: `${d.label}.text` })) });
  }

  function reset() {
    axis.update({ data: data(12) });
  }

  group.appendChild(
    new Button({
      style: {
        style: {
          x: 250,
          y: 100,
          text: 'update',
          onClick: update,
        },
      },
    })
  );

  group.appendChild(
    new Button({
      style: {
        style: {
          x: 250,
          y: 150,
          text: 'reset',
          onClick: reset,
        },
      },
    })
  );

  if (process.env.NODE_ENV === 'test') {
    update();
    // update data trigger enter, so don't to await
    reset();
  }

  return group;
};

AxisAnimationUpdate9.tags = ['坐标轴', '动画', '更新'];
