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
    start: { x: 50, y: 100 },
    end: { x: 50, y: 50 },
    ticks: [
      { name: '1', value: 0 },
      { name: '2', value: 0.2 },
      { name: '3', value: 0.4 },
      { name: '4', value: 0.6 },
      { name: '5', value: 0.8 },
      { name: '6', value: 1 },
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
      style: (val, index) => {
        return {
          text: index % 2 !== 0 ? val + '@' : val,
        }
      }
    },
    tickLine: {
      style: (item, index) => {
        return {
          stroke: index % 2 !== 0 ? 'red' : '#000',
        }
      }
    }
  });
  axis.init();
  axis.render();

  it('render', () => {
    const labelShapes = axis.getElementsByName('axis-label');
    expect(labelShapes.length).toBe(6);

    const label2 = labelShapes.find(shape => shape.get('id') === 'a-axis-label-2')
    const label3 = labelShapes.find(shape => shape.get('id') === 'a-axis-label-3')
    expect(label2.attr('fill')).toBe('red');
    expect(label2.attr('text')).toBe('2@');
    expect(label3.attr('fill')).toBe('red');
    expect(label3.attr('text')).toBe('3');

    // const tickLineShapes = axis.getElementsByName('axis-tickLine');
    // expect(tickLineShapes.length).toBe(6);
    // const tickLine2 = tickLineShapes.find(shape => shape.get('id') === 'a-axis-tickline-2')
    // const tickLine3 = tickLineShapes.find(shape => shape.get('id') === 'a-axis-tickline-3')
    // expect(tickLine2.attr('stroke')).toBe('red');
    // expect(tickLine3.attr('stroke')).toBe('#000');
  });

  it('processOverlap', () => {
    axis.update({
      label: {
        autoHide: true,
        style: (val, index) => {
          return {
            text: index % 2 !== 0 ? val + '@' : val,
          }
        }
      }
    });

    const labelShapes = axis.getElementsByName('axis-label');
    expect(labelShapes.length).toBe(3);

    const label2 = labelShapes.find(shape => shape.get('id') === 'a-axis-label-2')
    const label3 = labelShapes.find(shape => shape.get('id') === 'a-axis-label-3')
    expect(label2).toBeUndefined();
    expect(label3.attr('fill')).toBe('red');
    expect(label3.attr('text')).toBe('3@');

    // const tickLineShapes = axis.getElementsByName('axis-tickLine');
    // expect(tickLineShapes.length).toBe(3);
    // const tickLine2 = tickLineShapes.find(shape => shape.get('id') === 'a-axis-tickline-2')
    // const tickLine3 = tickLineShapes.find(shape => shape.get('id') === 'a-axis-tickline-3')
    // expect(tickLine2).toBeUndefined();
    // expect(tickLine3.attr('stroke')).toBe('red');
  });
});
