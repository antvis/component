import { PathStyleProps, CustomElement, DisplayObjectConfig, Path, PathCommand } from '@antv/g';
import { deepAssign } from '../../util';
import { DEFAULT_RAIL_CFG } from './constant';
import { ifHorizontal } from './utils';

type RailStyleProps = Omit<PathStyleProps, 'path'> & {
  type?: 'size' | 'color';
  orient?: 'horizontal' | 'vertical';
  size: number;
  length: number;
  backgroundColor?: string;
  selection?: [number, number];
};

export class Rail extends CustomElement<RailStyleProps> {
  constructor(options: DisplayObjectConfig<RailStyleProps> = {}) {
    super(deepAssign({}, { style: DEFAULT_RAIL_CFG }, options));
    this.path = this.appendChild(new Path({ className: 'rail-path' }));
    this.track = this.appendChild(new Path({ className: 'rail-path' }));
  }

  private track!: Path;

  private path!: Path;

  connectedCallback(): void {
    this.draw();
  }

  attributeChangedCallback() {
    this.draw();
  }

  private draw() {
    this.updateBackground();
    this.updateTrack();
  }

  private updateBackground() {
    const { backgroundColor } = this.style;
    this.path.style.path = this.getRailPath();
    this.path.attr({ fill: backgroundColor, fillOpacity: 0.45 });
  }

  private updateTrack() {
    const { fill } = this.style;
    this.track.style.path = this.getRailPath();
    this.track.style.clipPath = this.getClipPath();
    this.track.style.fill = fill;
  }

  private get box() {
    const { orient, size, length } = this.style;
    return ifHorizontal(orient, [length, size], [size, length]);
  }

  private getRailPath() {
    const { type } = this.style;
    const [cw, ch] = this.box;

    if (type === 'size') {
      return [
        ['M', 0, ch],
        ['L', 0 + cw, 0],
        ['L', 0 + cw, ch],
      ] as PathCommand[];
    }
    return [
      ['M', 0, ch],
      ['L', 0, 0],
      ['L', 0 + cw, 0],
      ['L', 0 + cw, ch],
    ] as PathCommand[];
  }

  private getClipPath() {
    const { orient, selection } = this.style;
    if (!selection) {
      return null;
    }
    const [width, height] = this.box;
    const [st, et] = selection;
    const x = ifHorizontal(orient, st * width, 0);
    const y = ifHorizontal(orient, 0, st * height);
    const w = ifHorizontal(orient, et * width, width);
    const h = ifHorizontal(orient, height, et * height);
    return new Path({
      style: {
        path: [
          ['M', x, y],
          ['L', x, h],
          ['L', w, h],
          ['L', w, y],
        ],
      },
    });
  }
}
