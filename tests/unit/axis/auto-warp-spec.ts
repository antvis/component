import { Canvas } from '@antv/g-canvas';
import * as AutoWrapUtil from '../../../src/axis/overlap/auto-wrap';

/**
 * 文本自动折行仅支持分类轴，且不允许在文本旋转的状态下折行
 */

describe('test axis label auto wrap', () => {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    dom.id = 'car';
    const canvas = new Canvas({
      container: 'car',
      width: 500,
      height: 500,
    });
    const group = canvas.addGroup();
    const labels = ['朕与将军解战袍', '芙蓉帐暖度春宵', '但使龙城飞将在', '从此君王', '不早朝'];
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
    
    it('wrap text',()=>{
        const isWrapped = AutoWrapUtil.wrapLabels(group,60);
        expect(isWrapped).toBe(true);
        const label = group.get('children')[0];
        expect(label.getBBox().width).toBeLessThanOrEqual(60);
        const warpLength = label.attr('text').split('\n').length;
        expect(warpLength).toBe(2);
    });
});