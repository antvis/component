import { get } from '@antv/util';
import { transition, type GenericAnimation, type StandardAnimationOption } from '../../../animation';
import type { DisplayObject } from '../../../shapes';
import {
  normalize,
  parseSeriesAttr,
  percentTransform,
  renderExtDo,
  scale,
  select,
  splitStyle,
  subStyleProps,
  type Selection,
} from '../../../util';
import { parsePosition } from '../../title';
import { CLASS_NAMES } from '../constant';
import type { RequiredAxisStyleProps } from '../types';

function getTitlePosition(
  mainGroup: Selection,
  titleGroup: Selection,
  attr: RequiredAxisStyleProps
): {
  x: number;
  y: number;
} {
  const { titlePosition: position = 'lb', titleSpacing: spacing } = attr;
  const pos = parsePosition(position);

  const {
    min: [ax, ay],
    halfExtents: [aHw, aHh],
  } = mainGroup.node().getLocalBounds();

  const [tHw, tHh] = titleGroup.node().getLocalBounds().halfExtents;

  const [lcx, lcy] = [ax + aHw, ay + aHh];
  let [x, y] = [lcx, lcy];

  const [spacingTop, spacingRight, spacingBottom, spacingLeft] = parseSeriesAttr(spacing);

  if (['start', 'end'].includes(position) && attr.type === 'linear') {
    const { startPos, endPos } = attr;
    // todo did not consider the truncate case
    const [from, to] = position === 'start' ? [startPos, endPos] : [endPos, startPos];
    const direction = normalize([-to[0] + from[0], -to[1] + from[1]]);
    const [dx, dy] = scale(direction, spacingTop);
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
  axis: DisplayObject,
  attr: RequiredAxisStyleProps,
  animate: GenericAnimation
) {
  const style = subStyleProps(attr, 'title');
  const [titleStyle, { transform = '', ...groupStyle }] = splitStyle(style);

  title.styles(titleStyle);
  group.styles(groupStyle);

  const { x, y } = getTitlePosition(select(get(axis, 'offscreenGroup')), group, attr);
  const animation = transition(group.node(), { x, y }, animate);
  percentTransform(title.node(), transform);
  return animation;
}

export function renderTitle(
  container: Selection,
  axis: DisplayObject,
  attr: RequiredAxisStyleProps,
  animate: StandardAnimationOption
) {
  if (!attr.titleText) return null;
  const { titleText } = attr;
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
