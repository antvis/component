import { IGroup } from '@antv/g-base';
import { deepMix } from '@antv/util';
import { CategoryAxisCfg } from '../types';
import Line  from './line';

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
          overlapOrder: ['autoRotate', 'autoWrap', 'autoEllipsis', 'autoHide'],
        };
    }

    protected autoProcessOverlap(name: string, value: any, labelGroup: IGroup, limitLength: number) {
        super.autoProcessOverlap(name, value, labelGroup, limitLength);    
    }
}