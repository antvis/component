import type { Selection } from '../../../util';
import { applyStyle, renderExtDo, styleSeparator, percentTransform } from '../../../util';
import { positionNormalizer } from '../../title';
import { CLASS_NAMES } from '../constant';
import type { AxisStyleProps } from '../types';

function getTitlePosition(
  axis: Selection,
  title: Selection,
  cfg: AxisStyleProps
): {
  x: number;
  y: number;
} {
  const { titlePosition: position = 'lb', titleSpacing: spacing = 0 } = cfg;
  const pos = positionNormalizer(position);
  const { x: ax, y: ay, width: aw, height: ah } = axis.node().getBBox();
  const [aHw, aHh] = axis.node().getBounds().halfExtents;
  const [tHw, tHh] = title.node().getBounds().halfExtents;
  const [lcx, lcy] = [ax + aHw - tHw, ay + aHh];

  let [x, y] = [lcx, lcy];

  if (pos.includes('l')) x -= aHw + tHw + spacing;
  if (pos.includes('r')) x += aHw + tHw + spacing;
  if (pos.includes('t')) y -= aHh + tHh + spacing;
  if (pos.includes('b')) y += aHh + tHh + spacing;

  return { x, y };
}

function getTitleLayout(container: Selection, title: Selection, cfg: AxisStyleProps) {
  const axis = container.select(CLASS_NAMES.mainGroup.class);
  return getTitlePosition(axis, title, cfg);
}

function createTitleEl(container: Selection, cfg: AxisStyleProps) {
  const { title } = cfg;
  const group = container.maybeAppendByClassName(CLASS_NAMES.titleGroup, 'g').attr('anchor', '0 0');
  const titleEl = group.maybeAppendByClassName(CLASS_NAMES.title, () => renderExtDo(title!));
  return [group, titleEl];
}

function applyTitleStyle(title: Selection, group: Selection, cfg: AxisStyleProps, style: any) {
  const [titleStyle, { transform = '', ...groupStyle }] = styleSeparator(style);
  title.call(applyStyle, titleStyle);
  const { x, y } = getTitleLayout(group, title, cfg);
  group.node().attr(groupStyle);
  percentTransform(group, `translate(${x}, ${y}) ${transform}`);
}

export function renderTitle(container: Selection, cfg: AxisStyleProps, style: any) {
  if (!cfg.title) return;
  const [group, titleEl] = createTitleEl(container, cfg);
  applyTitleStyle(titleEl, group, cfg, style);
}
