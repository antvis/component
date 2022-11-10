import { Group, Text, Image } from '@antv/g';
import { axisWarper, data } from '../../utils';

export const AxisLinearLabel = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: data(10, 1),
    lineLineWidth: 5,
  });

  const createLabel = (icon: any, text: any) => {
    const labelGroup = new Group({});
    const labelIcon = new Image({
      style: {
        src: icon,
        width: 30,
        height: 30,
        anchor: '0.5 0.5',
      },
    });
    const labelText = new Text({
      style: {
        text,
        textAlign: 'center',
        transform: 'translate(0, 30)',
      },
    });
    labelGroup.appendChild(labelIcon);
    labelGroup.appendChild(labelText);
    return labelGroup;
  };

  createAxis({
    startPos: [50, 20],
    endPos: [600, 20],
    tickLength: 0,
    lineExtension: [30, 30],
    // showLine: false,
    showTick: false,
    showGrid: false,
    labelSpacing: 20,
    labelFormatter: (datum: any, index: number) => {
      if (index > 2) return `第${index + 1}名`;
      return createLabel(
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*1NiMRKb2sfMAAAAAAAAAAAAADmJ7AQ/original',
        ['冠军🏆', '亚军🥈', '季军🥉'][index]
      );
    },
  });

  const axis = createAxis({
    type: 'linear',
    startPos: [0, 150],
    endPos: [400, 150],
    data: [
      {
        value: 0.05,
        label: '0~0.1',
        id: '0',
        range: [0, 0.1],
      },
      {
        value: 0.15000000000000002,
        label: '0.1~0.2',
        id: '1',
        range: [0.1, 0.2],
      },
      {
        value: 0.25,
        label: '0.2~0.30000000000000004',
        id: '2',
        range: [0.2, 0.30000000000000004],
      },
      {
        value: 0.35000000000000003,
        label: '0.30000000000000004~0.4',
        id: '3',
        range: [0.30000000000000004, 0.4],
      },
      {
        value: 0.45,
        label: '0.4~0.5',
        id: '4',
        range: [0.4, 0.5],
      },
      {
        value: 0.55,
        label: '0.5~0.6000000000000001',
        id: '5',
        range: [0.5, 0.6000000000000001],
      },
      {
        value: 0.6500000000000001,
        label: '0.6000000000000001~0.7000000000000001',
        id: '6',
        range: [0.6000000000000001, 0.7000000000000001],
      },
      {
        value: 0.75,
        label: '0.7000000000000001~0.8',
        id: '7',
        range: [0.7000000000000001, 0.8],
      },
      {
        value: 0.8500000000000001,
        label: '0.8~0.9',
        id: '8',
        range: [0.8, 0.9],
      },
      {
        value: 0.95,
        label: '0.9~1',
        id: '9',
        range: [0.9, 1],
      },
    ],
    // showLine: false,
    showGrid: false,
    showTick: false,
    labelSpacing: 20,
    labelFilter: (_: any, i: number) => i % 2 === 0,
    labelTransform: 'rotate(0)',
    labelTextAlign: 'center',
    labelTextBaseline: 'bottom',
    labelDirection: 'negative',
  });

  axis.style.labelFormatter = () => 'Text';

  return group;
};
