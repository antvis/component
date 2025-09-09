import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelRender2 = () => {
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
          `<div class="custom-label" style="font-size:12px; line-height: 1.5; border: 1px solid #ccc; padding: 6px; cursor: pointer;" >Tick ${index}</div>`,
        type: 'linear',
        lineLineWidth: 5,
        tickLineWidth: 5,
        labelSpacing: 5,
        tickLength: 10,
        startPos: [50, 50],
        endPos: [500, 50],
        tickDirection: 'negative',
      },
    })
  );

  return group;
};
