import { Group, Line, LineStyleProps, Path, PathStyleProps, Text } from '@antv/g';
import { isNil, noop } from '@antv/util';
import { GUI } from '../../core/gui';
import { Selection, select, applyStyle, defined } from '../../util';
import { Marker, MarkerStyleProps } from '../marker';
import { AxisBaseStyleProps, AxisTextStyleProps, OverlapType, Point, TickDatum } from './types';
import { OverlapCallback, OverlapUtils } from './overlap';
import { assignNonempty } from './utils';

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

export abstract class AxisBase<T extends AxisBaseStyleProps = AxisBaseStyleProps> extends GUI<T> {
  public static tag = 'axisBase';

  protected axisGroup!: Group;

  protected selection!: Selection;

  protected optimizedTicks: TickDatum[] = [];

  private labels: Text[] = [];

  private tickLines: Line[] = [];

  public init() {
    if (!this.style.container) {
      throw new Error(`Group container is required`);
    }
    this.axisGroup = this.style.container;
    this.axisGroup.appendChild(this);
    this.selection = select(this);

    this.appendChild(new Group({ className: 'axis-line-group' }));
    this.appendChild(new Group({ className: 'axis-tick-group' }));
    this.appendChild(new Group({ className: 'axis-subtick-group' }));
    this.appendChild(new Group({ className: 'axis-label-group' }));
    this.update();
  }

  public update(cfg: Partial<AxisBaseStyleProps> = {}) {
    // @ts-ignore
    this.attr(cfg);
    this.drawAxisLine();
    // Trigger update data binding
    this.drawTicks();
    this.processOverlap();
    this.drawAxisTitle();
  }

  public clear() {}

  protected abstract get axisPosition(): string;

  protected abstract getAxisTitle(): AxisTextStyleProps | null;

  // Required.
  protected abstract getLinePath(): PathStyleProps;

  protected abstract getLineArrow(): (MarkerStyleProps & { id: string })[];

  protected abstract getTickLineItems(): (LineStyleProps & { id: string })[];

  protected abstract getSubTickLineItems(): (LineStyleProps & { id: string })[];

  protected abstract getLabelAttrs(): AxisTextStyleProps[];

  protected abstract getEndPoints(): Point[];

  private drawAxisTitle() {
    const axisTitleStyle = this.getAxisTitle();

    const animate = this.style.title?.animate;
    this.selection
      .selectAll('.axis-title')
      .data(axisTitleStyle ? [axisTitleStyle] : [], (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('className', 'axis-title')
            .each((shape, datum) => applyStyle(shape, datum)),
        (update) =>
          update.each((shape, datum) => {
            if (animate) {
              const origin = Object.keys(datum).reduce(
                (r, key) => ((r[key] = shape.style[key as any] as any), r),
                {} as any
              );
              const keyframes = [assignNonempty({}, origin), datum];
              shape.animate(keyframes, { easing: 'easeQuadInOut', duration: 150, fill: 'both' });
            } else {
              applyStyle(shape, datum);
            }
          }),
        (exit) => exit.remove()
      );
  }

  /** Include axis-arrow */
  private drawAxisLine() {
    const group = this.selection.select('.axis-line-group');

    const axisLineStyle = this.getLinePath();
    const animate = this.style.axisLine?.animate;
    group
      .selectAll('.axis-line')
      .data([axisLineStyle], () => 1)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('className', 'axis-line')
            .each<Path>((shape, datum) => {
              applyStyle(shape, datum);
              if (animate) {
                // [todo] Enable customize Enter animation later.
                const length = shape.getTotalLength();
                const keyframes = [{ lineDash: [0, length] }, { lineDash: [length, 0] }] as any[];
                shape.animate(keyframes, { duration: 250, fill: 'both' });
              }
            }),
        (update) =>
          update.each((shape, datum) => {
            if (animate) {
              const origin = Object.keys(datum).reduce(
                (r, key) => ((r[key] = shape.style[key as any] as any), r),
                {} as any
              );
              const keyframes = [assignNonempty({}, origin), datum];
              shape.animate(keyframes, { easing: 'easeQuadInOut', duration: 250, fill: 'both' });
            } else {
              applyStyle(shape, datum);
            }
          }),
        (exit) => exit.remove()
      );

    const axisArrowStyle = this.getLineArrow();
    group
      .selectAll('.axis-arrow$$')
      .data(axisArrowStyle, (d) => d?.id)
      .join(
        (enter) => enter.append(({ id, ...style }) => new Marker({ id, className: 'axis-arrow$$', style })),
        (update) => update.each((shape, datum) => shape.update(datum)),
        (exit) => exit.remove()
      );
  }

  /** Includes axis label, axis tickLine and axis subTickLine. */
  private drawTicks() {
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
    this.optimizedTicks = optimizedTicks;
    this.drawTickLines();
    this.drawLabels();
  }

  /** Includes axis tickLine and axis subTickLine  */
  private drawTickLines() {
    const tickLineItems = this.getTickLineItems();
    this.tickLines = this.selection
      .select('.axis-tick-group')
      .selectAll('.axis-tick')
      .data(tickLineItems, (d) => d.id)
      .join(
        (enter) => enter.append((datum) => new Line({ id: datum.id, style: datum })).attr('className', 'axis-tick'),
        (update) => update.each((shape, datum) => applyStyle(shape, datum)),
        (exit) => exit.remove()
      )
      .nodes() as Line[];

    const subTickLineItems = this.getSubTickLineItems();
    this.selection
      .select('.axis-subtick-group')
      .selectAll('.axis-subtick')
      .data(subTickLineItems, (d) => d.id)
      .join(
        (enter) => enter.append((datum) => new Line({ id: datum.id, style: datum })).attr('className', 'axis-subtick'),
        (update) => update.each((shape, datum) => applyStyle(shape, datum)),
        (exit) => exit.remove()
      );
  }

  private drawLabels() {
    const labels = this.getLabelAttrs();
    this.labels = this.selection
      .select('.axis-label-group')
      .selectAll('.axis-label')
      .data(labels, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append((datum) => new Text({ id: datum.id, style: datum }))
            .attr('className', 'axis-label')
            .each((shape, datum) => {
              defined(datum.rotation) && shape.setEulerAngles(datum.rotation);
              const { fillOpacity, strokeOpacity = 0, opacity = fillOpacity } = shape.style;
              const keyframes = [
                { fillOpacity: 0, strokeOpacity: 0, opacity: 0 },
                assignNonempty({}, { fillOpacity, strokeOpacity, opacity }),
              ];
              shape.animate(keyframes, { easing: 'easeQuadInOut', duration: 250, fill: 'both' });
            }),
        (update) =>
          update.each((shape, datum) => {
            applyStyle(shape, datum);
            defined(datum.rotation) && shape.setEulerAngles(datum.rotation);
          }),
        (exit) => exit.remove()
      )
      .nodes() as Text[];
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
    const {
      overlapOrder = [],
      optionalAngles,
      minLength,
      maxLength,
      ellipsisStep,
      showFirst,
      showLast,
      margin,
    } = labelCfg;
    let cfg = {
      labelType: labelCfg.type,
      optionalAngles,
      minLength,
      maxLength,
      ellipsisStep,
      showFirst,
      showLast,
      margin,
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
    this.labels.forEach((label, idx) => {
      const tickLine = this.tickLines[idx];
      if (!tickLine) return;
      if (label.style.visibility === 'hidden' && tickLine) tickLine.style.visibility = 'hidden';
      else tickLine.style.visibility = 'visible';
    });
  }
}
