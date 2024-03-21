import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';

export const BugAxisTitlePosition = () => {
  const group = new Group({
    style: {
      width: 200,
      height: 450,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        showLine: true,
        showLabel: true,
        showGrid: false,
        showTick: true,
        labelOverlap: [],
        data: [
          { value: 0.8724832214765101, label: '4', id: '0' },
          { value: 0.738255033557047, label: '6', id: '1' },
          { value: 0.6040268456375839, label: '8', id: '2' },
          { value: 0.4697986577181208, label: '10', id: '3' },
          { value: 0.3355704697986577, label: '12', id: '4' },
          { value: 0.20134228187919467, label: '14', id: '5' },
          { value: 0.06711409395973156, label: '16', id: '6' },
        ],
        type: 'linear',
        startPos: [145, 30],
        endPos: [145, 450],
        titleText: 'unemployment',
        titlePosition: 'l',
        titleFontWeight: 'bold',
        titleSpacing: 10,
        titleTextBaseline: 'middle',
        titleTransformOrigin: 'center',
        titleTransform: 'rotate(-90)',
        labelAlign: 'horizontal',
        labelSpacing: 4,
        labelDirection: 'positive',
        tickDirection: 'positive',
        lineOpacity: 1,
      },
    })
  );

  // let angle = 0;
  // interval(() => {
  //   axis.style.titleTransform = `rotate(-${angle})`;
  //   angle += 5;
  // }, 200);

  return group;
};
