import type { Group } from '@antv/g';
import type { vec2 as Vector2 } from '@antv/matrix-util';
import type { MarkerStyleProps } from '../../marker';
import type { AxisLineCfg } from '../types';
import { maybeAppend, applyStyle } from '../../../util';
import { Marker } from '../../marker';

function renderAxisArrow(
  container: Group,
  type: 'start' | 'end',
  x: number,
  y: number,
  angle?: number,
  cfg?: Partial<MarkerStyleProps> | null
) {
  maybeAppend(container, `.axis-${type}-arrow`, () => new Marker({}))
    .attr('className', `axis-arrow$$ axis-${type}-arrow`)
    .style('visibility', cfg ? 'visible' : 'hidden')
    .style('symbol', 'axis-arrow')
    .style('x', x)
    .style('y', y)
    .style('size', 8)
    .style('lineWidth', 0.5)
    .style('fill', 'grey')
    .style('stroke', 'grey')
    .style('fillOpacity', 0.85)
    .style('strokeOpacity', 0.85)
    .style('transformOrigin', 'left')
    .style('transform', `rotate(${angle}deg)`)
    .call(applyStyle, cfg || {});
}

/**
 * @todo Support draw arrow in arc axis.
 */
export function renderAxisLine(
  container: Group,
  path: string,
  points?: [Vector2, Vector2],
  cfg: AxisLineCfg | null = {}
) {
  maybeAppend(container, '.axis-line', 'path')
    .attr('className', 'axis-line')
    .style('visibility', cfg ? 'visible' : 'hidden')
    .style('stroke', 'grey')
    .style('lineWidth', 0.5)
    .style('strokeOpacity', 0.85)
    .style('path', path)
    .call(applyStyle, cfg?.style || {});

  if (points) {
    const { start, end } = cfg?.arrow || {};
    const [[x1, y1], [x2, y2]] = points;
    let angle = ((Math.atan((y2 - y1) / (x2 - x1)) / Math.PI) * 180) / 2;
    if (x1 === x2) {
      angle = y1 > y2 ? 45 : -45;
    } else if (y1 === y2) {
      angle = x1 > x2 ? 0 : 90;
    }
    renderAxisArrow(container, 'start', x1, y1, angle, start);
    renderAxisArrow(container, 'end', x2, y2, angle + 90, end);
  }
}
