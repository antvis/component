import { Group } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabelRotate = () => {
  const group = new Group({
    style: {
      width: 1000,
      height: 500,
    },
  });

  const createAxis = axisWarper(group, {
    labelFormatter: () => 'ABC',
    data: data(24),
    type: 'linear',
    titleTransform: 'translate(100%, 0)',
    lineLineWidth: 5,
    tickLineWidth: 5,
    labelSpacing: 5,
    titleText: '12',
  });

  createAxis({ startPos: [50, 50], endPos: [500, 50] });
  createAxis({ startPos: [50, 100], endPos: [500, 100], labelTransform: 'rotate(45)' });
  createAxis({ startPos: [50, 150], endPos: [500, 150], labelTransform: 'rotate(-45)' });
  createAxis({ startPos: [50, 200], endPos: [500, 200], labelTransform: 'rotate(90)' });
  createAxis({ startPos: [500, 300], endPos: [50, 300], labelTransform: 'rotate(0)' });
  createAxis({ startPos: [500, 350], endPos: [50, 350], labelTransform: 'rotate(45)' });
  createAxis({ startPos: [500, 400], endPos: [50, 400], labelTransform: 'rotate(-45)' });
  createAxis({ startPos: [500, 450], endPos: [50, 450], labelTransform: 'rotate(90)' });

  createAxis({ startPos: [600, 50], endPos: [600, 450] });
  createAxis({ startPos: [650, 50], endPos: [650, 450], labelTransform: 'rotate(45)' });
  createAxis({ startPos: [700, 50], endPos: [700, 450], labelTransform: 'rotate(-45)' });
  createAxis({ startPos: [750, 50], endPos: [750, 450], labelTransform: 'rotate(90)' });
  createAxis({ startPos: [800, 450], endPos: [800, 50], labelTransform: 'rotate(0)' });
  createAxis({ startPos: [850, 450], endPos: [850, 50], labelTransform: 'rotate(45)' });
  createAxis({ startPos: [900, 450], endPos: [900, 50], labelTransform: 'rotate(-45)' });
  createAxis({ startPos: [950, 450], endPos: [950, 50], labelTransform: 'rotate(90)' });

  return group;
};
