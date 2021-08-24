import { deepMix } from '@antv/util';
import type { TickDatum } from './types';

export const AXIS_BASE_DEFAULT_OPTIONS = {
  style: {
    title: {
      content: '',
      style: {
        fill: 'black',
        fontSize: 20,
        fontWeight: 'bold',
      },
      position: 'start',
      offset: [0, 0],
      rotate: undefined,
    },
    axisLine: {
      style: {
        fill: 'black',
        stroke: 'black',
        lineWidth: 2,
      },
      arrow: {
        start: {
          symbol: 'axis-arrow',
          size: 0,
        },
        end: {
          symbol: 'axis-arrow',
          size: 0,
        },
      },
    },
    ticks: [],
    ticksThreshold: 400,
    tickLine: {
      length: 10,
      style: {
        default: {
          stroke: 'black',
          lineWidth: 2,
        },
      },
      offset: 0,
      appendTick: false,
    },
    label: {
      type: 'text',
      style: {
        default: {
          fill: 'black',
          textAlign: 'center',
          textBaseline: 'middle',
        },
      },
      alignTick: true,
      formatter: (tick: Required<TickDatum>) => tick?.text || String(tick?.value || ''),
      offset: [0, 0],
      overlapOrder: ['autoRotate', 'autoEllipsis', 'autoHide'],
      margin: [1, 1, 1, 1],
      autoRotate: true,
      rotateRange: [0, 90],
      rotateStep: 5,
      autoHide: true,
      autoHideTickLine: true,
      minLabel: 0,
      autoEllipsis: true,
      ellipsisStep: ' ',
      minLength: 10,
      maxLength: Infinity,
    },
    subTickLine: {
      length: 6,
      count: 9,
      style: {
        default: {
          stroke: 'black',
          lineWidth: 2,
        },
      },
      offset: 0,
    },
    verticalFactor: 1,
  },
};

export const LINEAR_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_OPTIONS, {
  style: {
    type: 'linear',
  },
});

export const ARC_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_OPTIONS, {
  style: {
    type: 'arc',
    startAngle: 0,
    endAngle: 360,
    center: [0, 0],
    label: {
      ...LINEAR_DEFAULT_OPTIONS.style.label,
      align: 'normal',
    },
  },
});

export const HELIX_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_OPTIONS, {
  style: {},
});

/**
 * 空箭头配置
 */
export const NULL_ARROW = {
  symbol: 'circle',
  size: 0,
};

/**
 * 空文本配置
 */
export const NULL_TEXT = {
  text: '',
  fillOpacity: 0,
  rotate: 0,
};

/**
 * 非关键节点规则
 */
export const COMMON_TIME_MAP = {
  year: [
    ['year', 'second'], // YYYY-MM-DD hh:mm:ss
    ['year', 'day'], // YYYY-MM-DD
    ['month', 'day'], // MM-DD
    ['month', 'month'], // MM
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
