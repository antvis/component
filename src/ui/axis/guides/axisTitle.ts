import type { Selection } from '@/util';
import { applyStyle, renderExtDo, styleSeparator } from '@/util';
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
  const { titleAlign: align = 'start', titlePosition: position = 'bottom', titleSpacing: spacing = 0 } = cfg;
  const { x: ax, y: ay, width: aw, height: ah } = axis.node().getBBox();
  const { width: tw, height: th } = title.node().getBBox();
  const [aHw, aHh] = axis.node().getBounds().halfExtents;
  const [tHw] = title.node().getBounds().halfExtents;

  const positionScore = { left: -1, right: 1, top: -1, bottom: 1, inner: 0.5 };
  const alignScore = { start: -1, middle: 0, end: 1 };

  const [lcx, lcy] = [ax + aHw - tHw, ay + aHh];
  const [vw, vh] = [(tw + aw) / 2 + spacing, (th + ah) / 2 + spacing];
  const [dx, dy] = [(aw - tw) / 2, (ah - th) / 2];

  if (position === 'inner') return { x: lcx, y: lcy };
  if (position === 'bottom' || position === 'top')
    return {
      x: lcx + alignScore[align] * dx,
      y: lcy + positionScore[position] * vh,
    };
  return {
    x: lcx + positionScore[position] * vw,
    y: lcy + alignScore[align] * dy,
  };
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
  const [titleStyle, groupStyle] = styleSeparator(style);
  title.call(applyStyle, titleStyle);
  group.node().attr(groupStyle);
  group.node().attr(getTitleLayout(group, title, cfg));
}

export function renderTitle(container: Selection, cfg: AxisStyleProps, style: any) {
  if (!cfg.title) return;
  const [group, titleEl] = createTitleEl(container, cfg);
  applyTitleStyle(titleEl, group, cfg, style);
}
