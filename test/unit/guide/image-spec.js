const expect = require('chai').expect;
const { Canvas } = require('@antv/g');
const Image = require('../../../src/guide/image');
const Scale = require('@antv/scale');

const div = document.createElement('div');
div.id = 'c1';
document.body.appendChild(div);

describe('Guide: 辅助图片', function() {
  const coord = {
    start: {
      x: 60,
      y: 460
    },
    end: {
      x: 460,
      y: 60
    },
    convert(point) {
      const { start, end } = this;
      const { x, y } = point;
      return {
        x: start.x + x * (end.x - start.x),
        y: end.y + (1 - y) * (start.y - end.y)
      };
    }
  };

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

  it('image, set start, width and height', function(done) {
    const img = new Image({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '二月',
        temp: 600
      },
      src: 'https://zos.alipayobjects.com/rmsportal/YZsqDCAvphpUzpNHMqvv.png',
      width: 32,
      height: 32
    });
    img.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    const el = img.get('el');

    setTimeout(function() {
      expect(el).to.eql(children[0]);
      expect(el.attr('x')).to.equal(160);
      expect(el.attr('y')).to.equal(260);
      expect(el.attr('width')).to.equal(32);
      expect(el.attr('height')).to.equal(32);
      expect(el.name).to.equal('guide-image');
      done();
    }, 200);
  });

  it('image set start and end, and with offsetX, offsetY', function(done) {
    group.clear();

    const img = new Image({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: [ '三月', '0%' ],
      end: [ '五月', '100%' ],
      src: 'https://zos.alipayobjects.com/rmsportal/gbwjstijrvcgTWOPCirr.png',
      offsetX: -100,
      offsetY: 100,
      appendInfo: 'id'
    });
    img.render(coord, group);
    canvas.draw();

    const el = img.get('el');

    setTimeout(function() {
      expect(el.attr('width')).to.equal(200);
      expect(el.attr('height')).to.equal(400);
      expect(el.attr('x')).to.equal(160);
      expect(el.attr('y')).to.equal(160);
      expect(el.name).to.equal('guide-image');
      expect(el.get('appendInfo')).to.equal(img.get('appendInfo'));
      done();
    }, 200);
  });

  it('changeVisible', function() {
    group.clear();

    const img = new Image({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '二月',
        temp: 600
      },
      src: 'https://zos.alipayobjects.com/rmsportal/YZsqDCAvphpUzpNHMqvv.png'
    });
    img.render(coord, group);
    canvas.draw();

    const el = img.get('el');
    expect(img.get('visible')).to.be.true;
    expect(el.get('visible')).to.be.true;
    expect(el.attr('width')).to.equal(32);
    expect(el.attr('height')).to.equal(32);

    img.changeVisible(false);
    expect(img.get('visible')).to.be.false;
    expect(el.get('visible')).to.be.false;
  });

  it('clear', function() {
    group.clear();

    const img = new Image({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '二月',
        temp: 600
      },
      src: 'https://zos.alipayobjects.com/rmsportal/YZsqDCAvphpUzpNHMqvv.png',
      width: 32,
      height: 32
    });
    img.render(coord, group);
    canvas.draw();

    expect(img.get('el').get('destroyed')).to.be.false;

    img.clear();
    expect(img.get('el').get('destroyed')).to.be.true;
  });
});
