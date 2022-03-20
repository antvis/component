import { deepAssign } from '../../util';

export const CROSSHAIR_BASE_DEFAULT_STYLE = {
  text: {
    text: '',
  },
  lineStyle: {
    stroke: '#416180',
    strokeOpacity: 0.45,
    lineWidth: 1,
    lineDash: [5, 5],
  },
};

export const LINE_CROSSHAIR_DEFAULT_STYLE = deepAssign({}, CROSSHAIR_BASE_DEFAULT_STYLE, {
  type: 'line',
  text: {
    position: 'start',
  },
});

export const CIRCLE_CROSSHAIR_DEFAULT_STYLE = deepAssign({}, CROSSHAIR_BASE_DEFAULT_STYLE, {
  type: 'circle',
  defaultRadius: 0,
});

export const POLYGON_CROSSHAIR_DEFAULT_STYLE = deepAssign({}, CROSSHAIR_BASE_DEFAULT_STYLE, {
  type: 'polygon',
  defaultRadius: 0,
  startAngle: 0,
});
