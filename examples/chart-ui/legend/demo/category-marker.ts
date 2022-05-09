import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 300,
  renderer,
});

const category = new Category({
  style: {
    x: 10,
    y: 10,
    items: [
      { name: 'Chrome', value: '7.08%', id: 'chrome', state: 'selected', color: '#5B8FF9' },
      { name: 'IE', value: '5.41%', id: 'IE', state: 'selected', color: '#61DDAA' },
      { name: 'QQ', value: '5.35%', id: 'QQ', state: 'selected', color: '#65789B' },
      { name: 'Firefox', value: '1.23%', id: 'Firefox', color: '#F6BD16' },
      { name: 'Microsoft Edge', value: '3.51%', color: '#7262fd' },
      { name: '360', value: '2.59%' },
      { name: 'Opera', value: '0.87%' },
      { name: 'Sogou', value: '1.06%' },
      { name: 'Others', value: '0.59%' },
    ],
    title: {
      content: '基本分类图例',
    },
    spacing: [10, 10],
    maxWidth: 350,
    maxItemWidth: 180,
    itemMarker: (item, idx) => {
      return {
        symbol: [
          'diamond',
          'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
          'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
        ][idx % 3],
        size: idx % 3 ? 6 : 12,
        style: {
          selected: {
            fill: ['#ecbf41', '#d94948', '#3871e0'][idx % 3],
          },
        },
      };
    },
    itemName: {
      spacing: 12,
    },
  },
});

canvas.appendChild(category);
