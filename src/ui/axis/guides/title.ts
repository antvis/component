import type { GenericAnimation, StandardAnimationOption } from '../../../animation';
import { transition } from '../../../animation';
import type { DisplayObject } from '../../../shapes';
import type { Selection } from '../../../util';
import {
  normalize,
  parseSeriesAttr,
  percentTransform,
  renderExtDo,
  scale,
  select,
  splitStyle,
  subStyleProps,
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
  if (pos.includes('l')) x -= mainHalfWidth + titleHalfWidth * 2 + spacingLeft;
  if (pos.includes('b')) y += mainHalfHeight + titleHalfHeight * 2 + spacingBottom;

  return { x, y };
}

function inferTransform(n: DisplayObject, direction: string, position: string): string {
  const node = n.cloneNode(true);
  node.style.transform = 'scale(1, 1)';
  node.style.transform = 'none';
  const { height } = node.getBBox();
  if (direction === 'vertical') {
    if (position === 'left') return `rotate(-90) translate(0, ${height / 2})`;
    if (position === 'right') return `rotate(-90) translate(0, -${height / 2})`;
  }
  return '';
}

function applyTitleStyle(
  title: Selection,
  group: Selection,
  axis: DisplayObject,
  attr: RequiredAxisStyleProps,
  animate: GenericAnimation
) {
  const style = subStyleProps(attr, 'title');
  const [titleStyle, { transform: specified, ...groupStyle }] = splitStyle(style);

  title.styles(titleStyle);
  group.styles(groupStyle);

  const transform = specified || inferTransform(title.node(), titleStyle.direction, titleStyle.position);
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
  const { titleText } = attr;
  return container
    .selectAll(CLASS_NAMES.title.class)
    .data(
      [{ title: titleText }].filter((d) => !!d.title),
      (d, i) => d.title
    )
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
