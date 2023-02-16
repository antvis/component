import { DisplayObject, BaseStyleProps, Rect, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import type { ShapeAttrs } from '../../types';
import { select } from '../../util';

export interface ColumnStyleProps extends ShapeAttrs {
  width: number;
  height: number;
}

export interface ColumnsStyleProps extends BaseStyleProps {
  columns: ColumnStyleProps[][];
}

export class Columns extends DisplayObject<ColumnsStyleProps> {
  columnsGroup: Group;

  constructor({ style, ...rest }: Partial<DisplayObject<ColumnsStyleProps>>) {
    super(deepMix({}, { type: 'column', style: { width: 0, height: 0 } }, { style, ...rest }));
    this.columnsGroup = new Group({
      name: 'columns',
    });
    this.appendChild(this.columnsGroup);
    this.render();
  }

  public render(): void {
    const { columns } = this.attributes;

    select(this.columnsGroup)
      .selectAll('column-group')
      .data(columns.flat())
      .join(
        (enter) =>
          enter.append('rect').each(function (cfg) {
            select(this).styles(cfg);
          }),
        (update) =>
          update.each(function (cfg) {
            select(this).styles(cfg);
          }),
        (remove) => remove.remove()
      );
  }

  public update(cfg: Partial<ColumnsStyleProps>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    const { columns } = cfg;
    if (columns) {
      this.clear();
      this.render();
    }
  }

  public clear(): void {
    this.removeChildren();
  }
}
