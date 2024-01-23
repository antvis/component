import { Group, Image } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { Text } from '../../../../src/shapes';
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
        showTick: false,
        showGrid: false,
        labelFormatter: (datum: any, index: number) => {
          if (index > 2) return `第${index + 1}名`;
          return createLabel(
            'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*1NiMRKb2sfMAAAAAAAAAAAAADmJ7AQ/original',
            ['冠军🏆', '亚军🥈', '季军🥉'][index]
          );
        },
        data: data(10, 1),
        type: 'linear',
        startPos: [50, 50],
        endPos: [500, 50],
        lineLineWidth: 5,
        lineExtension: [30, 30],
        labelSpacing: 20,
      },
    })
  );

  const createLabel = (icon: any, text: any) => {
    const labelGroup = new Group({});
    const labelIcon = new Image({
      style: {
        src: icon,
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        transform: 'translate(-15, -15)',
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
