import { deepMix } from '@antv/util';
import { classNames } from '../../util';
import type { LegendBaseOptions } from './types';

export const LEGEND_BASE_DEFAULT_OPTIONS: Partial<LegendBaseOptions> = {
  style: {
    padding: 0,
    orient: 'horizontal',
    backgroundFill: 'transparent',
    titleText: '',
    showTitle: true,
    titleSpacing: 4,
    titlePosition: 'left-top',
    titleFill: '#2C3542',
    titleFontWeight: 'bold',
    titleFontFamily: 'sans-serif',
    titleFontSize: 12,
  },
};

export const CATEGORY_DEFAULT_OPTIONS = deepMix({}, LEGEND_BASE_DEFAULT_OPTIONS, {
  style: {
    type: 'category',
    items: [],
    maxCols: undefined,
    maxRows: undefined,
    spacing: [8, 2],
    itemBackground: {
      padding: 0,
      style: {
        fill: 'transparent',
        active: {
          cursor: 'pointer',
        },
      },
    },
    reverse: false, // 倒序放置图例
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
    slidable: true,
    showHandle: true,
    showLabel: true,
    showIndicator: true,
    labelSpacing: 5,
    indicatorLabelFill: 'white',
    indicatorLabelFontSize: 12,
    indicatorBackgroundFill: '#262626',
  },
});

// 连续图例步长比例
export const STEP_RATIO = 0.01;

// 分类图例name和value宽度比例
export const NAME_VALUE_RATIO = 0.5;

export const CLASS_NAMES = classNames(
  {
    title: 'title',
    titleGroup: 'title-group',
    items: 'items',
    itemsGroup: 'items-group',
    contentGroup: 'content-group',
    ribbonGroup: 'ribbon-group',
    ribbon: 'ribbon',
    handlesGroup: 'handles-group',
    startHandle: 'start-handle',
    endHandle: 'end-handle',
    labelGroup: 'label-group',
    label: 'label',
    indicator: 'indicator',
  },
  'legend'
);
