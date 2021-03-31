/**
 * @file constant definition of legend
 */

import { Theme } from '../util';

/**
 * 分页器 默认配置
 */
export const DEFAULT_PAGE_NAVIGATOR = {
  marker: {
    style: {
      inactiveFill: '#000',
      inactiveOpacity: 0.45,
      fill: '#000',
      opacity: 1,
      size: 12,
    },
  },
  text: {
    style: {
      fill: '#ccc',
      fontSize: 12,
    },
  },
};

/**
 * 分类型图例的 默认配置
 */
export const CATEGORY_LEGEND_DEFAULT_CFG = {
  itemSpacing: 24,
  itemMarginBottom: 8,
  maxItemWidth: null,
  itemWidth: null,
  itemHeight: null,
  itemName: {},
  itemValue: null,
  maxWidth: null,
  maxHeight: null,
  marker: {},
  items: [],
  itemStates: {},
  itemBackground: {},
  pageNavigator: {},
  defaultCfg: {
    title: {
      spacing: 5,
      style: {
        fill: Theme.textColor,
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'top',
      },
    },
    background: {
      padding: 5,
      style: {
        stroke: Theme.lineColor,
      },
    },
    itemBackground: {
      style: {
        opacity: 0,
        fill: '#fff',
      },
    },
    pageNavigator: DEFAULT_PAGE_NAVIGATOR,
    marker: {
      spacing: 8,
      style: {
        r: 6,
        symbol: 'circle',
      },
    },
    itemName: {
      spacing: 16, // 如果右边有 value 使用这个间距
      style: {
        fill: Theme.textColor,
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'middle',
      },
    },
    itemValue: {
      alignRight: false, // 只有itemWidth 不为 null 时此属性有效
      formatter: null,
      style: {
        fill: Theme.textColor,
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'middle',
      },
    },
    // 状态样式
    itemStates: {
      active: {
        nameStyle: {
          opacity: 0.8,
        },
      },
      unchecked: {
        nameStyle: {
          fill: Theme.uncheckedColor,
        },
        markerStyle: {
          fill: Theme.uncheckedColor,
          stroke: Theme.uncheckedColor,
        },
      },
      inactive: {
        nameStyle: {
          fill: Theme.uncheckedColor,
        },
        markerStyle: {
          opacity: 0.2,
        },
      },
    },
  },
};
