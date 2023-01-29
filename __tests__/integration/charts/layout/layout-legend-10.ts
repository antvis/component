import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { Category, Continuous } from '../../../../src/ui/legend';
import { ageData } from '../legend/data';

export const LayoutLegend10 = () => {
  const group = new Group({
    style: {
      width: 500,
      height: 500,
    },
  });

  group.appendChild(
    new Rect({
      style: {
        width: 500,
        height: 500,
        stroke: 'red',
      },
    })
  );

  const justifyContent = 'flex-end';
  const alignItems = 'flex-end';

  const layout = group.appendChild(
    new Layout({
      style: {
        width: 500,
        height: 500,
        display: 'flex',
        justifyContent,
        alignItems,
      },
    })
  );
  layout.appendChild(
    new Continuous({
      style: {
        x: 10,
        y: 50,
        data: [{ value: 0 }, { value: 250 }, { value: 500 }, { value: 750 }, { value: 1000 }],
        ribbonLen: 400,
        ribbonSize: 30,
        showLabel: false,
        handleMarkerSize: 30,
        handleFormatter: (str: any) => `${str}°C`,
        ribbonTrackFill: 'pink',
      },
    })
  );

  return group;
};

LayoutLegend10.tags = ['布局', '图例', '位置'];
