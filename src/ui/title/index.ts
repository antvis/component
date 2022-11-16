import type { DisplayObjectConfig, Group } from '@antv/g';
import { DisplayObject } from '@antv/g';
import { GUI } from '../../core/gui';
import { applyStyle, classNames, deepAssign, normalPadding, select, Selection, styleSeparator } from '../../util';
import type { TitleStyleProps } from './types';

export type { TitleStyleProps };

const DEFAULT_TITLE_CFG: Partial<TitleStyleProps> = {
  text: '',
  width: 0,
  height: 0,
  fill: '#4a505a',
  fontWeight: 'bold',
  fontSize: 12,
  fontFamily: 'sans-serif',
  inset: 0,
  spacing: 0,
  position: 'left-top',
};

const CLASS_NAMES = classNames(
  {
    text: 'text',
  },
  'title'
);

/**
 * @example
 * lt -> lt
 * left-top -> lt
 * inner -> i
 */
function positionNormalizer(position: Required<TitleStyleProps>['position']): string {
  if (!/\S+-\S+/g.test(position)) return position.length > 2 ? position[0] : position;
  return position
    .split('-')
    .map((str) => {
      return str[0];
    })
    .join('');
}

function mayApplyStyle(el: Selection, style: any) {
  for (const [key, value] of Object.entries(style)) {
    const currAttr = el.node().attr(key);
    if (!currAttr) el.style(key, value);
  }
}

function getTitleLayout(cfg: TitleStyleProps) {
  const { width, height, position } = cfg as Required<TitleStyleProps>;
  const [hW, hH] = [+width / 2, +height / 2];
  let [x, y, textAlign, textBaseline] = [+hW, +hH, 'center', 'middle'];
  const pos = positionNormalizer(position);

  if (pos.includes('l')) [x, textAlign] = [0, 'start'];
  if (pos.includes('r')) [x, textAlign] = [+width, 'end'];
  if (pos.includes('t')) [y, textBaseline] = [0, 'top'];
  if (pos.includes('b')) [y, textBaseline] = [+height, 'bottom'];

  return { x, y, textAlign, textBaseline };
}

export class Title extends GUI<TitleStyleProps> {
  constructor(options: DisplayObjectConfig<TitleStyleProps> = {}) {
    super(deepAssign({}, { style: DEFAULT_TITLE_CFG }, options));
  }

  public getAvailableSpace() {
    const container = this;
    const { width, height: H, position, spacing, inset } = this.attributes as Required<TitleStyleProps>;
    const title = container.querySelector<DisplayObject>(CLASS_NAMES.text.class);
    if (!title) return { x: 0, y: 0, width, height: H };

    const { height: h } = title.getBBox();
    const [st, , sb] = normalPadding(spacing);

    let [y, height] = [0, +H - h];
    const pos = positionNormalizer(position);
    if (pos === 'i') return { x: 0, y, width, height: H };

    if (pos.includes('t')) [y, height] = [h + st, +H - h - st];
    if (pos.includes('b')) [height] = [+H - h - sb];

    const [iT, iR, iB, iL] = normalPadding(inset);
    const [iW, iH] = [iL + iR, iT + iB];
    return { x: iL, y: y + iT, width: +width - iW, height: height - iH };
  }

  public render(attributes: TitleStyleProps, container: Group) {
    const {
      width,
      height,
      position,
      spacing,
      class: className, // remove class attr
      ...restStyle
    } = attributes as Required<TitleStyleProps>;
    const [titleStyle, groupStyle] = styleSeparator(restStyle);
    const { x, y, textAlign, textBaseline } = getTitleLayout(attributes);
    if (!restStyle.text) {
      container.removeChildren();
      return;
    }

    select(container)
      .maybeAppendByClassName(CLASS_NAMES.text, 'text')
      .call(applyStyle, titleStyle)
      .call(mayApplyStyle, { x, y, textAlign, textBaseline });
  }
}
