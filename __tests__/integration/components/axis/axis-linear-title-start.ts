import { Group } from '@antv/g';
import { axisWarper } from '../../utils';

export const AxisLinearTitleStart = () => {
  const group = new Group({
    style: {
      width: 300,
      height: 300,
    },
  });

  const createAxis = axisWarper(group, {
    showTick: false,
    data: new Array(5).fill(0).map((_, i, arr) => ({ value: i / (arr.length - 1), label: '' })),
    type: 'linear',
    titleText: 'title',
    titleFill: 'red',
    titleFontSize: 20,
    titleFontWeight: 'bold',
    titlePosition: 'start',
  });

  const center = [150, 150];

  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x = center[0] + Math.cos(angle) * 100;
    const y = center[1] + Math.sin(angle) * 100;
    createAxis({ startPos: [x, y], endPos: center, titleSpacing: 10 });
  }

  return group;
};

AxisLinearTitleStart.tags = ['坐标轴', '直线', '起点'];
