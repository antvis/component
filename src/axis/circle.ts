import { vec2 } from '@antv/matrix-util';
import { CircleAxisCfg, Point } from '../types';
import AxisBase from './base';

class Circle extends AxisBase<CircleAxisCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'circle',
      locationType: 'circle',
      center: null,
      radius: null,
      startAngle: -Math.PI / 2,
      endAngle: (Math.PI * 3) / 2,
    };
  }

  protected getLinePath(): any[] {
    const center = this.get('center');
    const x = center.x;
    const y = center.y;
    const rx = this.get('radius');
    const ry = rx;
    const startAngle = this.get('startAngle');
    const endAngle = this.get('endAngle');

    let path = [];
    if (Math.abs(endAngle - startAngle) === Math.PI * 2) {
      path = [['M', x, y - ry], ['A', rx, ry, 0, 1, 1, x, y + ry], ['A', rx, ry, 0, 1, 1, x, y - ry], ['Z']];
    } else {
      const startPoint = this.getCirclePoint(startAngle);
      const endPoint = this.getCirclePoint(endAngle);
      const large = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
      const sweep = startAngle > endAngle ? 0 : 1;
      path = [
        ['M', x, y],
        ['L', startPoint.x, startPoint.y],
        ['A', rx, ry, 0, large, sweep, endPoint.x, endPoint.y],
        ['L', x, y],
      ];
    }
    return path;
  }

  protected getTickPoint(tickValue): Point {
    const startAngle = this.get('startAngle');
    const endAngle = this.get('endAngle');
    const angle = startAngle + (endAngle - startAngle) * tickValue;
    return this.getCirclePoint(angle);
  }

  // 获取垂直于坐标轴的向量
  protected getSideVector(offset: number, point: Point) {
    const center = this.get('center');
    const vector: [ number, number ] = [point.x - center.x, point.y - center.y];
    const factor = this.get('verticalFactor');
    const vecLen = vec2.length(vector);
    vec2.scale(vector, vector, (factor * offset) / vecLen);
    return vector;
  }

  // 获取沿坐标轴方向的向量
  protected getAxisVector(point: Point): [number, number] {
    const center = this.get('center');
    const vector = [point.x - center.x, point.y - center.y];
    return [vector[1], -1 * vector[0]]; // 获取顺时针方向的向量
  }

  // 根据圆心和半径获取点
  private getCirclePoint(angle: number, radius?: number) {
    const center = this.get('center');
    radius = radius || this.get('radius');
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  }
}

export default Circle;
