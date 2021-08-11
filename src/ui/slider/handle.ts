import { DisplayObject, Rect, Line, Text } from '@antv/g';
import { deepMix, get } from '@antv/util';
import { Marker } from '../marker';
import { ShapeAttrs } from '../../types';

export interface IHandleCfg {
  x: number;
  y: number;
  handleType: 'start' | 'end';
  iconCfg: {
    type: 'hide' | 'symbol' | 'default';
    orient: 'horizontal' | 'vertical';
    style: ShapeAttrs;
  };
  textCfg: ShapeAttrs & { text: string };
}

export class Handle extends DisplayObject<IHandleCfg> {
  private iconShape: Rect | Marker;

  private textShape: Text;

  constructor({ style, ...rest }: Partial<DisplayObject<IHandleCfg>>) {
    super({ type: 'handle', style, ...rest });
    this.iconShape = this.createHandleIcon();
    this.appendChild(this.iconShape);
    this.textShape = this.createHandleText();
    this.appendChild(this.textShape);
    this.setHandleIconRotation();
  }

  public setHandle({ x, y }: { x: number; y: number }) {
    this.attr({ x, y });
  }

  public setHandleText({ x, y, text }: { x: number; y: number; text: string }) {
    this.textShape.attr({ x, y, text });
  }

  public getIcon() {
    return this.iconShape;
  }

  public getType() {
    return get(this.attributes, 'handleType');
  }

  public update(cfg: Partial<IHandleCfg>) {
    const { type: oldType } = get(this.attributes, ['iconCfg', 'type']);
    this.attr(deepMix({}, this.attributes, cfg));
    const { iconCfg, textCfg } = cfg;
    if (iconCfg) {
      const { type } = iconCfg;
      if (oldType !== type) {
        this.clear();
        this.iconShape = this.createHandleIcon();
      } else {
        this.iconShape.attr({ ...iconCfg });
      }
      this.setHandleIconRotation();
    }
    if (textCfg) {
      this.textShape.attr({ ...textCfg });
    }
  }

  /**
   * 创建默认手柄图标
   */
  private createDefaultIcon() {
    const {
      style: { size, ...rest },
    } = get(this.attributes, ['iconCfg']);
    // 默认手柄
    const width = size;
    const height = size * 2.4;

    // 创建默认图形
    const defaultHandle = new Rect({
      name: 'icon',
      style: {
        width,
        height,
        x: -width / 2,
        y: -height / 2,
        radius: size / 4,
        ...rest,
      },
    });
    const { stroke, lineWidth } = rest;
    const X1 = (1 / 3) * width;
    const X2 = (2 / 3) * width;
    const Y1 = (1 / 4) * height;
    const Y2 = (3 / 4) * height;
    const createLine = (x1: number, y1: number, x2: number, y2: number) => {
      return new Line({
        name: 'line',
        style: { x1, y1, x2, y2, stroke, lineWidth },
      });
    };
    defaultHandle.appendChild(createLine(X1, Y1, X1, Y2));
    defaultHandle.appendChild(createLine(X2, Y1, X2, Y2));
    defaultHandle.setOrigin(width / 2, height / 2);
    return defaultHandle;
  }

  private createHandleIcon() {
    const { type, style } = get(this.attributes, ['iconCfg']);
    if (type === 'hide') {
      return new Rect({ style, name: 'icon' });
    }
    if (type === 'symbol') {
      return new Marker({ style, name: 'icon' });
    }
    // type === 'default'
    return this.createDefaultIcon();
  }

  private createHandleText() {
    const { textCfg } = this.attributes;
    return new Text({
      name: 'text',
      style: textCfg,
    });
  }

  private clear() {
    this.iconShape.destroy();
  }

  private setHandleIconRotation() {
    const orient = get(this.attributes, ['iconCfg', 'orient']);
    if (orient === 'vertical') {
      this.iconShape.setLocalEulerAngles(90);
    } else {
      this.iconShape.setLocalEulerAngles(0);
    }
  }
}
