import { Canvas } from '@antv/g-canvas';
import ValueAxis from '../../../src/axis/value';
import { getAngleByMatrix } from '../../../src/util/matrix';

describe('value axis test',()=>{
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    dom.id = 'cal';
    const canvas = new Canvas({
      container: 'cal',
      width: 500,
      height: 500,
    });
    const container = canvas.addGroup();

    it('horizontal auto format',()=>{
        const axisCfg = {
            label:{
              autoFormat: true,
              autoRotate: true,
              autoFormatUnit: 1000,
              autoFormatSuffix: 'k'
            }
        };
        const axis = renderAxis(container, 200, false, axisCfg);
        const labelGroup = axis.getElementById('a-axis-label-group');
        const labels = labelGroup.getChildren();
        expect(labels[0].attr('text')).toBe('1k');
        axis.destroy();
    });


    it('vertical auto format',()=>{
        const axisCfg = {
            isVertical: true,
            verticalLimitLength: 50,
            label:{
              autoFormat: true,
              autoRotate: true,
              autoFormatUnit: 1000,
              autoFormatSuffix: 'k'
            }
        };
        const axis = renderAxis(container, 200, true, axisCfg);
        const labelGroup = axis.getElementById('a-axis-label-group');
        const labels = labelGroup.getChildren();
        expect(labels[0].attr('text')).toBe('1k');
        axis.destroy();
    });

    it('autoRotate',()=>{
        const axisCfg = {
            label:{
              autoFormat: true,
              autoRotate: true,
              autoFormatUnit: 1000,
              autoFormatSuffix: 'k'
            },
            verticalFactor: -1,
        };
        const axis = renderAxis(container, 100, false, axisCfg);
        const labelGroup = axis.getElementById('a-axis-label-group');
        const labels = labelGroup.getChildren();
        const rotateAngle = getAngleByMatrix(labels[0].attr('matrix'));
        expect(rotateAngle).toBeGreaterThan(0);
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
    const axis = new ValueAxis({
      animate: false,
      id: 'a',
      container,
      updateAutoRender: true,
      start,
      end,
      ticks: [
        { name: '1000', value: 0 },
        { name: '20000', value: 0.2 },
        { name: '300444', value: 0.4 },
        { name: '5000000', value: 0.6 },
        { name: '6000000', value: 0.8 },
        { name: '7000000', value: 1.0 },
      ],
      ...cfg
    });
    axis.init();
    axis.render();
    return axis;
  }