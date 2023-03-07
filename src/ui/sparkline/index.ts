import { Band, Linear } from '@antv/scale';
import { clone, isArray, isFunction, isNumber } from '@antv/util';
import { GUI } from '../../core';
import { Group, Rect } from '../../shapes';
import { maybeAppend, subStyleProps } from '../../util';
import type { ColumnsStyleProps, ColumnStyleProps } from './columns';
import { Columns } from './columns';
import type { LinesStyleProps } from './lines';
import { Lines } from './lines';
import {
  dataToLines,
  linesToAreaPaths,
  linesToStackAreaPaths,
  linesToStackCurveAreaPaths,
  lineToCurvePath,
  lineToLinePath,
} from './path';
import type { Data, SparklineOptions, SparklineStyleProps } from './types';
import { getRange, getStackedData } from './utils';

export type { SparklineStyleProps, SparklineOptions };

export class Sparkline extends GUI<SparklineStyleProps> {
  public static tag = 'sparkline';

  // sparkline容器
  private container!: Rect;

  // Lines或者Columns
  private spark!: Lines | Columns;

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

  private get containerShape() {
    const { width, height } = this.attributes;
    return { width, height } as { width: number; height: number };
  }

  private get linesStyle(): LinesStyleProps {
    const { type, isStack, smooth } = this.attributes;
    if (type !== 'line') throw new Error('linesStyle can only be used in line type');
    const areaStyle = subStyleProps(this.attributes, 'area');
    const lineStyle = subStyleProps(this.attributes, 'line');
    const { width } = this.containerShape;
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

  private get columnsStyle(): ColumnsStyleProps {
    const columnStyle = subStyleProps(this.attributes, 'column');
    const { isStack, type } = this.attributes;
    if (type !== 'column') throw new Error('columnsStyle can only be used in column type');
    const { height } = this.containerShape;
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
    });
  }

  public render(attributes: Required<SparklineStyleProps>, container: Group) {
    this.container = maybeAppend(container, '.container', 'rect').attr('className', 'container').node();

    const { type } = attributes;
    const className = `spark${type}`;
    const style: any = type === 'line' ? this.linesStyle : this.columnsStyle;
    this.spark = maybeAppend(container, `.${className}`, () => {
      if (type === 'line') return new Lines({ className, style });
      return new Columns({ className, style });
    })
      .styles(style)
      .node() as any;
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
    const { type, range = [], isGroup, spacing } = this.attributes;
    const { width, height } = this.containerShape;
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
