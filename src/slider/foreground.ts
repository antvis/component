import { IGroup, LooseObject } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { GroupComponentCfg } from '../types';
import {
  FOREGROUND_STYLE,
  SLICER_BAR_LINE_STYLE,
  SLIDER_BAR_HEIGHT,
  SLIDER_BAR_LINE_GAP,
  SLIDER_BAR_STYLE,
} from './constant';

interface IStyle {
  fill?: string;
  stroke?: string;
  radius?: number;
  opacity?: number;
  cursor?: string;
  highLightFill?: string;
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
      // x: 0,
      // y: 0,
      width: 100,
      height: 16,
      style: FOREGROUND_STYLE,
      barStyle: SLIDER_BAR_STYLE,
    };
  }

  protected renderInner(group: IGroup) {
    const { x, height, width, style, barStyle } = this.cfg;

    // 上方brush区域
    this.addShape(group, {
      id: this.getElementId('foreground-brush'),
      name: 'foreground-brush',
      type: 'rect',
      attrs: {
        x,
        y: 0,
        width,
        height: (height * 3) / 5,
        cursor: 'crosshair',
        ...style,
      },
    });

    // 下方移动区域
    this.addShape(group, {
      id: this.getElementId('foreground-scroll'),
      name: 'foreground-scroll',
      type: 'rect',
      attrs: {
        x,
        y: (height * 3) / 5,
        width,
        height: (height * 2) / 5,
        cursor: 'move',
        ...style,
      },
    });

    // 下方Bar区域
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
        y: height,
        width,
        height: SLIDER_BAR_HEIGHT,
        cursor: 'move',
        ...barStyle,
      },
    });
    // 三条小竖线
    const centerX = width / 2 + x;
    const leftX = centerX - SLIDER_BAR_LINE_GAP;
    const rightX = centerX + SLIDER_BAR_LINE_GAP;
    const y1 = height + (1 / 5) * 6;
    const y2 = height + (4 / 5) * 6;
    const publicAttrs = {
      y1,
      y2,
      ...SLICER_BAR_LINE_STYLE,
    };
    [leftX, centerX, rightX].forEach((x) => {
      this.drawBarLine(group, x, publicAttrs);
    });

    this.addShape(group, {
      id: this.getElementId('foreground-border'),
      name: 'foreground-border',
      type: 'rect',
      attrs: {
        x,
        y: 0,
        width,
        height,
        stroke: '#4E83CD',
        opacity: 0.3,
        lineWidth: 0.8,
      },
    });
  }

  private drawBarLine(group: IGroup, x: number, attrs: LooseObject) {
    this.addShape(group, {
      id: this.getElementId(`line-${x}`),
      name: `line-${x}`,
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
    this.get('group').on('foreground-bar:mouseleave', () => {
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
