import type { Group } from '@antv/g';
import { Axis } from '../../../src/ui/axis';
import { deepAssign } from '../../../src/util';

export const axisWarper = (group: Group, baseParams: any) => {
  return (extraParams: any) => {
    return group.appendChild(
      new Axis(
        deepAssign(
          { style: { radius: 80, lineLineWidth: 1, tickLength: 10, labelSpacing: 10 } },
          { style: baseParams },
          { style: extraParams }
        )
      )
    );
  };
};
