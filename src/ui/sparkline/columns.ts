import { CustomElement, Rect } from '@antv/g';
import type { ShapeCfg } from '../../types';

type AttrsType = { [key: string]: any };
type ColumnsCfg = AttrsType[][];

export class Columns extends CustomElement {
  constructor({ attrs, ...rest }: ShapeCfg) {
    super({ type: 'column', attrs, ...rest });
    this.render(attrs.columnsCfg);
  }

  public render(columnsCfg: ColumnsCfg): void {
    this.removeChildren();
    columnsCfg.forEach((column) => {
      column.forEach((cfg) => {
        this.appendChild(
          new Rect({
            name: 'column',
            attrs: {
              ...cfg,
            },
          })
        );
      });
    });
  }

  attributeChangedCallback(name: string, value: any) {
    if (name === 'columnsCfg') {
      this.render(value);
    }
  }
}
