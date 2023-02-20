import { vec2 } from '@antv/matrix-util';
import { get } from '@antv/util';
import { onAnimateFinished, transition, type GenericAnimation, type StandardAnimationOption } from '../../../animation';
import type { GUI, RequiredStyleProps } from '../../../core';
import {
  parseSeriesAttr,
  percentTransform,
  renderExtDo,
  select,
  styleSeparator,
  subStyleProps,
  type Selection,
} from '../../../util';
import { parsePosition } from '../../title';
import { CLASS_NAMES } from '../constant';
import type { AxisStyleProps } from '../types';

function getTitlePosition(
  mainGroup: Selection,
  titleGroup: Selection,
  attr: RequiredStyleProps<AxisStyleProps>
): {
  x: number;
  y: number;
} {
  const { titlePosition: position = 'lb', titleSpacing: spacing } = attr.style;
  const pos = parsePosition(position);

  const {
    min: [ax, ay],
    halfExtents: [aHw, aHh],
  } = mainGroup.node().getLocalBounds();

  const [tHw, tHh] = titleGroup.node().getLocalBounds().halfExtents;

  const [lcx, lcy] = [ax + aHw, ay + aHh];
  let [x, y] = [lcx, lcy];

  const [spacingTop, spacingRight, spacingBottom, spacingLeft] = parseSeriesAttr(spacing);

  if (['start', 'end'].includes(position) && attr.style.type === 'linear') {
    const { startPos, endPos } = attr.style;
    // todo did not consider the truncate case
    const [from, to] = position === 'start' ? [startPos, endPos] : [endPos, startPos];
    const direction = vec2.normalize([0, 0], [-to[0] + from[0], -to[1] + from[1]]);
    const [dx, dy] = vec2.scale([0, 0], direction, spacingTop);
    return { x: from[0] + dx, y: from[1] + dy };
  }

  if (pos.includes('t')) y -= aHh + tHh + spacingTop;
  if (pos.includes('r')) x += aHw + tHw + spacingRight;
  if (pos.includes('l')) x -= aHw + tHw + spacingLeft;
  if (pos.includes('b')) y += aHh + tHh + spacingBottom;

  return { x, y };
}

function applyTitleStyle(
  title: Selection,
  group: Selection,
  axis: GUI<any>,
  attr: RequiredStyleProps<AxisStyleProps>,
  animate: GenericAnimation
) {
  const { style } = subStyleProps(attr, 'title');
  const [titleStyle, { transform = '', ...groupStyle }] = styleSeparator(style);

  title.styles(titleStyle);
  group.styles(groupStyle);

  const { x, y } = getTitlePosition(select(get(axis, 'offscreenGroup')), group, attr);
  const animation = transition(group.node(), { x, y }, animate);
  percentTransform(title.node(), transform);
  return animation;
}

export function renderTitle(
  container: Selection,
  axis: GUI<any>,
  attr: RequiredStyleProps<AxisStyleProps>,
  animate: StandardAnimationOption
) {
  if (!attr.style.titleText) return null;
  const { titleText } = attr.style;
  return container
    .selectAll(CLASS_NAMES.title.class)
    .data([{ title: titleText }], (d, i) => d.title)
    .join(
      (enter) =>
        enter
          .append(() => renderExtDo(titleText))
          .attr('className', CLASS_NAMES.title.name)
          .transition(function () {
            return applyTitleStyle(select(this), container, axis, attr, animate.enter);
          }),
      (update) =>
        update.transition(function () {
          return applyTitleStyle(select(this), container, axis, attr, animate.update);
        }),
      (exit) => exit.remove()
    )
    .transitions();
}
