const expect = require('chai').expect;
const { Canvas } = require('@antv/g');
const Coord = require('@antv/coord');
const Arc = require('../../../src/guide/arc');
const Scale = require('@antv/scale');

const div = document.createElement('div');
div.id = 'c1';
document.body.appendChild(div);

describe('Guide: 辅助圆弧线', function() {
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

  let arc;

  it('guide arc', function() {
    const coord = new Coord.Polar({
      start: { x: 60, y: 460 },
      end: { x: 460, y: 60 },
      startAngle: -1 / 2 * Math.PI,
      endAngle: Math.PI
    });
    arc = new Arc({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: 0,
        temp: 1200
      },
      end: {
        month: 4,
        temp: 1200
      },
      style: {
        lineWidth: 3,
        stroke: 'blue'
      }
    });
    arc.render(coord, group);
    canvas.draw();
    const el = arc.get('el');
    const children = group.get('children');
    expect(children.length).to.equal(1);
    expect(children[0]).to.eql(el);
    expect(el.name).to.equal('guide-arc');
    expect(el.attr('path').length).to.equal(2);
    expect(el.getBBox().width).to.equal(403);
    expect(el.getBBox().height).to.equal(403);
  });

  it('circle as arc', function() {
    const coord = new Coord.Polar({
      start: { x: 80, y: 355 },
      end: { x: 480, y: 20 },
      startAngle: 0,
      endAngle: 2 * Math.PI
    });
    arc = new Arc({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: 0,
        temp: 1200
      },
      end: {
        month: 0,
        temp: 1200
      },
      style: {
        lineWidth: 3,
        stroke: 'blue'
      },
      appendInfo: 'Arc'
    });
    arc.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    expect(children.length).to.equal(2);
    const el = arc.get('el');
    expect(el.name).to.equal('guide-arc');
    expect(el.attr('path').length).to.equal(2);
    expect(el.getBBox().width).to.equal(0);
    expect(el.getBBox().height).to.equal(0);
    expect(el.get('appendInfo')).to.equal('Arc');
  });

  it('changeVisible', function() {
    expect(arc.get('visible')).to.be.true;

    arc.changeVisible(false);
    expect(arc.get('visible')).to.be.false;
    expect(arc.get('el').get('visible')).to.be.false;
  });


  it('clear', function() {
    const el = arc.get('el');
    arc.clear();
    expect(el.get('destroyed')).to.be.true;
    expect(arc.get('el')).eqls(null);
  });

  it('guide point invalid', () => {
    const coord = new Coord.Polar({
      start: { x: 60, y: 460 },
      end: { x: 460, y: 60 },
      startAngle: -1 / 2 * Math.PI,
      endAngle: Math.PI
    });
    arc.set('start', {
      month: 'test',
      temp: 1200
    });
    arc.render(coord, group);
    expect(arc.get('el')).eqls(null);
  });
  it('destroy', () => {
    canvas.destroy();
    document.body.removeChild(div);
  });
});
