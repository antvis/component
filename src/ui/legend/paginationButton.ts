import { Rect, RectStyleProps } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { applyStyle } from '../../util';
import { Marker, MarkerStyleProps } from '../marker';

export class PaginationButton extends GUI<{ x: number; y: number; size: number; marker: string; disabled: boolean }> {
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
      this.backgroundShape = this.appendChild(new Rect({ className: 'pagination-btn-background', style: rectStyle }));
    } else {
      applyStyle(this.backgroundShape, rectStyle);
    }

    if (!this.markerShape) {
      this.markerShape = this.backgroundShape.appendChild(
        new Marker({ className: 'pagination-btn-marker', style: markerStyle })
      );
    } else {
      this.markerShape.update(markerStyle);
    }
  }

  private getStyleProps(): [RectStyleProps, MarkerStyleProps] {
    const { size, marker: symbol, disabled } = this.style;
    return [
      { width: size, height: size, fill: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer' },
      { size: size * 0.6, symbol, fill: disabled ? '#d9d9d9' : 'black', x: 0.5 * size, y: 0.5 * size },
    ];
  }
}
