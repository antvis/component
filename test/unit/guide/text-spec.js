const expect = require('chai').expect;
const { Canvas } = require('@antv/g');
const Coord = require('@antv/coord');
const Text = require('../../../src/guide/text');
const Scale = require('@antv/scale');

const div = document.createElement('div');
div.id = 'c1';
document.body.appendChild(div);

describe('Guide: 辅助文本', function() {
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

  let text;

  it('guide text', function() {
    text = new Text({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      content: '(一月，200)',
      position: {
        month: '三月',
        temp: 'min'
      }
    });
    text.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    expect(children.length).to.equal(1);
    const el = text.get('el');
    expect(el).to.eql(children[0]);
    expect(el.name).to.equal('guide-text');
    expect(el.attr('x')).to.equal(260);
    expect(el.attr('y')).to.equal(460);
  });

  it('guide text has some offset', function() {
    group.clear();
    text = new Text({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      content: '(一月，200)',
      position: {
        month: '三月',
        temp: 'max'
      },
      style: {
        fill: 'rgb(251, 192, 45)',
        fontSize: 24,
        fontWeight: 600,
        shadowBlur: 12,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffsetX: 2,
        shadowOffsetY: 4,
        rotate: 180,
        textAlign: 'center'
      },
      offsetX: 100,
      offsetY: 100
    });
    text.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    expect(children.length).to.equal(1);
    expect(children[0].name).to.equal('guide-text');
    expect(children[0].attr('x')).to.equal(360);
    expect(children[0].attr('y')).to.equal(160);
    expect(children[0].attr('rotate')).to.equal(Math.PI);
  });

  it('guide text with the start is a function', function() {
    group.clear();
    text = new Text({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      content: '(一月，200)',
      position(xScales) {
        return {
          month: xScales.month.values[3],
          temp: 'median'
        };
      },
      style: {
        fill: 'rgb(251, 192, 45)',
        fontSize: 24,
        fontWeight: 600,
        textAlign: 'center'
      },
      appendInfo: 'Hello, text!'
    });
    text.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    expect(children.length).to.equal(1);
    const el = text.get('el');
    expect(el.name).to.equal('guide-text');
    expect(el.attr('x')).to.equal(360);
    expect(el.attr('y')).to.equal(260);
    expect(text.get('appendInfo')).to.equal(el.get('appendInfo'));
  });

  it('changeVisible', () => {
    const el = text.get('el');
    expect(text.get('visible')).to.be.true;
    expect(el.get('visible')).to.be.true;

    text.changeVisible(false);
    expect(text.get('visible')).to.be.false;
    expect(el.get('visible')).to.be.false;
  });

  it('clear', () => {
    const el = text.get('el');
    expect(el.get('destroyed')).to.be.false;

    text.clear();
    expect(el.get('destroyed')).to.be.true;
    text.set('position', [ 'test', 1 ]);
    text.render(coord, group);
    expect(text.get('el')).eql(null);
    canvas.destroy();
    document.body.removeChild(div);
  });
});
