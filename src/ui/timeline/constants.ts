import { RectStyleProps } from '@antv/g';
import { MixAttrs } from 'types';

export const CELL_STYLE: MixAttrs<Partial<RectStyleProps>> = {
  default: {
    height: 16,
    fill: 'rgba(0, 0, 0, 0.05)',
  },
  selected: {
    height: 16,
    fill: '#5B8FF9',
  },
};

export const BACKGROUND_STYLE = {
  height: 20,
  fill: 'rgba(65, 97, 128, 0.05)',
};
