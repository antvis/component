import { Canvas } from '@antv/g-canvas';
import PathAnnotation from '../../../src/annotation/path';

describe('test path annotation', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'container';
  const canvas = new Canvas({
    container: 'container',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();
  const path = new PathAnnotation({
    id: 'p',
    container,
    updateAutoRender: true,
    path: [
      ['M', 100, 100 ],
      ['L', 200, 200 ],
      ['L', 400, 200 ],
      ['Z']
    ],
    style: {
      stroke: 'yellow',
      lineWidth: 2,
      fill: 'rgba(0,0,0,0.4)'
    }
  });

  it('init', () => {
    path.init();
    expect(path.get('name')).toBe('annotation');
    expect(path.get('type')).toBe('path');
  });

  it('render', () => {
    path.render();
    const pathShape = path.getElementById('p-annotation-path');
    expect(pathShape.attr('path')).toEqual([
      ['M', 100, 100 ],
      ['L', 200, 200 ],
      ['L', 400, 200 ],
      ['Z']
    ]);
  });

  it('update text', () => {
    path.update({
      path: [
        ['M', 100, 100 ],
        ['L', 200, 200 ],
        ['L', 100, 200 ],
        ['Z']
      ],
    });
    const pathShape = path.getElementById('p-annotation-path');
    expect(pathShape.attr('path')).toEqual([
      ['M', 100, 100 ],
      ['L', 200, 200 ],
      ['L', 100, 200 ],
      ['Z']
    ]);
  });
  
  it('destroy', () => {
    path.destroy();
    expect(path.destroyed).toBe(true);
  });

  afterAll(() => {
    canvas.destroy();
    dom.remove();
  });
});

