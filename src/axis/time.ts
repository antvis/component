import { IGroup } from '@antv/g-base';
import { deepMix } from '@antv/util';
import { TimeAxisCfg } from '../types';
import Line  from './line';
import { ellipsisTime } from './overlap/auto-ellipsis-time';

export default class Time extends Line <TimeAxisCfg> {
    public getDefaultCfg() {
        const cfg = super.getDefaultCfg();
        return {
          ...cfg,
          label:deepMix({},cfg.label,{
              autoEllipsis: false,
              autoRotate: false,
              autoHide: false
          }),
          overlapOrder: ['autoEllipsis','autoRotate','autoHide' ],
        };
    }

    protected autoProcessOverlap(name: string, value: any, labelGroup: IGroup, limitLength: number) {
        if(name === 'autoEllipsis' && value){
            ellipsisTime(this.get('isVertical'),labelGroup,limitLength);
        }else{
            super.autoProcessOverlap(name, value, labelGroup, limitLength);
        }
    }
};