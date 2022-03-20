import type { PathCommand } from '@antv/g';
import { Rect } from '@antv/g';
import { clone, deepMix, isNumber, isArray, isFunction } from '@antv/util';
import { Linear, Band } from '@antv/scale';
import { GUI } from '../../core/gui';
import { Lines } from './lines';
import { Columns } from './columns';
import { getRange, getStackedData } from './utils';
import type { ILinesCfg } from './lines';
import type { IColumnCfg, IColumnsCfg } from './columns';
import type { Data, SparklineCfg, SparklineOptions } from './types';
import {
  dataToLines,
  lineToLinePath,
  lineToCurvePath,
  linesToAreaPaths,
  linesToStackAreaPaths,
  linesToStackCurveAreaPaths,
} from './path';

export type { SparklineCfg, SparklineOptions };

export class Sparkline extends GUI<SparklineCfg> {
  public static tag = 'sparkline';

  private static defaultOptions = {
    style: {
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
        padding: 0.1,
      },
    },
  };

  // sparkline容器
  private containerShape!: Rect;

  // Lines或者Columns
  private sparkShape!: Lines | Columns;

  /**
   * 将data统一格式化为数组形式
   * 如果堆叠，则生成堆叠数据
   */
  private get rawData(): Data {
    const { data: _ } = this.attributes;
    if (!_ || _?.length === 0) return [[]];
    let data = clone(_);
    // number[] -> number[][]
    if (isNumber(data[0])) data = [data];
    return data;
  }

  private get data(): Data {
    if (this.attributes.isStack) return getStackedData(this.rawData);

    return this.rawData;
  }

  private get scales(): { x: Linear | Band; y: Linear } {
    return this.createScales(this.data);
  }

  /**
   * 基准线，默认为 0
   */
  private get baseline(): number {
    const { y } = this.scales;
    const [y1, y2] = y.getOptions().domain || [0, 0];
    if (y2 < 0) {
      return y.map(y2);
    }

    return y.map(y1 < 0 ? 0 : y1);
  }

  private get containerCfg() {
    const { width, height } = this.attributes;
    return { width, height } as { width: number; height: number };
  }

  private get linesCfg(): ILinesCfg {
    const { areaStyle, isStack, lineStyle, smooth } = this.attributes;
    const { width } = this.containerCfg;
    const { data } = this;
    if (data[0].length === 0) return { lines: [], areas: [] };
    const { x, y } = this.scales as { x: Linear; y: Linear };
    // 线条Path
    const lines = dataToLines(data, { type: 'line', x, y });

    // 生成区域path
    let areas: PathCommand[][] = [];
    if (areaStyle) {
      const { baseline } = this;
      if (isStack) {
        areas = smooth
          ? linesToStackCurveAreaPaths(lines, width, baseline)
          : linesToStackAreaPaths(lines, width, baseline);
      } else {
        areas = linesToAreaPaths(lines, smooth!, width, baseline);
      }
    }
    return {
      lines: lines.map((line, idx) => {
        return {
          stroke: this.getColor(idx),
          path: smooth ? lineToCurvePath(line) : lineToLinePath(line),
          ...lineStyle,
        };
      }),
      areas: areas.map((path, idx) => {
        return {
          path,
          fill: this.getColor(idx),
          ...areaStyle,
        };
      }),
    };
  }

  private get columnsCfg(): IColumnsCfg {
    const { isStack, columnStyle } = this.attributes;
    const { height } = this.containerCfg;
    let { rawData: data } = this;
    if (!data) return { columns: [] };
    if (isStack) data = getStackedData(data);
    const { x, y } = this.createScales(data) as { x: Band; y: Linear };
    const [minVal, maxVal] = getRange(data);
    const heightScale = new Linear({
      domain: [0, maxVal - (minVal > 0 ? 0 : minVal)],
      range: [0, height],
    });

    const bandWidth = x.getBandWidth();
    const { rawData } = this;
    return {
      columns: data.map((column, i) => {
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
          } as IColumnCfg;
        });
      }),
    };
  }

  constructor(options: SparklineOptions) {
    super(deepMix({}, Sparkline.defaultOptions, options));

    this.containerShape = new Rect({
      name: 'container',
      style: this.containerCfg,
    });
    this.appendChild(this.containerShape);
    this.init();
  }

  public init() {
    this.sparkShape = this.createSparkline();
    this.appendChild(this.sparkShape);
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<SparklineCfg>) {
    const { type: oldType } = this.attributes;
    this.attr(deepMix({}, this.attributes, cfg));
    const { type } = cfg;
    // 如果type变了，需要清空this.sparkShapes子元素
    if (type && type !== oldType) {
      this.clear();
      this.sparkShape = this.createSparkline();
      this.appendChild(this.sparkShape);
    }
    if (this.sparkShape instanceof Lines) this.sparkShape.update(this.linesCfg);
    else this.sparkShape.update(this.columnsCfg);
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.removeChild(this.sparkShape);
    this.sparkShape.clear();
    this.sparkShape.destroy();
  }

  private createSparkline() {
    const { type } = this.attributes;
    const baseCfg = { name: 'sparkline' };
    if (type === 'line')
      return new Lines({
        ...baseCfg,
        style: this.linesCfg,
      });
    // if (type === 'column')
    return new Columns({
      ...baseCfg,
      style: this.columnsCfg,
    });
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
    const { type, isGroup, barPadding, nice = true, minValue, maxValue } = this.attributes;
    const { width, height } = this.containerCfg;
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
        domain: [minValue ?? minVal, maxValue ?? maxVal],
        // 画布反转
        range: [height, 0],
        nice,
      }),
    };
  }
}
