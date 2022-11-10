import type { Group } from '@antv/g';
import { Axis } from '../../../src/ui/axis';

export const axisWarper = (group: Group, baseParams: any) => {
  return (extraParams: any) => {
    return group.appendChild(
      new Axis({
        style: {
          radius: 80,
          lineLineWidth: 1,
          tickLength: 10,
          labelSpacing: 10,
          ...baseParams,
          ...extraParams,
        },
      })
    );
  };
};
