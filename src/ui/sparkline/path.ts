import { clone, isEqual } from '@antv/util';
import { Linear, Band } from '@antv/scale';
import { catmullRom2Bezier } from '@antv/path-util';
import { PathCommand } from '@antv/g-base';

export type Point = [number, number];
export type Line = Point[];
export type Data = number[][];
export type Scales = {
  y: Linear;
} & (
  | {
      type: 'line';
      x: Linear;
    }
  | {
      type: 'column';
      x: Band;
    }
);

/**
 * 数据转换为堆叠数据
 */
export function getStackedData(data: Data) {
  // 生成堆叠数据
  for (let i = 1; i < data.length; i += 1) {
    const datum = data[i];
    for (let j = 0; j < datum.length; j += 1) {
      datum[j] += data[i - 1][j];
    }
  }
  return data;
}

/**
 * 根据数据获得每条线各点x，y值
 */
export function dataToLines(data: Data, scales: Scales) {
  const { x, y } = scales;
  return data.map((points) => {
    const _ = points.map((val: number, idx: number) => {
      return [x.map(idx), y.map(val)] as Point;
    });
    return _;
  });
}

/**
 * 根据线的点数据生成折线path
 */
export function lineToLinePath(line: Line, reverse = false) {
  const _ = line.map((point: Point, idx: number) => [idx === 0 ? 'M' : 'L', ...point]) as PathCommand[];
  return reverse ? _.reverse() : _;
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
  const path = catmullRom2Bezier(data, false);
  if (reverse) {
    path.push(['M', ...line[0]], ['M', 0, 0]);
  } else {
    path.unshift(['M', 0, 0], ['M', ...line[0]]);
  }
  return path as PathCommand[];
}

/**
 * 根据baseline将path闭合
 */
function closePathByBaseLine(path: PathCommand[], width: number, baseline: number) {
  const _ = clone(path);
  _.push(['L', width, baseline], ['L', 0, baseline], ['Z']);
  return _;
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
      belowCurvePath[belowCurvePath.length - 1][0] = 'L';

      // 连接路径
      path = [...currCurvePath, ...belowCurvePath, ['Z']];
    }
    paths.push(path);
  }

  return paths;
}

/**
 * 将多条线数据生成区域堆积图
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
      // TODO: shift 是为了移除 M 0 0标记
      belowCurvePath.pop();
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
      // belowCurvePath[0][0] = 'L';
      // 连接路径
      path = [...currCurvePath, ...belowCurvePath, ['M', ...A], ['Z']];
    }
    paths.push(path);
  }
  return paths;
}
