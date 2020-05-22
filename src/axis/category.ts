import { IGroup } from '@antv/g-base';
import { deepMix } from '@antv/util';
import { CategoryAxisCfg } from '../types';
import Line  from './line';
import { wrapLabels } from './overlap/auto-wrap';

export default class Category extends Line <CategoryAxisCfg> {
    public getDefaultCfg() {
        const cfg = super.getDefaultCfg();
        return {
          ...cfg,
          label:deepMix({},cfg.label,{
              autoEllipsis: true,
              autoEllipsisPosition: 'tail',
              autoWrap: false
          }),
          overlapOrder: ['autoWrap', 'autoEllipsis','autoRotate', ],
        };
    }

    protected autoProcessOverlap(name: string, value: any, labelGroup: IGroup, limitLength: number) {
        if(name !== 'autoWrap'){
            super.autoProcessOverlap(name, value, labelGroup, limitLength);  
        } else if(value){
            const isVertical = this.get('isVertical');
            // 垂直坐标轴文本折行没有意义
            if(!isVertical){
                wrapLabels(labelGroup,limitLength, this.get('verticalFactor'));
            }
        } 
    }
}