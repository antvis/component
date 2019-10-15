
import { each } from '@antv/util';
import GridBase from './base';

class Line extends GridBase {

  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'line'
    }
  }

  protected getGridPath(points) {
    const path = [];
    each(points, (point, index) => {
      if (index === 0) {
        path.push([ 'M', point.x, point.y ]);
      } else {
        path.push([ 'L', point.x, point.y ]);
      }
    });
    return path;
  }
}

export default Line;