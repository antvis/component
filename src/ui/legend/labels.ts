import { CustomElement, Text } from '@antv/g';
import type { ShapeCfg } from '../../types';

type LabelsAttrs = ShapeCfg[];

export class Labels extends CustomElement {
  constructor({ attrs, ...rest }: ShapeCfg) {
    super({ type: 'lines', attrs, ...rest });
    this.render(attrs.labelsAttrs);
  }

  public render(labelsAttrs: LabelsAttrs): void {
    // 清空label
    this.removeChildren(true);
    // 重新绘制
    labelsAttrs.forEach((attr) => {
      this.appendChild(
        new Text({
          name: 'label',
          attrs: attr,
        })
      );
    });
  }

  attributeChangedCallback(name: string, value: any) {
    if (name === 'labelsAttrs') {
      this.render(value);
    }
  }
}
