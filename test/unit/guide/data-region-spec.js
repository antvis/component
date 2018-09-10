const expect = require('chai').expect;
const { Canvas } = require('@antv/g');
const DataRegion = require('../../../src/guide/data-region');
const Scale = require('@antv/scale');

const div = document.createElement('div');
div.id = 'c1';
document.body.appendChild(div);

describe('Guide.DataRegion', () => {
  const coord = {
    start: { x: 60, y: 460 },
    end: { x: 460, y: 60 },
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
    field: 'x',
    values: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ]
  });

  const yScale = Scale.linear({
    field: 'y',
    min: 0,
    max: 1200
  });

  const data = [
    { x: '一月', y: 200 },
    { x: '二月', y: 300 },
    { x: '三月', y: 100 },
    { x: '四月', y: 500 },
    { x: '五月', y: 450 },
    { x: '六月', y: 650 },
    { x: '七月', y: 710 },
    { x: '八月', y: 800 },
    { x: '九月', y: 660 },
    { x: '十月', y: 1000 },
    { x: '十一月', y: 890 },
    { x: '十二月', y: 110 }
  ];

  let dataRegion;

  it('DataRegion without text', () => {
    dataRegion = new DataRegion({
      xScales: {
        x: xScale
      },
      yScales: {
        y: yScale
      },
      start: {
        x: '四月',
        y: 500
      },
      end: {
        x: '十月',
        y: 1000
      },
      lineLength: 30,
      style: {
        fill: '#1890ff',
        opacity: 0.05
      },
      appendInfo: 'data-region'
    });

    dataRegion.render(coord, group, data);
    canvas.draw();

    const el = dataRegion.get('el');
    expect(el.get('appendInfo')).to.equal('data-region');
    expect(el.get('appendInfo')).to.equal(dataRegion.get('appendInfo'));
    expect(el.name).to.equal('guide-data-region');
    expect(el.get('children').length).to.equal(1);
    const pathShape = el.get('children')[0];
    expect(pathShape.attr('path')).to.eql([
      [ 'M', 169.09090909090907, 96.66666666666666 ],
      [ 'L', 169.09090909090907, 293.3333333333333 ],
      [ 'L', 205.45454545454547, 310 ],
      [ 'L', 241.8181818181818, 243.33333333333334 ],
      [ 'L', 278.18181818181813, 223.33333333333334 ],
      [ 'L', 314.5454545454545, 193.33333333333334 ],
      [ 'L', 350.90909090909093, 239.99999999999997 ],
      [ 'L', 387.2727272727273, 126.66666666666666 ],
      [ 'L', 387.2727272727273, 96.66666666666666 ]
    ]);
  });

  it('DataRegion which is empty', () => {
    dataRegion = new DataRegion({
      xScales: {
        x: xScale
      },
      yScales: {
        y: yScale
      },
      start: [ -1, 300 ],
      end: [ 2, 400 ],
      lineLength: 30,
      style: {
        fill: '#1890ff',
        opacity: 0.05
      }
    });

    dataRegion.render(coord, group, data);
    canvas.draw();

    const el = dataRegion.get('el');
    expect(el).to.be.null;

    const result = dataRegion._getRegionData(coord, data);
    expect(result.length).to.equal(0);
  });

  it('DataRegion with text', () => {
    group.clear();

    dataRegion = new DataRegion({
      xScales: {
        x: xScale
      },
      yScales: {
        y: yScale
      },
      start: [ '五月', 500 ],
      end: [ '六月', 650 ],
      lineLength: 30,
      style: {
        region: {
          fill: '#1890ff',
          opacity: 0.05
        },
        text: {
          fontSize: 20,
          fill: '#1890ff'
        }
      },
      content: 'A blogging platform for professionals',
      appendInfo: 'data-region'
    });

    dataRegion.render(coord, group, data);
    canvas.draw();

    const el = dataRegion.get('el');
    expect(el.get('appendInfo')).to.equal('data-region');
    expect(el.get('appendInfo')).to.equal(dataRegion.get('appendInfo'));
    expect(el.name).to.equal('guide-data-region');
    expect(el.get('children').length).to.equal(2);
    const pathShape = el.get('children')[0];
    const textShape = el.get('children')[1];
    expect(pathShape.attr('path')).to.eql([
      [ 'M', 205.45454545454547, 213.33333333333334 ],
      [ 'L', 205.45454545454547, 310 ],
      [ 'L', 241.8181818181818, 243.33333333333334 ],
      [ 'L', 241.8181818181818, 213.33333333333334 ]
    ]);

    expect(textShape.attr('x')).to.equal(223.63636363636363);
    expect(textShape.attr('y')).to.equal(213.33333333333334);
  });

  it('changeVisible', function() {
    expect(dataRegion.get('visible')).to.be.true;

    dataRegion.changeVisible(false);
    expect(dataRegion.get('visible')).to.be.false;
    expect(dataRegion.get('el').get('visible')).to.be.false;
  });

  it('clear', function() {
    dataRegion.clear();
    expect(dataRegion.get('el').get('destroyed')).to.be.true;

    canvas.destroy();
    document.body.removeChild(div);
  });
});
