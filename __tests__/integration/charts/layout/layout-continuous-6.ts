import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { Continuous } from '../../../../src/ui/legend';

export const LayoutContinuous6 = () => {
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

  const justifyContent = 'center';
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
    group.appendChild(
      new Continuous({
        style: {
          width: 300,
          height: 50,
          data: [{ value: 0 }, { value: 1000 }],
          showLabel: false,
          handleMarkerSize: 30,
          handleFormatter: (str: any) => `${str}°C`,
          ribbonTrackFill: 'pink',
        },
      })
    )
  );

  return group;
};

LayoutContinuous6.tags = ['布局', '连续图例', '位置'];
