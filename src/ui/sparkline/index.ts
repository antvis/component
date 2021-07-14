import { Rect } from '@antv/g';
import { clone, deepMix, isNumber, isArray, isFunction } from '@antv/util';
import { Linear, Band } from '@antv/scale';
import { PathCommand } from '@antv/g-base';
import { GUI } from '../core/gui';
import type { DisplayObject } from '../../types';
import { getRange, getStackedData } from './utils';
import { Data, SparklineAttrs, SparklineOptions } from './types';
import {
  dataToLines,
  lineToLinePath,
  lineToCurvePath,
  linesToAreaPaths,
  linesToStackAreaPaths,
  linesToStackCurveAreaPaths,
} from './path';
import { Lines } from './lines';
import { Columns } from './columns';

export { SparklineAttrs, SparklineOptions };

export class Sparkline extends GUI<SparklineAttrs> {
  public static tag = 'Sparkline';

  // sparkline容器
  private containerShape: DisplayObject;

  // Lines或者Columns
  private sparkShape: DisplayObject;

  private static defaultOptions = {
    attrs: {
      type: 'line',
      width: 200,
      height: 20,
      // data: [],
      isStack: false,
      color: ['#83daad', '#edbf45', '#d2cef9', '#e290b3', '#6f63f4'],
      smooth: true,
      lineStyle: {
        lineWidth: 1,
      },
      isGroup: false,
      columnStyle: {
        lineWidth: 1,
        stroke: '#fff',
      },
      barPadding: 0.1,
    },
  };

  constructor(options: SparklineOptions) {
    super(deepMix({}, Sparkline.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any) {
    // 如果type变了，需要清空this.sparkShapes子元素
    if (name === 'type') {
      this.sparkShape?.destroy();
    }
  }

  public init() {
    this.createContainer();
    this.createSparkline();
  }

  /**
   * 组件的更新
   */
  public update(cfg: SparklineAttrs) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.containerShape.removeChildren();
    this.createSparkline();
  }

  /**
   * 组件的清除
   */
  public clear() {
    throw new Error('Method not implemented.');
  }

  private createSparkline() {
    const { type } = this.attributes;
    switch (type) {
      case 'line':
        this.createLine();
        break;
      case 'column':
        this.createColumn();
        break;
      default:
        break;
    }
  }

  /**
   * 根据数据索引获取color
   */
  private getColor(index: number) {
    const { color } = this.attributes;
    if (isArray(color)) {
      return color[index % color.length];
    }
    if (isFunction(color)) {
      return color.call(null, index);
    }
    return color;
  }

  /**
   * 根据数据生成scale
   */
  private createScales(data: number[][]) {
    const { type, width, height, isGroup, barPadding } = this.attributes;
    const [minVal, maxVal] = getRange(data);
    return {
      type,
      x:
        type === 'line'
          ? new Linear({
              domain: [0, data[0].length - 1],
              range: [0, width],
            })
          : new Band({
              domain: data[0].map((val, idx) => idx),
              range: [0, width],
              paddingInner: isGroup ? barPadding : 0,
            }),
      y: new Linear({
        domain: [minVal >= 0 ? 0 : minVal, maxVal],
        range: [height, 0],
      }),
    };
  }

  /**
   * 将data统一格式化为数组形式
   * 如果堆叠，则生成堆叠数据
   */
  private getData(): Data {
    const { data: _ } = this.attributes;
    if (!_ || _?.length === 0) return undefined;
    let data = clone(_);
    // number[] -> number[][]
    if (isNumber(data[0])) {
      data = [data];
    }
    return data;
  }

  private getContainerAttrs() {
    const { width, height } = this.attributes;
    return { width, height };
  }

  private createContainer() {
    this.containerShape = new Rect({
      name: 'container',
      attrs: this.getContainerAttrs(),
    });
    this.appendChild(this.containerShape);
  }

  private getLinesAttrs() {
    const { areaStyle, isStack, lineStyle, smooth, width } = this.attributes;
    let data = this.getData();
    if (!data)
      return {
        linesCfg: {
          linesAttrs: [],
          areasAttrs: [],
        },
      };
    if (isStack) data = getStackedData(data);
    const { x, y } = this.createScales(data) as { x: Linear; y: Linear };
    // 线条Path
    const lines = dataToLines(data, { type: 'line', x, y });

    // 生成区域path
    let areas: PathCommand[][] = [];
    if (areaStyle) {
      const range = getRange(data);
      const baseline = y.map(range[0] < 0 ? 0 : range[0]);
      if (isStack) {
        areas = smooth
          ? linesToStackCurveAreaPaths(lines, width, baseline)
          : linesToStackAreaPaths(lines, width, baseline);
      } else {
        areas = linesToAreaPaths(lines, smooth, width, baseline);
      }
    }
    return {
      linesCfg: {
        linesAttrs: lines.map((line, idx) => {
          return {
            stroke: this.getColor(idx),
            path: smooth ? lineToCurvePath(line) : lineToLinePath(line),
            ...lineStyle,
          };
        }),
        areasAttrs: areas.map((path, idx) => {
          return {
            path,
            fill: this.getColor(idx),
            ...areaStyle,
          };
        }),
      },
    };
  }

  /**
   * 创建迷你折线图
   */
  private createLine() {
    this.sparkShape = new Lines({
      name: 'sparkline',
      attrs: this.getLinesAttrs(),
    });
    this.containerShape.appendChild(this.sparkShape);
  }

  private getColumnsAttrs() {
    const { isStack, height, columnStyle } = this.attributes;
    let data = this.getData();
    if (!data)
      return {
        columnsCfg: [],
      };
    if (isStack) data = getStackedData(data);
    const { x, y } = this.createScales(data) as {
      x: Band;
      y: Linear;
    };
    const [minVal, maxVal] = getRange(data);
    const heightScale = new Linear({
      domain: [0, maxVal - (minVal > 0 ? 0 : minVal)],
      range: [0, height],
    });
    const bandWidth = x.getBandWidth();
    const rawData = this.getData();

    return {
      columnsCfg: data.map((column, i) => {
        return column.map((val, j) => {
          const barWidth = bandWidth / data.length;
          return {
            fill: this.getColor(i),
            ...columnStyle,
            ...(isStack
              ? {
                  x: x.map(j),
                  y: y.map(val),
                  width: bandWidth,
                  height: heightScale.map(rawData[i][j]),
                }
              : {
                  x: x.map(j) + barWidth * i,
                  y: val >= 0 ? y.map(val) : y.map(0),
                  width: barWidth,
                  height: heightScale.map(Math.abs(val)),
                }),
          };
        });
      }),
    };
  }

  /**
   * 创建mini柱状图
   */
  private createColumn() {
    this.sparkShape = new Columns({
      name: 'sparkline',
      attrs: this.getColumnsAttrs(),
    });
    this.containerShape.appendChild(this.sparkShape);
  }
}
