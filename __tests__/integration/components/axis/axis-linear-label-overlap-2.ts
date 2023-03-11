import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabelOverlap2 = () => {
  const group = new Group({
    style: {
      width: 400,
      height: 100,
    },
  });

  const createAxis = axisWarper(group, {
    data: data(12),
    labelFormatter: () => 'ABCDEF',
    type: 'linear',
    lineLineWidth: 5,
    tickLineWidth: 5,
    labelSpacing: 5,
  });

  const transforms = {
    rotate: {
      type: 'rotate',
      optionalAngles: [15, 30, 45, 60, 90],
    },
    hide: { type: 'hide' },
    ellipsis: { type: 'ellipsis', minLength: 10, maxLength: 50 },
  };

  createAxis({
    startPos: [50, 50],
    endPos: [500, 50],
    titleText: 'default',
    labelOverlap: [transforms.rotate],
    labelTransform: 'rotate(-90)',
  });

  return group;
};

AxisLinearLabelOverlap2.tags = ['坐标轴', '文本重叠', '旋转优先级'];
