import type { IndicatorStyleProps } from './types';

export const DEFAULT_INDICATOR_CFG: Partial<IndicatorStyleProps> = {
  formatter: (val) => val,
  padding: [2, 4],
  position: 'right',
  labelFill: '#fff',
  labelFontSize: 12,
  labelTextBaseline: 'middle',
  backgroundZIndex: -1,
  backgroundFill: '#262626',
  backgroundLineCap: 'round',
  backgroundLineWidth: 1,
  backgroundStroke: '#333',
};
