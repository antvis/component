import { Canvas, Path } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Renderer as SvgRenderer } from '@antv/g-svg';
import { createDiv } from './dom';

const canvasRenderer = new CanvasRenderer();

const svgRenderer = new SvgRenderer();

export function createCanvas(size = 300, renderer = 'canvas', grid = false) {
  const canvas = new Canvas({
    container: createDiv(),
    width: size,
    height: size,
    renderer: renderer === 'svg' ? svgRenderer : canvasRenderer,
  });

  if (grid) {
    // append grid
    const path: any = [];
    const gap = size / 25;
    for (let i = 0; i <= size; i += gap) {
      path.push(['M', i, 0], ['L', i, size]);
      path.push(['M', 0, i], ['L', size, i]);
    }
    canvas.appendChild(new Path({ style: { lineWidth: 0.5, stroke: '#ddd', lineDash: [gap / 4, gap / 4], path } }));
  }

  return canvas;
}
