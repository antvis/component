import { Group, Line, LineStyleProps, Path, PathStyleProps, Text, DisplayObjectConfig } from '@antv/g';
import { isNil, noop, pick } from '@antv/util';
import { GUI } from '../../core/gui';
import { Selection, select, timer, select2update } from '../../util';
import { Marker, MarkerStyleProps } from '../marker';
import { AxisBaseStyleProps, AxisTextStyleProps, OverlapType, Point, TickDatum } from './types';
import { OverlapCallback, OverlapUtils } from './overlap';

export abstract class AxisBase<T extends AxisBaseStyleProps = AxisBaseStyleProps> extends GUI<T> {
  public static tag = 'axisBase';

  protected axisLineGroup!: Group;

  protected axisLabelGroup!: Group;

  protected axisTickGroup!: Group;

  protected axisSubTickGroup!: Group;

  protected axisGroup!: Group;

  protected selection!: Selection;

  protected optimizedTicks: TickDatum[] = [];

  private labels: Text[] = [];

  constructor(options: DisplayObjectConfig<T>) {
    super(options);
    this.init();
  }

  public init() {
    this.selection = select(this);

    this.axisLineGroup = this.appendChild(new Group({ className: 'axis-line-group' }));
    this.axisTickGroup = this.appendChild(new Group({ className: 'axis-tick-group' }));
    this.axisSubTickGroup = this.appendChild(new Group({ className: 'axis-subtick-group' }));
    this.axisLabelGroup = this.appendChild(new Group({ className: 'axis-label-group' }));
  }

  connectedCallback() {
    this.update();
  }

  public update(cfg: Partial<AxisBaseStyleProps> = {}) {
    // @ts-ignore
    this.attr(cfg);
    select2update(this.axisLineGroup, 'axis-line', Path, [this.getLinePath()]);
    select2update(this.axisLineGroup, 'axis-arrow$$', Marker, this.getLineArrow());
    this.optimizedTicks = this.calcOptimizedTicks();
    this.drawTickLines();
    this.drawLabels();
    this.processOverlap();
    this.drawTitle();
  }

  public clear() {}

  protected abstract get axisPosition(): string;

  // Required.
  protected abstract drawTitle(): void;

  protected abstract getLinePath(): PathStyleProps & { animate?: boolean };

  protected abstract getLineArrow(): (MarkerStyleProps & { id: string })[];

  protected abstract getTickLineItems(): (LineStyleProps & { id: string })[];

  protected abstract getSubTickLineItems(): (LineStyleProps & { id: string })[];

  protected abstract getLabelAttrs(): AxisTextStyleProps[];

  protected abstract getEndPoints(): Point[];

  private calcOptimizedTicks() {
    const { ticksThreshold } = this.style;
    // Apply default id to ticks data.
    const ticks = Array.from(this.style.ticks || []).map((d, idx) => ({ id: `${idx}`, ...d }));
    const tickCount = ticks.length;
    let optimizedTicks = ticks;
    if (typeof ticksThreshold === 'number') {
      const len = ticks.length;
      if (len > ticksThreshold) {
        const page = Math.ceil(len / ticksThreshold);
        // 保留最后一条
        optimizedTicks = ticks.filter((tick, idx) => idx % page === 0 || idx === tickCount - 1);
      }
    }
    return optimizedTicks;
  }

  /** Includes axis tickLine and axis subTickLine  */
  private drawTickLines() {
    const tickLineItems = this.getTickLineItems();
    select2update(this.axisTickGroup, 'axis-tick', Line, tickLineItems) as Line[];

    const subTickLineItems = this.getSubTickLineItems();
    select2update(this.axisSubTickGroup, 'axis-subtick', Line, subTickLineItems) as Line[];
  }

  private drawLabels() {
    const labels = this.getLabelAttrs();
    this.labels = select2update(this.axisLabelGroup, 'axis-label', Text, labels) as Text[];
  }

  // 是否可以执行某一 overlap
  protected canProcessOverlap(type: OverlapType) {
    const labelCfg = this.style.label;
    if (!labelCfg) return false;

    // 对 autoRotate，如果配置了旋转角度，直接进行固定角度旋转
    if (type === 'autoRotate') {
      return isNil(labelCfg.rotate);
    }

    // 默认所有 overlap 都可执行
    return true;
  }

  protected processOverlap() {
    const { label: labelCfg } = this.style;
    if (!labelCfg) return;

    // Do labels layout.
    const { overlapOrder = [] } = labelCfg;
    let cfg = {
      labelType: labelCfg.type,
      ...pick(labelCfg, [
        'optionalAngles',
        'minLength',
        'maxLength',
        'ellipsisStep',
        'showFirst',
        'showLast',
        'margin',
      ]),
    };

    const labels = this.labels;
    overlapOrder.forEach((type) => {
      const util = OverlapUtils.get(type);
      const overlapCfg = labelCfg[type];
      if (util && overlapCfg && this.canProcessOverlap(type)) {
        let overlapFunc: OverlapCallback = util.getDefault();
        if (typeof overlapCfg === 'function') {
          overlapFunc = overlapCfg;
        } else if (typeof overlapCfg === 'object') {
          overlapFunc = util[overlapCfg.type] || noop;
          cfg = { ...cfg, ...overlapCfg.cfg };
        } else if (typeof overlapCfg === 'string') {
          overlapFunc = util[overlapCfg] || noop;
        }
        overlapFunc(this.axisPosition, labels as any[], cfg);
      }
    });

    this.autoHideTickLine();
  }

  protected autoHideTickLine() {
    if (!this.style.label?.autoHideTickLine) return;

    const tickLines = this.axisTickGroup.querySelectorAll('.axis-tick');
    this.labels.forEach((label, idx) => {
      const tickLine = tickLines[idx];
      if (!tickLine) return;
      if (label.style.visibility === 'hidden' && tickLine) tickLine.style.visibility = 'hidden';
      else tickLine.style.visibility = 'visible';
    });
  }
}

// 注册轴箭头
// ->
Marker.registerSymbol('axis-arrow', (x: number, y: number, r: number) => {
  return [
    ['M', x, y],
    ['L', x - r, y - r],
    ['L', x + r, y],
    ['L', x - r, y + r],
    ['L', x, y],
  ];
});
