import * as pathUtil from '@antv/path-util';
import { Category, Linear } from '@antv/scale';
import * as _ from '@antv/util';

type Point = [number, number];

/**
 * 点数组转 path
 * @param points
 */
function pointsToPath(points: Point[]): any[][] {
  return _.map(points, (p: Point, idx: number) => {
    const command = idx === 0 ? 'M' : 'L';
    const [x, y] = p;
    return [command, x, y];
  });
}

/**
 * 将点连接成路径 path
 * @param points
 */
export function getLinePath(points: Point[]): any[][] {
  return pointsToPath(points);
}

/**
 * 将点连成平滑的曲线
 * @param points
 */
export function getSmoothLinePath(points: Point[]): any[][] {
  if (points.length <= 2) {
    // 两点以内直接绘制成路径
    return getLinePath(points);
  }

  const data = [];

  _.each(points, (p) => {
    // 当前点和上一个点一样的时候，忽略掉
    if (!_.isEqual(p, data.slice(data.length - 2))) {
      data.push(p[0], p[1]);
    }
  });

  // const constraint = [ // 范围
  //   [ 0, 0 ],
  //   [ 1, 1 ],
  // ];
  const path = pathUtil.catmullRom2Bezier(data, false);
  const [x, y] = _.head(points);
  path.unshift(['M', x, y]);

  return path;
}

/**
 * 将数据转成 path，利用 scale 的归一化能力
 * @param data
 * @param width
 * @param height
 * @param smooth
 */
export function dataToPath(data: number[], width: number, height: number, smooth: boolean = true): any[][] {
  // 利用 scale 来获取 y 上的映射
  const y = new Linear({
    values: data,
  });

  const x = new Category({
    values: _.map(data, (v, idx) => idx),
  });

  const points = _.map(data, (v: number, idx: number) => {
    return [x.scale(idx) * width, height - y.scale(v) * height] as [number, number];
  });

  return smooth ? getSmoothLinePath(points) : getLinePath(points);
}

/**
 * 线 path 转 area path
 * @param path
 * @param width
 * @param height
 */
export function linePathToAreaPath(path: any[][], width: number, height: number): any[][] {
  const areaPath = [...path];

  areaPath.push(['L', width, 0]);
  areaPath.push(['L', 0, height]);
  areaPath.push(['Z']);

  return areaPath;
}
