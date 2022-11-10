import { Group, Text } from '@antv/g';
import { axisWarper } from '../../utils';

export const AxisLinearBasis = () => {
  const data = [
    '蚂蚁技术研究院',
    '智能资金',
    '蚂蚁消金',
    '合规线',
    '战略线',
    '商业智能线',
    'CFO线',
    'CTO线',
    '投资线',
    'GR线',
    '社会公益及绿色发展事业群',
    '阿里妈妈事业群',
    'CMO线',
    '大安全',
    '天猫事业线',
    '影业',
    'OceanBase',
    '投资基金线',
    '阿里体育',
    '智能科技事业群',
  ];

  const tickData = data.map((d, idx) => {
    const step = 1 / data.length;
    return {
      value: step * idx,
      label: d,
      id: String(idx),
    };
  });

  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: tickData,
    lineLineWidth: 5,
    lineStroke: 'red',
    truncRange: [0.4, 0.6],
    lineExtension: [10, 10],
    tickLength: 10,
    tickLineWidth: 5,
    tickStroke: 'green',
  });

  createAxis({
    startPos: [20, 20],
    endPos: [600, 20],
    data: tickData,
    lineStroke: 'red',
    truncRange: [0.4, 0.6],
    lineExtension: [10, 10],
    tickLength: 10,
    labelFormatter: () => '123',
  });

  createAxis({
    startPos: [20, 50],
    endPos: [20, 500],
    data: tickData,
    labelSpacing: 20,
    lineStroke: 'green',
    tickLength: 10,
    labelFormatter: ({ label }: any) =>
      new Text({
        style: {
          text: label,
          fill: 'red',
          fontSize: 10,
          textBaseline: 'middle',
        },
      }),
  });

  createAxis({
    startPos: [50, 100],
    endPos: [450, 500],
    data: tickData,
    lineLineWidth: 5,
    lineStroke: 'orange',
    tickStroke: 'black',
    tickLength: 10,
  });

  createAxis({
    startPos: [550, 500],
    endPos: [100, 50],
    data: tickData,
    lineLineWidth: 5,
    lineStroke: 'blue',
    tickStroke: 'blue',
    tickLength: 10,
  });

  createAxis({
    startPos: [20, 550],
    endPos: [600, 550],
    data: tickData,
    tickDirection: 'negative',
    lineLineWidth: 5,
    lineStroke: 'pink',
    truncRange: [0.4, 0.6],
    lineExtension: [10, 10],
    tickLength: 10,
  });

  createAxis({
    startPos: [600, 500],
    endPos: [600, 50],
    data: tickData,
    lineLineWidth: 5,
    lineStroke: 'purple',
    tickLength: 10,
  });

  // createAxis({
  //   startPos: [660, 380],
  //   endPos: [950, 380],
  //   data: tickData,
  //   truncRange: [0.1, 0.3],
  //   lineLineWidth: 2,
  //   lineStroke: 'black',
  //   tickLineWidth: 2,
  //   tickStroke: 'black',
  //   labelTransform: 'rotate(90)',
  //   labelTransforms: [
  //     {
  //       type: 'ellipsis',
  //       minLength: 50,
  //       maxLength: 120,
  //       suffix: '...',
  //     },
  //   ],
  // });

  return group;
};
