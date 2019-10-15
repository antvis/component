import {Canvas} from '@antv/g-canvas';
import LineGrid from '../../../src/grid/line';

describe('test line grid', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'clg';
  const canvas = new Canvas({
    container: 'clg',
    width: 500,
    height: 500
  });
  const container = canvas.addGroup();
  const grid = new LineGrid({
    id: 'a',
    container,
    items: [
      {points: [{x: 20, y: 20}, {x: 200, y: 20}]},
      {points: [{x: 20, y: 60}, {x: 200, y: 60}]},
      {points: [{x: 20, y: 100}, {x: 200, y: 100}]}
    ]
  });

  it('init', () => {
    expect(grid.get('name')).toBe('grid');
    expect(grid.get('type')).toBe('line');
    expect(grid.get('group').get('capture')).toBe(false);
  });

  it('render', () => {
    grid.render();
    const line0 = grid.getElementById('a-grid-line-0');
    expect(line0.attr('path')).toEqual([['M', 20, 20], ['L', 200, 20]]);
  });

  it('update line', () => {
    grid.update({
      line: null
    });
    expect(grid.getElementById('a-grid-line-0')).toBe(undefined);
    grid.update({
      line: {
        style: {
          lineDash: [2, 2]
        }
      }
    });
    const line0 = grid.getElementById('a-grid-line-0');
    expect(line0.attr('lineDash')).toEqual([2, 2]);
  });

  it('update alternate color', () => {
    expect(grid.getElementById('a-grid-region-1')).toBe(undefined);
    grid.update({
      alternateColor: '#ccc'
    });
    
    expect(grid.getElementById('a-grid-region-1')).toBe(undefined);
    const region = grid.getElementById('a-grid-region-2');
    expect(region.attr('path')).toEqual([['M', 20, 60], ['L', 200, 60], ['L', 200, 100],['L', 20, 100], ['Z']]);
    grid.update({
      alternateColor: ['red', 'blue']
    });
    expect(grid.getElementById('a-grid-region-1').attr('fill')).toBe('red');
    expect(grid.getElementById('a-grid-region-2').attr('fill')).toBe('blue');
    grid.update({
      alternateColor: null
    });
    expect(grid.getElementById('a-grid-region-1')).toBe(undefined);
    expect(grid.getElementById('a-grid-region-2')).toBe(undefined);
  });

  it('update items', () => {
    grid.update({
      items: [
        {points: [{x: 20, y: 20}, {x: 200, y: 20}, {x: 300, y: 30}]},
        {points: [{x: 20, y: 40}, {x: 200, y: 40}, {x: 300, y: 50}]},
        {points: [{x: 20, y: 60}, {x: 200, y: 60}, {x: 300, y: 70}]},
      ]
    });
    expect(grid.getElementById('a-grid-line-0').attr('path')).toEqual([['M', 20, 20], ['L', 200, 20], ['L', 300, 30]]);
    grid.update({
      alternateColor: '#ccc'
    });
    expect(grid.getElementById('a-grid-region-2').attr('path')).toEqual([
      ['M', 20, 40], ['L', 200, 40], ['L', 300, 50],
      ['L', 300, 70], ['L', 200, 60], ['L', 20, 60],['Z']
    ]);
  });

  it('clear', () => {
    grid.clear();
    expect(grid.getElementById('a-grid-line-0')).toBe(undefined);
  });

  it('rerender', () => {
    grid.render();
    expect(grid.getElementById('a-grid-line-0')).not.toBe(undefined);
  });

  it('destroy', () => {
    grid.destroy();
    expect(grid.destroyed).toBe(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});