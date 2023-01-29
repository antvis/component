import { DisplayObjectConfig, ElementEvent, Group } from '@antv/g';
import { GUI } from '../../core/gui';
import type { Point } from '../../types';
import {
  deepAssign,
  subObject,
  isHorizontal,
  normalSeriesAttr,
  renderExtDo,
  select,
  Selection,
  styleSeparator,
  TEXT_INHERITABLE_PROPS,
  classNames,
} from '../../util';
import { DEFAULT_INDICATOR_CFG } from './constant';
import type { IndicatorStyleProps, Position } from './types';

type Edge = [Point, Point];

type RT = Required<IndicatorStyleProps>;

const CLASS_NAMES = classNames(
  {
    background: 'background',
    labelGroup: 'label-group',
    label: 'label',
  },
  'indicator'
);
export class Indicator<T = any> extends GUI<IndicatorStyleProps<T>> {
  constructor(options: DisplayObjectConfig<IndicatorStyleProps<T>> = {}) {
    super(deepAssign({}, { style: { visibility: 'hidden', ...DEFAULT_INDICATOR_CFG } }, options));
    this.group = this.appendChild(new Group({}));
    this.isMutationObserved = true;
  }

  private group: Group;

  private background!: Selection;

  private label!: Selection;

  private point: Point = [0, 0];

  private renderBackground() {
    if (!this.label) return;
    const { position, padding } = this.style as RT;
    const [t, r, b, l] = normalSeriesAttr(padding);
    const { min, max } = this.label.node().getLocalBounds();

    const points: Edge = [
      [min[0] - l, min[1] - t],
      [max[0] + r, max[1] + b],
    ];
    const path = this.getPath(position, points);
    const backgroundStyle = subObject(this.attributes, 'background');
    this.background = select(this.group)
      .maybeAppendByClassName(CLASS_NAMES.background, 'path')
      .styles({ ...backgroundStyle, path });
    this.group.appendChild(this.label.node());
  }

  private renderLabel() {
    const { value, formatter } = this.attributes as RT;
    const labelStyle = subObject(this.attributes, 'label');
    const [textStyle, groupStyle] = styleSeparator(labelStyle);
    this.label = select(this.group).maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g').styles(groupStyle);
    if (!value) return;
    const text = this.label
      .maybeAppendByClassName(CLASS_NAMES.label, () => renderExtDo(formatter(value)))
      .style('text', formatter(value).toString());
    text.selectAll('text').styles({ ...TEXT_INHERITABLE_PROPS, ...textStyle });
  }

  private adjustLayout() {
    const [dx, dy] = this.point;
    this.group.attr('x', -dx).attr('y', -dy);
  }

  private getPath(position: Position, points: Edge) {
    const [[x0, y0], [x1, y1]] = points;
    // calc 4 edges
    const edges: { [key in Position]: Edge } = {
      top: [
        [x0, y0],
        [x1, y0],
      ],
      right: [
        [x1, y0],
        [x1, y1],
      ],
      bottom: [
        [x1, y1],
        [x0, y1],
      ],
      left: [
        [x0, y1],
        [x0, y0],
      ],
    };
    const positionRevert = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };
    const path = Object.entries(edges).map(([pos, e]) => {
      if (pos === positionRevert[position]) return this.createCorner(e);
      return [
        ['M', ...e[0]],
        ['L', ...e[1]],
      ];
    });
    path.push([['Z']]);

    return path.flat().filter((d, i, a) => {
      if (i === 0) return true;
      return d[0] !== 'M';
    });
  }

  private createCorner(edge: Edge, size: number = 10) {
    // intrinsic parameter
    const cornerScale = 0.8;
    const isH = isHorizontal(...edge);
    const [[x0, y0], [x1, y1]] = edge;
    const [len, [b0, b1]] = isH ? [x1 - x0, [x0, x1]] : [y1 - y0, [y0, y1]];
    const hL = len / 2;
    const sign = len / Math.abs(len);
    const cL = size * sign;
    const hCL = cL / 2;
    const cS = ((cL * Math.sqrt(3)) / 2) * cornerScale;
    const [a0, a1, a2, a3, a4] = [b0, b0 + hL - hCL, b0 + hL, b0 + hL + hCL, b1];

    if (isH) {
      this.point = [a2, y0 - cS];
      return [
        ['M', a0, y0],
        ['L', a1, y0],
        ['L', a2, y0 - cS],
        ['L', a3, y0],
        ['L', a4, y0],
      ];
    }
    this.point = [x0 + cS, a2];
    return [
      ['M', x0, a0],
      ['L', x0, a1],
      ['L', x0 + cS, a2],
      ['L', x0, a3],
      ['L', x0, a4],
    ];
  }

  public bindEvents() {
    this.label.on(ElementEvent.BOUNDS_CHANGED, this.renderBackground);
  }

  public render() {
    this.renderLabel();
    this.renderBackground();
    this.adjustLayout();
  }
}
