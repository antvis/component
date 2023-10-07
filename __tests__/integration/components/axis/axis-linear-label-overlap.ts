import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabelOverlap = () => {
  const group = new Group({
    style: {
      width: 1000,
      height: 550,
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

  createAxis({ startPos: [50, 50], endPos: [500, 50], titleText: 'default', labelOverlap: [] });

  createAxis({
    startPos: [50, 100],
    endPos: [500, 100],
    titleText: 'auto rotate',
    labelOverlap: [transforms.rotate],
  });

  createAxis({
    startPos: [50, 200],
    endPos: [500, 200],
    titleText: 'auto hide',
    labelOverlap: [transforms.hide],
  });

  createAxis({
    startPos: [50, 300],
    endPos: [500, 300],
    titleText: 'auto ellipsis',
    labelOverlap: [transforms.ellipsis],
  });

  createAxis({
    startPos: [500, 400],
    endPos: [50, 400],
    labelOverlap: [transforms.rotate],
  });
  createAxis({ startPos: [500, 450], endPos: [50, 450], labelOverlap: [transforms.hide] });
  createAxis({
    startPos: [500, 500],
    endPos: [50, 500],
    labelOverlap: [{ ...transforms.ellipsis, suffix: '!!' }],
  });

  createAxis({ startPos: [575, 50], endPos: [575, 450] });
  createAxis({ startPos: [650, 50], endPos: [650, 450], labelOverlap: [transforms.rotate] });
  createAxis({ startPos: [700, 50], endPos: [700, 450], labelOverlap: [transforms.hide] });
  createAxis({ startPos: [750, 50], endPos: [750, 450], labelOverlap: [transforms.ellipsis] });
  createAxis({ startPos: [800, 450], endPos: [800, 50] });
  createAxis({ startPos: [850, 450], endPos: [850, 50], labelOverlap: [transforms.rotate] });
  createAxis({ startPos: [925, 450], endPos: [925, 50], labelOverlap: [transforms.hide] });
  createAxis({ startPos: [975, 450], endPos: [975, 50], labelOverlap: [transforms.ellipsis] });

  return group;
};
