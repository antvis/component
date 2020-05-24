import { Canvas } from '@antv/g-canvas';
import TimeAxis from '../../../src/axis/time';
import { getAngleByMatrix } from '../../../src/util/matrix';

describe('time axis test', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cal';
  const canvas = new Canvas({
    container: 'cal',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();

  it('auto ellipis label - show month and date', () => {
    const axisCfg = {
      label: {
        autoEllipsis: true,
        autoRotate: true,
        autoHide: false,
        offset: 10,
        style:{
            textBaseline:'top'
        }
      },
      verticalFactor: -1,
    };
    const axis = renderAxis(container, 400, false, axisCfg);
    const labelGroup = axis.getElementById('a-axis-label-group');
    const labels = labelGroup.getChildren();
    expect(labels[1].attr('text')).toBe('08-02');
    axis.destroy();
  });

  it('auto ellipis label - show date', () => {
    const axisCfg = {
      label: {
        autoEllipsis: true,
        autoRotate: false,
        autoHide: false,
        offset: 10,
        style:{
            textBaseline:'top'
        }
      },
      verticalFactor: -1,
    };
    const axis = renderAxis(container, 200, false, axisCfg);
    const labelGroup = axis.getElementById('a-axis-label-group');
    const labels = labelGroup.getChildren();
    expect(labels[1].attr('text')).toBe('02');
    axis.destroy();
  });

  it('axis auto rotate',()=>{
    const axisCfg = {
        label: {
          autoEllipsis: true,
          autoRotate: true,
          autoHide: false,
          offset: 10,
          style:{
              textBaseline:'top'
          }
        },
        verticalFactor: -1,
      };
      const axis = renderAxis(container, 200, false, axisCfg);
      const labelGroup = axis.getElementById('a-axis-label-group');
      const labels = labelGroup.getChildren();
      const matrix = labels[0].attr('matrix');
      const angle = getAngleByMatrix(matrix);
      expect(angle).toBeGreaterThan(0);
      axis.destroy();
  });

  it('axis auto hide',()=>{
    const axisCfg = {
        label: {
          autoEllipsis: false,
          autoRotate: false,
          autoHide: true,
          offset: 10,
          style:{
              textBaseline:'top'
          }
        },
        verticalFactor: -1,
      };
      const axis = renderAxis(container, 200, false, axisCfg);
      const labelGroup = axis.getElementById('a-axis-label-group');
      const labels = labelGroup.getChildren();
      expect(labels.length).toBeLessThan(6);
      axis.destroy();
  });

});

function renderAxis(container, length, isVertical, cfg) {
  let start;
  let end;
  if (isVertical) {
    start = { x: 50, y: 50 + length };
    end = { x: 50, y: 50 };
  } else {
    start = { x: 50, y: 50 };
    end = { x: 50 + length, y: 50 };
  }
  const axis = new TimeAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    start,
    end,
    ticks: [
      { name: '2018-08-01', value: 0 },
      { name: '2018-08-02', value: 0.2 },
      { name: '2018-08-03', value: 0.4 },
      { name: '2018-08-04', value: 0.6 },
      { name: '2018-08-05', value: 0.8 },
      { name: '2018-08-06', value: 1.0 },
    ],
    ...cfg
  });
  axis.init();
  axis.render();
  return axis;
}