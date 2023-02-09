import { vec2 } from '@antv/matrix-util';
import { onAnimateFinished, type AnimationResult, type GenericAnimation } from '../../../animation';
import { percentTransform, renderExtDo, styleSeparator, transition, type Selection } from '../../../util';
import { parsePosition } from '../../title';
import type { TitleCfg } from '../../title/types';
import { CLASS_NAMES } from '../constant';
import type { AxisStyleProps } from '../types';

function getTitlePosition(
  mainGroup: Selection,
  titleGroup: Selection,
  cfg: AxisStyleProps
): {
  x: number;
  y: number;
} {
  const { titlePosition: position = 'lb', titleSpacing: spacing = 0 } = cfg;
  const pos = parsePosition(position as Required<TitleCfg>['position']);
  const { x: ax, y: ay } = mainGroup.node().getBBox();
  const [aHw, aHh] = mainGroup.node().getBounds().halfExtents;
  const [tHw, tHh] = titleGroup.node().getBounds().halfExtents;
  const [lcx, lcy] = [ax + aHw, ay + aHh];
  let [x, y] = [lcx, lcy];

  if (['start', 'end'].includes(position) && cfg.type === 'linear') {
    const { startPos, endPos } = cfg;
    // todo did not consider the truncate case
    const [from, to] = position === 'start' ? [startPos, endPos] : [endPos, startPos];
    const direction = vec2.normalize([0, 0], [-to[0] + from[0], -to[1] + from[1]]);
    const [dx, dy] = vec2.scale([0, 0], direction, spacing);
    return { x: from[0] + dx, y: from[1] + dy };
  }

  if (pos.includes('l')) x -= aHw + tHw + spacing;
  if (pos.includes('r')) x += aHw + tHw + spacing;
  if (pos.includes('t')) y -= aHh + tHh + spacing;
  if (pos.includes('b')) y += aHh + tHh + spacing;
  return { x, y };
}

function getTitleLayout(axis: Selection, titleGroup: Selection, cfg: AxisStyleProps) {
  const mainGroup = axis.select(CLASS_NAMES.mainGroup.class);
  return getTitlePosition(mainGroup, titleGroup, cfg);
}

function createTitleEl(container: Selection, cfg: AxisStyleProps) {
  const { title } = cfg;
  const titleEl = container.maybeAppendByClassName(CLASS_NAMES.title, () => renderExtDo(title!));
  return [container, titleEl];
}

export function adjustTitleLayout(
  axis: Selection,
  cfg: AxisStyleProps,
  style: any,
  options: GenericAnimation = false
) {}

function applyTitleStyle(
  title: Selection,
  group: Selection,
  axis: Selection,
  cfg: AxisStyleProps,
  style: any,
  animate: GenericAnimation = false
) {
  const [titleStyle, { transform = '', ...groupStyle }] = styleSeparator(style);
  title.styles(titleStyle);
  group.styles(groupStyle);
  const { x, y } = getTitleLayout(axis, group, cfg);
  const animation = transition(group.node(), { x, y }, animate);
  onAnimateFinished(animation, () => {
    group.node().setPosition(x, y);
    percentTransform(title, transform);
  });
}

export function renderTitle(
  container: Selection,
  axis: Selection,
  cfg: AxisStyleProps,
  style: any,
  animateResults: AnimationResult[]
) {
  if (!cfg.title) return;
  const [titleGroup, titleEl] = createTitleEl(container, cfg);
  const apply = (option?: GenericAnimation) => applyTitleStyle(titleEl, titleGroup, axis, cfg, style, option);
  const animateResult = animateResults.filter((a) => !!a)[0];
  if (animateResult) {
    animateResult.onframe = () => apply();
    // title animation is independent of axis animation
    Promise.all(animateResults.map((a) => a?.finished)).then(() => {
      apply({ duration: 50 });
    });
  } else apply();
}
