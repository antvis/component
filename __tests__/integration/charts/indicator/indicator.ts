import { Circle, Group, Text } from '@antv/g';
import { Indicator } from '../../../../src/ui/indicator';
import { createGrid } from '../../utils/grid';
import { deepAssign } from '../../../../src/util';

export const IndicatorDemo = () => {
  const group = new Group({
    style: {
      x: 30,
      y: 30,
    },
  });

  createGrid(group);

  const createIndicator = (args: any) => {
    const style = deepAssign(
      {
        style: {
          x: 50,
          y: 50,
          visibility: 'visible',
          padding: [2, 4],
        },
      },
      args
    );

    const indicator = group.appendChild(
      // @ts-ignore
      new Indicator({ style })
    );

    group.appendChild(
      new Circle({
        style: {
          cx: style.style.x,
          cy: style.style.y,
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

  createIndicator({ style: { labelText: 0.5, position: 'left' } });
  createIndicator({ style: { y: 80, labelText: 78.1, position: 'left' }, formatter: (val: any) => `${val}%` });
  createIndicator({
    style: {
      y: 110,
      labelText: 78.1,
      labelFill: 'black',
      backgroundFill: 'white',
      position: 'left',
    },
    formatter: (val: any) => `${val}%`,
  });
  createIndicator({
    style: {
      y: 140,
      labelText: 78.1,
      position: 'left',
    },
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

  createIndicator({ style: { y: 170, labelText: 0.5, position: 'right' } });
  createIndicator({ style: { y: 200, labelText: 78.1, position: 'right' }, formatter: (val: any) => `${val}%` });
  createIndicator({
    style: {
      y: 230,
      labelText: 78.1,
      labelFill: 'black',
      backgroundFill: 'white',
      position: 'right',
    },
    formatter: (val: any) => `${val}%`,
  });
  createIndicator({
    style: { y: 260, labelText: 78.1, position: 'right' },
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

  createIndicator({ style: { x: 150, labelText: 0.5, position: 'top' } });
  createIndicator({ style: { x: 150, y: 80, labelText: 78.1, position: 'top' }, formatter: (val: any) => `${val}%` });
  createIndicator({
    style: { x: 150, y: 110, labelText: 78.1, labelFill: 'black', backgroundFill: 'white', position: 'top' },
    formatter: (val: any) => `${val}%`,
  });
  createIndicator({
    style: { x: 150, y: 140, labelText: 78.1, position: 'top' },
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

  createIndicator({ style: { x: 150, y: 180, labelText: 0.5, position: 'bottom' } });
  createIndicator({
    style: { x: 150, y: 220, labelText: 78.1, position: 'bottom' },
    formatter: (val: any) => `${val}%`,
  });
  createIndicator({
    style: { x: 150, y: 250, labelText: 78.1, labelFill: 'black', backgroundFill: 'white', position: 'bottom' },
    formatter: (val: any) => `${val}%`,
  });
  const indicator = createIndicator({
    style: { x: 150, y: 290, labelText: 78.1, position: 'bottom', labelFill: 'red' },
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

  indicator.update({ style: { labelText: '12345678' } });

  const mi = createIndicator({ style: { x: 250, y: 100, labelText: 0.5, position: 'bottom' } });

  group.addEventListener('mousemove', (e: any) => {
    console.log(e.offset, e.canvas);
    const { x, y } = e.offset;
    const [dx, dy] = group.getLocalPosition();
    mi.setLocalPosition(x - dx, y - dy);
  });

  return group;
};
