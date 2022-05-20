import { Group, Text, HTML, TextStyleProps, Rect, HTMLStyleProps, ElementEvent, DisplayObjectConfig } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { normalPadding, select, TEXT_INHERITABLE_PROPS } from '../../util';
import { LEGEND_BASE_DEFAULT_OPTIONS } from './constant';
import { LegendBaseCfg } from './types';

export abstract class LegendBase<T extends LegendBaseCfg = LegendBaseCfg> extends GUI<T> {
  public static tag = 'legend-base';

  protected static defaultOptions = {
    type: LegendBase.tag,
    ...LEGEND_BASE_DEFAULT_OPTIONS,
  };

  protected container!: Group;

  protected innerGroup!: Group;

  protected backgroundShape!: Rect;

  protected titleShape!: HTML | Text;

  constructor(options: DisplayObjectConfig<T>) {
    super(deepMix({}, LegendBase.defaultOptions, options));
    this.init();
  }

  protected abstract drawInner(): void;

  public init() {
    this.backgroundShape = this.appendChild(new Rect({ className: 'legend-background', zIndex: -1 }));
    this.container = this.appendChild(new Group({ className: 'legend-container' }));
    this.titleShape = this.container.appendChild(new Text({ className: 'legend-title' }));
    this.innerGroup = this.container.appendChild(new Group({ className: 'legend-inner-group' }));
  }

  connectedCallback() {
    this.update();
    this.bindEvents();
  }

  public update(cfg: Partial<T> = {}) {
    this.attr(cfg);
    this.drawTitle();
    this.drawInner();
    this.applyBackgroundStyle();

    // Adjust layout.
    const [top, , , left] = this.padding;
    this.container.setLocalPosition(left, top);
  }

  attributeChangedCallback(name: any, ...args: any[]) {
    if (name === 'inset') this.adjustInnerGroup();
    if (name === 'maxWidth' || name === 'maxHeight' || name === 'padding') this.adjustBackground();
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
    if (this.titleStyleProps.type === 'html') {
      const { width, height } = this.titleStyleProps as HTMLStyleProps;
      box = { left: 0, top: 0, width, height };
    } else {
      const { min, halfExtents } = this.titleShape.getLocalBounds();
      box = {
        left: min[0],
        top: min[1],
        width: halfExtents[0] * 2,
        height: halfExtents[1] * 2,
      };
    }
    return { left: 0, top: 0, right: box.width, bottom: box.height };
  }

  protected bindEvents() {
    this.titleShape.addEventListener(ElementEvent.BOUNDS_CHANGED, () => this.adjustInnerGroup());
    this.container.addEventListener(ElementEvent.BOUNDS_CHANGED, () => this.adjustBackground());
  }

  private drawTitle() {
    const { type, ...style } = this.titleStyleProps;
    if (this.titleShape?.tagName !== type) {
      this.titleShape?.remove();
      this.innerGroup.removeChild(this.titleShape);
      if (type === 'html') {
        this.titleShape = select(this.innerGroup)
          .append(() => new HTML({ style: style as HTMLStyleProps }))
          .node() as any;
      } else {
        this.titleShape = select(this.innerGroup)
          .append(() => new Text({ style: style as TextStyleProps }))
          .node() as any;
      }
      this.titleShape.className = 'legend-title';
    } else {
      this.titleShape.attr(style);
    }
  }

  private applyBackgroundStyle() {
    const { backgroundStyle = {} } = this.style;
    this.backgroundShape.attr(backgroundStyle);
  }

  private adjustBackground() {
    const background = this.backgroundShape;
    const [top, right, bottom, left] = this.padding;
    const { maxWidth, maxHeight } = this.style;
    const { min, max } = this.container.getLocalBounds();
    const w = max[0] - min[0];
    const h = max[1] - min[1];

    background.style.width = Math.min(w + right + left, maxWidth || Number.MAX_VALUE);
    background.style.height = Math.min(h + top + bottom, maxHeight || Number.MAX_VALUE);
  }

  private adjustInnerGroup() {
    const inset = normalPadding(this.style.inset);
    const [top, , , left] = inset;
    // Adjust layout.
    const { left: tl, bottom: tb } = this.titleShapeBBox;
    this.innerGroup.setLocalPosition(tl + left, tb + top);
  }
}
