const expect = require('chai').expect;
const G = require('@antv/g/lib');
const HtmlTooltip = require('../../../src/tooltip/html');

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
    { color: 'red', name: 'name1', value: '1222333' },
    { color: 'blue', name: 'n2', value: '1233' },
    { color: 'yellow', name: 'name3', value: 'swww - afas' }
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

});
