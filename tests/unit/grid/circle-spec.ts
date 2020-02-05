import { Canvas } from '@antv/g-canvas';
import { each } from '@antv/util';
import CircleGrid from '../../../src/grid/circle';
function getCirclePoint(center, angle, radius) {
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  };
}
function getPoints(center, count, radius) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * Math.PI * 2) / count;
    points.push(getCirclePoint(center, angle, radius));
  }
  return points;
}

describe('test circle grid', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'ccg';
  const canvas = new Canvas({
    container: 'ccg',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  // 根据圆心和半径获取点

  function getPath(points, closed) {
    const path = [];
    each(points, (point, index) => {
      if (index === 0) {
        path.push(['M', point.x, point.y]);
      } else {
        path.push(['L', point.x, point.y]);
      }
    });
    if (closed) {
      path.push(['Z']);
    }
    return path;
  }
  const center = { x: 100, y: 100 };
  const points1 = getPoints(center, 4, 20);
  const points2 = getPoints(center, 4, 40);
  const points3 = getPoints(center, 4, 60);
  const grid = new CircleGrid({
    container,
    center,
    updateAutoRender: true,
    id: 'b',
    items: [{ points: points1 }, { points: points2 }, { points: points3 }, { points: getPoints(center, 4, 80) }],
  });

  it('init', () => {
    grid.init();
    expect(grid.get('name')).toBe('grid');
    expect(grid.get('type')).toBe('circle');
  });

  it('render', () => {
    grid.render();
    expect(grid.get('group').getChildren().length).toBe(4);

    const line0 = grid.getElementById('b-grid-line-0');
    expect(line0.attr('path')).toEqual(getPath(points1, true));
  });

  it('update alternate color', () => {
    expect(grid.getElementById('b-grid-region-1')).toBe(undefined);
    grid.update({
      alternateColor: '#ccc',
    });
    expect(grid.getElementById('b-grid-region-1')).toBe(undefined);
    expect(grid.getElementById('b-grid-region-2').attr('fill')).toBe('#ccc');
    const path = grid.getElementById('b-grid-region-2').attr('path');
    const path2 = getPath(points2, true);
    const path3 = getPath(points3.slice(0).reverse(), true);
    expect(path).toEqual(path2.concat(path3));
  });

  it('update closed', () => {
    grid.update({
      alternateColor: '#ccc',
      closed: false,
    });
    const line0 = grid.getElementById('b-grid-line-0');
    expect(line0.attr('path')).toEqual(getPath(points1, false));
    expect(grid.getElementById('b-grid-region-2').attr('fill')).toBe('#ccc');
    grid.update({
      alternateColor: ['red', 'blue'],
      closed: true,
    });
    expect(line0.attr('path')).toEqual(getPath(points1, true));
    expect(grid.getElementById('b-grid-region-1').attr('fill')).toBe('red');
    expect(grid.getElementById('b-grid-region-2').attr('fill')).toBe('blue');
    grid.update({
      alternateColor: null,
    });
    expect(grid.getElementById('b-grid-region-1')).toBe(undefined);
    expect(grid.getElementById('b-grid-region-2')).toBe(undefined);
  });

  it('update line', () => {
    grid.update({
      line: {
        style: {
          stroke: 'red',
        },
      },
    });
    const line0 = grid.getElementById('b-grid-line-0');
    expect(line0.attr('stroke')).toBe('red');
    grid.update({
      line: {},
    });
    expect(line0.attr('stroke')).not.toBe('red');
  });

  it('line type circle', () => {
    grid.update({
      line: {
        type: 'circle',
      },
      closed: true,
    });
    const line0 = grid.getElementById('b-grid-line-0');
    expect(line0.attr('path')).toEqual([
      ['M', 100, 80],
      ['A', 20, 20, 0, 0, 1, 100, 120],
      ['A', 20, 20, 0, 0, 1, 100, 80],
      ['Z'],
    ]);
    grid.update({
      closed: false,
    });
    const line2 = grid.getElementById('b-grid-line-2');
    const path = line2.attr('path');
    expect(path.length).toBe(4);
    expect(path[path.length - 1]).not.toEqual(['Z']);
  });

  it('line type circle and alternateColor', () => {
    grid.update({
      line: {
        type: 'circle',
      },
      alternateColor: '#ccc',
      closed: true,
    });
    const region = grid.getElementById('b-grid-region-2');
    expect(region).not.toBe(undefined);
    expect(region.attr('path').length).toBe(8);
    grid.update({
      closed: false,
    });
    expect(region.attr('path').length).toBe(9);
  });

  it('update items', () => {
    grid.update({
      alternateColor: null,
      line: {
        type: 'line',
      },
      items: [
        { points: getPoints(center, 6, 20) },
        { points: getPoints(center, 6, 50) },
        { points: getPoints(center, 6, 80) },
      ],
      closed: true,
    });
    expect(grid.get('group').getChildren().length).toBe(3);
    const line0 = grid.getElementById('b-grid-line-0');
    expect(line0.attr('path')).toEqual(getPath(getPoints(center, 6, 20), true));
    grid.update({
      alternateColor: '#ccc',
    });
    const region = grid.getElementById('b-grid-region-2');
    expect(region).not.toBe(undefined);
    expect(region.attr('path').length).toBe(14);
  });

  it('clear', () => {
    grid.clear();
    expect(grid.get('group').getChildren().length).toBe(0);
  });

  it('rerender', () => {
    grid.update({
      alternateColor: null,
    });
    expect(grid.get('group').getChildren().length).toBe(grid.get('items').length);
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
