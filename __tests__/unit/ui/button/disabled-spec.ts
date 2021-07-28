import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Button } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('disabled button', () => {
  test('disable', async () => {
    const div = createDiv();

    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      attrs: {
        x: 50,
        y: 40,
        text: 'hoverStyle',
        textStyle: {
          fill: '#abc',
          fontSize: 20,
          fontWeight: 'bold',
          fontFamily: 'Helvetica',
          textAlign: 'right',
          textBaseline: 'top',
        },
        buttonStyle: {
          width: 150,
          height: 40,
          fill: 'pink',
          opacity: 0.5,
          stroke: '#666',
          lineWidth: 5,
          radius: 10,
          lineDash: [6, 10],
        },
        disabled: true,
      },
    });

    const rect = button.firstChild;
    const { fill, stroke } = rect.attributes;
    expect(fill).toBe('#f5f5f5');
    expect(stroke).toBe('#d9d9d9');

    const text = button.lastChild;
    expect(text.attributes.fill).toBe('#b8b8b8');

    canvas.appendChild(button);
  });
});
