import { DisplayObject, type Group } from '@antv/g';
import { isFunction, memoize } from '@antv/util';
import {
  fadeOut,
  onAnimateFinished,
  transition,
  type GenericAnimation,
  type StandardAnimationOption,
} from '../../../animation';
import { RequiredStyleProps } from '../../../core';
import type { Vector2 } from '../../../types';
import { getCallbackValue, select, Selection, styleSeparator, subStyleProps } from '../../../util';
import { CLASS_NAMES } from '../constant';
import type { AxisDatum, AxisStyleProps, AxisTickStyleProps } from '../types';
import { getDirectionVector, getValuePos } from './line';
import { filterExec, getCallbackStyle } from './utils';

export function getTickVector(value: number, attr: RequiredStyleProps<AxisStyleProps>): Vector2 {
  return getDirectionVector(value, attr.style.tickDirection, attr);
}

export const getTickPoints = memoize(
  (unitVector: Vector2, tickLength: number) => {
    const [dx, dy] = unitVector;
    return [
      [0, 0],
      [dx * tickLength, dy * tickLength],
    ];
  },
  (unitVector, tickLength) => [...unitVector, tickLength].join()
);

function getTickLineLayout(
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  tickVector: Vector2,
  attr: RequiredStyleProps<AxisStyleProps>
) {
  const { tickLength } = attr.style;
  const [[x1, y1], [x2, y2]] = getTickPoints(tickVector, getCallbackValue(tickLength, [datum, index, data]));
  return { x1, x2, y1, y2 };
}

function createTickEl(
  container: Selection,
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  attr: RequiredStyleProps<AxisStyleProps>
) {
  const { tickFormatter: formatter } = attr;
  const tickVector = getTickVector(datum.value, attr);
  let el: any = 'line';
  if (formatter instanceof DisplayObject) el = () => formatter;
  else if (isFunction(formatter)) el = () => getCallbackValue(formatter, [datum, index, data, tickVector]);
  return container.append(el).attr('className', CLASS_NAMES.tickItem.name);
}

function applyTickStyle(
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  tick: Selection,
  group: Group,
  attr: RequiredStyleProps<AxisStyleProps>,
  style: RequiredStyleProps<AxisTickStyleProps>
) {
  const tickVector = getTickVector(datum.value, attr);
  const { x1, x2, y1, y2 } = getTickLineLayout(datum, index, data, tickVector, attr);
  const [tickStyle, groupStyle] = styleSeparator(getCallbackStyle(style.style, [datum, index, data]));
  tick.node().nodeName === 'line' && tick.styles({ x1, x2, y1, y2, ...tickStyle });
  group.attr(groupStyle);
  tick.styles(tickStyle);
}

function createTick(
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  attr: RequiredStyleProps<AxisStyleProps>,
  tickAttr: RequiredStyleProps<AxisTickStyleProps>,
  animate: GenericAnimation
) {
  const tick = createTickEl(select(this), datum, index, data, attr);
  applyTickStyle(datum, index, data, tick, this, attr, tickAttr);
  const [x, y] = getValuePos(datum.value, attr);
  return transition(this, { x, y }, animate);
}

export function renderTicks(
  container: Selection,
  axisData: AxisDatum[],
  attr: RequiredStyleProps<AxisStyleProps>,
  animate: StandardAnimationOption
) {
  const finalData = filterExec(axisData, attr.tickFilter);
  const tickAttr = subStyleProps<RequiredStyleProps<AxisTickStyleProps>>(attr, 'tick');
  return container
    .selectAll(CLASS_NAMES.tick.class)
    .data(finalData, (d) => d.id || d.label)
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('className', CLASS_NAMES.tick.name)
          .transition(function (datum: AxisDatum, index: number) {
            return createTick.call(this, datum, index, finalData, attr, tickAttr, false);
          }),
      (update) =>
        update.transition(function (datum: AxisDatum, index: number) {
          this.removeChildren();
          return createTick.call(this, datum, index, finalData, attr, tickAttr, animate.update);
        }),
      (exit) =>
        exit.transition(function () {
          const animation = fadeOut(this, animate.exit);
          onAnimateFinished(animation, () => this.remove());
          return animation;
        })
    )
    .transitions();
}
