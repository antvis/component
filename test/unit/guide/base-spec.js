const expect = require('chai').expect;
const Scale = require('@antv/scale');
const Coord = require('@antv/coord');
const Component = require('../../../src/component');
const Guide = require('../../../src/guide/base');

describe('Guide', () => {
  const coord = new Coord.Rect({
    start: { x: 60, y: 460 },
    end: { x: 460, y: 60 }
  });

  const xScale = new Scale.Cat({
    values: [ '一月', '二月', '三月', '四月', '五月' ]
  });

  const yScale = new Scale.Linear({
    min: 0,
    max: 1200
  });

  let guide;
  it('Instantiation', function() {
    guide = new Guide();
    expect(guide).to.be.an.instanceof(Component);
    expect(guide.get('visible')).to.be.true;
    expect(guide.get('zIndex')).to.equal(1);
  });

  it('guide.changeVisible()', function() {
    guide.changeVisible(false);
    expect(guide.get('visible')).to.be.false;
  });

  it('guide.parsePoint(coord, point, needConvert)', function() {
    guide.set('xScales', {
      x: xScale
    });
    guide.set('yScales', {
      y: yScale
    });

    let parseResult;
    let point = { x: 1, y: 600 }; // 数值对象
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 160, y: 260 });

    point = [ '10%', '50%' ]; // 百分比
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 100, y: 260 });

    point = [ '三月', 1200 ]; // 数值数组
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 260, y: 60 });

    point = [ 'start', 'end' ]; // 带有关键字
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 60, y: 60 });

    point = [ 'median', 'median' ]; // 带有关键字
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 260, y: 260 });

    point = [ 'max', 'min' ]; // 带有关键字
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 460, y: 460 });

    point = [ 'max', 1200 ]; // 关键字和数值混用
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 460, y: 60 });

    // point = [ 'max', '20%' ]; // 关键字和百分比混用
    // parseResult = guide.parsePoint(coord, point);
    // expect(parseResult).to.eql({ x: 460, y: 140 });

    // point = [ '20%', 600 ]; // 百分比和数值混用
    // parseResult = guide.parsePoint(coord, point, false);
    // expect(parseResult).to.eql({ x: 0.2, y: 0.5 });

    point = function() {
      return [ 3, 600 ];
    };
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 360, y: 260 });
  });

  it('parsePoint null', () => {
    expect(guide.parsePoint(coord, [ 'test', 100 ])).eql(null);
  });

  it('guide.render()', function() {
    expect(guide.render).be.an.instanceof(Function);
    expect(guide.render()).to.be.undefined;
  });
  it('destroy', () => {
    guide.destroy();
    expect(guide.destroyed).equal(true);
  });
});
