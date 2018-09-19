const expect = require('chai').expect;
const G = require('@antv/g/src');
const Canvas = G.Canvas;
const Color = require('../../../src/legend/color');

const div = document.createElement('div');
div.id = 'base';
document.body.appendChild(div);

const canvas = new Canvas({
  containerId: 'base',
  width: 500,
  height: 500
});

const items = [
  { value: 0, color: 'blue' },
  { value: 20, color: '#4D4DB2' },
  { value: 40, color: 'green' },
  { value: 60, color: 'orange' },
  { value: 80, color: '#FF00FE' },
  { value: 100, color: 'red' }
];

describe('base', function() {
  it('水平渐变图例可筛选 拖动最大值滑块', function() {
    canvas.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: '#191A1A'
      }
    });
    // const legendGroup = canvas.addGroup();
    const cfg = {
      items,
      container: canvas,
      layout: 'horizontal',
      title: {
        text: '这就是连续图例A的Title',
        fill: '#333',
        textBaseline: 'middle'
      },
      width: 150,
      height: 15,
      slidable: false
    };
    const legend = new Color(cfg);
    legend.move(10, 10);
    legend.draw();

    legend.clear();
    const items2 = [
      { value: 0, color: 'blue' },
      { value: 10, color: '#4D4DB2' },
      { value: 50, color: 'green' },
      { value: 100, color: 'red' }
    ];
    legend.setItems(items2);
    canvas.draw();
    const item = { value: 110, color: 'yellow' };
    legend.addItem(item);
    canvas.draw();

    expect(legend.get('slider')).to.be.undefined;

    // legend.destroy();
    // document.body.removeChild(div);
  });
});
