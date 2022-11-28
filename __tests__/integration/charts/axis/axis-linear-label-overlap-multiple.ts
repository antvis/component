import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabelOverlapMultiple = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: data(12),
    lineLineWidth: 5,
    tickLineWidth: 5,
    labelSpacing: 5,
    labelFormatter: () => 'ABCDEFGHIJKL',
    titleTransform: 'translate(100%, 0)',
  });

  const transforms = {
    rotate: {
      type: 'rotate',
      optionalAngles: [30, 45, 60],
    },
    hide: { type: 'hide' },
    ellipsis: { type: 'ellipsis', minLength: 50, maxLength: 60 },
    rotate1: {
      type: 'rotate',
      optionalAngles: [10],
      recoverWhenFailed: true,
    },
    rotate2: {
      type: 'rotate',
      optionalAngles: [10],
    },
  };

  createAxis({ startPos: [50, 50], endPos: [500, 50], title: 'default', labelTransforms: [] });

  createAxis({
    startPos: [50, 100],
    endPos: [500, 100],
    title: 'ellipsis + rotate',
    labelTransforms: [transforms.ellipsis, transforms.rotate],
  });

  createAxis({
    startPos: [50, 200],
    endPos: [500, 200],
    title: 'ellipsis + hide',
    labelTransforms: [transforms.ellipsis, transforms.hide],
  });

  createAxis({
    startPos: [50, 300],
    endPos: [500, 300],
    title: 'rotate failed recoverWhenFailed',
    labelTransforms: [transforms.rotate1],
  });

  createAxis({
    startPos: [50, 400],
    endPos: [500, 400],
    title: 'rotate failed keep status',
    labelTransforms: [transforms.rotate2],
  });

  createAxis({
    startPos: [50, 500],
    endPos: [500, 500],
    title: 'rotate + ellipsis',
    labelTransforms: [transforms.rotate2, transforms.ellipsis],
  });

  createAxis({
    startPos: [550, 50],
    endPos: [900, 50],
    title: 'rotate + ellipsis + hide',
    labelTransforms: [transforms.rotate2, transforms.ellipsis, transforms.hide],
  });
  return group;
};
