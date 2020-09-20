import { Canvas } from '@antv/g-canvas';
import { Axis } from '../../src/index';

describe('axis title spacing', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  const canvas = new Canvas({
    container: dom,
    width: 600,
    height: 600,
  });

  const axis = new Axis.Line({
    animate: false,
    id: 'a',
    container: canvas.addGroup(),
    updateAutoRender: true,
    start: { x: 50, y: 400 },
    end: { x: 50, y: 50 },
    ticks: [
      { name: '1', value: 0 },
      { name: '2', value: 0.5 },
      { name: '3', value: 1 },
    ],
    title: {
      text: '标题',
    },
    theme: {
      label: {
        style: {
          fill: 'red'
        }
      }
    },
    label: {
      style: (val) => {
        return {
          text: val + '@'
        }
      }
    }
  });
  axis.init();
  axis.render();

  it('render', () => {
    const labelShapes = axis.getElementsByName('axis-label');
    expect(labelShapes[0].attr('fill')).toBe('red');
    expect(labelShapes[0].attr('text')).toBe('1@');
  });
});
