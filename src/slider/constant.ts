/**
 * 一些默认的样式配置
 */

export const ACTIVE_TREND_STYLE = {
  isArea: true,
  lineStyle: {
    stroke: '#569CFF',
    lineWidth: 0.5,
  },
  areaStyle: {
    fill: '#3382F1',
    opacity: 0.07,
  },
};

export const DEFAULT_TREND_STYLE = {
  isArea: true,
  lineStyle: {
    stroke: '#B8C2D1',
    lineWidth: 0.5,
  },
  areaStyle: {
    fill: '#D8DFEA',
    opacity: 0.24,
  },
};

export const BACKGROUND_STYLE = {
  fill: '#416180',
  opacity: 0.05,
};

export const FOREGROUND_STYLE = {
  fill: '#3485F8',
  opacity: 0.06,
  stroke: '#4E83CD',
  strokeOpacity: 0.3,
  lineWidth: 0.8,
};

export const SLIDER_BAR_LINE_GAP = 4;
export const SLIDER_BAR_HEIGHT = 6;
export const BAR_STYLE = {
  fill: '#DEE6F2',
  height: SLIDER_BAR_HEIGHT,
  highLightFill: '#CBDEF8',
  stroke: '#FFF',
  lineWidth: 1.2,
  cursor: 'move',
};

export const DEFAULT_HANDLER_WIDTH = 6;
export const DEFAULT_HANDLER_HEIGHT = 12;

export const HANDLER_STYLE = {
  width: DEFAULT_HANDLER_WIDTH,
  height: DEFAULT_HANDLER_HEIGHT,
  fill: '#FFF',
  stroke: '#A6BDE1',
  radius: 2,
  opacity: 1,
  cursor: 'ew-resize',
  // 高亮的颜色
  highLightFill: '#3485F8',
  highLightStroke: '#3485F8',
};

export const TEXT_STYLE = {
  textBaseline: 'middle',
  fill: '#000',
  opacity: 0.45,
};

export const SLIDER_CHANGE = 'sliderchange';

export const MAX_TEXT_WIDTH = 60;
export const TEXT_PADDING = 2;
export const TEXT_SAFE_WIDTH = 4;
