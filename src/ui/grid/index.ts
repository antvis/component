import type { Group } from '@antv/g';
import type { Point } from '@/types';
import { GUI } from '@/core/gui';
import { distance, select } from '../../util';
import { applyStyle } from '../axis/guides/utils';
import type { GridCfg, GridStyle } from './types';

export type { GridCfg };

function renderStraight(points: Point[]) {
  return points.reduce((acc, curr, idx) => `${acc}${idx === 0 ? 'M' : ' L'}${curr[0]},${curr[1]}`, '');
}

function renderSurround(points: Point[], cfg: GridCfg, reversed?: boolean) {
  const { connect = 'line', center } = cfg;
  if (connect === 'line') return renderStraight(points);
  if (!center) return '';
  const radius = distance(points[0], center);
  const sweepFlag = reversed ? 0 : 1;
  return points.reduce((r, [p0, p1], idx) => {
    if (idx === 0) return `M${p0},${p1}`;
    return `${r}A${radius},${radius},0,0,${sweepFlag},${p0},${p1}`;
  }, '');
}

function getLinePath(points: Point[], cfg: GridCfg, reversed?: boolean) {
  if (cfg.type === 'surround') return renderSurround(points, cfg, reversed);
  return renderStraight(points);
}

function connectPaths(from: Point[], to: Point[], cfg: GridCfg) {
  const { type, connect, center, closed } = cfg;
  const closeFlag = closed ? ' Z' : '';
  const [path1, path2] = [getLinePath(from, cfg), getLinePath(to.slice().reverse(), cfg, true)];
  const [startOfFrom, endOfTo] = [from[0], to.slice(-1)[0]];
  const createPath = (insertA: string, insertB: string) => `${path1} ${insertA} ${path2} ${insertB} ${closeFlag}`;

  if (connect === 'line' || type === 'surround') return createPath(`L${endOfTo.join()}`, `L${startOfFrom.join()}`);
  if (!center) throw new Error('Arc grid need to specified center');

  const [raduis1, radius2] = [distance(endOfTo, center), distance(startOfFrom, center)];
  return createPath(
    `A${raduis1},${raduis1},0,0,1,${endOfTo.join(' ')} L${endOfTo.join()}`,
    `A${radius2},${radius2},0,0,0,${startOfFrom.join(' ')}`
  );
}

function renderGridLine(container: Group, items: GridCfg['items'], cfg: GridCfg, style: GridStyle) {
  const lines = items.map((item, idx) => ({
    id: item.id || `grid-line-${idx}`,
    path: getLinePath(item.points, cfg),
  }));
  select(container)
    .selectAll('.grid-line')
    .data(lines, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('className', 'grid-line')
          .style('stroke', '#D9D9D9')
          .style('lineWidth', 1)
          .style('lineDash', [4, 4])
          .each(function ({ path }, idx) {
            this.attr({ ...style, path });
            applyStyle(this, idx, lines, { path, ...style });
          }),
      (update) =>
        update.each(function (style, idx) {
          this.attr(style);
          applyStyle(this, idx, lines, style);
        }),
      (exit) => exit.remove()
    );
}

function renderAlternateRegion(container: Group, items: GridCfg['items'], cfg: GridCfg) {
  const { type, center, connect, areaFill, closed } = cfg;
  if (items.length < 2 || !areaFill || !connect) return;
  const colors: string[] = Array.isArray(areaFill) ? areaFill : [areaFill, 'transparent'];
  const getColor = (idx: number) => colors[idx % colors.length];

  const regions: any[] = [];
  for (let idx = 0; idx < items.length - 1; idx++) {
    const [prev, curr] = [items[idx].points, items[idx + 1].points];
    const path = connectPaths(prev, curr, cfg);
    regions.push({ path, fill: getColor(idx) });
  }

  select(container)
    .selectAll('.grid-region')
    .data(regions, (_, i) => i)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('className', 'grid-region')
          .each(function (style, idx) {
            this.attr(style);
            applyStyle(this, idx, regions, style);
          }),
      (update) =>
        update.each(function (style, idx) {
          this.attr(style);
          applyStyle(this, idx, regions, style);
        }),
      (exit) => exit.remove()
    );
}

function dataFormatter(data: GridCfg['items'], cfg: GridCfg) {
  const { closed } = cfg;
  if (!closed) return data;
  return data.map((datum) => {
    const { points } = datum;
    const [start, ...rest] = points;
    return { ...datum, points: [...points, start] };
  });
}

export class Grid extends GUI<GridCfg> {
  render(attributes: GridCfg, container: Group) {
    const { items = [], type, center, areaFill, closed, ...style } = attributes;
    const data = dataFormatter(items, attributes);
    renderGridLine(container, data, attributes, style);
    renderAlternateRegion(container, data, attributes);
  }
}
