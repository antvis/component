import type { DisplayObject } from '@antv/g';
import { Canvas, CanvasEvent, resetEntityCounter } from '@antv/g';
import { Renderer } from '@antv/g-svg';
import { OffscreenCanvasContext, measureText } from './utils/offscreen-canvas-context';
import { Layout, setMockMeasureTextWidth } from '../../src';

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

function nextFrame(canvas: Canvas) {
  return new Promise<void>((resolve) => {
    canvas.requestAnimationFrame(() => resolve());
  });
}

export async function renderCanvas(gshape: DisplayObject, wait = 300) {
  const bbox = gshape.getBBox();
  const width = gshape.attributes.width || bbox.x + bbox.width || 400;
  const height = gshape.attributes.height || bbox.y + bbox.height || 300;

  const canvas = createGCanvas(width, height);
  return new Promise<Canvas>((resolve) => {
    canvas.addEventListener(CanvasEvent.READY, async () => {
      canvas.appendChild(gshape);

      // Wait for components, animations and G's mutation queue to settle.
      await sleep(wait);

      // Layout nodes are populated before being connected to the canvas, so
      // their insertion events can run before layout has measurable children.
      // Trigger a final layout after mounting, as G2 does during rendering.
      let layoutTriggered = false;
      canvas.getRoot().forEach((node) => {
        if (
          node instanceof Layout &&
          node.children.length > 0 &&
          node.children.every((child) => child.attributes.transform === undefined)
        ) {
          node.layout();
          layoutTriggered = true;
        }
      });

      // Flush the layout mutations before serializing the SVG. The explicit
      // render keeps this deterministic in Jest, where RAF scheduling differs
      // from a browser's render loop.
      if (layoutTriggered) {
        canvas.render();

        // Match G2's render completion: wait two frames before taking a snapshot.
        await nextFrame(canvas);
        await nextFrame(canvas);
      }
      resolve(canvas);
    });
  });
}
