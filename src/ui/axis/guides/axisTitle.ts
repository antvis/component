import { Group } from '@antv/g';
import { maybeAppend, applyStyle } from '../../../util';
import { AxisTitleCfg } from '../types';

/**
 * @todo Use title.maxLength
 */
export function renderTitle(
  container: Group,
  x: number,
  y: number,
  textAlign?: string,
  textBaseline?: string,
  cfg?: AxisTitleCfg
) {
  maybeAppend(container, '.axis-title', 'text')
    .attr('className', 'axis-title')
    .style('text', cfg?.content || '')
    .style('x', x)
    .style('y', y)
    .style('fill', 'black')
    .style('fontSize', 12)
    .style('fontWeight', 'lighter')
    .style('textAlign', textAlign)
    .style('textBaseline', textBaseline)
    .style('transform', `rotate(${cfg?.rotate || 0}deg)`)
    .style('visibility', cfg ? 'visible' : 'hidden')
    .call(applyStyle, cfg?.style || {});
}
