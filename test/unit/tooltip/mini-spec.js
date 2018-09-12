const expect = require('chai').expect;
const G = require('@antv/g/lib');
const MiniTooltip = require('../../../src/tooltip/mini');

const div = document.createElement('div');
div.id = 'tooltip-container';
div.style.margin = '20px';
document.body.appendChild(div);

const canvas = new G.Canvas({
  containerId: 'tooltip-container',
  width: 500,
  height: 500
});

const items = [
    { marker: 'square', color: 'red', name: 'name1', value: 'a mini tooltip' }
];
const plotRange = {
  tl: { x: 25, y: 50 },
  tr: { x: 425, y: 50 },
  bl: { x: 25, y: 440 },
  br: { x: 425, y: 440 },
  cc: { x: 225, y: 245 }
};

describe('MiniTooltip测试', () => {
  it('initialize show', () => {
    const tooltip = new MiniTooltip({
      x: 10,
      y: 10,
      plotRange,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.show();
    const container = tooltip.get('container');
    expect(tooltip).be.an.instanceof(MiniTooltip);
    expect(container.get('visible')).to.equal(true);
    expect(container.attr('visible')).to.equal(true);
    tooltip.destroy();
    canvas.draw();
  });

  it('set position', () => {
    const tooltip = new MiniTooltip({
      x: 10,
      y: 10,
      plotRange,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.show();
    canvas.addShape('circle', {
      attrs: {
        x: 250,
        y: 150,
        r: 2,
        fill: 'red'
      }
    });
    tooltip.setPosition(250, 150);
    canvas.draw();
  });

  it('left boundary', () => {
    const tooltip = new MiniTooltip({
      x: 10,
      y: 10,
      plotRange,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.show();
    canvas.addShape('circle', {
      attrs: {
        x: 20,
        y: 150,
        r: 2,
        fill: 'red'
      }
    });
    tooltip.setPosition(20, 150);
    canvas.draw();
  });

  it('right boundry', () => {
    const tooltip = new MiniTooltip({
      x: 10,
      y: 10,
      plotRange,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.show();
    canvas.addShape('circle', {
      attrs: {
        x: 450,
        y: 150,
        r: 5,
        fill: 'red'
      }
    });
    tooltip.setPosition(450, 150);
    canvas.draw();
  });

  it.only('multi position', () => {
    const tooltip = new MiniTooltip({
      x: 10,
      y: 10,
      plotRange,
      visible: true,
      items,
      canvas,
      frontPlot: canvas.addGroup()
    });
    tooltip.show();
    tooltip.setPosition(450, 150);
    canvas.draw();

    window.setTimeout(function() {
      tooltip.setPosition(250, 150);
      canvas.draw();
    }, 1000);

    window.setTimeout(function() {
      tooltip.setPosition(20, 150);
      canvas.draw();
    }, 2000);

  });

});
