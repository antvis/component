import { deepMix } from '@antv/util';
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

  public update(cfg: Partial<ILabelsCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    const { labels } = cfg;
    if (labels) {
      this.removeChildren(true);
      this.render();
    }
  }
}
