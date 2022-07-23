import type { Group } from '@antv/g';
import { deepMix } from '@antv/util';
import { BaseComponent } from '../../util/create';
import { normalPadding, maybeAppend, applyStyle } from '../../util';
import { Marker } from '../marker';
import type { TagStyleProps, TagOptions } from './types';

export type { TagStyleProps, TagOptions };

function adjust(container: Group, paddingLeft: number, paddingTop: number, align: string, baseline: string) {
  const bounds = container.getLocalBounds();

  let x = 0;
  let y = 0;
  if (align === 'start') x = paddingLeft;
  if (align === 'center') x = -bounds.halfExtents[0];
  if (align === 'end') x = -paddingLeft - bounds.halfExtents[0] * 2;
  if (baseline === 'top') y = paddingTop + bounds.halfExtents[1];
  if (baseline === 'middle') y = 0;
  if (baseline === 'bottom') y = paddingTop - bounds.halfExtents[1] * 2;

  container.setLocalPosition([x, y]);
}

function getTextPosition(markerShape: Marker, spacing?: number) {
  const bounds = markerShape.getLocalBounds();

  return {
    x: bounds.halfExtents[0] ? bounds.max[0] + (spacing || 0) : (markerShape.style.x as number),
    y: bounds.halfExtents[1] ? (bounds.min[1] + bounds.max[1]) / 2 : (markerShape.style.y as number),
  };
}

/**
 * 带文本、图标的 Tag 组件，支持 iconfont 组件
 *
 * 组成元素：Marker + Text + BackgroundRect
 */
export class Tag extends BaseComponent<Required<TagStyleProps>> {
  /**
   * 标签类型
   */
  public static tag = 'tag';

  public static defaultOptions = {
    type: Tag.tag,
    style: {
      padding: 4,
      spacing: 4,
    },
  };

  constructor(options: TagOptions) {
    super(deepMix({}, Tag.defaultOptions, options));
  }

  public render(attributes: TagStyleProps, container: Group) {
    const { padding, marker, text, textStyle, radius, backgroundStyle, spacing, align, verticalAlign } = attributes;
    const [pt, pr, pb, pl] = normalPadding(padding);

    const group = maybeAppend(container, '.tag-content', 'g').attr('className', 'tag-content').node();
    const markerShape = maybeAppend(group, '.tag-marker', () => new Marker({}))
      .attr('className', 'tag-marker')
      .call((selection) => (selection.node() as Marker).update(marker || { symbol: '', size: 0 }))
      .node() as Marker;

    const { x, y } = getTextPosition(markerShape, spacing);
    maybeAppend(group, '.tag-text', 'text')
      .attr('className', 'tag-text')
      .style('fontFamily', 'sans-serif')
      .style('fontSize', 12)
      .style('x', x)
      .style('y', y)
      .style('text', text || '')
      .call(applyStyle, textStyle)
      // 强制居中
      .style('textBaseline', 'middle');
    adjust(group, pl, pt, align || 'start', verticalAlign || 'top');

    const bounds = group.getLocalBounds();
    maybeAppend(container, '.tag-background', 'rect')
      .attr('className', 'tag-background')
      .style('zIndex', (group.style.zIndex || 0) - 1)
      .style('x', bounds.min[0] - pl)
      .style('y', bounds.min[1] - pt)
      .style('width', backgroundStyle !== null ? pl + pr + bounds.halfExtents[0] * 2 : 0)
      .style('height', backgroundStyle !== null ? pt + pb + bounds.halfExtents[1] * 2 : 0)
      .style('radius', radius ?? 2)
      .style('fill', '#fafafa')
      .style('stroke', '#d9d9d9')
      .style('lineWidth', 1)
      .call(applyStyle, backgroundStyle);
  }
}
