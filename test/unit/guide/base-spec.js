const expect = require('chai').expect;
const Scale = require('@antv/scale');
const Component = require('../../../src/component');
const Guide = require('../../../src/guide/base');

describe('Guide', () => {
  const coord = {
    start: { x: 60, y: 460 },
    end: { x: 460, y: 60 },
    height: 400,
    width: 400,
    convert(point) {
      return point;
    }
  };

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

  it('guide.parsePoint(coord, point)', function() {
    guide.set('xScales', {
      x: xScale
    });
    guide.set('yScales', {
      y: yScale
    });

    let parseResult;
    let point = { x: 1, y: 600 }; // 数值对象
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 0.25, y: 0.5 });

    point = [ '10%', '50%' ]; // 百分比
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 0.1, y: 0.5 });

    point = [ '三月', 1200 ]; // 数值数组
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 0.5, y: 1 });

    point = [ 'start', 'end' ]; // 带有关键字
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 0, y: 1 });

    point = [ 'median', 'median' ]; // 带有关键字
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 0.5, y: 0.5 });

    point = [ 'max', 'min' ]; // 带有关键字
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 1, y: 0 });

    point = [ 'max', 1200 ]; // 关键字和数值混用
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 1, y: 1 });

    point = [ 'max', '20%' ]; // 关键字和百分比混用
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 1, y: 0.8 });

    point = [ '20%', 600 ]; // 百分比和数值混用
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 0.2, y: 0.5 });

    point = function() {
      return [ 3, 600 ];
    };
    parseResult = guide.parsePoint(coord, point);
    expect(parseResult).to.eql({ x: 0.75, y: 0.5 });
  });

  it('guide.render()', function() {
    expect(guide.render).be.an.instanceof(Function);
    expect(guide.render()).to.be.undefined;
  });
});
