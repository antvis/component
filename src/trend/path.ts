import { vec2 } from '@antv/matrix-util';
import { Category, Linear } from '@antv/scale';
import { each, head, isEqual, map } from '@antv/util';

import type {PathCommand} from '@antv/g-base'

type Point = [number, number];
type Position = Point;

function smoothBezier(points: Position[], smooth: number, isLoop: boolean, constraint: Position[]): Position[] {
  const cps = [];
  const hasConstraint = !!constraint;

  let prevPoint: Position;
  let nextPoint: Position;
  let min: Position;
  let max: Position;
  let nextCp0: Position;
  let cp1: Position;
  let cp0: Position;

  if (hasConstraint) {
    [min, max] = constraint;
    for (let i = 0, l = points.length; i < l; i++) {
      const point = points[i];
      min = vec2.min([0, 0], min, point) as [number, number];
      max = vec2.max([0, 0], max, point) as [number, number];
    }
  }

  for (let i = 0, len = points.length; i < len; i++) {
    const point = points[i];
    if (i === 0 && !isLoop) {
      cp0 = point;
    } else if (i === len - 1 && !isLoop) {
      cp1 = point;
      cps.push(cp0);
      cps.push(cp1);
    } else {
      prevPoint = points[isLoop ? (i ? i - 1 : len - 1) : i - 1];
      nextPoint = points[isLoop ? (i + 1) % len : i + 1];

      let v: [number, number] = [0, 0];
      v = vec2.sub(v, nextPoint, prevPoint) as [number, number];
      v = vec2.scale(v, v, smooth) as [number, number];

      let d0 = vec2.distance(point, prevPoint);
      let d1 = vec2.distance(point, nextPoint);

      const sum = d0 + d1;
      if (sum !== 0) {
        d0 /= sum;
        d1 /= sum;
      }

      let v1 = vec2.scale([0, 0], v, -d0);
      let v2 = vec2.scale([0, 0], v, d1);

      cp1 = vec2.add([0, 0], point, v1) as Position;
      nextCp0 = vec2.add([0, 0], point, v2) as Position;

      // 下一个控制点必须在这个点和下一个点之间
      nextCp0 = vec2.min([0, 0], nextCp0, vec2.max([0, 0], nextPoint, point)) as Position;
      nextCp0 = vec2.max([0, 0], nextCp0, vec2.min([0, 0], nextPoint, point)) as Position;

      // 重新计算 cp1 的值
      v1 = vec2.sub([0, 0], nextCp0, point);
      v1 = vec2.scale([0, 0], v1, -d0 / d1);
      cp1 = vec2.add([0, 0], point, v1) as Position;

      // 上一个控制点必须要在上一个点和这一个点之间
      cp1 = vec2.min([0, 0], cp1, vec2.max([0, 0], prevPoint, point)) as Position;
      cp1 = vec2.max([0, 0], cp1, vec2.min([0, 0], prevPoint, point)) as Position;

      // 重新计算 nextCp0 的值
      v2 = vec2.sub([0, 0], point, cp1);
      v2 = vec2.scale([0, 0], v2, d1 / d0);
      nextCp0 = vec2.add([0, 0], point, v2) as Position;

      if (hasConstraint) {
        cp1 = vec2.max([0, 0], cp1, min) as Position;
        cp1 = vec2.min([0, 0], cp1, max) as Position;
        nextCp0 = vec2.max([0, 0], nextCp0, min) as Position;
        nextCp0 = vec2.min([0, 0], nextCp0, max) as Position;
      }

      cps.push(cp0);
      cps.push(cp1);
      cp0 = nextCp0;
    }
  }

  if (isLoop) {
    cps.push(cps.shift());
  }

  return cps;
}

function catmullRom2bezier(crp: number[], z: boolean, constraint: Position[]): PathCommand[] {
  const isLoop = !!z;
  const pointList = [];
  for (let i = 0, l = crp.length; i < l; i += 2) {
    pointList.push([crp[i], crp[i + 1]]);
  }

  const controlPointList = smoothBezier(pointList, 0.4, isLoop, constraint);
  const len = pointList.length;
  const d1 = [];

  let cp1: Position;
  let cp2: Position;
  let p: Position;

  for (let i = 0; i < len - 1; i++) {
    cp1 = controlPointList[i * 2];
    cp2 = controlPointList[i * 2 + 1];
    p = pointList[i + 1];

    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
  }

  if (isLoop) {
    cp1 = controlPointList[len];
    cp2 = controlPointList[len + 1];
    p = pointList[0];

    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
  }
  return d1;
}

/**
 * 点数组转 path
 * @param points
 */
function pointsToPath(points: Point[]): any[][] {
  return map(points, (p: Point, idx: number) => {
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

  each(points, (p) => {
    // 当前点和上一个点一样的时候，忽略掉
    if (!isEqual(p, data.slice(data.length - 2))) {
      data.push(p[0], p[1]);
    }
  });

  // const constraint = [ // 范围
  //   [ 0, 0 ],
  //   [ 1, 1 ],
  // ];
  const path = catmullRom2bezier(data, false, [[0,0], [1,1]]);
  const [x, y] = head(points);
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
    values: map(data, (v, idx) => idx),
  });

  const points = map(data, (v: number, idx: number) => {
    return [x.scale(idx) * width, height - y.scale(v) * height] as [number, number];
  });

  return smooth ? getSmoothLinePath(points) : getLinePath(points);
}

/**
 * 获得 area 面积的横向连接线的 px 位置
 * @param data
 * @param width
 * @param height
 */
export function getAreaLineY(data: number[], height: number): number {
  const y = new Linear({
    values: data,
  });

  const lineY = Math.max(0, y.min);
  return height - y.scale(lineY) * height;
}

/**
 * 线 path 转 area path
 * @param path
 * @param width
 * @param height
 */
export function linePathToAreaPath(path: any[][], width: number, height: number, data: number[]): any[][] {
  const areaPath = [...path];

  const lineYPx = getAreaLineY(data, height);

  areaPath.push(['L', width, lineYPx]);
  areaPath.push(['L', 0, lineYPx]);
  areaPath.push(['Z']);

  return areaPath;
}
