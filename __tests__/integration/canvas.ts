import type { DisplayObject } from '@antv/g';
import { Canvas, CanvasEvent, resetEntityCounter } from '@antv/g';
import { Renderer } from '@antv/g-svg';
import { OffscreenCanvasContext, measureText } from './utils/offscreen-canvas-context';
import { setMockMeasureTextWidth } from '../../src';

export function createGCanvas(width: number, height: number) {
  resetEntityCounter();
  setMockMeasureTextWidth(measureText);

  const dom = document.createElement('div') as any;
  const offscreenNodeCanvas = {
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
  const context = new OffscreenCanvasContext(offscreenNodeCanvas);

  // Create a renderer, unregister plugin relative to DOM.
  const renderer = new Renderer();
  // Remove html plugin to ssr.
  const htmlRendererPlugin = renderer.getPlugin('html-renderer');
  renderer.unregisterPlugin(htmlRendererPlugin);
  const domInteractionPlugin = renderer.getPlugin('dom-interaction');
  renderer.unregisterPlugin(domInteractionPlugin);

  return new Canvas({
    container: dom as unknown as HTMLElement,
    width,
    height,
    renderer,
    document: dom.ownerDocument,
    offscreenCanvas: offscreenNodeCanvas as any,
  });
}

export function sleep(n: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

export async function renderCanvas(gshape: DisplayObject, wait = 100) {
  const bbox = gshape.getBBox();
  const width = gshape.attributes.width || bbox.x + bbox.width || 400;
  const height = gshape.attributes.height || bbox.y + bbox.height || 300;

  const canvas = createGCanvas(width, height);
  return new Promise<Canvas>((resolve) => {
    canvas.addEventListener(CanvasEvent.READY, async () => {
      canvas.appendChild(gshape);

      // Wait for the next tick.
      await sleep(wait);
      resolve(canvas);
    });
  });
}
