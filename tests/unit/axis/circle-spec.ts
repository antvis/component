import {Canvas} from '@antv/g-canvas';
import CircleAxis from '../../../src/axis/circle';

describe('test line axis', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'ccl';
  const canvas = new Canvas({
    container: 'ccl',
    width: 500,
    height: 500
  });

  const container = canvas.addGroup();
  const axis = new CircleAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    center: {x: 200, y: 200},
    radius: 100,
    ticks: [
      {name: '1', value: 0},
      {name: '2', value: 1/3},
      {name: '3', value: 2/3}
    ]
  });

  it('init', () => {
    expect(axis.get('name')).toBe('axis');
    expect(axis.get('type')).toBe('circle');
  });

  it('render', () => {
    axis.render();
    const line = axis.getElementById('a-axis-line');
    expect(line.attr('path')).toEqual([
      ['M', 200, 100],
      ['A', 100, 100, 0, 1, 1, 200, 300],
      ['A', 100, 100, 0, 1, 1, 200, 100],
      ['Z']
    ]);
    const tickLine = axis.getElementById('a-axis-tickline-1');
    expect(tickLine.attr('x1')).toBe(200);
    expect(tickLine.attr('y1')).toBe(100);
    expect(tickLine.attr('x2')).toBe(200);
    expect(tickLine.attr('y2')).toBe(95);

    // 测试文本的对齐方式
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup.getChildren().length).toBe(3);
    const label3 = axis.getElementById('a-axis-label-3');
    expect(label3.attr('textAlign')).toBe('end');
    const label2 = axis.getElementById('a-axis-label-2');
    expect(label2.attr('textAlign')).toBe('start');
    const label1 = axis.getElementById('a-axis-label-1');
    expect(label1.attr('textAlign')).toBe('center');
  });

  it('update label', () => {
    axis.update({
      label: null
    });
    expect(axis.getElementById('a-axis-label-group')).toBe(undefined);
    axis.update({
      label: {
        formatter: (v) => {
          return v + '%';
        }
      }
    });
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup.getChildren().length).toBe(3);
    const label1 = axis.getElementById('a-axis-label-1');
    expect(label1.attr('text')).toBe('1%');
  });

  it('update title', () => {
    expect(axis.getElementById('a-axis-title')).toBeUndefined();
    axis.update({
      title: {
        offset: 10,
        text: 'circle'
      }
    });
    expect(axis.getElementById('a-axis-title')).not.toBeUndefined();
    axis.update({
      title: null
    });
    expect(axis.getElementById('a-axis-title')).toBeUndefined();
  });

  it('update center, radius', () => {
    axis.update({
      center: {x: 300, y: 300}
    });
    const tickLine = axis.getElementById('a-axis-tickline-1');
    expect(tickLine.attr('x1')).toBe(300);
    expect(tickLine.attr('y1')).toBe(200);
    expect(tickLine.attr('x2')).toBe(300);
    expect(tickLine.attr('y2')).toBe(195);
    axis.update({
      radius: 80
    });

    expect(tickLine.attr('x1')).toBe(300);
    expect(tickLine.attr('y1')).toBe(220);
    expect(tickLine.attr('x2')).toBe(300);
    expect(tickLine.attr('y2')).toBe(215);
    axis.update({
      center: {x: 200, y: 200},
      radius: 100
    });
    expect(tickLine.attr('x1')).toBe(200);
    expect(tickLine.attr('y1')).toBe(100);
    expect(tickLine.attr('x2')).toBe(200);
    expect(tickLine.attr('y2')).toBe(95);
  });

  it('update angle', () => {
    axis.update({
      startAngle: 0,
      endAngle: Math.PI
    });
    const line = axis.getElementById('a-axis-line');
    expect(line.attr('path')).toEqual([
      ["M", 200, 200],
      ["L", 300, 200],
      ["A", 100, 100, 0, 0, 1, 100, 200],
      ["L", 200, 200]
    ]);

    axis.update({
      startAngle: 0,
      endAngle: Math.PI / 2
    });
    expect(line.attr('path')).toEqual([
      ["M", 200, 200],
      ["L", 300, 200],
      ["A", 100, 100, 0, 0, 1, 200, 300],
      ["L", 200, 200]
    ]);
  });

  it('update ticks', () => {
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup.getChildren().length).toBe(3);
    axis.update({
      ticks: [
        {name: '1', value: 0},
        {name: '2', value: 0.25},
        {name: '3', value: 0.5},
        {name: '4', value: 0.75},
        {name: '5', value: 1}
      ]
    });
    expect(labelGroup.getChildren().length).toBe(5);
  });

  it('verticalFactor', () => {
    axis.update({
      startAngle: 0,
      endAngle: Math.PI * 2, 
      verticalFactor: -1
    });
    const tickLine = axis.getElementById('a-axis-tickline-1');
    expect(tickLine.attr('x1')).toBe(300);
    expect(tickLine.attr('y1')).toBe(200);
    expect(tickLine.attr('x2')).toBe(295);
    expect(tickLine.attr('y2')).toBe(200);
  });

  it('clear', () => {
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup).not.toBe(undefined);
    axis.clear();
    expect(labelGroup.destroyed).toBe(true);
    expect(axis.getElementById('a-axis-label-group')).toBe(undefined);
  });

  it('rerender', () => {
    axis.render();
    expect(axis.getElementById('a-axis-label-group')).not.toBe(undefined);
  });

  it('destroy', () => {
    const labelGroup = axis.getElementById('a-axis-label-group');
    axis.destroy();
    expect(axis.destroyed).toBe(true);
    expect(labelGroup.destroyed).toBe(true);
    expect(container.getChildren().length).toBe(0);
  });
  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});