import { Circle, Group } from '@antv/g';
import { Text } from '../../../../src/shapes';
import { Indicator } from '../../../../src/ui/indicator';
import { createGrid } from '../../utils/grid';

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
    const indicator = group.appendChild(new Indicator({ style }));

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

  createIndicator({ labelText: 0.5, position: 'left' });
  createIndicator({ y: 80, labelText: 78.1, position: 'left', formatter: (val: any) => `${val}%` });
  createIndicator({
    y: 110,
    labelText: 78.1,
    labelFill: 'black',
    backgroundFill: 'white',
    position: 'left',
    formatter: (val: any) => `${val}%`,
  });
  createIndicator({
    y: 140,
    labelText: 78.1,
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

  createIndicator({ y: 170, labelText: 0.5, position: 'right' });
  createIndicator({ y: 200, labelText: 78.1, position: 'right', formatter: (val: any) => `${val}%` });
  createIndicator({
    y: 230,
    labelText: 78.1,
    labelFill: 'black',
    backgroundFill: 'white',
    position: 'right',
    formatter: (val: any) => `${val}%`,
  });
  createIndicator({
    y: 260,
    labelText: 78.1,
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

  createIndicator({ x: 150, labelText: 0.5, position: 'top' });
  createIndicator({ x: 150, y: 80, labelText: 78.1, position: 'top', formatter: (val: any) => `${val}%` });
  createIndicator({
    x: 150,
    y: 110,
    labelText: 78.1,
    labelFill: 'black',
    backgroundFill: 'white',
    position: 'top',
    formatter: (val: any) => `${val}%`,
  });
  createIndicator({
    x: 150,
    y: 140,
    labelText: 78.1,
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

  createIndicator({ x: 150, y: 180, labelText: 0.5, position: 'bottom' });
  createIndicator({
    x: 150,
    y: 220,
    labelText: 78.1,
    position: 'bottom',
    formatter: (val: any) => `${val}%`,
  });
  createIndicator({
    x: 150,
    y: 250,
    labelText: 78.1,
    labelFill: 'black',
    backgroundFill: 'white',
    position: 'bottom',
    formatter: (val: any) => `${val}%`,
  });
  const indicator = createIndicator({
    x: 150,
    y: 290,
    labelText: 78.1,
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

  indicator.update({ labelText: '12345678' });

  const mi = createIndicator({ x: 250, y: 100, labelText: 0.5, position: 'bottom' });

  group.addEventListener('mousemove', (e: any) => {
    console.log(e.offset, e.canvas);
    const { x, y } = e.offset;
    const [dx, dy] = group.getLocalPosition();
    mi.setLocalPosition(x - dx, y - dy);
  });

  return group;
};
