import type { Group } from '@antv/g';
import type { Vector2 } from '../../types';
import { distance, select } from '../../util';
import { createComponent } from '../../util/create';
import { applyStyle } from '../axis/guides/utils';
import type { GridStyleProps } from './types';

export type { GridStyleProps };

function getCirclePath(points: Vector2[], center?: Vector2, closed?: boolean, reversed?: boolean): string {
  if (!center) return '';
  const radius = distance(points[0], center);
  const sweepFlag = reversed ? 0 : 1; // 顺时针还是逆时针
  if (closed) {
    return `M${center[0]},${center[1] - radius} A${radius},${radius},0,0,${sweepFlag},${center[0]},${
      center[1] + radius
    } A${radius},${radius},0,0,${sweepFlag},${center[0]},${center[1] - radius} Z`;
  }

  return points.reduce((r, p, idx) => {
    if (idx === 0) return `M${p[0]},${p[1]}`;
    return `${r}A${radius},${radius},0,0,${sweepFlag},${p[0]},${p[1]}`;
  }, '');
}

function getLinePath(
  points: Vector2[],
  type?: 'line' | 'circle',
  center?: Vector2,
  closed?: boolean,
  reversed?: boolean
) {
  if (type === 'circle') return getCirclePath(points, center, closed, reversed);

  const path = points.reduce((r, p, idx) => `${r}${idx === 0 ? 'M' : ' L'}${p[0]},${p[1]}`, '');
  return `${path}${closed ? 'Z' : ''}`;
}

function renderGridLine(container: Group, items: any[], cfg?: any) {
  select(container)
    .selectAll('.grid-line')
    .data(items, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('className', 'grid-line')
          .style('stroke', '#D9D9D9')
          .style('lineWidth', 1)
          .style('lineDash', [4, 4])
          .each(function (style, idx) {
            this.attr(style);
            applyStyle(this, idx, items, cfg?.style);
          }),
      (update) =>
        update.each(function (style, idx) {
          this.attr(style);
          applyStyle(this, idx, items, cfg?.style);
        }),
      (exit) => exit.remove()
    );
}

function renderAlternateRegion(container: Group, items: any[], cfg?: any) {
  select(container)
    .selectAll('.grid-region')
    .data(items, (_, i) => i)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('className', 'grid-region')
          .each(function (style, idx) {
            this.attr(style);
            applyStyle(this, idx, items, cfg?.style);
          }),
      (update) =>
        update.each(function (style, idx) {
          this.attr(style);
          applyStyle(this, idx, items, cfg?.style);
        }),
      (exit) => exit.remove()
    );
}

export const Grid = createComponent<GridStyleProps>({
  render(attributes, container) {
    const { items = [], type, center, lineStyle, alternateColor, closed } = attributes;
    const lines = items.map((item, idx) => ({
      id: item.id || `grid-line-${idx}`,
      path: getLinePath(item.points, type, center, closed),
    }));
    renderGridLine(container, lines, { style: lineStyle });

    const regions: any[] = [];
    if (alternateColor) {
      const colors: string[] = Array.isArray(alternateColor) ? alternateColor : [alternateColor, 'transparent'];

      for (let idx = 0; idx < items.length - 1; idx++) {
        if (idx === 0 && items[0].points.length > 2) {
          const path = getLinePath(items[0].points, type, center);
          regions.push({ path, fill: colors[regions.length % 2] });
        }

        const prevPath = getLinePath(items[idx].points, type, center, closed);
        const nextPoints = items[idx + 1].points.slice().reverse();
        const nextPath = getLinePath(nextPoints, type, center, closed, true);
        let path;
        if (closed) {
          path = `${prevPath} ${nextPath}`;
        } else {
          path = `${prevPath} L${nextPath.slice(1)} Z`;
        }
        regions.push({ path, fill: colors[regions.length % 2] });
      }
    }

    renderAlternateRegion(container, regions);
  },
});
