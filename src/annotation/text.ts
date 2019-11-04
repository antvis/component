import { IGroup } from '@antv/g-base/lib/interfaces';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../intefaces';
import { PointLocationCfg, TextAnnotationCfg } from '../types';
import Theme from '../util/theme';

class TextAnnotation extends GroupComponent<TextAnnotationCfg> implements ILocation<PointLocationCfg> {
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
      type: 'text',
      locationType: 'point',
      x: 0,
      y: 0,
      content: '',
      style: {},
      defaultCfg: {
        style: {
          fill: Theme.textColor,
          fontSize: 12,
          textAlign: 'center',
          textBaseline: 'middle',
          fontFamily: Theme.fontFamily,
        },
      },
    };
  }

  // 复写 setLocation 方法，不需要重新创建 text
  public setLocation(location: PointLocationCfg) {
    this.set('x', location.x);
    this.set('y', location.y);
    this.resetLocation();
  }

  protected renderInner(group: IGroup) {
    this.renderText(group);
  }

  private renderText(group) {
    const { x, y } = this.getLocation();
    const content = this.get('content');
    const style = this.get('style');
    this.addShape(group, {
      type: 'text',
      id: this.getElementId('text'),
      name: 'annotation-text', // 因为 group 上会有默认的 annotation-text 的 name 所以需要区分开
      attrs: {
        x,
        y,
        text: content,
        ...style,
      },
    });
  }

  private resetLocation() {
    const textShape = this.getElementByLocalId('text');
    if (textShape) {
      const { x, y } = this.getLocation();
      textShape.attr({
        x,
        y,
      });
    }
  }
}

export default TextAnnotation;
