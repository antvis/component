import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Marker, svg2marker } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 300,
  height: 300,
  renderer,
});

const marker = new Marker({
  attrs: {
    symbol: 'triangle-down',
    x: 50,
    y: 50,
    size: 16,
    fill: 'green',
  },
});

canvas.appendChild(marker);

describe('marker', () => {
  test('basic', () => {
    expect(marker.attr('x')).toBe(50);
    expect(marker.attr('y')).toBe(50);
    expect(marker.attr('size')).toBe(16);
    expect(marker.attr('fill')).toBe('green');
    expect(marker.attr('symbol')).toBe('triangle-down');
    const path = marker.firstChild.attr('path');
    expect(path[0][1]).toBe(-8);
    expect(path[1][1]).toBe(8);
    expect(path[2][1]).toBe(0);
  });

  test('customize marker', async () => {
    Marker.registerSymbol(
      'star',
      svg2marker(
        `<svg height="512" width="512" viewport="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M480 207H308.6L256 47.9 203.4 207H32l140.2 97.9L117.6 464 256 365.4 394.4 464l-54.7-159.1L480 207zM362.6 421.2l-106.6-76-106.6 76L192 298.7 84 224h131l41-123.3L297 224h131l-108 74.6 42.6 122.6z"/></svg>`
      )
    );

    marker.update({
      symbol: 'star',
      x: 20,
      y: 20,
      size: 20,
      fill: 'gold',
      stroke: 'red',
    });
    expect(marker.attr('x')).toBe(20);
    expect(marker.attr('y')).toBe(20);
    expect(marker.attr('size')).toBe(20);
    expect(marker.attr('fill')).toBe('gold');
    expect(marker.attr('symbol')).toBe('star');
    expect(marker.attr('stroke')).toBe('red');
  });

  afterAll(() => {
    marker.destroy();
    canvas.destroy();
  });
});
