import type { DisplayObjectConfig, Group, Text } from '@antv/g';
import { DisplayObject } from '@antv/g';
import { GUI } from '../../core/gui';
import { BBox, classNames, deepAssign, ifShow, normalSeriesAttr, select, Selection, styleSeparator } from '../../util';
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
  position: 'top-left',
};

const CLASS_NAMES = classNames(
  {
    text: 'text',
  },
  'title'
);

/**
 * @example
 * lt -> ['l', 't']
 * left-top -> ['l', 't']
 * inner -> i
 */
export function parsePosition(position: Required<TitleStyleProps>['position']): string[] {
  if (!/\S+-\S+/g.test(position)) return position.length > 2 ? [position[0]] : position.split('');
  return position.split('-').map((str) => {
    return str[0];
  });
}

/**
 * calculate the actual bbox of the element with title
 * @example a legend with width x, height y, but the real bbox is x1 < x, y1 < y
 */
export function getBBox(title: Title, content: DisplayObject): DOMRect {
  const { position, spacing, inset } = title.attributes as Required<TitleStyleProps>;
  const titleBBox = title.getBBox();
  const contentBBox = content.getBBox();
  const pos = parsePosition(position);
  const [spacingTop, spacingRight, spacingBottom, spacingLeft] = normalSeriesAttr(title.attributes.text ? spacing : 0);
  const [insetTop, insetRight, insetBottom, insetLeft] = normalSeriesAttr(inset);
  const [spacingWidth, spacingHeight] = [spacingLeft + spacingRight, spacingTop + spacingBottom];
  const [insetWidth, insetHeight] = [insetLeft + insetRight, insetTop + insetBottom];

  // 只基于第一个 pos 进行判断
  // 如果在左边或者上边，直接包围盒相加再加上间距
  if (pos[0] === 'l') {
    return new BBox(
      titleBBox.x,
      titleBBox.y,
      contentBBox.width + titleBBox.width + spacingWidth + insetWidth,
      Math.max(contentBBox.height + insetHeight, titleBBox.height)
    );
  }
  if (pos[0] === 't') {
    return new BBox(
      titleBBox.x,
      titleBBox.y,
      Math.max(contentBBox.width + insetWidth, titleBBox.width),
      contentBBox.height + titleBBox.height + spacingHeight + insetHeight
    );
  }
  // 如果在右边或者下边，基于 content.width, content.height 相加再加上间距

  const [contentWidth, contentHeight] = [
    content.attributes.width || contentBBox.width,
    content.attributes.height || contentBBox.height,
  ];
  return new BBox(
    contentBBox.x,
    contentBBox.y,
    contentWidth + titleBBox.width + spacingWidth + insetWidth,
    contentHeight + titleBBox.height + spacingHeight + insetHeight
  );
}

function mayApplyStyle(el: Selection, style: any) {
  const finalStyle = Object.entries(style).reduce((acc, [key, value]) => {
    const currAttr = el.node().attr(key);
    if (!currAttr) acc[key] = value;
    return acc;
  }, {} as Record<string, any>);

  el.styles(finalStyle);
}

function getTitleLayout(cfg: TitleStyleProps) {
  const { width, height, position } = cfg as Required<TitleStyleProps>;
  const [hW, hH] = [+width / 2, +height / 2];
  let [x, y, textAlign, textBaseline] = [+hW, +hH, 'center', 'middle'];
  const pos = parsePosition(position);

  if (pos.includes('l')) [x, textAlign] = [0, 'start'];
  if (pos.includes('r')) [x, textAlign] = [+width, 'end'];
  if (pos.includes('t')) [y, textBaseline] = [0, 'top'];
  if (pos.includes('b')) [y, textBaseline] = [+height, 'bottom'];

  return { x, y, textAlign, textBaseline };
}

export class Title extends GUI<TitleStyleProps> {
  private title!: Text;

  constructor(options: DisplayObjectConfig<TitleStyleProps> = {}) {
    super(deepAssign({}, { style: DEFAULT_TITLE_CFG }, options));
  }

  public getAvailableSpace(): DOMRect {
    const container = this;
    const {
      width: containerWidth,
      height: containerHeight,
      position,
      spacing,
      inset,
    } = this.attributes as Required<TitleStyleProps>;
    const title = container.querySelector<DisplayObject>(CLASS_NAMES.text.class);
    if (!title) return new BBox(0, 0, +containerWidth, +containerHeight);
    const { width: titleWidth, height: titleHeight } = title.getBBox();
    const [spacingTop, spacingRight, spacingBottom, spacingLeft] = normalSeriesAttr(spacing);

    let [x, y, width, height] = [0, 0, +containerWidth, +containerHeight];
    const pos = parsePosition(position);

    if (pos.includes('i')) return new BBox(x, y, width, height);

    pos.forEach((p, i) => {
      if (p === 't')
        [y, height] =
          i === 0
            ? [titleHeight + spacingBottom, +containerHeight - titleHeight - spacingBottom]
            : [0, +containerHeight];
      if (p === 'r') [width] = [+containerWidth - titleWidth - spacingLeft];
      if (p === 'b') [height] = [+containerHeight - titleHeight - spacingTop];
      if (p === 'l')
        [x, width] =
          i === 0 ? [titleWidth + spacingRight, +containerWidth - titleWidth - spacingRight] : [0, +containerWidth];
    });

    const [insetTop, insetRight, insetBottom, insetLeft] = normalSeriesAttr(inset);
    const [insetWidth, insetHeight] = [insetLeft + insetRight, insetTop + insetBottom];
    return new BBox(x + insetLeft, y + insetTop, width - insetWidth, height - insetHeight);
  }

  public getBBox(): DOMRect {
    if (this.title) return this.title.getBBox();
    return new BBox(0, 0, 0, 0);
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
    const [titleStyle] = styleSeparator(restStyle);
    const { x, y, textAlign, textBaseline } = getTitleLayout(attributes);

    ifShow(!!restStyle.text, container, (group) => {
      this.title = select(group)
        .maybeAppendByClassName(CLASS_NAMES.text, 'text')
        .styles(titleStyle)
        .call(mayApplyStyle, { x, y, textAlign, textBaseline })
        .node();
    });
  }
}
