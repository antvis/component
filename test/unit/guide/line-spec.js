const expect = require('chai').expect;
const { Canvas, Group } = require('@antv/g');
const Line = require('../../../src/guide/line');
const Scale = require('@antv/scale');

const div = document.createElement('div');
div.id = 'c1';
document.body.appendChild(div);

describe('Guide: 辅助线', function() {
  const coord = {
    start: { x: 60, y: 460 },
    end: { x: 460, y: 60 },
    center: { x: 260, y: 260 },
    isRect: true,
    isTransposed: false,
    x: { start: 60, end: 460 },
    y: { start: 460, end: 60 },
    convertDim(percent, dim) {
      const { start, end } = this[dim];
      return start + percent * (end - start);
    },
    convert(point) {
      let x;
      let y;
      if (this.isTransposed) {
        x = point.y;
        y = point.x;
      } else {
        x = point.x;
        y = point.y;
      }

      return {
        x: this.convertDim(x, 'x'),
        y: this.convertDim(y, 'y')
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


  let line;

  it('guide line without text', function() {
    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '一月',
        temp: 200
      },
      end: {
        month: '五月',
        temp: 200
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 2,
        lineDash: [ 2, 2 ]
      }
    });
    line.render(coord, group);
    canvas.draw();

    const children = group.get('children');
    expect(children.length).to.equal(1);

    const el = line.get('el');
    expect(el).to.an.instanceof(Group);
    expect(el.getCount()).to.equal(1);
    const lineShape = el.get('children')[0];
    expect(lineShape.attr('path')).to.eql([
      [ 'M', 60, 393.33333333333337 ],
      [ 'L', 460, 393.33333333333337 ]
    ]);
  });

  it('guide line, the point is array', function() {
    group.clear();
    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: [ '三月', 200 ],
      end: {
        month: '五月',
        temp: 200
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 2,
        lineDash: [ 2, 2 ]
      }
    });
    line.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    expect(children.length).to.equal(1);

    const el = line.get('el');
    expect(el).to.an.instanceof(Group);
    expect(el.getCount()).to.equal(1);
    expect(el.get('children')[0].attr('path')[0][1]).eqls(260);
    expect(el.get('children')[0].attr('path')[1][1]).eqls(460);
  });

  it('guide line, start, end', function() {
    group.clear();

    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: [ 'start', 200 ],
      end: [ 'end', 200 ],
      lineStyle: {
        stroke: 'red',
        lineWidth: 2,
        lineDash: [ 2, 2 ]
      }
    });
    line.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    expect(children.length).to.equal(1);
    const el = line.get('el');
    expect(el).to.an.instanceof(Group);
    expect(el.getCount()).to.equal(1);
    expect(el.get('children')[0].attr('path')[0][1]).eqls(60);
    expect(el.get('children')[0].attr('path')[1][1]).eqls(460);
  });


  it('guide line with text, and autoRotate is true', function() {
    group.clear();
    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '一月',
        temp: 200
      },
      end: {
        month: '五月',
        temp: 1000
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 1
      },
      text: {
        position: 'center',
        content: '我是条辅助线哦',
        style: null
      }
    });
    line.render(coord, group);
    canvas.draw();

    const children = group.get('children');
    const el = line.get('el');
    expect(children.length).to.equal(1);
    expect(el).to.an.instanceof(Group);
    expect(el.getCount()).to.equal(2);
    const textShape = el.get('children')[1];
    expect(textShape.attr('rotate')).not.to.be.undefined;
    expect(textShape.attr('x')).to.equal(260);
    expect(textShape.attr('y')).to.equal(260);
  });

  it('guide line with text, the text has offset', function() {
    group.clear();

    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '一月',
        temp: 200
      },
      end: {
        month: '五月',
        temp: 1000
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 1
      },
      text: {
        position: 'center',
        content: '我是条辅助线哦',
        autoRotate: true,
        style: {
          fontSize: 16,
          fill: 'red',
          textAlign: 'start'
        },
        offsetX: 5,
        offsetY: 10
      }
    });
    line.render(coord, group);
    canvas.draw();

    const children = group.get('children');
    const textShape = children[0].get('children')[1];
    expect(textShape.attr('rotate')).not.to.be.undefined;
    expect(textShape.attr('x')).to.equal(265);
    expect(textShape.attr('y')).to.equal(270);
  });

  it('guide line with text but not rotate with line.', function() {
    group.clear();

    const line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '二月',
        temp: 200
      },
      end: {
        month: '四月',
        temp: 800
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 1
      },
      text: {
        position: 'start',
        content: '我是条辅助线哦',
        autoRotate: false,
        style: {
          fontSize: 16,
          fill: 'red'
        }
      }
    });
    line.render(coord, group);
    canvas.draw();

    const children = group.get('children');
    const textShape = children[0].get('children')[1];
    expect(textShape.get('type')).to.equal('Text');
    expect(textShape.attr('x')).to.equal(160);
    expect(textShape.attr('rotate')).to.be.undefined;
  });

  it('guide line with text, and text has own angle.', function() {
    group.clear();

    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '二月',
        temp: 200
      },
      end: {
        month: '二月',
        temp: 1000
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 1
      },
      text: {
        position: 'end',
        content: '我是条辅助线哦',
        autoRotate: false,
        style: {
          fontSize: 14,
          fill: 'red',
          textAlign: 'end',
          rotate: 60
        }
      }
    });
    line.render(coord, group);
    canvas.draw();

    const children = group.get('children');
    const textShape = children[0].get('children')[1];
    expect(textShape.get('type')).to.equal('Text');
    expect(textShape.attr('x')).to.equal(160);
    expect(textShape.attr('rotate')).to.equal(Math.PI / 3);
  });

  it('guide line with text, the position is value like "40%"', function() {
    group.clear();

    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '一月',
        temp: 200
      },
      end: {
        month: '五月',
        temp: 200
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 1
      },
      text: {
        position: '80%',
        content: '我是条辅助线哦',
        autoRotate: false,
        style: {
          fontSize: 16,
          fill: 'red',
          textAlign: 'start'
        }
      }
    });
    line.render(coord, group);
    canvas.draw();

    const children = group.get('children');
    const textShape = children[0].get('children')[1];
    expect(textShape.attr('x')).to.equal(380);
  });

  it('guide line with text, the position is value like 0.5', function() {
    group.clear();

    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '一月',
        temp: 200
      },
      end: {
        month: '五月',
        temp: 200
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 1
      },
      text: {
        position: 0.1,
        content: '我是条辅助线哦',
        autoRotate: false,
        style: {
          fontSize: 16,
          fill: 'red',
          textAlign: 'start'
        },
        offsetY: 20
      }
    });
    line.render(coord, group);
    canvas.draw();

    const children = group.get('children');
    const textShape = children[0].get('children')[1];
    expect(textShape.attr('x')).to.equal(100);
  });

  it('guide line with text, the position is value like 150%', function() {
    group.clear();

    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: {
        month: '一月',
        temp: 200
      },
      end: {
        month: '五月',
        temp: 200
      },
      lineStyle: {
        stroke: '#999',
        lineWidth: 1
      },
      text: {
        position: '150%',
        content: '我是条辅助线哦',
        autoRotate: false,
        style: {
          fontSize: 16,
          fill: 'red',
          textAlign: 'start'
        }
      },
      appendInfo: 'Guide-line'
    });
    line.render(coord, group);
    canvas.draw();

    const el = line.get('el');
    const lineShape = el.get('children')[0];
    const textShape = el.get('children')[1];
    expect(textShape.attr('x')).to.equal(460);
    expect(lineShape.get('appendInfo')).to.equal('Guide-line');
    expect(textShape.get('appendInfo')).to.equal('Guide-line');
  });

  it('guide line in polar', () => {
    group.clear();
    const coord = {
      start: { x: 0, y: 0 },
      end: { x: 200, y: 200 },
      center: { x: 100, y: 100 },
      circleCentre: { x: 100, y: 100 },
      startAngle: -0.5 * Math.PI,
      endAngle: 1.5 * Math.PI,
      isPolar: true,
      isTransposed: false,
      x: { start: -0.5 * Math.PI, end: 1.5 * Math.PI },
      y: { start: 0, end: 100 },
      convertDim(percent, dim) {
        const { start, end } = this[dim];
        return start + percent * (end - start);
      },
      convert(point) {
        const center = this.center;
        let x = this.isTransposed ? point.y : point.x;
        let y = this.isTransposed ? point.x : point.y;

        x = this.convertDim(x, 'x');
        y = this.convertDim(y, 'y');

        return {
          x: center.x + Math.cos(x) * y,
          y: center.y + Math.sin(x) * y
        };
      },
      convertPoint(point) {
        const center = this.center;
        let x = this.isTransposed ? point.y : point.x;
        let y = this.isTransposed ? point.x : point.y;

        x = this.convertDim(x, 'x');
        y = this.convertDim(y, 'y');

        return {
          x: center.x + Math.cos(x) * y,
          y: center.y + Math.sin(x) * y
        };
      },
      getCenter() {
        return this.circleCentre;
      }
    };
    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: [ '25%', 600 ],
      end: [ '75%', 600 ],
      lineStyle: {
        stroke: '#1890ff',
        lineWidth: 2,
        lineDash: null
      }
    });
    line.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    expect(children.length).to.equal(1);
    let el = line.get('el');
    expect(el).to.an.instanceof(Group);
    expect(el.getCount()).to.equal(1);
    expect(el.get('children')[0].attr('path')).to.eql([
      [ 'M', 150, 100 ],
      [ 'A', 50, 50, 0, 0, 1, 50, 100 ]
    ]);

    group.clear();
    line = new Line({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      start: [ '一月', 200 ],
      end: [ '一月', 1200 ],
      lineStyle: {
        stroke: '#1890ff',
        lineWidth: 2,
        lineDash: null
      }
    });
    line.render(coord, group);
    canvas.draw();
    // const children = group.get('children');
    // expect(children.length).to.equal(1);
    el = line.get('el');
    expect(el).to.an.instanceof(Group);
    expect(el.getCount()).to.equal(1);
    expect(el.get('children')[0].attr('path')).to.eql([
      [ 'M', 100, 83.33333333333334 ],
      [ 'L', 100, 0 ]
    ]);
  });

  it('changeVisible', () => {
    const el = line.get('el');
    expect(line.get('visible')).to.be.true;
    expect(el.get('visible')).to.be.true;

    line.changeVisible(false);
    expect(line.get('visible')).to.be.false;
    expect(el.get('visible')).to.be.false;
  });

  it('clear', () => {
    expect(line.get('el').get('destroyed')).to.be.false;

    line.clear();
    expect(line.get('el').get('destroyed')).to.be.true;

    canvas.destroy();
    document.body.removeChild(div);
  });
});
