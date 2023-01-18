import { Group, Image, Text } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabel = () => {
  const group = new Group({
    style: {
      width: 600,
      height: 150,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        startPos: [50, 50],
        endPos: [500, 50],
        lineLineWidth: 5,
        lineExtension: [30, 30],
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
        data: data(10, 1),
      },
    })
  );

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

  return group;
};

AxisLinearLabel.tags = ['笛卡尔坐标系', '刻度值', '标签', '自定义'];
