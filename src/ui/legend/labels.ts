import { deepMix } from '@antv/util';
import { DisplayObject, Text, Group } from '@antv/g';
import { ShapeAttrs, TextProps } from '../../types';

export interface ILabelsCfg extends ShapeAttrs {
  labels: TextProps[];
}

export class Labels extends DisplayObject<ILabelsCfg> {
  private labelsGroup: Group;

  constructor({ style, ...rest }: Partial<DisplayObject<ILabelsCfg>>) {
    super({ type: 'lines', style, ...rest });
    this.labelsGroup = new Group({ name: 'labels' });
    this.appendChild(this.labelsGroup);
    this.render();
  }

  public render(): void {
    const { labels } = this.attributes;
    // 重新绘制
    labels.forEach((cfg) => {
      const text = new Text({
        name: 'label',
        style: cfg,
      });
      this.labelsGroup.appendChild(text);
    });
  }

  public update(cfg: Partial<ILabelsCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    const { labels } = cfg;
    if (labels) {
      this.labelsGroup.removeChildren(true);
      this.render();
    }
  }

  public getLabels() {
    return this.labelsGroup.children as Text[];
  }
}
