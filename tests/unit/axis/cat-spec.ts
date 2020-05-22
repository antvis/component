import { Canvas } from '@antv/g-canvas';
import * as GUI from 'dat.gui';
import CategoryAxis from '../../../src/axis/category';
import { getMatrixByAngle } from '../../../src/util/matrix';

describe('category axis test', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cal';
  const canvas = new Canvas({
    container: 'cal',
    width: 500,
    height: 500,
  });
  const container = canvas.addGroup();

  it('auto wrap label', () => {
    const axisCfg = {
      label: {
        autoWrap: true,
        autoRotate: false,
        autoHide: false,
        offset: 10
      },
      verticalFactor: -1,
    };
    const axis = renderAxis(container, 140, false, axisCfg);
    const labelGroup = axis.getElementById('a-axis-label-group');
    const labels = labelGroup.getChildren();
    const reg = RegExp(/\n/g);
    expect(reg.test(labels[0].attr('text'))).toBe(true);
    axis.destroy();
  });

  it('auto ellipsis label', () => {
    const axisCfg = {
      label: {
        autoWrap: true,
        autoEllipsis: true,
        autoRotate: false,
        autoHide: false,
        offset: 10
      },
      verticalFactor: -1,
    };
    const axis = renderAxis(container, 100, false, axisCfg);
    const labelGroup = axis.getElementById('a-axis-label-group');
    const labels = labelGroup.getChildren();
    const reg = RegExp(/\u2026/g);
    expect(reg.test(labels[0].attr('text'))).toBe(true);
    axis.destroy();
  });

  it('autoRotate',()=>{
    const axisCfg = {
      label: {
        autoWrap: true,
        autoEllipsis: false,
        autoRotate: true,
        autoHide: false,
        offset: 10
      },
      verticalFactor: -1,
    };
    const axis = renderAxis(container, 100, false, axisCfg);
    axis.destroy();
  });

  it('default responsive order',()=>{
    const axisCfg = {
      label: {
        autoWrap: true,
        autoEllipsis: true,
        autoRotate: true,
        offset: 10
      },
      verticalFactor: -1,
    };
    const axis = renderAxis(container, 100, false, axisCfg);
    axis.destroy();
  });

  it('custom responsive order',()=>{
    const axisCfg = {
      label: {
        autoWrap: true,
        autoEllipsis: true,
        autoRotate: true,
        offset: 10
      },
      verticalFactor: -1,
      overlapOrder:['autoRotate','autoWrap','autoEllipsis']
    };
    const axis = renderAxis(container, 100, false, axisCfg);
    axis.destroy();
  });

  it.only('show',()=>{
    const guiContainer = document.createElement('div');
      guiContainer.style.width = '400';
      guiContainer.style.height = '400';
      guiContainer.style.position = 'absolute';
      guiContainer.style.left = '400px';
      guiContainer.style.top = '400px';
      dom.appendChild(guiContainer);
      const axisCfg = {
        label: {
          autoWrap: true,
          autoEllipsis: true,
          autoRotate: true,
          autoHide: false,
          offset: 10
        },
        isVertical: false,
        verticalFactor: -1,
        overlapOrder:['autoWrap','autoEllipsis','autoRotate']
      };
      let axis = renderAxis(container, 200, false, axisCfg);
      const guiCfg = {
        autoWrap: true,
        autoEllipsis: true,
        autoRotate: true,
        overlapOrder:['autoWrap', 'autoEllipsis', 'autoRotate'],
        axisLength: 200,
      };
      const gui = new GUI.gui.GUI({autoPlace: false});
      gui.add(guiCfg,'autoWrap',true);
      gui.add(guiCfg,'autoEllipsis',false);
      gui.add(guiCfg,'autoRotate',true); 
      gui.add(guiCfg,'overlapOrder',['autoWrap', 'autoEllipsis', 'autoRotate']);
      guiContainer.appendChild(gui.domElement);
      const sizeContrller = gui.add(guiCfg,'axisLength',20,200);
      sizeContrller.onFinishChange((value)=>{
        axis.destroy();
        axis = renderAxis(container, value, false, axisCfg);
      });
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
  const axis = new CategoryAxis({
    animate: false,
    id: 'a',
    container,
    updateAutoRender: true,
    start,
    end,
    ticks: [
      { name: 'athrun', value: 0 },
      { name: 'yzak', value: 0.2 },
      { name: 'shinn', value: 0.4 },
      { name: 'ray', value: 0.6 },
      { name: 'kira', value: 0.8 },
      { name: 'luna', value: 1.0 },
    ],
    ...cfg
  });
  axis.init();
  axis.render();
  return axis;
}