import { Group } from '@antv/g';
import { data, axisWarper } from '../../utils';

export const AxisGrid3 = () => {
  const group = new Group({});
  const createAxis = axisWarper(group, {
    data: data(12),
  });

  createAxis({
    type: 'linear',
    startPos: [50, 50],
    endPos: [300, 50],
    tickDirection: 'negative',
    showTick: false,
    showLabel: false,
    gridLength: 150,
    gridLineWidth: 1,
    gridStroke: 'rgba(0,0,0,0.5)',
  });

  createAxis({
    type: 'arc',
    data: data(12),
    angleRange: [0, 360],
    center: [580, 150],
    radius: 100,
    lineLineWidth: 1,
    showLabel: false,
    showTick: false,
    gridLength: 100,
    gridType: 'segment',
    gridConnect: 'arc',
    gridLineWidth: 1,
    gridStroke: 'rgba(0,0,0,0.5)',
  });

  createAxis({
    type: 'linear',
    startPos: [200, 350],
    endPos: [200, 450],
    data: data(5),
    showLine: false,
    showTick: false,
    showLabel: false,
    gridDirection: 'negative',
    gridType: 'surround',
    gridConnect: 'arc',
    gridCenter: [200, 450],
    gridClosed: false,
    gridLineWidth: 1,
    gridStroke: 'rgba(0,0,0,0.5)',
    gridControlAngles: [180, 270],
  });

  createAxis({
    type: 'linear',
    startPos: [500, 450],
    endPos: [500, 580],
    data: data(6),
    showLine: false,
    showTick: false,
    showLabel: false,
    gridType: 'surround',
    gridClosed: true,
    gridLineWidth: 1,
    gridStroke: 'rgba(0,0,0,0.5)',
    gridCenter: [500, 450],
    gridControlAngles: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360],
  });

  return group;
};
