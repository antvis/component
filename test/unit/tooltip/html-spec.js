const expect = require('chai').expect;
const G = require('@antv/g/lib');
const HtmlTooltip = require('../../../src/tooltip/html');
const Util = require('../../../src/util');

const div = document.createElement('div');
div.id = 'tooltip-container';
div.style.margin = '20px';
document.body.appendChild(div);

const canvas = new G.Canvas({
  containerId: 'tooltip-container',
  width: 500,
  height: 500
});

const title = 'a tooltip title';
const items = [
    { color: 'red', name: '累计下载量', value: '7008.17' },
    { color: 'blue', name: '累计注册成功量', value: '7008.17' },
    { color: 'yellow', name: '累计下单成功量', value: '7008.17' }
];
const plotRange = {
  tl: { x: 25, y: 50 },
  tr: { x: 425, y: 50 },
  bl: { x: 25, y: 440 },
  br: { x: 425, y: 440 },
  cc: { x: 225, y: 245 }
};

describe('HtmlTooltip测试', () => {
  it('initialize,show', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.show();
    const visibility = tooltip.get('container').style.visibility;
    expect(tooltip).be.an.instanceof(HtmlTooltip);
    expect(visibility).to.equal('visible');
    tooltip.destroy();
  });

  it('hide', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.hide();
    const visibility = tooltip.get('container').style.visibility;
    expect(visibility).to.equal('hidden');
    tooltip.destroy();
  });

  it('clear', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.clear();
    const container = tooltip.get('container');
    const titleDom = container.getElementsByClassName('g2-tooltip-title')[0];
    const listDom = container.getElementsByClassName('g2-tooltip-list')[0];
    expect(titleDom.innerHTML).to.equal('');
    expect(listDom.innerHTML).to.equal('');
    tooltip.destroy();
  });

  it('destory', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.destroy();
    const tooltipNode = document.getElementsByClassName('g2-tooltip');
    expect(tooltipNode.length).to.equal(0);
  });

  it('set position', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.setPosition(50, 10);
    tooltip.show();
    expect(tooltip.get('x')).to.equal(70);// x+gap
    expect(tooltip.get('y')).to.equal(50);// y+gap
    tooltip.destroy();
  });

  it('adjust boundary', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      offset: 50,
      canvas,
      frontPlot: canvas.addGroup(),
      inPlot: false
    });
    tooltip.setPosition(-100, 600);
    tooltip.show();
    const height = tooltip.get('container').clientHeight;
    expect(tooltip.get('x')).to.equal(20);// gap
    expect(tooltip.get('y')).to.equal(600 - height - 20);
    tooltip.destroy();
  });

  it('in plot - left', () => {
    const pl = {
      tl: { x: 100, y: 50 },
      tr: { x: 100, y: 50 },
      bl: { x: 25, y: 440 },
      br: { x: 425, y: 440 },
      cc: { x: 225, y: 245 }
    };
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange: pl,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      offset: 50,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.setPosition(10, 20);
    tooltip.show();
    expect(tooltip.get('x')).to.equal(pl.tl.x);
    tooltip.destroy();
  });

  it('in plot - right', () => {
    const pl = {
      tl: { x: 25, y: 50 },
      tr: { x: 300, y: 50 },
      bl: { x: 25, y: 440 },
      br: { x: 300, y: 440 },
      cc: { x: 225, y: 245 }
    };
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange: pl,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.setPosition(300, 20);
    tooltip.show();
    const width = tooltip.get('container').clientWidth;
    expect(tooltip.get('x')).to.equal(320 - width - 40);
    tooltip.destroy();
  });

  it('in plot - top', () => {
    const pl = {
      tl: { x: 25, y: 100 },
      tr: { x: 425, y: 100 },
      bl: { x: 25, y: 440 },
      br: { x: 425, y: 440 },
      cc: { x: 225, y: 245 }
    };
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange: pl,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.setPosition(10, 20);
    tooltip.show();
    expect(tooltip.get('y')).to.equal(pl.tl.y);
    tooltip.destroy();
  });

  it('in plot - bottom', () => {
    const pl = {
      tl: { x: 25, y: 100 },
      tr: { x: 425, y: 100 },
      bl: { x: 25, y: 150 },
      br: { x: 425, y: 150 },
      cc: { x: 225, y: 245 }
    };
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange: pl,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.setPosition(10, 300);
    tooltip.show();
    const height = tooltip.get('container').clientHeight;
    expect(tooltip.get('y')).to.equal(320 - height - 40);
    tooltip.destroy();
  });

  it('enterable', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup(),
      enterable: true
    });
    tooltip.setPosition(300, 50);
    const width = tooltip.get('container').clientWidth;
    const height = tooltip.get('container').clientHeight;
    expect(tooltip.get('y')).to.equal(50 - height / 2);
    expect(tooltip.get('x')).to.equal(300 - width - 1);
    tooltip.destroy();
  });

  it('crosshair', () => {
    const tooltip = new HtmlTooltip({
      x: 0,
      y: 0,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      backPlot: canvas.addGroup(),
      frontPlot: canvas.addGroup(),
      crosshair: { type: 'cross' }
    });
    tooltip.setPosition(50, 80);
    tooltip.show();
    canvas.draw();
    tooltip.destroy();
  });

  it('html', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup(),
      htmlContent: (title, items) => {
        let list = '<ul>';
        for (let i = 0; i < items.length; i++) {
          const li = '<li>' + items[i].name + ':' + items[i].value + '</li>';
          list += li;
        }
        list += '</li>';
        return '<div style="position:absolute;">' + title + list + '</div>';
      }
    });
    tooltip.setPosition(100, 40);
    tooltip.show();
    const container = tooltip.get('container');
    const type = Util.typeUtil.getType(container);
    expect(type).to.equal('HTMLDivElement');
    tooltip.destroy();
  });

  it('html setContent', () => {
    const tooltip = new HtmlTooltip({
      x: 10,
      y: 10,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup(),
      htmlContent: (title, items) => {
        let list = '<ul>';
        for (let i = 0; i < items.length; i++) {
          const li = '<li class="item' + i + '">' + items[i].name + ':' + items[i].value + '</li>';
          list += li;
        }
        list += '</li>';
        return '<div style="position:absolute;">' + title + list + '</div>';
      }
    });
    tooltip.show();
    const title_new = 'new title';
    const items_new = [
      { color: 'red', name: 'change1', value: '223' },
      { color: 'blue', name: 'change2', value: '404' },
      { color: 'yellow', name: 'change3', value: '419' }
    ];
    tooltip.setContent(title_new, items_new);
    const container = tooltip.get('container');
    const firstItem = container.getElementsByClassName('item0')[0];
    expect(firstItem.innerHTML).to.equal('change1:223');
    tooltip.destroy();
  });

  it('markergroup', () => {
    const markerItems = [
      { color: 'blue', x: 50, y: 30 },
      { color: 'red', x: 50, y: 60 },
      { color: 'green', x: 50, y: 90 }
    ];
    const tooltip = new HtmlTooltip({
      x: 0,
      y: 0,
      plotRange,
      titleContent: title,
      showTitle: true,
      visible: true,
      items,
      canvas,
      backPlot: canvas.addGroup(),
      frontPlot: canvas.addGroup(),
      crosshair: { type: 'cross' }
    });
    tooltip.setMarkers(markerItems, { radius: 5 });
    tooltip.setPosition(50, 80);
    tooltip.show();
    const markergroup = tooltip.get('markerGroup');
    const children = markergroup.get('children');
    expect(children.length).to.equal(3);
    expect(children[0].attr('fill')).to.equal('blue');
    expect(children[0].attr('x')).to.equal(50);
    expect(children[0].attr('y')).to.equal(30);
    tooltip.hide();
    expect(markergroup.get('visible')).to.equal(false);
    tooltip.show();
    expect(markergroup.get('visible')).to.equal(true);
    tooltip.destroy();
  });

});

