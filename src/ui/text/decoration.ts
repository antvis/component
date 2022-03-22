import type { PathCommand } from '@antv/g';
import { DisplayObject, Path } from '@antv/g';
import { isArray } from '@antv/util';
import { deepAssign } from '../../util';
import type { DecorationCfg, DecorationOptions, DecorationLine, DecorationShape } from './types';
import type { PathProps } from '../../types';

type StandDecorationCfgType = [DecorationLine, DecorationShape];

export class Decoration extends DisplayObject<Required<DecorationCfg>> {
  public static tag = 'decoration';

  private static defaultOptions = {
    style: {
      width: 0,
      height: 0,
      type: 'none',
      hangingRate: [0.5, 0.55, 0.5],
      // 线条默认颜色使用文字颜色
      style: {
        lineWidth: 1,
        stroke: '#000',
      },
    },
  };

  /**
   * 得到规范的修饰线类型
   */
  private get decorationType(): 'none' | StandDecorationCfgType[] {
    const { type } = this.attributes;
    if (!type || type === 'none' || !isArray(type)) return 'none';
    return type.map((t) => {
      if (isArray(t)) return t;
      return [t, 'solid'];
    });
  }

  /**
   * 双线间隔
   */
  private get doubleSpacing() {
    const {
      style: { lineWidth },
    } = this.attributes;
    return (lineWidth as number) * 2;
  }

  /** 上中下悬挂比例  */
  private get hangingRate() {
    const { hangingRate } = this.attributes;
    return hangingRate;
  }

  private get dashedCfg() {
    const {
      style: { lineWidth },
    } = this.attributes;
    return { lineDash: [(lineWidth as number)! * 2, lineWidth] } as { lineDash: [number, number] };
  }

  private get dottedCfg() {
    const {
      style: { lineWidth },
    } = this.attributes;
    return { lineDash: [lineWidth, lineWidth] } as { lineDash: [number, number] };
  }

  private get solidCfg() {
    return { lineDash: [0, 0] } as { lineDash: [number, number] };
  }

  private get decorationCfg() {
    const { style } = this.attributes;
    const standCfg = this.decorationType;
    if (standCfg === 'none') return [];
    return standCfg.map(([type, shape]) => {
      if (shape === 'wavy') return { path: this.getWavyPath(type), ...style };
      // 剩下的只可能是线了
      if (shape === 'double') return { path: this.getDoubleLinePath(type), ...style };
      const lineStyleMap = {
        solid: this.solidCfg,
        dashed: this.dashedCfg,
        dotted: this.dottedCfg,
      };
      return {
        path: this.getLinePath(type),
        ...style,
        ...lineStyleMap[shape],
      };
    }) as PathProps[];
  }

  constructor(options: DecorationOptions) {
    super(deepAssign({}, Decoration.defaultOptions, options));
    this.update({});
  }

  public update(cfg: Partial<DecorationCfg>) {
    this.attr(deepAssign({}, this.attributes, cfg));
    this.clear();
    this.decorationCfg.forEach((cfg) => {
      this.appendChild(new Path({ style: cfg }));
    });
  }

  public clear() {
    this.removeChildren(true);
  }

  /**
   * 根据位置计算线条起始坐标
   */
  private getLinePos(type: Omit<DecorationLine, 'none'>) {
    const {
      hangingRate: [top, middle, bottom],
    } = this;
    const { height, fontSize } = this.attributes;
    let [x, y]: [number, number] = [0, 0];
    if (type === 'overline') [x, y] = [0, height * top - fontSize / 2];
    else if (type === 'line-through') [x, y] = [0, height * middle];
    else [x, y] = [0, height * bottom + fontSize / 2];
    return [x, y];
  }

  /**
   * 根据位置创建直线路径
   */
  private getLinePath(type: Omit<DecorationLine, 'none'>): PathCommand[] {
    const { width } = this.attributes;
    const [x, y] = this.getLinePos(type);
    return [
      ['M', x, y],
      ['L', x + width, y],
    ];
  }

  /**
   * 根据位置创建双直线路径
   */
  private getDoubleLinePath(type: Omit<DecorationLine, 'none'>): PathCommand[] {
    const { doubleSpacing: spacing } = this;
    const { width } = this.attributes;
    const [x, y] = this.getLinePos(type);
    let [s1, s2] = [0, 0];
    if (type === 'line-through') [s1, s2] = [-0.5, 0.5];
    if (type === 'underline') [s1, s2] = [0, 1];
    else if (type === 'overline') [s1, s2] = [1, 0];
    return [
      ['M', x, y + spacing * s1],
      ['L', x + width, y + spacing * s1],
      ['M', x, y + spacing * s2],
      ['L', x + width, y + spacing * s2],
    ];
  }

  /**
   * 根据位置创建波浪线路径
   */
  private getWavyPath(type: Omit<DecorationLine, 'none'>): PathCommand[] {
    return [];
  }
}
