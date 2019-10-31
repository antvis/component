import { vec2 } from '@antv/matrix-util';
import { ILocation } from '../intefaces';
import { LineAxisCfg, Point, Region, RegionLocationCfg } from '../types';
import AxisBase from './base';

class Line extends AxisBase<LineAxisCfg> implements ILocation<RegionLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'line',
      /**
       * 起始点, x, y
       * @type {object}
       */
      start: null,
      /**
       * 结束点, x, y
       * @type {object}
       */
      end: null,
    };
  }
  // 实现 IRegionLocation 获取位置的接口
  public getLocation(): Region {
    return {
      start: this.get('start') as Point,
      end: this.get('end') as Point,
    };
  }

  // 实现 IRegionLocation 设置位置的接口
  public setLocation(region: Region) {
    this.update({
      start: region.start,
      end: region.end,
    });
  }

  // 获取坐标轴线的 path
  public getLinePath(): any[] {
    const start = this.get('start');
    const end = this.get('end');
    const path = [];
    path.push(['M', start.x, start.y]);
    path.push(['L', end.x, end.y]);
    return path;
  }

  protected getTickPoint(tickValue: number): Point {
    const self = this;
    const start = self.get('start');
    const end = self.get('end');
    const regionX = end.x - start.x;
    const regionY = end.y - start.y;
    return {
      x: start.x + regionX * tickValue,
      y: start.y + regionY * tickValue,
    };
  }

  // 直线坐标轴下任一点的向量方向都相同
  protected getSideVector(offset: number) {
    const axisVector = this.getAxisVector();
    const normal = vec2.normalize([], axisVector);
    const factor = this.get('verticalFactor');
    const verticalVector = [normal[1], normal[0] * -1]; // 垂直方向，逆时针方向
    return vec2.scale([], verticalVector, offset * factor);
  }

  // 获取坐标轴的向量
  protected getAxisVector(): number[] {
    const start = this.get('start');
    const end = this.get('end');
    return [end.x - start.x, end.y - start.y];
  }
}

export default Line;
