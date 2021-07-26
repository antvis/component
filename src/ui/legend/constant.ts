import { deepMix } from '@antv/util';
import { leftArrow, rightArrow, upArrow, downArrow } from './utils';

export const LEGEND_BASE_DEFAULT_OPTIONS = {
  attrs: {
    x: 0,
    y: 0,
    padding: 0,
    orient: 'horizontal',
    backgroundStyle: {
      default: {
        fill: '#dcdee2',
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
  attrs: {
    type: 'category',
    items: {
      items: [],
      itemCfg: {
        height: 16,
        width: 40,
        spacing: 10,
        marker: {
          symbol: 'circle',
          size: 16,
          style: {
            fill: '#f8be4b',
            lineWidth: 0,
            active: {
              fill: '#f3774a',
            },
          },
        },
        name: {
          spacing: 5,
          style: {
            stroke: 'gray',
            fontSize: 16,
            checked: {
              stroke: 'black',
              fontWeight: 'bold',
            },
          },
          formatter: (name: string) => name,
        },
        value: {
          spacing: 5,
          align: 'right',
          style: {
            stroke: 'gray',
            fontSize: 16,
            checked: {
              stroke: 'black',
              fontWeight: 'bold',
            },
          },
        },
        backgroundStyle: {
          fill: 'white',
          opacity: 0.5,
          active: {
            fill: '#2c2c2c',
          },
        },
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
  attrs: {
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
      size: 12,
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

// 步长比例
export const STEP_RATIO = 0.01;
