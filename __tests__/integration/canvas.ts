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
export function diff(src: string, target: string, diff: string, maxError = 0, showMismatchedPixels = true) {
  const img1 = PNG.sync.read(fs.readFileSync(src));
  const img2 = PNG.sync.read(fs.readFileSync(target));
  const { width, height } = img1;

  let diffPNG: PNG | null = null;
  let output: Buffer | null = null;
  if (showMismatchedPixels) {
    diffPNG = new PNG({ width, height });
    output = diffPNG.data;
  }

  // @see https://github.com/mapbox/pixelmatch#pixelmatchimg1-img2-output-width-height-options
  const mismatch = pixelmatch(img1.data, img2.data, output, width, height, {
    threshold: 0.1,
  });

  if (showMismatchedPixels && mismatch > maxError && diffPNG) {
    fs.writeFileSync(diff, PNG.sync.write(diffPNG));
  }

  return mismatch;
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

export async function renderCanvas(gshape: DisplayObject, filename: string, wait = 100) {
  const bbox = gshape.getBBox();
  const width = gshape.attributes.width || bbox.x + bbox.width || 400;
  const height = gshape.attributes.height || bbox.y + bbox.height || 300;

  const [canvas, nodeCanvas] = createGCanvas(width, height);
  return new Promise<Canvas>((resolve) => {
    canvas.addEventListener(CanvasEvent.READY, async () => {
      canvas.appendChild(gshape);

      // Wait for the next tick.
      await sleep(wait);
      await writePNG(nodeCanvas, filename);
      resolve(canvas);
    });
  });
}
