import { each } from '@antv/util';
import * as CssConst from '../../../src/tooltip/css-const';
import HtmlTooltip from '../../../src/tooltip/html';
import HtmlTheme from '../../../src/tooltip/html-theme';

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
        { name: 'china', value: '100', color: 'red' },
        { name: 'india', value: '200', color: 'l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff' },
        { name: 'england', value: '500', color: 'r(0.5, 0.5, 0.1) 0:#ffffff 0.3:#7ec2f3 1:#1890ff' },
      ],
      visible: false,
    });
    tooltip.init();
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

    it('marker color', () => {
      const listDom = tooltip.get('listDom');
      const markers = listDom.getElementsByClassName('g2-tooltip-marker');
      expect(markers[0].style.background).toBe('red');
      expect(markers[1].style.background).toBe(
        'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(126, 194, 243) 50%, rgb(24, 144, 255) 100%)'
      );
      expect(markers[2].style.background).toBe(
        'radial-gradient(rgb(255, 255, 255) 0%, rgb(126, 194, 243) 30%, rgb(24, 144, 255) 100%)'
      );
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
    it('position auto', () => {
      tooltip.update({
        x: 100,
        y: 100,
        position: 'auto',
      });
      const bbox = tooltip.getBBox();
      expect(container.style.top).toBe(100 - bbox.height - offset + 'px');
      expect(container.style.left).toBe(100 + offset + 'px');
    });
    it('destroy', () => {
      tooltip.destroy();
      expect(tooltip.destroyed).toBe(true);
      expect(dom.childNodes.length).toBe(0);
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
    let container;
    let offset;
    it('init', () => {
      tooltip.init();
      container = tooltip.getContainer();
      offset = tooltip.get('offset');
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
    it('update position auto', () => {
      tooltip.update({
        x: 300,
        y: 300,
        position: 'auto',
        region: {
          start: { x: 100, y: 100 },
          end: { x: 500, y: 500 },
        },
      });
      let bbox = tooltip.getBBox();
      expect(bbox.x).toBe(300 + offset);
      expect(bbox.y).toBe(300 - offset - bbox.height);

      tooltip.update({
        // 右侧出去
        x: 400,
        y: 300,
      });

      bbox = tooltip.getBBox();
      expect(bbox.x).toBe(400 - offset - bbox.width);
      expect(bbox.y).toBe(300 - offset - bbox.height);

      tooltip.update({
        // 上侧出去
        x: 400,
        y: 80,
      });

      bbox = tooltip.getBBox();
      expect(bbox.x).toBe(400 - offset - bbox.width);
      expect(bbox.y).toBe(Math.max(0, 80 - offset - bbox.height));
    });
    it('destroy', () => {
      tooltip.destroy();
      expect(tooltip.destroyed).toBe(true);
    });
  });

  describe('customContent', () => {
    const items = [
      { name: 'china', value: '100' },
      { name: 'india', value: '200' },
      { name: 'england', value: '500' },
    ];
    const tooltip = new HtmlTooltip({
      parent: dom,
      x: 200,
      y: 200,
      title: 'html',
      items,
      customContent: (title: string, data: any[]) => {
        return `
          <div class="g2-tooltip custom-html-tooltip">
            <div class="g2-tooltip-title">My Title ${title}</div>
            <ul class="g2-tooltip-list">
              ${data
                .map(
                  (item) => `
                <li class="g2-tooltip-list-item my-list-item">My Value: ${item.value}<li>
              `
                )
                .join('')}
            </ul>
          </div>
          `;
      },
    });
    let container: HTMLElement;

    it('init', () => {
      tooltip.init();
      container = tooltip.getContainer();
      expect(Array.from(container.classList).includes('g2-tooltip')).toBe(true);
      const target = container.getElementsByClassName('custom-html-tooltip');
      expect(target.length).toBe(1);
      each(HtmlTheme[CssConst.CONTAINER_CLASS], (val, key) => {
        if (!['transition', 'boxShadow', 'fontFamily', 'padding'].includes(key)) {
          expect(container.style[key] + '').toBe(val + '');
        }
      });
    });

    it('render', () => {
      tooltip.render();
      container = tooltip.getContainer();
      expect(Array.from(container.classList).includes('g2-tooltip')).toBe(true);
      const target = container.getElementsByClassName('custom-html-tooltip');
      expect(target.length).toBe(1);
      const title = container.getElementsByClassName('g2-tooltip-title')[0] as HTMLElement;
      expect(title.innerText).toBe('My Title html');
      const listItems = Array.from(container.getElementsByClassName('g2-tooltip-list-item')) as HTMLElement[];
      each(listItems, (listItem, index) => {
        expect(Array.from(listItem.classList).includes('my-list-item')).toBe(true);
        expect(listItem.innerText).toBe(`My Value: ${items[index].value}`);
      });
      each(HtmlTheme[CssConst.CONTAINER_CLASS], (val, key) => {
        if (!['transition', 'boxShadow', 'fontFamily', 'padding'].includes(key)) {
          expect(container.style[key] + '').toBe(val + '');
        }
      });
      each(HtmlTheme, (val, key) => {
        const elements = container.getElementsByClassName(key);
        each(elements, (element) => {
          each(val, (cssVal, cssKey) => {
            if (!['transition', 'boxShadow', 'fontFamily', 'padding'].includes(cssKey)) {
              expect(element.style[cssKey] + '').toBe(cssVal + '');
            }
          });
        });
      });
    });

    it('hide/show', () => {
      tooltip.hide();
      container = tooltip.getContainer();
      expect(container.style.visibility).toBe('hidden');
      tooltip.show();
      expect(container.style.visibility).toBe('visible');
    });

    it('destroy', () => {
      expect(dom.getElementsByClassName('custom-html-tooltip').length).toBe(1);
      tooltip.destroy();
      expect(dom.getElementsByClassName('custom-html-tooltip').length).toBe(0);
    });
  });
});
