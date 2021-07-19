import { clone, min, minBy, max, maxBy } from '@antv/util';
import type { Data } from './types';

/**
 * 获得数据的最值
 */
export function getRange(data: Data) {
  return [min(minBy(data, (arr) => min(arr))), max(maxBy(data, (arr) => max(arr)))];
}

/**
 * 数据转换为堆叠数据
 */
export function getStackedData(_: Data): Data {
  const data = clone(_);
  // 生成堆叠数据
  const datumLen = data[0].length;
  // 上一个堆叠的数据值，分别记录正负
  const [positivePrev, negativePrev] = [new Array(datumLen).fill(0), new Array(datumLen).fill(0)];
  for (let i = 0; i < data.length; i += 1) {
    const datum = data[i];
    for (let j = 0; j < datumLen; j += 1) {
      if (datum[j] >= 0) {
        datum[j] += positivePrev[j];
        positivePrev[j] = datum[j];
      } else {
        datum[j] += negativePrev[j];
        negativePrev[j] = datum[j];
      }
    }
  }
  return data;
}
