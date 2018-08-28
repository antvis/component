const expect = require('chai').expect;
const G = require('@antv/g/lib');
const CanvasTooltip = require('../../../src/tooltip/canvas');

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
    { marker: 'square', color: 'red', name: 'name1', value: '1222333' },
    { marker: 'square', color: 'blue', name: 'n2', value: '1233' },
    { marker: 'square', color: 'yellow', name: 'name3', value: 'swww - afas' }
];
const plotRange = {
  tl: { x: 25, y: 50 },
  tr: { x: 425, y: 50 },
  bl: { x: 25, y: 440 },
  br: { x: 425, y: 440 },
  cc: { x: 225, y: 245 }
};

describe('CanvasTooltip测试', () => {
  it('initialize,show', () => {
    const tooltip = new CanvasTooltip({
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
    canvas.draw();
    const container = tooltip.get('container');
    expect(tooltip).be.an.instanceof(CanvasTooltip);
    expect(container.get('visible')).to.equal(true);
    expect(container.attr('visible')).to.equal(true);
    tooltip.destroy();
  });

  it('hide', () => {
    const tooltip = new CanvasTooltip({
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
    const container = tooltip.get('container');
    expect(container.get('visible')).to.equal(false);
    expect(container.attr('visible')).to.equal(false);
    tooltip.destroy();
  });

  it('clear', () => {
    const tooltip = new CanvasTooltip({
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
    const titleShape = tooltip.get('titleShape');
    const itemsGroup = tooltip.get('itemsGroup');
    const itemNumber = itemsGroup.get('children').length;
    expect(titleShape.text).to.equal('');
    expect(itemNumber).to.equal(0);
    tooltip.destroy();
  });

  it('destory', () => {
    const tooltip = new CanvasTooltip({
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
    const container = tooltip.get('container');
    expect(container.get('destroyed')).to.equal(true);
  });

  it('set position', () => {
    const tooltip = new CanvasTooltip({
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
    canvas.draw();
    expect(tooltip.get('x')).to.equal(70);// x+gap
    expect(tooltip.get('y')).to.equal(50);// y+gap
    tooltip.destroy();
  });

  it('adjust boundary', () => {
    const tooltip = new CanvasTooltip({
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
    canvas.draw();
    const height = tooltip.get('container').getBBox().height;
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
    const tooltip = new CanvasTooltip({
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
    const tooltip = new CanvasTooltip({
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
    const width = tooltip.get('container').getBBox().width;
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
    const tooltip = new CanvasTooltip({
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
    const tooltip = new CanvasTooltip({
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
    const height = tooltip.get('container').getBBox().height;
    expect(tooltip.get('y')).to.equal(320 - height - 40);
    tooltip.destroy();
  });


});
