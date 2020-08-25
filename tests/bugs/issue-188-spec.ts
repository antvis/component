import { Canvas } from '@antv/g-canvas';
import { Grid, Axis } from '../../src';

const dom = document.createElement('div');
document.body.appendChild(dom);
dom.id = 'clg';
const canvas = new Canvas({
  container: 'clg',
  width: 500,
  height: 500,
});
const container = canvas.addGroup();

describe('axis 属性支持回调', () => {
  test('grid', () => {
    const grid = new Grid.Line({
      id: 'a',
      container,
      items: [
        {
          points: [
            { x: 20, y: 20 },
            { x: 200, y: 20 },
          ],
        },
        {
          points: [
            { x: 20, y: 40 },
            { x: 200, y: 40 },
          ],
        },
        {
          points: [
            { x: 20, y: 60 },
            { x: 200, y: 60 },
          ],
        },
      ],
      line: {
        style: (item, index, items) => {
          if (index === 0) {
            return {
              stroke: 'red',
            };
          } else if (index === items.length - 1) {
            return {
              stroke: 'green',
            };
          }
          return { stroke: 'yellow' };
        }
      }
    });

    grid.init();
    grid.render();

    // @ts-ignore
    const paths = grid.getContainer().getChildren()[0].getChildren();

    expect(paths[0].attr('stroke')).toBe('red');
    expect(paths[1].attr('stroke')).toBe('yellow');
    expect(paths[2].attr('stroke')).toBe('green');
  });

  test('axis', () => {
    const axis = new Axis.Line({
      animate: false,
      id: 'a',
      container,
      start: { x: 20, y: 100 },
      end: { x: 200, y: 100 },
      ticks: [
        { name: '1', value: 0 },
        { name: '2', value: 0.5 },
        { name: '3', value: 1 },
      ],
      title: {
        text: '标题',
      },
      label: {
        style: (item: string, index: number, items: number) => {
          return {
            stroke: 'red',
          }
        },
      },
      tickLine: {
        style: (item: string, index: number, length: number) => {
          return {
            stroke: 'yellow',
          }
        },
      },
    });

    axis.init();
    axis.render();

    // @ts-ignore
    const labelGroup = axis.getContainer().getChildren()[1].getChildren()[1];
    // @ts-ignore
    const tickLineGroup = axis.getContainer().getChildren()[1].getChildren()[2];

    expect(labelGroup.getChildren()[0].attr('stroke')).toBe('red');
    expect(tickLineGroup.getChildren()[0].attr('stroke')).toBe('yellow');
  });
});
