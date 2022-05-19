import { TextStyleProps, CustomElement, Text, DisplayObjectConfig } from '@antv/g';
import { MarkerStyleProps, Marker } from '../marker';

type HandleStyleProps = MarkerStyleProps & {
  textStyle?: TextStyleProps;
};

export class Handle extends CustomElement<HandleStyleProps> {
  constructor(options: DisplayObjectConfig<HandleStyleProps> = {}) {
    super(options);
    this.marker = this.appendChild(new Marker({}));
  }

  private textShape: Text | null = null;

  private marker!: Marker;

  connectedCallback(): void {
    this.draw();
  }

  attributeChangedCallback() {
    this.draw();
  }

  private draw() {
    const { symbol, fill, lineWidth, stroke, size = 8, textStyle, visibility } = this.style;
    this.marker.attr({
      symbol,
      size: visibility === 'hidden' ? 0 : size,
      fill,
      lineWidth: lineWidth || 1,
      stroke,
    });
    if (visibility === 'visible') {
      this.textShape = this.textShape || this.appendChild(new Text({}));
      this.textShape.attr(textStyle || {});
    } else {
      this.textShape?.remove();
      this.textShape = null;
    }
  }
}
