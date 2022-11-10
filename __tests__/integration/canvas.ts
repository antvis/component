import type { DisplayObject } from '@antv/g';
import { Canvas, CanvasEvent } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * diff between PNGs
 */
export function diff(src: string, target: string) {
  const img1 = PNG.sync.read(fs.readFileSync(src));
  const img2 = PNG.sync.read(fs.readFileSync(target));
  const { width, height } = img1;
  return pixelmatch(img1.data, img2.data, null, width, height, {
    threshold: 0.1,
  });
}

export function createGCanvas(width: number, height: number) {
  // Create a node-canvas instead of HTMLCanvasElement
  const nodeCanvas = createCanvas(width, height);
  // A standalone offscreen canvas for text metrics
  const offscreenNodeCanvas = createCanvas(1, 1);

  // Create a renderer, unregister plugin relative to DOM.
  const renderer = new Renderer();
  const domInteractionPlugin = renderer.getPlugin('dom-interaction');
  renderer.unregisterPlugin(domInteractionPlugin);

  return [
    new Canvas({
      width,
      height,
      canvas: nodeCanvas as any,
      renderer,
      offscreenCanvas: offscreenNodeCanvas as any,
    }),
    nodeCanvas,
  ] as const;
}

export function sleep(n: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

export function writePNG(nodeCanvas: any, path: string) {
  return new Promise<void>((resolve, reject) => {
    const out = fs.createWriteStream(path);
    const stream = nodeCanvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', resolve).on('error', reject);
  });
}

export async function renderCanvas(gshape: DisplayObject, filename: string, defaultWidth = 1000, defaultHeight = 1000) {
  const [canvas, nodeCanvas] = createGCanvas(defaultWidth, defaultHeight);
  return new Promise<Canvas>((resolve) => {
    canvas.addEventListener(CanvasEvent.READY, async () => {
      canvas.appendChild(gshape);

      // Wait for the next tick.
      await sleep(500);
      await writePNG(nodeCanvas, filename);
      resolve(canvas);
    });
  });
}
