import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationUpdate13 = () => {
  const group = new Group({
    style: {
      width: 200,
      height: 500,
    },
  });

  group.appendChild(
    new Group({
      style: {
        x: 100,
        y: 100,
      },
    })
  );

  const g2 = group.appendChild(
    new Group({
      style: {
        x: 50,
        y: 50,
      },
    })
  );

  const axis = g2.appendChild(
    new Axis({
      style: {
        titleFill: '#000',
        titleFillOpacity: 0.65,
        titleFontSize: 12,
        titleFontWeight: 'normal',
        titleSpacing: 10,
        lineStroke: '#000',
        lineStrokeOpacity: 0.45,
        lineLineWidth: 0.5,
        showArrow: false,
        tickStroke: '#000',
        tickStrokeOpacity: 0.25,
        tickLineWidth: 1,
        tickLength: 4,
        labelFill: '#000',
        labelFillOpacity: 0.65,
        labelFontSize: 12,
        labelFontWeight: 'lighter',
        labelSpacing: 4,
        labelAlign: 'horizontal',
        gridStroke: '#000',
        gridStrokeOpacity: 0.05,
        gridLineWidth: 0.5,
        gridLineDash: [0, 0],
        titleTransformOrigin: 'center',
        titleTextBaseline: 'middle',
        titlePosition: 'left',
        titleTransform: 'translate(50%, 0) rotate(-90)',
        labelDirection: 'positive',
        tickDirection: 'positive',
        gridDirection: 'negative',
        type: 'linear',
        data: [
          { value: 1, label: '2', id: '0' },
          { value: 0.9166666666666666, label: '2.2', id: '1' },
          { value: 0.8333333333333334, label: '2.4', id: '2' },
          { value: 0.75, label: '2.6', id: '3' },
          { value: 0.6666666666666667, label: '2.8', id: '4' },
          { value: 0.5833333333333334, label: '3', id: '5' },
          { value: 0.5, label: '3.2', id: '6' },
          { value: 0.41666666666666674, label: '3.4', id: '7' },
          { value: 0.33333333333333337, label: '3.6', id: '8' },
          { value: 0.2500000000000002, label: '3.8', id: '9' },
          { value: 0.16666666666666674, label: '4', id: '10' },
          { value: 0.08333333333333337, label: '4.2', id: '11' },
          { value: 0, label: '4.4', id: '12' },
        ],
        titleText: 'y',
        showLabel: true,
        labelOverlap: [],
        showGrid: true,
        showTick: true,
        gridLength: 725,
        animate: {
          duration: 1000,
        },
        showLine: true,
        lineOpacity: 0,
        startPos: [45, 40],
        endPos: [45, 435],
      },
    })
  );

  function update() {
    axis.update();
  }

  group.appendChild(
    new Button({
      style: {
        text: 'update',
        onClick: update,
      },
    })
  );

  if (process.env.NODE_ENV === 'test') {
    update();
  }

  return group;
};

AxisAnimationUpdate13.tags = ['坐标轴', '动画', '更新', '标题'];

AxisAnimationUpdate13.wait = 500;
