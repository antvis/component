import { Group } from '@antv/g';
import { Text } from '../../../../src/shapes';
import { axisWarper } from '../../utils';

export const AxisLinearVertical = () => {
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

  const group = new Group({
    style: {
      width: 600,
      height: 550,
    },
  });

  const createAxis = axisWarper(group, {
    data: tickData,
    labelFormatter: ({ label }: any) =>
      new Text({
        style: {
          text: label,
          fill: 'red',
          fontSize: 10,
          textBaseline: 'middle',
        },
      }),
    type: 'linear',
    lineLineWidth: 5,
    lineStroke: 'purple',
    labelSpacing: 10,
    labelAlign: 'horizontal',
  });

  createAxis({
    startPos: [220, 500],
    endPos: [220, 50],
  });

  createAxis({
    startPos: [550, 50],
    endPos: [550, 500],
  });

  return group;
};
