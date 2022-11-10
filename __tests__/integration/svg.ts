// import type { DisplayObject } from '@antv/g';
// import { Canvas } from '@antv/g';
// import { Renderer } from '@antv/g-svg';
// import { createCanvas } from 'canvas';
// import xmlserializer from 'xmlserializer';
// import { JSDOM } from './jsdom';

// function createGCanvas(width: number, height: number) {
//   const dom = new JSDOM(`
//   <div id="container">
//   </div>
//   `);
//   // @ts-ignore
//   global.window = dom.window;
//   // @ts-ignore
//   global.document = dom.window.document;

//   // A standalone offscreen canvas for text metrics
//   const offscreenNodeCanvas = createCanvas(1, 1);

//   // Create a renderer, unregister plugin relative to DOM.
//   const renderer = new Renderer();
//   const domInteractionPlugin = renderer.getPlugin('dom-interaction');
//   renderer.unregisterPlugin(domInteractionPlugin);

//   return [
//     new Canvas({
//       container: 'container',
//       width,
//       height,
//       renderer,
//       // @ts-ignore
//       document: dom.window.document,
//       offscreenCanvas: offscreenNodeCanvas as any,
//       requestAnimationFrame: dom.window.requestAnimationFrame,
//       cancelAnimationFrame: dom.window.cancelAnimationFrame,
//     }),
//     dom,
//   ] as const;
// }

// export function sleep(n: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, n);
//   });
// }

// export async function renderSVG(gshape: DisplayObject, defaultWidth = 1000, defaultHeight = 1000) {
//   const [canvas, dom] = createGCanvas(defaultWidth, defaultHeight);

//   canvas.appendChild(gshape);

//   // Wait for the next tick.
//   await sleep(20);

//   const svg = xmlserializer.serializeToString(
//     // @ts-ignore
//     dom.window.document.getElementById('container').children[0]
//   );

//   // Remove id="app" to make sure the order of tests
//   // do not affect test result.
//   const pureSVG = svg.replace(/id="[^"]*"/g, '');
//   return [canvas, pureSVG] as const;
// }
