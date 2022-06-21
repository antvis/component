import { Group, Line, LineStyleProps, PathStyleProps, Text, DisplayObjectConfig } from '@antv/g';
import { deepMix, isNil, noop, pick } from '@antv/util';
import { GUI } from '../../core/gui';
import { select, select2update, maybeAppend, applyStyle } from '../../util';
import { Marker, MarkerStyleProps } from '../marker';
import { AxisBaseStyleProps, AxisTextStyleProps, OverlapType, Point, TickDatum } from './types';
import { OverlapCallback, OverlapUtils } from './overlap';

export abstract class AxisBase<T extends AxisBaseStyleProps = AxisBaseStyleProps> extends GUI<T> {
  public static tag = 'axisBase';

  protected axisGroup!: Group;

  protected optimizedTicks: TickDatum[] = [];

  private labels: Text[] = [];

  constructor(options: DisplayObjectConfig<T>) {
    super(options);
  }

  connectedCallback() {
    this.update();
    this.bindEvents();
  }

  public update(cfg: Partial<AxisBaseStyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));

    this.render();
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

  protected abstract bindEvents(): void;

  private render() {
    const axisLineGroup = maybeAppend(
      this,
      '.axis-line-group',
      () => new Group({ className: 'axis-line-group' })
    ).node();
    maybeAppend(axisLineGroup, '.axis-line', 'path')
      .attr('className', 'axis-line')
      .call(applyStyle, this.getLinePath());

    select(axisLineGroup)
      .selectAll('.axis-arrow$$')
      .remove()
      .data(this.getLineArrow(), (d) => d.id)
      .join((enter) =>
        enter
          .append(() => new Marker({}))
          .attr('className', 'axis-arrow$$')
          .each(function (datum) {
            this.update(datum);
          })
      );

    this.optimizedTicks = this.calcOptimizedTicks();
    this.drawTickLines();
    this.drawLabels();
    this.processOverlap();
    this.drawTitle();
  }

  private calcOptimizedTicks() {
    const { ticksThreshold, appendTick } = this.style;
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
    if (appendTick && optimizedTicks[optimizedTicks.length - 1].value !== 1) {
      optimizedTicks.push({ value: 1, id: 'append' });
    }
    return optimizedTicks;
  }

  /** Includes axis tickLine and axis subTickLine  */
  private drawTickLines() {
    const tickLineItems = this.getTickLineItems();
    const group = maybeAppend(this, '.axis-tick-group', () => new Group({ className: 'axis-tick-group' })).node();
    select2update(group, 'axis-tick', Line, tickLineItems) as Line[];

    const subGroup = maybeAppend(
      this,
      '.axis-subtick-group',
      () => new Group({ className: 'axis-subtick-group' })
    ).node();
    const subTickLineItems = this.getSubTickLineItems();
    select2update(subGroup, 'axis-subtick', Line, subTickLineItems) as Line[];
  }

  private drawLabels() {
    const labels = this.getLabelAttrs();
    const group = maybeAppend(this, '.axis-label-group', () => new Group({ className: 'axis-label-group' })).node();
    this.labels = select2update(group, 'axis-label', Text, labels) as Text[];
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

    const tickLines = this.querySelectorAll('.axis-tick');
    this.labels.forEach((label, idx) => {
      const tickLine = tickLines[idx];
      if (tickLine) tickLine.style.visibility = label.style.visibility;
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
