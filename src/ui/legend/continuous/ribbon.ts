import { Group, parseColor, type GroupStyleProps, type PathStyleProps, type RectStyleProps } from '@antv/g';
import { isFunction } from '@antv/util';
import type { PrefixedStyle } from '../../../types';
import { classNames, createComponent, select, Selection, subObjects } from '../../../util';
import { ifHorizontal } from '../utils';
import { getBlockColor } from './utils';

export type Interpolate<T = string> = (val: number) => T;

export type RibbonStyle = PrefixedStyle<PathStyleProps, 'selection'> &
  PrefixedStyle<RectStyleProps, 'track'> & {
    size: number;
    len: number;
  };
export type RibbonCfg = {
  type?: 'size' | 'color';
  orient?: 'horizontal' | 'vertical';
  color: string[] | Interpolate;
  /** select area, 0~1 */
  range?: [number, number];
  block?: boolean;
  /** partition of the block ,the length of it is the block count */
  partition?: number[];
};

export type RibbonStyleProps = GroupStyleProps & RibbonStyle & RibbonCfg;

const CLASS_NAMES = classNames(
  {
    trackGroup: 'background-group',
    track: 'background',
    selectionGroup: 'ribbon-group',
    selection: 'ribbon',
    clipPath: 'clip-path',
  },
  'ribbon'
);

const DEFAULT_RIBBON_CFG: RibbonStyleProps = {
  type: 'color',
  orient: 'horizontal',
  size: 30,
  range: [0, 1],
  len: 200,
  block: false,
  partition: [],
  color: ['#fff', '#000'],
  trackFill: '#e5e5e5',
};

function getShape(cfg: RibbonStyleProps) {
  const { orient, size, len } = cfg;
  return ifHorizontal(orient, [len, size], [size, len]);
}

function getTrackPath(cfg: RibbonStyleProps) {
  const { type } = cfg;
  const [cw, ch] = getShape(cfg);

  if (type === 'size') {
    return [['M', 0, ch], ['L', 0 + cw, 0], ['L', 0 + cw, ch], ['Z']] as any[];
  }
  return [['M', 0, ch], ['L', 0, 0], ['L', 0 + cw, 0], ['L', 0 + cw, ch], ['Z']] as any[];
}

function getSelectionPath(cfg: RibbonStyleProps) {
  return getTrackPath(cfg);
}

function getColor(cfg: RibbonStyleProps) {
  const { orient, color, block, partition } = cfg as Required<RibbonStyleProps>;
  let colors: string[];
  if (isFunction(color)) {
    const len = 20;
    colors = new Array(len).fill(0).map((_, index, arr) => color(index / (arr.length - 1)));
  } else colors = color;

  const count = colors.length;

  if (!count) return '';
  if (count === 1) return colors[0];
  if (block) return getBlockColor(partition, colors, orient);
  return colors.reduce(
    (r, c, idx) => (r += ` ${idx / (count - 1)}:${parseColor(c)}`),
    `l(${ifHorizontal(orient, '0', '270')})`
  );
}

function getClipPath(cfg: RibbonStyleProps): any[] {
  const { orient, range } = cfg;
  if (!range) return [];
  const [width, height] = getShape(cfg);
  const [st, et] = range;
  const x = ifHorizontal(orient, st * width, 0);
  const y = ifHorizontal(orient, 0, st * height);
  const w = ifHorizontal(orient, et * width, width);
  const h = ifHorizontal(orient, height, et * height);
  return [['M', x, y], ['L', x, h], ['L', w, h], ['L', w, y], ['Z']];
}

function renderTrack(container: Selection, cfg: RibbonStyleProps, style: any) {
  container.maybeAppendByClassName(CLASS_NAMES.track, 'path').styles({ path: getTrackPath(cfg), ...style });
}

function renderSelection(container: Selection, cfg: RibbonStyleProps, style: any) {
  const fill = getColor(cfg);

  const ribbon = container
    .maybeAppendByClassName(CLASS_NAMES.selection, 'path')
    .styles({ path: getSelectionPath(cfg), fill, ...style });
  const clipPath = ribbon
    .maybeAppendByClassName(CLASS_NAMES.clipPath, 'path')
    .styles({ path: getClipPath(cfg) })
    .node();
  ribbon.style('clip-path', clipPath);
}

export const Ribbon = createComponent<RibbonStyleProps>(
  {
    render(attribute: RibbonStyleProps, container: Group) {
      const [selectionStyle, trackStyle] = subObjects(attribute, ['selection', 'track']);
      const trackGroup = select(container).maybeAppendByClassName(CLASS_NAMES.trackGroup, 'g');
      renderTrack(trackGroup, attribute, trackStyle);

      /**
       * - ribbon group
       *  |- ribbon
       * - clip path
       */
      const ribbonGroup = select(container).maybeAppendByClassName(CLASS_NAMES.selectionGroup, 'g');
      renderSelection(ribbonGroup, attribute, selectionStyle);
    },
  },
  {
    ...DEFAULT_RIBBON_CFG,
  }
);
