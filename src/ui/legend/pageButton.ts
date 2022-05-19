import { BaseCustomElementStyleProps, Rect, CustomElement, ElementEvent, DisplayObjectConfig } from '@antv/g';
import { deepMix, get } from '@antv/util';
import { MixAttrs, ShapeAttrs } from '../../types';
import { normalPadding } from '../../util';
import { Marker } from '../marker';

type PageButtonStyleProps = BaseCustomElementStyleProps & {
  symbol: string;
  size?: number;
  disabled?: boolean;
  padding?: number | number[];
  markerStyle?: MixAttrs<ShapeAttrs>;
  backgroundStyle?: MixAttrs<ShapeAttrs>;
};

export class PageButton extends CustomElement<PageButtonStyleProps> {
  protected backgroundShape!: Rect;

  protected markerShape!: Marker;

  protected static defaultOptions = {
    style: {
      size: 10,
      padding: [2, 4],
      markerStyle: {
        default: { fill: 'black', cursor: 'pointer' },
        disabled: { fill: '#d9d9d9', cursor: 'not-allowed' },
      },
      backgroundStyle: {
        default: { cursor: 'pointer', fill: 'transparent' },
        disabled: { cursor: 'not-allowed' },
      },
    },
  };

  constructor(options: DisplayObjectConfig<PageButtonStyleProps>) {
    super(deepMix({}, PageButton.defaultOptions, options));
    this.backgroundShape = this.appendChild(new Rect({ className: 'page-btn-background' }));
    this.markerShape = this.appendChild(new Marker({ className: 'page-btn-marker' }));
  }

  connectedCallback() {
    this.applyMarkerStyle();
    this.applyBackground();
    this.bindEvents();
  }

  attributeChangedCallback(name: keyof PageButtonStyleProps, oldValue: any, newValue: any) {
    if (name === 'symbol' || name === 'size' || name === 'disabled' || name === 'markerStyle') this.applyMarkerStyle();
    if (name === 'disabled' || name === 'backgroundStyle') this.applyBackground();
    if (name === 'padding') this.adjustLayout();
  }

  private bindEvents() {
    this.markerShape.addEventListener(ElementEvent.BOUNDS_CHANGED, () => this.adjustLayout());
  }

  private adjustLayout() {
    const [pt = 0, pr = 0, pb = pt, pl = pr] = normalPadding(this.style.padding);
    const [hw, hh] = this.markerShape.getLocalBounds().halfExtents;
    const offsetX = pl + hw;
    const offsetY = pt + hh;
    this.backgroundShape.attr({ x: -offsetX, y: -offsetY, width: pl + pr + hw * 2, height: pt + pb + hh * 2 });
    this.setLocalPosition(offsetX, offsetY);
  }

  private getStyle(styles: MixAttrs<ShapeAttrs> = {}, disabled?: boolean) {
    return deepMix({}, get(styles, 'default'), disabled ? get(styles, 'disabled') : {});
  }

  private applyMarkerStyle() {
    const { size, symbol, disabled, markerStyle } = this.style;
    this.markerShape.attr({ size, symbol });
    this.markerShape.attr(this.getStyle(markerStyle, disabled));
  }

  private applyBackground() {
    const { disabled, backgroundStyle } = this.style;
    this.backgroundShape.attr(this.getStyle(backgroundStyle, disabled));
  }
}

Marker.registerSymbol('left', (x: number, y: number, r: number) => {
  const diff = r * Math.sin(Math.PI / 3);
  return [['M', x - diff, y], ['L', x + r, y - r], ['L', x + r, y + r], ['Z']];
});
Marker.registerSymbol('right', (x: number, y: number, r: number) => {
  const diff = r * Math.sin(Math.PI / 3);
  return [['M', x - r, y - r], ['L', x + diff, y], ['L', x - r, y + r], ['Z']];
});
Marker.registerSymbol('up', (x: number, y: number, r: number) => {
  const diff = r * Math.sin(Math.PI / 3);
  return [['M', x - r, y + r], ['L', x, y - diff], ['L', x + r, y + r], ['Z']];
});
Marker.registerSymbol('down', (x: number, y: number, r: number) => {
  const diff = r * Math.sin(Math.PI / 3);
  return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x, y + diff], ['Z']];
});
