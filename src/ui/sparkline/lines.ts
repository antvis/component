import { Path, DisplayObject, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import type { PathStyleProps, BaseStyleProps } from '@antv/g';

export interface ILinesCfg extends BaseStyleProps {
  lines: PathStyleProps[];
  areas: PathStyleProps[];
}

export class Lines extends DisplayObject<ILinesCfg> {
  private linesGroup: Group;

  private areasGroup: Group;

  constructor({ style, ...rest }: Partial<DisplayObject<ILinesCfg>>) {
    super(deepMix({}, { type: 'lines', style: { width: 0, height: 0 } }, { style, ...rest }));
    this.linesGroup = new Group({
      name: 'lines',
    });
    this.appendChild(this.linesGroup);

    this.areasGroup = new Group({
      name: 'areas',
    });
    this.appendChild(this.areasGroup);
    this.render();
  }

  public render(): void {
    const { lines, areas } = this.attributes;
    if (lines) this.createLines(lines);
    if (areas) this.createAreas(areas);
  }

  public clear(): void {
    this.linesGroup.removeChildren();
    this.areasGroup.removeChildren();
  }

  public update(cfg: Partial<ILinesCfg>) {
    const { lines, areas } = cfg;
    this.clear();
    lines && this.setAttribute('lines', lines);
    areas && this.setAttribute('areas', areas);
    this.render();
  }

  private createLines(lines: ILinesCfg['lines']) {
    lines.forEach((cfg) => {
      this.linesGroup.appendChild(
        new Path({
          name: 'line',
          style: cfg,
        })
      );
    });
  }

  private createAreas(areas: ILinesCfg['areas']) {
    areas.forEach((cfg) => {
      this.areasGroup.appendChild(
        new Path({
          name: 'area',
          style: cfg,
        })
      );
    });
  }
}
