import HtmlTooltip from '../../../src/tooltip/html';

const dom = document.createElement('div');
document.body.appendChild(dom);
dom.style.padding = '10px';
dom.id = 'clc';
dom.style.height = '500px';
describe('test tooltip', () => {
  describe('no region limit', () => {
    const tooltip = new HtmlTooltip({
      parent: dom,
      items: [
        { name: 'china', value: '100' },
        { name: 'india', value: '200' },
        { name: 'england', value: '500' },
      ],
      visible: false,
    });
    const container = tooltip.getContainer();
    const offset = tooltip.get('offset');
    it('init', () => {
      expect(tooltip.get('name')).toBe('tooltip');
      expect(tooltip.get('type')).toBe('html');
      expect(tooltip.get('listDom')).not.toBe(undefined);
      expect(tooltip.get('visible')).toBe(false);
      expect(container.style.visibility).toBe('hidden');
    });

    it('render', () => {
      tooltip.render();
      const listDom = tooltip.get('listDom');
      expect(listDom.childNodes.length).toBe(tooltip.get('items').length);
      expect(listDom.getElementsByClassName('g2-tooltip-value')[0].innerHTML).toBe('100');
    });

    it('show, hide', () => {
      tooltip.show();
      expect(container.style.visibility).toBe('visible');
    });

    it('init position', () => {
      const bbox = tooltip.getBBox();
      expect(tooltip.get('position')).toBe('right');
      expect(container.style.top).toBe(-bbox.height / 2 + 'px');
      expect(container.style.left).toBe(offset + 'px');
    });

    it('update x, y', () => {
      tooltip.update({
        x: 100,
        y: 100,
      });
      const bbox = tooltip.getBBox();
      expect(container.style.top).toBe(100 - bbox.height / 2 + 'px');
      expect(container.style.left).toBe(100 + offset + 'px');
    });

    it('update position', () => {
      tooltip.update({
        x: 100,
        y: 100,
        position: 'left',
      });
      const bbox = tooltip.getBBox();
      expect(container.style.top).toBe(100 - bbox.height / 2 + 'px');
      expect(container.style.left).toBe(100 - offset - bbox.width + 'px');
    });

    it('update items', () => {
      tooltip.update({
        x: 200,
        y: 200,
        items: [{ name: '23456', value: '111', color: 'red' }],
      });
      const listDom = tooltip.get('listDom');
      expect(listDom.childNodes.length).toBe(tooltip.get('items').length);
    });
    it('crosshairs', () => {
      // 未定义 crosshairsRegion 是不显示
      tooltip.update({
        crosshairs: 'x',
      });
      expect(tooltip.get('xCrosshairDom')).toBe(null);
      tooltip.update({
        x: 200,
        y: 200,
        crosshairsRegion: {
          start: { x: 100, y: 100 },
          end: { x: 400, y: 400 },
        },
      });
      const xdom = tooltip.get('xCrosshairDom');
      expect(xdom.style.top).toBe('100px');
      expect(xdom.style.left).toBe('200px');
      expect(xdom.style.height).toBe('300px');
      tooltip.hide();
      expect(xdom.style.display).toBe('none');
      tooltip.show();
      expect(xdom.style.display).toBe('');
      tooltip.update({
        visible: false,
      });
      expect(xdom.style.display).toBe('none');
      tooltip.update({
        visible: true,
      });
      expect(xdom.style.display).toBe('');
      tooltip.setLocation({ x: 300, y: 300 });
      expect(xdom.style.top).toBe('100px');
      expect(xdom.style.left).toBe('300px');
      tooltip.setLocation({ x: 200, y: 200 });
      expect(xdom.style.top).toBe('100px');
      expect(xdom.style.left).toBe('200px');
      tooltip.update({
        crosshairs: 'xy',
      });
      expect(xdom.style.top).toBe('100px');
      expect(xdom.style.left).toBe('200px');
      const ydom = tooltip.get('yCrosshairDom');
      expect(ydom.style.top).toBe('200px');
      expect(ydom.style.left).toBe('100px');
      expect(ydom.style.width).toBe('300px');

      tooltip.update({
        crosshairs: 'y',
      });
      expect(tooltip.get('yCrosshairDom')).not.toBe(null);
      expect(tooltip.get('xCrosshairDom')).toBe(null);
      tooltip.update({
        crosshairs: null,
      });
      expect(tooltip.get('yCrosshairDom')).toBe(null);
      expect(tooltip.get('xCrosshairDom')).toBe(null);
    });

    it('update title', () => {
      tooltip.update({
        title: '123',
      });
      expect(tooltip.get('titleDom').innerHTML).toBe('123');
    });

    it('clear', () => {
      tooltip.clear();
      expect(tooltip.get('titleDom').innerHTML).toBe('');
      expect(tooltip.get('listDom').childNodes.length).toBe(0);
    });

    it('rerender', () => {
      tooltip.clear();
      tooltip.render();
      expect(tooltip.get('titleDom').innerHTML).toBe(tooltip.get('title'));
      expect(tooltip.get('listDom').childNodes.length).toBe(tooltip.get('items').length);
    });
    it('destroy', () => {
      tooltip.destroy();
      expect(tooltip.destroyed).toBe(true);
      // expect(dom.childNodes.length).toBe(0);
    });
  });

  describe('region limit', () => {
    const tooltip = new HtmlTooltip({
      parent: dom,
      x: 200,
      y: 200,
      position: 'top',
      region: {
        start: { x: 100, y: 100 },
        end: { x: 400, y: 400 },
      },
      items: [
        { name: 'china', value: '100' },
        { name: 'india', value: '200' },
        { name: 'england', value: '500' },
      ],
    });
    const container = tooltip.getContainer();
    const offset = tooltip.get('offset');
    it('init', () => {
      expect(tooltip.get('visible')).toBe(true);
      expect(container.style.visibility).toBe('visible');
    });
    it('render', () => {
      tooltip.render();
      const bbox = tooltip.getBBox();
      expect(bbox.y).toBe(200 + offset);
    });

    it('move', () => {
      tooltip.setLocation({ x: 100, y: 300 }); // 左侧触碰到边
      const bbox = tooltip.getBBox();
      expect(bbox.x).toBe(100);
      expect(bbox.y).toBe(300 - offset - bbox.height);
      tooltip.setLocation({ x: 380, y: 300 });
      const bbox1 = tooltip.getBBox();
      expect(bbox1.x).toBe(400 - bbox.width);
      expect(tooltip.getLocation()).toEqual({ x: 380, y: 300 });
    });
    it('update region', () => {
      tooltip.update({
        x: 380,
        y: 300,
        region: {
          start: { x: 100, y: 100 },
          end: { x: 500, y: 500 },
        },
      });
      const bbox = tooltip.getBBox();
      expect(bbox.x).toBe(380 - bbox.width / 2);
      expect(bbox.y).toBe(300 - offset - bbox.height);
    });
    it('destroy', () => {
      tooltip.destroy();
      expect(tooltip.destroyed).toBe(true);
    });
  });
});
