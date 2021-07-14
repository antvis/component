import { Rect, Line } from '@antv/g';
import { Marker } from '../marker';
import { CustomElement, ShapeCfg } from '../../types';

type AttrsType = { [key: string]: any };
type HandleCfg = AttrsType & {
  type: string;
  orient: string;
};

export class Handle extends CustomElement {
  constructor({ attrs, ...rest }: ShapeCfg) {
    super({ type: 'handle', attrs, ...rest });
    const { type, orient, ...handleAttrs } = attrs;
    this.render({ type, orient, handleAttrs });
  }

  public render(handleCfg: HandleCfg) {
    this.removeChildren(true);
    const { type, orient, handleAttrs: attrs } = handleCfg;

    if (type === 'hide') {
      this.appendChild(
        new Rect({
          attrs,
          name: 'handleIcon',
        })
      );
    } else if (type === 'symbol') {
      this.appendChild(
        new Marker({
          // @ts-ignore
          attrs,
          name: 'handleIcon',
        })
      );
    } else {
      const { size, ...rest } = attrs;
      const width = size;
      const height = size * 2.4;

      // 创建默认图形
      const defaultHandle = new Rect({
        name: 'handleIcon',
        attrs: {
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
          attrs: {
            x1,
            y1,
            x2,
            y2,
            stroke,
            lineWidth,
          },
        });
      };
      defaultHandle.appendChild(createLine(X1, Y1, X1, Y2));
      defaultHandle.appendChild(createLine(X2, Y1, X2, Y2));
      // 根据orient进行rotate
      if (orient === 'vertical') {
        defaultHandle.setOrigin(width / 2, height / 2);
        defaultHandle.rotate(90);
      }
      this.appendChild(defaultHandle);
    }
  }

  attributeChangedCallback(name: string, value: any) {
    if (name === 'handleCfg') {
      this.render(value);
    }
  }
}
