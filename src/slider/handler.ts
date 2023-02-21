import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { GroupComponentCfg } from '../types';
import { DEFAULT_HANDLER_HEIGHT, DEFAULT_HANDLER_WIDTH, HANDLER_STYLE } from './constant';

interface IStyle {
  fill?: string;
  stroke?: string;
  radius?: number;
  opacity?: number;
  cursor?: string;
  highLightFill?: string;
  highLightStroke?: string;
}

export interface HandlerCfg extends GroupComponentCfg {
  // position size
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  // style
  readonly style?: IStyle;
}

export class Handler extends GroupComponent<HandlerCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'handler',
      x: 0,
      y: 0,
      width: DEFAULT_HANDLER_WIDTH,
      height: DEFAULT_HANDLER_HEIGHT,
      style: HANDLER_STYLE,
    };
  }
  protected renderInner(group: IGroup) {
    const { width, height, style } = this.cfg as HandlerCfg;
    const { fill, stroke, radius, opacity, cursor } = style;

    // 按钮框框
    this.addShape(group, {
      type: 'rect',
      id: this.getElementId('background'),
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        fill,
        radius,
        opacity,
        cursor,
      },
    });

    // 两根竖线
    const x1 = (1 / 3) * width;
    const x2 = (2 / 3) * width;

    const y1 = (1 / 4) * height;
    const y2 = (3 / 4) * height;

    this.addShape(group, {
      id: this.getElementId('line-left'),
      name: 'handler-line',
      type: 'line',
      attrs: {
        x1,
        y1,
        x2: x1,
        y2,
        stroke,
        cursor,
      },
    });

    this.addShape(group, {
      id: this.getElementId('line-right'),
      name: 'handler-line',
      type: 'line',
      attrs: {
        x1: x2,
        y1,
        x2,
        y2,
        stroke,
        cursor,
      },
    });
  }

  protected applyOffset() {
    this.moveElementTo(this.get('group'), {
      x: this.get('x'),
      y: this.get('y'),
    });
  }

  protected initEvent() {
    this.bindEvents();
  }

  private bindEvents() {
    this.get('group').on('mouseenter', () => {
      const { highLightStroke } = this.get('style');
      this.getElementByLocalId('line-left').attr('stroke', highLightStroke);
      this.getElementByLocalId('line-right').attr('stroke', highLightStroke);
      this.draw();
    });

    this.get('group').on('mouseleave', () => {
      const { stroke } = this.get('style');
      this.getElementByLocalId('line-left').attr('stroke', stroke);
      this.getElementByLocalId('line-right').attr('stroke', stroke);
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

export default Handler;
