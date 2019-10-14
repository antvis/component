
import {Canvas} from '@antv/g-canvas';
import LineAxis from '../../../src/axis/line';
import {getMatrixByAngle} from '../../../src/util/matrix';
import {isNumberEqual} from '@antv/util';

describe('test line axis', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cal';
  const canvas = new Canvas({
    container: 'cal',
    width: 500,
    height: 500
  });
  const container = canvas.addGroup();
  const axis = new LineAxis({
    animate: false,
    id: 'a',
    container,
    start: {x: 50, y: 400},
    end: {x: 50, y: 50},
    ticks: [
      {name: '1', value: 0},
      {name: '2', value: 0.5},
      {name: '3', value: 1}
    ],
    title: {
      text: '标题'
    }
  });

  it('init', () => {
    expect(axis.get('name')).toBe('axis');
    expect(axis.get('type')).toBe('line');
    expect(axis.getLocationRange()).toEqual({
      start: {x: 50, y: 400},
      end: {x: 50, y: 50}
    });
  });

  it('render', () => {
    axis.render();
    const line = axis.getElementById('a-axis-line');
    expect(line.attr('path')).toEqual([['M', 50, 400], ['L', 50, 50]]);

    const tickLine1 = axis.getElementById('a-axis-tickline-1');
    expect(tickLine1.attr('x1')).toBe(50);
    expect(tickLine1.attr('x2')).toBe(45);
    expect(tickLine1.attr('y1')).toBe(400);

    const label1 = axis.getElementById('a-axis-label-1');
    expect(label1).not.toBe(undefined);
    expect(label1.attr('x')).toBe(40);
    expect(label1.attr('y')).toBe(400);
    expect(label1.attr('textAlign')).toBe('end');

    const title = axis.getElementById('a-axis-title');
    expect(title.attr('matrix')).not.toBe(null);
  });

  it('update label', () => {
    const label1 = axis.getElementById('a-axis-label-1');
    expect(label1.attr('textAlign')).toBe('end');
    expect(label1.attr('matrix')).toBe(null);
    const angle = Math.PI / 4;
    axis.update({
      label: {
        rotate: Math.PI / 4,
        style: {
          textAlign: 'center'
        }
      }
    });
    expect(label1.attr('textAlign')).toBe('center');
    expect(label1.attr('matrix')).toEqual(getMatrixByAngle({x: 40, y: 400}, angle));
  });

  it('update title', () => {
    const title = axis.getElementById('a-axis-title');
    axis.update({
      title: {
        autoRotate: false
      }
    });
    expect(title.attr('matrix')).toBe(null);
    // 不再显示 title
    axis.update({
      title: null
    });
    expect(title.destroyed).toBe(true);
    expect(axis.getElementById('a-axis-title')).toBe(undefined);
    axis.update({
      title: {
        text: 'aaa'
      }
    });
    const newTitle = axis.getElementById('a-axis-title');
    expect(newTitle.attr('text')).toBe('aaa');
    expect(newTitle.attr('matrix')).not.toBe(null);
  });

  it('update line', () => {
    axis.update({
      line: null
    });
    expect(axis.getElementById('a-axis-line')).toBe(undefined);
    axis.update({
      line: {
        style: {
          lineDash: [2, 2]
        }
      }
    });
    expect(axis.getElementById('a-axis-line').attr('lineDash')).toEqual([2, 2]);
  });

  it('update tickline', () => {
    const tickLine1 = axis.getElementById('a-axis-tickline-1');
    axis.update({
      tickLine: null
    });
    expect(tickLine1.destroyed).toBe(true);
    axis.update({
      tickLine: {
        length: 6
      }
    });
    const newTickLine = axis.getElementById('a-axis-tickline-1');
    expect(newTickLine.attr('x2')).toBe(44);
  });

  it('update ticks', () => {
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup.getChildren().length).toBe(3);
    axis.update({
      ticks: []
    });
    expect(labelGroup.getChildren().length).toBe(0);
    axis.update({
      ticks:  [
        {name: '1', value: 0},
        {name: '2', value: 0.25},
        {name: '3', value: 0.5},
        {name: '4', value: 1},
      ]
    });
    expect(labelGroup.getChildren().length).toBe(4);
  });

  it('verticalFactor', () => {
    axis.update({
      verticalFactor: -1,
      tickLine: {
        length: 5
      }
    });
    const tickLine1 = axis.getElementById('a-axis-tickline-1');
    expect(tickLine1.attr('x1')).toBe(50);
    expect(tickLine1.attr('x2')).toBe(55);
    expect(tickLine1.attr('y1')).toBe(400);
  });

  it('clear', () => {
    axis.clear();
    expect(axis.getElementById('a-axis-label-group')).toBe(undefined);
    expect(axis.getElementById('a-axis-title')).toBe(undefined);
  });

  it('rerender', () => {
    axis.render();
    expect(axis.getElementById('a-axis-label-group')).not.toBe(undefined);
    expect(axis.getElementById('a-axis-title')).not.toBe(undefined);
  });

  it('update start end', () => {
    axis.update({
      start: {
        x: 50,
        y: 50
      },
      end: {
        x: 400,
        y: 50
      }
    });
    const title = axis.getElementById('a-axis-title');
    const matrix = title.attr('matrix');
    const m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    m.forEach((v, index) => {
      expect(isNumberEqual(v, matrix[index])).toBe(true);
    });
  });
  it('udate subticks', () => {
    expect(axis.getElementById('a-axis-sub-tickline-1-0')).toBe(undefined);

    axis.update({
      line: {
        style: {
        }
      },
      subTickLine: {

      }
    });
    expect(axis.getElementById('a-axis-sub-tickline-1-0')).not.toBe(undefined);
  });
  it('set location', () => {
    axis.setLocationRange({
      start: {x: 50, y: 400},
      end: {x: 50, y: 50}
    });

    expect(axis.get('start')).toEqual({x: 50, y: 400});
    expect(axis.get('end')).toEqual({x: 50, y: 50});
  });
  it('destroy', () => {
    axis.destroy();
    expect(axis.destroyed).toEqual(true);
  });
  
  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});
