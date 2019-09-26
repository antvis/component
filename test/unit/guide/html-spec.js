const expect = require('chai').expect;
const { Canvas } = require('@antv/g');
const Coord = require('@antv/coord');
const Html = require('../../../src/guide/html');
const Scale = require('@antv/scale');

const div = document.createElement('div');
div.id = 'html';
document.body.appendChild(div);

describe('Guide: 辅助 html', function() {
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
    containerId: 'html',
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

  it('guide html, with default position(middle, middle)', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      htmlContent: '<div style="border: none;width: 54.2px;height: 54.2px;"></div>'
    });
    html.render(coord, group);
    canvas.draw();
    const children = group.get('children');
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[0].style.left).to.equal('333px');
    expect(dom[0].style.top).to.equal('233px');
    expect(children.length).to.equal(0);
  });

  it('guide html, with alignX = "middle", alignY = "top"', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      alignY: 'top',
      htmlContent: '<div style="border: none;width: 60px;height: 60px;"</div>',
      offsetY: 5,
      zIndex: 2
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[1].style.left).to.equal('330px');
    expect(dom[1].style.top).to.equal('265px');
  });

  it('guide html, with alignX = "middle", alignY = "bottom"', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      alignY: 'bottom',
      htmlContent: '<div style="border: none;width: 60px;height: 60px;"</div>',
      offsetY: -5
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[2].style.left).to.equal('330px');
    expect(dom[2].style.top).to.equal('195px');
  });

  it('guide html, with alignX = "left", alignY = "middle"', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      alignX: 'left',
      offsetX: 5,
      htmlContent: '<div style="border: none;width: 60px;height: 60px;"></div>'
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[3].style.left).to.equal('365px');
    expect(dom[3].style.top).to.equal('230px');
  });

  it('guide html, with alignX = "right", alignY = "middle"', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      alignX: 'right',
      offsetX: -5,
      htmlContent: '<div style="border: none;width: 60px;height: 60px;"></div>'
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[4].style.left).to.equal('295px');
    expect(dom[4].style.top).to.equal('230px');
  });

  it('guide html, with alignX = "left", alignY = "top"', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      alignX: 'left',
      alignY: 'top',
      htmlContent: '<div style="border: none;width: 55px;height: 55px;"></div>'
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[5].style.left).to.equal('360px');
    expect(dom[5].style.top).to.equal('260px');
  });

  it('guide html, with alignX = "right", alignY = "top"', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      alignX: 'right',
      alignY: 'top',
      html: '<div style="border: none;width: 55px;height: 55px;"></div>'
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[6].style.left).to.equal('305px');
    expect(dom[6].style.top).to.equal('260px');
  });

  it('guide html, with alignX = "left", alignY = "bottom"', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      alignX: 'left',
      alignY: 'bottom',
      offsetY: -5,
      htmlContent: '<div style="border: none;width: 55px;height: 55px;"></div>'
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[7].style.left).to.equal('360px');
    expect(dom[7].style.top).to.equal('200px');
  });

  it('guide html, with alignX = "right", alignY = "bottom"', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 3,
        temp: 600
      },
      alignX: 'right',
      alignY: 'bottom',
      offsetY: -5,
      html: '<div style="border: none;width: 55px;height: 55px;"></div>'
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[8].style.left).to.equal('305px');
    expect(dom[8].style.top).to.equal('200px');
  });

  it('guide html, html is a function', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 1,
        temp: 600
      },
      html(xScales, yScales) {
        return '<div style="border: none;width: 60px;height: 60px;">' + yScales.temp.max + '</div>';
      }
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[9].style.left).to.equal('130px');
    expect(dom[9].style.top).to.equal('230px');
  });

  it('guide html, the parent element of html is undefined width.', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: {
        month: 1,
        temp: 600
      },
      htmlContent: `<div>
        <i style="display: inline-block;width: 10px;height: 10px;background-color:red;">
      </div>`
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[10].style.left).to.equal('155px');
    expect(dom[10].style.top).to.equal('251px');
  });

  it('guide html, clear', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: [ 'start', 'start' ],
      html: '<p style="width: 100px;height: 80px;font-size: 20px;">Hoooray</p>'
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom.length).to.equal(12);

    html.clear();
    expect(document.getElementsByClassName('g-guide').length).to.equal(11);
  });

  it('guide html, changeVisible', function() {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: [ '50%', '50%' ],
      html: '<p style="width: 100px;height: 80px;font-size: 20px;">Hoooray</p>'
    });
    html.render(coord, group);
    canvas.draw();
    const dom = document.getElementsByClassName('g-guide');
    expect(dom[11].style.left).to.equal('210px');
    expect(dom[11].style.top).to.equal('220px');
    html.changeVisible();
    expect(html.get('el').style.display).to.equal('none');
  });
  it('guide html, unvalid position', () => {
    const html = new Html({
      xScales: {
        month: xScale
      },
      yScales: {
        temp: yScale
      },
      position: [ 'test', '50%' ],
      html: '<p style="width: 100px;height: 80px;font-size: 20px;">Hoooray</p>'
    });
    const dom = document.getElementsByClassName('g-guide');
    html.render(coord, group);

    expect(document.getElementsByClassName('g-guide').length).to.equal(dom.length);
  });

  after('destroy', () => {
    canvas.destroy();
    document.body.removeChild(div);
  });
});
