import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid1 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        startPos: [50, 50],
        endPos: [500, 50],
        tickDirection: 'negative',
        labelFormatter: '',
        gridLength: 200,
        gridAreaFill: 'rgba(0,0,0,0.05)',
        gridLineWidth: 0,

        lineLineWidth: 1,
        tickLength: 10,
        labelSpacing: 10,
        data: data(12),
      },
    })
  );

  // createAxis({
  //   type: 'linear',
  //   startPos: [100, 300],
  //   endPos: [100, 550],
  //   data: data(6),
  //   tickDirection: 'positive',
  //   gridLength: 200,
  //   gridDirection: 'negative',
  //   gridAreaFill: ['#f2cea5', '#f8dea3', '#c6cf93', '#95b5c0'],
  // });

  // createAxis({
  //   type: 'arc',
  //   data: data(26),
  //   angleRange: [0, 360],
  //   center: [780, 150],
  //   radius: 100,
  //   labelFormatter: '',
  //   lineLineWidth: 1,
  //   tickLineWidth: 0,
  //   gridDirection: 'negative',
  //   gridLength: 20,
  //   gridType: 'segment',
  //   gridConnect: 'line',
  //   gridLineWidth: 0,
  //   gridAreaFill: 'pink',
  //   lineArrowOffset: 20,
  // });

  // createAxis({
  //   type: 'arc',
  //   data: data(14),
  //   angleRange: [0, 360],
  //   center: [780, 150],
  //   radius: 80,
  //   lineLineWidth: 1,
  //   labelFormatter: '',
  //   tickLineWidth: 0,
  //   gridLength: 20,
  //   gridType: 'segment',
  //   gridConnect: 'arc',
  //   gridLineWidth: 0,
  //   gridAreaFill: 'pink',
  //   lineArrowOffset: 20,
  // });

  // createAxis({
  //   type: 'arc',
  //   data: data(6),
  //   angleRange: [0, 360],
  //   center: [780, 150],
  //   radius: 50,
  //   lineLineWidth: 1,
  //   labelFormatter: '',
  //   tickLineWidth: 0,
  //   gridLength: 50,
  //   gridType: 'segment',
  //   gridConnect: 'arc',
  //   gridLineWidth: 0,
  //   gridAreaFill: 'pink',
  //   lineArrowOffset: 20,
  // });

  // createAxis({
  //   type: 'linear',
  //   startPos: [500, 300],
  //   endPos: [500, 450],
  //   data: data(6),
  //   tickDirection: 'positive',
  //   gridDirection: 'negative',
  //   gridType: 'surround',
  //   gridConnect: 'arc',
  //   gridAreaFill: (datum: any, index: number) => (index % 2 === 0 ? 'pink' : 'transparent'),
  //   gridCenter: [500, 450],
  //   gridClosed: false,
  //   gridLineWidth: 0,
  //   gridControlAngles: [90, 180, 270],
  // });

  // createAxis({
  //   type: 'linear',
  //   startPos: [800, 450],
  //   endPos: [800, 600],
  //   data: data(6),
  //   tickDirection: 'negative',
  //   gridType: 'surround',
  //   gridAreaFill: ['#f2cea5', '#f8dea3', '#c6cf93', '#95b5c0'],
  //   gridCenter: [800, 450],
  //   gridLineWidth: 0,
  //   gridControlAngles: [45, 90, 135, 180, 225, 270, 315],
  // });

  return group;
};

AxisGrid1.tags = ['笛卡尔坐标系', '条形网格线', '间隔颜色填充'];
