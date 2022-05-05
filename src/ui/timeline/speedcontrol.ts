import { Group, Path, PathCommand, Rect } from '@antv/g';
import { deepMix, isFunction } from '@antv/util';
import { GUIOption } from '../../types';
import { TEXT_INHERITABLE_PROPS } from '../../util';
import { Text } from '../text';
import { GUI } from '../../core/gui';
import { SpeedControlCfg, SpeedControlOptions } from './types';
import { formatter } from './util';

export class SpeedControl extends GUI<Required<SpeedControlCfg>> {
  public static tag = 'speedcontrol';

  private trianglePath = (x: number, y: number) => {
    return [['M', x, y], ['L', x, y + 4], ['L', x + 5, y + 2], ['Z']];
  };

  private linePath = (x: number, y: number) => {
    return [
      ['M', x - 3.5, y],
      ['L', x + 3.5, y],
    ];
  };

  private triangleShape: Path | undefined;

  private lineShapes: Path[] | undefined;

  private labelShape: Text | undefined;

  private lines: Group | undefined;

  private static defaultOptions: GUIOption<SpeedControlCfg> = {
    type: SpeedControl.tag,
    style: {
      x: 0,
      y: 0,
      width: 35,
      height: 18,
      speeds: [1.0, 2.0, 3.0, 4.0, 5.0],
      currentSpeedIdx: 0,
      spacing: 2,
      label: {
        fontColor: 'rgba(0,0,0,0.45)',
        height: 14,
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: 10,
        verticalAlign: 'bottom',
        overflow: 'clip',
      },
    },
  };

  constructor(options: SpeedControlOptions) {
    super(deepMix({}, SpeedControl.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.createLines();
    this.createTriangle();
    this.createLabel();
    this.bindEvents();
  }

  public update(cfg: Partial<Required<SpeedControlCfg>>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.clear();
    this.createLines();
    this.createTriangle();
    this.createLabel();
    this.bindEvents();
  }

  public clear(): void {
    this.removeChildren();
  }

  private bindEvents() {
    if (!this.lineShapes) return;
    const { onSpeedChange, speeds } = this.attributes;
    for (let i = 0; i < this.lineShapes.length; i += 1) {
      const onClick = (event: any) => {
        const line = event.target as Path;
        const { y } = line.attributes;
        this.triangleShape?.setAttribute('y', (y as number) - 2);
        this.labelShape?.update({ text: formatter(speeds[i]) });
        this.setAttribute('currentSpeedIdx', i);
        isFunction(onSpeedChange) && onSpeedChange(i);
      };
      this.lineShapes[i].addEventListener('click', onClick);
    }
  }

  private createTriangle() {
    if (!this.lineShapes) return;
    const { currentSpeedIdx } = this.attributes;
    const line = this.lineShapes[currentSpeedIdx];
    const { y } = line.attributes;
    this.triangleShape = new Path({
      style: {
        fill: '#8c8c8c',
        path: this.trianglePath(0, 0) as PathCommand[],
      },
    });
    this.triangleShape.setAttribute('y', (y as number) - 2);
    this.triangleShape.translateLocal(0);
    this.appendChild(this.triangleShape);
  }

  private createLines() {
    const mapLines = () =>
      new Path({
        style: {
          stroke: '#bfbfbf',
          path: this.linePath(3.5, 0) as PathCommand[],
        },
      });
    this.lineShapes = Array(5).fill(undefined).map(mapLines);
    this.lineShapes[0].translateLocal(0, 2);
    this.lineShapes[1].translateLocal(0, 4);
    this.lineShapes[2].translateLocal(0, 7);
    this.lineShapes[3].translateLocal(0, 11);
    this.lineShapes[4].translateLocal(0, 16);
    this.lines = new Rect({ style: { width: 7, height: 16, x: 3, y: 0, cursor: 'pointer' } });
    this.lineShapes.forEach((line) => {
      this.lines!.appendChild(line);
    });
    this.appendChild(this.lines);
  }

  private createLabel() {
    const { width, speeds, label, spacing, currentSpeedIdx } = this.attributes;
    const lastLine = this.lineShapes && this.lineShapes[(this.lineShapes?.length as number) - 1];
    const lastLineY = lastLine?.attributes.y as number;
    let restSpacing = width - 10 - spacing;
    restSpacing = restSpacing > 0 ? restSpacing : 0;
    this.labelShape = new Text({
      style: {
        ...TEXT_INHERITABLE_PROPS,
        ...(label as any),
        x: 10 + spacing,
        width: restSpacing,
        y: lastLineY - (label.height as number) + 3,
        text: formatter(speeds[currentSpeedIdx]),
      },
    });
    this.appendChild(this.labelShape);
  }

  public getActualHeight() {
    return this.getBounds()!.max[1] - this.getBounds()!.min[1];
  }
}
