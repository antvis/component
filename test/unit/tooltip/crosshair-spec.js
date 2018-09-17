const expect = require('chai').expect;
const G = require('@antv/g/lib');
const Crosshair = require('../../../src/tooltip/crosshair');

const div = document.createElement('div');
div.id = 'crosshair-container';
div.style.margin = '20px';
document.body.appendChild(div);

const canvas = new G.Canvas({
  containerId: 'crosshair-container',
  width: 500,
  height: 500
});

const plotRange = {
  tl: { x: 25, y: 50 },
  tr: { x: 425, y: 50 },
  bl: { x: 25, y: 440 },
  br: { x: 425, y: 440 },
  cc: { x: 225, y: 245 }
};


describe('crosshair测试', () => {
  it('initialize', () => {
    const crosshair = new Crosshair({
      plotRange,
      canvas,
      plot: canvas.addGroup(),
      type: 'cross'
    });
    crosshair.show();
    canvas.draw();
    expect(crosshair).be.an.instanceof(Crosshair);
    crosshair.destroy();
  });

  it('setPosition', () => {
    const crosshair = new Crosshair({
      plotRange,
      canvas,
      plot: canvas.addGroup(),
      type: 'cross'
    });
    crosshair.setPosition(50, 100);
    crosshair.show();
    canvas.draw();
    const crossLineShapeX = crosshair.get('crossLineShapeX');
    const crossLineShapeY = crosshair.get('crossLineShapeY');
    const y = crossLineShapeX.attr('matrix')[7];
    const x = crossLineShapeY.attr('matrix')[6];
    expect(x).to.equal(50);
    expect(y).to.equal(100);
    crosshair.destroy();
  });
});
