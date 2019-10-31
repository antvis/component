import GroupComponent from '../abstract/group-component';
import { ILocation } from '../intefaces';
import { PointLocationCfg } from '../types';
import Theme from '../util/theme';

class TextAnnotation extends GroupComponent implements ILocation<PointLocationCfg> {
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

  protected renderInner(group) {
    this.renderText(group);
  }

  private renderText(group) {
    const x = this.get('x');
    const y = this.get('y');
    const content = this.get('content');
    const style = this.get('style');
    this.addShape(group, {
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
}

export default TextAnnotation;
