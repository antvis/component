import { Canvas } from '@antv/g-canvas';
import * as AutoFormatUtil from '../../../src/axis/overlap/auto-format';

describe('test axis label auto format', () => {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    dom.id = 'car';
    const canvas = new Canvas({
      container: 'car',
      width: 500,
      height: 500,
    });
    const group = canvas.addGroup();
    const labels = ['333000', '534000', '50000', '9000', '345400'];
    renderLabels(labels,group);
    
    it('format text',()=>{
        const isFormatted = AutoFormatUtil.formatLabels(false,group,40,1000,'k');
        expect(isFormatted).toBe(true);
        const label = group.get('children')[0];
        expect(label.getBBox().width).toBeLessThanOrEqual(40);
        expect(label.attr('text')).toBe('333k');
    });

    it('not format text when space was enough',()=>{
      renderLabels(labels,group);
      const isFormatted = AutoFormatUtil.formatLabels(false,group,60,1000,'k');
      expect(isFormatted).toBe(false);
    });
});

function renderLabels(labels,group){
  group.clear();
  labels.forEach((label,index)=>{
    const x = 100 + 80 * index;
    const y = 100;
    group.addShape({
        type:'text',
        attrs:{
            x,
            y,
            text: label,
            fill:'black',
            textBaseline:'top'
        }
    });
});

}