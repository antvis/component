import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearLabelSpacing = () => {
  const group = new Group({
    style: {
      width: 650,
      height: 600,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        startPos: [50, 500],
        endPos: [50, 50],
        tickLength: 10,
        labelSpacing: 5,
        labelAlign: 'horizontal',
        type: 'linear',
        labelFormatter: (d, i) => String(i),
      },
    })
  );

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        startPos: [100, 500],
        endPos: [100, 50],
        labelSpacing: 5,
        tickLength: 10,
        tickDirection: 'negative',
        labelAlign: 'horizontal',
        type: 'linear',
        labelFormatter: (d, i) => String(i),
      },
    })
  );

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        startPos: [150, 500],
        endPos: [150, 50],
        tickLength: 0,
        labelSpacing: 5,
        labelAlign: 'horizontal',
        type: 'linear',
        labelFormatter: (d, i) => String(i),
      },
    })
  );

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        startPos: [200, 50],
        endPos: [600, 50],
        tickLength: 0,
        labelSpacing: 5,
        labelAlign: 'horizontal',
        type: 'linear',
        labelFormatter: (d, i) => String(i),
      },
    })
  );

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        startPos: [200, 100],
        endPos: [600, 100],
        tickLength: 10,
        labelSpacing: 5,
        labelAlign: 'horizontal',
        type: 'linear',
        labelFormatter: (d, i) => String(i),
      },
    })
  );

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        startPos: [200, 150],
        endPos: [600, 150],
        tickLength: 10,
        tickDirection: 'negative',
        labelSpacing: 5,
        labelAlign: 'horizontal',
        type: 'linear',
        labelFormatter: (d, i) => String(i),
      },
    })
  );

  group.appendChild(
    new Axis({
      style: {
        data: mockData,
        startPos: [200, 200],
        endPos: [600, 200],
        tickLength: 10,
        labelDirection: 'negative',
        labelSpacing: 5,
        labelAlign: 'horizontal',
        type: 'linear',
        labelFormatter: (d, i) => String(i),
      },
    })
  );

  return group;
};

AxisLinearLabelSpacing.tags = ['笛卡尔坐标系', '垂直', '反向'];
