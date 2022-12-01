import { Group, Circle, Text } from '@antv/g';
import { axisWarper, data } from '../../utils';
import { Indicator } from '../../../../src/ui/indicator';
import { createGrid } from '../../utils/grid';
import { Axis } from '../../../../src/ui/axis';

export const IndicatorDemo = () => {
  const group = new Group({
    style: {
      x: 30,
      y: 30,
    },
  });

  createGrid(group);

  const createIndicator = (args: any) => {
    const style = {
      x: 50,
      y: 50,
      visibility: 'visible',
      padding: [2, 4],
      ...args,
    };

    const indicator = group.appendChild(
      // @ts-ignore
      new Indicator({ style })
    );

    group.appendChild(
      new Circle({
        style: {
          cx: style.x,
          cy: style.y,
          r: 2,
          fill: 'red',
        },
      })
    );

    return indicator;
  };

  const addText = (x: number, y: number, text: string) => {
    group.appendChild(
      new Text({
        style: {
          x: 0,
          y: 30,
          text: 'left',
          fill: 'red',
        },
      })
    );
  };

  addText(0, 30, 'left');

  createIndicator({ value: 0.5, position: 'left' });
  createIndicator({ y: 80, value: 78.1, formatter: (val: any) => `${val}%`, position: 'left' });
  createIndicator({
    y: 110,
    value: 78.1,
    labelFill: 'black',
    backgroundFill: 'white',
    formatter: (val: any) => `${val}%`,
    position: 'left',
  });
  createIndicator({
    y: 140,
    value: 78.1,
    position: 'left',
    formatter: (val: any) => {
      const g = new Group();
      g.appendChild(
        new Circle({
          style: {
            r: 6,
            fill: 'orange',
          },
        })
      );
      g.appendChild(
        new Text({
          style: {
            x: 12,
            text: '123',
          },
        })
      );
      return g;
    },
  });

  addText(0, 170, 'right');

  createIndicator({ y: 170, value: 0.5, position: 'right' });
  createIndicator({ y: 200, value: 78.1, formatter: (val: any) => `${val}%`, position: 'right' });
  createIndicator({
    y: 230,
    value: 78.1,
    labelFill: 'black',
    backgroundFill: 'white',
    formatter: (val: any) => `${val}%`,
    position: 'right',
  });
  createIndicator({
    y: 260,
    value: 78.1,
    position: 'right',
    formatter: (val: any) => {
      const g = new Group();
      g.appendChild(
        new Circle({
          style: {
            r: 6,
            fill: 'orange',
          },
        })
      );
      g.appendChild(
        new Text({
          style: {
            x: 12,
            text: '123',
          },
        })
      );
      return g;
    },
  });

  addText(100, 50, 'top');

  createIndicator({ x: 150, value: 0.5, position: 'top' });
  createIndicator({ x: 150, y: 80, value: 78.1, formatter: (val: any) => `${val}%`, position: 'top' });
  createIndicator({
    x: 150,
    y: 110,
    value: 78.1,
    labelFill: 'black',
    backgroundFill: 'white',
    formatter: (val: any) => `${val}%`,
    position: 'top',
  });
  createIndicator({
    x: 150,
    y: 140,
    value: 78.1,
    position: 'top',
    formatter: (val: any) => {
      const g = new Group();
      g.appendChild(
        new Circle({
          style: {
            r: 6,
            fill: 'orange',
          },
        })
      );
      g.appendChild(
        new Text({
          style: {
            x: 12,
            text: '123',
          },
        })
      );
      return g;
    },
  });

  addText(200, 180, 'bottom');

  createIndicator({ x: 150, y: 180, value: 0.5, position: 'bottom' });
  createIndicator({ x: 150, y: 220, value: 78.1, formatter: (val: any) => `${val}%`, position: 'bottom' });
  createIndicator({
    x: 150,
    y: 250,
    value: 78.1,
    labelFill: 'black',
    backgroundFill: 'white',
    formatter: (val: any) => `${val}%`,
    position: 'bottom',
  });
  const indicator = createIndicator({
    x: 150,
    y: 290,
    value: 78.1,
    position: 'bottom',
    labelFill: 'red',
    formatter: (val: any) => {
      const g = new Group();
      g.appendChild(
        new Circle({
          style: {
            r: 6,
            fill: 'orange',
          },
        })
      );
      g.appendChild(
        new Text({
          style: {
            x: 12,
            text: val.toString(),
          },
        })
      );
      return g;
    },
  });

  indicator.attr('value', '12345678');

  const mi = createIndicator({ x: 250, y: 100, value: 0.5, position: 'bottom' });

  group.addEventListener('mousemove', (e: any) => {
    console.log(e.offset, e.canvas);
    const { x, y } = e.offset;
    const [dx, dy] = group.getLocalPosition();
    mi.setLocalPosition(x - dx, y - dy);
  });

  return group;
};
