const expect = require('chai').expect;
const { Canvas } = require('@antv/g/lib');
const LineAxis = require('../../../src/axis/line');
const findByName = require('../../helper/find-element-by-name');

const div = document.createElement('div');
document.body.appendChild(div);

const canvas = new Canvas({
  containerDOM: div,
  width: 600,
  height: 600,
  pixelRatio: 2
});
canvas.draw();

describe('line axis on bottom', function() {
  const group = canvas.addGroup();
  const axis = new LineAxis({
    group,
    canvas,
    start: {
      x: 60,
      y: 460
    },
    end: {
      x: 460,
      y: 460
    },
    isVertical: false,
    factor: 1,
    ticks: [
      { text: '0', value: 0 },
      { text: '1', value: 0.1 },
      { text: '2', value: 0.2 },
      { text: '3', value: 0.3 },
      { text: '4', value: 0.4 },
      { text: '5', value: 0.5 },
      { text: '6', value: 0.6 },
      { text: '7', value: 0.7 },
      { text: '8', value: 0.8 },
      { text: '9', value: 0.9 },
      { text: '10', value: 1 }
    ],
    title: {
      offset: 50,
      text: 'x 轴',
      position: 'start' // 标题文本位置位于坐标轴前端
    },
    grid: {
      lineStyle: {
        stroke: '#000',
        lineDash: [ 2, 4 ]
      },
      alternateColor: 'rgba(0, 0, 255, 0.1)',
      items: [
        { _id: 'test1', points: [{ x: 60, y: 460 }, { x: 60, y: 450 }, { x: 60, y: 440 }, { x: 60, y: 430 }] },
        { _id: 'test2', points: [{ x: 100, y: 460 }, { x: 100, y: 450 }, { x: 100, y: 440 }, { x: 100, y: 430 }] },
        { _id: 'test3', points: [{ x: 140, y: 460 }, { x: 140, y: 450 }, { x: 140, y: 440 }, { x: 140, y: 430 }] },
        { _id: 'test4', points: [{ x: 180, y: 460 }, { x: 180, y: 450 }, { x: 180, y: 440 }, { x: 180, y: 430 }] },
        { _id: 'test5', points: [{ x: 220, y: 460 }, { x: 220, y: 450 }, { x: 220, y: 440 }, { x: 220, y: 430 }] },
        { _id: 'test6', points: [{ x: 260, y: 460 }, { x: 260, y: 450 }, { x: 260, y: 440 }, { x: 260, y: 430 }] },
        { _id: 'test7', points: [{ x: 300, y: 460 }, { x: 300, y: 450 }, { x: 300, y: 440 }, { x: 300, y: 430 }] },
        { _id: 'test8', points: [{ x: 340, y: 460 }, { x: 340, y: 450 }, { x: 340, y: 440 }, { x: 340, y: 430 }] },
        { _id: 'test9', points: [{ x: 380, y: 460 }, { x: 380, y: 450 }, { x: 380, y: 440 }, { x: 380, y: 430 }] },
        { _id: 'test10', points: [{ x: 420, y: 460 }, { x: 420, y: 450 }, { x: 420, y: 440 }, { x: 420, y: 430 }] },
        { _id: 'test11', points: [{ x: 460, y: 460 }, { x: 460, y: 450 }, { x: 460, y: 440 }, { x: 460, y: 430 }] }
      ]
    },
    label: {
      textStyle: {
        fill: '#f80',
        textAlign: 'center'
      },
      formatter(value) {
        return value;
      },
      offset: 20
    },
    subTickCount: 3,
    subTickLine: {
      length: 20,
      stroke: 'yellow'
    }
  });
  axis.render();
  canvas.draw();

  it('Axis instance', function() {
    expect(axis).not.to.be.undefined;
    expect(axis).to.be.an.instanceof(LineAxis);
  });

  it('line group', function() {
    const line = axis.get('lineShape');
    const path = line.attr('path');
    expect(findByName(axis.get('group'), 'axis-line')).not.to.be.null;
    expect(path[0][1]).to.equal(60);
    expect(path[0][2]).to.equal(460);
  });

  it('ticks group', function() {
    expect(findByName(axis.get('group'), 'axis-ticks')).not.to.be.null;
  });

  it('label', function() {
    const labelRenderer = axis.get('labelRenderer');
    expect(labelRenderer).not.to.be.undefined;
    expect(labelRenderer.get('group').get('children').length).to.equal(axis.get('ticks').length);
  });

  it('title', function() {
    const title = findByName(axis.get('group'), 'axis-title');
    expect(title).not.to.be.null;
    expect(title.attr('y')).to.equal(510);
  });

  it('tickItems', function() {
    expect(axis.get('tickItems').length).to.equal(axis.get('ticks').length);
  });

  it('subTickItems', function() {
    expect(axis.get('subTickItems').length).to.equal((axis.get('ticks').length - 1) * (axis.get('subTickCount')));
  });

  it('grid', function() {
    const gridGroup = axis.get('gridGroup');
    expect(gridGroup).not.to.be.undefined;
    expect(findByName(axis.get('group'), 'axis-grid')).not.to.be.null;
  });

  it('destroy', function() {
    axis.destroy();
    expect(canvas.contain(axis)).to.be.false;
  });
});

describe('line axis on top', function() {
  const group = canvas.addGroup();
  const axis = new LineAxis({
    canvas,
    group,
    isVertical: false,
    factor: -1,
    start: {
      x: 60,
      y: 60
    },
    end: {
      x: 460,
      y: 60
    },
    ticks: [ 1000000, 2000000, 3000000, '4000000', '5000000', 6000000, 7000000, 8000000, 9000000, 10000000 ],
    title: {
      textStyle: {
        fontSize: 24,
        fill: 'red',
        textBaseline: 'bottom',
        fontWeight: 700,
        textAlign: 'center'
      },
      text: 'top axis',
      position: 'end',
      offset: 30
    },
    label: {
      autoRotate: false,
      autoHide: true,
      textStyle: {
        fill: '#444',
        textAlign: 'center'
      }
    }
  });
  axis.render();
  canvas.draw();

  it('line', function() {
    const line = axis.get('lineShape');
    const path = line.attr('path');

    expect(path[0][1]).to.equal(60);
    expect(path[0][2]).to.equal(60);
  });

  it('tics', function() {
    const line = axis.get('lineShape');
    const path = line.attr('path');

    expect(path[0][2]).to.equal(60);
    expect(path[1][2]).to.equal(60);
  });

  it('tite', function() {
    const title = findByName(axis.get('group'), 'axis-title');
    expect(title).not.to.be.null;
    expect(title.attr('y')).to.equal(30);
  });
});

describe('line axis on left', function() {
  const group = canvas.addGroup();
  const axis = new LineAxis({
    canvas,
    group,
    isVertical: true,
    factor: -1,
    start: {
      x: 60,
      y: 60
    },
    end: {
      x: 60,
      y: 460
    },
    ticks: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    title: {
      textStyle: {
        fill: 'red',
        textAlign: 'center'
      },
      text: 'axis left',
      autoRotate: true,
      position: 'center',
      offset: 40
    },
    grid: {
      lineStyle: {
        stroke: '#c0c0c0'
      },
      items: [
        { _id: 'test', points: [{ x: 120, y: 200 }, { x: 180, y: 200 }, { x: 240, y: 200 }, { x: 300, y: 200 }] }
      ]
    },
    label: {
      textStyle: {
        fill: '#f80',
        textAlign: 'center',
        textBaseline: 'middle'
      },
      offset: 30
    }
  });
  axis.render();

  canvas.sort();
  canvas.draw();

  it('line', function() {
    const line = axis.get('lineShape');
    const path = line.attr('path');

    expect(path[1][1]).to.equal(60);
    expect(path[1][2]).to.equal(460);
  });

  it('ticks', function() {
    const line = axis.get('lineShape');
    const path = line.attr('path');

    expect(path[0][1]).to.equal(60);
    expect(path[1][1]).to.equal(60);
  });

  it('grid', function() {
    const gridGroup = axis.get('gridGroup');
    expect(gridGroup).not.to.be.null;
    expect(findByName(gridGroup, 'axis-grid')).not.to.be.null;
  });

  it('title', function() {
    const text = findByName(axis.get('group'), 'axis-title');
    expect(text).not.to.be.null;
    expect(text.attr('x')).to.equal(20);
  });
});

describe('line axis on right', function() {
  const group = canvas.addGroup();
  const axis = new LineAxis({
    canvas,
    group,
    isVertical: true,
    factor: 1,
    start: {
      x: 460,
      y: 60
    },
    end: {
      x: 460,
      y: 460
    },
    ticks: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    title: {
      textStyle: {
        fill: '#000'
      },
      text: 'axis right',
      offset: 40,
      autoRotate: true
    },
    label: null
  });
  axis.render();
  canvas.draw();

  it('line', function() {
    const line = axis.get('lineShape');
    const path = line.attr('path');
    expect(path[0][1]).to.equal(460);
    expect(path[1][1]).to.equal(460);
    expect(path[0][2]).to.equal(60);
    expect(path[1][2]).to.equal(460);
  });

  it('ticks', function() {
    const line = axis.get('lineShape');
    const path = line.attr('path');
    expect(path[0][1]).to.equal(460);
    expect(path[1][1]).to.equal(460);
  });
  it('label', function() {
    const labelsGroup = axis.get('labelsGroup');
    expect(labelsGroup).to.be.undefined;
  });
  it('title', function() {
    const text = findByName(axis.get('group'), 'axis-title');
    expect(text).not.to.null;
    expect(text.attr('x')).to.equal(500);
  });
});

describe('line axis label offset', () => {
  const group = canvas.addGroup();
  const axis = new LineAxis({
    canvas,
    group,
    isVertical: true,
    factor: 1,
    start: {
      x: 230,
      y: 60
    },
    end: {
      x: 230,
      y: 460
    },
    ticks: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    label: {
      textStyle: {
        fill: '#f80',
        textAlign: 'center'
      },
      formatter(value) {
        return value;
      },
      offsetX: 200,
      offsetY: 50
    }
  });
  axis.render();
  canvas.draw();

  it('vertical axis label', function() {
    const labelRenderer = axis.get('labelRenderer');
    expect(labelRenderer).not.to.be.undefined;
    const bbox = axis.get('group').getBBox();
    const labelAttrs = labelRenderer.get('group').get('children')[0]._attrs;
    expect(labelAttrs.x > (bbox.minX + 200)).to.be.true;
    expect(labelAttrs.x > (bbox.minY + 50)).to.be.true;
  });

  const axis2 = new LineAxis({
    canvas,
    group,
    isVertical: false,
    factor: 1,
    start: {
      x: 60,
      y: 120
    },
    end: {
      x: 460,
      y: 120
    },
    ticks: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    label: {
      textStyle: {
        fill: '#f80',
        textAlign: 'center'
      },
      formatter(value) {
        return value;
      },
      offsetX: 200,
      offsetY: 50
    }
  });
  axis2.render();
  canvas.draw();

  it('horizontal axis label', function() {
    const labelRenderer = axis2.get('labelRenderer');
    expect(labelRenderer).not.to.be.undefined;
    const bbox = axis2.get('group').getBBox();
    const labelAttrs = labelRenderer.get('group').get('children')[0]._attrs;
    expect(labelAttrs.x > (bbox.minX + 200)).to.be.true;
    expect(labelAttrs.x > (bbox.minY + 50)).to.be.true;
  });

});
