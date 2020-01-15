import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { DataRegionAnnotationCfg, Point, PointsLocationCfg } from '../types';
import Theme from '../util/theme';
import { pointsToBBox } from '../util/util';

class DataRegionAnnotation extends GroupComponent<DataRegionAnnotationCfg> implements ILocation<PointsLocationCfg> {
  /**
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    const style = {
      region: {
        lineWidth: 0,
        fill: Theme.regionColor,
        opacity: 0.4,
      },
      text: {
        textAlign: 'center',
        textBaseline: 'bottom',
        fontSize: 12,
        fill: Theme.textColor,
        fontFamily: Theme.fontFamily,
      },
    };
    return {
      ...cfg,
      name: 'annotation',
      type: 'dataRegion',
      locationType: 'points',
      points: [],
      content: '',
      lineLength: 0,
      style,
      defaultCfg: {
        style,
      },
    };
  }

  protected renderInner(group: IGroup) {
    const { region: regionStyle = {}, text: textStyle = {} } = this.get('style');
    const lineLength = this.get('lineLength') || 0;
    const points: Point[] = this.get('points');

    if (!points.length) {
      return;
    }
    const bbox = pointsToBBox(points);

    // render region
    const path = [];
    path.push(['M', points[0].x, bbox.minY - lineLength]);
    points.forEach((point) => {
      path.push(['L', point.x, point.y]);
    });
    path.push(['L', points[points.length - 1].x, points[points.length - 1].y - lineLength]);
    this.addShape(group, {
      type: 'path',
      id: this.getElementId('region'),
      attrs: {
        path,
        ...regionStyle,
      },
    });

    // render text
    this.addShape(group, {
      type: 'text',
      id: this.getElementId('text'),
      attrs: {
        x: (bbox.minX + bbox.maxX) / 2,
        y: bbox.minY - lineLength,
        text: this.get('content'),
        ...textStyle,
      },
    });
  }
}

export default DataRegionAnnotation;
