import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabelOverlapMultiple = () => {
  const group = new Group({
    style: {
      width: 1000,
      height: 550,
    },
  });

  const createAxis = axisWarper(group, {
    data: data(12),
    labelFormatter: () => 'ABCDEFGHIJKL',
    type: 'linear',
    lineLineWidth: 5,
    tickLineWidth: 5,
    labelSpacing: 5,
    titleTransform: 'translate(100%, 0)',
  });

  const overlaps = {
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
      recoverWhenFailed: false,
    },
  };

  createAxis({ startPos: [50, 50], endPos: [500, 50], titleText: 'default', laeblOverlap: [] });

  createAxis({
    startPos: [50, 100],
    endPos: [500, 100],
    titleText: 'ellipsis + rotate',
    laeblOverlap: [overlaps.ellipsis, overlaps.rotate],
  });

  createAxis({
    startPos: [50, 200],
    endPos: [500, 200],
    titleText: 'ellipsis + hide',
    laeblOverlap: [overlaps.ellipsis, overlaps.hide],
  });

  createAxis({
    startPos: [50, 300],
    endPos: [500, 300],
    titleText: 'rotate failed recoverWhenFailed',
    laeblOverlap: [overlaps.rotate1],
  });

  createAxis({
    startPos: [50, 400],
    endPos: [500, 400],
    titleText: 'rotate failed keep status',
    laeblOverlap: [overlaps.rotate2],
  });

  createAxis({
    startPos: [50, 500],
    endPos: [500, 500],
    titleText: 'rotate + ellipsis',
    laeblOverlap: [overlaps.rotate2, overlaps.ellipsis],
  });

  createAxis({
    startPos: [550, 50],
    endPos: [900, 50],
    titleText: 'rotate + ellipsis + hide',
    laeblOverlap: [overlaps.rotate2, overlaps.ellipsis, overlaps.hide],
  });
  return group;
};

AxisLinearLabelOverlapMultiple.wait = 1000;
