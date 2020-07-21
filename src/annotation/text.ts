import { get } from '@antv/util';

import { IGroup, IShape } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { PointLocationCfg, TextAnnotationCfg } from '../types';
import { ellipsisLabel } from '../util/label';
import { getMatrixByAngle } from '../util/matrix';
import { formatPadding } from '../util/util';

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
      rotate: null,
      style: {},
      background: null,
      maxLength: null,
      autoEllipsis: true,
      isVertical: false,
      ellipsisPosition: 'tail',
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
    const text = this.addShape(group, {
      type: 'text',
      id: this.getElementId('text'),
      name: `${this.get('name')}-text`, // 因为 group 上会有默认的 annotation-text 的 name 所以需要区分开
      attrs: {
        x,
        y,
        text: content,
        ...style,
      },
    });
    const maxLength = this.get('maxLength');
    const autoEllipsis = this.get('autoEllipsis');
    const isVertical = this.get('isVertical');
    const ellipsisPosition = this.get('ellipsisPosition');
    if (maxLength && autoEllipsis) {
      // 超出自动省略
      ellipsisLabel(!isVertical, text, maxLength, ellipsisPosition);
    }

    const background = this.get('background');
    if (background) {
      // 渲染文本背景
      const padding = formatPadding(get(background, 'padding', 0));
      const backgroundStyle = get(background, 'style', {});

      const { minX, minY, width, height } = text.getCanvasBBox();
      const element = this.addGroup(group, {
        id: this.getElementId('text'),
        name: `${this.get('name')}-text`,
      });
      const textBg = element.addShape('rect', {
        id: this.getElementId('text-bg'),
        name: `${this.get('name')}-text-bg`,
        attrs: {
          x: minX - padding[3],
          y: minY - padding[0],
          width: width + padding[1] + padding[3],
          height: height + padding[0] + padding[2],
          ...backgroundStyle,
        },
      });
      element.add(text);
      this.applyRotate(textBg, x, y);
    }
    this.applyRotate(text, x, y);
  }

  private applyRotate(textShape: IShape | IGroup, x: number, y: number) {
    const rotate = this.get('rotate');
    let matrix = null;
    if (rotate) {
      matrix = getMatrixByAngle({ x, y }, rotate);
    }
    textShape.attr('matrix', matrix);
  }

  private resetLocation() {
    const textShape = this.getElementByLocalId('text');
    if (textShape) {
      const { x, y } = this.getLocation();
      textShape.attr({
        x,
        y,
      });
      this.applyRotate(textShape, x, y);
    }
  }
}

export default TextAnnotation;
