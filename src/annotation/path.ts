import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { PathAnnotationCfg, RegionLocationCfg } from '../types';
import Theme from '../util/theme';

class PathAnnotation extends GroupComponent<PathAnnotationCfg> implements ILocation<RegionLocationCfg> {
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
      type: 'path',
      locationType: 'region',
      path: [],
      style: {
        stroke: Theme.lineColor,
        lineWidth: 1,
        opacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round',
      },
    };
  }

  protected renderInner(group: IGroup) {
    this.renderPath(group);
  }

  // 绘制路径
  private renderPath(group: IGroup) {
    const style = this.get('style');
    const path = this.get('path');
    
    this.addShape(group, {
      type: 'path',
      id: this.getElementId('path'),
      name: 'annotation-path',
      attrs: {
        path,
        ...style,
      },
    });
  }
}

export default PathAnnotation;
