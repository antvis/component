const expect = require('chai').expect;
const G = require('@antv/g/src');
const Canvas = G.Canvas;
const Color = require('../../../src/legend/color');

const div = document.createElement('div');
div.id = 'legend';
document.body.appendChild(div);

const canvas = new Canvas({
  containerId: 'legend',
  width: 500,
  height: 500
});

const items = [
  { value: 0, color: 'blue' },
  { value: 20, color: '#4D4DB2' },
  { value: 40, color: 'green' },
  { value: 60, color: 'orange' },
  { value: 80, color: '#FF00FE' },
  { value: 100, color: 'red' }
];

describe('slider', function() {
  it('水平渐变图例可筛选 拖动最大值滑块', function() {
    const cfg = {
      items,
      container: canvas,
      layout: 'horizontal',
      title: {
        text: '这就是连续图例A的Title',
        fill: '#333',
        textBaseline: 'middle'
      },
      width: 150,
      height: 15,
      slidable: true
    };
    const legend = new Color(cfg);
    legend.move(10, 10);
    legend.draw();
    const slider = legend.get('slider');
    expect(slider).not.to.be.undefined;

    const currentTarget = slider.get('maxHandleElement');
    const target = slider.get('maxHandleElement');
    const elBBox = canvas.get('el').getBoundingClientRect();
    const legendBBox = legend.get('group').getBBox();
    const sliderBBox = slider.getBBox();
    const offsetX = elBBox.x + legendBBox.x + sliderBBox.x;
    const offsetY = elBBox.y + legendBBox.y + sliderBBox.y;

    const mouseDownEv = {
      target,
      currentTarget,
      tyoe: 'mousedown',
      bubbles: true,
      cancelable: true,
      clientX: 187 + offsetX,
      clientY: 110 + offsetY,
      pageX: 187 + offsetX,
      pageY: 110 + offsetY,
      event: new MouseEvent('mousedown', {
        clientX: 187 + offsetX,
        clientY: 110 + offsetY,
        pageX: 187 + offsetX,
        pageY: 110 + offsetY
      }, true, true)
    };
    slider._onMouseDown(mouseDownEv);

    let mouseMoveEv = {
      type: 'mousemove',
      clientX: 149 + offsetX,
      clientY: 110 + offsetY,
      pageX: 149 + offsetX,
      pageY: 110 + offsetY
    };
    slider._onCanvasMouseMove(mouseMoveEv);
    slider._onCanvasMouseUp();
    expect(slider.get('range')[0]).eql(0);
    expect(Math.floor(slider.get('range')[1])).eql(75);

    slider._onMouseDown(mouseDownEv);
    mouseMoveEv = {
      type: 'mousemove',
      clientX: 149 + offsetX,
      clientY: 110 + offsetY,
      pageX: 149 + offsetX,
      pageY: 110 + offsetY
    };
    slider._onCanvasMouseMove(mouseMoveEv);
    slider._onCanvasMouseUp();
    expect(slider.get('range')[0]).eql(0);
    expect(Math.floor(slider.get('range')[1])).eql(50);
  });

  it('水平渐变图例可筛选 拖动最小值滑块', function() {
    canvas.clear();
    const cfg = {
      items,
      container: canvas,
      layout: 'horizontal',
      title: {
        text: '这就是连续图例A的Title',
        fill: '#333',
        textBaseline: 'middle'
      },
      width: 150,
      height: 15,
      slidable: true
    };
    const legend = new Color(cfg);
    legend.move(10, 10);
    legend.draw();
    const slider = legend.get('slider');
    expect(slider).not.to.be.undefined;

    const currentTarget = slider.get('minHandleElement');
    const target = slider.get('minHandleElement');
    const elBBox = canvas.get('el').getBoundingClientRect();
    const legendBBox = legend.get('group').getBBox();
    const sliderBBox = slider.getBBox();
    const offsetX = elBBox.x + legendBBox.x + sliderBBox.x;
    const offsetY = elBBox.y + legendBBox.y + sliderBBox.y;

    const mouseDownEv = {
      target,
      currentTarget,
      tyoe: 'mousedown',
      bubbles: true,
      cancelable: true,
      clientX: 140 + offsetX,
      clientY: 110 + offsetY,
      pageX: 140 + offsetX,
      pageY: 110 + offsetY,
      event: new MouseEvent('mousedown', {
        clientX: 140 + offsetX,
        clientY: 110 + offsetY,
        pageX: 140 + offsetX,
        pageY: 110 + offsetY
      }, true, true)
    };
    slider._onMouseDown(mouseDownEv);

    const mouseMoveEv = {
      type: 'mousemove',
      clientX: 185 + offsetX,
      clientY: 110 + offsetY,
      pageX: 185 + offsetX,
      pageY: 110 + offsetY
    };
    slider._onCanvasMouseMove(mouseMoveEv);
    slider._onCanvasMouseUp();
    expect(Math.floor(slider.get('range')[0])).eql(30);
    expect(Math.floor(slider.get('range')[1])).eql(100);
  });

  it('垂直渐变图例可筛选 拖动中间', function() {
    canvas.clear();
    const cfg = {
      items,
      container: canvas,
      layout: 'vertical',
      title: {
        text: '这就是连续图例A的Title',
        fill: '#333',
        textBaseline: 'middle'
      },
      width: 15,
      height: 150,
      slidable: true
    };
    const legend = new Color(cfg);
    legend.move(10, 10);
    legend.draw();
    const slider = legend.get('slider');
    expect(slider).not.to.be.undefined;

    let currentTarget = slider.get('minHandleElement');
    let target = slider.get('minHandleElement');
    const elBBox = canvas.get('el').getBoundingClientRect();
    const legendBBox = legend.get('group').getBBox();
    const sliderBBox = slider.getBBox();
    const offsetX = elBBox.x + legendBBox.x + sliderBBox.x;
    const offsetY = elBBox.y + legendBBox.y + sliderBBox.y;

    let mouseDownEv = {
      target,
      currentTarget,
      tyoe: 'mousedown',
      bubbles: true,
      cancelable: true,
      clientX: 40 + offsetX,
      clientY: 240 + offsetY,
      pageX: 40 + offsetX,
      pageY: 240 + offsetY,
      event: new MouseEvent('mousedown', {
        clientX: 40 + offsetX,
        clientY: 240 + offsetY,
        pageX: 40 + offsetX,
        pageY: 240 + offsetY
      }, true, true)
    };
    slider._onMouseDown(mouseDownEv);

    let mouseMoveEv = {
      type: 'mousemove',
      clientX: 40 + offsetX,
      clientY: 195 + offsetY,
      pageX: 40 + offsetX,
      pageY: 195 + offsetY
    };
    slider._onCanvasMouseMove(mouseMoveEv);
    slider._onCanvasMouseUp();
    expect(Math.floor(slider.get('range')[0])).eql(30);
    expect(Math.floor(slider.get('range')[1])).eql(100);

    currentTarget = slider.get('middleHandleElement');
    target = slider.get('middleHandleElement');
    mouseDownEv = {
      target,
      currentTarget,
      tyoe: 'mousedown',
      bubbles: true,
      cancelable: true,
      clientX: 40 + offsetX,
      clientY: 150 + offsetY,
      pageX: 40 + offsetX,
      pageY: 150 + offsetY,
      event: new MouseEvent('mousedown', {
        clientX: 40 + offsetX,
        clientY: 150 + offsetY,
        pageX: 40 + offsetX,
        pageY: 150 + offsetY
      }, true, true)
    };
    slider._onMouseDown(mouseDownEv);
    mouseMoveEv = {
      type: 'mousemove',
      clientX: 40 + offsetX,
      clientY: 200 + offsetY,
      pageX: 40 + offsetX,
      pageY: 200 + offsetY
    };
    slider._onCanvasMouseMove(mouseMoveEv);
    slider._onCanvasMouseUp();
    expect(Math.floor(slider.get('range')[0])).eql(0);
    expect(Math.floor(slider.get('range')[1])).eql(70);
  });

  it('垂直渐变图例可筛选 拖出图例范围', function() {
    canvas.clear();
    const cfg = {
      items,
      container: canvas,
      layout: 'vertical',
      title: {
        text: '这就是连续图例A的Title',
        fill: '#333',
        textBaseline: 'middle'
      },
      width: 15,
      height: 150,
      slidable: true
    };
    const legend = new Color(cfg);
    legend.move(10, 10);
    legend.draw();
    const slider = legend.get('slider');
    expect(slider).not.to.be.undefined;

    const currentTarget = slider.get('middleHandleElement');
    const target = slider.get('middleHandleElement');
    const elBBox = canvas.get('el').getBoundingClientRect();
    const legendBBox = legend.get('group').getBBox();
    const sliderBBox = slider.getBBox();
    const offsetX = elBBox.x + legendBBox.x + sliderBBox.x;
    const offsetY = elBBox.y + legendBBox.y + sliderBBox.y;
    const mouseDownEv = {
      target,
      currentTarget,
      tyoe: 'mousedown',
      bubbles: true,
      cancelable: true,
      clientX: 40 + offsetX,
      clientY: 150 + offsetY,
      pageX: 40 + offsetX,
      pageY: 150 + offsetY,
      event: new MouseEvent('mousedown', {
        clientX: 40 + offsetX,
        clientY: 150 + offsetY,
        pageX: 40 + offsetX,
        pageY: 150 + offsetY
      }, true, true)
    };
    slider._onMouseDown(mouseDownEv);

    const mouseMoveEv = {
      type: 'mousemove',
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0
    };
    slider._onCanvasMouseMove(mouseMoveEv);
    slider._onCanvasMouseUp();
    expect(Math.floor(slider.get('range')[0])).eql(0);
    expect(Math.floor(slider.get('range')[1])).eql(100);
  });

  it('垂直渐变图例可筛选 最大最小滑块重合', function() {
    canvas.clear();
    const cfg = {
      items,
      container: canvas,
      layout: 'vertical',
      title: {
        text: '这就是连续图例A的Title',
        fill: '#333',
        textBaseline: 'middle'
      },
      width: 15,
      height: 150,
      slidable: true
    };
    const legend = new Color(cfg);
    legend.move(10, 10);
    legend.draw();
    const slider = legend.get('slider');
    expect(slider).not.to.be.undefined;

    const currentTarget = slider.get('maxHandleElement');
    const target = slider.get('maxHandleElement');
    const elBBox = canvas.get('el').getBoundingClientRect();
    const legendBBox = legend.get('group').getBBox();
    const sliderBBox = slider.getBBox();
    const offsetX = elBBox.x + legendBBox.x + sliderBBox.x;
    const offsetY = elBBox.y + legendBBox.y + sliderBBox.y;
    let mouseDownEv = {
      target,
      currentTarget,
      tyoe: 'mousedown',
      bubbles: true,
      cancelable: true,
      clientX: 40 + offsetX,
      clientY: 44 + offsetY,
      pageX: 40 + offsetX,
      pageY: 44 + offsetY,
      event: new MouseEvent('mousedown', {
        clientX: 40 + offsetX,
        clientY: 44 + offsetY,
        pageX: 40 + offsetX,
        pageY: 44 + offsetY
      }, true, true)
    };
    slider._onMouseDown(mouseDownEv);

    let mouseMoveEv = {
      type: 'mousemove',
      clientX: 40 + offsetX,
      clientY: 244 + offsetY,
      pageX: 40 + offsetX,
      pageY: 244 + offsetY
    };
    slider._onCanvasMouseMove(mouseMoveEv);
    slider._onCanvasMouseUp();
    expect(Math.floor(slider.get('range')[0])).eql(0);
    expect(Math.floor(slider.get('range')[1])).eql(0);

    mouseDownEv = {
      target,
      currentTarget,
      tyoe: 'mousedown',
      bubbles: true,
      cancelable: true,
      clientX: 40 + offsetX,
      clientY: 244 + offsetY,
      pageX: 40 + offsetX,
      pageY: 244 + offsetY,
      event: new MouseEvent('mousedown', {
        clientX: 40 + offsetX,
        clientY: 244 + offsetY,
        pageX: 40 + offsetX,
        pageY: 244 + offsetY
      }, true, true)
    };
    slider._onMouseDown(mouseDownEv);
    mouseMoveEv = {
      type: 'mousemove',
      clientX: 40 + offsetX,
      clientY: 195 + offsetY,
      pageX: 40 + offsetX,
      pageY: 195 + offsetY
    };
    slider._onCanvasMouseMove(mouseMoveEv);
    slider._onCanvasMouseUp();
    expect(Math.floor(slider.get('range')[0])).eql(32);
    expect(Math.floor(slider.get('range')[1])).eql(65);

    legend.destroy();
  });
});
