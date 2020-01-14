import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { DataMarkerAnnotationCfg, PointLocationCfg } from '../types';
import Theme from '../util/theme';

class DataMarkerAnnotation extends GroupComponent<DataMarkerAnnotationCfg> implements ILocation<PointLocationCfg> {
  /**
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    const defaultCfg = {
      direction: 'upward',
      autoAdjust: true,
      lineLength: 20,
      display: {
        point: true,
        line: true,
        text: true,
      },
      style: {
        point: {
          r: 3,
          fill: '#FFFFFF',
          stroke: '#1890FF',
          lineWidth: 2,
        },
        line: {
          stroke: Theme.lineColor,
          lineWidth: 1,
        },
        text: {
          fill: Theme.textColor,
          opacity: 0.65,
          fontSize: 12,
          textAlign: 'start',
          fontFamily: Theme.fontFamily,
        },
      },
    };
    return {
      ...cfg,
      name: 'annotation',
      type: 'dataMarker',
      locationType: 'point',
      x: 0,
      y: 0,
      content: '',
      coordinateBBox: null,
      ...defaultCfg,
      defaultCfg,
    };
  }

  protected renderInner(group: IGroup) {
    const { point, line, text } = this.get('display');

    if (line) {
      this.renderLine(group);
    }
    if (text) {
      this.renderText(group);
    }
    if (point) {
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
      attrs: point,
    });
  }

  private renderLine(group: IGroup) {
    const { line } = this.getShapeAttrs();

    this.addShape(group, {
      type: 'path',
      id: this.getElementId('line'),
      attrs: line,
    });
  }

  private renderText(group: IGroup) {
    const { text } = this.getShapeAttrs();

    this.addShape(group, {
      type: 'text',
      id: this.getElementId('text'),
      attrs: text,
    });
  }

  private autoAdjust(group: IGroup) {
    const direction: string = this.get('direction');
    const x: number = this.get('x');
    const y: number = this.get('y');
    const lineLength: number = this.get('lineLength');
    const coordinateBBox = this.get('coordinateBBox');
    const { minX, maxX, minY, maxY } = group.getBBox();

    const textShape = group.findById(this.getElementId('text'));
    const lineShape = group.findById(this.getElementId('line'));

    if (!coordinateBBox) {
      return;
    }

    if (textShape) {
      if (x + minX <= coordinateBBox.minX) {
        // 左侧超出
        textShape.attr('textAlign', 'start');
      }
      if (x + maxX >= coordinateBBox.maxX) {
        // 右侧超出
        textShape.attr('textAlign', 'end');
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
      textShape.attr('y', (lineLength + 2) * factor);
    }
  }

  private getShapeAttrs() {
    const { line: lineDisplay } = this.get('display');
    const { point: pointStyle, line: lineStyle, text: textStyle } = this.get('style');
    const direction = this.get('direction');
    const lineLength = lineDisplay ? this.get('lineLength') : 0;
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
        text: this.get('content'),
        textBaseline: direction === 'upward' ? 'bottom' : 'top',
        ...textStyle,
      },
    };
  }
}

export default DataMarkerAnnotation;
