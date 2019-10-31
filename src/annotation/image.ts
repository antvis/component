import { IGroup } from '@antv/g-base/lib/interfaces';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../intefaces';
import { RegionLocationCfg } from '../types';
import { regionToBBox } from '../util/util';

class ImageAnnotation extends GroupComponent implements ILocation<RegionLocationCfg> {
  /**
   * @protected
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'annotation',
      type: 'image',
      start: null,
      end: null,
      src: null,
      style: {},
    };
  }

  public renderInner(group: IGroup) {
    this.renderImage(group);
  }

  // 绘制图片
  private renderImage(group: IGroup) {
    const start = this.get('start');
    const end = this.get('end');
    const style = this.get('style');
    const bbox = regionToBBox({ start, end });
    const src = this.get('src');
    this.addShape(group, {
      type: 'rect',
      id: this.getElementId('rect'),
      name: 'annotation-region',
      attrs: {
        x: bbox.x,
        y: bbox.y,
        src,
        width: bbox.width,
        height: bbox.height,
        ...style,
      },
    });
  }
}

export default ImageAnnotation;
