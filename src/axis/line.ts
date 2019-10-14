import {vec2} from '@antv/matrix-util';
import {mix} from '@antv/util';
import {IRangeLocation} from '../intefaces';
import AxisBase from './base';

class Line extends AxisBase implements IRangeLocation {
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
  // 实现 IRangeLocation 获取位置的接口
  public getLocationRange() {
    return {
      start: this.get('start'),
      end: this.get('end')
    }
  }

  // 实现 IRangeLocation 设置位置的接口
  public setLocationRange(range) {
    this.update({
      start: range.start,
      end: range.end
    });
  }

  // 获取坐标轴线的 path
  public getLinePath() {
    const start = this.get('start');
    const end = this.get('end');
    const path = [];
    path.push([ 'M', start.x, start.y ]);
    path.push([ 'L', end.x, end.y ]);
    return path;
  }

  protected getTickPoint(tickValue) {
    const self = this;
    const start = self.get('start');
    const end = self.get('end');
    const rangeX = end.x - start.x;
    const rangeY = end.y - start.y;
    return {
      x: start.x + rangeX * tickValue,
      y: start.y + rangeY * tickValue
    };
  }

  // 直线坐标轴下任一点的向量方向都相同
  protected getSideVector(offset) {
    const axisVector = this.getAxisVector();
    const normal = vec2.normalize([], axisVector);
    const factor = this.get('verticalFactor');
    const verticalVector = [normal[1], normal[0]  * -1]; // 垂直方向，逆时针方向
    return vec2.scale([], verticalVector, offset * factor);
  }

  // 获取坐标轴的向量
  protected getAxisVector() {
    const start = this.get('start');
    const end = this.get('end');
    return [ end.x - start.x, end.y - start.y ];
  }
}

export default Line;