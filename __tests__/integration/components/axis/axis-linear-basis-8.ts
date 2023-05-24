import { Group, Text } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

function bboxOf(content: string) {
  const text = new Text({ style: { text: content } });
  return text.getBBox();
}

export const AxisLinearBasis8 = () => {
  const group = new Group({
    style: {
      width: 600,
      height: 600,
    },
  });

  const data = mockData.map((d) => {
    const bbox = bboxOf(d.label);
    bbox.width *= 1.5;
    return { ...d, bbox };
  });

  group.appendChild(
    new Axis({
      style: {
        data,
        labelOverlap: [{ type: 'hide' }],
        startPos: [50, 50],
        endPos: [500, 50],
        labelSpacing: 5,
        labelDirection: 'negative',
        labelAlign: 'horizontal',
        lineStroke: 'green',
        tickLength: 10,
        type: 'linear',
        lineLineWidth: 5,
        tickLineWidth: 5,
        tickStroke: 'green',
      },
    })
  );

  return group;
};

AxisLinearBasis8.tags = ['笛卡尔坐标系', 'bbox'];
