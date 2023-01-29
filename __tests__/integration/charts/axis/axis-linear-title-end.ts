import { Group, Image, Text } from '@antv/g';
import { axisWarper } from '../../utils';

export const AxisLinearTitleEnd = () => {
  const group = new Group({
    style: {
      width: 400,
      height: 400,
    },
  });

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: new Array(5).fill(0).map((_, i, arr) => ({ value: i / (arr.length - 1), label: '' })),
    title: 'title',
    titleFill: 'red',
    titleFontSize: 20,
    titleFontWeight: 'bold',
    titlePosition: 'end',
    showTick: false,
  });

  const center = [200, 200];

  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x = center[0] + Math.cos(angle) * 100;
    const y = center[1] + Math.sin(angle) * 100;
    createAxis({ startPos: center, endPos: [x, y], titleSpacing: 40 });
  }

  return group;
};

AxisLinearTitleEnd.tags = ['坐标轴', '直线', '终点'];
