import { deepMix } from '@antv/util';
import type { DisplayObjectConfig } from '@antv/g';
import type { AxisBaseStyleProps } from './types';

export const AXIS_TITLE_OPTIONS = {
  content: '',
  rotate: undefined,
  maxLength: 260,
};

export const AXIS_BASE_DEFAULT_OPTIONS: DisplayObjectConfig<Omit<AxisBaseStyleProps, 'container'>> = {
  style: {
    title: AXIS_TITLE_OPTIONS,
    ticks: [],
    ticksThreshold: 100,
    // 刻度线 (分类轴和 y 轴建议隐藏)
    tickLine: {
      len: 6,
    },
    subTickLine: {
      len: 4,
      count: 0,
    },
    label: {
      type: 'text',
      alignTick: true,
      tickPadding: 2,
      margin: [0, 0, 0, 0],
      overlapOrder: ['autoRotate', 'autoEllipsis', 'autoHide'],
      autoRotate: false,
      autoEllipsis: false,
      autoHide: false,
      autoHideTickLine: true,
      showLast: true,
      showFirst: true,
      optionalAngles: [0, 45, 90],
      minLabel: 0,
      minLength: 14,
      maxLength: 160,
      ellipsisStep: ' ',
    },
    verticalFactor: 1,
  },
};

export const ARC_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_OPTIONS, {
  style: {
    type: 'arc',
  },
});

export const HELIX_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_OPTIONS, {
  style: {},
});

/**
 * 非关键节点规则
 */
export const COMMON_TIME_MAP = {
  year: [
    ['year', 'second'], // YYYY-MM-DD hh:mm:ss
    ['year', 'day'], // YYYY-MM-DD
    ['month', 'day'], // MM-DD
    // ['month', 'month'], // MM
    ['day', 'day'], // MM
  ],
  month: [
    ['month', 'day'], // MM-DD
    ['day', 'day'], // MM
  ],
  day: [
    ['month', 'day'], // MM-DD
    ['day', 'day'], // DD
  ],
  hour: [
    ['hour', 'second'], // hh:mm:ss
    ['hour', 'minute'], // hh:mm
    ['hour', 'hour'], // hh
  ],
  minute: [
    ['minute', 'second'], // mm:ss
    ['second', 'second'], // ss
  ],
  second: [['second', 'second']],
} as const;
