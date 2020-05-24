import { IGroup } from '@antv/g-base';
import { deepMix } from '@antv/util';
import { ValueAxisCfg } from '../types';
import Line  from './line';
import { formatLabels } from './overlap/auto-format';

export default class Value extends Line <ValueAxisCfg> {
    public getDefaultCfg() {
        const cfg = super.getDefaultCfg();
        return {
          ...cfg,
          label:deepMix({},cfg.label,{
              autoFormat: false,
              autoRotate:  false,
              autoHide: false,
              autoFormatUnit: 1000,
              autoFormatSuffix: 'k'
          }),
          overlapOrder: ['autoFormat','autoRotate','autoHide' ],
        };
    }

    protected autoProcessOverlap(name: string, value: any, labelGroup: IGroup, limitLength: number) {
        if(name === 'autoFormat' && value){
            const isVertical = this.get('isVertical');
            const labelCfg = this.get('label');
            const unit = labelCfg.autoFormatUnit;
            const suffix = labelCfg.autoFormatSuffix;
            formatLabels(isVertical,labelGroup,limitLength,unit,suffix);
        }else{
            super.autoProcessOverlap(name, value, labelGroup, limitLength);
        }
    }
};