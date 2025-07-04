import { Group } from '@antv/g';
import { CategoryItems } from './utils';
import { flowItemData } from './data';

export const CategoryItemsPoptip3 = () => {
  const group = new Group();
  const colors = ['red', 'orange', 'green', 'blue', 'purple'];

  group.appendChild(
    new CategoryItems({
      style: {
        data: flowItemData,
        layout: 'flex',
        itemLabelFill: 'red',
        itemValueFill: 'green',
        colPadding: 10,
        gridRow: 2,
        gridCol: 5,
        width: 650,
        height: 50,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
        poptip: {
          domStyles: {
            '.component-poptip': {
              'background-color': 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ddd',
              'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.15)',
              'border-radius': '4px',
            },
            '.component-poptip-text': {
              color: '#333',
              'font-size': '12px',
              padding: '4px 8px',
            },
          },
        },
      },
    })
  );

  return group;
};

CategoryItemsPoptip3.tags = ['分类图例', '图例组', 'poptip', '样式配置'];
