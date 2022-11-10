import { Text, Group, Circle, Line, Rect } from '@antv/g';
import { axisWarper } from '../../utils';

export const AxisLinearTickFormat = () => {
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
    startPos: [200, 150],
    endPos: [600, 150],
    data: tickData,
    lineLineWidth: 5,
    labelFormatter: () => '',
    tickStroke: (datum: any, index: number) => (index % 2 === 0 ? 'blue' : 'green'),
    tickFormatter: (datum: any, index: number, data: any, [cx, cy]: any) => {
      if (index === 3) return new Rect({ style: { width: 20, height: 20, fill: 'green', anchor: '0.5 0.5' } });
      return index % 5 === 0
        ? new Circle({ style: { r: index % 10 === 0 ? 10 : 5 } })
        : new Line({ style: { x1: 0, x2: 0, y1: 50 * cx, y2: 10 * cy } });
    },
    tickLength: (datum: any, index: number) => index * 5,
    tickFill: (datum: any, index: number) => (index % 5 === 0 ? 'pink' : 'white'),
    tickLineWidth: (datum: any, index: number) => (index % 5 === 0 ? 5 : 3),
  });

  createAxis({});

  return group;
};
