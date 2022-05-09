import { Rect, RectStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { MixAttrs, ShapeAttrs } from '../../types';
import { GUI } from '../../core/gui';
import { applyStyle } from '../../util';
import { Marker, MarkerStyleProps } from '../marker';

type PagerButtonStyleProps = {
  x: number;
  y: number;
  size: number;
  symbol: string;
  disabled: boolean;
  style?: MixAttrs<ShapeAttrs>;
};

export class PagerButton extends GUI<PagerButtonStyleProps> {
  constructor(options: any) {
    super(options);
    this.init();
  }

  public init() {
    this.update();
  }

  protected backgroundShape!: Rect;

  protected markerShape!: Marker;

  public update(cfg?: any) {
    this.attr(deepMix({}, this.attributes, cfg));
    const [rectStyle, markerStyle] = this.getStyleProps();
    if (!this.backgroundShape) {
      this.backgroundShape = this.appendChild(new Rect({ className: 'pager-btn-background', style: rectStyle }));
    } else {
      applyStyle(this.backgroundShape, rectStyle);
    }

    if (!this.markerShape) {
      this.markerShape = this.backgroundShape.appendChild(
        new Marker({ className: 'pager-btn-marker', style: markerStyle })
      );
    } else {
      this.markerShape.update(markerStyle);
    }
  }

  private getStyleProps(): [RectStyleProps, MarkerStyleProps] {
    const { size, symbol, disabled, style } = this.style;
    const { default: defaultStyle, disabled: disabledStyle } = deepMix(
      {},
      {
        default: { fill: 'black', cursor: 'pointer' },
        disabled: { fill: '#d9d9d9', cursor: 'not-allowed' },
      },
      style
    );
    const styleProps = deepMix({}, defaultStyle, disabled ? disabledStyle : {});
    return [
      { width: size, height: size, fill: 'transparent', cursor: styleProps.cursor },
      { size: size * 0.6, symbol, ...styleProps, x: 0.5 * size, y: 0.5 * size },
    ];
  }
}

Marker.registerSymbol('left', (x: number, y: number, r: number) => {
  return [['M', x - r, y], ['L', x + r, y - r], ['L', x + r, y + r], ['Z']];
});
Marker.registerSymbol('right', (x: number, y: number, r: number) => {
  return [['M', x - r, y - r], ['L', x + r, y], ['L', x - r, y + r], ['Z']];
});
Marker.registerSymbol('up', (x: number, y: number, r: number) => {
  return [['M', x - r, y + r], ['L', x, y - r], ['L', x + r, y + r], ['Z']];
});
Marker.registerSymbol('down', (x: number, y: number, r: number) => {
  return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x, y + r], ['Z']];
});
