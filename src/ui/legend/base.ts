import { Group, TextStyleProps, HTMLStyleProps, DisplayObjectConfig, HTML, Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { applyStyle, maybeAppend, normalPadding, select, TEXT_INHERITABLE_PROPS } from '../../util';
import { LEGEND_BASE_DEFAULT_OPTIONS } from './constant';
import { LegendBaseCfg } from './types';

export abstract class LegendBase<T extends LegendBaseCfg = LegendBaseCfg> extends GUI<T> {
  public static tag = 'legend-base';

  protected static defaultOptions = {
    type: LegendBase.tag,
    ...LEGEND_BASE_DEFAULT_OPTIONS,
  };

  protected container!: Group;

  constructor(options: DisplayObjectConfig<T>) {
    super(deepMix({}, LegendBase.defaultOptions, options));
  }

  protected abstract drawInner(): void;

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  public update(cfg: Partial<T> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  private render() {
    const [top, , , left] = this.padding;
    this.container = maybeAppend(this, '.legend-container', 'g')
      .attr('className', 'legend-container')
      .style('x', left)
      .style('y', top)
      .node();
    this.drawTitle();
    this.createInnerGroup();
    this.drawInner();
    this.drawBackground();
  }

  public destroy() {
    this.removeChildren(true);
    this.remove();
  }

  protected get orient() {
    return this.style.orient || 'horizontal';
  }

  protected get padding() {
    return normalPadding(this.style.padding);
  }

  protected get titleStyleProps(): (TextStyleProps | HTMLStyleProps) & { type: 'text' | 'html' } {
    const { title: titleCfg } = this.style;
    if (titleCfg?.useHTML) {
      return {
        type: 'html',
        width: titleCfg?.width ?? 80,
        height: titleCfg?.height ?? 20,
        innerHTML: `<span>${titleCfg?.content || ''}</span>`,
      };
    }

    return {
      type: 'text',
      ...TEXT_INHERITABLE_PROPS,
      textBaseline: 'top' as any,
      ...(titleCfg?.style || {}),
      text: titleCfg?.content || '',
    };
  }

  protected get titleShapeBBox(): { top: number; left: number; right: number; bottom: number } {
    let box = { left: 0, top: 0, width: 0, height: 0 };
    const titleShape = select(this).select('.legend-title').node();
    if (this.titleStyleProps.type === 'html') {
      const { width, height } = this.titleStyleProps as HTMLStyleProps;
      box = { left: 0, top: 0, width: width as number, height: height as number };
    } else if (titleShape) {
      const { min, halfExtents } = titleShape.getLocalBounds();
      box = {
        left: min[0],
        top: min[1],
        width: halfExtents[0] * 2,
        height: halfExtents[1] * 2,
      };
    }
    return { left: 0, top: 0, right: box.width, bottom: box.height };
  }

  protected bindEvents() {}

  private drawTitle() {
    const { type, ...style } = this.titleStyleProps as any;
    const className = 'legend-title';
    const titleShape = this.querySelector(`.${className}`) as any;
    if (titleShape && titleShape?.tagName !== type) {
      titleShape.remove();
    }
    maybeAppend(this.container, `.${className}`, () =>
      type === 'html' ? new HTML({ className, style }) : new Text({ className, style })
    ).call(applyStyle, style);
  }

  private createInnerGroup() {
    const titleSpacing = this.style.title?.spacing || 0;
    const inset = normalPadding(this.style.inset);
    const { left: tl, bottom: tb } = this.titleShapeBBox;
    maybeAppend(this.container, '.legend-inner-group', 'g')
      .attr('className', 'legend-inner-group')
      .style('x', tl + inset[3])
      .style('y', tb + inset[0] + titleSpacing);
  }

  private drawBackground() {
    const { backgroundStyle = {} } = this.style;

    const [top, right, bottom, left] = this.padding;
    const { maxWidth, maxHeight } = this.style;
    const { min, max } = this.container.getLocalBounds();
    const w = max[0] - min[0];
    const h = max[1] - min[1];

    maybeAppend(this, '.legend-background', 'rect')
      .attr('className', 'legend-background')
      .style('zIndex', -1)
      .style('width', Math.min(w + right + left, maxWidth || Number.MAX_VALUE))
      .style('height', Math.min(h + top + bottom, maxHeight || Number.MAX_VALUE))
      .call(applyStyle, backgroundStyle);
  }
}
