import { deepMix } from '@antv/util';
import { leftArrow, rightArrow, upArrow, downArrow } from './utils';

export const LEGEND_BASE_DEFAULT_OPTIONS = {
  style: {
    x: 0,
    y: 0,
    padding: 0,
    orient: 'horizontal',
    backgroundStyle: {
      default: {
        fill: 'white',
        lineWidth: 0,
      },
    },
    title: {
      content: '',
      spacing: 10,
      align: 'left',
      style: {
        fill: 'gray',
        fontWeight: 'bold',
        fontSize: 16,
        textBaseline: 'top',
      },
      formatter: (text: string) => text,
    },
  },
};

export const CATEGORY_DEFAULT_OPTIONS = deepMix({}, LEGEND_BASE_DEFAULT_OPTIONS, {
  style: {
    type: 'category',
    items: [],
    maxWidth: undefined,
    maxHeight: undefined,
    maxCols: undefined,
    maxRows: undefined,
    spacing: [10, 10],
    itemMarker: {
      marker: 'circle',
      size: 8,
      spacing: 10,
      style: {
        default: {
          fill: '#f8be4b',
          lineWidth: 0,
        },
        active: {
          fill: '#f3774a',
        },
        selected: {},
      },
    },
    itemName: {
      spacing: 0,
      style: {
        default: {
          fill: 'gray',
          fontSize: 16,
          fontWeight: 'normal',
          textBaseline: 'middle',
        },
        selected: {
          fill: 'white',
          fontWeight: 'bold',
        },
        active: {
          fill: 'white',
          fontWeight: 'bold',
        },
      },
      formatter: (name: string) => name,
    },
    itemValue: {
      spacing: 5,
      align: 'right',
      style: {
        default: {
          fill: 'gray',
          fontSize: 16,
          fontWeight: 'normal',
          textBaseline: 'middle',
        },
        selected: {
          fill: 'white',
          fontWeight: 'bold',
        },
        active: {
          fill: 'white',
          fontWeight: 'bold',
        },
      },
      formatter: (name: string) => name,
    },
    itemBackgroundStyle: {
      default: {
        fill: '#fdf6e3',
      },
      selected: {
        opacity: 1,
        fill: '#dea739',
      },
      active: {
        opacity: 1,
        fill: '#2c2c2c',
      },
    },
    reverse: false, // 倒序放置图例
    pageNavigator: {
      button: {
        marker: (type: 'prev' | 'next', orient: 'horizontal' | 'vertical') => {
          if (orient === 'horizontal') {
            if (type === 'prev') {
              return leftArrow;
            }
            return rightArrow;
          }
          // vertical
          if (type === 'prev') {
            return upArrow;
          }
          return downArrow;
        },
        size: 12,
        style: {
          default: {},
          active: {},
          disabled: {},
        },
      },
    },
  },
});

export const CONTINUOUS_DEFAULT_OPTIONS = deepMix({}, LEGEND_BASE_DEFAULT_OPTIONS, {
  style: {
    type: 'continuous',
    color: [
      '#d0e3fa',
      '#acc7f6',
      '#8daaf2',
      '#6d8eea',
      '#4d73cd',
      '#325bb1',
      '#5a3e75',
      '#8c3c79',
      '#e23455',
      '#e7655b',
    ],
    padding: 10,
    label: {
      style: {
        fill: 'black',
        textAlign: 'center',
        textBaseline: 'middle',
      },
      spacing: 10,
      formatter: (value: number) => String(value),
      align: 'rail',
    },
    rail: {
      width: 100,
      height: 50,
      type: 'color',
      chunked: false,
      ticks: [],
      isGradient: 'auto',
      backgroundColor: '#c5c5c5',
    },
    // 不可滑动时隐藏手柄
    slidable: true,
    handle: {
      size: 25,
      spacing: 10,
      icon: {
        marker: 'default',
        style: {
          stroke: '#c5c5c5',
          fill: '#fff',
          lineWidth: 1,
        },
      },
      text: {
        align: 'outside',
        style: {
          fill: '#63656e',
          fontSize: 12,
          textAlign: 'center',
          textBaseline: 'middle',
        },
        formatter: (value: number) => value,
      },
    },
    indicator: {
      size: 8,
      spacing: 5,
      padding: 5,
      backgroundStyle: {
        fill: '#262626',
        radius: 5,
      },
      text: {
        style: {
          fill: 'white',
          fontSize: 12,
        },
        formatter: (value: number) => String(value),
      },
    },
  },
});

// 连续图例步长比例
export const STEP_RATIO = 0.01;

// 分类图例name和value宽度比例
export const NAME_VALUE_RATIO = 1.2 / 1;
