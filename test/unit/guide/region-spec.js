const expect = require('chai').expect;
const { Canvas } = require('@antv/g');
const Coord = require('@antv/coord');
const Region = require('../../../src/guide/region');
const Scale = require('@antv/scale');

const div = document.createElement('div');
div.id = 'c1';
document.body.appendChild(div);

function snapEqual(a, b) {
  return Math.abs(a - b) < 0.001;
}

describe('Guide: 辅助背景框', function() {
  const coord = new Coord.Rect({
    start: {
      x: 60,
      y: 460
    },
    end: {
      x: 460,
      y: 60
    }
  });

  const canvas = new Canvas({
    containerId: 'c1',
    width: 500,
    height: 500,
    pixelRatio: 2
  });

  const group = canvas.addGroup();

  const xScale = Scale.cat({
    values: [ '一月', '二月', '三月', '四月', '五月' ]
  });

  const yScale = Scale.linear({
    min: 0,
    max: 1200
  });

  let region;
  it('guide region', function() {
    region = new Region({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: 0,
        temp: 200
      },
      end: {
        month: 4,
        temp: 800
      },
      style: {
        lineWidth: 1,
        fill: '#CCD7EB',
        fillOpacity: 0.4,
        stroke: 'blue'
      }
    });
    region.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    const el = region.get('el');
    expect(children[0]).to.eql(el);

    const path = el.attr('path');
    expect(el.name).to.equal('guide-region');
    expect(path[1][1] - path[0][1]).to.equal(400);
    expect(snapEqual(path[0][2] - path[3][2], 200)).to.be.true;
  });

  // it('guide region in polar', function() {
  //   group.clear();
  //   const coord = new Coord.Polar({
  //     start: { x: 0, y: 0 },
  //     end: { x: 200, y: 200 },
  //     startAngle: -0.5 * Math.PI,
  //     endAngle: 1.5 * Math.PI
  //   });
  //   region = new Region({
  //     xScales: {
  //       month: xScale
  //     },
  //     yScales: {
  //       temp: yScale
  //     },
  //     start: {
  //       month: 1,
  //       temp: 'min'
  //     },
  //     end: {
  //       month: 3,
  //       temp: 'max'
  //     },
  //     style: {
  //       lineWidth: 1,
  //       fill: '#CCD7EB',
  //       fillOpacity: 0.4,
  //       stroke: 'blue'
  //     },
  //     appendInfo: 'Guide-region'
  //   });
  //   region.render(coord, group);
  //   canvas.draw();
  //   const children = group.get('children');
  //   const el = region.get('el');
  //   expect(children[0]).to.eql(el);

  //   const path = el.attr('path');
  //   expect(el.name).to.equal('guide-region');
  //   expect(el.get('appendInfo')).to.equal(region.get('appendInfo'));
  //   expect(path).to.eql([
  //     [ 'M', 100, 100 ],
  //     [ 'L', 0, 100.00000000000001 ],
  //     [ 'A', 100, 100, 0, 0, 0, 200, 100 ],
  //     [ 'z' ]
  //   ]);
  // });

  it('changeVisible', () => {
    const el = region.get('el');
    expect(region.get('visible')).to.be.true;
    expect(el.get('visible')).to.be.true;

    region.changeVisible(false);
    expect(region.get('visible')).to.be.false;
    expect(el.get('visible')).to.be.false;
  });

  it('clear', () => {
    const el = region.get('el');
    expect(el.get('destroyed')).to.be.false;

    region.clear();
    expect(el.get('destroyed')).to.be.true;
  });

  it('invalid', () => {
    region.set('start', [ 'test', 10 ]);
    region.render(coord, group);
    expect(region.get('el')).equal(null);
  });

  it('destroy', () => {
    region.destroy();
    expect(region.destroyed).equal(true);
    canvas.destroy();
    document.body.removeChild(div);
  });
});
