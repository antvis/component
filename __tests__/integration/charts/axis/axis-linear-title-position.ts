import { Group } from '@antv/g';
import { axisWarper } from '../../utils';

export const AxisLinearTitlePosition = () => {
  const group = new Group({
    style: {
      width: 800,
      height: 600,
    },
  });

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: new Array(10).fill(0).map((_, i, arr) => ({ value: i / (arr.length - 1), label: '' })),
    lineLineWidth: 5,
    tickLineWidth: 5,
    title: 'title',
    titleFill: 'red',
    titleFontSize: 20,
    titleFontWeight: 'bold',
    labelFormatter: () => '',
  });

  createAxis({
    startPos: [50, 50],
    endPos: [500, 50],
    titleText: 'top',
    titlePosition: 'top',
  });
  createAxis({
    startPos: [50, 100],
    endPos: [50, 450],
    titleText: 'left',
    titlePosition: 'l',
    titleSpacing: 10,
    titleTransform: 'translate(50%, 0) rotate(-90)',
  });
  createAxis({
    startPos: [50, 500],
    endPos: [500, 500],
    titleText: 'bottom',
    titlePosition: 'b',
  });
  createAxis({
    startPos: [550, 50],
    endPos: [550, 500],
    titleText: 'right',
    titlePosition: 'r',
    titleSpacing: 10,
    titleTransform: 'translate(-50%, 0) rotate(-90)',
  });

  const g1 = group.appendChild(
    new Group({
      style: {},
    })
  );

  g1.appendChild(
    createAxis({
      startPos: [650, 50],
      endPos: [650, 500],
      titleText: 'right',
      titlePosition: 'r',
      titleSpacing: 10,
      titleTransform: 'translate(-50%, 0) rotate(-90)',
    })
  );

  const g2 = group.appendChild(
    new Group({
      style: {
        x: 60,
        y: 60,
      },
    })
  );

  g2.appendChild(
    createAxis({
      startPos: [650, 50],
      endPos: [650, 500],
      titleText: 'right',
      titlePosition: 'r',
      titleSpacing: 10,
      titleTransform: 'translate(-50%, 0) rotate(-90)',
    })
  );

  return group;
};
