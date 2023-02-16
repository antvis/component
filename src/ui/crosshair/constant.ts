import { deepAssign } from '../../util';
import type {
  CrosshairBaseStyleProps,
  LineCrosshairStyleProps,
  CircleCrosshairStyleProps,
  PolygonCrosshairStyleProps,
} from './types';
import type { PartialStyleProps } from '../../core';

export const CROSSHAIR_BASE_DEFAULT_STYLE: PartialStyleProps<CrosshairBaseStyleProps> = {
  style: {
    tagText: '',
    lineStroke: '#416180',
    lineStrokeOpacity: 0.45,
    lineLineWidth: 1,
    lineLineDash: [5, 5],
  },
};

export const LINE_CROSSHAIR_DEFAULT_STYLE: PartialStyleProps<LineCrosshairStyleProps> = deepAssign(
  {},
  CROSSHAIR_BASE_DEFAULT_STYLE,
  {
    style: {
      type: 'line',
      tagPosition: 'start',
      tagAlign: 'center',
      tagVerticalAlign: 'bottom',
    },
  }
);

export const CIRCLE_CROSSHAIR_DEFAULT_STYLE: PartialStyleProps<CircleCrosshairStyleProps> = deepAssign(
  {},
  CROSSHAIR_BASE_DEFAULT_STYLE,
  {
    style: {
      type: 'circle',
      defaultRadius: 0,
    },
  }
);

export const POLYGON_CROSSHAIR_DEFAULT_STYLE: PartialStyleProps<PolygonCrosshairStyleProps> = deepAssign(
  {},
  CROSSHAIR_BASE_DEFAULT_STYLE,
  {
    style: {
      type: 'polygon',
      defaultRadius: 0,
      startAngle: 0,
    },
  }
);
