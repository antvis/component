import { Linear } from '@antv/scale';
import {
  Scales,
  dataToLines,
  lineToLinePath,
  lineToCurvePath,
  linesToAreaPaths,
  closePathByBaseLine,
  linesToStackAreaPaths,
  linesToStackCurveAreaPaths,
} from '../../../../src/ui/sparkline/path';

const _ = (d) => {
  return d.map((command) => {
    return command.slice(-1)[0];
  });
};

const data = [
  [1, 2, 3, 4, 5],
  [2, 4, 5, 1, 7],
];

const scales = {
  type: 'line',
  x: new Linear({
    domain: [0, 9],
    range: [0, 9],
  }),
  y: new Linear({
    domain: [0, 9],
    range: [0, 9],
  }),
} as Scales;

const lines = dataToLines(data, scales);

describe('path', () => {
  test('dataToLines', async () => {
    const linesT = lines.map((line) => {
      return line.map((val) => val[1]);
    });

    expect(linesT).toStrictEqual(data);
  });

  test('lineToLinePath', async () => {
    const path = lineToLinePath(lines[0]);
    const pathReverse = lineToLinePath(lines[0], true);

    expect(path).toStrictEqual([
      ['M', 0, 1],
      ['L', 1, 2],
      ['L', 2, 3],
      ['L', 3, 4],
      ['L', 4, 5],
    ]);

    expect(pathReverse).toStrictEqual([
      ['M', 4, 5],
      ['L', 3, 4],
      ['L', 2, 3],
      ['L', 1, 2],
      ['L', 0, 1],
    ]);
  });

  test('lineToCurvePath', async () => {
    const path = lineToCurvePath(lines[0]);
    const pathReverse = lineToCurvePath(lines[0], true);
    expect(_(path)).toStrictEqual([0, 1, 2, 3, 4, 5]);
    expect(_(pathReverse)).toStrictEqual([5, 4, 3, 2, 1]);
  });

  test('closePathByBaseLine', async () => {
    const line = lineToCurvePath(lines[0]);
    const curve = lineToCurvePath(lines[0]);
    const closedLine = closePathByBaseLine(line, 5, 0);
    const closedCurve = closePathByBaseLine(curve, 5, 0);
    expect(closedLine.slice(-3)).toStrictEqual([['L', 5, 0], ['L', 0, 0], ['Z']]);
    expect(closedCurve.slice(-3)).toStrictEqual([['L', 5, 0], ['L', 0, 0], ['Z']]);
  });

  test('linesToAreaPaths', async () => {
    const areaPaths = linesToAreaPaths(lines, false, 5, 0);
    const smoothAreaPaths = linesToAreaPaths(lines, true, 5, 0);
    expect(areaPaths[0].slice(-2)[0]).toStrictEqual(['L', 0, 0]);
    expect(smoothAreaPaths[0].slice(-2)[0]).toStrictEqual(['L', 0, 0]);
  });

  test('linesToStackAreaPaths', async () => {
    const linePath = linesToStackAreaPaths(lines, 5, 0);
    expect(_(linePath[0])).toStrictEqual([2, 4, 5, 1, 7, 5, 4, 3, 2, 1, 'Z']);
    expect(_(linePath[1])).toStrictEqual([1, 2, 3, 4, 5, 0, 0, 'Z']);
  });

  test('linesToStackCurveAreaPaths', async () => {
    const curvePaths = linesToStackCurveAreaPaths(lines, 5, 0);
    console.log(curvePaths);
    // 开头多了一个M 0 0
    expect(_(curvePaths[0])).toStrictEqual([0, 2, 4, 5, 1, 7, 5, 4, 3, 2, 1, 2, 'Z']);
    expect(_(curvePaths[1])).toStrictEqual([0, 1, 2, 3, 4, 5, 0, 0, 'Z']);
  });
});
