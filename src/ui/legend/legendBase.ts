import { Group, Text, HTML, TextStyleProps, Rect, HTMLStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { applyStyle, normalPadding, select, TEXT_INHERITABLE_PROPS } from '../../util';
import { LEGEND_BASE_DEFAULT_OPTIONS } from './constant';
import { LegendBaseCfg, LegendBaseOptions } from './types';

export abstract class LegendBase<T extends LegendBaseCfg> extends GUI<T> {
  public static tag = 'legend-base';

  protected static defaultOptions = {
    type: LegendBase.tag,
    ...LEGEND_BASE_DEFAULT_OPTIONS,
  };

  protected container!: Group;

  protected backgroundShape!: Rect;

  private titleShape!: HTML | Text;

  constructor(options: LegendBaseOptions) {
    super(deepMix({}, LegendBase.defaultOptions, options));

    const background = select(this).append('rect').attr('className', 'legend-background').node();
    const container = select(this).append('g').attr('className', 'legend-container').node();
    const title = select(container).append('text').attr('className', 'legend-title').node();

    this.container = container;
    this.titleShape = title as Text;
    this.backgroundShape = background as Rect;
    this.init();
  }

  public init() {
    this.update();
    this.bindEvents();
  }

  public update(cfg: Partial<T> = {}) {
    this.attr(cfg);
    const [top, , , left] = this.padding;
    this.container.setLocalPosition(left, top);

    this.drawTitle();
    this.drawInner();
    this.drawBackground();
  }

  public destroy() {
    this.removeChildren(true);
    this.remove();
    super.destroy();
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

  protected get titleShapeBBox(): { x: number; y: number; right: number; bottom: number } {
    let box = { x: 0, y: 0, width: 0, height: 0 };
    if (this.titleStyleProps.type === 'html') {
      const { width, height } = this.titleStyleProps as HTMLStyleProps;
      box = { x: 0, y: 0, width, height };
    } else {
      const bounds = this.titleShape.getLocalBounds();
      box = {
        x: bounds.min[0],
        y: bounds.min[1],
        width: bounds.max[0] - bounds.min[0],
        height: bounds.max[1] - bounds.min[1],
      };
    }
    return {
      x: box.x,
      y: box.y,
      right: box.x + box.width,
      bottom: box.y + box.height + (this.style.title?.spacing || 0),
    };
  }

  protected abstract drawInner(): void;

  protected abstract bindEvents(): void;

  protected drawTitle() {
    const { type, ...style } = this.titleStyleProps;
    if (this.titleShape?.tagName !== type) {
      this.titleShape?.remove();
      this.container.removeChild(this.titleShape);
      if (type === 'html') {
        this.titleShape = select(this.container)
          .append(() => new HTML({ style: style as HTMLStyleProps }))
          .node() as any;
      } else {
        this.titleShape = select(this.container)
          .append(() => new Text({ style: style as TextStyleProps }))
          .node() as any;
      }
      this.titleShape.className = 'legend-title';
    } else {
      applyStyle(this.titleShape as any, style);
    }
  }

  protected drawBackground() {
    const background = this.backgroundShape;
    const { maxWidth, maxHeight, backgroundStyle } = this.style;
    applyStyle(background, backgroundStyle || {});
    const [top, right, bottom, left] = this.padding;
    const { width, height } = this.container.getBBox();

    background.style.width = Math.min(width + right + left, maxWidth || Number.MAX_VALUE);
    background.style.height = Math.min(height + top + bottom, maxHeight || Number.MAX_VALUE);
    background.style.zIndex = -1;
  }
}
