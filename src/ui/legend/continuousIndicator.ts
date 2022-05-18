import {
  Text,
  ElementEvent,
  Path,
  PathCommand,
  CustomElement,
  DisplayObjectConfig,
  BaseCustomElementStyleProps,
  TextStyleProps,
} from '@antv/g';
import { clamp } from '@antv/util';
import { deepAssign } from '../../util';

type IndicatorStyleProps = BaseCustomElementStyleProps & {
  position: 'top' | 'right';
  textStyle?: TextStyleProps;
};

function getPath(position: string, points: any) {
  const [x0, y0, x1, y1] = points;
  if (position === 'top') {
    const w = x1 - x0;
    const size = clamp(10, w / 3, w / 2);
    // todo, support round corner.
    return [
      ['M', x0, y1],
      ['L', x0, y0],
      ['L', x1, y0],
      ['L', x1, y1],
      ['L', x0 + w / 2 + size / 2, y1],
      ['L', x0 + w / 2, y1 + 4],
      ['L', x0 + w / 2 - size / 2, y1],
      ['L', x0, y1],
    ] as PathCommand[];
  }

  const h = y1 - y0;
  const size = clamp(6, h / 3, h / 2);
  return [
    ['M', x0, y0],
    ['L', x1, y0],
    ['L', x1, y1],
    ['L', x0, y1],
    ['L', x0, y0 + h / 2 + size / 2],
    ['L', x0 - 4, y0 + h / 2],
    ['L', x0, y0 + h / 2 - size / 2],
    ['L', x0, y0],
  ] as PathCommand[];
}

export class Indicator extends CustomElement<IndicatorStyleProps> {
  constructor(options: DisplayObjectConfig<IndicatorStyleProps> = {}) {
    super(deepAssign({}, { style: { visibility: 'hidden' } }, options));

    this.background = this.appendChild(
      new Path({ style: { lineCap: 'round', fill: '#262626', lineWidth: 1, stroke: '#333' } })
    );
    this.text = this.appendChild(new Text({ style: { text: '', fill: '#fff', fontSize: 10, textBaseline: 'middle' } }));
  }

  private background!: Path;

  private text!: Text;

  connectedCallback(): void {
    this.init();
    this.bindEvents();
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any): void {
    if (name === 'textStyle' || name === 'padding' || name === 'position') {
      this.init();
    }
  }

  public hide() {
    this.style.visibility = 'hidden';
  }

  public show() {
    this.style.visibility = 'visible';
  }

  private init() {
    const { textStyle, position } = this.style;
    if (position === 'top') {
      this.text.attr({ textAlign: 'center', ...textStyle });
    } else {
      this.text.attr({ textAlign: 'left', ...textStyle });
    }
  }

  private updateBackground() {
    const { min, max } = this.text.getLocalBounds();
    const w = Math.min(max[0] - min[0], 40);
    const points = [min[0] - 4, min[1] - 2, min[0] + w + 4, max[1] + 2];
    const path = getPath(this.style.position, points);
    this.background.style.path = path;
  }

  private bindEvents() {
    this.text.addEventListener(ElementEvent.GEOMETRY_BOUNDS_CHANGED, () => {
      this.updateBackground();
    });
  }
}
