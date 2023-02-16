import { Group, Rect } from '@antv/g';
import { clone, deepMix, isNumber, isArray, isFunction } from '@antv/util';
import { Linear, Band } from '@antv/scale';
import { GUI, type RequiredStyleProps } from '../../core';
import { maybeAppend, subStyleProps } from '../../util';
import { Lines } from './lines';
import { Columns } from './columns';
import { getRange, getStackedData } from './utils';
import type { ILinesCfg } from './lines';
import type { ColumnStyleProps, ColumnsStyleProps } from './columns';
import type { Data, SparklineStyleProps, SparklineOptions } from './types';
import {
  dataToLines,
  lineToLinePath,
  lineToCurvePath,
  linesToAreaPaths,
  linesToStackAreaPaths,
  linesToStackCurveAreaPaths,
} from './path';

export type { SparklineStyleProps, SparklineOptions };

export class Sparkline extends GUI<RequiredStyleProps<SparklineStyleProps>> {
  public static tag = 'sparkline';

  // sparkline容器
  private containerShape!: Rect;

  // Lines或者Columns
  private sparkShape!: Lines | Columns;

  /**
   * 将data统一格式化为数组形式
   * 如果堆叠，则生成堆叠数据
   */
  private get rawData(): Data {
    const { data: rawData } = this.attributes;
    if (!rawData || rawData?.length === 0) return [[]];
    const data = clone(rawData);
    // number[] -> number[][]
    return isNumber(data[0]) ? [data] : data;
  }

  private get data(): Data {
    if (this.attributes.style?.isStack) return getStackedData(this.rawData);
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
    const {
      style: { width, height },
    } = this.attributes;
    return { width, height } as { width: number; height: number };
  }

  private get linesCfg(): ILinesCfg {
    const {
      style: { type, isStack, smooth },
    } = this.attributes;
    if (type !== 'line') throw new Error('linesCfg can only be used in line type');
    const { style: areaStyle } = subStyleProps(this.attributes, 'area');
    const { style: lineStyle } = subStyleProps(this.attributes, 'line');
    const { width } = this.containerCfg;
    const { data } = this;
    if (data[0].length === 0) return { lines: [], areas: [] };
    const { x, y } = this.scales as { x: Linear; y: Linear };
    // 线条Path
    const lines = dataToLines(data, { type: 'line', x, y });

    // 生成区域path
    let areas: any[] = [];
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
      }) as any,
      areas: areas.map((path, idx) => {
        return {
          path,
          fill: this.getColor(idx),
          ...areaStyle,
        };
      }),
    };
  }

  private get columnsCfg(): ColumnsStyleProps {
    const { style: columnStyle } = subStyleProps(this.attributes, 'column');
    const {
      style: { isStack, type },
    } = this.attributes;
    if (type !== 'column') throw new Error('columnsCfg can only be used in column type');
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
          } as ColumnStyleProps;
        });
      }),
    };
  }

  constructor(options: SparklineOptions) {
    super(options, {
      style: {
        type: 'line',
        width: 200,
        height: 20,
        isStack: false,
        color: ['#83daad', '#edbf45', '#d2cef9', '#e290b3', '#6f63f4'],
        smooth: true,
        lineLineWidth: 1,
        areaOpacity: 0,
        isGroup: false,
        columnLineWidth: 1,
        columnStroke: '#fff',
      },
    });
  }

  public render(attributes: RequiredStyleProps<SparklineStyleProps>, container: Group) {
    this.containerShape = maybeAppend(container, '.container', 'rect').attr('className', 'container').node();

    const {
      style: { type },
    } = attributes;
    const className = `spark${type}`;
    const cfg: any = type === 'line' ? this.linesCfg : this.columnsCfg;
    this.sparkShape = maybeAppend(container, `.${className}`, () => {
      if (type === 'line') return new Lines({ className, style: cfg });
      return new Columns({ className, style: cfg });
    })
      .styles(cfg)
      .node() as any;
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.removeChild(this.sparkShape);
    this.sparkShape.clear();
    this.sparkShape.destroy();
  }

  /**
   * 根据数据索引获取color
   */
  private getColor(index: number) {
    const {
      style: { color },
    } = this.attributes;
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
    const {
      style: { type, range = [], isGroup, spacing },
    } = this.attributes;
    const { width, height } = this.containerCfg;
    const [minVal, maxVal] = getRange(data);

    const yScale = new Linear({
      domain: [range[0] ?? minVal, range[1] ?? maxVal],
      range: [height, 0],
    });

    if (type === 'line') {
      return {
        type,
        x: new Linear({
          domain: [0, data[0].length - 1],
          range: [0, width],
        }),
        y: yScale,
      };
    }

    return {
      type,
      x: new Band({
        domain: data[0].map((val, idx) => idx),
        range: [0, width],
        paddingInner: isGroup ? spacing : 0,
      }),
      y: yScale,
    };
  }
}
