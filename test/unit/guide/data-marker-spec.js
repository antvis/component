const expect = require('chai').expect;
const { Canvas } = require('@antv/g');
const Coord = require('@antv/coord');
const DataMarker = require('../../../src/guide/data-marker');
const Scale = require('@antv/scale');

const div = document.createElement('div');
div.id = 'c1';
document.body.appendChild(div);

describe('Guide.DataMarker', () => {
  const coord = new Coord.Rect({
    start: { x: 60, y: 460 },
    end: { x: 460, y: 60 }
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

  let dataMarker;

  it('DataMarker with point and line', () => {
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '二月',
        temp: 600
      },
      content: '二月，200',
      appendInfo: 'data-marker'
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(3);
    const children = el.get('children');
    const line = children[0];
    const text = children[1];
    const point = children[2];
    expect(line.attr('path')).to.eql([[ 'M', 160, 260 ], [ 'L', 160, 240 ]]);
    expect(text.attr('x')).to.eql(160);
    expect(text.attr('y')).to.eql(238);
    expect(text.attr('textBaseline')).to.equal('bottom');
    expect(point.attr('x')).to.eql(160);
    expect(point.attr('y')).to.eql(260);
    expect(el.get('appendInfo')).to.equal('data-marker');
  });

  it('DataMarker with point', () => {
    group.clear();
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '二月',
        temp: 600
      },
      content: '二月，200',
      display: {
        line: false
      }
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const display = dataMarker.get('display');
    expect(display.line).to.be.false;
    expect(display.point).to.be.true;
    expect(display.text).to.be.true;

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(2);
    const children = el.get('children');
    const text = children[0];
    const point = children[1];

    expect(text.attr('x')).to.eql(160);
    expect(text.attr('y')).to.eql(258);
    expect(point.attr('x')).to.eql(160);
    expect(point.attr('y')).to.eql(260);
  });

  it('DataMarker only has text', () => {
    group.clear();
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '四月',
        temp: 1200
      },
      content: '四月，1200',
      display: {
        line: false,
        point: false
      },
      direction: 'down'
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const display = dataMarker.get('display');
    expect(display.line).to.be.false;
    expect(display.point).to.be.false;
    expect(display.text).to.be.true;

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(1);
    const children = el.get('children');
    const text = children[0];

    expect(text.attr('x')).to.eql(360);
    expect(text.attr('y')).to.eql(62);
    expect(text.attr('textBaseline')).to.equal('top');
  });

  it('DataMarker text content is empty', () => {
    group.clear();
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '四月',
        temp: 1200
      },
      content: '',
      display: {
        line: false,
        point: false
      }
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(0);
  });

  it('DataMarker with point and line but right and top side beyond', () => {
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '五月',
        temp: 1200
      },
      content: 'Guide to designing a site using a design system by Meng To\n Please have fun.',
      appendInfo: 'data-marker'
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(3);
    const children = el.get('children');
    const line = children[0];
    const text = children[1];
    const point = children[2];

    expect(line.attr('path')).to.eql([[ 'M', 460, 60 ], [ 'L', 460, 80 ]]);
    expect(text.attr('x')).to.eql(460);
    expect(text.attr('y')).to.eql(82);
    expect(text.attr('textBaseline')).to.equal('top');
    expect(text.attr('textAlign')).to.equal('end');
    expect(point.attr('x')).to.eql(460);
    expect(point.attr('y')).to.eql(60);
    expect(el.get('appendInfo')).to.equal('data-marker');
  });

  it('DataMarker with point but top side beyond', () => {
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '三月',
        temp: 1200
      },
      display: {
        line: false
      },
      content: 'Guide to designing\n Please have fun.'
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(2);
    const children = el.get('children');
    const text = children[0];

    expect(text.attr('x')).to.eql(260);
    expect(text.attr('y')).to.eql(62);
    expect(text.attr('textBaseline')).to.equal('top');
    expect(text.attr('textAlign')).to.equal('start');
  });

  it('DataMarker with point but left and bottom side beyond', () => {
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '一月',
        temp: 0
      },
      content: 'Guide to designing a site using a design system by Meng To\n Please have fun.',
      display: {
        text: {
          textAlign: 'end'
        },
        line: false
      },
      direction: 'down'
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(2);
    const children = el.get('children');
    const text = children[0];

    expect(text.attr('x')).to.eql(60);
    expect(text.attr('y')).to.eql(458);
    expect(text.attr('textBaseline')).to.equal('bottom');
    expect(text.attr('textAlign')).to.equal('start');
  });

  it('DataMarker with point and line but bottom side beyond', () => {
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '三月',
        temp: 0
      },
      content: 'Guide to designing\nPlease have fun.',
      display: {
        text: {
          textAlign: 'end'
        }
      },
      direction: 'down'
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(3);
    const children = el.get('children');
    const line = children[0];
    const text = children[1];
    expect(line.attr('path')).to.eql([[ 'M', 260, 460 ], [ 'L', 260, 440 ]]);
    expect(text.attr('x')).to.eql(260);
    expect(text.attr('y')).to.eql(438);
    expect(text.attr('textBaseline')).to.equal('bottom');
    expect(text.attr('textAlign')).to.equal('start');
  });

  it('DataMarker without autoAdjust', () => {
    dataMarker = new DataMarker({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: '五月',
        temp: '1200'
      },
      content: 'Guide to designing a site using a design system by Meng To\n Please have fun.',
      autoAdjust: false
    });
    dataMarker.render(coord, group);
    canvas.draw();

    const el = dataMarker.get('el');
    expect(el.get('children').length).to.equal(3);
    const children = el.get('children');
    const line = children[0];
    const text = children[1];
    expect(line.attr('path')).to.eql([[ 'M', 460, 60 ], [ 'L', 460, 40 ]]);
    expect(text.attr('x')).to.eql(460);
    expect(text.attr('y')).to.eql(38);
    expect(text.attr('textBaseline')).to.equal('bottom');
    expect(text.attr('textAlign')).to.equal('start');
    const bbox = el.getBBox();
    expect(bbox.maxX).to.gt(coord.end.x);
  });

  it('changeVisible', function() {
    expect(dataMarker.get('visible')).to.be.true;

    dataMarker.changeVisible(false);
    expect(dataMarker.get('visible')).to.be.false;
    expect(dataMarker.get('el').get('visible')).to.be.false;
  });

  it('clear', function() {
    dataMarker.clear();
    expect(dataMarker.get('el').get('destroyed')).to.be.true;

    canvas.destroy();
    document.body.removeChild(div);
  });
});
