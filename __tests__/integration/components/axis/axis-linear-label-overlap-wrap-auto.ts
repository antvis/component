import { DisplayObject, Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisLinearLabelOverlapWrapAuto = () => {
  const group = new Group({
    style: {
      width: 550,
      height: 150,
    },
  });

  const axis = group.appendChild(
    new Axis({
      style: {
        data: mockData,
        labelOverlap: [
          { type: 'ellipsis' },
          {
            type: 'wrap',
            wordWrapWidth: (main) => {
              const elements = main.getElementsByClassName('axis-tick-group');
              const ticks = elements?.[0]?.childNodes as DisplayObject[];
              const width = ticks[1].getBBox().x - ticks[0].getBBox().x;
              return width;
            },
            maxLines: 2,
            recoverWhenFailed: false,
          },
        ],
        startPos: [50, 50],
        endPos: [500, 50],
        lineLineWidth: 2,
        lineStroke: 'black',
        tickLineWidth: 2,
        tickStroke: 'black',
        labelSpacing: 10,
        type: 'linear',
      },
    })
  );

  group.appendChild(
    new Button({
      style: { x: 250, y: 200, text: 'update', onClick: update },
    })
  );

  group.appendChild(
    new Button({
      style: { x: 250, y: 150, text: 'reset', onClick: reset },
    })
  );

  function update() {
    return axis.update({ endPos: [900, 50] });
  }

  function reset() {
    return axis.update({ endPos: [500, 50] });
  }

  return group;
};

AxisLinearLabelOverlapWrapAuto.tags = ['笛卡尔坐标系', '截断', '水平', '正向', '缩略', '自适应'];
