import { Group } from '@antv/g';
import { data, axisWarper } from '../../utils';

export const AxisGrid2 = () => {
  const group = new Group({});
  const createAxis = axisWarper(group, {
    data: data(12),
  });

  createAxis({
    type: 'linear',
    startPos: [50, 50],
    endPos: [400, 50],
    tickDirection: 'negative',
    showTick: false,
    showLabel: false,
    gridLength: 100,
    gridAreaFill: 'rgba(0,0,0,0.05)',
    gridLineWidth: 0,
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
  });

  createAxis({
    type: 'linear',
    startPos: [200, 300],
    endPos: [200, 450],
    data: data(6),
    showLine: false,
    showTick: false,
    showLabel: false,
    gridLength: 200,
    gridDirection: 'negative',
    gridType: 'surround',
    gridConnect: 'arc',
    gridAreaFill: (datum: any, index: any) => (index % 2 === 0 ? 'pink' : 'transparent'),
    gridCenter: [200, 450],
    gridClosed: false,
    gridLineWidth: 0,
    gridControlAngles: [180, 270],
  });

  createAxis({
    type: 'linear',
    startPos: [500, 450],
    endPos: [500, 600],
    data: data(6),
    showLine: false,
    showTick: false,
    showLabel: false,
    gridLength: 200,
    gridType: 'surround',
    gridAreaFill: ['#f2cea5', '#f8dea3', '#c6cf93', '#95b5c0'],
    gridCenter: [500, 450],
    gridLineWidth: 0,
    gridControlAngles: [90, 180, 270],
  });

  return group;
};
