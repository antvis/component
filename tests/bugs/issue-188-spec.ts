import { Canvas } from '@antv/g-canvas';
import { Grid } from '../../src';

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
      updateAutoRender: false,
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
        style: (item, index, length) => {
          if (index === 0) {
            return {
              stroke: 'red',
            };
          } else if (index === length - 1) {
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
});
