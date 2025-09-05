import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelRender3 = () => {
  const group = new Group({
    style: {
      width: 550,
      height: 150,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(4),
        labelRender: (_: any, index: number) =>
          `<div class="custom-label" style="box-sizing: border-box; height: 30px; text-align: left; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" >Tick text is very long ${index}</div>`,
        type: 'linear',
        lineLineWidth: 5,
        tickLineWidth: 5,
        labelSpacing: 5,
        tickLength: 10,
        startPos: [50, 50],
        endPos: [500, 50],
      },
    })
  );

  return group;
};
