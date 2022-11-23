import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';

export const BugAxisLabelPosition = () => {
  const group = new Group({});

  const axis = group.appendChild(
    new Axis({
      style: {
        titleFill: '#595959',
        titleFillOpacity: 1,
        titleFontSize: 12,
        titleFontWeight: 'bold',
        titleSpacing: 10,
        lineStroke: '#BFBFBF',
        lineStrokeOpacity: 0.45,
        tickStroke: '#BFBFBF',
        tickLineWidth: 1,
        labelFill: '#8C8C8C',
        labelFillOpacity: 1,
        labelFontSize: 12,
        labelFontWeight: 'lighter',
        labelSpacing: 0,
        gridStroke: '#1b1e23',
        gridStrokeOpacity: 0.05,
        gridLineWidth: 0.5,
        gridLineDash: [0, 0],
        type: 'linear',
        startPos: [400, 60],
        endPos: [400, 252],
        data: [
          { value: 0.6311778916087645, label: '5M', id: '0' },
          { value: 0.478406772210075, label: '10M', id: '1' },
          { value: 0.3611813693117044, label: '15M', id: '2' },
          { value: 0.26235578321752884, label: '20M', id: '3' },
          { value: 0.17528869403240166, label: '25M', id: '4' },
          { value: 0.09657402858400288, label: '30M', id: '5' },
          { value: 0.024188423174281937, label: '35M', id: '6' },
        ],
        showLabel: true,
        labelAlign: 'horizontal',
        showLine: true,
        showGrid: true,
        gridLength: 740,
        gridDirection: 'negative',
        gridConnect: 'arc',
        gridType: 'surround',
        gridCenter: [400, 400],
        gridControlAngles: [90, 180, 360],
        showTick: false,
        labelTransform: 'translate(50%, 0)',
        title: 'Population',
        titleTextBaseline: 'bottom',
        titlePosition: 't',
        lineOpacity: 1,
      },
    })
  );

  return group;
};
