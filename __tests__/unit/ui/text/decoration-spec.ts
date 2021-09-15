import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Decoration } from '../../../../src/ui/text/decoration';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 500,
  height: 500,
  renderer,
});

const decoration = new Decoration({
  style: {
    x: 0,
    y: 0,
    width: 200,
    height: 20,
    fontSize: 12,
    type: ['line-through'],
  },
});

canvas.appendChild(decoration);

describe('text', () => {
  test('basic', () => {
    expect(decoration.children.length).toBe(1);
    const line = decoration.children[0];
    expect(line.attributes.path).toStrictEqual([
      ['M', 0, 0.55 * 20],
      ['L', 200, 0.55 * 20],
    ]);
    expect(line.attributes.lineDash).toStrictEqual([0, 0]);
  });

  test('update', () => {
    decoration.update({
      type: [['underline', 'double']],
    });
    expect(decoration.children.length).toBe(1);
    const line = decoration.children[0];
    expect(line.attributes.path).toStrictEqual([
      // 悬挂率 0.5 * 高度 20  + 字号 12 / 2 + 线宽
      ['M', 0, 0.5 * 20 + 12 / 2],
      ['L', 200, 0.5 * 20 + 12 / 2],
      ['M', 0, 0.5 * 20 + 12 / 2 + 2],
      ['L', 200, 0.5 * 20 + 12 / 2 + 2],
    ]);
  });

  test('multi line', () => {
    decoration.update({
      type: [['underline', 'double'], 'line-through', 'overline'],
    });
    expect(decoration.children.length).toBe(3);
  });
});
