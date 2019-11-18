import { ILocation } from '../interfaces';
import { LineCrosshairCfg, Point, RegionLocationCfg } from '../types';
import { distance, getValueByPercent } from '../util/util';
import CrosshairBase from './base';

class LineCrosshair extends CrosshairBase<LineCrosshairCfg> implements ILocation<RegionLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'line',
      locationType: 'region',
      start: null,
      end: null,
    };
  }

  // 直线的文本需要同直线垂直
  protected getRotateAngle(): number {
    const { start, end } = this.getLocation();
    const { position } = this.get('text');
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const tangentAngle = position === 'start' ? angle - Math.PI / 2 : angle + Math.PI / 2;
    return tangentAngle;
  }

  protected getTextPoint(): Point {
    const { start, end } = this.getLocation();
    const text = this.get('text');
    const { position, offset } = text;
    const lineLength = distance(start, end);
    const offsetPercent = offset / lineLength; // 计算间距同线的比例，用于计算最终的位置
    let percent = 0;
    if (position === 'start') {
      percent = 0 - offsetPercent;
    } else if (position === 'end') {
      percent = 1 + offsetPercent;
    }
    return {
      x: getValueByPercent(start.x, end.x, percent),
      y: getValueByPercent(start.y, end.y, percent),
    };
  }

  protected getLinePath(): any[] {
    const { start, end } = this.getLocation();
    return [
      ['M', start.x, start.y],
      ['L', end.x, end.y],
    ];
  }
}

export default LineCrosshair;
