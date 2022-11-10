import { Group } from '@antv/g';
import { data, axisWarper } from '../../utils';

export const AxisGrid = () => {
  const group = new Group({});
  const createAxis = axisWarper(group, {
    data: data(12),
  });

  createAxis({
    type: 'linear',
    startPos: [50, 50],
    endPos: [500, 50],
    tickDirection: 'negative',
    labelFormatter: '',
    gridLength: 200,
    gridAreaFill: 'rgba(0,0,0,0.05)',
    gridLineWidth: 0,
  });

  createAxis({
    type: 'linear',
    startPos: [100, 300],
    endPos: [100, 550],
    data: data(6),
    tickDirection: 'positive',
    gridLength: 200,
    gridDirection: 'negative',
    gridAreaFill: ['#f2cea5', '#f8dea3', '#c6cf93', '#95b5c0'],
  });

  createAxis({
    type: 'arc',
    data: data(26),
    angleRange: [0, 360],
    center: [780, 150],
    radius: 100,
    labelFormatter: '',
    lineLineWidth: 1,
    tickLineWidth: 0,
    gridDirection: 'negative',
    gridLength: 20,
    gridType: 'segment',
    gridConnect: 'line',
    gridLineWidth: 0,
    gridAreaFill: 'pink',
    lineArrowOffset: 20,
  });

  createAxis({
    type: 'arc',
    data: data(14),
    angleRange: [0, 360],
    center: [780, 150],
    radius: 80,
    lineLineWidth: 1,
    labelFormatter: '',
    tickLineWidth: 0,
    gridLength: 20,
    gridType: 'segment',
    gridConnect: 'arc',
    gridLineWidth: 0,
    gridAreaFill: 'pink',
    lineArrowOffset: 20,
  });

  createAxis({
    type: 'arc',
    data: data(6),
    angleRange: [0, 360],
    center: [780, 150],
    radius: 50,
    lineLineWidth: 1,
    labelFormatter: '',
    tickLineWidth: 0,
    gridLength: 50,
    gridType: 'segment',
    gridConnect: 'arc',
    gridLineWidth: 0,
    gridAreaFill: 'pink',
    lineArrowOffset: 20,
  });

  createAxis({
    type: 'linear',
    startPos: [500, 300],
    endPos: [500, 450],
    data: data(6),
    tickDirection: 'positive',
    gridLength: 200,
    gridDirection: 'negative',
    gridType: 'surround',
    gridConnect: 'arc',
    gridAreaFill: (datum: any, index: number) => (index % 2 === 0 ? 'pink' : 'transparent'),
    gridCenter: [500, 450],
    gridClosed: false,
    gridLineWidth: 0,
    gridControlAngles: [90, 180, 270],
  });

  createAxis({
    type: 'linear',
    startPos: [800, 450],
    endPos: [800, 600],
    data: data(6),
    tickDirection: 'negative',
    gridLength: 200,
    gridType: 'surround',
    // gridConnect: 'arc',
    gridAreaFill: ['#f2cea5', '#f8dea3', '#c6cf93', '#95b5c0'],
    gridCenter: [800, 450],
    // gridClosed: true,
    gridLineWidth: 0,
    gridControlAngles: [45, 90, 135, 180, 225, 270, 315],
  });

  return group;
};
