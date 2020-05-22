import { IElement, IGroup } from '@antv/g-base';
import { deepMix, each } from '@antv/util';
import { CategoryAxisCfg } from '../types';
import { getMatrixByAngle } from '../util/matrix';
import Line  from './line';
import { wrapLabels } from './overlap/auto-wrap';

export default class Category extends Line <CategoryAxisCfg> {
    public getDefaultCfg() {
        const cfg = super.getDefaultCfg();
        return {
          ...cfg,
          label:deepMix({},cfg.label,{
              autoEllipsis: false,
              autoEllipsisPosition: 'tail',
              autoWrap: false
          }),
          overlapOrder: ['autoWrap', 'autoRotate', 'autoEllipsis'],
        };
    }

    protected autoProcessOverlap(name: string, value: any, labelGroup: IGroup, limitLength: number) {
        if(name !== 'autoWrap'){
            if(name === 'autoRotate'){
                this.preAdjustAutoRotate(labelGroup);
            }
            super.autoProcessOverlap(name, value, labelGroup, limitLength);  
        } else if(value){
            const isVertical = this.get('isVertical');
            // 垂直坐标轴文本折行没有意义
            if(!isVertical){
                this.processAutoWrap(labelGroup,limitLength);
            }
        } 
    }

    private processAutoWrap(labelGroup: IGroup, limitLength: number){
        const labels = labelGroup.getChildren(); 
        // 无论之前是否操作过旋转，执行autoWrap之前都打平并居中 
        this.preAdjustAutoWrap(labels);
        wrapLabels(labelGroup,limitLength);
    }

    private preAdjustAutoWrap(labels: IElement[]){
        each(labels,(label)=>{
            const x = label.attr('x');
            const y = label.attr('y');
            const verticalFactor = this.get('verticalFactor');
            const matrix = getMatrixByAngle({ x, y }, 0);
            label.attr('matrix',matrix);
            label.attr('textAlign','center');
            const textBaseline = verticalFactor < 0 ? 'top' : 'bottom';
            label.attr('textBaseline',textBaseline);
        });
    }

    private preAdjustAutoRotate(labelGroup: IGroup){
        const labels = labelGroup.getChildren();
        each(labels,(label)=>{
            if(label.get('isWrapped')){
                const text = label.attr('text');
                const newText = text.replace(/\n/g,'');
                label.attr('text',newText);
            }
        });
    }
}