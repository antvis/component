import { Canvas } from '@antv/g-canvas';
import CircleAxis from '../../src/axis/circle';

describe('test line axis', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'ccl';
  const canvas = new Canvas({
    container: 'ccl',
    width: 500,
    height: 500,
  });

  const container = canvas.addGroup();
  const axis = new CircleAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    center: { x: 200, y: 200 },
    radius: 100,
    startAngle: 2.6179938779914944,
    endAngle: 6.806784082777886,
    verticalFactor: 1,
    verticalLimitLength: null,
    label: {
      autoRotate: false,
      autoHide: { type: "equidistance", cfg: { minGap: 6 } },
      autoEllipsis: false,
      offset: -12,
      offsetX: 0,
      offsetY: 0,
    },
    tickLine: {
      length: -12,
    },
    ticks:  [
      { name: "0", value: 0 },
      { name: "0.6", value: 0.6 },
      { name: "0.8", value: 0.8 },
      { name: "0.9", value: 0.9 },
      { name: "1", value: 1 },
    ],    
  });
  axis.init();
  axis.render();

  it('ticks counts equal to label counts', () => {
    const labelGroup = axis.getElementById('a-axis-label-group');
    expect(labelGroup.getChildren().length).toBe(5);
  });

  afterAll(() => {
    canvas.destroy();
    dom.parentNode.removeChild(dom);
  });
});
