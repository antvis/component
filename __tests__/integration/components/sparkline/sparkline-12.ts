import { Group } from '@antv/g';
import { Sparkline } from '../../../../src/ui/sparkline';

export const Sparkline12 = () => {
  const group = new Group();

  group.appendChild(
    new Sparkline({
      style: {
        x: 10,
        y: 10,
        type: 'column',
        width: 300,
        height: 50,
        isStack: true,
        isGroup: true,
        color: [
          '#678ef2',
          '#7dd5a9',
          '#616f8f',
          '#edbf45',
          '#6c5ff0',
          '#83c6e8',
          '#8c61b4',
          '#f19d56',
          '#479292',
          '#f19ec2',
        ],
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, -13, 3, 3, 10, 12],
        ],
      },
    })
  );

  return group;
};

Sparkline12.tags = ['迷你图', '条形图图', '分组', '堆叠', '自定义颜色'];
