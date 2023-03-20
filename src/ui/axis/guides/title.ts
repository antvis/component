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
    min: [mainX, mainY],
    halfExtents: [mainHalfWidth, mainHalfHeight],
  } = mainGroup.node().getLocalBounds();

  const [titleHalfWidth, titleHalfHeight] = titleGroup.node().getLocalBounds().halfExtents;

  let [x, y] = [mainX + mainHalfWidth, mainY + mainHalfHeight];

  const [spacingTop, spacingRight, spacingBottom, spacingLeft] = parseSeriesAttr(spacing);

  if (['start', 'end'].includes(position) && attr.type === 'linear') {
    const { startPos, endPos } = attr;
    // todo did not consider the truncate case
    const [from, to] = position === 'start' ? [startPos, endPos] : [endPos, startPos];
    const direction = normalize([-to[0] + from[0], -to[1] + from[1]]);
    const [dx, dy] = scale(direction, spacingTop);
    return { x: from[0] + dx, y: from[1] + dy };
  }

  if (pos.includes('t')) y -= mainHalfHeight + titleHalfHeight + spacingTop;
  if (pos.includes('r')) x += mainHalfWidth + titleHalfWidth + spacingRight;
  if (pos.includes('l')) x -= mainHalfWidth + titleHalfWidth + spacingLeft;
  if (pos.includes('b')) y += mainHalfHeight + titleHalfHeight + spacingBottom;

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
  // the transform of g has some limitation, so we need to apply the transform to the title twice
  percentTransform(title.node(), transform);

  const { x, y } = getTitlePosition(
    // @ts-ignore
    select(axis._offscreen || axis.querySelector(CLASS_NAMES.mainGroup.class)),
    group,
    attr
  );

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
