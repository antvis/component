import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasisZ = () => {
  const group = new Group({
    style: {
      width: 650,
      height: 80,
    },
  });

  const zAxis = new Axis({
    style: {
      gridLength: 300,
      gridDirection: 'negative',
      gridLineWidth: 2,
      gridLineDash: [0],
      data: new Array(10).fill(0).map((_, i, arr) => ({ value: i / (arr.length - 1), label: '' })),
      labelFormatter: (a, b) => b,
      startPos: [50, 350],
      endPos: [350, 350],
      tickLength: 4,
      type: 'linear',
      tickLineWidth: 2,
      labelSpacing: 4,
      /**
       * enable billboard effect
       */
      tickIsBillboard: true,
      lineIsBillboard: true,
      labelIsBillboard: true,
      titleIsBillboard: true,
      gridIsBillboard: true,
      titleText: 'zAxis',
      titlePosition: 'bottom',
    },
  });
  zAxis.setOrigin(50, 50, 0);
  zAxis.rotate(0, 90, 0);
  group.appendChild(zAxis);

  const yAxis = new Axis({
    style: {
      gridLength: 300,
      gridDirection: 'positive',
      gridLineWidth: 2,
      gridLineDash: [0],
      data: new Array(10).fill(0).map((_, i, arr) => ({ value: i / (arr.length - 1), label: '' })),
      labelFormatter: (a, b) => b,
      startPos: [50, 350],
      endPos: [50, 50],
      tickLength: 4,
      type: 'linear',
      tickLineWidth: 2,
      tickDirection: 'negative',
      showLabel: false,
      showTitle: false,
      /**
       * enable billboard effect
       */
      tickIsBillboard: true,
      lineIsBillboard: true,
      labelIsBillboard: true,
      titleIsBillboard: true,
      gridIsBillboard: true,
      titleBillboardRotation: -Math.PI / 2,
    },
  });
  yAxis.setOrigin(50, 50, 0);
  yAxis.rotate(0, 90, 0);
  group.appendChild(yAxis);

  group.appendChild(
    new Axis({
      style: {
        gridLength: 300,
        gridDirection: 'positive',
        gridLineWidth: 2,
        gridLineDash: [0],
        data: new Array(10).fill(0).map((_, i, arr) => ({ value: i / (arr.length - 1), label: '' })),
        labelFormatter: (a, b) => b,
        startPos: [50, 350],
        endPos: [50, 50],
        tickLength: 4,
        type: 'linear',
        tickLineWidth: 2,
        labelSpacing: 8,
        tickDirection: 'negative',
        labelDirection: 'negative',
        /**
         * enable billboard effect
         */
        tickIsBillboard: true,
        lineIsBillboard: true,
        labelIsBillboard: true,
        titleIsBillboard: true,
        gridIsBillboard: true,
        titlePosition: 'left',
        titleText: 'yAxis',
        titleBillboardRotation: -Math.PI / 2,
      },
    })
  );

  group.appendChild(
    new Axis({
      style: {
        gridLength: 300,
        gridDirection: 'negative',
        gridLineWidth: 2,
        gridLineDash: [0],
        data: new Array(10).fill(0).map((_, i, arr) => ({ value: i / (arr.length - 1), label: '' })),
        labelFormatter: (a, b) => b,
        startPos: [50, 350],
        endPos: [350, 350],
        tickLength: 4,
        type: 'linear',
        tickLineWidth: 2,
        labelSpacing: 4,
        /**
         * enable billboard effect
         */
        tickIsBillboard: true,
        lineIsBillboard: true,
        labelIsBillboard: true,
        titleIsBillboard: true,
        gridIsBillboard: true,
        titlePosition: 'bottom',
        titleText: 'xAxis',
      },
    })
  );

  return group;
};

AxisLinearBasisZ.tags = ['笛卡尔坐标系', '截断', '水平', '正向'];
