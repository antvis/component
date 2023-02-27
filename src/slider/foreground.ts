import { IGroup, LooseObject } from '@antv/g-base';
import { omit } from '@antv/util';
import GroupComponent from '../abstract/group-component';
import { GroupComponentCfg } from '../types';
import { BAR_STYLE, FOREGROUND_STYLE, SLIDER_BAR_LINE_GAP } from './constant';

interface IStyle {
  fill?: string;
  stroke?: string;
  radius?: number;
  opacity?: number;
  cursor?: string;
  highLightFill?: string;
  /** 框选占比 */
  brushRatio?: number;
}

export interface ForegroundCfg extends GroupComponentCfg {
  // position size
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  // style
  readonly foregroundStyle?: IStyle;
}

export class Foreground extends GroupComponent<ForegroundCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'foreground',
      width: 100,
      height: 16,
      foregroundStyle: FOREGROUND_STYLE,
      barStyle: BAR_STYLE,
    };
  }

  protected renderInner(group: IGroup) {
    const { x, height, width, foregroundStyle, barStyle } = this.cfg;
    const { brushRatio } = foregroundStyle;

    // 上方移动区域
    this.addShape(group, {
      id: this.getElementId('foreground-scroll'),
      name: 'foreground-scroll',
      type: 'rect',
      attrs: {
        x,
        y: 0,
        width,
        height: height * (1 - brushRatio),
        cursor: 'move',
        ...omit(foregroundStyle, ['stroke']),
      },
    });

    // 下方brush区域
    this.addShape(group, {
      id: this.getElementId('foreground-brush'),
      name: 'foreground-brush',
      type: 'rect',
      attrs: {
        x,
        y: height * (1 - brushRatio),
        width,
        height: height * brushRatio,
        cursor: 'crosshair',
        ...omit(foregroundStyle, ['stroke']),
      },
    });

    // 上方Bar区域
    const barGroup = this.addGroup(group, {
      id: this.getElementId('foreground-bar'),
      name: 'foreground-bar',
    });
    // 外层矩形
    this.addShape(barGroup, {
      id: this.getElementId('foreground-bar-rect'),
      name: 'foreground-bar-rect',
      type: 'rect',
      attrs: {
        x,
        y: -barStyle.height,
        width,
        height: barStyle.height,
        cursor: 'move',
        ...omit(barStyle, ['stroke']),
      },
    });
    // 三条小竖线
    const centerX = width / 2 + x;
    const leftX = centerX - SLIDER_BAR_LINE_GAP;
    const rightX = centerX + SLIDER_BAR_LINE_GAP;
    const y1 = -(1 / 4) * barStyle.height;
    const y2 = -(3 / 4) * barStyle.height;
    const publicAttrs = {
      y1,
      y2,
      ...barStyle,
    };
    [leftX, centerX, rightX].forEach((x) => {
      this.drawBarLine(group, x, publicAttrs);
    });

    // 背景边框
    this.addShape(group, {
      id: this.getElementId('foreground-border'),
      name: 'foreground-border',
      type: 'rect',
      attrs: {
        x,
        y: 0,
        width,
        height,
        stroke: foregroundStyle?.stroke,
        opacity: foregroundStyle?.strokeOpacity,
        lineWidth: foregroundStyle?.lineWidth,
      },
    });
  }

  private drawBarLine(group: IGroup, x: number, attrs: LooseObject) {
    this.addShape(group, {
      id: this.getElementId(`line-${x}`),
      name: `foreground-line`,
      type: 'line',
      attrs: {
        x1: x,
        x2: x,
        ...attrs,
      },
    });
  }

  protected initEvent() {
    this.bindEvents();
  }

  private bindEvents() {
    const { highLightFill, fill } = this.get('barStyle');
    const barRectShape = this.get('group').findById(this.getElementId('foreground-bar-rect'));
    this.get('group').on('foreground-bar:mouseenter', () => {
      barRectShape.attr('fill', highLightFill);
      this.draw();
    });
    this.get('group').on('foreground-scroll:mouseenter', () => {
      barRectShape.attr('fill', highLightFill);
      this.draw();
    });
    this.get('group').on('foreground-bar:mouseleave', () => {
      barRectShape.attr('fill', fill);
      this.draw();
    });
    this.get('group').on('foreground-scroll:mouseleave', () => {
      barRectShape.attr('fill', fill);
      this.draw();
    });
  }

  private draw() {
    const canvas = this.get('container').get('canvas');
    if (canvas) {
      canvas.draw();
    }
  }
}
