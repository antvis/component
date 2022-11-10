import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabelOverlap = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: data(12),
    lineLineWidth: 5,
    tickLineWidth: 5,
    labelSpacing: 5,
    labelFormatter: () => 'ABCDEF',
  });

  const transforms = {
    rotate: {
      type: 'rotate',
      optionalAngles: [15, 30, 45, 60, 90],
    },
    hide: { type: 'hide' },
    ellipsis: { type: 'ellipsis', minLength: 10, maxLength: 50 },
  };

  createAxis({ startPos: [50, 50], endPos: [500, 50], title: 'default', labelTransforms: [] });

  createAxis({
    startPos: [50, 100],
    endPos: [500, 100],
    title: 'auto rotate',
    labelTransforms: [transforms.rotate],
  });

  createAxis({ startPos: [50, 200], endPos: [500, 200], title: 'auto hide', labelTransforms: [transforms.hide] });

  createAxis({
    startPos: [50, 300],
    endPos: [500, 300],
    title: 'auto ellipsis',
    labelTransforms: [transforms.ellipsis],
  });

  createAxis({
    startPos: [500, 400],
    endPos: [50, 400],
    labelTransforms: [transforms.rotate],
  });
  createAxis({ startPos: [500, 450], endPos: [50, 450], labelTransforms: [transforms.hide] });
  createAxis({
    startPos: [500, 500],
    endPos: [50, 500],
    labelTransforms: [{ ...transforms.ellipsis, suffix: '!!' }],
  });
  // createAxis({ startPos: [500, 450], endPos: [50, 450], labelTransform: 'rotate(90)' });

  createAxis({ startPos: [575, 50], endPos: [575, 450] });
  createAxis({ startPos: [650, 50], endPos: [650, 450], labelTransforms: [transforms.rotate] });
  createAxis({ startPos: [700, 50], endPos: [700, 450], labelTransforms: [transforms.hide] });
  createAxis({ startPos: [750, 50], endPos: [750, 450], labelTransforms: [transforms.ellipsis] });
  createAxis({ startPos: [800, 450], endPos: [800, 50] });
  createAxis({ startPos: [850, 450], endPos: [850, 50], labelTransforms: [transforms.rotate] });
  createAxis({ startPos: [925, 450], endPos: [925, 50], labelTransforms: [transforms.hide] });
  createAxis({ startPos: [975, 450], endPos: [975, 50], labelTransforms: [transforms.ellipsis] });

  return group;
};

AxisLinearLabelOverlap.skip = true;
