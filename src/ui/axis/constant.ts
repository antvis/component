import { Path, type DisplayObjectConfig } from '@antv/g';
import { deepMix } from '@antv/util';
import { classNames } from '../../util';
import type { AxisBaseStyleProps } from './types';

export const AXIS_BASE_DEFAULT_CFG: DisplayObjectConfig<Partial<AxisBaseStyleProps>> = {
  style: {
    data: [],
    animate: {
      duration: 100,
      easing: 'ease-in-out-sine',
      fill: 'both',
    },
    dataThreshold: 100,
    showTitle: true,
    titlePosition: 'lb',
    titleFill: 'black',
    titleFontSize: 12,
    titleTextAlign: 'center',
    titleSpacing: 0,
    titleTextBaseline: 'middle',
    showLine: true,
    lineLineWidth: 1,
    lineStroke: 'black',
    showArrow: true,
    lineArrow: new Path({
      style: {
        path: 'M 10,10 L -10,0 L 10,-10 L0,0 L10,10Z',
        anchor: '0.5 0.5',
        fill: 'black',
        transformOrigin: 'center',
      },
    }),
    lineArrowOffset: 15,
    lineArrowSize: 10,
    showTick: true,
    tickDirection: 'positive',
    tickStroke: 'black',
    tickLength: 5,
    tickLineWidth: 1,
    tickStrokeOpacity: 0.65,
    showLabel: true,
    labelSpacing: 0,
    labelDirection: 'positive',
    labelAlign: 'parallel',
    labelTransforms: [
      // { type: 'rotate', optionalAngles: [0, 45, 90] },
      // { type: 'ellipsis', suffix: '...', minLength: 14, maxLength: 160 },
      // { type: 'hide' },
    ],
    showGrid: true,
    gridType: 'segment',
    gridConnect: 'line',
    gridDirection: 'positive',
    gridLength: 0,
    gridControlAngles: [],
  },
};

export const ARC_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_CFG, {
  style: {
    type: 'arc',
  },
});

export const HELIX_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_CFG, {
  style: {},
});

export const CLASS_NAMES = classNames(
  {
    mainGroup: 'main-group',
    gridGroup: 'grid-group',
    grid: 'grid',
    lineGroup: 'line-group',
    line: 'line',
    tickGroup: 'tick-group',
    tick: 'tick',
    tickItem: 'tick-item',
    labelGroup: 'label-group',
    label: 'label',
    labelItem: 'label-item',
    titleGroup: 'title-group',
    title: 'title',
    lineFirst: 'line-first',
    lineSecond: 'line-second',
  },
  'axis'
);
