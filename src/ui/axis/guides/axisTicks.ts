import { Group, Line } from '@antv/g';
import { select } from '../../../util';
import { applyStyle } from './utils';

export function renderTicks(container: Group, tickItems: any[], cfg?: any, type: string = '') {
  select(container)
    .selectAll(`.axis-${type}tick`)
    .data(cfg ? tickItems : [], (d) => d.id)
    .join(
      (enter) =>
        enter
          .append((style) => new Line({ className: `axis-${type}tick`, style }))
          .style('stroke', '#416180')
          .style('lineWidth', 0.5)
          .style('strokeOpacity', type === 'sub' ? 0.45 : 0.65)
          .style('visibility', 'visible')
          .each(function (style, idx) {
            this.attr(style);
            applyStyle(this, idx, tickItems, cfg?.style);
          }),
      (update) =>
        update
          .each(function (style, idx) {
            this.attr(style);
            applyStyle(this, idx, tickItems, cfg?.style);
          })
          .style('visibility', 'visible'),
      (exit) => exit.remove()
    );
}
