import type { BaseStyleProps, PathStyleProps } from '@antv/g';
import { DisplayObject, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import { applyStyle, select } from '../../util';

export interface ILinesCfg extends BaseStyleProps {
  lines: PathStyleProps[];
  areas: PathStyleProps[];
}

export class Lines extends DisplayObject<ILinesCfg> {
  private linesGroup: Group;

  private areasGroup: Group;

  constructor({ style, ...rest }: Partial<DisplayObject<ILinesCfg>>) {
    super(deepMix({}, { type: 'lines', style: { width: 0, height: 0 } }, { style, ...rest }));
    this.linesGroup = this.appendChild(new Group({ name: 'lines' }));
    this.areasGroup = this.appendChild(new Group({ name: 'areas' }));
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
    select(this.linesGroup)
      .selectAll('line')
      .data(lines)
      .join(
        (enter) =>
          enter.append('path').each(function (cfg) {
            select(this).call(applyStyle, cfg);
          }),
        (update) =>
          update.each(function (cfg) {
            select(this).call(applyStyle, cfg);
          }),
        (remove) => remove.remove()
      );
  }

  private createAreas(areas: ILinesCfg['areas']) {
    select(this.linesGroup)
      .selectAll('area')
      .data(areas)
      .join(
        (enter) =>
          enter.append('path').each(function (cfg) {
            select(this).call(applyStyle, cfg);
          }),
        (update) =>
          update.each(function (cfg) {
            select(this).call(applyStyle, cfg);
          }),
        (remove) => remove.remove()
      );
  }
}
