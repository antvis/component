import { Text, TextStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { applyStyle, measureTextWidth, select } from '../../util';

export class PaginationInfo extends GUI<any> {
  constructor(options: any) {
    super(options);
    this.init();
  }

  init() {
    this.update();
  }

  update(cfg: any = {}) {
    this.attr(deepMix({}, this.attributes, cfg));

    const textStyles = this.getStyleProps();
    select(this)
      .selectAll('.text')
      .data(textStyles, (d) => d.id)
      .join(
        (enter) => enter.append((style) => new Text({ className: 'text', style })),
        (update) => update.each((shape, datum) => applyStyle(shape, datum)),
        (exit) => exit.remove()
      );
  }

  getStyleProps() {
    const { current, separator, total, spacing, style: textStyle } = this.style;
    const texts: (TextStyleProps & { id: string })[] = [];
    [current, separator, total].reduce((r, text, idx) => {
      const attrs = { ...textStyle, text, x: r, id: `${idx}` };
      texts.push(attrs);
      const width = Math.min(measureTextWidth(text, textStyle), 12);
      return r + width + (spacing || 2);
    }, 0);

    return texts;
  }
}
