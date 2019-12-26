import { Canvas } from '@antv/g-canvas';
import { noop } from '@antv/util';
import { Scrollbar } from '../../../src/scrollbar/scrollbar';
import { simulateMouseEvent } from '../../util/simulate';

describe('Scrollbar', () => {
  const div = document.createElement('div');
  div.id = 'canvas';
  document.body.appendChild(div);

  const canvas = new Canvas({
    container: 'canvas',
    width: 400,
    height: 400,
  });

  const size = 8;

  let scrollbar = new Scrollbar({
    container: canvas.addGroup(),
    id: 's',
    x: 50,
    y: 40,
    trackLen: 300,
    thumbLen: 30,
    size: 8,
  });

  it('render', () => {
    scrollbar.render();
    const track = scrollbar.getElementByLocalId('track');
    const thumb = scrollbar.getElementByLocalId('thumb');

    expect(scrollbar.get('isHorizontal')).toBe(true);
    expect(scrollbar.get('x')).toBe(50);
    expect(scrollbar.get('y')).toBe(40);
    expect(scrollbar.get('thumbOffset')).toBe(0);
    const bbox = scrollbar.get('group').getCanvasBBox();
    expect(bbox.minX).toBe(50);
    expect(bbox.minY).toBe(40);
    expect(bbox.width).toBe(300);
    expect(bbox.height).toBe(8);

    expect(track).toBeDefined();
    expect(track.get('type')).toBe('line');
    const trackBBox = track.getCanvasBBox();
    expect(trackBBox.minX).toBe(50);
    expect(trackBBox.minY).toBe(40);
    expect(trackBBox.width).toBe(300);
    expect(trackBBox.height).toBe(8);

    expect(thumb).toBeDefined();
    expect(thumb.get('type')).toBe('line');
    const thumbBBox = thumb.getCanvasBBox();
    expect(thumbBBox.minX).toBe(50);
    expect(thumbBBox.minY).toBe(40);
    expect(thumbBBox.width).toBe(30);
    expect(thumbBBox.height).toBe(8);
  });

  it('update', () => {
    scrollbar.update({
      x: 60,
      y: 80,
    });
    const track = scrollbar.getElementByLocalId('track');
    const thumb = scrollbar.getElementByLocalId('thumb');
    const bbox = scrollbar.get('group').getCanvasBBox();

    expect(bbox.minX).toBe(60);
    expect(bbox.minY).toBe(80);
    expect(bbox.width).toBe(300);
    expect(bbox.height).toBe(8);

    const trackBBox = track.getCanvasBBox();
    expect(trackBBox.minX).toBe(60);
    expect(trackBBox.minY).toBe(80);
    expect(trackBBox.width).toBe(300);
    expect(trackBBox.height).toBe(8);

    const thumbBBox = thumb.getCanvasBBox();
    expect(thumbBBox.minX).toBe(60);
    expect(thumbBBox.minY).toBe(80);
    expect(thumbBBox.width).toBe(30);
    expect(thumbBBox.height).toBe(8);
  });

  it('update thumbOffset', () => {
    scrollbar.update({
      thumbOffset: 10,
    });
    const track = scrollbar.getElementByLocalId('track');
    const thumb = scrollbar.getElementByLocalId('thumb');
    const bbox = scrollbar.get('group').getCanvasBBox();

    expect(bbox.minX).toBe(60);
    expect(bbox.minY).toBe(80);
    expect(bbox.width).toBe(300);
    expect(bbox.height).toBe(8);

    const trackBBox = track.getCanvasBBox();
    expect(trackBBox.minX).toBe(60);
    expect(trackBBox.minY).toBe(80);
    expect(trackBBox.width).toBe(300);
    expect(trackBBox.height).toBe(8);

    const thumbBBox = thumb.getCanvasBBox();
    expect(thumbBBox.minX).toBe(70);
    expect(thumbBBox.minY).toBe(80);
    expect(thumbBBox.width).toBe(30);
    expect(thumbBBox.height).toBe(8);
  });

  it('track click', (done) => {
    scrollbar.update({
      x: 0,
      y: 0,
      thumbOffset: 0,
    });
    scrollbar.on('scrollchange', (evt: any) => {
      const thumb = scrollbar.getElementByLocalId('thumb');
      const thumbBBox = thumb.getCanvasBBox();
      expect(evt.thumbOffset).toBe(20);
      expect(thumbBBox.minX).toBe(20);
      expect(thumbBBox.minY).toBe(0);
      expect(thumbBBox.width).toBe(30);
      expect(thumbBBox.height).toBe(8);
      scrollbar.off('scrollchange');
      done();
    });
    const track = scrollbar.getElementByLocalId('track');
    track.emit('click', {
      clientX: 8 + 15 + 20,
      clientY: 4,
    });
  });

  it('dnd', (done) => {
    scrollbar.update({
      x: 0,
      y: 0,
      thumbOffset: 0,
    });
    scrollbar.on('scrollchange', (evt: any) => {
      expect(evt.thumbOffset).toBe(10);
      const thumb = scrollbar.getElementByLocalId('thumb');
      const thumbBBox = thumb.getCanvasBBox();
      expect(thumbBBox.minX).toBe(10);
      expect(thumbBBox.minY).toBe(0);
      expect(thumbBBox.width).toBe(30);
      expect(thumbBBox.height).toBe(8);
      scrollbar.off('scrollchange');
      done();
    });
    const containerDOM = scrollbar
      .get('container')
      .get('canvas')
      .get('container');
    scrollbar.get('group').emit('mousedown', {
      clientX: 8 + 15 + 10,
      clientY: 0,
      originalEvent: {
        preventDefault: noop,
      },
    });
    simulateMouseEvent(containerDOM, 'mousemove', {
      clientX: 8 + 15 + 20,
      clientY: 4,
    });
    simulateMouseEvent(containerDOM, 'mouseup', {});
  });

  it('vertical', () => {
    scrollbar = new Scrollbar({
      container: canvas.addGroup(),
      isHorizontal: false,
      id: 's',
      x: 50,
      y: 40,
      trackLen: 300,
      thumbLen: 30,
      size: 8,
    });
    scrollbar.render();

    const track = scrollbar.getElementByLocalId('track');
    const thumb = scrollbar.getElementByLocalId('thumb');

    expect(scrollbar.get('isHorizontal')).toBe(false);
    expect(scrollbar.get('x')).toBe(50);
    expect(scrollbar.get('y')).toBe(40);
    expect(scrollbar.get('thumbOffset')).toBe(0);
    const bbox = scrollbar.get('group').getCanvasBBox();
    expect(bbox.minX).toBe(50);
    expect(bbox.minY).toBe(40);
    expect(bbox.width).toBe(8);
    expect(bbox.height).toBe(300);

    expect(track).toBeDefined();
    expect(track.get('type')).toBe('line');
    const trackBBox = track.getCanvasBBox();
    expect(trackBBox.minX).toBe(50);
    expect(trackBBox.minY).toBe(40);
    expect(trackBBox.width).toBe(8);
    expect(trackBBox.height).toBe(300);

    expect(thumb).toBeDefined();
    expect(thumb.get('type')).toBe('line');
    const thumbBBox = thumb.getCanvasBBox();
    expect(thumbBBox.minX).toBe(50);
    expect(thumbBBox.minY).toBe(40);
    expect(thumbBBox.width).toBe(8);
    expect(thumbBBox.height).toBe(30);
  });
});
