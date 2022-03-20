import { isArray } from '@antv/util';
import { DisplayObject, Group, Path } from '@antv/g';
import type { Cursor, PathCommand } from '@antv/g';
import type { RailCfg as DefaultCfg } from './types';
import { toPrecision } from '../../util';
import { createTrapezoidRailPath, createRectRailPath, getValueOffset } from './utils';

export interface IRailCfg extends Required<DefaultCfg> {
  x: number;
  y: number;
  min: number;
  max: number;
  start: number;
  end: number;
  cursor: Cursor;
  color: string | string[];
  orient: 'horizontal' | 'vertical';
}

export class Rail extends DisplayObject<Required<IRailCfg>> {
  // 色板的path group
  private railPathGroup!: Group;

  // 背景的path group
  private backgroundPathGroup!: Group;

  private get gradientColor() {
    const { color } = this.attributes;
    if (isArray(color) && color.length > 0) {
      // 生成线型渐变
      const step = 1 / (color.length - 1);
      let gradientColor = 'l(0)';
      for (let i = 0; i < color.length; i += 1) {
        gradientColor += ` ${toPrecision(i * step, 2)}:${color[i]}`;
      }
      return gradientColor;
    }
    return color as string;
  }

  constructor({ style, ...rest }: Partial<DisplayObject<IRailCfg>>) {
    super({ type: 'rail', style, ...rest });
    this.init();
  }

  public init() {
    this.railPathGroup = new Group({
      name: 'railPathGroup',
      id: 'railPathGroup',
    });
    this.appendChild(this.railPathGroup);
    this.backgroundPathGroup = new Group({
      name: 'backgroundGroup',
      id: 'railBackgroundGroup',
    });
    this.appendChild(this.backgroundPathGroup);
    this.render();
  }

  public render() {
    this.clear();
    const { width, color, backgroundColor, orient, chunked } = this.attributes;
    const railPath = this.createRailPath();
    const railBackgroundPath = this.createBackgroundPath();

    // 绘制背景
    railBackgroundPath.forEach((path) => {
      this.backgroundPathGroup.appendChild(
        new Path({
          name: 'background',
          className: 'rail-path',
          style: { path, fill: backgroundColor },
        })
      );
    });

    railPath.forEach((path, idx) => {
      // chunked的情况下，只显示start到end范围内的梯形
      this.railPathGroup.appendChild(
        new Path({
          name: 'railPath',
          className: 'rail-path',
          style: { path, fill: chunked ? color![idx] : this.gradientColor },
        })
      );
    });
    this.railPathGroup.setOrigin(width / 2, width / 2);
    this.backgroundPathGroup.setOrigin(width / 2, width / 2);
    // 根据orient对railPath旋转
    if (orient === 'vertical') {
      this.railPathGroup.setEulerAngles(90);
      this.backgroundPathGroup.setEulerAngles(90);
    } else {
      this.railPathGroup.setEulerAngles(0);
      this.backgroundPathGroup.setEulerAngles(0);
    }
  }

  public update(cfg: Partial<IRailCfg>) {
    // deepMix railAttrs into this.attributes
    this.attr(cfg);
    this.render();
    this.updateSelection();
  }

  /**
   * 设置选区
   */
  public updateSelection() {
    // 更新背景
    const backgroundPaths = this.createBackgroundPath();
    this.backgroundPathGroup.children.forEach((shape, index) => {
      (shape as Path).attr({
        path: backgroundPaths[index],
      });
    });
  }

  public getRail() {
    return this.railPathGroup;
  }

  public getRailBackground() {
    return this.backgroundPathGroup;
  }

  public clear() {
    this.railPathGroup.removeChildren();
    this.backgroundPathGroup.removeChildren();
  }

  private getOrientVal<T>(val1: T, val2: T) {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? val1 : val2;
  }

  /**
   * 获取值对应的offset
   */
  private getValueOffset(value: number) {
    const { min, max, width, height } = this.attributes;
    return getValueOffset(value, min, max, this.getOrientVal(width, height));
  }

  /**
   * 生成rail path
   */
  private createRailPath() {
    const { width, height, type, chunked, min, max } = this.attributes;
    let railPath!: PathCommand[][];
    const [rectWidth, rectHeight] = this.getOrientVal([width, height], [height, width]);

    // 颜色映射
    if (chunked) {
      railPath = this.createChunkPath();
    } else {
      const startOffset = this.getValueOffset(min);
      const endOffset = this.getValueOffset(max);
      switch (type) {
        case 'color':
          railPath = [createRectRailPath(rectWidth, rectHeight, 0, 0, startOffset, endOffset)];
          break;
        case 'size':
          railPath = [createTrapezoidRailPath(rectWidth, rectHeight, 0, 0, startOffset, endOffset)];
          break;
        default:
          break;
      }
    }
    return railPath;
  }

  /**
   * 分块连续图例下的path
   */
  private createChunkPath(): PathCommand[][] {
    const { width, height, min, max, type, ticks: _t } = this.attributes;
    const range = max - min;
    const [len, thick] = this.getOrientVal([width, height], [height, width]);
    // 每块四个角的位置
    const blocksPoints = [];

    // 插入端值
    const ticks = [min, ..._t, max];
    // 块起始位置
    let prevPos = 0;
    let prevThick = type === 'size' ? 0 : thick;
    for (let index = 1; index < ticks.length; index += 1) {
      const ratio = (ticks[index] - ticks[index - 1]) / range;
      const currLen = len * ratio;
      // 根据type确定形状
      const currThick = type === 'size' ? thick * ratio + prevThick : thick;
      const currPos = prevPos + currLen;
      blocksPoints.push([
        [prevPos, thick],
        [prevPos, thick - prevThick],
        [currPos, thick - currThick],
        [currPos, thick],
      ]);
      prevPos = currPos;
      prevThick = currThick;
    }
    const paths: PathCommand[][] = [];
    blocksPoints.forEach((points) => {
      const path: PathCommand[] = [];
      points.forEach((point, index) => {
        path.push([index === 0 ? 'M' : 'L', ...point] as PathCommand);
      });
      path.push(['Z']);
      paths.push(path);
    });
    return paths;
  }

  /**
   * 场景背景掩膜
   */
  private createBackgroundPath() {
    const { width, height, min, max, start, end, type } = this.attributes;
    const [rectWidth, rectHeight] = this.getOrientVal([width, height], [height, width]);
    const startOffset = this.getValueOffset(start);
    const endOffset = this.getValueOffset(end);
    const minOffset = this.getValueOffset(min);
    const maxOffset = this.getValueOffset(max);
    const creator = type === 'size' ? createTrapezoidRailPath : createRectRailPath;

    return [
      creator(rectWidth, rectHeight, 0, 0, minOffset, startOffset),
      creator(rectWidth, rectHeight, 0, 0, endOffset, maxOffset),
    ];
  }
}
