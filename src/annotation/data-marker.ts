import { IGroup } from '@antv/g-base';
import { get } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { DataMarkerAnnotationCfg, PointLocationCfg } from '../types';
import { renderTag } from '../util/graphic';
import { applyTranslate } from '../util/matrix';
import Theme from '../util/theme';

class DataMarkerAnnotation extends GroupComponent<DataMarkerAnnotationCfg> implements ILocation<PointLocationCfg> {
  /**
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'annotation',
      type: 'dataMarker',
      locationType: 'point',
      x: 0,
      y: 0,
      point: {},
      line: {},
      text: {},
      direction: 'upward',
      autoAdjust: true,
      coordinateBBox: null,
      defaultCfg: {
        point: {
          display: true,
          style: {
            r: 3,
            fill: '#FFFFFF',
            stroke: '#1890FF',
            lineWidth: 2,
          },
        },
        line: {
          display: true,
          length: 20,
          style: {
            stroke: Theme.lineColor,
            lineWidth: 1,
          },
        },
        text: {
          content: '',
          display: true,
          style: {
            fill: Theme.textColor,
            opacity: 0.65,
            fontSize: 12,
            textAlign: 'start',
            fontFamily: Theme.fontFamily,
          },
        },
      },
    };
  }

  protected renderInner(group: IGroup) {
    if (get(this.get('line'), 'display')) {
      this.renderLine(group);
    }
    if (get(this.get('text'), 'display')) {
      this.renderText(group);
    }
    if (get(this.get('point'), 'display')) {
      this.renderPoint(group);
    }

    if (this.get('autoAdjust')) {
      this.autoAdjust(group);
    }
  }

  protected applyOffset() {
    this.moveElementTo(this.get('group'), {
      x: this.get('x') + this.get('offsetX'),
      y: this.get('y') + this.get('offsetY'),
    });
  }

  private renderPoint(group: IGroup) {
    const { point } = this.getShapeAttrs();

    this.addShape(group, {
      type: 'circle',
      id: this.getElementId('point'),
      name: 'annotation-point',
      attrs: point,
    });
  }

  private renderLine(group: IGroup) {
    const { line } = this.getShapeAttrs();

    this.addShape(group, {
      type: 'path',
      id: this.getElementId('line'),
      name: 'annotation-line',
      attrs: line,
    });
  }

  private renderText(group: IGroup) {
    const { text: textAttrs } = this.getShapeAttrs();

    const { x, y, text, ...style } = textAttrs;
    const { background, maxLength, autoEllipsis, isVertival, ellipsisPosition } = this.get('text');
    const tagCfg = {
      x,
      y,
      id: this.getElementId('text'),
      name: 'annotation-text',
      content: text,
      style,
      background,
      maxLength,
      autoEllipsis,
      isVertival,
      ellipsisPosition,
    };

    renderTag(group, tagCfg);
  }

  private autoAdjust(group: IGroup) {
    const direction: string = this.get('direction');
    const x: number = this.get('x');
    const y: number = this.get('y');
    const lineLength: number = get(this.get('line'), 'length', 0);
    const coordinateBBox = this.get('coordinateBBox');
    const { minX, maxX, minY, maxY } = group.getBBox();

    const textGroup = group.findById(this.getElementId('text-group'));
    const textShape = group.findById(this.getElementId('text'));
    const lineShape = group.findById(this.getElementId('line'));

    if (!coordinateBBox) {
      return;
    }

    if (textGroup) {
      if (x + minX <= coordinateBBox.minX) {
        // 左侧超出
        const overflow = coordinateBBox.minX - (x + minX);
        applyTranslate(textGroup, textGroup.attr('x') + overflow, textGroup.attr('y'));
      }
      if (x + maxX >= coordinateBBox.maxX) {
        // 右侧超出
        const overflow = x + maxX - coordinateBBox.maxX;
        applyTranslate(textGroup, textGroup.attr('x') - overflow, textGroup.attr('y'));
      }
    }

    if (
      (direction === 'upward' && y + minY <= coordinateBBox.minY) ||
      (direction !== 'upward' && y + maxY >= coordinateBBox.maxY)
    ) {
      // 上方或者下方超出
      let textBaseline;
      let factor;
      if (direction === 'upward' && y + minY <= coordinateBBox.minY) {
        textBaseline = 'top';
        factor = 1;
      } else {
        textBaseline = 'bottom';
        factor = -1;
      }
      textShape.attr('textBaseline', textBaseline);
      if (lineShape) {
        lineShape.attr('path', [
          ['M', 0, 0],
          ['L', 0, lineLength * factor],
        ]);
      }
      applyTranslate(textGroup, textGroup.attr('x'), (lineLength + 2) * factor)
    }
  }

  private getShapeAttrs() {
    const lineDisplay = get(this.get('line'), 'display');
    const pointStyle = get(this.get('point'), 'style', {});
    const lineStyle = get(this.get('line'), 'style', {});
    const textStyle = get(this.get('text'), 'style', {});
    const direction = this.get('direction');
    const lineLength = lineDisplay ? get(this.get('line'), 'length', 0) : 0;
    const factor = direction === 'upward' ? -1 : 1;
    return {
      point: {
        x: 0,
        y: 0,
        ...pointStyle,
      },
      line: {
        path: [
          ['M', 0, 0],
          ['L', 0, lineLength * factor],
        ],
        ...lineStyle,
      },
      text: {
        x: 0,
        y: (lineLength + 2) * factor,
        text: get(this.get('text'), 'content', ''),
        textBaseline: direction === 'upward' ? 'bottom' : 'top',
        ...textStyle,
      },
    };
  }
}

export default DataMarkerAnnotation;
