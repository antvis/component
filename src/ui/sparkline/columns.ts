import { DisplayObject, Rect, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import type { ShapeAttrs } from '../../types';

export interface IColumnCfg extends ShapeAttrs {
  width: number;
  height: number;
}

export interface IColumnsCfg {
  columns: IColumnCfg[][];
}

export class Columns extends DisplayObject<IColumnsCfg> {
  columnsGroup: Group;

  constructor({ style, ...rest }: Partial<DisplayObject<IColumnsCfg>>) {
    super({ type: 'column', style, ...rest });
    this.columnsGroup = new Group({
      name: 'columns',
    });
    this.appendChild(this.columnsGroup);
    this.render();
  }

  public render(): void {
    const { columns } = this.attributes;
    columns.forEach((column) => {
      column.forEach((cfg) => {
        this.columnsGroup.appendChild(
          new Rect({
            name: 'column',
            style: cfg,
          })
        );
      });
    });
  }

  public update(cfg: Partial<IColumnsCfg>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    const { columns } = cfg;
    if (columns) {
      this.clear();
      this.render();
    }
  }

  public clear(): void {
    this.removeChildren(true);
  }
}
