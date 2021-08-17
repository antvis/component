import { DisplayObject, Text } from '@antv/g';
import { ShapeAttrs, TextProps } from '../../types';

export interface ILabelsCfg extends ShapeAttrs {
  labels: TextProps[];
}

export class Labels extends DisplayObject<ILabelsCfg> {
  constructor({ style, ...rest }: Partial<DisplayObject<ILabelsCfg>>) {
    super({ type: 'lines', style, ...rest });
    this.render();
  }

  public render(): void {
    const { labels } = this.attributes;
    // 重新绘制
    labels.forEach((cfg) => {
      this.appendChild(
        new Text({
          name: 'label',
          style: cfg,
        })
      );
    });
  }

  attributeChangedCallback(name: string, value: any) {
    if (name === 'labelsAttrs') {
      // 清空label
      this.removeChildren(true);
      this.render();
    }
  }
}
