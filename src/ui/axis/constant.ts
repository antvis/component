import { deepMix } from '@antv/util';
import type { AxisBaseOptions, TickDatum } from './types';

export const AXIS_BASE_DEFAULT_OPTIONS: AxisBaseOptions = {
  style: {
    title: {
      content: '',
      style: {
        fontSize: 12,
        fill: '#2C3542',
        fillOpacity: 0.45,
      },
      position: 'center',
      offset: [0, 0],
      rotate: undefined,
    },
    ticks: [],
    ticksThreshold: 400,
    // 轴线
    axisLine: {
      style: {
        fill: '#416180',
        stroke: '#416180',
        lineWidth: 0.5,
        strokeOpacity: 0.45,
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
    // 刻度线 (分类轴和 y 轴建议隐藏)
    tickLine: {
      len: 6,
      style: {
        default: {
          stroke: '#416180',
          strokeOpacity: 0.45,
          lineWidth: 0.5,
        },
      },
      offset: 0,
      appendTick: false,
    },
    subTickLine: {
      len: 4,
      count: 0,
      style: {
        default: {
          stroke: '#416180',
          strokeOpacity: 0.25,
          lineWidth: 0.5,
        },
      },
      offset: 0,
    },
    label: {
      type: 'text',
      style: {
        default: {
          fill: '#2C3542',
          fillOpacity: 0.65,
          fontSize: 12,
          textBaseline: 'middle',
        },
      },
      alignTick: true,
      formatter: (tick: TickDatum) => tick?.text || String(tick?.value || ''),
      offset: [0, 0],
      overlapOrder: ['autoRotate', 'autoEllipsis', 'autoHide'],
      margin: [0, 0, 0, 0],
      autoRotate: true,
      optionalAngles: [0, 30, 45, 60, 90],
      autoHide: true,
      autoHideTickLine: true,
      minLabel: 0,
      autoEllipsis: true,
      ellipsisStep: ' ',
      minLength: 10,
      maxLength: Infinity,
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
