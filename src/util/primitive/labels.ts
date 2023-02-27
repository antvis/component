import { DisplayObject, Group } from '@antv/g';
import { Text } from '../../ui/text';
import { defined } from '../defined';
import { select } from '../selection';
import { getEllipsisText, getFont, parseLength } from '../text';

export type LabelAttrs = {
  id: string;
  x: number;
  y: number;
  text: string;
  data: any;
  textAlign?: string;
  textBaseline?: string;
  transform?: string;
};

type LabelCfg = {
  maxLength?: string | number;
  style?: object | ((datum: any, idx: number, data: any[]) => any);
};

export function applyLabelStyle(shape: DisplayObject, idx: number, attrs: any[], style?: any) {
  const datum = attrs[idx].data;
  const data = attrs.map((d) => d.data);
  const labelStyle = typeof style === 'function' ? style.call(null, datum, idx, data) : style;
  shape.attr(labelStyle || {});
}

export function limitText(textShape: Text, maxLength: string | number) {
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

/**
 * Display labels by default.
 */
export function renderLabels(
  container: Group,
  className: string,
  labels: LabelAttrs[],
  cfg?: LabelCfg | null,
  defaultStyle: any = {}
) {
  select(container)
    .selectAll(`.${className}`)
    .data(labels, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append('text')
          .styles({ className, fontFamily: 'sans-serif', fontSize: 12, fontWeight: 'normal', ...defaultStyle })
          .each(function (datum, idx) {
            this.attr(datum);
            limitText(this, cfg?.maxLength || Number.MAX_SAFE_INTEGER);
            applyLabelStyle(this, idx, labels, cfg?.style);
          }),
      (update) =>
        update.each(function (datum, idx) {
          this.attr(datum);
          limitText(this, cfg?.maxLength || Number.MAX_SAFE_INTEGER);
          applyLabelStyle(this, idx, labels, cfg?.style);
        }),
      (exit) => exit.remove()
    );
}
