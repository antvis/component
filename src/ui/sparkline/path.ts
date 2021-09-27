import { vec2 } from '@antv/matrix-util';
import { clone, isEqual } from '@antv/util';
import type { PathCommand } from '@antv/g';
import type { Data, Line, Point, Scales } from './types';

type Position = Point;

function smoothBezier(points: Position[], smooth: number, isLoop: boolean, constraint: Position[]): Position[] {
  const cps: Point[] = [];
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
    for (let i = 0, l = points.length; i < l; i += 1) {
      const point = points[i];
      min = vec2.min([0, 0], min, point) as [number, number];
      max = vec2.max([0, 0], max, point) as [number, number];
    }
  }

  for (let i = 0, len = points.length; i < len; i += 1) {
    const point = points[i];
    if (i === 0 && !isLoop) {
      cp0 = point;
    } else if (i === len - 1 && !isLoop) {
      cp1 = point;
      cps.push(cp0!);
      cps.push(cp1);
    } else {
      // isLoop ? (i ? i - 1 : len - 1) : i - 1;
      const prevIdx = [i ? i - 1 : len - 1, i - 1][isLoop ? 0 : 1];
      prevPoint = points[prevIdx];
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
        cp1 = vec2.max([0, 0], cp1, min!) as Position;
        cp1 = vec2.min([0, 0], cp1, max!) as Position;
        nextCp0 = vec2.max([0, 0], nextCp0, min!) as Position;
        nextCp0 = vec2.min([0, 0], nextCp0, max!) as Position;
      }

      cps.push(cp0!);
      cps.push(cp1);
      cp0 = nextCp0;
    }
  }

  if (isLoop) {
    cps.push(cps.shift()!);
  }

  return cps;
}

function catmullRom2bezier(crp: number[], z: boolean, constraint: Position[]): PathCommand[] {
  console.log('new catmullRom2bezier');

  const isLoop = !!z;
  const pointList: Point[] = [];
  for (let i = 0, l = crp.length; i < l; i += 2) {
    pointList.push([crp[i], crp[i + 1]]);
  }

  const controlPointList = smoothBezier(pointList, 0.4, isLoop, constraint);
  const len = pointList.length;
  const d1: PathCommand[] = [];

  let cp1: Position;
  let cp2: Position;
  let p: Position;

  for (let i = 0; i < len - 1; i += 1) {
    cp1 = controlPointList[i * 2];
    cp2 = controlPointList[i * 2 + 1];
    p = pointList[i + 1];

    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
  }

  if (isLoop) {
    cp1 = controlPointList[len];
    cp2 = controlPointList[len + 1];
    [p] = pointList;

    d1.push(['C', cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]]);
  }
  return d1;
}

/**
 * 根据数据获得每条线各点x，y值
 */
export function dataToLines(data: Data, scales: Scales): Line[] {
  const { x, y } = scales;
  return data.map((points) => {
    const lines = points.map((val: number, idx: number) => {
      return [x.map(idx), y.map(val)] as Point;
    });
    return lines;
  });
}

/**
 * 根据线的点数据生成折线path
 */
export function lineToLinePath(line: Line, reverse = false) {
  const M = reverse ? line.length - 1 : 0;
  const linePath = line.map((point: Point, idx: number) => [idx === M ? 'M' : 'L', ...point]) as PathCommand[];
  return reverse ? linePath.reverse() : linePath;
}

/**
 * 根据点数据生成曲线path
 * @param points 点数据
 * @param reverse 是否倒序生成
 */
export function lineToCurvePath(line: Line, reverse = false) {
  if (line.length <= 2) {
    return lineToLinePath(line);
  }
  const data = [];
  const len = line.length;
  for (let idx = 0; idx < len; idx += 1) {
    const point = reverse ? line[len - idx - 1] : line[idx];
    if (!isEqual(point, data.slice(-2))) {
      data.push(...point);
    }
  }
  const path = catmullRom2bezier(data, false, [
    [0, 0],
    [1, 1],
  ]);
  if (reverse) {
    path.unshift(['M', ...line[len - 1]]);
  } else {
    path.unshift(['M', ...line[0]]);
  }
  return path as PathCommand[];
}

/**
 * 根据baseline将path闭合
 */
export function closePathByBaseLine(path: PathCommand[], width: number, baseline: number) {
  const closedPath = clone(path);
  closedPath.push(['L', width, baseline], ['L', 0, baseline], ['Z']);
  return closedPath;
}

/**
 * 将多条线的点数据生成区域path
 * 可以是折线或曲线
 */
export function linesToAreaPaths(lines: Line[], smooth: boolean, width: number, baseline: number) {
  return lines.map((line) => {
    return closePathByBaseLine(smooth ? lineToCurvePath(line) : lineToLinePath(line), width, baseline);
  });
}

/**
 * 生成折线堆叠区域封闭图形路径
 */
export function linesToStackAreaPaths(lines: Line[], width: number, baseline: number) {
  const paths: PathCommand[][] = [];
  for (let idx = lines.length - 1; idx >= 0; idx -= 1) {
    const currLine = lines[idx];
    const currCurvePath = lineToLinePath(currLine);
    let path: PathCommand[];
    if (idx === 0) {
      // 最底部的线直接与y=0连接成闭合区域
      path = closePathByBaseLine(currCurvePath, width, baseline);
    } else {
      // 计算下一根曲线的反向路径
      const belowLine = lines[idx - 1];
      const belowCurvePath = lineToLinePath(belowLine, true);
      belowCurvePath[0][0] = 'L';

      // 连接路径
      path = [...currCurvePath, ...belowCurvePath, ['Z']];
    }
    paths.push(path);
  }

  return paths;
}

/**
 * 生成曲线堆叠区域封闭图形路径
 */
export function linesToStackCurveAreaPaths(lines: Line[], width: number, baseline: number) {
  const paths: PathCommand[][] = [];
  for (let idx = lines.length - 1; idx >= 0; idx -= 1) {
    const currLine = lines[idx];
    const currCurvePath = lineToCurvePath(currLine);
    let path: PathCommand[];
    if (idx === 0) {
      // 最底部的线直接与y=0连接成闭合区域
      path = closePathByBaseLine(currCurvePath, width, baseline);
    } else {
      // 计算下一根曲线的反向路径
      const belowLine = lines[idx - 1];
      const belowCurvePath = lineToCurvePath(belowLine, true);

      /**
       * 将线条连接成闭合路径
       *  M C C C C C
       *  A ～ -> ～ B
       *  ⬆        ⬇
       *  D ～ <- ～ C
       *  C C C C C M
       *
       */
      const A = currLine[0];
      // const B = currLine[currLine.length - 1];
      // const C = belowLine[belowLine.length - 1];
      // const D = belowLine[0];

      // 将反向曲线开头 M X Y 改为 L X Y
      belowCurvePath[0][0] = 'L';
      // 连接路径
      path = [...currCurvePath, ...belowCurvePath, ['M', ...A], ['Z']];
    }
    paths.push(path);
  }
  return paths;
}
