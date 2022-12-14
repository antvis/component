import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';

export const BugAxisLabelRotate = () => {
  const group = new Group({});

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        titleTransformOrigin: 'center',
        labelAlign: 'horizontal',
        gridLength: 580,
        startPos: [320, 30],
        endPos: [320, 198],
        titlePosition: 'top',
        titleSpacing: 0,
        titleTextBaseline: 'bottom',
        labelDirection: 'positive',
        labelTransform: '',
        tickDirection: 'positive',
        labelSpacing: 4,
        gridDirection: 'negative',
        gridConnect: 'arc',
        gridType: 'surround',
        gridCenter: [320, 240],
        gridControlAngles: [90, 180, 360],
        data: [
          {
            value: 1,
            label: '0',
            id: '0',
          },
          {
            value: 0.9333333333333333,
            label: '2',
            id: '1',
          },
          {
            value: 0.8666666666666667,
            label: '4',
            id: '2',
          },
          {
            value: 0.8,
            label: '6',
            id: '3',
          },
          {
            value: 0.7333333333333334,
            label: '8',
            id: '4',
          },
          {
            value: 0.6666666666666667,
            label: '10',
            id: '5',
          },
          {
            value: 0.6,
            label: '12',
            id: '6',
          },
          {
            value: 0.5333333333333333,
            label: '14',
            id: '7',
          },
          {
            value: 0.4666666666666667,
            label: '16',
            id: '8',
          },
          {
            value: 0.4,
            label: '18',
            id: '9',
          },
          {
            value: 0.33333333333333337,
            label: '20',
            id: '10',
          },
          {
            value: 0.2666666666666667,
            label: '22',
            id: '11',
          },
          {
            value: 0.19999999999999996,
            label: '24',
            id: '12',
          },
          {
            value: 0.1333333333333333,
            label: '26',
            id: '13',
          },
          {
            value: 0.06666666666666665,
            label: '28',
            id: '14',
          },
          {
            value: 0,
            label: '30',
            id: '15',
          },
        ],
        title: 'y',
        showLabel: true,
        labelTransforms: [{ optionalAngles: [0, 30, 45, 60, 90], type: 'rotate' }],
        showGrid: true,
        showTick: true,
        showLine: true,
        lineOpacity: 0,
      },
    })
  );

  return group;
};
