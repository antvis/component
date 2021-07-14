import { Path } from '@antv/g';
import { CustomElement, ShapeCfg } from '../../types';

type AttrsType = { [key: string]: any };
type LinesCfg = { linesAttrs: AttrsType[]; areasAttrs?: AttrsType[] };

export class Lines extends CustomElement {
  constructor({ attrs, ...rest }: ShapeCfg) {
    super({ type: 'lines', attrs, ...rest });
    this.render(attrs.linesCfg);
  }

  public render(linesCfg: LinesCfg): void {
    this.removeChildren(true);
    const { linesAttrs, areasAttrs } = linesCfg;
    linesAttrs.forEach((cfg) => {
      this.appendChild(
        new Path({
          name: 'line',
          attrs: cfg,
        })
      );
    });
    areasAttrs?.forEach((cfg) => {
      this.appendChild(
        new Path({
          name: 'area',
          attrs: cfg,
        })
      );
    });
  }

  attributeChangedCallback(name: string, value: any) {
    if (name === 'linesCfg') {
      this.render(value);
    }
  }
}
