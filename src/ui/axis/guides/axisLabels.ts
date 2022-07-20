import { Group, Text } from '@antv/g';
import { getFont, select, parseLength, defined, getEllipsisText } from '../../../util';
import { AxisLabelCfg } from '../types';
import { applyStyle } from './utils';

function limitText(textShape: Text, maxLength: string | number) {
  const font = getFont(textShape);
  const limitLength = parseLength(maxLength!, font);
  // @ts-ignore
  textShape.attr('tip', null);
  if (defined(limitLength) && limitLength < textShape.getBounds().halfExtents[0] * 2) {
    const ellipsis = getEllipsisText(textShape.style.text || '', limitLength!, font, '...');
    // @ts-ignore
    textShape.attr('tip', textShape.style.text);
    textShape.attr('text', ellipsis);
  }
}

type LabelAttrs = {
  id: string;
  x: number;
  y: number;
  text: string;
  data: any;
  textAlign?: string;
  textBaseline?: string;
  transform?: string;
};

/**
 * Display labels default.
 */
export function renderLabels(container: Group, labels: LabelAttrs[], cfg: AxisLabelCfg | null = {}) {
  select(container)
    .selectAll('.axis-label')
    .data(cfg ? labels : [], (d) => d.id)
    .join(
      (enter) =>
        enter
          .append('text')
          .attr('className', 'axis-label')
          .style('fontFamily', 'sans-serif')
          .style('fontWeight', 'lighter')
          .style('fill', 'black')
          .style('fontSize', 12)
          .style('visibility', 'visible')
          .each(function (style, idx) {
            this.attr(style);
            limitText(this, cfg?.maxLength || Number.MAX_SAFE_INTEGER);
            applyStyle(this, idx, cfg?.style);
          }),
      (update) =>
        update
          .each(function (style, idx) {
            this.attr(style);
            limitText(this, cfg?.maxLength || Number.MAX_SAFE_INTEGER);
            applyStyle(this, idx, cfg?.style);
          })
          .style('visibility', 'visible'),
      (exit) => exit.remove()
    );
}
