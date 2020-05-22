import { Canvas } from '@antv/g-canvas';
import CategoryAxis from '../../../src/axis/category';

describe('category axis test',()=>{
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    dom.id = 'cal';
    const canvas = new Canvas({
      container: 'cal',
      width: 500,
      height: 500,
    });
    const container = canvas.addGroup();

    it('auto wrap label',()=>{
        const axisCfg = {
            label:{
                autoWrap: true,
                autoRotate: false,
                autoHide: false,
                offset: 10
            },
            verticalFactor: -1,
        };
        const axis = renderAxis(container, 200, false, axisCfg);

    });
    
});

function renderAxis(container, length, isVertical, cfg){
    let start;
    let end;
    if(isVertical){
        start = { x: 50, y: 50+length };
        end = { x: 50, y: 50};
    }else{
        start = { x: 50, y: 50};
        end = { x: 50+length, y: 50};
    }
    const axis = new CategoryAxis({
        animate: false,
        id: 'a',
        container,
        updateAutoRender: true,
        start,
        end,
        ticks: [
          { name: '1000', value: 0 },
          { name: '2000', value: 0.2 },
          { name: '3000', value: 0.4 },
          { name: '4000', value: 0.6 },
          { name: '5000', value: 0.8 },
          { name: '5000', value: 1.0 },
        ],
        ...cfg
      });
      axis.init();
      axis.render();
      return axis;
}