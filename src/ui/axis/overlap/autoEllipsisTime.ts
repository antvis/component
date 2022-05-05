import { Text } from '@antv/g';
import { minBy, maxBy, measureTextWidth } from '@antv/util';
import { Font } from '@antv/util/lib/measure-text-width';
import { getTimeScale, TimeScale, formatTime, getMask, getTimeStart, scale as timeScale, getFont } from '../../../util';
import { COMMON_TIME_MAP } from '../constant';

function getTimeMask(commonTimeMask: TimeScale[], date: Date, width: number, font?: Font) {
  let mask: TimeScale[] = [];
  // 选择关键节点mask
  const [, minUnit] = commonTimeMask;
  const idx = timeScale.indexOf(minUnit);
  for (let i = 0; i <= idx; i += 1) {
    const scheme = [timeScale[i], minUnit] as [TimeScale, TimeScale];
    if (measureTextWidth(formatTime(date, getMask(scheme)), font) < width) {
      mask = scheme;
      break;
    }
  }
  return mask as [TimeScale, TimeScale];
}

/**
 * 时间缩略
 */
export function getTimeSimplifyStrategy(labels: Text[], width: number) {
  // @ts-ignore
  const ticks: any[] = labels.map((d, idx) => [d.id, { text: d.style.text, value: d.style.tip || d.style.text, idx }]);
  const ticksMap: Map<string, { value: string; text: string; idx: number }> = new Map(ticks);

  const { text: startTime } = minBy(ticks, ([id, { value }]) => new Date(value).getTime());
  const { text: endTime } = maxBy(ticks, ([id, { value }]) => new Date(value).getTime());
  const scale = getTimeScale(startTime, endTime);
  /**
   * 以下定义了时间显示的规则
   * keyTimeMap 为关键节点的时间显示，第一个时间、每scale时间，关键节点不受width限制，但最小单位与非关键节点一致
   * 例如2021-01-01 - 2022-12-31 中的关键时间节点为2021-01-01, 2022-01-01
   * commonTimeMap 为非关键节点的显示，在空间充足的情况下会优先显示信息更多(靠前)的选项
   * 如在空间充足的情况下，2021-01-01 - 2022-12-31 会显示为：2021-01-01 2021-01-02 ... 形势
   * 空间略微不足时：2021-01-01 01-02 01-03 ... 2022-01-01 01-02 ...
   * 空间较为不足时：2021-01 02 ... 2022-01 02 ...
   */

  const baseTime = new Date('1970-01-01 00:00:00');
  const font = getFont(labels[0]);

  /**
   * 非关键节点mask
   */
  let commonTimeMask!: [TimeScale, TimeScale];
  for (let idx = 0; idx < COMMON_TIME_MAP[scale].length; idx += 1) {
    const scheme = COMMON_TIME_MAP[scale][idx] as [TimeScale, TimeScale];
    if (measureTextWidth(formatTime(baseTime, getMask(scheme)), font) < width) {
      commonTimeMask = scheme;
      break;
    }
    // 最后一个是备选方案
    commonTimeMask = scheme;
  }

  return (text: string, label: Text) => {
    const idx = ticksMap.get(label.id)!.idx;

    // 第一个时间，不做格式化
    if (idx === 0) return text;

    const prevText = ticks[idx - 1]?.[1].text;
    const date = new Date(text);
    let mask = commonTimeMask;
    if (getTimeStart(new Date(prevText), scale) !== getTimeStart(date, scale)) {
      mask = getTimeMask(commonTimeMask, date, width, font);
    }
    return formatTime(date, getMask(mask));
  };
}
