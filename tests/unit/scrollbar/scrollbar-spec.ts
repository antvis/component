import { Canvas } from '@antv/g-canvas';
import { noop } from '@antv/util';
import { Scrollbar } from '../../../src/scrollbar/scrollbar';
import { simulateMouseEvent, simulateTouchEvent } from '../../util/simulate';

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
    updateAutoRender: true,
    size: 8,
  });
  scrollbar.init();

  it('setRange/getRange', () => {
    let curRange = scrollbar.getRange();
    expect(curRange.min).toBe(0);
    expect(curRange.max).toBe(1);

    scrollbar.setRange(0.1, 0.2);
    curRange = scrollbar.getRange();
    expect(curRange.min).toBe(0.1);
    expect(curRange.max).toBe(0.2);
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

  it('getValue/setValue', () => {
    const curValue = scrollbar.getValue();
    expect(curValue).toBe(0);

    scrollbar.setValue(0.1);
    expect(scrollbar.getValue()).toBe(0.1);
    expect(scrollbar.get('thumbOffset')).toBe(0.1 * (scrollbar.get('trackLen') - scrollbar.get('thumbLen')));

    // set again
    scrollbar.setValue(0.1);
    expect(scrollbar.getValue()).toBe(0.1);
    expect(scrollbar.get('thumbOffset')).toBe(0.1 * (scrollbar.get('trackLen') - scrollbar.get('thumbLen')));

    // setValue with range
    scrollbar.setRange(0.4, 0.5);
    scrollbar.setValue(0.6);
    expect(scrollbar.getValue()).toBe(0.5);
    expect(scrollbar.get('thumbOffset')).toBe(0.5 * (scrollbar.get('trackLen') - scrollbar.get('thumbLen')));
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

  it('mouse hover', () => {
    const { thumbColor: thumbHoverColor } = scrollbar.get('theme').hover;
    const { thumbColor } = scrollbar.get('theme').default;
    const thumb = scrollbar.getElementByLocalId('thumb');
    thumb.emit('mouseover');
    expect(thumb.attr('stroke')).toBe(thumbHoverColor);
    thumb.emit('mouseout');
    expect(thumb.attr('stroke')).toBe(thumbColor);
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

  it('dnd maximum', (done) => {
    scrollbar.update({
      x: 0,
      y: 0,
      thumbOffset: 0,
    });
    scrollbar.on('scrollchange', (evt: any) => {
      expect(evt.thumbOffset).toBe(270);
      const thumb = scrollbar.getElementByLocalId('thumb');
      const thumbBBox = thumb.getCanvasBBox();
      expect(thumbBBox.minX).toBe(270);
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
      clientX: 380,
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
      updateAutoRender: true,
    });
    scrollbar.init();
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

  it('vertical update thumbOffset', () => {
    scrollbar.update({
      thumbOffset: 10,
    });

    const track = scrollbar.getElementByLocalId('track');
    const thumb = scrollbar.getElementByLocalId('thumb');

    expect(scrollbar.get('isHorizontal')).toBe(false);
    expect(scrollbar.get('x')).toBe(50);
    expect(scrollbar.get('y')).toBe(40);
    expect(scrollbar.get('thumbOffset')).toBe(10);
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
    expect(thumbBBox.minY).toBe(50);
    expect(thumbBBox.width).toBe(8);
    expect(thumbBBox.height).toBe(30);
  });

  it('vertical dnd', (done) => {
    scrollbar.update({
      x: 0,
      y: 0,
      thumbOffset: 0,
    });
    scrollbar.on('scrollchange', (evt: any) => {
      expect(evt.thumbOffset).toBe(10);
      const thumb = scrollbar.getElementByLocalId('thumb');
      const thumbBBox = thumb.getCanvasBBox();
      expect(thumbBBox.minY).toBe(10);
      expect(thumbBBox.minX).toBe(0);
      expect(thumbBBox.width).toBe(8);
      expect(thumbBBox.height).toBe(30);
      scrollbar.off('scrollchange');
      done();
    });
    const containerDOM = scrollbar
      .get('container')
      .get('canvas')
      .get('container');
    scrollbar.get('group').emit('mousedown', {
      clientY: 8 + 15 + 10,
      clientX: 4,
      originalEvent: {
        preventDefault: noop,
      },
    });
    simulateMouseEvent(containerDOM, 'mousemove', {
      clientY: 8 + 15 + 20,
      clientX: 4,
    });
    simulateMouseEvent(containerDOM, 'mouseup', {});
  });

  it('mobile event', (done) => {
    scrollbar.update({
      x: 0,
      y: 0,
      thumbOffset: 0,
    });
    const group = scrollbar.get('group');
    scrollbar.on('scrollchange', (evt: any) => {
      expect(evt.thumbOffset).toBe(10);
      const thumb = scrollbar.getElementByLocalId('thumb');
      const thumbBBox = thumb.getCanvasBBox();
      expect(thumbBBox.minY).toBe(10);
      expect(thumbBBox.minX).toBe(0);
      expect(thumbBBox.width).toBe(8);
      expect(thumbBBox.height).toBe(30);
      scrollbar.off('scrollchange');
      done();
    });
    const containerDOM = scrollbar
      .get('container')
      .get('canvas')
      .get('container');
    scrollbar.get('group').emit('touchstart', {
      originalEvent: {
        preventDefault: noop,
        touches: [
          {
            clientY: 8 + 15 + 10,
            clientX: 4,
          },
        ],
      },
    });
    simulateTouchEvent(containerDOM, 'touchmove', {
      clientY: 8 + 15 + 20,
      clientX: 4,
    });
    simulateTouchEvent(containerDOM, 'touchend', {});
  });
});
