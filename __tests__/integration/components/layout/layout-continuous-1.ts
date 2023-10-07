import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { Continuous } from '../../../../src/ui/legend';

export const LayoutContinuous1 = () => {
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

  const justifyContent = 'flex-start';
  const alignItems = 'flex-start';

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
    group.appendChild(
      new Continuous({
        style: {
          data: [{ value: 0 }, { value: 1000 }],
          handleFormatter: (str: any) => `${str}°C`,
          showLabel: false,
          width: 300,
          height: 50,
          handleMarkerSize: 30,
          ribbonTrackFill: 'pink',
        },
      })
    )
  );

  return group;
};

LayoutContinuous1.tags = ['布局', '连续图例', '位置'];
