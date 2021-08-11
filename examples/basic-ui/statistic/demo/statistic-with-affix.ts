import { Canvas } from '@antv/g';
import { Statistic, Marker, svg2marker, Tag } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 500,
  height: 100,
  renderer,
});

Marker.registerSymbol(
  'star',
  svg2marker(
    `<svg height="512" width="512" viewport="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M480 207H308.6L256 47.9 203.4 207H32l140.2 97.9L117.6 464 256 365.4 394.4 464l-54.7-159.1L480 207zM362.6 421.2l-106.6-76-106.6 76L192 298.7 84 224h131l41-123.3L297 224h131l-108 74.6 42.6 122.6z"/></svg>`
  )
);

const marker = new Marker({
  style: {
    symbol: 'star',
    x: 8,
    y: 4,
    r: 20,
    fill: 'orange',
  },
});
const tag1 = new Tag({
  style: {
    x: 0,
    y: 8,
    text: 'Tag 1',
    padding: [4, 7],
    textStyle: {
      default: {
        fontSize: 12,
        fill: 'rgba(0, 0, 0, 0.85)',
      },
    },
  },
});
const statistic = new Statistic({
  style: {
    x: 0,
    y: 0,
    title: {
      text: 'Affix statistic',
    },
    value: {
      text: '5123415515.151',
      style: {
        fontSize: 40,
      },
      prefix: marker,
      suffix: tag1,
    },
  },
});

canvas.appendChild(statistic);
