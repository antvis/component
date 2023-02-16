import type { Group } from '@antv/g';
import { fadeOut, transition } from '../../animation';
import { GUI } from '../../core';
import type { Point } from '../../types';
import { classNames, distance, getCallbackValue, select, type Selection } from '../../util';
import type { GridOptions, GridStyle, GridStyleProps } from './types';

export type { GridStyleProps, GridOptions };

const CLASS_NAMES = classNames(
  {
    lineGroup: 'line-group',
    line: 'line',
    regionGroup: 'region-group',
    region: 'region',
  },
  'grid'
);

function renderStraight(points: Point[]) {
  return points.reduce((acc, curr, idx) => `${acc}${idx === 0 ? 'M' : ' L'}${curr[0]},${curr[1]}`, '');
}

function renderSurround(points: Point[], attr: GridStyleProps, reversed?: boolean) {
  const { connect = 'line', center } = attr.style;
  if (connect === 'line') return renderStraight(points);
  if (!center) return '';
  const radius = distance(points[0], center);
  const sweepFlag = reversed ? 0 : 1;
  return points.reduce((r, [p0, p1], idx) => {
    if (idx === 0) return `M${p0},${p1}`;
    return `${r}A${radius},${radius},0,0,${sweepFlag},${p0},${p1}`;
  }, '');
}

function getLinePath(points: Point[], cfg: GridStyleProps, reversed?: boolean) {
  if (cfg.style.type === 'surround') return renderSurround(points, cfg, reversed);
  return renderStraight(points);
}

function connectPaths(from: Point[], to: Point[], cfg: GridStyleProps) {
  const { type, connect, center, closed } = cfg.style;
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

function renderGridLine(
  container: Selection<Group>,
  data: GridStyleProps['data'],
  attr: GridStyleProps,
  style: GridStyle
) {
  const { animate } = attr;
  const lines = data.map((item, idx) => ({
    id: item.id || `grid-line-${idx}`,
    path: getLinePath(item.points, attr),
  }));
  container
    .selectAll(CLASS_NAMES.line.class)
    .data(lines, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('className', CLASS_NAMES.line.name)
          .styles({
            stroke: '#D9D9D9',
            lineWidth: 1,
            lineDash: [4, 4],
          })
          .each(function (datum, index) {
            const lineStyle = getCallbackValue({ path: datum.path, ...style }, [datum, index, lines]);
            this.attr(lineStyle);
          }),
      (update) =>
        update.each(function (datum, index) {
          const lineStyle = getCallbackValue({ path: datum.path, ...style }, [datum, index, lines]);
          transition(this, lineStyle, animate.update);
        }),
      (exit) =>
        exit.each(async function () {
          await fadeOut(this, animate.exit)?.finished;
          this.remove();
        })
    );
}

function renderAlternateRegion(container: Selection<Group>, data: GridStyleProps['data'], cfg: GridStyleProps) {
  const {
    animate,
    style: { connect, areaFill },
  } = cfg;
  if (data.length < 2 || !areaFill || !connect) return;
  const colors: string[] = Array.isArray(areaFill) ? areaFill : [areaFill, 'transparent'];
  const getColor = (idx: number) => colors[idx % colors.length];

  const regions: any[] = [];
  for (let idx = 0; idx < data.length - 1; idx++) {
    const [prev, curr] = [data[idx].points, data[idx + 1].points];
    const path = connectPaths(prev, curr, cfg);
    regions.push({ path, fill: getColor(idx) });
  }

  container
    .selectAll(CLASS_NAMES.region.class)
    .data(regions, (_, i) => i)
    .join(
      (enter) =>
        enter
          .append('path')
          .each(function (datum, index) {
            const regionStyle = getCallbackValue(datum, [datum, index, regions]);
            this.attr(regionStyle);
          })
          .attr('className', CLASS_NAMES.region.name),
      (update) =>
        update.each(function (datum, index) {
          const regionStyle = getCallbackValue(datum, [datum, index, regions]);
          transition(this, regionStyle, animate.update);
        }),
      (exit) =>
        exit.each(async function () {
          await fadeOut(this, animate.exit);
          this.remove();
        })
    );
}

function dataFormatter(data: GridStyleProps['data'], cfg: GridStyleProps) {
  const { closed } = cfg.style;
  if (!closed) return data;
  return data.map((datum) => {
    const { points } = datum;
    const [start] = points;
    return { ...datum, points: [...points, start] };
  });
}

export class Grid extends GUI<GridStyleProps> {
  render(attributes: GridStyleProps, container: Group) {
    // @ts-ignore do no passBy className
    const {
      data = [],
      style: { type, center, areaFill, closed, ...style },
    } = attributes;
    const finalData = dataFormatter(data, attributes);
    const lineGroup = select(container).maybeAppendByClassName(CLASS_NAMES.lineGroup, 'g');
    const regionGroup = select(container).maybeAppendByClassName(CLASS_NAMES.regionGroup, 'g');
    renderGridLine(lineGroup, finalData, attributes, style);
    renderAlternateRegion(regionGroup, finalData, attributes);
  }
}
